# Redux Integration

To handle your app's navigation state in redux, you can pass your own `navigation` prop to a navigator. Your navigation prop must provide the current state, as well as access to a dispatcher to handle navigation options.

With redux, your app's state is defined by a reducer. Each navigation router effectively has a reducer, called `getStateForAction`. The following is a minimal example of how you might use navigators within a redux application:

```
import { addNavigationHelpers } from 'react-navigation';

const AppNavigator = StackNavigator(AppRouteConfigs);

const navReducer = (state, action) => {
  const newState = AppNavigator.router.getStateForAction(action, state);
  return (newState ? newState : state)
};

const appReducer = combineReducers({
  nav: navReducer,
  ...
});

@connect(state => ({
  nav: state.nav,
}))
class AppWithNavigationState extends React.Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })} />
    );
  }
}

const store = createStore(appReducer);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
```

Once you do this, your navigation state is stored within your redux store, at which point you can fire navigation actions using your redux dispatch function.

Keep in mind that when a navigator is given a `navigation` prop, it relinquishes control of its internal state. That means you are now responsible for persisting its state, handling any deep linking, integrating the back button, etc.

Navigation state is automatically passed down from one navigator to another when you nest them. Note that in order for a child navigator to receive the state from a parent navigator, it should be defined as a `screen`.

Applying this to the example above, you could instead define `AppNavigator` to contain a nested `TabNavigator` as follows:

```js
const AppNavigator = StackNavigator({
  Home: { screen: MyTabNavigator },
});
```

In this case, once you `connect` `AppNavigator` to Redux as is done in `AppWithNavigationState`, `MyTabNavigator` will automatically have access to navigation state as a `navigation` prop.

## Mocking tests

To make jest tests work with your react-navigation app, you need to change the jest preset in the `package.json`, see [here](https://facebook.github.io/jest/docs/tutorial-react-native.html#transformignorepatterns-customization):

```
"jest": {
  "preset": "react-native",
  "transformIgnorePatterns": [
    "node_modules/(?!(jest-)?react-native|react-navigation)"
  ]
}
```
