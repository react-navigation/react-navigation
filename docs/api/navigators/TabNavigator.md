# TabNavigator

Used to easily set up a screen with several tabs with a TabRouter. For a live example please see [our expo demo](https://exp.host/@react-navigation/NavigationPlayground).

```js
class MyHomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./chats-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    );
  }
}

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Notifications',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('./notif-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

const MyApp = TabNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Notifications: {
    screen: MyNotificationsScreen,
  },
}, {
  tabBarPosition: 'top',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});
```

## API Definition

```js
TabNavigator(RouteConfigs, TabNavigatorConfig)
```

### RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](/docs/api/navigators/StackNavigator.md#routeconfigs) from `StackNavigator`.

### TabNavigatorConfig

- `tabBarComponent` - Component to use as the tab bar, e.g. `TabBarBottom`
(this is the default on iOS), `TabBarTop`
(this is the default on Android).
- `tabBarPosition` - Position of the tab bar, can be `'top'` or `'bottom'`.
- `swipeEnabled` - Whether to allow swiping between tabs.
- `animationEnabled` - Whether to animate when changing tabs.
- `lazy` - Whether to lazily render tabs as needed as opposed to rendering them upfront.
- `initialLayout` - Optional object containing the initial `height` and `width`, can be passed to prevent the one frame delay in [react-native-tab-view](https://github.com/react-native-community/react-native-tab-view#avoid-one-frame-delay) rendering.
- `tabBarOptions` - Configure the tab bar, see below.

Several options get passed to the underlying router to modify navigation logic:

- `initialRouteName` - The routeName for the initial tab route when first loading.
- `order` - Array of routeNames which defines the order of the tabs.
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause a tab switch to the initial tab? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

### `tabBarOptions` for `TabBarBottom` (default tab bar on iOS)

- `activeTintColor` - Label and icon color of the active tab.
- `activeBackgroundColor` - Background color of the active tab.
- `inactiveTintColor` - Label and icon color of the inactive tab.
- `inactiveBackgroundColor` - Background color of the inactive tab.
- `showLabel` - Whether to show label for tab, default is true.
- `style` - Style object for the tab bar.
- `labelStyle` - Style object for the tab label.
- `tabStyle` - Style object for the tab.
- `allowFontScaling` - Whether label font should scale to respect Text Size accessibility settings, default is true.

Example:

```js
tabBarOptions: {
  activeTintColor: '#e91e63',
  labelStyle: {
    fontSize: 12,
  },
  style: {
    backgroundColor: 'blue',
  },
}
```

### `tabBarOptions` for `TabBarTop` (default tab bar on Android)

- `activeTintColor` - Label and icon color of the active tab.
- `inactiveTintColor` - Label and icon color of the inactive tab.
- `showIcon` - Whether to show icon for tab, default is false.
- `showLabel` - Whether to show label for tab, default is true.
- `upperCaseLabel` - Whether to make label uppercase, default is true.
- `pressColor` - Color for material ripple (Android >= 5.0 only).
- `pressOpacity` - Opacity for pressed tab (iOS and Android < 5.0 only).
- `scrollEnabled` - Whether to enable scrollable tabs.
- `tabStyle` - Style object for the tab.
- `indicatorStyle` - Style object for the tab indicator (line at the bottom of the tab).
- `labelStyle` - Style object for the tab label.
- `iconStyle` - Style object for the tab icon.
- `style` - Style object for the tab bar.
- `allowFontScaling` - Whether label font should scale to respect Text Size accessibility settings, default is true.

Example:

```js
tabBarOptions: {
  labelStyle: {
    fontSize: 12,
  },
  tabStyle: {
    width: 100,    
  },
  style: {
    backgroundColor: 'blue',
  },
}
```

### Screen Navigation Options

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`.

#### `tabBarVisible`

True or false to show or hide the tab bar, if not set then defaults to true.

#### `tabBarIcon`

React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar.

#### `tabBarLabel`

Title string of a tab displayed in the tab bar or React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Node, to display in tab bar. When undefined, scene `title` is used. To hide, see `tabBarOptions.showLabel` in the previous section.

#### `tabBarOnPress`

Callback to handle tap events; arguments are the `scene: { route, index }` that was tapped and a `jumpToIndex` method that can perform the navigation for you.

### Navigator Props

The navigator component created by `TabNavigator(...)` takes the following props:

- `screenProps` - Pass down extra options to child screens and navigation options, for example:


 ```jsx
 const TabNav = TabNavigator({
   // config
 });

 <TabNav
   screenProps={/* this prop will get passed to the screen components as this.props.screenProps */}
 />
 ```
