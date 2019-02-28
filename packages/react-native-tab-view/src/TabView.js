/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';

import TabBar, { type Props as TabBarProps } from './TabBar';
import Pager from './Pager';
import SceneView from './SceneView';
import type {
  Layout,
  NavigationState,
  Route,
  SceneRendererProps,
} from './types';

type Props<T: Route> = {|
  onIndexChange: (index: number) => mixed,
  navigationState: NavigationState<T>,
  renderScene: (props: {|
    ...SceneRendererProps,
    route: T,
  |}) => React.Node,
  renderLazyPlaceholder: (props: {| route: T |}) => React.Node,
  renderTabBar: (props: {|
    ...SceneRendererProps,
    navigationState: NavigationState<T>,
  |}) => React.Node,
  tabBarPosition: 'top' | 'bottom',
  initialLayout?: { width?: number, height?: number },
  lazy: boolean,
  swipeEnabled: boolean,
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold?: number,
  sceneContainerStyle?: ViewStyleProp,
  style?: ViewStyleProp,
|};

type State = {|
  layout: Layout,
|};

export default class TabView<T: Route> extends React.Component<
  Props<T>,
  State
> {
  static defaultProps = {
    tabBarPosition: 'top',
    renderTabBar: (props: TabBarProps<T>) => <TabBar {...props} />,
    renderLazyPlaceholder: () => null,
    swipeEnabled: true,
    lazy: false,
  };

  state = {
    layout: { width: 0, height: 0, ...this.props.initialLayout },
  };

  _jumpToIndex = (index: number) => {
    if (index !== this.props.navigationState.index) {
      this.props.onIndexChange(index);
    }
  };

  _handleLayout = (e: LayoutEvent) => {
    const { height, width } = e.nativeEvent.layout;

    if (
      this.state.layout.width === width &&
      this.state.layout.height === height
    ) {
      return;
    }

    this.setState({
      layout: {
        height,
        width,
      },
    });
  };

  render() {
    const {
      navigationState,
      lazy,
      swipeEnabled,
      swipeDistanceThreshold,
      swipeVelocityThreshold,
      tabBarPosition,
      renderTabBar,
      renderScene,
      renderLazyPlaceholder,
      sceneContainerStyle,
      style,
    } = this.props;
    const { layout } = this.state;

    return (
      <View onLayout={this._handleLayout} style={[styles.pager, style]}>
        <Pager
          navigationState={navigationState}
          layout={layout}
          swipeEnabled={swipeEnabled}
          swipeDistanceThreshold={swipeDistanceThreshold}
          swipeVelocityThreshold={swipeVelocityThreshold}
          onIndexChange={this._jumpToIndex}
        >
          {({ position, render, addListener, removeListener, jumpToIndex }) => {
            const jumpTo = (key: string) => {
              const index = navigationState.routes.findIndex(
                route => route.key === key
              );

              // A tab switch might occur when we're in the middle of a transition
              // In that case, the index might be same as before
              // So we conditionally make the pager to update the position
              if (navigationState.index === index) {
                jumpToIndex(index);
              } else {
                this._jumpToIndex(index);
              }
            };

            const sceneRendererProps = {
              position,
              layout,
              jumpTo,
              addListener,
              removeListener,
            };

            return (
              <React.Fragment>
                {tabBarPosition === 'top' &&
                  renderTabBar({
                    ...sceneRendererProps,
                    navigationState,
                  })}
                {render(
                  navigationState.routes.map((route, i) => {
                    return (
                      <SceneView
                        {...sceneRendererProps}
                        key={route.key}
                        index={i}
                        lazy={lazy}
                        navigationState={navigationState}
                        style={sceneContainerStyle}
                      >
                        {({ loading }) =>
                          loading
                            ? renderLazyPlaceholder({ route })
                            : renderScene({
                                ...sceneRendererProps,
                                route,
                              })
                        }
                      </SceneView>
                    );
                  })
                )}
                {tabBarPosition === 'bottom' &&
                  renderTabBar({
                    ...sceneRendererProps,
                    navigationState,
                  })}
              </React.Fragment>
            );
          }}
        </Pager>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    overflow: 'hidden',
  },
});
