# DrawerNavigator

Used to easily set up a screen with a drawer navigation.

```js
class MyHomeScreen extends React.Component {
  static navigationOptions = {
    drawer: () => ({
      label: 'Home',
      icon: ({ tintColor }) => (
        <Image
          source={require('./chats-icon.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
    }),
  }

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
    drawer: () => ({
      label: 'Notifications',
      icon: ({ tintColor }) => (
        <Image
          source={require('./notif-icon.png')}
          style={[styles.tabIcon, {tintColor: tintColor}]}
        />
      ),
    }),
  }

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
    width: 24,
    height: 24,
  },
});

const MyApp = DrawerNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Notifications: {
    screen: MyNotificationsScreen,
  },
});
```

To open and close drawer, navigate to `'DrawerOpen'` and `'DrawerClose'` respectively.

```js
this.props.navigation.navigate('DrawerOpen'); // open drawer
this.props.navigation.navigate('DrawerClose'); // close drawer
```

## API Definition

```js
DrawerNavigator(RouteConfigs, DrawerNavigatorConfig)
```

### RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](https://github.com/coodoo/react-navigation/blob/master/docs/api/navigators/StackNavigator.md#routeconfigs) from `StackNavigator`.


### DrawerNavigatorConfig

- `drawerWidth` - Width of the drawer
- `drawerPosition` - Options are `left` or `right`. Default is `left` position.
- `contentComponent` - Component to use to render the navigation items. Receives the `navigation` prop for the drawer. Defaults to `DrawerView.Items`.
- `contentOptions` - Configure the drawer content, see below.

Several options get passed to the underlying router to modify navigation logic:

- `initialRouteName` - The routeName for the initial route.
- `order` - Array of routeNames which defines the order of the drawer items.
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause switch to the initial route? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

### `contentOptions` for `DrawerView.Items`

- `activeTintColor` - label and icon color of the active label
- `activeBackgroundColor` - background color of the active label
- `inactiveTintColor` - label and icon color of the inactive label
- `inactiveBackgroundColor` - background color of the inactive label
- `style` - style object for the content section

#### Example:

```js
contentOptions: {
  activeTintColor: '#e91e63',
  style: {
    marginVertical: 0,
  }
}
```

### Screen Navigation Options

Usually you define static `navigationOptions` on your screen component. For example:

```jsx
class ProfileScreen extends React.Component {

  static navigationOptions = {

    title: ({ state }) => `${state.params.name}'s Profile!`,

    drawer: {
      icon: (
        <Image src={require('./my-icon.png')} />
      ),
    },
  };
  ...
```

All `navigationOptions` for the `DrawerNavigator`:

- `title` - a title (string) of the scene
- `drawer` - a config object for the drawer:
  - `label` - String, React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Element, to display in drawer sidebar. When undefined, scene `title` is used
  - `icon` - React Element or a function, that given `{ focused: boolean, tintColor: string }` returns a React.Element, to display in drawer sidebar


### Navigator Props

The navigator component created by `DrawerNavigator(...)` takes the following props:

- `screenProps` - Pass down extra options to child screens, for example:


 ```jsx
 const DrawerNav = DrawerNavigator({
   // config
 });
 
 <DrawerNav
   screenProps={/* this prop will get passed to the screen components as this.props.screenProps */}
 />
 ```
