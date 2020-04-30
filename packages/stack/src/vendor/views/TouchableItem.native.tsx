/**
 * TouchableItem renders a touchable that looks native on both iOS and Android.
 *
 * It provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity.
 *
 * On iOS you can pass the props of TouchableOpacity, on Android pass the props
 * of TouchableNativeFeedback.
 */
import * as React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';

import BorderlessButton from './BorderlessButton';

export type Props = ViewProps & {
  pressColor: string;
  disabled?: boolean;
  borderless?: boolean;
  delayPressIn?: number;
  onPress?: () => void;
  children: React.ReactNode;
};

const ANDROID_VERSION_LOLLIPOP = 21;

export class TouchableItem extends React.Component<Props> {
  static defaultProps = {
    borderless: false,
    pressColor: 'rgba(0, 0, 0, .32)',
  };

  render() {
    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchables on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      const { style, pressColor, borderless, children, ...rest } = this.props;

      return (
        <TouchableNativeFeedback
          {...rest}
          useForeground={TouchableNativeFeedback.canUseNativeForeground()}
          background={TouchableNativeFeedback.Ripple(pressColor, borderless)}
        >
          <View style={style}>{React.Children.only(children)}</View>
        </TouchableNativeFeedback>
      );
    } else if (Platform.OS === 'ios') {
      return (
        <BorderlessButton
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
          disallowInterruption
          enabled={!this.props.disabled}
          {...this.props}
        >
          {this.props.children}
        </BorderlessButton>
      );
    } else {
      return (
        <TouchableOpacity {...this.props}>
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}
