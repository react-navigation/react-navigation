# Installing React Navigation

To get started with React Navigation, install the `react-navigation` npm package. This will install everything you need to get started.

### Install with NPM

```
npm install --save react-navigation
```

### Install with Yarn

```
yarn add react-navigation
```

## Creating the React Navigation Project

If you don't already have a React Native project you can create one with the `react-native` CLI or [`create-react-native-app`](https://github.com/react-community/create-react-native-app). Once you've completed that step you can install `react-navigation`.

### Creating App with Create React Native App

I would recommend going this route as the setup steps are minimal.

```sh
# Create a new React Native App
create-react-native-app SimpleApp
cd SimpleApp

# Install the latest version of react-navigation from npm
yarn add react-navigation

# Run the new app
yarn start

# This will start a development server for you and print a QR code in your terminal.
```

You can then use the Expo app on iOS or Android and scane the QR code to use your device for development.

### Creating App with React Native CLI

```sh
# Create a new React Native App
react-native init SimpleApp
cd SimpleApp

# Install the latest version of react-navigation from npm
yarn add react-navigation
```

Create a new file called `App.js`. In that file paste the following code.

```javascript
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

Then, in `index.ios.js` and `index.android.js` paste the following.

```javascript
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('SimpleApp', () => App);
```
