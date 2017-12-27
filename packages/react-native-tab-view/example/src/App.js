/* @flow */

import Expo from 'expo';
import * as React from 'react';
import {
  AsyncStorage,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBarTextExample from './TopBarTextExample';
import TopBarIconExample from './TopBarIconExample';
import BottomBarIconTextExample from './BottomBarIconTextExample';
import NoAnimationExample from './NoAnimationExample';
import ScrollViewsExample from './ScrollViewsExample';
import CoverflowExample from './CoverflowExample';
import NativeDriverExample from './NativeDriverExample';

const PERSISTENCE_KEY = 'index_persistence';

const EXAMPLE_COMPONENTS = [
  TopBarTextExample,
  TopBarIconExample,
  BottomBarIconTextExample,
  NoAnimationExample,
  ScrollViewsExample,
  CoverflowExample,
  NativeDriverExample,
];

type State = {
  title: string,
  index: number,
  restoring: boolean,
};

export default class ExampleList extends React.Component<{}, State> {
  state = {
    title: 'Examples',
    index: -1,
    restoring: false,
  };

  componentWillMount() {
    if (process.env.NODE_ENV !== 'production') {
      this._restoreNavigationState();
    }

    [
      require('../assets/album-art-1.jpg'),
      require('../assets/album-art-2.jpg'),
      require('../assets/album-art-3.jpg'),
      require('../assets/album-art-4.jpg'),
      require('../assets/album-art-5.jpg'),
      require('../assets/album-art-6.jpg'),
      require('../assets/album-art-7.jpg'),
      require('../assets/album-art-8.jpg'),
    ].map(image => Expo.Asset.fromModule(image).downloadAsync());
  }

  _persistNavigationState = async (currentIndex: number) => {
    if (process.env.NODE_ENV !== 'production') {
      await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(currentIndex));
    }
  };

  _restoreNavigationState = async () => {
    this.setState({
      restoring: true,
    });

    const savedIndexString = await AsyncStorage.getItem(PERSISTENCE_KEY);

    try {
      const savedIndex = JSON.parse(savedIndexString);
      if (typeof savedIndex === 'number' && !isNaN(savedIndex)) {
        this.setState({
          index: savedIndex,
        });
      }
    } catch (e) {
      // ignore
    }

    this.setState({
      restoring: false,
    });
  };

  _handleNavigate = index => {
    this.setState({
      index,
    });
    this._persistNavigationState(index);
  };

  _handleNavigateBack = () => {
    this._handleNavigate(-1);
  };

  _renderItem = (component, i) => {
    return (
      <TouchableOpacity
        key={i}
        style={styles.touchable}
        onPress={() => this._handleNavigate(i)}
      >
        <Text style={styles.item}>
          {i + 1}. {component.title}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    if (this.state.restoring) {
      return null;
    }

    const { index } = this.state;

    const ExampleComponent = EXAMPLE_COMPONENTS[index] || null;
    const backgroundColor =
      ExampleComponent && ExampleComponent.backgroundColor
        ? ExampleComponent.backgroundColor
        : '#222';
    const tintColor =
      ExampleComponent && ExampleComponent.tintColor
        ? ExampleComponent.tintColor
        : 'white';
    const appbarElevation =
      ExampleComponent && Number.isFinite(ExampleComponent.appbarElevation)
        ? ExampleComponent.appbarElevation
        : 4;
    const borderBottomWidth =
      Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Expo.KeepAwake />
        <View
          style={[
            styles.statusbar,
            backgroundColor ? { backgroundColor } : null,
          ]}
        />
        <View
          style={[
            styles.appbar,
            backgroundColor ? { backgroundColor } : null,
            appbarElevation
              ? { elevation: appbarElevation, borderBottomWidth }
              : null,
          ]}
        >
          {index > -1 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={this._handleNavigateBack}
            >
              <Ionicons
                name={
                  Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'
                }
                size={24}
                color={tintColor}
              />
            </TouchableOpacity>
          ) : null}
          <Text style={[styles.title, tintColor ? { color: tintColor } : null]}>
            {index > -1 ? EXAMPLE_COMPONENTS[index].title : this.state.title}
          </Text>
          {index > -1 ? <View style={styles.button} /> : null}
        </View>
        {index === -1 ? (
          <ScrollView>{EXAMPLE_COMPONENTS.map(this._renderItem)}</ScrollView>
        ) : ExampleComponent ? (
          <ExampleComponent />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusbar: {
    backgroundColor: '#222',
    height: Platform.OS === 'ios' ? 20 : 25,
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 44 : 56,
    backgroundColor: '#222',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    flex: 1,
    margin: 16,
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    fontSize: Platform.OS === 'ios' ? 20 : 18,
    color: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 56,
    padding: Platform.OS === 'ios' ? 12 : 16,
  },
  touchable: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .06)',
  },
  item: {
    fontSize: 16,
    color: '#333',
  },
});

Expo.registerRootComponent(ExampleList);
