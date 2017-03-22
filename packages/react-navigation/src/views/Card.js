/* @flow */

import React, { PropTypes } from 'react';

import {
  Animated,
  StyleSheet,
} from 'react-native';

import CardStackPanResponder from './CardStackPanResponder';
import CardStackStyleInterpolator from './CardStackStyleInterpolator';
import createPointerEventsContainer from './PointerEventsContainer';
import NavigationPropTypes from '../PropTypes';

import type {
  NavigationPanHandlers,
  NavigationSceneRenderer,
  NavigationSceneRendererProps,
} from '../TypeDefinition';

type Props = NavigationSceneRendererProps & {
  onComponentRef: (ref: any) => void,
  onNavigateBack: ?Function,
  panHandlers: ?NavigationPanHandlers,
  pointerEvents: string,
  renderScene: NavigationSceneRenderer,
  style: any,
};

/**
 * Component that renders the scene as card for the <NavigationCardStack />.
 */
class Card extends React.Component<any, Props, any> {
  props: Props;

  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    onComponentRef: PropTypes.func.isRequired,
    onNavigateBack: PropTypes.func,
    panHandlers: NavigationPropTypes.panHandlers,
    pointerEvents: PropTypes.string.isRequired,
    renderScene: PropTypes.func.isRequired,
    style: PropTypes.any,
  };

  render() {
    const {
      panHandlers,
      pointerEvents,
      renderScene,
      style,
      ...props /* NavigationSceneRendererProps */
    } = this.props;

    const viewStyle = style === undefined ?
      CardStackStyleInterpolator.forHorizontal(props) :
      style;

    const viewPanHandlers = panHandlers === undefined ?
      CardStackPanResponder.forHorizontal({
        ...props,
        onNavigateBack: this.props.onNavigateBack,
      }) :
      panHandlers;

    return (
      <Animated.View
        {...viewPanHandlers}
        pointerEvents={pointerEvents}
        ref={this.props.onComponentRef}
        style={[styles.main, viewStyle]}
      >
        {renderScene(props)}
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
    shadowOpacity: 0.4,
    shadowRadius: 10,
    top: 0,
  },
});

Card = createPointerEventsContainer(Card);

Card.CardStackPanResponder = CardStackPanResponder;
Card.CardStackStyleInterpolator = CardStackStyleInterpolator;

export default Card;
