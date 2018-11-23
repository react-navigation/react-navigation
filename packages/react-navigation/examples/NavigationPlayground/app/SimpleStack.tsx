// tslint:disable no-unused-expression

import * as React from 'react';
import { StatusBar } from 'react-native';
import {
  createStackNavigator,
  NavigationActions,
  NavigationEventPayload,
  NavigationEventSubscription,
  NavigationScreenProp,
  NavigationState,
  NavigationStateRoute,
  SafeAreaView,
  StackActions,
  withNavigation,
} from 'react-navigation';
import { Button } from './commonComponents/ButtonWithMargin';
import { HeaderButtons } from './commonComponents/HeaderButtons';
import SampleText from './SampleText';

const DEBUG = false;

interface MyNavScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
  banner: React.ReactNode;
}

interface BackButtonProps {
  navigation: NavigationScreenProp<NavigationStateRoute<any>>;
}

class MyBackButton extends React.Component<BackButtonProps, any> {
  render() {
    return (
      <HeaderButtons>
        <HeaderButtons.Item title="Back" onPress={this.navigateBack} />
      </HeaderButtons>
    );
  }

  navigateBack = () => {
    this.props.navigation.goBack(null);
  };
}

const MyBackButtonWithNavigation: any = withNavigation(MyBackButton);

class MyNavScreen extends React.Component<MyNavScreenProps> {
  render() {
    const { navigation, banner } = this.props;
    const { push, replace, popToTop, pop, dismiss } = navigation;
    return (
      <SafeAreaView forceInset={{ top: 'never' }}>
        <SampleText>{banner}</SampleText>
        <Button
          onPress={() => push('Profile', { name: 'Jane' })}
          title="Push a profile screen"
        />
        <Button
          onPress={() =>
            navigation.dispatch(
              StackActions.reset({
                actions: [
                  NavigationActions.navigate({
                    params: { name: 'Jane' },
                    routeName: 'Photos',
                  }),
                ],
                index: 0,
              })
            )
          }
          title="Reset photos"
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
        <Button
          onPress={() => {
            if (navigation.goBack()) {
              console.log('goBack handled');
            } else {
              console.log('goBack unhandled');
            }
          }}
          title="Go back"
        />
        <Button onPress={() => dismiss()} title="Dismiss" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
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
    DEBUG && console.log('willFocus HomeScreen', a);
  };
  onDF = (a: NavigationEventPayload) => {
    DEBUG && console.log('didFocus HomeScreen', a);
  };
  onWB = (a: NavigationEventPayload) => {
    DEBUG && console.log('willBlur HomeScreen', a);
  };
  onDB = (a: NavigationEventPayload) => {
    DEBUG && console.log('didBlur HomeScreen', a);
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
    headerLeft: <MyBackButtonWithNavigation />,
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
    DEBUG && console.log('willFocus PhotosScreen', a);
  };
  onDF = (a: NavigationEventPayload) => {
    DEBUG && console.log('didFocus PhotosScreen', a);
  };
  onWB = (a: NavigationEventPayload) => {
    DEBUG && console.log('willBlur PhotosScreen', a);
  };
  onDB = (a: NavigationEventPayload) => {
    DEBUG && console.log('didBlur PhotosScreen', a);
  };

  render() {
    const { navigation } = this.props;
    return (
      <MyNavScreen
        banner={`${navigation.getParam('name')}'s Photos`}
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
    banner={`${
      navigation.getParam('mode') === 'edit' ? 'Now Editing ' : ''
    }${navigation.getParam('name')}'s Profile`}
    navigation={navigation}
  />
);

MyProfileScreen.navigationOptions = (props: MyHomeScreenProps) => {
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

const SimpleStack = createStackNavigator(
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
    // headerLayoutPreset: 'center',
  }
);

export default SimpleStack;
