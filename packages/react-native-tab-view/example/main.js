import Exponent from 'exponent';
import React, { Component } from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TopBarTextExample from './src/TopBarTextExample';
import TopBarIconExample from './src/TopBarIconExample';
import TopBarIconTextExample from './src/TopBarIconTextExample';
import BottomBarIconExample from './src/BottomBarIconExample';
import BottomBarIconTextExample from './src/BottomBarIconTextExample';
import NoAnimationExample from './src/NoAnimationExample';
import ScrollViewsExample from './src/ScrollViewsExample';
import CoverflowExample from './src/CoverflowExample';

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
    fontSize: 14,
    color: '#333',
  },
});

const PERSISTENCE_KEY = 'index_persistence';

const EXAMPLE_ITEMS = [
  'Text only top bar',
  'Icon only top bar',
  'Icon + Text top bar',
  'Icon only bottom bar',
  'Icon + Text bottom bar',
  'No animation',
  'Scroll views',
  'Coverflow',
];

const EXAMPLE_COMPONENTS = [
  TopBarTextExample,
  TopBarIconExample,
  TopBarIconTextExample,
  BottomBarIconExample,
  BottomBarIconTextExample,
  NoAnimationExample,
  ScrollViewsExample,
  CoverflowExample,
];

export default class ExampleList extends Component {
  state = {
    title: 'Examples',
    index: -1,
    restoring: false,
  };

  componentWillMount() {
    this._restoreNavigationState();

    [
      require('./assets/album-art-1.jpg'),
      require('./assets/album-art-2.jpg'),
      require('./assets/album-art-3.jpg'),
      require('./assets/album-art-4.jpg'),
      require('./assets/album-art-5.jpg'),
      require('./assets/album-art-6.jpg'),
      require('./assets/album-art-7.jpg'),
      require('./assets/album-art-8.jpg'),
      require('./assets/back-button.android.png'),
      require('./assets/back-button.ios.png'),
      require('./assets/tab-icon-1.png'),
      require('./assets/tab-icon-2.png'),
      require('./assets/tab-icon-3.png'),
    ].map(image => Exponent.Asset.fromModule(image).downloadAsync());
  }

  _persistNavigationState = async (currentIndex: number) => {
    await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(currentIndex));
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

  _renderItem = (title, i) => {
    return (
      <TouchableOpacity
        key={i}
        style={styles.touchable}
        onPress={() => this._handleNavigate(i)}
      >
        <Text style={styles.item}>{i + 1}. {title}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    if (this.state.restoring) {
      return null;
    }

    const { index } = this.state;

    const ExampleComponent = EXAMPLE_COMPONENTS[index] || null;
    const backgroundColor = ExampleComponent && ExampleComponent.backgroundColor;
    const tintColor = ExampleComponent && ExampleComponent.tintColor;
    const appbarElevation = ExampleComponent ? ExampleComponent.appbarElevation : 4;

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <View style={[ styles.statusbar, backgroundColor ? { backgroundColor } : null ]} />
        <View style={[ styles.appbar, backgroundColor ? { backgroundColor } : null, appbarElevation ? { elevation: appbarElevation } : null ]}>
          {index > -1 ?
            <TouchableOpacity style={styles.button} onPress={this._handleNavigateBack}>
              <Image tintColor={tintColor} source={require('./assets/back-button.png')} />
            </TouchableOpacity> : null
          }
          <Text style={[ styles.title, tintColor ? { color: tintColor } : null ]}>
            {index > -1 ? EXAMPLE_ITEMS[index] : this.state.title}
          </Text>
          {index > -1 ? <View style={styles.button} /> : null}
        </View>
        {index === -1 ? (
          <ScrollView>
            {EXAMPLE_ITEMS.map(this._renderItem)}
          </ScrollView>
        ) : <ExampleComponent />}
      </View>
    );
  }
}

Exponent.registerRootComponent(ExampleList);
