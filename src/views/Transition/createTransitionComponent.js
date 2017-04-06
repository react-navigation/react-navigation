// @flow

import React from 'react';
import {
  View,
  Image,
  Text,
  UIManager,
  findNodeHandle,
  Animated,
} from 'react-native';

import { TransitionItem } from './TransitionItems';
import TransitionConfigs from '../TransitionConfigs';

const statefulize = Component => {
  class Statefulized extends React.Component {
    // This is needed to avoid error from PointerEventsContainer
    setNativeProps(props) {
      this._component.setNativeProps(props);
    }
    render() {
      return <Component {...this.props} ref={c => this._component = c} />;
    }
  }
  return Statefulized;
};

const createAnimatedComponent = Component => {
  if (Component === View) return Animated.View;
  else if (Component === Image) return Animated.Image;
  else if (Component === Text) return Animated.Text;
  else {
    // TODO: Perhaps need to cache the animated components created here by Component somewhere.
    // otherwise, React will think it's a different type and refresh the component at every update.
    // This might be the reason why doing below for all components such as View causes
    //  double-rendering of PhotoDetail (and causes a whole bunch of view not 
    // found errors when measuring views.
    const isStatelessComponent = type => type.prototype && !!!type.prototype.render;
    let C = Component;
    if (isStatelessComponent(Component)) {
      C = statefulize(Component);
    }
    // console.log('=====> createAnimatedComponent', Component.name || Component.displayName);
    return Animated.createAnimatedComponent(C);
  }
};

function createTransitionComponent(Component) {
  class TransitionComponent extends React.Component {
    _component: any;
    static contextTypes = {
      registerTransitionItem: React.PropTypes.func,
      unregisterTransitionItem: React.PropTypes.func,
      routeName: React.PropTypes.string,
      transitionStylesChange: React.PropTypes.object,
    };

    constructor(props, context) {
      super(props, context);
      this._updateTransitionStyleMap = this._updateTransitionStyleMap.bind(this);
      this.state = {
        transitionStyleMap: null,
      }
    }

    // This is needed to pass the invariant in PointerEventsContainer
    setNativeProps(props) {
      this._component.setNativeProps(props);
    }

    _getTransitionStyle() {
      const { id } = this.props;
      const { routeName } = this.context;
      const { transitionStyleMap } = this.state;
      return transitionStyleMap && transitionStyleMap[routeName] && transitionStyleMap[routeName][id];
    }

    render() {
      const { id, ...rest } = this.props;
      const AnimatedComponent = createAnimatedComponent(Component);
      const animatedStyle = this._getTransitionStyle();
      // console.log(`======> id=${id} styleInTransitionComp`, animatedStyle, 'props.style', this.props.style)
      return (
        // collapsable={false} is required for UIManager.measureInWindow to get the actual measurements
        // instead of undefined, see https://github.com/facebook/react-native/issues/9382
        <AnimatedComponent {...rest}
          ref={c => this._component = c}
          collapsable={false}
          style={[this.props.style, animatedStyle]}
        />
      );
    }

    _updateTransitionStyleMap(transitionStyleMap) {
      this.setState({ transitionStyleMap });
    }

    componentDidMount() {
      const { registerTransitionItem, transitionStylesChange } = this.context;

      transitionStylesChange && transitionStylesChange.subscribe(this._updateTransitionStyleMap);

      if (registerTransitionItem) {
        const nativeHandle = findNodeHandle(this);
        registerTransitionItem(new TransitionItem({
          id: this.props.id,
          transitionType: this.props.transitionType,
          routeName: this.context.routeName,
          reactElement: this.render(),
          nativeHandle,
        }));
      }
    }

    componentWillUnmount() {
      const { unregisterTransitionItem, transitionStylesChange } = this.context;

      transitionStylesChange && transitionStylesChange.unsubscribe(this._updateTransitionStyleMap);
      unregisterTransitionItem && unregisterTransitionItem(this.props.id, this.context.routeName);
    }
  }
  return TransitionComponent;
}

export default createTransitionComponent;