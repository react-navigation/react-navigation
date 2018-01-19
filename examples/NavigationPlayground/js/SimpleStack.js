/**
 * @flow
 */

import React from "react";
import { Button, ScrollView, StatusBar } from "react-native";
import { StackNavigator, SafeAreaView } from "react-navigation";
import SampleText from "./SampleText";

class MyNavScreen extends React.Component {
  render() {
    const { navigation, banner } = this.props;
    return (
      <SafeAreaView>
        <SampleText>{banner}</SampleText>
        <Button
          onPress={() => navigation.navigate("Profile", { name: "Jane" })}
          title="Go to a profile screen"
        />
        <Button
          onPress={() => navigation.navigate("Photos", { name: "Jane" })}
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
    title: "Welcome"
  };
  componentDidMount() {
    this._s = this.props.navigation.addListener("onAction", this._onNavAction);
  }
  componentWillUnmount() {
    this._s.remove();
  }
  _onNavAction = a => {
    console.log("home action", a);
  };
  render() {
    const { navigation } = this.props;
    return <MyNavScreen banner="Home Screen" navigation={navigation} />;
  }
}

const MyPhotosScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${navigation.state.params.name}'s Photos`}
    navigation={navigation}
  />
);
MyPhotosScreen.navigationOptions = {
  title: "Photos"
};

const MyProfileScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${navigation.state.params.mode === "edit"
      ? "Now Editing "
      : ""}${navigation.state.params.name}'s Profile`}
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
        title={params.mode === "edit" ? "Done" : "Edit"}
        onPress={() =>
          setParams({ mode: params.mode === "edit" ? "" : "edit" })}
      />
    )
  };
};

const SimpleStack = StackNavigator({
  Home: {
    screen: MyHomeScreen
  },
  Profile: {
    path: "people/:name",
    screen: MyProfileScreen
  },
  Photos: {
    path: "photos/:name",
    screen: MyPhotosScreen
  }
});

export default SimpleStack;
