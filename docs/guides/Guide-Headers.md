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
  static navigationOptions = {
    // // Title may be a simple string:
    // title: 'Hello',

    // Or the title string may be a function of the navigation prop:
    title: ({ state }) => `Chat with ${state.params.user}`
  };
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
  header: {
    right: <Button title="Info" />,
  },
  ...
```

```phone-example
header-button
```

Just like `title`, the `header` option can be defined as a function of the [navigation prop](/docs/navigators/navigation-prop). Let's render a different button based on the route params, and set up the button to call `navigation.setParams` when pressed.

```js
static navigationOptions = {
  title: ({ state }) => {
    if (state.params.mode === 'info') {
      return `${state.params.user}'s Contact Info`;
    }
    return `Chat with ${state.params.user}`;
  },
  header: ({ state, setParams }) => {
    // The navigation prop has functions like setParams, goBack, and navigate.
    let right = (
      <Button
        title={`${state.params.user}'s info`}
        onPress={() => setParams({ mode: 'info' })}
      />
    );
    if (state.params.mode === 'info') {
      right = (
        <Button
          title="Done"
          onPress={() => setParams({ mode: 'none' })}
        />        
      );
    }
    return { right };
  },
  ...
```

Now, the header can interact with the screen route/state:

```phone-example
header-interaction
```

To see the rest of the header options, see the [navigation options document](/docs/navigators/navigation-options#Stack-Navigation-Options).
