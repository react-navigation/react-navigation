import pathToRegexp from 'path-to-regexp';
import NavigationActions from '../NavigationActions';
const queryString = require('query-string');

function isEmpty(obj) {
  if (!obj) return true;
  for (let key in obj) {
    return false;
  }
  return true;
}

export const urlToPathAndParams = (url, uriPrefix) => {
  const searchMatch = url.match(/^(.*)\?(.*)$/);
  const params = searchMatch ? queryString.parse(searchMatch[2]) : {};
  const urlWithoutSearch = searchMatch ? searchMatch[1] : url;
  const delimiter = uriPrefix || '://';
  let path = urlWithoutSearch.split(delimiter)[1];
  if (path === undefined) {
    path = urlWithoutSearch;
  }
  if (path === '/') {
    path = '';
  }
  if (path[path.length - 1] === '/') {
    path = path.slice(0, -1);
  }
  return {
    path,
    params,
  };
};

export const createPathParser = (
  childRouters,
  routeConfigs,
  pathConfigs = {},
  initialRouteName,
  initialRouteParams
) => {
  const pathsByRouteNames = {};
  let paths = [];

  // Build paths for each route
  Object.keys(childRouters).forEach(routeName => {
    let pathPattern = pathConfigs[routeName] || routeConfigs[routeName].path;
    let matchExact = !!pathPattern && !childRouters[routeName];
    if (pathPattern === undefined) {
      pathPattern = routeName;
    }
    const keys = [];
    let re, toPath, priority;
    if (typeof pathPattern === 'string') {
      // pathPattern may be either a string or a regexp object according to path-to-regexp docs.
      re = pathToRegexp(pathPattern, keys);
      toPath = pathToRegexp.compile(pathPattern);
      priority = 0;
    } else if (pathPattern === null) {
      // for wildcard match
      re = pathToRegexp('*', keys);
      toPath = () => '';
      matchExact = true;
      priority = -1;
    }
    if (!matchExact) {
      const wildcardRe = pathToRegexp(`${pathPattern}/*`, keys);
      re = new RegExp(`(?:${re.source})|(?:${wildcardRe.source})`);
    }
    pathsByRouteNames[routeName] = { re, keys, toPath, priority, pathPattern };
  });

  paths = Object.entries(pathsByRouteNames);
  paths.sort((a, b) => b[1].priority - a[1].priority);

  const getActionForPathAndParams = (pathToResolve, inputParams = {}) => {
    // If the path is empty (null or empty string)
    // just return the initial route action
    if (!pathToResolve) {
      return NavigationActions.navigate({
        routeName: initialRouteName,
        params: { ...inputParams, ...initialRouteParams },
      });
    }

    // Attempt to match `pathToResolve` with a route in this router's
    // routeConfigs
    let matchedRouteName;
    let pathMatch;
    let pathMatchKeys;

    // eslint-disable-next-line no-restricted-syntax
    for (const [routeName, path] of paths) {
      const { re, keys } = path;
      pathMatch = re.exec(pathToResolve);
      if (pathMatch && pathMatch.length) {
        pathMatchKeys = keys;
        matchedRouteName = routeName;
        break;
      }
    }

    // We didn't match -- return null to signify no action available
    if (!matchedRouteName) {
      return null;
    }

    // Determine nested actions:
    // If our matched route for this router is a child router,
    // get the action for the path AFTER the matched path for this
    // router
    let nestedAction;
    if (childRouters[matchedRouteName]) {
      nestedAction = childRouters[matchedRouteName].getActionForPathAndParams(
        pathMatch.slice(pathMatchKeys.length).join('/'),
        inputParams
      );
      if (!nestedAction) {
        return null;
      }
    }

    const params = pathMatch.slice(1).reduce(
      // iterate over matched path params
      (paramsOut, matchResult, i) => {
        const key = pathMatchKeys[i];
        if (!key || key.asterisk) {
          return paramsOut;
        }
        const paramName = key.name;

        let decodedMatchResult;
        try {
          decodedMatchResult = decodeURIComponent(matchResult);
        } catch (e) {
          // ignore `URIError: malformed URI`
        }

        paramsOut[paramName] = decodedMatchResult || matchResult;
        return paramsOut;
      },
      {
        // start with the input(query string) params, which will get overridden by path params
        ...inputParams,
      }
    );

    return NavigationActions.navigate({
      routeName: matchedRouteName,
      ...(params ? { params } : {}),
      ...(nestedAction ? { action: nestedAction } : {}),
    });
  };
  const getPathAndParamsForRoute = route => {
    const { routeName, params } = route;
    const childRouter = childRouters[routeName];
    const subPath = pathsByRouteNames[routeName].toPath(params);
    if (childRouter) {
      // If it has a router it's a navigator.
      // If it doesn't have router it's an ordinary React component.
      const child = childRouter.getPathAndParamsForState(route);
      return {
        path: subPath ? `${subPath}/${child.path}` : child.path,
        params: child.params ? { ...params, ...child.params } : params,
      };
    }
    return {
      path: subPath,
      params,
    };
  };
  return { getActionForPathAndParams, getPathAndParamsForRoute };
};
