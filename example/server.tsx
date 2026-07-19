import { PassThrough } from 'node:stream';

import { ServerContainer } from '@react-navigation/native/server';
import { getServerResourceDescriptors } from 'expo-font/build/server';
import { renderToPipeableStream } from 'react-dom/server';
import { AppRegistry } from 'react-native-web';

import { loadFonts } from './App';

await loadFonts();

export function render(location: URL) {
  return new Promise<PassThrough>((resolve, reject) => {
    const stream = new PassThrough();
    const { element, getStyleElement } = AppRegistry.getApplication('main');
    const fontResources = getServerResourceDescriptors().map((resource) => {
      if (resource.type === 'style') {
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
      }

      return <link key={resource.href} {...resource} />;
    });

    const { pipe, abort } = renderToPipeableStream(
      <>
        {fontResources}
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
