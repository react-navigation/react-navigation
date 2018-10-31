import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Platform } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';

const AnimatedBaseButton = Animated.createAnimatedComponent(BaseButton);

export default class BorderlessButton extends React.Component {
  static propTypes = {
    ...BaseButton.propTypes,
    borderless: PropTypes.bool,
  };

  static defaultProps = {
    activeOpacity: 0.3,
    borderless: true,
  };

  constructor(props) {
    super(props);
    this._opacity = new Animated.Value(1);
  }

  _onActiveStateChange = active => {
    if (Platform.OS !== 'android') {
      Animated.spring(this._opacity, {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        toValue: active ? this.props.activeOpacity : 1,
        useNativeDriver: true,
      }).start();
    }

    this.props.onActiveStateChange && this.props.onActiveStateChange(active);
  };

  render() {
    const { children, style, ...rest } = this.props;

    return (
      <AnimatedBaseButton
        {...rest}
        onActiveStateChange={this._onActiveStateChange}
        style={[style, Platform.OS === 'ios' && { opacity: this._opacity }]}
      >
        {children}
      </AnimatedBaseButton>
    );
  }
}
