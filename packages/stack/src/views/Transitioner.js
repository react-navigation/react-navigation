import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import invariant from '../utils/invariant';

import NavigationScenesReducer from './ScenesReducer';

// Used for all animations unless overriden
const DefaultTransitionSpec = {
  duration: 250,
  easing: Easing.inOut(Easing.ease),
  timing: Animated.timing,
};

class Transitioner extends React.Component {
  constructor(props, context) {
    super(props, context);

    // The initial layout isn't measured. Measured layout will be only available
    // when the component is mounted.
    const layout = {
      height: new Animated.Value(0),
      initHeight: 0,
      initWidth: 0,
      isMeasured: false,
      width: new Animated.Value(0),
    };

    const position = new Animated.Value(this.props.navigation.state.index);
    this._positionListener = position.addListener((/* { value } */) => {
      // This should work until we detach position from a view! so we have to be
      // careful to not ever detach it, thus the gymnastics in _getPosition in
      // StackViewLayout
      // This should log each frame when releasing the gesture or when pressing
      // the back button! If not, something has gone wrong with the animated
      // value subscription
      // console.log(value);
    });

    this.state = {
      layout,
      position,
      scenes: NavigationScenesReducer(
        [],
        this.props.navigation.state,
        null,
        this.props.descriptors
      ),
    };

    this._prevTransitionProps = null;
    this._transitionProps = buildTransitionProps(props, this.state);

    this._isMounted = false;
    this._isTransitionRunning = false;
    this._queuedTransition = null;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    this._positionListener &&
      this.state.position.removeListener(this._positionListener);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (this._isTransitionRunning) {
      if (!this._queuedTransition) {
        this._queuedTransition = { prevProps: this.props };
      }
      return;
    }

    this._startTransition(this.props, nextProps);
  }

  _computeScenes = (props, nextProps) => {
    let nextScenes = NavigationScenesReducer(
      this.state.scenes,
      nextProps.navigation.state,
      props.navigation.state,
      nextProps.descriptors
    );

    if (!nextProps.navigation.state.isTransitioning) {
      nextScenes = filterStale(nextScenes);
    }

    // Update nextScenes when we change screenProps
    // This is a workaround for https://github.com/react-navigation/react-navigation/issues/4271
    if (nextProps.screenProps !== this.props.screenProps) {
      this.setState({ nextScenes });
    }

    if (nextScenes === this.state.scenes) {
      return;
    }

    return nextScenes;
  };

