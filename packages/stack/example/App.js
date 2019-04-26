import * as React from 'react';
import { Asset } from 'expo';
import { FlatList, I18nManager } from 'react-native';
import {
  createAppContainer,
  SafeAreaView,
  ScrollView,
} from '@react-navigation/native';
import {
  Assets as StackAssets,
  createStackNavigator,
} from 'react-navigation-stack';
import { List, Divider } from 'react-native-paper';

import FullScreen from './src/FullScreen';
import SimpleStack from './src/SimpleStack';
import ImageStack from './src/ImageStack';
import TransparentStack from './src/TransparentStack';
import ModalStack from './src/ModalStack';
import LifecycleInteraction from './src/LifecycleInteraction';
import GestureInteraction from './src/GestureInteraction';
import SwitchWithStacks from './src/SwitchWithStacks';
import StackWithDrawer from './src/StackWithDrawer';
import HeaderPreset from './src/HeaderPreset';
import {
  HeaderBackgroundDefault,
  HeaderBackgroundTranslate,
  HeaderBackgroundFade,
} from './src/HeaderBackgrounds';

// Comment the following two lines to stop using react-native-screens
import { useScreens } from 'react-native-screens';

// Uncomment the following line to force RTL. Requires closing and re-opening
// your app after you first load it with this option enabled.
I18nManager.forceRTL(false);

const data = [
  { component: SimpleStack, title: 'Simple', routeName: 'SimpleStack' },
  { component: HeaderPreset, title: 'UIKit Preset', routeName: 'UIKit' },
  { component: ImageStack, title: 'Image', routeName: 'ImageStack' },
  { component: ModalStack, title: 'Modal', routeName: 'ModalStack' },
  { component: FullScreen, title: 'Full Screen', routeName: 'FullScreen' },
  {
    component: LifecycleInteraction,
    title: 'Lifecycle',
    routeName: 'LifecycleStack',
  },
  {
    component: TransparentStack,
    title: 'Transparent',
    routeName: 'TransparentStack',
  },
  {
    component: GestureInteraction,
    title: 'Gesture Interaction',
    routeName: 'GestureInteraction',
  },
  {
    component: SwitchWithStacks,
    title: 'Switch with Stacks',
    routeName: 'SwitchWithStacks',
  },
  {
    component: StackWithDrawer,
    title: 'Stack with drawer inside',
    routeName: 'StackWithDrawer',
  },
  {
    component: HeaderBackgroundDefault,
    title: 'Header background (default transition)',
    routeName: 'HeaderBackgroundDefault',
  },
  {
    component: HeaderBackgroundFade,
    title: 'Header background (fade transition)',
    routeName: 'HeaderBackgroundFade',
  },
  {
    component: HeaderBackgroundTranslate,
    title: 'Header background (translate transition)',
    routeName: 'HeaderBackgroundTranslate',
  },
];

// Cache images
Asset.loadAsync(StackAssets);

class Home extends React.Component {
  static navigationOptions = {
    title: 'Examples',
  };

  _renderItem = ({ item }) => (
    <List.Item
      title={item.title}
      onPress={() => this.props.navigation.navigate(item.routeName)}
    />
  );

  _keyExtractor = item => item.routeName;

  render() {
    return (
      <FlatList
        ItemSeparatorComponent={Divider}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        renderScrollComponent={props => <SafeAreaScrollView {...props} />}
        data={data}
        style={{ backgroundColor: '#fff' }}
      />
    );
  }
}

class SafeAreaScrollView extends React.Component {
  render() {
    let { children, ...scrollViewProps } = this.props;
    return (
      <ScrollView {...scrollViewProps}>
        <SafeAreaView forceInset={{ top: 'never' }}>{children}</SafeAreaView>
      </ScrollView>
    );
  }
}

const Root = createStackNavigator(
  {
    Home: createStackNavigator({ Home }),
    ...data.reduce((acc, it) => {
      acc[it.routeName] = {
        screen: it.component,
        navigationOptions: {
          title: it.title,
        },
      };

      return acc;
    }, {}),
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

useScreens();
export default createAppContainer(Root);

// Uncomment this to test immediate transitions
// import ImmediateTransition from './src/ImmediateTransition';
// Expo.registerRootComponent(ImmediateTransition);
