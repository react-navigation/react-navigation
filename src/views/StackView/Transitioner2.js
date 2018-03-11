import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import invariant from '../../utils/invariant';

// Used for all animations unless overriden
const DefaultTransitionSpec = {
  duration: 250,
  easing: Easing.inOut(Easing.ease),
  timing: Animated.timing,
};

class Transitioner extends React.Component {
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static getDerivedStateFromProps = (props, lastState) => {
    const { navigation, descriptors } = props;
    const { state } = navigation;
    const canGoBack = state.index > 0;

    const activeKey = state.routes[state.index].key;
    const descriptor = descriptors[activeKey];

    if (!lastState) {
      lastState = {
        backProgress: canGoBack ? new Animaged.Value(1) : null,
        descriptor,
        descriptors,
        navigation,
        transition: null,
        layout: {
          height: new Animated.Value(0),
          initHeight: 0,
          initWidth: 0,
          isMeasured: false,
          width: new Animated.Value(0),
        },
      };
    }

    // const lastNavState = this.props.navigation.state;

    const lastNavState = lastState.navigation.state;
    const lastActiveKey = lastNavState.routes[lastNavState.index].key;

    // const transitionFromKey =
    //   lastActiveKey !== activeKey ? lastActiveKey : null;
    const transitionFromKey = state.transitioningFromKey;
    const transitionFromDescriptor =
      transitionFromKey &&
      lastState.descriptor &&
      lastState.descriptor.key === transitionFromKey;

    // We can only perform a transition if we have been told to via state.transitioningFromKey, and if our previous descriptor matches, indicating that the transitioningFromKey is currently being presented.
    if (transitionFromDescriptor) {
      if (lastState.transition) {
        // there is already a transition in progress.. Don't interrupt it!
        // At the end of the transition, we will compare props and start again
        return lastState;
      }

      return {
        ...lastState,
        navigation,
        descriptor,
        backProgress: null,
        transition: {
          fromDescriptor: lastState.descriptor,
          toDescriptor: descriptor,
          progress: new Animated.Value(0),
        },
      };
    }

    // No transition is being performed. If the key has changed, present it immediately without transition
    if (lastActiveKey !== activeKey) {
      return {
        ...lastState,
        backProgress: canGoBack ? new Animaged.Value(1) : null,
        descriptor,
        transition: null,
      };
    }

    return lastState;
  };

  // React doesn't handle getDerivedStateFromProps yet, but the polyfill is simple..
  state = Transitioner.getDerivedStateFromProps(this.props);
  componentWillReceiveProps(nextProps) {
    const nextState = Transitioner.getDerivedStateFromProps(
      nextProps,
      this.state
    );
    if (this.state !== nextState) {
      this.setState(nextState);
    }
  }

  _startTransition(transition) {
    const { configureTransition } = this.props;
    const { descriptors } = this.state;
    const { progress, fromDescriptor, toDescriptor } = transition;
    progress.setValue(0);

    // get the transition spec.
    // passing the new transitionProps format (this.state) into configureTransition is a breaking change that I haven't documented yet!
    const transitionUserSpec =
      (configureTransition && configureTransition(this.state)) || null;

    const transitionSpec = {
      ...DefaultTransitionSpec,
      ...transitionUserSpec,
    };

    const { timing } = transitionSpec;

    // mutating a prop, this is terrible!
    // it was in the previous transitioner implementation, so I'm leaving it as-is for now:
    delete transitionSpec.timing;

    timing(progress, {
      ...transitionSpec,
      toValue: 1,
    }).start(didComplete => {
      this._completeTransition(transition, didComplete);
    });
  }

  _completeTransition(transition, didComplete) {
    if (!this._isMounted) {
      return;
    }
    const { progress, fromDescriptor, toDescriptor } = transition;
    const { navigation, descriptors } = this.props;

    const nextState = navigation.state;
    const activeKey = nextState.routes[nextState.index].key;
    const nextDescriptor =
      descriptors[activeKey] || this.state.descriptors[activeKey];

    if (activeKey !== toDescriptor.key) {
      // The user has changed navigation states during the transition! This is known as a queued transition.
      // Now we set state for a new transition to the current navigation state
      this.setState({
        navigation,
        descriptors,
        descriptor: nextDescriptor,
        transition: {
          fromDescriptor: toDescriptor,
          toDescriptor: nextDescriptor,
          progress: new Animated.Value(0),
        },
        backProgress: null,
      });
      return;
    }

    const canGoBack = navigation.state.index > 0;

    // All transitions are complete. Reset to normal state:
    this.setState({
      navigation,
      descriptors,
      descriptor: nextDescriptor,
      transition: null,
      backProgress: canGoBack ? new Animated.Value(1) : null,
    });
  }

  render() {
    console.log('Rendering Transitioner', this.state);
    return (
      <View onLayout={this._onLayout} style={[styles.main]}>
        {this.props.render(this.state)}
      </View>
    );
  }

  componentDidUpdate(lastProps, lastState) {
    // start transition if it needs it
    if (
      this.state.transition &&
      (!lastState.transition ||
        lastState.transition.toDescriptor !==
          this.state.transition.toDescriptor)
    ) {
      this._startTransition(this.state.transition);
    }
  }

  _onLayout = event => {
    const lastLayout = this.state.layout;
    const { height, width } = event.nativeEvent.layout;
    if (lastLayout.initWidth === width && lastLayout.initHeight === height) {
      return;
    }
    const layout = {
      ...lastLayout,
      initHeight: height,
      initWidth: width,
      isMeasured: true,
    };

    layout.height.setValue(height);
    layout.width.setValue(width);

    this.setState({ layout });
  };
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default Transitioner;
