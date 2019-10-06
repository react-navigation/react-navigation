import * as React from 'react';
import { Asset } from 'expo-asset';
import { FlatList, I18nManager } from 'react-native';
import { createAppContainer, SafeAreaView, ScrollView } from 'react-navigation';
import {
  Assets as StackAssets,
  createStackNavigator,
  NavigationStackScreenProps,
  NavigationStackOptions,
} from 'react-navigation-stack';
import { List, Divider } from 'react-native-paper';

import FullScreen from './src/FullScreen';
import SimpleStack from './src/SimpleStack';
import RevealStack from './src/RevealStack';
import ImageStack from './src/ImageStack';
import TransparentStack from './src/TransparentStack';
import ModalStack from './src/ModalStack';
import ModalPresentation from './src/ModalPresentation';
import PerScreenTransitions from './src/PerScreenTransitions';
import LifecycleInteraction from './src/LifecycleInteraction';
import GestureInteraction from './src/GestureInteraction';
import SwitchWithStacks from './src/SwitchWithStacks';
import StackWithDrawer from './src/StackWithDrawer';
import StackWithInput from './src/StackWithInput';
import HeaderPreset from './src/HeaderPreset';
import {
  HeaderBackgroundDefault,
  HeaderBackgroundFade,
} from './src/HeaderBackgrounds';
import DragLimitedToModal from './src/DragLimitedToModal';

// Comment the following two lines to stop using react-native-screens
// eslint-disable-next-line import/no-unresolved
import { useScreens } from 'react-native-screens';

// eslint-disable-next-line react-hooks/rules-of-hooks
useScreens(true);

// Change `false` to `true` to force RTL. Requires closing and re-opening
// your app after you first load it with this option enabled.
I18nManager.forceRTL(false);

type Item = {
  component: React.ComponentType<any>;
  title: string;
  routeName: string;
};

const data: Item[] = [
  { component: SimpleStack, title: 'Simple', routeName: 'SimpleStack' },
  { component: HeaderPreset, title: 'UIKit Preset', routeName: 'UIKit' },
  { component: RevealStack, title: 'Reveal Preset', routeName: 'Reveal' },
  { component: ImageStack, title: 'Image', routeName: 'ImageStack' },
  { component: ModalStack, title: 'Modal', routeName: 'ModalStack' },
  {
    component: ModalPresentation,
    title: 'Modal (iOS style)',
    routeName: 'ModalPresentation',
  },
  {
    component: PerScreenTransitions,
    title: 'Per screen transitions',
    routeName: 'PerScreenTransitions',
  },
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
    component: StackWithInput,
    title: 'Stack with text input',
    routeName: 'StackWithInput',
  },
  {
    component: HeaderBackgroundDefault,
    title: 'Header background (UIKit transition)',
    routeName: 'HeaderBackgroundDefault',
  },
  {
    component: HeaderBackgroundFade,
    title: 'Header background (fade transition)',
    routeName: 'HeaderBackgroundFade',
  },
  {
    component: DragLimitedToModal,
    title: 'Drag limited to modal',
    routeName: 'DragLimitedToModal',
  },
];

// Cache images
Asset.loadAsync(StackAssets);

class Home extends React.Component<NavigationStackScreenProps> {
  static navigationOptions = {
    title: 'Examples',
  };

  _renderItem = ({ item }: { item: Item }) => (
    <List.Item
      title={item.title}
      onPress={() => this.props.navigation.navigate(item.routeName)}
    />
  );

  _keyExtractor = (item: Item) => item.routeName;

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
    ...data.reduce<{
      [key: string]: {
        screen: React.ComponentType<any>;
        navigationOptions: NavigationStackOptions;
      };
    }>((acc, it) => {
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

export default createAppContainer(Root);

// Uncomment this to test immediate transitions
// import ImmediateTransition from './src/ImmediateTransition';
// Expo.registerRootComponent(ImmediateTransition);
