/* eslint-disable require-atomic-updates */

import './resolve-hooks';
import './env';

import process from 'node:process';
import { PassThrough } from 'node:stream';

import { ServerContainer } from '@react-navigation/native/server';
import Koa from 'koa';
import * as React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { AppRegistry } from 'react-native-web';

import { App } from '../src/index';

AppRegistry.registerComponent('App', () => App);

const PORT = process.env.PORT || 3275;

const app = new Koa();

type DocumentProps = {
  children: React.ReactNode;
  styles: React.ReactNode;
};

function Document({ children, styles }: DocumentProps) {
  return (
    <html style={{ height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1.00001, viewport-fit=cover"
        />
        {styles}
      </head>
      <body style={{ minHeight: '100%' }}>
        <div id="root" style={{ display: 'flex', minHeight: '100svh' }}>
          {children}
        </div>
      </body>
    </html>
  );
}

const render = (element: React.ReactNode) => {
  return new Promise<PassThrough>((resolve, reject) => {
    const stream = new PassThrough();

    let isShellReady = false;
    let isFinished = false;

    const { pipe, abort } = renderToPipeableStream(element, {
      onShellReady() {
        isShellReady = true;

        stream.write('<!DOCTYPE html>');

        pipe(stream);
        resolve(stream);
      },
      onError(e) {
        if (isShellReady) {
          console.error(e);
        } else {
          abort();
          reject(e);
        }
      },
      onShellError(e) {
        abort();
        reject(e);
      },
    });

    stream.on('error', abort);
    stream.on('finish', () => {
      isFinished = true;
    });
    stream.on('close', () => {
      if (!isFinished) {
        abort();
      }
    });
  });
};

app.use(async (ctx) => {
  const { element, getStyleElement } = AppRegistry.getApplication('App');

  const url = new URL(ctx.href);

  const body = await render(
    <Document styles={getStyleElement()}>
      <ServerContainer location={url}>{element}</ServerContainer>
    </Document>
  );

  ctx.status = 200;
  ctx.type = 'text/html';
  ctx.body = body;
});

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
