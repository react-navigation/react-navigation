import { PassThrough } from 'node:stream';

import {
  ServerContainer,
  type ServerContainerRef,
} from '@react-navigation/native/server';
import {
  getServerResourceDescriptors,
  registerStaticFont,
  resetServerContext,
} from 'expo-font/build/server';
import * as React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { AppRegistry } from 'react-native-web';

import { fonts } from './App';

type RenderResult = { stream: PassThrough } | { redirect: URL };

export function render(location: URL) {
  resetServerContext();

  for (const [family, source] of Object.entries(fonts)) {
    registerStaticFont(family, source);
  }

  const { element, getStyleElement } = AppRegistry.getApplication('main');

  const ref = React.createRef<ServerContainerRef>();

  return new Promise<RenderResult>((resolve, reject) => {
    const stream = new PassThrough();

    const { pipe, abort } = renderToPipeableStream(
      <>
        {getServerResourceDescriptors().map((resource) => {
          switch (resource.type) {
            case 'style':
              return (
                <style
                  href="expo-fonts"
                  id={resource.id}
                  key={resource.id}
                  precedence="default"
                >
                  {resource.css}
                </style>
              );
            case 'link': {
              const { type: _, ...props } = resource;

              return <link key={props.href} {...props} />;
            }
            default:
              throw new Error(`Unknown resource: ${resource}`);
          }
        })}
        {getStyleElement()}
        <ServerContainer ref={ref} location={location}>
          {element}
        </ServerContainer>
      </>,
      {
        onShellReady() {
          const redirect = ref.current?.getRedirect();

          if (redirect) {
            abort();
            resolve({ redirect });
            return;
          }

          pipe(stream);
          resolve({ stream });
        },
        onError(error) {
          console.error(error);
        },
        onShellError(error) {
          abort();
          reject(error);
        },
      }
    );

    stream.on('error', abort);
    stream.on('close', () => {
      if (!stream.writableFinished) {
        abort();
      }
    });
  });
}
