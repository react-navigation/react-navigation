import React, { Component } from "react";
import { Button } from "react-native";
import Styles from "../../styles/card.style";
import { headerStyle, titleStyle } from "../../styles/header.style";
import ButtonRight from "../header/button-right";

class Settings extends Component {

  static navigationOptions = ({ navigation, screenProps}) => ({
    
    title: "Settings",
    headerStyle,
    headerTitleStyle: titleStyle,
    headerRight: <ButtonRight icon="done" onPress={() => navigation.goBack()} />,
    headerLeft: null
  });

  render() {

    const { navigate, goBack } = this.props.navigation;

    return <Button onPress={() => goBack()} title="Go Back" />;
  }
}

export default Settings;
