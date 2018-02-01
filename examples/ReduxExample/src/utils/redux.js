import {
  constructReactNavigationReduxMiddleware,
  constructReduxBoundAddListener,
} from 'react-navigation';

const middleware = constructReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);
const addListener = constructReduxBoundAddListener("root");

export {
  middleware,
  addListener,
};
