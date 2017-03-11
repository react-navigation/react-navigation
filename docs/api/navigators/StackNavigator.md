# StackNavigator

Provides a way for your app to transition between screens where each new screen is placed on top of a stack.

By default the StackNavigator is configured to have the familiar iOS and Android look & feel: new screens slide in from the right on iOS, fade in from the bottom on Android. On iOS the StackNavigator can also be configured to a modal style where screens slide in from the bottom.

```jsx

class MyHomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Profile', {name: 'Lucy'})}
        title="Go to Lucy's profile"
      />
    );
  }
}

const ModalStack = StackNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Profile: {
    path: 'people/:name',
    screen: MyProfileScreen,
  },
});
```

## API Definition

```js
StackNavigator(RouteConfigs, StackNavigatorConfig)
```

### RouteConfigs

The route configs object is a mapping from route name to a route config, which tells the navigator what to present for that route.

```js
StackNavigator({

  // For each screen that you can navigate to, create a new entry like this:
  Profile: {

    // `ProfileScreen` is a React component that will be the main content of the screen.
    screen: ProfileScreen,
    // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'people/:username',
    // The action and route params are extracted from the path.

    // Optional: Override the `navigationOptions` for the screen
    navigationOptions: {
      title: ({state}) => `${state.params.username}'s Profile'`,
    },
  },

  ...MyOtherRoutes,
});
```

### StackNavigatorConfig

Options for the router:

- `initialRouteName` - Sets the default screen of the stack. Must match one of the keys in route configs.
- `initialRouteParams` - The params for the initial route
- `navigationOptions` - Default navigation options to use for screens
- `paths` - A mapping of overrides for the paths set in the route configs

Visual options:

- `mode` - Defines the style for rendering and transitions:
  - `card` - Use the standard iOS and Android screen transitions. This is the default.
  - `modal` - Make the screens slide in from the bottom which is a common iOS pattern. Only works on iOS, has no effect on Android.
- `headerMode` - Specifies how the header should be rendered:
  - `float` - Render a single header that stays at the top and animates as screens are changed. This is a common pattern on iOS.
  - `screen` - Each screen has a header attached to it and the header fades in and out together with the screen. This is a common pattern on Android.
  - `none` - No header will be rendered.
- `cardStyle` - Use this prop to override or extend the default style for an individual card in stack.
- `onTransitionStart` - Function to be invoked when the card transition animation is about to start.
- `onTransitionEnd` - Function to be invoked once the card transition animation completes.


### Screen Navigation Options

Usually you define static `navigationOptions` on your screen component. For example:

```jsx
class ProfileScreen extends React.Component {

  static navigationOptions = {

    title: ({ state }) => `${state.params.name}'s Profile!`,

    header: ({ state, setParams }) => ({
      // Render a button on the right side of the header
      // When pressed switches the screen to edit mode.
      right: (
        <Button
          title={state.params.editing ? 'Done' : 'Edit'}
          onPress={() => setParams({editing: state.params.editing ? false : true})}
        />
      ),
    }),
  };
  ...
```

All `navigationOptions` for the `StackNavigator`:

- `title` - a title (string) of the scene
- `header` - a config object for the header bar:
  - `bar` - React Element or a function that given `HeaderProps` returns a React Element, to display as a header. Setting to `null` hides header.
  - `title` - String or React Element used by the header. Defaults to scene `title`
  - `backTitle` - Title string used by the back button on iOS or `null` to disable label. Defaults to scene `title`
  - `right` - React Element to display on the right side of the header
  - `left` - React Element to display on the left side of the header
  - `style` - Style object for the header
  - `titleStyle` - Style object for the title component
  - `tintColor` - Tint color for the header
- `cardStack` - a config object for the card stack:
  - `gesturesEnabled` - Whether you can use gestures to dismiss this screen. Defaults to true on iOS, false on Android

### Navigator Props

The navigator component created by `StackNavigator(...)` takes the following props:

- `screenProps` - Pass down extra options to child screens, for example:


 ```jsx
 const SomeStack = StackNavigator({
   // config
 });

 <SomeStack
   screenProps={/* this prop will get passed to the screen components as this.props.screenProps */}
 />
 ```

### Examples

See the examples [SimpleStack.js](https://github.com/react-community/react-navigation/tree/master/examples/NavigationPlayground/js/SimpleStack.js) and [ModalStack.js](https://github.com/react-community/react-navigation/tree/master/examples/NavigationPlayground/js/ModalStack.js) which you can run locally as part of the [NavigationPlayground](https://github.com/react-community/react-navigation/tree/master/examples/NavigationPlayground) app.
