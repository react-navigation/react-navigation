import { PassThrough } from 'node:stream';

import { ServerContainer } from '@react-navigation/native/server';
import {
  getServerResourceDescriptors,
  registerStaticFont,
  resetServerContext,
} from 'expo-font/build/server';
import { renderToPipeableStream } from 'react-dom/server';
import { AppRegistry } from 'react-native-web';

import { fonts } from './App';

export function render(location: URL) {
  resetServerContext();

  for (const [family, source] of Object.entries(fonts)) {
    registerStaticFont(family, source);
  }

  const { element, getStyleElement } = AppRegistry.getApplication('main');

  return new Promise<PassThrough>((resolve, reject) => {
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
        <ServerContainer location={location}>{element}</ServerContainer>
      </>,
      {
        onShellReady() {
          pipe(stream);
          resolve(stream);
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
