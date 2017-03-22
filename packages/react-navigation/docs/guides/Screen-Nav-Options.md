
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

Or, each option can be a function that takes the following arguments, and returns the value of the option.

- `navigation` - the [navigation prop](/docs/navigators/navigation-prop) for the screen, with the screen's route at `navigation.state`
- `childRouter` - The child router, if the screen is a navigator

```js
class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: (navigation, childRouter) => {
      return navigation.state.params.name + "'s Profile!";
    },
  };
  ...
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
     header: {
       visible: false,
     },
   },
 });
```

Note that you can still decide to **also** specify the `navigationOptions` on the screens at the leaf level - e.g.  the `ProfileScreen` above. The `navigationOptions` from the screen will be merged key-by-key with the default options coming from the navigator. Whenever both the navigator and screen define the same option (e.g. `header`), the screen wins. Therefore, you could make the header visible again when `ProfileScreen` is active.

**Extending defaults:** In order to extend default config with screen-specific properties instead of overriding it, you configure an option like this:
 
```js
class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: (navigation, defaultHeader) => ({
      ...defaultHeader,
      visible: true,
    }),
  }
  ...
}
```
 
The 2nd argument passed to the function are the default values for the `header` as defined on the navigator.


## Tab Navigation Options

```js
class TabScreen extends React.Component {

  static navigationOptions = {
    tabBar: ({ state }) => ({
      label: 'Tab Label',
      icon: ({ tintColor }) => (
        <Image
          source={require('./tab-icon.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
      visible: true
    }),
  };

};
```

- `label` - can be string or react component
- `icon` - function that returns icon component
- `visible` - true or false to show or hide the tab bar, if not set then defaults to true

## Stack Navigation Options

Coming Soon
