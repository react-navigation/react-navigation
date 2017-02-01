# TabNavigator

Used to easily set up a screen with several tabs with a TabRouter.

```js
class MyHomeScreen extends React.Component {
  static navigationOptions = {
    tabBar: {
      label: 'Home',
      // Note: By default the icon is only shown on iOS. Search the showIcon option below.
      icon: ({ tintColor }) => (
        <Image
          source={require('./chats-icon.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
    },
  }

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Notifications')}
        label="Go to notifications"
      />
    );
  }
}

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    tabBar: {
      label: 'Notifications',
      icon: ({ tintColor }) => (
        <Image
          source={require('./notif-icon.png')}
          style={[styles.tabIcon, {tintColor: tintColor}]}
        />
      ),
    },
  }

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        label="Go back home"
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
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});
```

### Tab Navigator Options

- `tabBarComponent` - component to use as the tab bar, e.g. `TabView.TabBarBottom`
(this is the default on iOS), `TabView.TabBarTop`
(this is the default on Android)
- `tabBarPosition` - position of the tab bar, can be `'top'` or `'bottom'`
- `swipeEnabled` - whether to allow swiping between tabs
- `animationEnabled` - whether to animate when changing tabs
- `lazyLoad` - whether to lazily render tabs as needed as opposed to rendering them upfront
- `tabBarOptions` - configure the tab bar, see below.

Several options get passed to the underlying router to modify navigation logic:

- `initialRouteName` - The routeName for the initial tab route when first loading
- `order` - Array of routeNames which defines the order of the tabs
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause a tab switch to the initial tab? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

### `tabBarOptions` for `TabBarBottom` (default tab bar on iOS)

- `activeTintColor` - label and icon color of the active tab
- `activeBackgroundColor` - background color of the active tab
- `inactiveTintColor` - label and icon color of the inactive tab
- `inactiveBackgroundColor` - background color of the inactive tab
- `style` - style object for the tab bar

Example:

```js
tabBarOptions: {
  activeTintColor: '#e91e63',
  style: {
    backgroundColor: 'blue',
  }
}
```

### `tabBarOptions` for `TabBarTop` (default tab bar on Android)

- `activeTintColor` - label and icon color of the active tab
- `inactiveTintColor` - label and icon color of the inactive tab
- `showIcon` - whether to show icon for tab, default is false
- `showLabel` - whether to show label for tab, default is true
- `upperCaseLabel` - whether to make label uppercase, default is true
- `pressColor` - color for material ripple (Android >= 5.0 only)
- `pressOpacity` - opacity for pressed tab (iOS and Android < 5.0 only)
- `scrollEnabled` - whether to enable scrollable tabs
- `tabStyle` - style object for the tab
- `indicatorStyle` - style object for the tab indicator (line at the bottom of the tab)
- `labelStyle` - style object for the tab label
- `style` - style object for the tab bar

Example:

```js
tabBarOptions: {
  labelStyle: {
    fontSize: 12,
  },
  style: {
    backgroundColor: 'blue',
  }
}
```

### Navigator Props

The navigator component created by `TabNavigator(...)` takes the following props,

- `screenProps` - Props to pass to each child screen
