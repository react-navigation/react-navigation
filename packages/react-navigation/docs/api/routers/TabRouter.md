# TabRouter

Manage a set of tabs in the application, handle jumping to tabs, and handle the back button press to jump to the initial tab.

Let's take a look at a simple tabs router:

```js
const MyApp = TabRouter({
  Home: { screen: HomeScreen },
  Settings: { screen: SettingsScreen },
}, {
  initialRouteName: 'Home',
})
```


### RouteConfig

A tabs router has a routeConfig for each possible tab:

```js
const MyApp = TabRouter({ // This is the RouteConfig:
  Home: {
    screen: HomeScreen,
    path: 'main',
  },
  Settings: {
    // This can be handy to lazily require a tab:
    getScreen: () => require('./SettingsScreen').default,
    // Note: Child navigators cannot be configured using getScreen because
    // the router will not be accessible. Navigators must be configured
    // using `screen: MyNavigator`
    path: 'settings',
  },
});
```

Each item in the config may have the following:

- `path` - Specify the path for each tab
- `screen` - Specify the screen component or child navigator
- `getScreen` - Set a lazy getter for a screen component (but not navigators)


### Tab Router Config

Config options that are also passed to the router.

- `initialRouteName` - The routeName for the initial tab route when first loading
- `order` - Array of routeNames which defines the order of the tabs
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause a tab switch to the initial tab? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

### Supported Actions

The tabs router may respond to the following navigation actions. The router will generally delegate the action handling to a child router, if possible.

- Navigate - Will jump to the routeName if it matches a tab
- Back - Goes to the first tab, if not already selected
- SetParams - An action that a screen dispatches to change the params of the current route.
