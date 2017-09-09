# Redux Integration

To handle your app's navigation state in redux, you can pass your own `navigation` prop to a navigator. Your navigation prop must provide the current state, as well as access to a dispatcher to handle navigation options.

With redux, your app's state is defined by a reducer. Each navigation router effectively has a reducer, called `getStateForAction`. The following is a minimal example of how you might use navigators within a redux application:

```js
import { addNavigationHelpers } from 'react-navigation';

const AppNavigator = StackNavigator(AppRouteConfigs);

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Login'));

const navReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

const appReducer = combineReducers({
  nav: navReducer,
  ...
});

class App extends React.Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })} />
    );
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);

const store = createStore(appReducer);

class Root extends React.Component {
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

Keep in mind that when a navigator is given a `navigation` prop, it relinquishes control of its internal state. That means you are now responsible for persisting its state, handling any deep linking, [Handling the Hardware Back Button in Android](#handling-the-hardware-back-button-in-android), etc.

Navigation state is automatically passed down from one navigator to another when you nest them. Note that in order for a child navigator to receive the state from a parent navigator, it should be defined as a `screen`.

Applying this to the example above, you could instead define `AppNavigator` to contain a nested `TabNavigator` as follows:

```js
const AppNavigator = StackNavigator({
  Home: { screen: MyTabNavigator },
});
```

In this case, once you `connect` `AppNavigator` to Redux as is done in `AppWithNavigationState`, `MyTabNavigator` will automatically have access to navigation state as a `navigation` prop.

## Full example

There's a working example app with redux [here](https://github.com/react-community/react-navigation/tree/master/examples/ReduxExample) if you want to try it out yourself.

## Mocking tests

To make jest tests work with your react-navigation app, you need to change the jest preset in the `package.json`, see [here](https://facebook.github.io/jest/docs/tutorial-react-native.html#transformignorepatterns-customization):

```JSON
"jest": {
  "preset": "react-native",
  "transformIgnorePatterns": [
    "node_modules/(?!(jest-)?react-native|react-navigation)"
  ]
}
```

## Handling the Hardware Back Button in Android

By using the following snippet, your nav component will be aware of the back button press actions and will correctly interact with your stack. This is really useful on Android.

```js
import React from "react";
import { BackHandler } from "react-native";
import { addNavigationHelpers, NavigationActions } from "react-navigation";

const AppNavigation = TabNavigator(
  {
    Home: { screen: HomeScreen },
    Settings: { screen: SettingScreen }
  }
);

class ReduxNavigation extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: nav
    });

    return <AppNavigation navigation={navigation} />;
  }
}
