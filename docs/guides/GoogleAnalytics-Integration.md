## Integration with GoogleAnalytics

This example shows how to use a middleware to track navigation between screens and send to Google Analytics. The approach is generic, should work with any mobile analytics SDK.
The code is originally from [exnavigtation repo](https://github.com/exponent/ex-navigation), only adapted slightly.

### Create middleware

```
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

const tracker = new GoogleAnalyticsTracker(GA_TRACKING_ID);

// gets the current screen from navigation state
function getCurrentScreen(getStateFn) {
  const navigationState = getStateFn().nav;
  if (!navigationState) { return null; }
  return navigationState.routes[navigationState.index].routeName;
}

const screenTracking = ({ getState }) => next => (action) => {
  if (action.type !== 'Navigate' && action.type !== 'Back') return next(action);

  const currentScreen = getCurrentScreen(getState);
  const result = next(action);
  const nextScreen = getCurrentScreen(getState);
  if (nextScreen !== currentScreen) {
    console.log('tracking middleware: ', nextScreen);
    tracker.trackScreenView(nextScreen);
  }
  return result;
};

export default screenTracking;

```

### Create Redux store and apply the above middleware
```
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
