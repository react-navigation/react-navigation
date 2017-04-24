/* @flow */

import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { SceneRendererProps } from './TabViewTypeDefinitions';

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number,
      y: number,
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  page: {
    flex: 1,
    overflow: 'hidden',
  },
});

type State = {
  initialOffset: { x: number, y: number },
};

type Props = SceneRendererProps & {
  swipeEnabled?: boolean,
  children?: any,
};

export default class TabViewPagerScroll
  extends PureComponent<void, Props, State> {
  static propTypes = {
    ...SceneRendererPropType,
    swipeEnabled: PropTypes.bool,
    children: PropTypes.node,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      initialOffset: {
        x: this.props.navigationState.index * this.props.layout.width,
        y: 0,
      },
    };
  }

  componentDidMount() {
    this._scrollTo(
      this.props.navigationState.index * this.props.layout.width,
      false,
    );
    this._resetListener = this.props.subscribe('reset', this._scrollTo);
  }

  componentDidUpdate(prevProps: Props) {
    const amount = this.props.navigationState.index * this.props.layout.width;
    if (prevProps.navigationState !== this.props.navigationState) {
      global.requestAnimationFrame(() => this._scrollTo(amount));
    } else if (prevProps.layout !== this.props.layout) {
      this._scrollTo(amount, false);
    }
  }

  componentWillUnmount() {
    this._resetListener.remove();
  }

  _resetListener: Object;
  _scrollView: Object;

  _scrollTo = (x: number, animated = true) => {
    if (this._scrollView) {
      this._scrollView.scrollTo({
        x,
        animated,
      });
    }
  };

  _handleMomentumScrollEnd = (e: ScrollEvent) => {
    const nextIndex = Math.round(
      e.nativeEvent.contentOffset.x / this.props.layout.width,
    );
    this.props.jumpToIndex(nextIndex);
  };

  _handleScroll = (e: ScrollEvent) => {
    this.props.position.setValue(
      e.nativeEvent.contentOffset.x / this.props.layout.width,
    );
  };

  _setRef = (el: Object) => (this._scrollView = el);

  render() {
    const { children, layout, navigationState } = this.props;
    return (
      <ScrollView
        horizontal
        pagingEnabled
        directionalLockEnabled
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        scrollEnabled={this.props.swipeEnabled}
        automaticallyAdjustContentInsets={false}
        bounces={false}
        alwaysBounceHorizontal={false}
        scrollsToTop={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={this._handleScroll}
        onMomentumScrollEnd={this._handleMomentumScrollEnd}
        contentOffset={this.state.initialOffset}
        style={styles.container}
        contentContainerStyle={layout.width ? null : styles.container}
        ref={this._setRef}
      >
        {Children.map(children, (child, i) => (
          <View
            key={navigationState.routes[i].key}
            testID={navigationState.routes[i].testID}
            style={
              layout.width
                ? { width: layout.width, overflow: 'hidden' }
                : i === navigationState.index ? styles.page : null
            }
          >
            {i === navigationState.index || layout.width ? child : null}
          </View>
        ))}
      </ScrollView>
    );
  }
}
