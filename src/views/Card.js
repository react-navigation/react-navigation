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
import Transition from './Transition';

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

class TransitionStylesChange {
  constructor() {
    this._subscriptions = [];
  }
  subscribe(f) {
    this._subscriptions.push(f);
  }
  unsubscribe(f) {
    const idx = this._subscriptions.indexOf(f);
    if (idx >= 0) this._subscriptions.splice(idx, 1);
  }
  dispatch(styleMap) {
    this._subscriptions.forEach(f => f(styleMap));
  }
}

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

  static childContextTypes = {
    routeName: React.PropTypes.string.isRequired,
    transitionStylesChange: React.PropTypes.object,
  };

  props: Props;

  constructor(props) {
    super(props);
    this._transitionStylesChange = new TransitionStylesChange();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.transitionStyleMap !== nextProps.transitionStyleMap) {
      this._transitionStylesChange.dispatch(nextProps.transitionStyleMap);
    }
  }

  getChildContext() {
    return {
      routeName: this.props.scene.route.routeName,
      transitionStylesChange: this._transitionStylesChange,
    };
  }

  render() {
    const {
      panHandlers,
      pointerEvents,
      renderScene,
      style,
      ...props /* NavigationSceneRendererProps */
    } = this.props;

    const viewPanHandlers = panHandlers === undefined ?
      CardStackPanResponder.forHorizontal({
        ...props,
        onNavigateBack: this.props.onNavigateBack,
      }) :
      panHandlers;
    
    return (
      <Transition.View
        id={`$scene-${this.props.scene.route.routeName}`}
        {...viewPanHandlers}
        pointerEvents={pointerEvents}
        ref={this.props.onComponentRef}
        style={[styles.main, style]}
        onLayout={this.props.onLayout}
      >
        {renderScene(props)}
      </Transition.View>
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
