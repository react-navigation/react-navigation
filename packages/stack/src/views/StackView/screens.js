import React from 'react';
import { Animated, View } from 'react-native';

const ScreenContainer = View;

class Screen extends React.Component {
  render() {
    // Filter out active prop in this case because it is unused and
    // can cause problems depending on react-native version:
    // https://github.com/react-navigation/react-navigation/issues/4886

    /* eslint-disable no-unused-vars */
    const { active, onComponentRef, ...props } = this.props;

    return <Animated.View {...props} ref={onComponentRef} />;
  }
}

export { ScreenContainer, Screen };
