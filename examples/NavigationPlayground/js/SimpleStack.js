/**
 * @flow
 */

import React from 'react';
import { Button, ScrollView, StatusBar } from 'react-native';
import { StackNavigator, SafeAreaView } from 'react-navigation';
import SampleText from './SampleText';

class MyNavScreen extends React.Component {
  render() {
    const { navigation, banner } = this.props;
    return (
      <SafeAreaView>
        <SampleText>{banner}</SampleText>
        <Button
          onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
          title="Go to a profile screen"
        />
        <Button
          onPress={() => navigation.navigate('Photos', { name: 'Jane' })}
          title="Go to a photos screen"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

class MyHomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
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
    console.log('_onWillFocus HomeScreen', a);
  };
  _onDF = a => {
    console.log('_onDidFocus HomeScreen', a);
  };
  _onWB = a => {
    console.log('_onWillBlur HomeScreen', a);
  };
  _onDB = a => {
    console.log('_onDidBlur HomeScreen', a);
  };

  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="Home Screen" navigation={navigation} />;
  }
}

class MyPhotosScreen extends React.Component {
  static navigationOptions = {
    title: 'Photos',
  };
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
    console.log('_onWillFocus PhotosScreen', a);
  };
  _onDF = a => {
    console.log('_onDidFocus PhotosScreen', a);
  };
  _onWB = a => {
    console.log('_onWillBlur PhotosScreen', a);
  };
  _onDB = a => {
    console.log('_onDidBlur PhotosScreen', a);
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
    banner={`${navigation.state.params.mode === 'edit'
      ? 'Now Editing '
      : ''}${navigation.state.params.name}'s Profile`}
    navigation={navigation}
  />
);

MyProfileScreen.navigationOptions = props => {
  const { navigation } = props;
  const { state, setParams } = navigation;
  const { params } = state;
  return {
    headerTitle: `${params.name}'s Profile!`,
    // Render a button on the right side of the header.
    // When pressed switches the screen to edit mode.
    headerRight: (
      <Button
        title={params.mode === 'edit' ? 'Done' : 'Edit'}
        onPress={() =>
          setParams({ mode: params.mode === 'edit' ? '' : 'edit' })}
      />
    ),
  };
};

const SimpleStack = StackNavigator({
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
