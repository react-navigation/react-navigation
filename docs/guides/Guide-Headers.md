# Configuring the Header

Header is only available for StackNavigator.

In the previous example, we created a StackNavigator to display several screens in our app.


When navigating to a chat screen, we can specify params for the new route by providing them to the navigate function. In this case, we want to provide the name of the person on the chat screen:

```js
this.props.navigation.navigate('Chat', { user:  'Lucy' });
```

The `user` param can be accessed from the chat screen:

```js
class ChatScreen extends React.Component {
  render() {
    const { params } = this.props.navigation.state;
    return <Text>Chat with {params.user}</Text>;
  }
}
```

### Setting the Header Title

Next, the header title can be configured to use the screen param:

```js
class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Chat with ${navigation.state.params.user}`,
  });
  ...
}
```

```phone-example
basic-header
```


### Adding a Right Button

Then we can add a [`header` navigation option](/docs/navigators/navigation-options#Stack-Navigation-Options) that allows us to add a custom right button:

```js
static navigationOptions = {
  headerRight: <Button title="Info" />,
  ...
```

```phone-example
header-button
```

The navigation options can be defined with a [navigation prop](/docs/navigators/navigation-prop). Let's render a different button based on the route params, and set up the button to call `navigation.setParams` when pressed.

```js
static navigationOptions = ({ navigation }) => {
  const { state, setParams } = navigation;
  const isInfo = state.params.mode === 'info';
  const { user } = state.params;
  return {
    title: isInfo ? `${user}'s Contact Info` : `Chat with ${state.params.user}`,
    headerRight: (
      <Button
        title={isInfo ? 'Done' : `${user}'s info`}
        onPress={() => setParams({ mode: isInfo ? 'none' : 'info' })}
      />
    ),
  };
};
```

Now, the header can interact with the screen route/state:

```phone-example
header-interaction
```

### Header interaction with screen component

Sometimes it is necessary for the header to access properties of the screen component such as functions or state.

Let's say we want to create an 'edit contact info' screen with a save button in the header. We want the save button to be replaced by an `ActivityIndicator` while saving.

```js
class EditInfoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <Button
        title="Save"
        onPress={params.handleSave ? params.handleSave : () => null}
      />
    );
    if (params.isSaving) {
      headerRight = <ActivityIndicator />;
    }
    return { headerRight };
  };

  state = {
    nickname: 'Lucy jacuzzi'
  }

  _handleSave = () => {
    // Update state, show ActivityIndicator
    this.props.navigation.setParams({ isSaving: true });
    
    // Fictional function to save information in a store somewhere
    saveInfo().then(() => {
      this.props.navigation.setParams({ isSaving: false});
    })
  }

  componentDidMount() {
    // We can only set the function after the component has been initialized
    this.props.navigation.setParams({ handleSave: this._handleSave });
  }

  render() {
    return (
      <TextInput
        onChangeText={(nickname) => this.setState({ nickname })}
        placeholder={'Nickname'}
        value={this.state.nickname}
      />
    );
  }
}
```

**Note**: Since the `handleSave`-param is only set on component mount it is not immidiately available in the `navigationOptions`-function. Before `handleSave` is set we pass down an empty function to the `Button`-component in order to make it render immidiately and avoid flickering.


To see the rest of the header options, see the [navigation options document](/docs/navigators/navigation-options#Stack-Navigation-Options).

As an alternative to `setParams`, you may want to consider using a state management library such as [MobX](https://github.com/mobxjs/mobx) or [Redux](https://github.com/reactjs/redux), and when navigating to a screen, pass an object which contains the data necessary for the screen to render, as well as functions you may want to call that modify the data, make network requests and etc. That way, both your screen component and the static `navbarOptions` block will have access to the object. When following this approach, make sure to consider deep linking, which works best in cases where only javascript primitives are passed as navigation props to your screen. In case when deep linking is necessary, you may use a [higher order component (HOC)](https://reactjs.org/docs/higher-order-components.html) to transform the primitives to the object your screen components expects.
