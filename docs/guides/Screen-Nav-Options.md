
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

Or, the options can be a function that takes the following arguments, and returns an object of navigation options that will be override the route-defined and navigator-defined navigationOptions.

- `props` - The same props that are available to the screen component
  - `navigation` - The [navigation prop](/docs/navigators/navigation-prop) for the screen, with the screen's route at `navigation.state`
  - `screenProps` - The props passing from above the navigator component
  - `prevOptions` - The default or previous options that would be used if new values are not provided

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
StackNavigator:
  - route1: A screen
  - route2: A TabNavigator
```

Now, when `route2` is active, you would like to hide the header. It's easy to hide the header for `route1`, and it should also be easy to do it for `route2`. This is what Default Navigation Options are for - they are simply `navigationOptions` set on a navigator:

```js
TabNavigator({
  profile: ProfileScreen,
  ...
}, {
  navigationOptions: {
    headerVisible: false,
  },
});
```

Note that you can still decide to **also** specify the `navigationOptions` on the screens at the leaf level - e.g.  the `ProfileScreen` above. The `navigationOptions` from the screen will be merged key-by-key with the default options coming from the navigator. Whenever both the navigator and screen define the same option (e.g. `headerVisible`), the screen wins. Therefore, you could make the header visible again when `ProfileScreen` is active.

```js
class ProfileScreen extends React.Component {
  static navigationOptions = {
    headerVisible: true,
  };
  ...
}
```

The 2nd argument passed to the function are the default values for the `header` as defined on the navigator.


## Navigation Option Reference

#### `title`
Set a generic title that can be used as a fallback for `headerTitle` and `tabBarLabel`

#### `headerTitle`
A string or a React Element for the title of the header

#### `headerRight`
A string or a React Element for the right button area of the header

#### `headerLeft`
A string or a React Element for the left button area of the header, (overrides the back button)

#### `headerBackTitle`
Override the title string of the back button, rather than taking the title of the screen before it

#### `headerTintColor`

#### `headerStyle`
#### `headerTitleStyle`

#### `headerVisible`


#### `tabBarLabel`
Can be string or react component

#### `tabBarLabelActive`
Function that returns icon component

#### `tabBarIcon`
Function that returns icon component

#### `tabBarIconActive`
Function that returns icon component

#### `tabBarVisible`
True or false to show or hide the tab bar, if not set then defaults to true
