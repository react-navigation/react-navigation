import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Screen } from './screens';
import createPointerEventsContainer from './createPointerEventsContainer';

/* eslint-disable no-unused-vars */
const EPS = 1e-5;

function getAccessibilityProps(isActive) {
  if (Platform.OS === 'ios') {
    return {
      accessibilityElementsHidden: !isActive,
      accessible: isActive,
    };
  } else if (Platform.OS === 'android') {
    return {
      importantForAccessibility: isActive ? 'yes' : 'no-hide-descendants',
    };
  } else {
    return null;
  }
}

/**
 * Component that renders the scene as card for the <StackView />.
 */
class Card extends React.Component {
  render() {
    const {
      children,
      pointerEvents,
      style,
      // position,
      scene: { /* index, */ isActive },
    } = this.props;

    // If we use react-native <= 0.55, we can't call position.__makeNative()
    // before binding this value to the view. If we use >= 0.56, then we have
    // to call position.__makeNative(). Unclear to me what is happening here
    // so temporarily commented this out.
    //
    // const active = position.interpolate({
    //   inputRange: [index, index + 1 - EPS, index + 1],
    //   outputRange: [1, 1, 0],
    //   extrapolate: 'clamp',
    // });

    return (
      <Screen
        pointerEvents={pointerEvents}
        ref={this.props.onComponentRef}
        style={[styles.main, style]}
        // active={active}
        active={isActive ? 1 : 0}
        {...getAccessibilityProps(isActive)}
      >
        {children}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E9E9EF',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default createPointerEventsContainer(Card);
