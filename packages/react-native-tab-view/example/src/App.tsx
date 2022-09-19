import * as React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  I18nManager,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo';
import { Asset } from 'expo-asset';
import { useKeepAwake } from 'expo-keep-awake';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScrollableTabBarExample from './ScrollableTabBarExample';
import AutoWidthTabBarExample from './AutoWidthTabBarExample';
import TabBarIconExample from './TabBarIconExample';
import CustomIndicatorExample from './CustomIndicatorExample';
import CustomTabBarExample from './CustomTabBarExample';
import CoverflowExample from './CoverflowExample';
import TabBarGapExample from './TabBarGapExample';

type ExampleComponentType = React.ComponentType<{}> & {
  title: string;
  tintColor?: string;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  appbarElevation?: number;
};

I18nManager.forceRTL(false);

const PERSISTENCE_KEY = 'index_persistence';

const EXAMPLE_COMPONENTS: ExampleComponentType[] = [
  ScrollableTabBarExample,
  AutoWidthTabBarExample,
  TabBarIconExample,
  CustomIndicatorExample,
  CustomTabBarExample,
  CoverflowExample,
  TabBarGapExample,
];

const ExampleList = () => {
  useKeepAwake();
  const [index, setIndex] = React.useState(-1);
  const [restoring, setRestoring] = React.useState(false);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      restoreNavigationState();
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
    ].map((image) => Asset.fromModule(image).downloadAsync());
  }, []);

  const persistNavigationState = async (currentIndex: number) => {
    if (process.env.NODE_ENV !== 'production') {
      await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(currentIndex));
    }
  };

  const restoreNavigationState = async () => {
    setRestoring(true);

    const savedIndexString = await AsyncStorage.getItem(PERSISTENCE_KEY);

    try {
      const savedIndex = JSON.parse(savedIndexString || '');

      if (
        Number.isFinite(savedIndex) &&
        savedIndex >= 0 &&
        savedIndex < EXAMPLE_COMPONENTS.length
      ) {
        setIndex(savedIndex);
      }
    } catch (e) {
      // ignore
    }

    setRestoring(false);
  };

  const handleNavigate = (index: number) => {
    setIndex(index);
    persistNavigationState(index);
  };

  const handleNavigateBack = () => {
    handleNavigate(-1);
  };

  const renderItem = (component: ExampleComponentType, i: number) => (
    <TouchableOpacity
      key={i}
      style={styles.touchable}
      onPress={() => handleNavigate(i)}
    >
      <Text style={styles.item}>
        {i + 1}. {component.title}
      </Text>
    </TouchableOpacity>
  );

  if (restoring) {
    return null;
  }

  const ExampleComponent = EXAMPLE_COMPONENTS[index] || null;
  const backgroundColor = ExampleComponent?.backgroundColor
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
    <SafeAreaProvider>
      <StatusBar
        translucent
        barStyle={Platform.OS === 'ios' ? statusBarStyle : 'light-content'}
      />
      <View style={styles.container}>
        <SafeAreaView
          edges={['top']}
          style={[
            styles.appbar,
            backgroundColor ? { backgroundColor } : null,
            appbarElevation
              ? { elevation: appbarElevation, borderBottomWidth }
              : null,
          ]}
        >
          <View style={styles.appbarContent}>
            {index > -1 ? (
              <TouchableOpacity
                style={styles.button}
                onPress={handleNavigateBack}
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
              {index > -1 ? EXAMPLE_COMPONENTS[index].title : 'Examples'}
            </Text>
            {index > -1 ? <View style={styles.button} /> : null}
          </View>
        </SafeAreaView>
        <SafeAreaView edges={['bottom']} style={styles.safearea}>
          <View style={styles.content}>
            {index === -1 ? (
              <ScrollView>{EXAMPLE_COMPONENTS.map(renderItem)}</ScrollView>
            ) : ExampleComponent ? (
              <ExampleComponent />
            ) : null}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : undefined,
  },
  appbar: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  appbarContent: {
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
  safearea: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    backgroundColor: '#eceff1',
  },
});

registerRootComponent(ExampleList);
