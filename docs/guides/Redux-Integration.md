# Redux Integration

### Overview For Redux Integration
1. To handle your app's navigation state in Redux, you can pass your own `navigation` prop to a navigator.

2. Once you pass your own navigation prop to the navigator, the default [`navigation`](https://reactnavigation.org/docs/navigators/navigation-prop) prop gets destroyed. You must construct your own `navigation` prop with [`state`](https://reactnavigation.org/docs/navigators/navigation-prop#state-The-screen's-current-stateroute), [`dispatch`](https://reactnavigation.org/docs/navigators/navigation-prop#dispatch-Send-an-action-to-the-router), and `addListener` properties.

3. The `state` will be fed from the reducer assigned to handle navigation state and the `dispatch` will be Redux's default `dispatch`. Thus you will be able to dispatch normal redux actions using `this.props.navigation.dispatch(ACTION)`, reducer will update the navigation state on the basis of dispatched action, the new navigation state will then be passed to the navigator.

4. A middleware is needed so that any events that mutate the navigation state properly trigger the event listeners.

### Details Regarding Redux Integration
First, you need to add the `react-navigation-redux-helpers` package to your project.

  ```bash
  yarn add react-navigation-redux-helpers
  ```

  or

  ```bash
  npm install --save react-navigation-redux-helpers
  ```

With Redux, your app's state is defined by a reducer. Each navigation router effectively has a reducer, called `getStateForAction`. The following is a minimal example of how you might use navigators within a Redux application:

```es6
import {
  StackNavigator,
  addNavigationHelpers,
} from 'react-navigation';
import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { Provider, connect } from 'react-redux';
import React from 'react';

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

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);
const addListener = createReduxBoundAddListener("root");

class App extends React.Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
        addListener,
      })} />
    );
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);

const store = createStore(
  appReducer,
  applyMiddleware(middleware),
);

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

Once you do this, your navigation state is stored within your Redux store, at which point you can fire navigation actions using your Redux dispatch function.

Keep in mind that when a navigator is given a `navigation` prop, it relinquishes control of its internal state. That means you are now responsible for persisting its state, handling any deep linking, [Handling the Hardware Back Button in Android](#Handling-the-Hardware-Back-Button-in-Android), etc.

Navigation state is automatically passed down from one navigator to another when you nest them. Note that in order for a child navigator to receive the state from a parent navigator, it should be defined as a `screen`.

Applying this to the example above, you could instead define `AppNavigator` to contain a nested `TabNavigator` as follows:

```es6
const AppNavigator = StackNavigator({
  Home: { screen: MyTabNavigator },
});
```

In this case, once you `connect` `AppNavigator` to Redux as is done in `AppWithNavigationState`, `MyTabNavigator` will automatically have access to navigation state as a `navigation` prop.

## Full example

There's a working example app with Redux [here](https://github.com/react-community/react-navigation/tree/master/examples/ReduxExample) if you want to try it out yourself.

## Mocking tests

To make jest tests work with your react-navigation app, you need to change the jest preset in the `package.json`, see [here](https://facebook.github.io/jest/docs/tutorial-react-native.html#transformignorepatterns-customization):


```json
"jest": {
  "preset": "react-native",
  "transformIgnorePatterns": [
    "node_modules/(?!(jest-)?react-native|react-navigation)"
  ]
}
```

## Handling the Hardware Back Button in Android

By using the following snippet, your nav component will be aware of the back button press actions and will correctly interact with your stack. This is really useful on Android.

```es6
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
      state: nav,
      addListener,
    });

    return <AppNavigation navigation={navigation} />;
  }
}
```
