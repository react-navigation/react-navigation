import * as React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { BlurView } from 'react-native-blur';
import { isIphoneX } from 'react-native-iphone-x-helper';
import {
  createStackNavigator,
  Header,
  HeaderStyleInterpolator,
  NavigationEventPayload,
  NavigationEventSubscription,
  NavigationScreenProp,
  NavigationState,
  TransitionConfig,
} from 'react-navigation';
import { Button } from './commonComponents/ButtonWithMargin';
import { HeaderButtons } from './commonComponents/HeaderButtons';
import SampleText from './SampleText';

interface MyNavScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
  banner: React.ReactNode;
}

class MyNavScreen extends React.Component<MyNavScreenProps> {
  render() {
    const { navigation, banner } = this.props;
    const { push, replace, popToTop, pop } = navigation;
    return (
      <ScrollView style={{ flex: 1 }} {...this.getHeaderInset()}>
        <SampleText>{banner}</SampleText>
        <Button
          onPress={() => push('Profile', { name: 'Jane' })}
          title="Push a profile screen"
        />
        <Button
          onPress={() => navigation.navigate('Photos', { name: 'Jane' })}
          title="Navigate to a photos screen"
        />
        <Button
          onPress={() => replace('Profile', { name: 'Lucy' })}
          title="Replace with profile"
        />
        <Button onPress={() => popToTop()} title="Pop to top" />
        <Button onPress={() => pop()} title="Pop" />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </ScrollView>
    );
  }

  // Inset to compensate for navigation bar being transparent.
  // And improved abstraction for this will be built in to react-navigation
  // at some point.

  getHeaderInset(): any {
    const NOTCH_HEIGHT = isIphoneX() ? 25 : 0;

    // $FlowIgnore: we will remove the HEIGHT static soon enough
    const BASE_HEADER_HEIGHT = Header.HEIGHT;

    const HEADER_HEIGHT =
      Platform.OS === 'ios'
        ? BASE_HEADER_HEIGHT + NOTCH_HEIGHT
        : BASE_HEADER_HEIGHT + 20;

    return Platform.select({
      android: {
        contentContainerStyle: {
          paddingTop: HEADER_HEIGHT,
        },
      },
      ios: {
        contentInset: { top: HEADER_HEIGHT },
        contentOffset: { y: -HEADER_HEIGHT },
      },
    });
  }
}

interface MyHomeScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}

class MyHomeScreen extends React.Component<MyHomeScreenProps> {
  static navigationOptions = {
    title: 'Welcome',
  };
  s0: NavigationEventSubscription | null = null;
  s1: NavigationEventSubscription | null = null;
  s2: NavigationEventSubscription | null = null;
  s3: NavigationEventSubscription | null = null;

  componentDidMount() {
    this.s0 = this.props.navigation.addListener('willFocus', this.onWF);
    this.s1 = this.props.navigation.addListener('didFocus', this.onDF);
    this.s2 = this.props.navigation.addListener('willBlur', this.onWB);
    this.s3 = this.props.navigation.addListener('didBlur', this.onDB);
  }
  componentWillUnmount() {
    this.s0!.remove();
    this.s1!.remove();
    this.s2!.remove();
    this.s3!.remove();
  }
  onWF = (a: NavigationEventPayload) => {
    console.log('willFocus HomeScreen', a);
  };
  onDF = (a: NavigationEventPayload) => {
    console.log('didFocus HomeScreen', a);
  };
  onWB = (a: NavigationEventPayload) => {
    console.log('willBlur HomeScreen', a);
  };
  onDB = (a: NavigationEventPayload) => {
    console.log('didBlur HomeScreen', a);
  };

  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="Home Screen" navigation={navigation} />;
  }
}

interface MyPhotosScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}
class MyPhotosScreen extends React.Component<MyPhotosScreenProps> {
  static navigationOptions = {
    title: 'Photos',
  };
  s0: NavigationEventSubscription | null = null;
  s1: NavigationEventSubscription | null = null;
  s2: NavigationEventSubscription | null = null;
  s3: NavigationEventSubscription | null = null;

  componentDidMount() {
    this.s0 = this.props.navigation.addListener('willFocus', this.onWF);
    this.s1 = this.props.navigation.addListener('didFocus', this.onDF);
    this.s2 = this.props.navigation.addListener('willBlur', this.onWB);
    this.s3 = this.props.navigation.addListener('didBlur', this.onDB);
  }
  componentWillUnmount() {
    this.s0!.remove();
    this.s1!.remove();
    this.s2!.remove();
    this.s3!.remove();
  }
  onWF = (a: NavigationEventPayload) => {
    console.log('willFocus PhotosScreen', a);
  };
  onDF = (a: NavigationEventPayload) => {
    console.log('didFocus PhotosScreen', a);
  };
  onWB = (a: NavigationEventPayload) => {
    console.log('willBlur PhotosScreen', a);
  };
  onDB = (a: NavigationEventPayload) => {
    console.log('didBlur PhotosScreen', a);
  };

  render() {
    const { navigation } = this.props;
    return (
      <MyNavScreen
        banner={`${navigation.state.params!.name}'s Photos`}
        navigation={navigation}
      />
    );
  }
}

const MyProfileScreen = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => (
  <MyNavScreen
    banner={`${navigation.state.params!.mode === 'edit' ? 'Now Editing ' : ''}${
      navigation.state.params!.name
    }'s Profile`}
    navigation={navigation}
  />
);

MyProfileScreen.navigationOptions = (props: {
  navigation: NavigationScreenProp<NavigationState>;
}) => {
  const { navigation } = props;
  const { state, setParams } = navigation;
  const { params } = state;
  return {
    headerBackImage: params!.headerBackImage,
    // Render a button on the right side of the header.
    // When pressed switches the screen to edit mode.
    headerRight: (
      <HeaderButtons>
        <HeaderButtons.Item
          title={params!.mode === 'edit' ? 'Done' : 'Edit'}
          onPress={() =>
            setParams({ mode: params!.mode === 'edit' ? '' : 'edit' })
          }
        />
      </HeaderButtons>
    ),
    headerTitle: `${params!.name}'s Profile!`,
  };
};

const StackWithTranslucentHeader = createStackNavigator(
  {
    Home: {
      screen: MyHomeScreen,
    },
    Photos: {
      path: 'photos/:name',
      screen: MyPhotosScreen,
    },
    Profile: {
      path: 'people/:name',
      screen: MyProfileScreen,
    },
  },
  {
    defaultNavigationOptions: {
      headerBackground:
      Platform.OS === 'ios' ? (
        <BlurView style={{ flex: 1 }} blurType="light" />
      ) : (
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.7)' }} />
      ),
      headerStyle: {
        borderBottomColor: '#A7A7AA',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      headerTransparent: true,
    },
    headerTransitionPreset: 'uikit',
    // You can leave this out if you don't want the card shadow to
    // be visible through the header
    transitionConfig: () =>
      ({
        headerBackgroundInterpolator:
          HeaderStyleInterpolator.forBackgroundWithTranslation,
      } as TransitionConfig),
  }
);

export default StackWithTranslucentHeader;
