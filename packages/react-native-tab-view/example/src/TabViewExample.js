import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import TopBarTextExample from './TopBarTextExample';
import TopBarIconExample from './TopBarIconExample';
import TopBarIconTextExample from './TopBarIconTextExample';
import BottomBarIconExample from './BottomBarIconExample';
import BottomBarIconTextExample from './BottomBarIconTextExample';
import NoAnimationExample from './NoAnimationExample';
import ScrollViewsExample from './ScrollViewsExample';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  example: {
    elevation: 4,
  },
  appbar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    margin: 16,
  },
  button: {
    padding: 16,
  },
  touchable: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .06)',
  },
  item: {
    fontSize: 14,
    color: '#333',
  },
});

export default class TabViewExample extends Component {
  state = {
    title: 'Examples',
    index: -1,
    items: [
      'Text only top bar',
      'Icon only top bar',
      'Icon + Text top bar',
      'Icon only bottom bar',
      'Icon + Text bottom bar',
      'No animation',
      'Scroll views',
    ]
  };

  _handleBack = () => {
    this.setState({
      index: -1,
    });
  };

  _handlePress = index => {
    this.setState({
      index,
    });
  };

  _renderItem = (title, i) => {
    return (
      <TouchableOpacity
        key={i}
        style={styles.touchable}
        onPress={() => this._handlePress(i)}
      >
        <Text style={styles.item}>{i + 1}. {title}</Text>
      </TouchableOpacity>
    );
  };

  _renderExample = i => {
    switch (i) {
    case 0:
      return <TopBarTextExample style={styles.example} />;
    case 1:
      return <TopBarIconExample style={styles.example} />;
    case 2:
      return <TopBarIconTextExample style={styles.example} />;
    case 3:
      return <BottomBarIconExample />;
    case 4:
      return <BottomBarIconTextExample />;
    case 5:
      return <NoAnimationExample />;
    case 6:
      return <ScrollViewsExample style={styles.example} />;
    default:
      return null;
    }
  }

  render() {
    const { index, items } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#1b7dcb' />
        <View style={styles.appbar}>
          {index > -1 ?
            <TouchableOpacity style={styles.button} onPress={this._handleBack}>
              <Image source={require('../assets/back-button.png')} />
            </TouchableOpacity> : null
          }
          <Text style={styles.title}>
            {index > -1 ? items[index] : this.state.title}
          </Text>
        </View>
        {index === -1 ? items.map(this._renderItem) : this._renderExample(index)}
      </View>
    );
  }
}

AppRegistry.registerComponent('tabviewexample', () => TabViewExample);
