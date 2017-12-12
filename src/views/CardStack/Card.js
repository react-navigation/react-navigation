/* @flow */

import * as React from 'react';

import { Animated, StyleSheet } from 'react-native';

import createPointerEventsContainer from './PointerEventsContainer';

import type { NavigationSceneRendererProps } from '../../TypeDefinition';

type Props = {
  ...$Exact<NavigationSceneRendererProps>,
  children: React.ChildrenArray<*>,
  onComponentRef: React.Ref<typeof Animated.View>,
  pointerEvents: string,
  style: any,
};

/**
 * Component that renders the scene as card for the <NavigationCardStack />.
 */
class Card extends React.Component<Props> {
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
    backgroundColor: '#E9E9EF',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    top: 0,
  },
});

Card = createPointerEventsContainer(Card);

export default Card;
