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
import { ScrollView, StatusBar } from 'react-native';
import {
  createStackNavigator,
  SafeAreaView,
  withNavigation,
} from 'react-navigation';
import SampleText from './SampleText';
import { Button } from './commonComponents/ButtonWithMargin';
import { HeaderButtons } from './commonComponents/HeaderButtons';

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
    return (
      <SafeAreaView>
        <SampleText>{banner}</SampleText>
        <Button
          onPress={() => navigation.push('Profile', { name: 'Jane' })}
          title="Push a profile screen"
        />
        <Button
          onPress={() => navigation.navigate('Photos', { name: 'Jane' })}
          title="Navigate to a photos screen"
        />
        <Button
          onPress={() => navigation.replace('Profile', { name: 'Lucy' })}
          title="Replace with profile"
        />
        <Button onPress={() => navigation.popToTop()} title="Pop to top" />
        <Button onPress={() => navigation.pop()} title="Pop" />
        <Button onPress={() => navigation.goBack()} title="Go back" />
        <Button onPress={() => navigation.dismiss()} title="Dismiss" />
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
    console.log('_willFocus HomeScreen', a);
  };
  _onDF = a => {
    console.log('_didFocus HomeScreen', a);
  };
  _onWB = a => {
    console.log('_willBlur HomeScreen', a);
  };
  _onDB = a => {
    console.log('_didBlur HomeScreen', a);
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
    console.log('_willFocus PhotosScreen', a);
  };
  _onDF = a => {
    console.log('_didFocus PhotosScreen', a);
  };
  _onWB = a => {
    console.log('_willBlur PhotosScreen', a);
  };
  _onDB = a => {
    console.log('_didBlur PhotosScreen', a);
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

const SimpleStack = createStackNavigator({
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
});

export default SimpleStack;
