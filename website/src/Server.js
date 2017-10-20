const path = require('path');
const express = require('express');
const fs = require('fs');
const React = require('react');
const PropTypes = require('prop-types');
const join = require('path').join;
const basicAuth = require('basic-auth-connect');
const server = require('express');
const ReactDOMServer = require('react-dom/server');

import App from './App';

import { NavigationActions, addNavigationHelpers } from 'react-navigation';

class ServerApp extends React.Component {
  static childContextTypes = {
    getURIForAction: PropTypes.func.isRequired,
    getActionForPathAndParams: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };
  getChildContext() {
    return {
      dispatch: this.props.navigation.dispatch,
      getURIForAction: action => {
        const state = App.router.getStateForAction(action);
        let { path } = App.router.getPathAndParamsForState(state);
        return `/${path}`;
      },
      getActionForPathAndParams: App.router.getActionForPathAndParams,
    };
  }
  render() {
    return <App navigation={this.props.navigation} />;
  }
}

const indexHtml = fs.readFileSync(join(__dirname, '../public/index.html'), {
  encoding: 'utf8',
});

function AppHandler(req, res) {
  let status = 200;
  const path = req.url.substr(1);
  let initAction = App.router.getActionForPathAndParams(path);
  if (!initAction) {
    initAction = NavigationActions.navigate({
      routeName: 'NotFound',
      params: { path },
    });
    status = 404;
  }
  const topNavigation = addNavigationHelpers({
    state: App.router.getStateForAction(initAction),
    dispatch: action => false,
  });
  const screenNavigation = addNavigationHelpers({
    state: topNavigation.state.routes[topNavigation.state.index],
    dispatch: topNavigation.dispatch,
  });

  const Component = App.router.getComponentForState(topNavigation.state);
  const { title } = App.router.getScreenOptions(screenNavigation, {});
  const app = <ServerApp navigation={topNavigation} />;
  const body = ReactDOMServer.renderToString(app);
  let html = indexHtml;
  html = html
    .split('<div id="root"></div>')
    .join(`<div id="root">${body}</div>`);
  if (title) {
    html = html.split('<title></title>').join(`<title>${title}</title>`);
  }
  res.status(status).send(html);
}

const app = express();
app.use(function(req, res, next) {
  var str = 'www.';

  if (req.host.indexOf(str) === 0) {
    res.redirect(
      301,
      req.protocol + '://' + req.host.slice(str.length) + req.originalUrl
    );
  } else {
    next();
  }
});
app.get('/', AppHandler);
app.use(express.static(join(__dirname, '../public')));
app.get('*', AppHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Started on ${PORT}!`);
});
