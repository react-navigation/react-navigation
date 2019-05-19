import React from 'react';
import { AccessibilityState, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ButtonProps {
  /**
   * Text to display inside the button
   */
  title: string,

  /**
   * Handler to be called when the user taps the button
   */
  onPress: (event?: any) => void,

  /**
   * Color of the text (iOS), or background color of the button (Android)
   */
  color?: string,

  /**
   * TV preferred focus (see documentation for the View component).
   */
  hasTVPreferredFocus?: boolean,

  /**
   * Text to display for blindness accessibility features
   */
  accessibilityLabel?: string,

  /**
   * If true, disable all interactions for this component.
   */
  disabled?: boolean,

  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string,
};

/**
 * A basic button component that should render nicely on any platform. Supports
 * a minimal level of customization.
 *
 * <center><img src="img/buttonExample.png"></img></center>
 *
 * This button is built using TouchableOpacity
 *
 * Example usage:
 *
 * ```
 * import { Button } from 'react-native';
 * ...
 *
 * <Button
 *   onPress={onPressLearnMore}
 *   title="Learn More"
 *   color="#841584"
 *   accessibilityLabel="Learn more about this purple button"
 * />
 * ```
 *
 */

export default class Button extends React.Component<ButtonProps> {
  render() {
    const {
      accessibilityLabel,
      color,
      onPress,
      title,
      disabled,
      testID,
    } = this.props;
    const buttonStyles: any = [styles.button];
    const textStyles: any = [styles.text];
    if (color) {
      if (Platform.OS === 'ios') {
        textStyles.push({ color });
      } else {
        buttonStyles.push({ backgroundColor: color });
      }
    }
    const accessibilityStates: AccessibilityState[] = [];
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
      accessibilityStates.push('disabled');
    }
    const formattedTitle =
      Platform.OS === 'android' ? title.toUpperCase() : title;
    return (
      <TouchableOpacity
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityStates={accessibilityStates}
        testID={testID}
        disabled={disabled}
        onPress={onPress}
      >
        <View style={buttonStyles}>
          <Text style={textStyles}>
            {formattedTitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: Platform.select({
    android: {
      backgroundColor: '#2196F3',
      borderRadius: 2,
      elevation: 4,
      // Material design blue from https://material.google.com/style/color.html#color-color-palette
    },
    ios: {},
  }),
  buttonDisabled: Platform.select({
    android: {
      backgroundColor: '#dfdfdf',
      elevation: 0,
    },
    ios: {},
  }),
  text: {
    padding: 8,
    textAlign: 'center',
    ...Platform.select({
      android: {
        color: 'white',
        fontWeight: '500',
      },
      ios: {
        // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
        color: '#007AFF',
        fontSize: 18,
      },
    }),
  },
  textDisabled: Platform.select({
    android: {
      color: '#a1a1a1',
    },
    ios: {
      color: '#cdcdcd',
    },
  }),
});
