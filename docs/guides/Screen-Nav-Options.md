
# Screen Navigation Options

Each screen can configure several aspects about how it gets presented in parent navigators.

#### Two Ways to specify each option

**Static configuration:** Each navigation option can either be directly assigned:

```js
class MyScreen extends React.Component {
  static navigationOptions = {
    title: 'Great',
  };
  ...
```

**Dynamic Configuration**

Or, the options can be a function that takes the following arguments, and returns an object of navigation options that will override the route-defined and navigator-defined navigationOptions.

- `props` - The same props that are available to the screen component
  - `navigation` - The [navigation prop](/docs/navigators/navigation-prop) for the screen, with the screen's route at `navigation.state`
  - `screenProps` - The props passing from above the navigator component
  - `navigationOptions` - The default or previous options that would be used if new values are not provided

```js
class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.name + "'s Profile!",
    headerRight: <Button color={screenProps.tintColor} {...} />,
  });
  ...
```

The screenProps are passed in at render-time. If this screen was hosted in a SimpleApp navigator:

```js
<SimpleApp
  screenProps={{tintColor: 'blue'}}
  // navigation={{state, dispatch}} // optionally control the app
/>
```

#### Generic Navigation Options

The `title` navigation option is generic between every navigator. It is used to set the title string for a given screen.

```js
class MyScreen extends React.Component {
  static navigationOptions = {
    title: 'Great',
  };
  ...
```

Unlike the other nav options which are only utilized by the navigator view, the title option can be used by the environment to update the title in the browser window or app switcher.

#### Default Navigation Options

It's very common to define `navigationOptions` on a screen, but sometimes it is useful to define `navigationOptions` on a navigator too.

Imagine the following scenario:
Your `TabNavigator` represents one of the screens in the app, and is nested within a top-level `StackNavigator`:

```
StackNavigator({
  route1: { screen: RouteOne },
  route2: { screen: MyTabNavigator },
});
```

Now, when `route2` is active, you would like to change the tint color of a header. It's easy to do it for `route1`, and it should also be easy to do it for `route2`. This is what Default Navigation Options are for - they are simply `navigationOptions` set on a navigator:

```js
const MyTabNavigator = TabNavigator({
  profile: ProfileScreen,
  ...
}, {
  navigationOptions: {
    headerTintColor: 'blue',
  },
});
```

Note that you can still decide to **also** specify the `navigationOptions` on the screens at the leaf level - e.g.  the `ProfileScreen` above. The `navigationOptions` from the screen will be merged key-by-key with the default options coming from the navigator. Whenever both the navigator and screen define the same option (e.g. `headerTintColor`), the screen wins. Therefore, you could change the tint color when `ProfileScreen` is active by doing the following:

```js
class ProfileScreen extends React.Component {
  static navigationOptions = {
    headerTintColor: 'black',
  };
  ...
}
```

## Navigation Option Reference

List of available navigation options depends on the `navigator` the screen is added to.

Check available options for:
- [`drawer navigator`](/docs/navigators/drawer#Screen-Navigation-Options)
- [`stack navigator`](/docs/navigators/stack#Screen-Navigation-Options)
- [`tab navigator`](/docs/navigators/tab#Screen-Navigation-Options)
