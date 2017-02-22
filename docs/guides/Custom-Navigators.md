# Custom Navigators

A navigator is any React component that has a [router](/docs/routers/) on it. Here is a basic one, which uses the [router's API](/docs/routers/api) to get the active component to render:

```js
class MyNavigator extends React.Component {
  static router = MyRouter;
  render() {
    const { state, dispatch } = this.props.navigation;
    const { routes, index } = state;

    // Figure out what to render based on the navigation state and the router:
    const Component = MyRouter.getComponentForState(state);

    // The state of the active child screen can be found at routes[index]
    let childNavigation = { dispatch, state: routes[index] };
    // If we want, we can also tinker with the dispatch function here, to limit
    // or augment our children's actions

    // Assuming our children want the convenience of calling .navigate() and so on,
    // we should call addNavigationHelpers to augment our navigation prop:
    childNavigation = addNavigationHelpers(childNavigation);

    return <Component navigation={childNavigation} />;
  }
}
```

## Navigation Prop

The navigation prop passed down to a navigator only includes `state` and `dispatch`. This is the current state of the navigator, and an event channel to send action requests.

All navigators are controlled components: they always display what is coming in through `props.navigation.state`, and their only way to change the state is to send actions into `props.navigation.dispatch`.

Navigators can specify custom behavior to parent navigators by [customizing their router](/docs/routers/). For example, a navigator is able to specify when actions should be blocked by returning null from `router.getStateForAction`. Or a navigator can specify custom URI handling by overriding `router.getActionForPathAndParams` to output a relevant navigation action, and handling that action in `router.getStateForAction`.

### Navigation State

The navigation state that is passed into a navigator's `props.navigation.state` has the following structure:

```
{
  index: 1, // identifies which route in the routes array is active
  routes: [
    {
      // Each route needs a name, which routers will use to associate each route
      // with a react component
      routeName: 'MyRouteName',

      // A unique id for this route, used to keep order in the routes array:
      key: 'myroute-123',

      // Routes can have any additional data. The included routers have `params`
      ...customRouteData,
    },
    ...moreRoutes,
  ]
}
```

### Navigation Dispatchers

A navigator can dispatch navigation actions, such as 'Go to a URI', 'Go back'.

The dispatcher will return `true` if the action was successfully handled, otherwise `false`.

## API for building custom navigators

To help developers implement custom navigators, the following utilities are provided with React Navigation:

### `createNavigator`

This utility combines a [router](/docs/routers/) and a [navigation view](/docs/views/) together in a standard way:

```js
const MyApp = createNavigator(MyRouter)(MyView);
```

All this does behind the scenes is:

```js
const MyApp = ({ navigation }) => (
  <MyView router={MyRouter} navigation={navigation} />
);
MyApp.router = MyRouter;
```

### `addNavigationHelpers`

Takes in a bare navigator navigation prop with `state` and `dispatch`, and augments it with all the various functions in a screen navigation prop, such as `navigation.navigate()` and `navigation.goBack()`. These functions are simply helpers to create the actions and send them into `dispatch`.

### `createNavigationContainer`

If you want your navigator to be usable as a top-level component, (without a navigation prop being passed in), you can use `createNavigationContainer`. This utility will make your navigator act like a top-level navigator when the navigation prop is missing. It will manage the app state, and integrate with app-level nav features, like handling incoming and outgoing links, and Android back button behavior.
