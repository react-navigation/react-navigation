import './resolve-hooks';

import Koa from 'koa';
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AppRegistry } from 'react-native-web';
import { ServerContainer, ServerContainerRef } from '@react-navigation/native';
import App from '../src/index';

AppRegistry.registerComponent('App', () => App);

const PORT = process.env.PORT || 3275;

const app = new Koa();

app.use(async (ctx) => {
  const { element, getStyleElement } = AppRegistry.getApplication('App');

  const ref = React.createRef<ServerContainerRef>();

  const html = ReactDOMServer.renderToString(
    <ServerContainer
      ref={ref}
      location={{ pathname: ctx.path, search: ctx.search }}
    >
      {element}
    </ServerContainer>
  );

  const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

  const document = `
    <!DOCTYPE html>
    <html style="height: 100%">
    <meta charset="utf-8">
    <meta httpEquiv="X-UA-Compatible" content="IE=edge">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1.00001, viewport-fit=cover"
    >
    ${css}
    <title>${ref.current?.getCurrentOptions()?.title}</title>
    <body style="min-height: 100%">
    <div id="root" style="display: flex; min-height: 100vh">
    ${html}
    </div>
`;

  ctx.body = document;
});

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
