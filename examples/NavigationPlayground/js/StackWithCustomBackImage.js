/**
 * @flow
 */

import type {
  NavigationScreenProp,
  NavigationEventSubscription,
} from 'react-navigation';

import * as React from 'react';
import { Image, Button, StatusBar, StyleSheet } from 'react-native';
import { StackNavigator, SafeAreaView } from 'react-navigation';
import SampleText from './SampleText';

type MyNavScreenProps = {
  navigation: NavigationScreenProp<*>,
  banner: React.Node,
};

class MyCustomBackImage extends React.Component<any, any> {
  render() {
    const source = require('./assets/back.png');
    return (
      <Image
        source={source}
        style={[styles.myCustomBackImage, this.props.style]}
      />
    );
  }
}

class MyNavScreen extends React.Component<MyNavScreenProps> {
  render() {
    const { navigation, banner } = this.props;
    return (
      <SafeAreaView>
        <SampleText>{banner}</SampleText>
        <Button
          onPress={() => navigation.navigate('Photos', { name: 'Jane' })}
          title="Navigate to a photos screen"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

type MyHomeScreenProps = {
  navigation: NavigationScreenProp<*>,
};

class MyHomeScreen extends React.Component<MyHomeScreenProps> {
  static navigationOptions = {
    title: 'Welcome',
    headerBackTitle: null,
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
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}'s photos`,
    headerBackTitle: null,
  });
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
      <SafeAreaView>
        <SampleText>{`${navigation.state.params.name}'s Photos`}</SampleText>
        <Button
          onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
          title="Navigate to a profile screen"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

type MyProfileScreenProps = {
  navigation: NavigationScreenProp<*>,
};
class MyProfileScreen extends React.Component<MyProfileScreenProps> {
  static navigationOptions = ({ navigation }) => ({
    title: 'Profile',
    backImage: <MyCustomBackImage style={styles.myCustomBackImageAlt} />,
  });
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
      <SafeAreaView>
        <SampleText>{`${navigation.state.params.name}'s Profile`}</SampleText>
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

const SimpleStack = StackNavigator(
  {
    Home: {
      screen: MyHomeScreen,
    },
    Photos: {
      path: 'photos/:name',
      screen: MyPhotosScreen,
    },
    Profile: {
      path: 'profile/:name',
      screen: MyProfileScreen,
    },
  },
  {
    navigationOptions: {
      backImage: MyCustomBackImage,
    },
  }
);

export default SimpleStack;

const styles = StyleSheet.create({
  myCustomBackImage: {
    height: 14.5,
    width: 24,
    marginLeft: 9,
    marginRight: 12,
    marginVertical: 12,
    resizeMode: 'contain',
  },
  myCustomBackImageAlt: {
    tintColor: '#f00',
  },
});
