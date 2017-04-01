// @flow
import React from 'react';
import { NativeModules, Animated, StyleSheet, UIManager } from 'react-native';
import invariant from 'invariant';
import _ from 'lodash';

import TransitionConfigs from '../TransitionConfigs';

import TransitionItems from './TransitionItems';
import { convertStyleMap } from './transitionHelpers';

const NativeAnimatedModule = NativeModules &&
  NativeModules.NativeAnimatedModule;

// The clone items delta must be bigger than the other value to avoid unwanted flickering.
const OVERLAY_OPACITY_INPUT_RANGE_DELTA = 0.0001;
const CLONE_ITEMS_OPACITY_INPUT_RANGE_DELTA = 0.01;

export default function withTransition(CardStackComp: React.Component) {
  return class CompWithTransition extends React.Component {
    static childContextTypes = {
      registerTransitionItem: React.PropTypes.func,
      unregisterTransitionItem: React.PropTypes.func,
    }

    getChildContext() {
      return {
        registerTransitionItem: (item: TransitionItem) => {
          // console.log('==> registering', item.toString());
          this._setTransitionItemsState(prevItems => prevItems.add(item));
        },
        unregisterTransitionItem: (id: string, routeName: string) => {
          // console.log('==> unregistering', id, routeName);
          this._setTransitionItemsState(prevItems => prevItems.remove(id, routeName));
        },
      };
    }

    constructor(props: Props, context) {
      super(props, context);
      this._configureTransition = this._configureTransition.bind(this);
      this._createExtraSceneProps = this._createExtraSceneProps.bind(this);
      this._renderExtraLayers = this._renderExtraLayers.bind(this);
      this._measureTransitionItems = this._measureTransitionItems.bind(this);
      this.state = {
        transitionItems: new TransitionItems(),
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps) {
        return true;
      } else {
        return (
          this.state.transitionItems !== nextState.transitionItems &&
          nextState.transitionItems.areAllMeasured() &&
          // prevent unnecesary updates when registering/unregistering transition items
          this.state.transitionItems.count() === nextState.transitionItems.count()
        );
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.navigation !== nextProps.navigation) {
        const getRoute = props => props.navigation && {
          ...props.navigation.state.routes[props.navigation.state.index],
          index: props.navigation.state.index,
        };
        const fromRoute = getRoute(this.props);
        const toRoute = getRoute(nextProps);
        this._fromRoute = fromRoute;
        this._toRoute = toRoute;
        this._receivedDifferentNavigationProp = true;
        // When coming back from scene, onLayout won't be triggered, we'll need to do it manually.
        this._setTransitionItemsState(prevItems => prevItems.removeAllMetrics(),
          () => fromRoute.index > toRoute.index && this._measureTransitionItems());
      }
    }

    _hideTransitionViewUntilDone(transitionProps, onFromRoute: boolean) {
      const { progress } = transitionProps;
      const opacity = (onFromRoute
        ? progress.interpolate({
          inputRange: [0, CLONE_ITEMS_OPACITY_INPUT_RANGE_DELTA, 1],
          outputRange: [1, 0, 0],
        })
        : progress.interpolate({
          inputRange: [0, 1 - CLONE_ITEMS_OPACITY_INPUT_RANGE_DELTA, 1],
          outputRange: [0, 0, 1],
        })
      );
      return { opacity };
    }

    _replaceFromToInStyleMap(styleMap, fromRouteName: string, toRouteName: string) {
      return {
        [fromRouteName]: styleMap.from,
        [toRouteName]: styleMap.to,
      }
    }

    _findTransitionContainer() {
      const fromRouteName = this._fromRoute && this._fromRoute.routeName;
      const toRouteName = this._toRoute && this._toRoute.routeName;
      const transitions = this.props.transitionConfigs.filter(c => (
        (c.from === fromRouteName || c.from === '*') &&
        (c.to === toRouteName || c.to === '*')));
      invariant(transitions.length <= 1, `More than one transitions found from "${fromRouteName}" to "${toRouteName}".`);
      return transitions[0];
    }

    _getTransition() {
      const tc = this._findTransitionContainer();
      return tc && tc.transition;
    }

    _getFilteredFromToItems(transition, fromRouteName: string, toRouteName: string) {
      const isRoute = route => item => item.routeName === route;
      const filterPass = item => transition && (!!!transition.filter || transition.filter(item.id));

      const filteredItems = this.state.transitionItems.items().filter(filterPass);

      const fromItems = filteredItems.filter(isRoute(fromRouteName));
      const toItems = filteredItems.filter(isRoute(toRouteName));
      return { from: fromItems, to: toItems };
    }

    _interpolateStyleMap(styleMap, transitionProps: NavigationTransitionProps) {
      const interpolate = (value) => {
        const delta = this._toRoute.index - this._fromRoute.index;
        const { position } = transitionProps;
        let { inputRange, outputRange } = value;
        // Make sure the full [0, 1] inputRange is covered to avoid accidental output values
        inputRange = [0, ...inputRange, 1].map(r => this._fromRoute.index + r * delta);
        outputRange = [outputRange[0], ...outputRange, outputRange[outputRange.length - 1]];
        if (delta < 0) {
          inputRange = inputRange.reverse();
          outputRange = outputRange.reverse();
        }
        return position.interpolate({
          ...value,
          inputRange,
          outputRange,
        });
      };
      return convertStyleMap(styleMap, interpolate, 'processTransform');
    }

    _createInPlaceTransitionStyleMap(
      transitionProps: NavigationTransitionProps) {
      const fromRouteName = this._fromRoute && this._fromRoute.routeName;
      const toRouteName = this._toRoute && this._toRoute.routeName;

      const transition = this._getTransition();
      if (!transition || !this.state.transitionItems.areAllMeasured()) {
        return null;
      }

      const { from: fromItems, to: toItems } = this._getFilteredFromToItems(transition, fromRouteName, toRouteName);
      const itemsToClone = transition.getItemsToClone && transition.getItemsToClone(fromItems, toItems);

      const hideUntilDone = (items, onFromRoute: boolean) => items && items.reduce((result, item) => {
        result[item.id] = this._hideTransitionViewUntilDone(transitionProps, onFromRoute);
        return result;
      }, {});

      const styleMap = transition.getStyleMap &&
        this._interpolateStyleMap(transition.getStyleMap(fromItems, toItems, transitionProps), transitionProps);
      let inPlaceStyleMap = {
        from: {
          ...styleMap && styleMap.from,
          ...hideUntilDone(itemsToClone, true), //TODO should we separate itemsToClone into from and to?
        },
        to: {
          ...styleMap && styleMap.to,
          ...hideUntilDone(itemsToClone, false),
        }
      };
      inPlaceStyleMap = this._replaceFromToInStyleMap(inPlaceStyleMap, fromRouteName, toRouteName);

      return inPlaceStyleMap;
    }

    _renderOverlay(transitionProps) {
      const fromRouteName = this._fromRoute && this._fromRoute.routeName;
      const toRouteName = this._toRoute && this._toRoute.routeName;
      const transition = this._getTransition();
      if (transition && this.state.transitionItems.areAllMeasured()) {
        const { from: fromItems, to: toItems } = this._getFilteredFromToItems(transition, fromRouteName, toRouteName);
        const itemsToClone = transition.getItemsToClone && transition.getItemsToClone(fromItems, toItems);
        if (!itemsToClone) return null;

        let styleMap = transition.getStyleMapForClones &&
          this._interpolateStyleMap(transition.getStyleMapForClones(fromItems, toItems, transitionProps), transitionProps);
        styleMap = styleMap && this._replaceFromToInStyleMap(styleMap, fromRouteName, toRouteName);

        // TODO what if an item is the parent of another item?
        const clones = itemsToClone.map(item => {
          const animatedStyle = styleMap && styleMap[item.routeName] && styleMap[item.routeName][item.id];
          return React.cloneElement(item.reactElement, {
            style: [item.reactElement.props.style, styles.clonedItem, animatedStyle],
          }, []);
        });
        const animatedContainerStyle = {
          opacity: transitionProps.progress.interpolate({
            inputRange: [0, OVERLAY_OPACITY_INPUT_RANGE_DELTA, 1 - OVERLAY_OPACITY_INPUT_RANGE_DELTA, 1],
            outputRange: [0, 1, 1, 0],
          })
        };
        return (
          <Animated.View style={[styles.overlay, animatedContainerStyle]} pointerEvents="none">
            {clones}
          </Animated.View>
        );
      } else {
        return null;
      }
    }

    _measure(item: TransitionItem): Promise<Metrics> {
      return new Promise((resolve, reject) => {
        UIManager.measureInWindow(
          item.nativeHandle,
          (x, y, width, height) => {
            if ([x, y, width, height].every(n => _.isNumber(n))) {
              resolve({ x, y, width, height });
            } else {
              reject(`x=${x}, y=${y}, width=${width}, height=${height}. The view (${item.toString()}) is not found.  Is it collapsed on Android?`);
            }
          }
        );
      });
    }

    _setTransitionItemsState(fun, callback) {
      this.setState(prevState => {
        const newItems = fun(prevState.transitionItems);
        return (newItems !== prevState.transitionItems
          ? { ...prevState, transitionItems: newItems }
          : prevState
        );
      }, callback);
    }

    async _measureItems() {
      const then = new Date();
      const items = this.state.transitionItems.items().filter(i => i.shouldMeasure && !i.isMeasured());
      let toUpdate = [];
      for (let item of items) {
        const { id, routeName } = item;
        try {
          const metrics = await this._measure(item);
          toUpdate.push({ id, routeName, metrics });
          // console.log('measured:', id, routeName, metrics);
        } catch (err) {
          console.warn(err);
        }
      }
      if (toUpdate.length > 0) {
        // console.log('measured, setting meatured state:', toUpdate)
        this._setTransitionItemsState(prevItems => prevItems.updateMetrics(toUpdate));
      }
      console.log(`====> _measureItems took ${new Date() - then} ms`);
    }

    async _measureTransitionItems() {
      // This guarantees that the measurement is only done after navigation.
      // avoid unnecesary state updates when onLayout is called, e.g. when scrolling a ListView
      if (!!!this._receivedDifferentNavigationProp) return;
      this._receivedDifferentNavigationProp = false;

      const fromRoute = this._fromRoute;
      const toRoute = this._toRoute;
      if (fromRoute && toRoute) {
        const transition = this._getTransition();
        let itemsToMeasure = [];
        if (transition && transition.getItemsToMeasure) {
          const { from, to } = this._getFilteredFromToItems(transition, fromRoute.routeName, toRoute.routeName);
          itemsToMeasure = transition.getItemsToMeasure(from, to);
        }
        this._setTransitionItemsState(prevItems => prevItems.setShouldMeasure(itemsToMeasure),
          () => this._measureItems());
      }
    }

    /**
     * By default, keep the current scene and not show the incoming scene (by setting their opacity)
     * to prevent flickering and overdraw issues.
     * 
     * @param {*} props
     */
    _createDefaultHideCardStyle(
      props: NavigationSceneRendererProps,
      prevTransitionProps: NavigationTransitionProps) {
      const currentIndex = props.index;
      const prevIndex = prevTransitionProps && prevTransitionProps.index;
      const sceneIndex = props.scene.index;
      console.log('prevIndex', prevIndex, 'currentIndex', currentIndex, 'sceneIndex', sceneIndex);
      const opacity = (_.isNil(prevIndex) && currentIndex === sceneIndex) || prevIndex === sceneIndex ? 1 : 0;
      // console.log('prevIndex', prevIndex, 'sceneIndex', sceneIndex, 'opacity', opacity);
      return { opacity };
    }

    _renderExtraLayers(
      props: NavigationSceneRendererProps,
      prevTransitionProps: NavigationTransitionProps) {
      const overlay = this._renderOverlay(props);
      return overlay;
    }

    _createExtraSceneProps(props: NavigationSceneRendererProps, prevTransitionProps) {
      const defaultHideCardStyle = this._createDefaultHideCardStyle(props);
      const style = [defaultHideCardStyle, this.props.cardStyle];
      const transitionStyleMap = this._createInPlaceTransitionStyleMap(props, prevTransitionProps);
      return {
        style,
        onLayout: this._measureTransitionItems,
        transitionStyleMap,
      }
    }

    _configureTransition = (
      // props for the new screen
      transitionProps: NavigationTransitionProps,
      // props for the old screen
      prevTransitionProps: NavigationTransitionProps
    ) => {
      const isModal = this.props.mode === 'modal';
      // Copy the object so we can assign useNativeDriver below
      // (avoid Flow error, transitionSpec is of type NavigationTransitionSpec).
      const transitionSpec = {
        ...this._getTransitionConfig(
          transitionProps,
          prevTransitionProps
        ),
      };
      const transition = this._getTransition();
      if (
        !!NativeAnimatedModule &&
        // Native animation support also depends on the transforms used:
        transition && transition.canUseNativeDriver()
      ) {
        // Internal undocumented prop
        transitionSpec.useNativeDriver = true;
      }
      return transitionSpec;
    };

    _getTransitionConfig(
      // props for the new screen
      transitionProps: NavigationTransitionProps,
      // props for the old screen
      prevTransitionProps: NavigationTransitionProps
    ): TransitionConfig {
      const defaultConfig = TransitionConfigs.defaultTransitionConfig(
        transitionProps,
        prevTransitionProps,
        this.props.mode === 'modal'
      ).transitionSpec;
      const tc = this._findTransitionContainer();
      if (tc) {
        return {
          ...defaultConfig,
          ...tc.config,
        }
      }

      return defaultConfig;
    }

    render() {
      return (
        <CardStackComp {...this.props}
          renderExtraLayers={this._renderExtraLayers}
          createExtraSceneProps={this._createExtraSceneProps}
          configureTransition={this._configureTransition}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    elevation: 100, // make sure it's on the top on Android. TODO is this a legit way?
  },
  clonedItem: {
    position: 'absolute',
  }
});