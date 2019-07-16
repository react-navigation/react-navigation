import * as React from 'react';
import {
  AsyncStorage,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  YellowBox,
  I18nManager,
} from 'react-native';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import { useKeepAwake } from 'expo-keep-awake';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import ScrollableTabBarExample from './ScrollableTabBarExample';
import AutoWidthTabBarExample from './AutoWidthTabBarExample';
import TabBarIconExample from './TabBarIconExample';
import CustomIndicatorExample from './CustomIndicatorExample';
import CustomTabBarExample from './CustomTabBarExample';
import CoverflowExample from './CoverflowExample';

type State = {
  title: string;
  index: number;
  restoring: boolean;
};

type ExampleComponentType = React.ComponentType<{}> & {
  title: string;
  tintColor?: string;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  appbarElevation?: number;
};

I18nManager.forceRTL(false);

YellowBox.ignoreWarnings(['bind():']);

const PERSISTENCE_KEY = 'index_persistence';

const EXAMPLE_COMPONENTS: ExampleComponentType[] = [
  ScrollableTabBarExample,
  AutoWidthTabBarExample,
  TabBarIconExample,
  CustomIndicatorExample,
  CustomTabBarExample,
  CoverflowExample,
];

const KeepAwake = () => {
  useKeepAwake();
  return null;
};

export default class ExampleList extends React.Component<any, State> {
  state = {
    title: 'Examples',
    index: -1,
    restoring: false,
  };

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      this.restoreNavigationState();
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
    ].map(image => Asset.fromModule(image).downloadAsync());
  }

  private persistNavigationState = async (currentIndex: number) => {
    if (process.env.NODE_ENV !== 'production') {
      await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(currentIndex));
    }
  };

  private restoreNavigationState = async () => {
    this.setState({
      restoring: true,
    });

    const savedIndexString = await AsyncStorage.getItem(PERSISTENCE_KEY);

    try {
      const savedIndex = JSON.parse(savedIndexString || '');

      if (
        Number.isFinite(savedIndex) &&
        savedIndex >= 0 &&
        savedIndex < EXAMPLE_COMPONENTS.length
      ) {
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

  private handleNavigate = (index: number) => {
    this.setState({
      index,
    });
    this.persistNavigationState(index);
  };

  private handleNavigateBack = () => {
    this.handleNavigate(-1);
  };

  private renderItem = (component: ExampleComponentType, i: number) => (
    <TouchableOpacity
      key={i}
      style={styles.touchable}
      onPress={() => this.handleNavigate(i)}
    >
      <Text style={styles.item}>
        {i + 1}. {component.title}
      </Text>
    </TouchableOpacity>
  );

  render() {
    if (this.state.restoring) {
      return null;
    }

    const { index } = this.state;

    const ExampleComponent = EXAMPLE_COMPONENTS[index] || null;
    const backgroundColor =
      ExampleComponent && ExampleComponent.backgroundColor
        ? ExampleComponent.backgroundColor
        : '#111';
    const tintColor =
      ExampleComponent && typeof ExampleComponent.tintColor === 'string'
        ? ExampleComponent.tintColor
        : 'white';
    const appbarElevation =
      ExampleComponent && typeof ExampleComponent.appbarElevation === 'number'
        ? ExampleComponent.appbarElevation
        : 4;
    const statusBarStyle =
      ExampleComponent && typeof ExampleComponent.statusBarStyle === 'string'
        ? ExampleComponent.statusBarStyle
        : 'light-content';
    const borderBottomWidth =
      Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0;

    return (
      <View style={styles.container}>
        <StatusBar
          barStyle={Platform.OS === 'ios' ? statusBarStyle : 'light-content'}
        />
        <KeepAwake />
        <View
          style={[
            styles.appbar,
            backgroundColor ? { backgroundColor } : null,
            appbarElevation
              ? { elevation: appbarElevation, borderBottomWidth }
              : null,
          ]}
        >
          <View style={styles.statusbar} />
          <SafeAreaView>
            <View style={styles.content}>
              {index > -1 ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleNavigateBack}
                >
                  <Ionicons
                    name={
                      Platform.OS === 'android'
                        ? 'md-arrow-back'
                        : 'ios-arrow-back'
                    }
                    size={24}
                    color={tintColor}
                  />
                </TouchableOpacity>
              ) : null}
              <Text
                style={[styles.title, tintColor ? { color: tintColor } : null]}
              >
                {index > -1
                  ? EXAMPLE_COMPONENTS[index].title
                  : this.state.title}
              </Text>
              {index > -1 ? <View style={styles.button} /> : null}
            </View>
          </SafeAreaView>
        </View>
        {index === -1 ? (
          <ScrollView>{EXAMPLE_COMPONENTS.map(this.renderItem)}</ScrollView>
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
    backgroundColor: '#eceff1',
  },
  statusbar: {
    height: Platform.select({
      android: Constants.statusBarHeight,
      ios: Platform.Version < 11 ? Constants.statusBarHeight : 0,
    }),
  },
  appbar: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  title: {
    flex: 1,
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    fontSize: Platform.OS === 'ios' ? 17 : 18,
    color: '#fff',
    margin: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 56,
    padding: 16,
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

registerRootComponent(ExampleList);
