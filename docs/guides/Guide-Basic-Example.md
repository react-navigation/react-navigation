# Hello Mobile Navigation

Let's use React Navigation to build a simple chat-like application for Android and iOS.

## Setup and Installation

First, make sure you're [all set up to use React Native](http://facebook.github.io/react-native/docs/getting-started.html). Next, create a new project and add `react-navigation`:

```sh
# Create a new React Native App
react-native init SimpleApp
cd SimpleApp

# Install the latest version of react-navigation from npm
npm install --save react-navigation

# Run the new app
react-native run-android
# or:
react-native run-ios
```

If you are using `create-react-native-app` instead of `react-native init`, then:

```sh
# Create a new React Native App
create-react-native-app SimpleApp
cd SimpleApp

# Install the latest version of react-navigation from npm
npm install --save react-navigation

# Run the new app
npm start

# This will start a development server for you and print a QR code in your terminal.
```

Verify that you can successfully see the bare sample app run on iOS and/or Android:

```phone-example
bare-project
```

We want to share code on iOS and Android, so let's delete the contents of `index.js` (or `index.ios.js` and `index.android.js` if using a React Native version before 0.49) and replace it with `import './App';` - after which, we need to create the new file for our app implementation, `App.js` (if you used `create-react-native-app` this has been already done)

## Introducing Stack Navigator

For our app, we want to use the `StackNavigator` because conceptually we want to obtain a 'card stack' effect of movement, where each new screen is put on the top of the stack and going back removes a screen from the top of the stack. Let's start with just one screen:

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
    return <Text>Hello, Navigation!</Text>;
  }
}

export const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
});

AppRegistry.registerComponent('SimpleApp', () => SimpleApp);
```

If you used `create-react-native-app` the already existing `App.js` will be modified to

```js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome'
  };
  render() {
    return <Text>Hello, Navigation!</Text>;
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen }
});

export default class App extends React.Component {
  render() {
    return <SimpleApp />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

```

The `title` of the screen is configurable on the [static `navigationOptions`](/docs/navigators/navigation-options), where many options can be set to configure the presentation of the screen in the navigator.

Now the same screen should appear on both iPhone and Android apps:

```phone-example
first-screen
```

## Adding a New Screen

In our `App.js` file, let's add a new screen called `ChatScreen`, defining it under `HomeScreen`:

```js
// ...

class HomeScreen extends React.Component {
    //...
}

class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chat with Lucy',
  };
  render() {
    return (
      <View>
        <Text>Chat with Lucy</Text>
      </View>
    );
  }
}

```

We can then add a button to our `HomeScreen` component that links to `ChatScreen`: we need to use the provided method `navigate` (from the [screen navigation prop](/docs/navigators/navigation-prop)) by giving it the `routeName` of the screen we want to reach, in this case `Chat`.

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
          onPress={() => navigate('Chat')}
          title="Chat with Lucy"
        />
      </View>
    );
  }
}
```

(*don't forget to import View and Button from react-native:* `import { AppRegistry, Text, View, Button } from 'react-native';`)

But that won't work until we say to our `StackNavigator` of the existence of the `Chat` screen, like so:

```js
export const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
});
```

Now you can navigate to your new screen, and go back:

```phone-example
first-navigation
```

## Passing params

Hardcoding a name into the `ChatScreen` isn't ideal. It'd be more useful if we could pass a name to be rendered instead, so let's do that.

In addition to specifying the target `routeName` in the navigate function, we can pass params that will be put into the new route. First, we'll edit our `HomeScreen` component to pass a `user` param into the route.

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

We can then edit our `ChatScreen` component to display the `user` param that was passed in through the route:

```js
class ChatScreen extends React.Component {
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = ({ navigation }) => ({
    title: `Chat with ${navigation.state.params.user}`,
  });
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
```

Now you can see the name when you navigate to the Chat screen. Try changing the `user` param in `HomeScreen` and see what happens!

```phone-example
first-navigation
```
