import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Styles from "../../styles/tab.style";

class Tab extends Component {
  render() {
    const { tintColor, icon } = this.props;

    return <Icon name={icon} style={[styles.icon, { color: tintColor }]} />;
  }
}

const styles = StyleSheet.create({ ...Styles });

export default Tab;
