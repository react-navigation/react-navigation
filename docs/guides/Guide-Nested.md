# Nesting Navigators

It is common in mobile apps to compose various forms of navigation. The routers and navigators in React Navigation are composable, which allows you to define a complicated navigation structure for your app.

For our chat app, we want to put several tabs on the first screen, to view recent chat threads or all contacts.

## Introducing Tab Navigator

Lets create a new `TabNavigator` in our `App.js`:

```js
import { TabNavigator } from "react-navigation";

class RecentChatsScreen extends React.Component {
  render() {
    return <Text>List of recent chats</Text>
  }
}

class AllContactsScreen extends React.Component {
  render() {
    return <Text>List of all contacts</Text>
  }
}

const MainScreenNavigator = TabNavigator({
  Recent: { screen: RecentChatsScreen },
  All: { screen: AllContactsScreen },
});
```

If the `MainScreenNavigator` was rendered as the top-level navigator component, it would look like this:

```phone-example
simple-tabs
```



## Nesting a Navigator in a screen

We want these tabs to be visible in the first screen of the app, but new screens in the stack should cover the tabs.

Lets add our tabs navigator as a screen in our top-level `StackNavigator` that we set up in the [previous step](/docs/intro/).

```js
const SimpleApp = StackNavigator({
  Home: { screen: MainScreenNavigator },
  Chat: { screen: ChatScreen },
});
```

Because `MainScreenNavigator` is being used as a screen, we can give it `navigationOptions`:

```js
MainScreenNavigator.navigationOptions = {
  title: 'My Chats',
};
```

Lets also add a button to each tab that links to a chat:

```js
<Button
  onPress={() => this.props.navigation.navigate('Chat', { user: 'Lucy' })}
  title="Chat with Lucy"
/>
```

Now we have put one navigator inside another, and we can `navigate` between navigators:

```phone-example
nested
```

## Nesting a Navigator in a Component
Sometimes it is desirable to nest a navigator that is wrapped in a component. This is useful in cases where the navigator only takes up part of the screen. For the child navigator to be wired into the navigation tree, it needs the `navigation` property from the parent navigator.

```js
const SimpleApp = StackNavigator({
  Home: { screen: NavigatorWrappingScreen },
  Chat: { screen: ChatScreen },
});
```
In this case, the NavigatorWrappingScreen is not a navigator, but it renders a navigator as part of its output.

```js
class NavigatorWrappingScreen extends React.Component {
  render() {
    return (
      <View>
        <SomeComponent/>
        <MainScreenNavigator/>
      </View>
    );
  }
}
```

To wire `MainScreenNavigator` into the navigation tree, we assign its `router` to the wrapping component. This makes `NavigatorWrappingScreen` "navigation aware", which tells the parent navigator to pass the navigation object down. Since the `NavigatorWrappingScreen`'s `router` is overridden with the child navigator's `router`, the child navigator will receive the needed `navigation`.

```js
class NavigatorWrappingScreen extends React.Component {
  render() {
    return (
      <View>
        <SomeComponent/>
        <MainScreenNavigator navigation={this.props.navigation}/>
      </View>
    );
  }
}
NavigatorWrappingScreen.router = MainScreenNavigator.router;
```