  _startTransition(props, nextProps) {
    const indexHasChanged =
      props.navigation.state.index !== nextProps.navigation.state.index;
    let nextScenes = this._computeScenes(props, nextProps);

    if (!nextScenes) {
      // prevTransitionProps are the same as transitionProps in this case
      // because nothing changed
      this._prevTransitionProps = this._transitionProps;

      // Unsure if this is actually a good idea... Also related to
      // https://github.com/react-navigation/react-navigation/issues/5247
      // - the animation is interrupted before completion so this ensures
      // that it is properly set to the final position before firing
      // onTransitionEnd
      this.state.position.setValue(props.navigation.state.index);

      this._onTransitionEnd();
      return;
    }

    const nextState = {
      ...this.state,
      scenes: nextScenes,
    };

    // grab the position animated value
    const { position } = nextState;

    // determine where we are meant to transition to
    const toValue = nextProps.navigation.state.index;

    // compute transitionProps
    this._prevTransitionProps = this._transitionProps;
    this._transitionProps = buildTransitionProps(nextProps, nextState);
    let { isTransitioning } = this._transitionProps.navigation.state;

    // if the state isn't transitioning that is meant to signal that we should
    // transition immediately to the new index. if the index hasn't changed, do
    // the same thing here. it's not clear to me why we ever start a transition
    // when the index hasn't changed, this requires further investigation.
    if (!isTransitioning || !indexHasChanged) {
      this.setState(nextState, async () => {
        if (nextProps.onTransitionStart) {
          const result = nextProps.onTransitionStart(
            this._transitionProps,
            this._prevTransitionProps
          );
          if (result instanceof Promise) {
            // why do we bother awaiting the result here?
            await result;
          }
        }
        // jump immediately to the new value
        indexHasChanged && position.setValue(toValue);
        // end the transition
        this._onTransitionEnd();
      });
    } else if (isTransitioning) {
      this._isTransitionRunning = true;
      this.setState(nextState, async () => {
        if (nextProps.onTransitionStart) {
          const result = nextProps.onTransitionStart(
            this._transitionProps,
            this._prevTransitionProps
          );

          // Wait for the onTransitionStart to resolve if needed.
          if (result instanceof Promise) {
            await result;
          }
        }

        // get the transition spec.
        const transitionUserSpec = nextProps.configureTransition
          ? nextProps.configureTransition(
            this._transitionProps,
            this._prevTransitionProps
          )
          : null;

        const transitionSpec = {
          ...DefaultTransitionSpec,
          ...transitionUserSpec,
        };

        const { timing } = transitionSpec;
        delete transitionSpec.timing;

        // if swiped back, indexHasChanged == true && positionHasChanged == false
        const positionHasChanged = position.__getValue() !== toValue;
        if (indexHasChanged && positionHasChanged) {
          timing(position, {
            ...transitionSpec,
            toValue: nextProps.navigation.state.index,
          }).start(() => {
            // In case the animation is immediately interrupted for some reason,
            // we move this to the next frame so that onTransitionStart can fire
            // first (https://github.com/react-navigation/react-navigation/issues/5247)
            requestAnimationFrame(this._onTransitionEnd);
          });
        } else {
          this._onTransitionEnd();
        }
      });
    }
  }

  render() {
    return (
      <View onLayout={this._onLayout} style={styles.main}>
        {this.props.render(this._transitionProps, this._prevTransitionProps)}
      </View>
    );
  }

  _onLayout = event => {
    const { height, width } = event.nativeEvent.layout;
    if (
      this.state.layout.initWidth === width &&
      this.state.layout.initHeight === height
    ) {
      return;
    }
    const layout = {
      ...this.state.layout,
      initHeight: height,
      initWidth: width,
      isMeasured: true,
    };

    layout.height.setValue(height);
    layout.width.setValue(width);

    const nextState = {
      ...this.state,
      layout,
    };

    this._transitionProps = buildTransitionProps(this.props, nextState);
    this.setState(nextState);
  };

  _onTransitionEnd = () => {
    if (!this._isMounted) {
      return;
    }
    const prevTransitionProps = this._prevTransitionProps;
    this._prevTransitionProps = null;

    const scenes = filterStale(this.state.scenes);

    const nextState = {
      ...this.state,
      scenes,
    };

    this._transitionProps = buildTransitionProps(this.props, nextState);

    this.setState(nextState, async () => {
      if (this.props.onTransitionEnd) {
        const result = this.props.onTransitionEnd(
          this._transitionProps,
          prevTransitionProps
        );

        if (result instanceof Promise) {
          await result;
        }
      }

      if (this._queuedTransition) {
        let { prevProps } = this._queuedTransition;
        this._queuedTransition = null;
        this._startTransition(prevProps, this.props);
      } else {
        this._isTransitionRunning = false;
      }
    });
  };
}

function buildTransitionProps(props, state) {
  const { navigation, options } = props;

  const { layout, position, scenes } = state;

  const scene = scenes.find(isSceneActive);

  invariant(scene, 'Could not find active scene');

  return {
    layout,
    navigation,
    position,
    scenes,
    scene,
    options,
    index: scene.index,
  };
}

function isSceneNotStale(scene) {
  return !scene.isStale;
}

function filterStale(scenes) {
  const filtered = scenes.filter(isSceneNotStale);
  if (filtered.length === scenes.length) {
    return scenes;
  }
  return filtered;
}

function isSceneActive(scene) {
  return scene.isActive;
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default Transitioner;
