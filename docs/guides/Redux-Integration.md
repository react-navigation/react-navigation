# Redux Integration

To handle your app's navigation state in redux, you can pass your own `navigation` prop to a navigator. Your navigation prop must provide the current state, as well as access to a dispatcher to handle navigation options.

With redux, your app's state is defined by a reducer. Each navigation router effectively has a reducer, called `getStateForAction`. The following is a minimal example of how you might use navigators within a redux application:

```
const AppNavigator = StackNavigator(AppRouteConfigs);

const appReducer = combineReducers({
  nav: (state, action) => (
    AppNavigator.router.getStateForAction(action, state)
  ),
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

Now, your navigation state is stored with redux, and you can fire navigation actions using redux.

When a navigator is given a `navigation` prop, it relinquishes control of the state. So you are now responsible for persisting state, handling deep linking, integrating the back button, etc.

When you are nesting navigators, the navigation state is automatically passed down as long as a navigator is attached as a screen. For example:

```js
StackNavigator({
  Home: { screen: TabNavigator },
});
```

When you attach `StackNavigator` to Redux, `TabNavigator` automatically gets attached and you don't have to attach it separately.
