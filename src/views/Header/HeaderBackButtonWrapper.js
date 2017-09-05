/* @flow */

import React, { Children } from 'react';
import {
  I18nManager,
  View,
  Image,
  Text,
  Platform,
  StyleSheet,
} from 'react-native';

import type { LayoutEvent } from '../TypeDefinition';

import TouchableItem from './TouchableItem';

type Props = {
  onPress?: () => void,
  pressColorAndroid?: ?string,
  children: React.Children<*>,
};

type DefaultProps = {
  pressColorAndroid: ?string,
};

type State = {};

class HeaderBackButtonWrapper
  extends React.PureComponent<DefaultProps, Props, State> {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    accessibilityLabel: 'Back',
  };

  state = {};

  render() {
    const {
      onPress,
      pressColorAndroid,
      accessibilityLabel,
    } = this.props;

    return (
      <TouchableItem
        accessibilityComponentType="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColorAndroid}
        style={styles.container}
        borderless
      >
        <View style={[styles.container, styles.backContainer]}>
          {Children.only(this.props.children)}
        </View>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  backContainer: Platform.OS === 'ios'
    ? {
        marginLeft: 10,
        marginRight: 22,
        marginVertical: 12,
        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
      }
    : {
        margin: 16,
        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
      },
});

export default HeaderBackButtonWrapper;
