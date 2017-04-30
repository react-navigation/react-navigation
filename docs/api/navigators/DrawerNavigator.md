# DrawerNavigator

Used to easily set up a screen with a drawer navigation.

```js
class MyHomeScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => (
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
    drawerLabel: 'Notifications',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./notif-icon.png')}
        style={[styles.tabIcon, {tintColor: tintColor}]}
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

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route, see [example](/docs/api/navigators/StackNavigator.md#routeconfigs) from `StackNavigator`.


### DrawerNavigatorConfig

- `drawerWidth` - Width of the drawer
- `drawerPosition` - Options are `left` or `right`. Default is `left` position.
- `contentComponent` - Component used to render the content of the drawer, for example, navigation items. Receives the `navigation` prop for the drawer. Defaults to `DrawerItems`. For more information, see below.
- `contentOptions` - Configure the drawer content, see below.

#### Example:

Default the `DrawerView` isn't scrollable.
To achieve a scrollable `View`, you have to use the `contentComponent` to customize the container,
as you can see in the example below.

```js
{
  drawerWidth: 200,
  drawerPosition: 'right',
  contentComponent: props => <ScrollView><DrawerItems {...props} /></ScrollView>
}
```

Several options get passed to the underlying router to modify navigation logic:

- `initialRouteName` - The routeName for the initial route.
- `order` - Array of routeNames which defines the order of the drawer items.
- `paths` - Provide a mapping of routeName to path config, which overrides the paths set in the routeConfigs.
- `backBehavior` - Should the back button cause switch to the initial route? If yes, set to `initialRoute`, otherwise `none`. Defaults to `initialRoute` behavior.

### Providing a custom `contentComponent`

You can easily override the default component used by `react-navigation`:

```js
import { DrawerItems } from 'react-navigation';

const CustomDrawerContentComponent = (props) => (
  <View style={style.container}>
    <DrawerItems {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### `contentOptions` for `DrawerItems`

- `items` - an array of routes to use in place of `navigation.state.routes`
- `activeTintColor` - label and icon color of the active label
- `activeBackgroundColor` - background color of the active label
- `inactiveTintColor` - label and icon color of the inactive label
- `inactiveBackgroundColor` - background color of the inactive label
- `style` - style object for the content section
- `labelStyle` - style object to overwrite `Text` style inside content section, when your label is a string

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

#### `title`

Generic title that can be used as a fallback for `headerTitle` and `drawerLabel`

#### `drawerLabel`

String, React Element or a function that given `{ focused: boolean, tintColor: string }` returns a React.Element, to display in drawer sidebar. When undefined, scene `title` is used

#### `drawerIcon`

React Element or a function, that given `{ focused: boolean, tintColor: string }` returns a React.Element, to display in drawer sidebar

#### `drawerOnPress`

Callback to handle tap events. Typical behavior would be to call `navigation.navigate('DrawerClose')` after performing your other logic.
If explicitly set to `null`, there will be no touch feedback for this drawer item; this can be used e.g. for header items / section separators.

### Navigator Props

The navigator component created by `DrawerNavigator(...)` takes the following props:

- `screenProps` - Pass down extra options to child screens, for example:


 ```jsx
 const DrawerNav = DrawerNavigator({
   // config
 });

 <DrawerNav
   screenProps={/* this prop will get passed to the screen components and nav options as props.screenProps */}
 />
 ```
 
 ### Nesting `DrawerNavigation`
 
Please bear in mind that if you nest the DrawerNavigation, the drawer will show below the parent navigation.
