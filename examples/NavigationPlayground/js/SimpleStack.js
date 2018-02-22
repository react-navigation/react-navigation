/**
 * @flow
 */

import type {
  NavigationScreenProp,
  NavigationEventSubscription,
} from 'react-navigation';

import * as React from 'react';
import { BlurView, Constants } from 'expo';
import { Button, Platform, ScrollView, StatusBar, View } from 'react-native';
import { Header, StackNavigator, withNavigation } from 'react-navigation';
import SampleText from './SampleText';

type MyNavScreenProps = {
  navigation: NavigationScreenProp<*>,
  banner: React.Node,
};

class MyBackButton extends React.Component<any, any> {
  render() {
    return <Button onPress={this._navigateBack} title="Custom Back" />;
  }

  _navigateBack = () => {
    this.props.navigation.goBack(null);
  };
}

const MyBackButtonWithNavigation = withNavigation(MyBackButton);

class MyNavScreen extends React.Component<MyNavScreenProps> {
  render() {
    const headerInset = Platform.select({
      ios: {
        contentInset: { top: Header.HEIGHT_INCLUDING_SAFE_AREA },
        contentOffset: { y: -Header.HEIGHT_INCLUDING_SAFE_AREA },
      },
      android: {
        contentContainerStyle: {
          paddingTop:
            Header.HEIGHT_INCLUDING_SAFE_AREA + Constants.statusBarHeight,
        },
      },
    });

    const { navigation, banner } = this.props;
    return (
      <ScrollView style={{ flex: 1 }} {...headerInset}>
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
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </ScrollView>
    );
  }
}

type MyHomeScreenProps = {
  navigation: NavigationScreenProp<*>,
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
  navigation: NavigationScreenProp<*>,
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
        banner={`${navigation.state.params.name}'s Photos`}
        navigation={navigation}
      />
    );
  }
}

const MyProfileScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${navigation.state.params.mode === 'edit' ? 'Now Editing ' : ''}${
      navigation.state.params.name
    }'s Profile`}
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
      <Button
        title={params.mode === 'edit' ? 'Done' : 'Edit'}
        onPress={() =>
          setParams({ mode: params.mode === 'edit' ? '' : 'edit' })
        }
      />
    ),
  };
};

const SimpleStack = StackNavigator(
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
    navigationOptions: {
      headerTransparent: true,
      headerBackground: Platform.select({
        ios: <BlurView style={{ flex: 1 }} intensity={98} />,
        android: (
          <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.7)' }} />
        ),
      }),
    },
  }
);

export default SimpleStack;
