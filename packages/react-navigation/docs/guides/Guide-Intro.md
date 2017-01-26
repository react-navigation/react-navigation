# Hello Mobile Navigation

Let's use React Navigation to build a simple chat application for Android and iOS.

## Setup and Installation

First, make sure you're [all set up to use React Native](http://facebook.github.io/react-native/docs/getting-started.html). Next, create a new project and add `react-navigation`:


```sh
# Create a new React Native App
react-native init SimpleApp
cd SimpleApp

# Install the latest version of react-navigation from npm
npm install --save react-navigation

# Run the new app
react-native run-android # or:
react-native run-ios
```

Verify that you can successfully see the bare sample app run on iOS and/or Android:

```phone-example
bare-project
```

We want to share code on iOS and Android, so lets delete the contents of `index.ios.js` and `index.android.js` and replace it with `import './App';`.

Now lets create the new file for our app implementation, `App.js`.

## Introducing Stack Navigator

For our app, we want to use the `StackNavigator` because we want a conceptual 'stack' navigation, where each new screen is put on the top of the stack, and going back removes a screen from the top of the stack. Lets start with just one screen:

```js
import React from 'react';
import {
  AppRegistry,
  Text,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    return <Text>Hello, World!</Text>;
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
});

AppRegistry.registerComponent('SimpleApp', () => SimpleApp);
```

The `title` of the screen is configurable on the [static `navigationOptions`](/docs/navigators/navigation-options), where many options can be set to configure the presentation of the screen in the navigator.

Now the same screen should appear on both iPhone and Android apps:

```phone-example
first-screen
```

## Adding a New Screen

Lets create a button in the `HomeScreen` component that links to our second page:

```js
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Hello, Chat App!</Text>
        <Button
          onPress={() => navigate('Chat', { user: 'Lucy' })}
          title="Chat with Lucy"
        />
      </View>
    );
  }
}
```

We're using the navigate function from the [screen navigation prop](/docs/navigators/navigation-prop). In addition to specifying the target `routeName`, we can also pass params that will be put into the new route.

Now let's create the Chat screen that displays the `name` param passed in through the route:

```js
class ChatScreen extends React.Component {
  static navigationOptions = {
    // Nav options can be defined as a function of the navigation prop:
    title: ({ state }) => `Chat with ${state.params.user}`,
  };
  render() {
    // The screen's current route is passed in to `props.navigation.state`:
    const { params } = this.props.navigation.state;
    return (
      <View>
        <Text>Chat with {params.user}</Text>
      </View>
    );
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
});
```

Now you can navigate to your new screen, and go back:

```phone-example
first-navigation
```
