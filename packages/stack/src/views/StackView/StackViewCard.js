import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Screen } from './screens';
import createPointerEventsContainer from './createPointerEventsContainer';

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
      position,
      scene: { index, isActive },
    } = this.props;
    const active = position.interpolate({
      inputRange: [index, index + 1 - EPS, index + 1],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Screen
        pointerEvents={pointerEvents}
        ref={this.props.onComponentRef}
        style={[styles.main, style]}
        active={active}
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

Card = createPointerEventsContainer(Card);

export default Card;
