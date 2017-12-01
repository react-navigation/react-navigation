/* @flow */

import * as React from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { PagerRendererPropType } from './TabViewPropTypes';
import type { PagerRendererProps, Route } from './TabViewTypeDefinitions';

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number,
      y: number,
    },
  },
};

type State = {|
  initialOffset: {| x: number, y: number |},
|};

type Props<T> = PagerRendererProps<T>;

export default class TabViewPagerScroll<T: Route<*>> extends React.Component<
  Props<T>,
  State
> {
  static propTypes = PagerRendererPropType;

  constructor(props: Props<T>) {
    super(props);

    const { navigationState, layout } = this.props;

    this.state = {
      initialOffset: {
        x: navigationState.index * layout.width,
        y: 0,
      },
    };
  }

  componentDidMount() {
    this._setInitialPage();
    this._resetListener = this.props.subscribe('reset', this._scrollTo);
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (
      prevProps.layout.width !== this.props.layout.width ||
      prevProps.navigationState !== this.props.navigationState
    ) {
      const { navigationState, layout } = this.props;
      const offset = navigationState.index * layout.width;

      if (prevProps.layout.width !== this.props.layout.width) {
        this._scrollTo(offset, false);
      } else {
        this._scrollTo(offset);
      }
    }
  }

  componentWillUnmount() {
    this._resetListener && this._resetListener.remove();
  }

  _scrollView: ?ScrollView;
  _resetListener: Object;
  _currentOffset: ?number;
  _isIdleCallback: any;
  _isIdle: boolean = true;
  _isInitial: boolean = true;

  _setInitialPage = () => {
    if (this.props.layout.width) {
      const offset = this.props.navigationState.index * this.props.layout.width;
      this._isInitial = true;
      this._scrollTo(offset, false);
    }

    setTimeout(() => {
      this._isInitial = false;
    }, 150);
  };

  _scrollTo = (x: number, animated = this.props.animationEnabled !== false) => {
    if (animated && !this._isIdle) {
      return;
    }

    if (this._scrollView) {
      this._scrollView.scrollTo({
        x,
        animated,
      });
    }
  };

  _handleMomentumScrollEnd = (e: ScrollEvent) => {
    const nextIndex = Math.round(
      e.nativeEvent.contentOffset.x / this.props.layout.width
    );
    this._isIdle = true;
    this.props.jumpToIndex(nextIndex);
  };

  _handleScrollAnimationEnd = () => {
    this._isIdle = true;
  };

  _handleScroll = (e: ScrollEvent) => {
    if (this._isInitial) {
      return;
    }

    this._currentOffset = e.nativeEvent.contentOffset.x;

    const { navigationState, layout } = this.props;
    const offset = navigationState.index * layout.width;

    this.props.offsetX.setValue(-offset);
    this.props.panX.setValue(offset - e.nativeEvent.contentOffset.x);

    this._isIdle = false;
  };

  render() {
    const { children, layout, navigationState } = this.props;
    return (
      <ScrollView
        horizontal
        pagingEnabled
        directionalLockEnabled
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        overScrollMode="never"
        scrollEnabled={this.props.swipeEnabled}
        automaticallyAdjustContentInsets={false}
        bounces={false}
        alwaysBounceHorizontal={false}
        scrollsToTop={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={1}
        onScroll={this._handleScroll}
        onScrollAnimationEnd={this._handleScrollAnimationEnd}
        onMomentumScrollEnd={this._handleMomentumScrollEnd}
        contentOffset={this.state.initialOffset}
        style={styles.container}
        contentContainerStyle={layout.width ? null : styles.container}
        ref={el => (this._scrollView = el)}
      >
        {React.Children.map(children, (child, i) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    overflow: 'hidden',
  },
});
