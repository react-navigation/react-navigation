import * as React from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  LayoutChangeEvent,
} from 'react-native';

import NavigationScenesReducer from './ScenesReducer';
import {
  NavigationProp,
  Scene,
  SceneDescriptor,
  TransitionerLayout,
  TransitionProps,
} from '../types';

type TransitionSpec = {};

type Props = {
  render: (
    current: TransitionProps,
    previous?: TransitionProps
  ) => React.ReactNode;
  configureTransition?: (
    current: TransitionProps,
    previous?: TransitionProps
  ) => TransitionSpec;
  onTransitionStart?: (
    current: TransitionProps,
    previous?: TransitionProps
  ) => void | Promise<any>;
  onTransitionEnd?: (
    current: TransitionProps,
    previous?: TransitionProps
  ) => void | Promise<any>;
  navigation: NavigationProp;
  descriptors: { [key: string]: SceneDescriptor };
  screenProps?: unknown;
};

type State = {
  layout: TransitionerLayout;
  position: Animated.Value;
  scenes: Scene[];
  nextScenes?: Scene[];
};

// Used for all animations unless overriden
const DefaultTransitionSpec = {
  duration: 250,
  easing: Easing.inOut(Easing.ease),
  timing: Animated.timing,
};

class Transitioner extends React.Component<Props, State> {
  private positionListener: string;

  private prevTransitionProps: TransitionProps | undefined;
  private transitionProps: TransitionProps;

  private isComponentMounted: boolean;
  private isTransitionRunning: boolean;
  private queuedTransition: { prevProps: Props } | null;

  constructor(props: Props) {
    super(props);

    // The initial layout isn't measured. Measured layout will be only available
    // when the component is mounted.
    const layout: TransitionerLayout = {
      height: new Animated.Value(0),
      initHeight: 0,
      initWidth: 0,
      isMeasured: false,
      width: new Animated.Value(0),
    };

    const position = new Animated.Value(this.props.navigation.state.index);
    this.positionListener = position.addListener((/* { value } */) => {
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

    this.prevTransitionProps = undefined;
    this.transitionProps = buildTransitionProps(props, this.state);

    this.isComponentMounted = false;
    this.isTransitionRunning = false;
    this.queuedTransition = null;
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
    this.positionListener &&
      this.state.position.removeListener(this.positionListener);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.isTransitionRunning) {
      if (!this.queuedTransition) {
        this.queuedTransition = { prevProps: this.props };
      }
      return;
    }

    this.startTransition(this.props, nextProps);
  }

  private computeScenes = (props: Props, nextProps: Props) => {
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

  private startTransition(props: Props, nextProps: Props) {
    const indexHasChanged =
      props.navigation.state.index !== nextProps.navigation.state.index;
    let nextScenes = this.computeScenes(props, nextProps);

    if (!nextScenes) {
      // prevTransitionProps are the same as transitionProps in this case
      // because nothing changed
      this.prevTransitionProps = this.transitionProps;

      // Unsure if this is actually a good idea... Also related to
      // https://github.com/react-navigation/react-navigation/issues/5247
      // - the animation is interrupted before completion so this ensures
      // that it is properly set to the final position before firing
      // onTransitionEnd
      this.state.position.setValue(props.navigation.state.index);

      this.handleTransitionEnd();
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
    this.prevTransitionProps = this.transitionProps;
    this.transitionProps = buildTransitionProps(nextProps, nextState);
    let { isTransitioning } = this.transitionProps.navigation.state;

    // if the state isn't transitioning that is meant to signal that we should
    // transition immediately to the new index. if the index hasn't changed, do
    // the same thing here. it's not clear to me why we ever start a transition
    // when the index hasn't changed, this requires further investigation.
    if (!isTransitioning || !indexHasChanged) {
      this.setState(nextState, async () => {
        if (nextProps.onTransitionStart) {
          const result = nextProps.onTransitionStart(
            this.transitionProps,
            this.prevTransitionProps
          );
          if (result instanceof Promise) {
            // why do we bother awaiting the result here?
            await result;
          }
        }
        // jump immediately to the new value
        indexHasChanged && position.setValue(toValue);
        // end the transition
        this.handleTransitionEnd();
      });
    } else if (isTransitioning) {
      this.isTransitionRunning = true;
      this.setState(nextState, async () => {
        if (nextProps.onTransitionStart) {
          const result = nextProps.onTransitionStart(
            this.transitionProps,
            this.prevTransitionProps
          );

          // Wait for the onTransitionStart to resolve if needed.
          if (result instanceof Promise) {
            await result;
          }
        }

        // get the transition spec.
        const transitionUserSpec = nextProps.configureTransition
          ? nextProps.configureTransition(
              this.transitionProps,
              this.prevTransitionProps
            )
          : null;

        const transitionSpec = {
          ...DefaultTransitionSpec,
          ...transitionUserSpec,
        };

        const { timing } = transitionSpec;
        delete transitionSpec.timing;

        // if swiped back, indexHasChanged == true && positionHasChanged == false
        // @ts-ignore
        const positionHasChanged = position.__getValue() !== toValue;
        if (indexHasChanged && positionHasChanged) {
          timing(position, {
            ...transitionSpec,
            toValue: nextProps.navigation.state.index,
          }).start(() => {
            // In case the animation is immediately interrupted for some reason,
            // we move this to the next frame so that onTransitionStart can fire
            // first (https://github.com/react-navigation/react-navigation/issues/5247)
            requestAnimationFrame(this.handleTransitionEnd);
          });
        } else {
          this.handleTransitionEnd();
        }
      });
    }
  }

  render() {
    return (
      <View onLayout={this.handleLayout} style={styles.main}>
        {this.props.render(this.transitionProps, this.prevTransitionProps)}
      </View>
    );
  }

  private handleLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    if (
      this.state.layout.initWidth === width &&
      this.state.layout.initHeight === height
    ) {
      return;
    }
    const layout: TransitionerLayout = {
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

    this.transitionProps = buildTransitionProps(this.props, nextState);
    this.setState(nextState);
  };

  private handleTransitionEnd = () => {
    if (!this.isComponentMounted) {
      return;
    }
    const prevTransitionProps = this.prevTransitionProps;
    this.prevTransitionProps = undefined;

    const scenes = filterStale(this.state.scenes);

    const nextState = {
      ...this.state,
      scenes,
    };

    this.transitionProps = buildTransitionProps(this.props, nextState);

    this.setState(nextState, async () => {
      if (this.props.onTransitionEnd) {
        const result = this.props.onTransitionEnd(
          this.transitionProps,
          prevTransitionProps
        );

        if (result instanceof Promise) {
          await result;
        }
      }

      if (this.queuedTransition) {
        let { prevProps } = this.queuedTransition;
        this.queuedTransition = null;
        this.startTransition(prevProps, this.props);
      } else {
        this.isTransitionRunning = false;
      }
    });
  };
}

function buildTransitionProps(props: Props, state: State): TransitionProps {
  const { navigation } = props;

  const { layout, position, scenes } = state;

  const scene = scenes.find(isSceneActive);

  if (!scene) {
    throw new Error('Could not find active scene');
  }

  return {
    layout,
    navigation,
    position,
    scenes,
    scene,
    index: scene.index,
  };
}

function isSceneNotStale(scene: Scene) {
  return !scene.isStale;
}

function filterStale(scenes: Scene[]) {
  const filtered = scenes.filter(isSceneNotStale);
  if (filtered.length === scenes.length) {
    return scenes;
  }
  return filtered;
}

function isSceneActive(scene: Scene) {
  return scene.isActive;
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default Transitioner;
