import React from 'react';
import { StyleSheet } from 'react-native';
import { Screen } from './screens';
import createPointerEventsContainer from './createPointerEventsContainer';

const EPS = 1e-5;

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
      scene: { index },
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
