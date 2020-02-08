import { parseUrl, stringify } from 'query-string';

type ActionType = 'PUSH' | 'POP' | 'REPLACE';

export const current: {
  path: string;
  routes: any[];
  browserBackButtonEmitted: boolean;
} = {
  path: window.location.pathname,
  routes: [],
  browserBackButtonEmitted: false,
};

export const matchPathAndParams = (path: string, otherPath: string) => {
  const a = parseUrl(path);
  const b = parseUrl(otherPath);

  return a.url === b.url && stringify(a.query) === stringify(b.query);
};

export function getActionTypeFromPath(prevPath: string, path: string) {
  const prevRoutes = prevPath.split('/');
  const routes = path.split('/');

  return getStateActionType(prevRoutes.length, routes.length);
}

export function getStateActionType(
  prevRoutesLength: number,
  routesLength: number
) {
  if (prevRoutesLength < routesLength) {
    return 'PUSH';
  } else if (prevRoutesLength > routesLength) {
    return 'POP';
  }

  return 'REPLACE';
}

export const setPathToHistory = (
  actionType: ActionType,
  pathAndParams: string
) => {
  if (actionType === 'PUSH') {
    const prevPath = current.path === '/' ? '' : current.path;
    const newPath = prevPath + pathAndParams;
    window.history.pushState({}, '', newPath);
  } else if (actionType === 'POP') {
    window.history.back();
  } else {
    window.history.replaceState({}, '', pathAndParams);
  }
};
