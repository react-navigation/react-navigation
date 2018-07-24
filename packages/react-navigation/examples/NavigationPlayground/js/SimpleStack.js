/**
 * @flow
 */

import type {
  NavigationScreenProp,
  NavigationState,
  NavigationStateRoute,
  NavigationEventSubscription,
} from 'react-navigation';

import * as React from 'react';
import { Platform, ScrollView, StatusBar } from 'react-native';
import {
  createStackNavigator,
  SafeAreaView,
  withNavigation,
  NavigationActions,
  StackActions,
} from 'react-navigation';
import invariant from 'invariant';

import SampleText from './SampleText';
import { Button } from './commonComponents/ButtonWithMargin';
import { HeaderButtons } from './commonComponents/HeaderButtons';

const DEBUG = false;

type MyNavScreenProps = {
  navigation: NavigationScreenProp<NavigationState>,
  banner: React.Node,
};

type BackButtonProps = {
  navigation: NavigationScreenProp<NavigationStateRoute>,
};

class MyBackButton extends React.Component<BackButtonProps, any> {
  render() {
    return (
      <HeaderButtons>
        <HeaderButtons.Item title="Back" onPress={this._navigateBack} />
      </HeaderButtons>
    );
  }

  _navigateBack = () => {
    this.props.navigation.goBack(null);
  };
}

const MyBackButtonWithNavigation = withNavigation(MyBackButton);

class MyNavScreen extends React.Component<MyNavScreenProps> {
  render() {
    const { navigation, banner } = this.props;
    const { push, replace, popToTop, pop, dismiss } = navigation;
    invariant(
      push && replace && popToTop && pop && dismiss,
      'missing action creators for StackNavigator'
    );
    return (
      <SafeAreaView>
        <SampleText>{banner}</SampleText>
        <Button
          onPress={() => push('Profile', { name: 'Jane' })}
          title="Push a profile screen"
        />
        <Button
          onPress={() =>
            navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'Photos',
                    params: { name: 'Jane' },
                  }),
                ],
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

type MyHomeScreenProps = {
  navigation: NavigationScreenProp<NavigationState>,
};

class MyHomeScreen extends React.Component<MyHomeScreenProps> {
  static navigationOptions = {
    title: 'Welcome',
  };
  _s0: NavigationEventSubscription;
  _s1: NavigationEventSubscription;
  _s2: NavigationEventSubscription;
  _s3: NavigationEventSubscription;

  componentDidMount() {
    this._s0 = this.props.navigation.addListener('willFocus', this._onWF);
    this._s1 = this.props.navigation.addListener('didFocus', this._onDF);
    this._s2 = this.props.navigation.addListener('willBlur', this._onWB);
    this._s3 = this.props.navigation.addListener('didBlur', this._onDB);
  }
  componentWillUnmount() {
    this._s0.remove();
    this._s1.remove();
    this._s2.remove();
    this._s3.remove();
  }
  _onWF = a => {
    DEBUG && console.log('_willFocus HomeScreen', a);
  };
  _onDF = a => {
    DEBUG && console.log('_didFocus HomeScreen', a);
  };
  _onWB = a => {
    DEBUG && console.log('_willBlur HomeScreen', a);
  };
  _onDB = a => {
    DEBUG && console.log('_didBlur HomeScreen', a);
  };

  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="Home Screen" navigation={navigation} />;
  }
}

type MyPhotosScreenProps = {
  navigation: NavigationScreenProp<NavigationState>,
};
class MyPhotosScreen extends React.Component<MyPhotosScreenProps> {
  static navigationOptions = {
    title: 'Photos',
    headerLeft: <MyBackButtonWithNavigation />,
  };
  _s0: NavigationEventSubscription;
  _s1: NavigationEventSubscription;
  _s2: NavigationEventSubscription;
  _s3: NavigationEventSubscription;

  componentDidMount() {
    this._s0 = this.props.navigation.addListener('willFocus', this._onWF);
    this._s1 = this.props.navigation.addListener('didFocus', this._onDF);
    this._s2 = this.props.navigation.addListener('willBlur', this._onWB);
    this._s3 = this.props.navigation.addListener('didBlur', this._onDB);
  }
  componentWillUnmount() {
    this._s0.remove();
    this._s1.remove();
    this._s2.remove();
    this._s3.remove();
  }
  _onWF = a => {
    DEBUG && console.log('_willFocus PhotosScreen', a);
  };
  _onDF = a => {
    DEBUG && console.log('_didFocus PhotosScreen', a);
  };
  _onWB = a => {
    DEBUG && console.log('_willBlur PhotosScreen', a);
  };
  _onDB = a => {
    DEBUG && console.log('_didBlur PhotosScreen', a);
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

const MyProfileScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${
      navigation.getParam('mode') === 'edit' ? 'Now Editing ' : ''
    }${navigation.getParam('name')}'s Profile`}
    navigation={navigation}
  />
);

MyProfileScreen.navigationOptions = props => {
  const { navigation } = props;
  const { state, setParams } = navigation;
  const { params } = state;
  return {
    headerBackImage: params.headerBackImage,
    headerTitle: `${params.name}'s Profile!`,
    // Render a button on the right side of the header.
    // When pressed switches the screen to edit mode.
    headerRight: (
      <HeaderButtons>
        <HeaderButtons.Item
          title={params.mode === 'edit' ? 'Done' : 'Edit'}
          onPress={() =>
            setParams({ mode: params.mode === 'edit' ? '' : 'edit' })
          }
        />
      </HeaderButtons>
    ),
  };
};

const SimpleStack = createStackNavigator(
  {
    Home: {
      screen: MyHomeScreen,
    },
    Profile: {
      path: 'people/:name',
      screen: MyProfileScreen,
    },
    Photos: {
      path: 'photos/:name',
      screen: MyPhotosScreen,
    },
  },
  {
    // headerLayoutPreset: 'center',
  }
);

export default SimpleStack;
