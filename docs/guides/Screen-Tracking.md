## Screen tracking and analytics

This example shows how to do screen tracking and send to Google Analytics. The approach can be adapted to any other mobile analytics SDK. 

### Use componentDidUpdate hook

`componentDidUpdate` has access the previous and current navigation state and its a good place to do screen tracking.

```js
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

const tracker = new GoogleAnalyticsTracker(GA_TRACKING_ID);

const screenName = (navState) => {
  return navState ? navState.routes[navState.index].routeName : void 0;
};

const AppNavigator = StackNavigator(AppRouteConfigs);

AppNavigator.prototype.componentDidUpdate = function(prevProps, prevState) {
  const currScreen = screenName(this.state.nav);
  const prevScreen = screenName(prevState.nav);
  if (!!currScreen && currScreen != prevScreen) {
    // the line below uses the Google Analytics tracker
    // change the tracker here to use other Mobile analytics SDK.
    tracker.trackScreenView(currScreen);
  }
}
```

### Use Redux

When using Redux, `screenTracking` can be written as a Redux middleware.

```js
import { NavigationActions } from 'react-navigation';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

const tracker = new GoogleAnalyticsTracker(GA_TRACKING_ID);

// gets the current screen from navigation state
function getCurrentScreen(getStateFn) {
  const navigationState = getStateFn().nav;
  if (!navigationState) { return null; }
  return navigationState.routes[navigationState.index].routeName;
}

const screenTracking = ({ getState }) => next => (action) => {
  if (action.type !== NavigationActions.NAVIGATE && action.type !== NavigationActions.BACK)) return next(action);

  const currentScreen = getCurrentScreen(getState);
  const result = next(action);
  const nextScreen = getCurrentScreen(getState);
  if (nextScreen !== currentScreen) {
    // the line below uses the Google Analytics tracker
    // change the tracker here to use other Mobile analytics SDK.
    tracker.trackScreenView(nextScreen);
  }
  return result;
};

export default screenTracking;
```

### Create Redux store and apply the above middleware

The `screenTracking` middleware can be applied to the store during its creation. See [Redux Integration](Redux-Integration.md) for details.

```js
const store = createStore(
  combineReducers({
    nav: navReducer,
    ...
  }),
  applyMiddleware(
    screenTracking,
    ...
    ),
);
```
