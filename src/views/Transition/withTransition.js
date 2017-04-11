// @flow
import React from 'react';
import { NativeModules, Animated, StyleSheet, UIManager } from 'react-native';
import invariant from 'invariant';
import _ from 'lodash';

import TransitionConfigs from '../TransitionConfigs';

import TransitionItems from './TransitionItems';
import { TransitionItem } from './TransitionItems';
import { convertStyleMap, createTransition, bindTransition } from './transitionHelpers';
import { sq } from './composition';

import Transitions from './Transitions';

import type {
  NavigationRoute,
    NavigationTransitionProps,
    NavigationSceneRendererProps,
    Transition,
} from '../../TypeDefinition';

const NativeAnimatedModule = NativeModules &&
  NativeModules.NativeAnimatedModule;

// The clone items delta must be bigger than the other value to avoid unwanted flickering.
const OVERLAY_OPACITY_INPUT_RANGE_DELTA = 0.0001;
const CLONE_ITEMS_OPACITY_INPUT_RANGE_DELTA = 0.01;

type Props = Object; // TODO perhaps should import CardStack's props?

type State = {
  transitionItems: TransitionItems,
};

type Route = NavigationRoute & {
  index: number,
}

export default function withTransition(CardStackComp: ReactClass<*>) {
  return class CompWithTransition extends React.Component {
    state: State;
    _receivedDifferentNavigationProp: boolean;
    _fromRoute: ?Route;
    _toRoute: ?Route;

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

    constructor(props: Props) {
      super(props);
      this._configureTransition = this._configureTransition.bind(this);
      this._createExtraSceneProps = this._createExtraSceneProps.bind(this);
      this._renderExtraLayers = this._renderExtraLayers.bind(this);
      this._measureTransitionItems = this._measureTransitionItems.bind(this);
      this.state = {
        transitionItems: new TransitionItems(),
      }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
      if (this.props !== nextProps) {
        return true;
      } else {
        return (
          this.state.transitionItems !== nextState.transitionItems
          && nextState.transitionItems.areAllMeasured()
          // prevent unnecesary updates when registering/unregistering transition items
          && this.state.transitionItems.count() === nextState.transitionItems.count()
        );
      }
    }

    componentWillReceiveProps(nextProps: Props) {
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
          () => {
            if (fromRoute.index > toRoute.index) this._measureTransitionItems();
          });
      }
    }

    _hideTransitionViewUntilDone(transitionProps: NavigationSceneRendererProps) {
      const { position } = transitionProps;
      const sceneIndex = transitionProps.scene.index;
      const opacity = position.interpolate({
        inputRange: [sceneIndex - CLONE_ITEMS_OPACITY_INPUT_RANGE_DELTA, 
          sceneIndex, sceneIndex + CLONE_ITEMS_OPACITY_INPUT_RANGE_DELTA,],
        outputRange: [0, 1, 0],
      });

      return { opacity };
    }

    _replaceFromToInStyleMap(styleMap, fromRouteName: string, toRouteName: string) {
      return {
        [fromRouteName]: styleMap.from,
        [toRouteName]: styleMap.to,
      }
    }

    _createSharedElementTransition() {
      const ids = this._getMatchingSharedElementIds();
      const sharedElement = bindTransition(Transitions.SharedElement, ...ids);
      const crossFadeScene = bindTransition(Transitions.CrossFade, /\$scene.+/);
      invariant(this._fromRoute && this._toRoute, "Must be called during transition");
      const transition = (this._fromRoute.index < this._toRoute.index
        ? sq(sharedElement(0.9), crossFadeScene(0.1))
        : sq(crossFadeScene(0.1), sharedElement(0.9))
      );
      return {
        transition,
        config: { duration: 550 },
        isDefault: true,
      }
    }

    _includesMatchingSharedElements() {
      return this._getMatchingSharedElementIds().length > 0;
    }

    _getMatchingSharedElementIds() {
      const { fromItems, toItems } = this._getFromToItems(i => i.transitionType === 'sharedElement');
      return _.intersectionWith(fromItems, toItems, (i1, i2) => i1.id === i2.id)
        .map(item => item.id);
    }

    _getDefaultTransitionContainer() {
      let tc;
      if (this._includesMatchingSharedElements()) {
        tc = this._createSharedElementTransition();
      } else {
        invariant(this._fromRoute && this._toRoute, "Must be called during transition");
        const direction = Math.sign(this._toRoute.index - this._fromRoute.index);
        const isModal = this.props.mode === 'modal';
        const defaultTransitionConfig = TransitionConfigs.defaultTransitionConfig(direction, isModal);
        const transition = createTransition({
          getStyleMap(
            itemsOnFromRoute: Array<TransitionItem>,
            itemsOnToRoute: Array<TransitionItem>,
            transitionProps: NavigationSceneRendererProps,
          ) {
            const createStyles = (items: Array<TransitionItem>) => items.reduce((result, item) => {
              const interpolator = defaultTransitionConfig.screenInterpolator;
              result[item.id] = interpolator && interpolator(transitionProps);
              return result;
            }, {});
            return {
              from: createStyles(itemsOnFromRoute),
              to: createStyles(itemsOnToRoute),
            };
          },
        });
        const boundTransition = bindTransition(transition, /\$scene-.+/);
        tc = {
          // The parameter "1" below is required to create the transition object, but
          // its value has no effect since we return interpolated styles from the 
          // transition, instead of the raw input/output ranges.
          transition: boundTransition(1),
          config: defaultTransitionConfig.transitionSpec,
          isDefault: true,
        };
      }
      return tc;
    }

    _getTransitionContainer() {
      invariant(this._fromRoute && this._toRoute, "Must be called during transition");

      const fromRouteName = this._fromRoute.routeName;
      const toRouteName = this._toRoute.routeName;

      const getCompTransitionConfigs = (routeName: ?string) => {
        const comp = routeName && this.props.router.getComponentForRouteName(routeName);
        const navOps = comp && comp.navigationOptions;
        const cardStackOps = navOps && navOps.cardStack;
        const compTransitionConfigs = cardStackOps && cardStackOps.transitions;
        return compTransitionConfigs || [];
      }

      const transitionConfigs = _.unionWith(
        getCompTransitionConfigs(fromRouteName).map(tc => ({ ...tc, from: fromRouteName })),
        getCompTransitionConfigs(toRouteName).map(tc => ({ ...tc, to: toRouteName })),
        (this.props.transitionConfigs || []),
        (a, b) => a.from === b.from && a.to === b.to
      );

      const transitions = transitionConfigs.filter(c => (
        (c.from === fromRouteName || c.from === '*') &&
        (c.to === toRouteName || c.to === '*')));
      invariant(transitions.length <= 1, `More than one transitions found from "${fromRouteName}" to "${toRouteName}".`);
      return transitions[0] || this._getDefaultTransitionContainer();
    }

    _getTransition() {
      const tc = this._getTransitionContainer();
      return tc.transition;
    }

    _getFilteredFromToItems() {
      invariant(this._fromRoute && this._toRoute, "Must be called during transition");
      const transition = this._getTransition();
      invariant(transition, 'transition should not be undefined');
      const transitionFilter = item => (
        (!!!transition.filter || transition.filter(item.id))
      );
      return this._getFromToItems(transitionFilter);
    }

    _interpolateStyleMap(styleMap, transitionProps: NavigationTransitionProps) {
      invariant(this._fromRoute && this._toRoute, "Must be called during transition");

      const interpolate = (value) => {
        if (typeof value.__getAnimatedValue === 'function') return value;
        invariant(this._fromRoute && this._toRoute, "Must be called during transition");
        const delta = this._toRoute.index - this._fromRoute.index;
        const { position } = transitionProps;
        let { inputRange, outputRange } = value;
        // Make sure the full [0, 1] inputRange is covered to avoid accidental output values
        inputRange = [0, ...inputRange, 1].map(r => {
          invariant(this._fromRoute && this._toRoute, "Must be called during transition");
          return this._fromRoute.index + r * delta
        });
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

    _createInPlaceTransitionStyleMap(transitionProps: NavigationSceneRendererProps) {
      invariant(this._fromRoute && this._toRoute, "Must be called during transition");

      const fromRouteName = this._fromRoute.routeName;
      const toRouteName = this._toRoute.routeName;

      const transition = this._getTransition();
      if (!!!transition || !this.state.transitionItems.areAllMeasured()) {
        return null;
      }

      const { fromItems, toItems } = this._getFilteredFromToItems();
      const itemsToClone = transition.getItemsToClone && transition.getItemsToClone(fromItems, toItems);

      const hideUntilDone = (items) => items && items.reduce((result, item) => {
        result[item.id] = this._hideTransitionViewUntilDone(transitionProps);
        return result;
      }, {});

      const styleMap = transition.getStyleMap &&
        this._interpolateStyleMap(transition.getStyleMap(fromItems, toItems, transitionProps), transitionProps);
      let inPlaceStyleMap = {
        from: {
          ...styleMap && styleMap.from,
          ...hideUntilDone(itemsToClone), //TODO should we separate itemsToClone into from and to?
        },
        to: {
          ...styleMap && styleMap.to,
          ...hideUntilDone(itemsToClone),
        }
      };
      inPlaceStyleMap = this._replaceFromToInStyleMap(inPlaceStyleMap, fromRouteName, toRouteName);

      // console.log('=>>>>> inPlaceStyleMap', inPlaceStyleMap);

      return inPlaceStyleMap;
    }

    _renderOverlay(transitionProps: NavigationTransitionProps) {
      invariant(this._fromRoute && this._toRoute, "Must be called during transition");

      const fromRouteName = this._fromRoute.routeName;
      const toRouteName = this._toRoute.routeName;

      const transition = this._getTransition();
      if (transition && this.state.transitionItems.areAllMeasured()) {
        const { fromItems, toItems } = this._getFilteredFromToItems();
        const itemsToClone = transition.getItemsToClone && transition.getItemsToClone(fromItems, toItems);
        if (itemsToClone.length === 0) return null;

        let styleMap = transition.getStyleMapForClones &&
          this._interpolateStyleMap(transition.getStyleMapForClones(fromItems, toItems, transitionProps), transitionProps);
        styleMap = styleMap && this._replaceFromToInStyleMap(styleMap, fromRouteName, toRouteName);

        // TODO what if an item is the parent of another item?
        const clones = itemsToClone.map((item) => {
          const animatedStyle = styleMap && styleMap[item.routeName] && styleMap[item.routeName][item.id];
          return React.cloneElement(item.reactElement, {
            style: [item.reactElement.props.style, styles.clonedItem, animatedStyle],
            key: `clone-${item.id}`
          }, []);
        });
        invariant(this._fromRoute && this._toRoute, "Must be called during transition");
        const fromIndex = this._fromRoute.index;
        const toIndex = this._toRoute.index;
        const maxIndex = Math.max(fromIndex, toIndex);
        const minIndex = Math.min(fromIndex, toIndex);
        const animatedContainerStyle = {
          opacity: transitionProps.position.interpolate({
            inputRange: [minIndex, minIndex + OVERLAY_OPACITY_INPUT_RANGE_DELTA, maxIndex - OVERLAY_OPACITY_INPUT_RANGE_DELTA, maxIndex],
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

    _measure(item: TransitionItem) {
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

    _setTransitionItemsState(fun: TransitionItems => TransitionItems, callback) {
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

    _measureTransitionItems = async () => {
      // This guarantees that the measurement is only done after navigation.
      // avoid unnecesary state updates when onLayout is called, e.g. when scrolling a ListView
      if (!!!this._receivedDifferentNavigationProp) return;
      this._receivedDifferentNavigationProp = false;

      if (this._isInTransition()) {
        const { fromItems, toItems } = this._getFilteredFromToItems();
        const itemsToMeasure = this._getTransition().getItemsToMeasure(fromItems, toItems);
        if (itemsToMeasure.length > 0) {
          this._setTransitionItemsState(prevItems => prevItems.setShouldMeasure(itemsToMeasure),
            () => {
              this._measureItems();
            });
        }
      }
    }

    /**
     * By default, keep the current scene and not show the incoming scene (by setting their opacity)
     * to prevent flickering and overdraw issues.
     * 
     * @param {*} props
     */
    _createDefaultHideCardStyle(props: NavigationSceneRendererProps) {
      const currentIndex = props.index;
      const prevIndex = this._fromRoute && this._fromRoute.index;
      const sceneIndex = props.scene.index;
      const opacity = (_.isNil(prevIndex) && currentIndex === sceneIndex) || prevIndex === sceneIndex ? 1 : 0;
      // console.log('prevIndex', prevIndex, 'sceneIndex', sceneIndex, 'opacity', opacity, 'fromRoute', this._fromRoute, 'toRoute', this._toRoute);
      return { opacity };
    }

    _renderExtraLayers = (props: NavigationSceneRendererProps) => {
      if (this._isInTransition()) {
        const overlay = this._renderOverlay(props);
        return overlay;
      } else {
        return undefined;
      }
    }

    _createExtraSceneProps = (props: NavigationSceneRendererProps) => {
      const defaultHideCardStyle = this._createDefaultHideCardStyle(props);
      const style = [defaultHideCardStyle, this.props.cardStyle];
      if (!this._isInTransition()) return { style };

      const transitionStyleMap = this._createInPlaceTransitionStyleMap(props);

      const onLayout = async () => {
        if (this._isInTransition) {
          const navigatingToNewRoute = this._getTransitionDirection() > 0;
          invariant(this._fromRoute && this._toRoute, "Must be called during transition");
          // Force the component to update when moving to a new scene and the new scene is laid out.
          // This is necessary since we need to wait for the transition items on the 
          // new scene to register themselves before creating transitions. Otherwise
          // the resulting transition will be incomplete/incorrect.
          //
          // Once the scene is laid out, we can assume the transition items on it have
          // already registered.
          if (
            navigatingToNewRoute
            && props.scene.route.routeName === this._toRoute.routeName
          ) {
            const { fromItems, toItems } = this._getFilteredFromToItems();
            if (this._getTransition().getItemsToMeasure(fromItems, toItems).length === 0) {
              this.forceUpdate();
            }
          }
          await this._measureTransitionItems();
        }
      }
      return {
        style,
        onLayout,
        transitionStyleMap,
      }
    }

    _getFromToItems(filter: (item: TransitionItem) => boolean) {
      const isOnRoute = route => item => item.routeName === (route && route.routeName);
      const filteredItems = this.state.transitionItems.items().filter(filter);

      const fromItems = filteredItems.filter(isOnRoute(this._fromRoute));
      const toItems = filteredItems.filter(isOnRoute(this._toRoute));
      return { fromItems, toItems };
    }

    /**
     * If no custom transitions are configured, and there is a shared element on EITHER "from"
     * OR "to" route, use sharedElementTransition to configure Transitioner, instead of what's
     * returned from _getTransitionContainer(). 
     *
     * The reason is that _getTransitionContainer() may return the platform default transition 
     * when the shared elements on the "to" route are not registered yet. Because at that point, 
     * there are no matching shared elements on "from" and "to" routes. If we use that transition
     * to configure the Transitioner, it'll set useNativeDriver to true, which causes an error
     * when the shared element transition is executed shortly after.
     *  
     * Side effects of this approach:
     * 1. If there is a shared element on the "from" route, the animation will always be configured as: 
     *    useNativeDriver=false, duration: 550, no matter if there is actually a matching 
     *    shared element on the to route. The animation will still be the default animation though. 
     *    For example, when navigating from PhotoGrid to Settings, the default platform transition will
     *    run, but its duration on Android is 550ms. A workaround is to configure a custom transition for
     *    this particular route.
     */
    _getTransitionContainerForConfig() {
      const tc = this._getTransitionContainer();
      if (tc.isDefault) {
        const { fromItems, toItems } = this._getFromToItems(i => i.transitionType === 'sharedElement');
        const hasSharedElement = fromItems.length > 0 || toItems.length > 0;
        if (hasSharedElement) {
          return this._createSharedElementTransition();
        }
      }
      return tc;
    }

    _getTransitionForConfig() {
      const tc = this._getTransitionContainerForConfig();
      return tc.transition;
    }

    _configureTransition = (
      // props for the new screen
      transitionProps: NavigationTransitionProps,
      // props for the old screen
      prevTransitionProps: NavigationTransitionProps
    ) => {
      if (!this._isInTransition()) return undefined;

      const isModal = this.props.mode === 'modal';
      // Copy the object so we can assign useNativeDriver below
      // (avoid Flow error, transitionSpec is of type NavigationTransitionSpec).
      const transitionSpec = {
        ...this._getTransitionConfig(
          transitionProps,
          prevTransitionProps
        ),
      };
      const transition = this._getTransitionForConfig();
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

    _getTransitionDirection() {
      invariant(this._fromRoute && this._toRoute, "Must be called during transition");
      return Math.sign(this._toRoute.index - this._fromRoute.index);
    }

    _isInTransition() {
      return this._fromRoute && this._toRoute;
    }

    _getTransitionConfig(
      // props for the new screen
      transitionProps: NavigationTransitionProps,
      // props for the old screen
      prevTransitionProps: NavigationTransitionProps
    ) {
      if (!this._isInTransition()) return undefined;

      const direction = this._getTransitionDirection();
      const defaultConfig = TransitionConfigs.defaultTransitionConfig(
        direction,
        this.props.mode === 'modal'
      ).transitionSpec;
      const tc = this._getTransitionContainerForConfig();
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