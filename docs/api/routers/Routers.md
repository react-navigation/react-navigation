# Routers

Routers define a component's navigation state, and they allow the developer to define paths and actions that can be handled.


## Built-In Routers

`react-navigation` ships with a few standard routers:

- [StackRouter](/docs/routers/stack)
- [TabRouter](/docs/routers/tab)


## Using Routers

To make a navigator manually, put a static `router` on a component. (To quickly make a navigator with a built-in component, it may be easier to use a [built-in navigator](/docs/navigators) instead)

```js
class MyNavigator extends React.Component {
    static router = StackRouter(routes, config);
    ...
}
```

Now you can use this component as a `screen` in another navigator, and the navigation logic for `MyNavigator` will be defined by this `StackRouter`.


## Customizing Routers

See the [Custom Router API spec](/docs/routers/api) to learn about the API of `StackRouter` and `TabRouter`. You can override the router functions as you see fit:

### Custom Navigation Actions

To override navigation behavior, you can override the navigation state logic in `getStateForAction`, and manually manipulate the `routes` and `index`.

```js
const MyApp = StackNavigator({
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
}, {
  initialRouteName: 'Home',
})

const defaultGetStateForAction = MyApp.router.getStateForAction;

MyApp.router.getStateForAction = (action, state) => {
  if (state && action.type === 'PushTwoProfiles') {
    const routes = [
      ...state.routes,
      {key: 'A', routeName: 'Profile', params: { name: action.name1 }},
      {key: 'B', routeName: 'Profile', params: { name: action.name2 }},
    ];
    return {
      ...state,
      routes,
      index: routes.length - 1,
    };
  }
  return defaultGetStateForAction(action, state);
};
```

### Blocking Navigation Actions

Sometimes you may want to prevent some navigation activity, depending on your route.

```js
import { NavigationActions } from 'react-navigation'

const MyStackRouter = StackRouter({
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
}, {
  initialRouteName: 'Home',
})

const defaultGetStateForAction = MyStackRouter.router.getStateForAction;

MyStackRouter.router.getStateForAction = (action, state) => {
  if (
    state &&
    action.type === NavigationActions.BACK &&
    state.routes[state.index].params.isEditing
  ) {
    // Returning null from getStateForAction means that the action
    // has been handled/blocked, but there is not a new state
    return null;
  }
  
  return defaultGetStateForAction(action, state);
};
```


### Handling Custom URIs

Perhaps your app has a unique URI which the built-in routers cannot handle. You can always extend the router `getActionForPathAndParams`.

```js

import { NavigationActions } from 'react-navigation'

const MyApp = StackNavigator({
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
}, {
  initialRouteName: 'Home',
})
const previousGetActionForPathAndParams = MyApp.router.getActionForPathAndParams;

Object.assign(MyApp.router, {
  getActionForPathAndParams(path, params) {
    if (
      path === 'my/custom/path' &&
      params.magic === 'yes'
    ) {
      // returns a profile navigate action for /my/custom/path?magic=yes
      return NavigationActions.navigate({
        routeName: 'Profile',
        action: NavigationActions.navigate({
          // This child action will get passed to the child router
          // ProfileScreen.router.getStateForAction to get the child
          // navigation state.
          routeName: 'Friends',
        }),
      });
    }
    return previousGetActionForPathAndParams(path, params);
  },
});
```
