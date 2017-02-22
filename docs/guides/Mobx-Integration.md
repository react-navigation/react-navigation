# Mobx Integration

Handling your app's navigation state in mobx, is similar to redux. You can pass your own navigation prop to a navigator. Your navigation prop must provide the current state, as well as access to a dispatcher to handle navigation options.

With mobx, your app's state is defined by observable attributes. But react-navigation expects a dispatcher function, to trigger the state changes on our nav state observable:

```
const AppNavigator = StackNavigator(AppRouteConfigs);

class GlobalStore {
  @observable.ref navigationState = {
    index: 0,
    routes: [
      { key: "R1", routeName: "RouteOne" },
    ],
  };

  @autobind
  @action
  dispatchNavigation(action, stackState = true) {
    const previousNavState = stackState ? this.navigationState : null;
    return this.navigationState = AppNavigator.router.getStateForAction(action, previousNavState);
  }
}
const globalStore = new GlobalStore();


@inject(stores => ({ globalStore: stores.globalStore }))
@observer
class AppWithNavigationState extends React.Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.globalStore.dispatchNavigation,
        state: this.props.globalStore.navigationState,
      })} />
    );
  }
}

class App extends React.Component {
  public render() {
    return (
      <Provider {...stores} >
        <AppWithNavigationState />
      </Provider>
    );
  }
}
```

And you an also dispatch a navigation action from any component, e.g.:
```
<Button
  onPress={() => this.props.globalStore.dispatchNavigation(
    NavigationActions.navigate({ routeName: "RouteOne" }),
  )}
  title="To Route One"
/>
```

Once you do this, your navigation state is stored within your mobx store, at which point you can fire navigation actions using the dispatchNavigation function.

Keep in mind that when a navigator is given a `navigation` prop, it relinquishes control of its internal state. That means you are now responsible for persisting its state, handling any deep linking, integrating the back button, etc.

Navigation state is automatically passed down from one navigator to another when you nest them. Note that in order for a child navigator to receive the state from a parent navigator, it should be defined as a `screen`.

Applying this to the example above, you could instead define `AppNavigator` to contain a nested `TabNavigator` as follows:

```js
const AppNavigator = StackNavigator({
  Home: { screen: MyTabNavigator },
});
```

In this case, once you `inject` and `observe` `AppNavigator` using Mobx as is done in `AppWithNavigationState`, `MyTabNavigator` will automatically have access to navigation state as a `navigation` prop.
