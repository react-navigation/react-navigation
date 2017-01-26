
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

- `navigation` - the [navigation prop](/docs/intro/navigation-prop) for the screen, with the screen's route at `navigation.state`
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


## Tab Navigation Options

Coming Soon

## Stack Navigation Options

Coming Soon
