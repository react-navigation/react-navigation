import React, { Component } from "react";
import { Button } from "react-native";
import Styles from "../../styles/card.style";
import { headerStyle, titleStyle } from "../../styles/header.style";
import ButtonRight from "../header/button-right";

class Settings extends Component {

  static navigationOptions = {
    
    title: "Settings",
    header: ({ goBack }) => ({
      style: headerStyle,
      titleStyle: titleStyle,
      right: <ButtonRight icon="done" onPress={() => goBack()} />,
      left: null
    })
  };

  render() {

    const { navigate, goBack } = this.props.navigation;

    return <Button onPress={() => goBack()} title="Go Back" />;
  }
}

export default Settings;
