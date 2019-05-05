import * as React from 'react';

import { StackActions } from '@react-navigation/core';
import StackViewLayout from './StackViewLayout';
import Transitioner from '../Transitioner';
import TransitionConfigs from './StackViewTransitionConfigs';
import {
  NavigationProp,
  SceneDescriptor,
  NavigationConfig,
  TransitionProps,
  Scene,
} from '../../types';

type Props = {
  navigation: NavigationProp;
  descriptors: { [key: string]: SceneDescriptor };
  navigationConfig: NavigationConfig;
  onTransitionStart?: () => void;
  onGestureBegin?: () => void;
  onGestureCanceled?: () => void;
  onGestureEnd?: () => void;
  screenProps?: unknown;
};

const USE_NATIVE_DRIVER = true;

// NOTE(brentvatne): this was previously in defaultProps, but that is deceiving
// because the entire object will be clobbered by navigationConfig that is
// passed in.
const DefaultNavigationConfig = {
  mode: 'card',
  cardShadowEnabled: true,
  cardOverlayEnabled: false,
};

class StackView extends React.Component<Props> {
  render() {
    return (
      <Transitioner
        render={this.renderStackviewLayout}
        configureTransition={this.configureTransition}
        screenProps={this.props.screenProps}
        navigation={this.props.navigation}
        descriptors={this.props.descriptors}
        onTransitionStart={
          this.props.onTransitionStart ||
          this.props.navigationConfig.onTransitionStart
        }
        onTransitionEnd={this.handleTransitionEnd}
      />
    );
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.state.isTransitioning) {
      navigation.dispatch(
        StackActions.completeTransition({
          key: navigation.state.key,
        })
      );
    }
  }

  private configureTransition = (
    transitionProps: TransitionProps,
    prevTransitionProps?: TransitionProps
  ) => {
    return {
      useNativeDriver: USE_NATIVE_DRIVER,
      ...TransitionConfigs.getTransitionConfig(
        this.props.navigationConfig.transitionConfig,
        transitionProps,
        prevTransitionProps,
        this.props.navigationConfig.mode === 'modal'
      ).transitionSpec,
    };
  };

  private getShadowEnabled = () => {
    const { navigationConfig } = this.props;
    return navigationConfig &&
      navigationConfig.hasOwnProperty('cardShadowEnabled')
      ? navigationConfig.cardShadowEnabled
      : DefaultNavigationConfig.cardShadowEnabled;
  };

  private getCardOverlayEnabled = () => {
    const { navigationConfig } = this.props;
    return navigationConfig &&
      navigationConfig.hasOwnProperty('cardOverlayEnabled')
      ? navigationConfig.cardOverlayEnabled
      : DefaultNavigationConfig.cardOverlayEnabled;
  };

  private renderStackviewLayout = (
    transitionProps: TransitionProps,
    lastTransitionProps?: TransitionProps
  ) => {
    const { screenProps, navigationConfig } = this.props;
    return (
      <StackViewLayout
        {...navigationConfig}
        shadowEnabled={this.getShadowEnabled()}
        cardOverlayEnabled={this.getCardOverlayEnabled()}
        onGestureBegin={this.props.onGestureBegin}
        onGestureCanceled={this.props.onGestureCanceled}
        onGestureEnd={this.props.onGestureEnd}
        screenProps={screenProps}
        transitionProps={transitionProps}
        lastTransitionProps={lastTransitionProps}
      />
    );
  };

  private handleTransitionEnd = (
    transition: { scene: Scene; navigation: NavigationProp },
    lastTransition?: { scene: Scene; navigation: NavigationProp }
  ) => {
    const {
      navigationConfig,
      navigation,
      // @ts-ignore
      onTransitionEnd = navigationConfig.onTransitionEnd,
    } = this.props;
    const transitionDestKey = transition.scene.route.key;
    const isCurrentKey =
      navigation.state.routes[navigation.state.index].key === transitionDestKey;
    if (transition.navigation.state.isTransitioning && isCurrentKey) {
      navigation.dispatch(
        StackActions.completeTransition({
          key: navigation.state.key,
          toChildKey: transitionDestKey,
        })
      );
    }
    onTransitionEnd && onTransitionEnd(transition, lastTransition);
  };
}

export default StackView;
