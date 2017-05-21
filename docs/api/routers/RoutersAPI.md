## Custom Router API

You can make your own router by building an object with the following functions:

```js
const MyRouter = {
  getStateForAction: (action, state) => ({}),
  getActionForPathAndParams: (path, params) => null,
  getPathAndParamsForState: (state) => null,
  getComponentForState: (state) => MyScreen,
  getComponentForRouteName: (routeName) => MyScreen,
};

// Now, you can make a navigator by putting the router on it:
class MyNavigator extends React.Component {
  static router = MyRouter;
  render() {
    ...
  }
}
```

![Routers manage the relationship between URIs, actions, and navigation state](/assets/routers-concept-map.png)


### `getStateForAction(action, state)`

Defines the navigation state in response to a given action. This function will be run when an action gets passed into `props.navigation.dispatch(`, or when any of the helper functions are called, like `navigation.navigate(`.

Typically this should return a navigation state, with the following form:

```
{
  index: 1, // identifies which route in the routes array is active
  routes: [
    {
      // Each route needs a name to identify the type.
      routeName: 'MyRouteName',

      // A unique identifier for this route in the routes array:
      key: 'myroute-123',
      // (used to specify the re-ordering of routes)

      // Routes can have any data, as long as key and routeName are correct
      ...randomRouteData,
    },
    ...moreRoutes,
  ]
}
```

If the router has handled the action externally, or wants to swallow it without changing the navigation state, this function will return `null`.

### `getComponentForRouteName(routeName)`

Returns the child component or navigator for the given route name.

Say a router `getStateForAction` outputs a state like this:
```js
{
  index: 1,
  routes: [
    { key: 'A', routeName: 'Foo' },
    { key: 'B', routeName: 'Bar' },
  ],
}
```

Based on the routeNames in the state, the router is responsible for returning valid components when calling `router.getComponentForRouteName('Foo')` or `router.getComponentForRouteName('Bar')`.

### `getComponentForState(state)`

Returns the active component for a deep navigation state.

### `getActionForPathAndParams(path, params)`

Returns an optional navigation action that should be used when the user navigates to this path and provides optional query parameters.

### `getPathAndParamsForState(state)`

Returns the path and params that can be put into the URL to link the user back to the same spot in the app.

The path/params that are output from this should form an action when passed back into the router's `getActionForPathAndParams`. That action should take you to a similar state once passed through `getStateForAction`.

### `getScreenOptions(navigation, screenProps)`

Used to retrieve the navigation options for a screen. Must provide the screen's current navigation prop and optionally, other props that your navigation options may need to consume.

- `navigation` - This is the navigation prop that the screen will use, where the state refers to the screen's route/state. Dispatch will trigger actions in the context of that screen.
- `screenProps` - Other props that your navigation options may need to consume
- `navigationOptions` - The previous set of options that are default or provided by the previous configurer

Inside an example view, perhaps you need to fetch the configured title:
```js
// First, prepare a navigation prop for your child, or re-use one if already available.
const screenNavigation = addNavigationHelpers({
  // In this case we use navigation.state.index because we want the title for the active route.
  state: navigation.state.routes[navigation.state.index],
  dispatch: navigation.dispatch,
});
const options = this.props.router.getScreenOptions(screenNavigation, {});
const title = options.title;
```
