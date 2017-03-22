
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Linking,
  View,
} from 'react-native';

export default class LinkingExample extends Component {
  state = { initUrl: null };

  async componentDidMount() {
    const initUrl = await Linking.getInitialURL();
    this.setState({ initUrl });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!

          {this.state.initUrl}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
