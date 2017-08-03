/* @flow */

import React from 'react';

import { Animated, StyleSheet } from 'react-native';

import createPointerEventsContainer from './PointerEventsContainer';

import type { NavigationSceneRendererProps } from '../../TypeDefinition';

type Props = {
  ...$Exact<NavigationSceneRendererProps>,
  children: React.Children<*>,
  onComponentRef: (ref: React.Element<*>) => void,
  pointerEvents: string,
  style: any,
};

/**
 * Component that renders the scene as card for the <NavigationCardStack />.
 */
class Card extends React.Component<void, Props, void> {
  props: Props;

  render() {
    const { children, pointerEvents, style } = this.props;
    return (
      <Animated.View
        pointerEvents={pointerEvents}
        ref={this.props.onComponentRef}
        style={[styles.main, style]}
      >
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'transparent',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

Card = createPointerEventsContainer(Card);

export default Card;
