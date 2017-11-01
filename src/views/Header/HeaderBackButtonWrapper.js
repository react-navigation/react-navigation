/* @flow */

import * as React from 'react';
import { I18nManager, View, Platform, StyleSheet } from 'react-native';

import TouchableItem from '../TouchableItem';

type Props = {
  onPress?: () => void,
  pressColorAndroid?: string,
  accessibilityLabel?: string,
  children: React.ChildrenArray<*>,
};

type DefaultProps = {
  pressColorAndroid: ?string,
  accessibilityLabel: string,
};

type State = {};

class HeaderBackButtonWrapper extends React.PureComponent<
  DefaultProps,
  Props,
  State
> {
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
      children,
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
        <View style={[styles.container, styles.backContainer]}>{children}</View>
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
  backContainer:
    Platform.OS === 'ios'
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
