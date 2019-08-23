import * as React from 'react';
import { StatusBar, Text, TextInput } from 'react-native';
import { ThemeContext, ThemeColors } from '@react-navigation/core';

class ThemedText extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (
      <Text
        {...this.props}
        style={[{ color: ThemeColors[this.context].label }, this.props.style]}
      />
    );
  }
}

class ThemedTextInput extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (
      <TextInput
        {...this.props}
        placeholderTextColor={
          this.context === 'dark' ? '#ebebf54c' : '#3c3c434c'
        }
        style={[{ color: ThemeColors[this.context].label }, this.props.style]}
      />
    );
  }
}

class ThemedStatusBar extends React.Component {
  static contextType = ThemeContext;

  render() {
    let { barStyle, ...props } = this.props;

    return (
      <StatusBar
        barStyle={
          barStyle
            ? barStyle
            : this.context === 'dark'
            ? 'light-content'
            : 'default'
        }
        {...props}
      />
    );
  }
}

export default {
  Text: ThemedText,
  StatusBar: ThemedStatusBar,
  TextInput: ThemedTextInput,
};
