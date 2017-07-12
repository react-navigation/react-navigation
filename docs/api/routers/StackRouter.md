# StackRouter

Manage the logical navigation stack, including pushing, popping, and handling path parsing to create a deep stack.

Let's take a look at a simple stack router:

```js
const MyApp = StackRouter({
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
}, {
  initialRouteName: 'Home',
})
```


### RouteConfig

A basic stack router expects a route config object. Here is an example configuration:

```js
const MyApp = StackRouter({ // This is the RouteConfig:
  Home: {
    screen: HomeScreen,
    path: '',
  },
  Profile: {
    screen: ProfileScreen,
    path: 'profile/:name',
  },
  Settings: {
    // This can be handy to lazily require a screen:
    getScreen: () => require('Settings').default,
    // Note: Child navigators cannot be configured using getScreen because
    // the router will not be accessible. Navigators must be configured
    // using `screen: MyNavigator`
    path: 'settings',
  },
});
```

Each item in the config may have the following:

- `path` - Specify the path and params to be parsed for item in the stack
- `screen` - Specify the screen component or child navigator
- `getScreen` - Set a lazy getter for a screen component (but not navigators)


### StackConfig

Config options that are also passed to the stack router.

- `initialRouteName` - The routeName for the default route when the stack first loads
- `initialRouteParams` - Default params of the initial route
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.

### Supported Actions

The stack router may respond to the following navigation actions. The router will generally delegate the action handling to a child router, if possible.

- Navigate - Will push a new route on the stack if the routeName matches one of the router's routeConfigs
- Back - Goes back (pops)
- Reset - Clears the stack and provides new actions to create a fully new navigation state
- SetParams - An action that a screen dispatches to change the params of the current route.
