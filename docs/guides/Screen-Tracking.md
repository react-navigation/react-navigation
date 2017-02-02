## Screen tracking and analytics

This example shows how to use a middleware to track navigation between screens and send to Google Analytics. The approach is generic, should work with any mobile analytics SDK.

### Create middleware
`screenTracking` is a Redux middleware that gets called during navigation action. It sends the trasnsition to Google Analytics when the app transitions, i.e. previousScreen !== currentScreen, to a new screen.  

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
