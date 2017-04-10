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
import TransitionStyleMapChange from './TransitionStyleMapChange';

import type {
  TransitionStyleMap,
} from '../../TypeDefinition';

const statefulize = (Component: ReactClass<*>) => {
  class Statefulized extends React.Component {
    _component: ReactClass<*>;
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

type Props = Object;

type State = {
  transitionStyleMap: ?TransitionStyleMap,
}

type Context = {
  registerTransitionItem: (item: TransitionItem) => void,
  unregisterTransitionItem: (id: string, routeName: string) => void,
  routeName: string,
  transitionStyleMapChange: TransitionStyleMapChange,
}

function createTransitionComponent(Component: ReactClass<*>) {
  class TransitionComponent extends React.Component {
    _component: any;
    state: State;
    static contextTypes = {
      registerTransitionItem: React.PropTypes.func,
      unregisterTransitionItem: React.PropTypes.func,
      routeName: React.PropTypes.string,
      transitionStyleMapChange: React.PropTypes.object,
    };

    constructor(props: Props, context: Context) {
      super(props, context);
      this.state = {
        transitionStyleMap: null,
      }
    }

    // This is needed to pass the invariant in PointerEventsContainer
    setNativeProps(props: any) {
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
          componentType={Component.displayName || Component.name}
        />
      );
    }

    _updateTransitionStyleMap(transitionStyleMap: TransitionStyleMap) {
      this.setState({ transitionStyleMap });
    }

    componentDidMount() {
      const { registerTransitionItem, transitionStyleMapChange } = this.context;

      transitionStyleMapChange && transitionStyleMapChange.subscribe(this._updateTransitionStyleMap.bind(this));

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
      const { unregisterTransitionItem, transitionStyleMapChange } = this.context;

      transitionStyleMapChange && transitionStyleMapChange.unsubscribe(this._updateTransitionStyleMap);
      unregisterTransitionItem && unregisterTransitionItem(this.props.id, this.context.routeName);
    }
  }
  return TransitionComponent;
}

export default createTransitionComponent;