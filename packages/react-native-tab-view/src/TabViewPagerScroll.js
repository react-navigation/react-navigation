/* @flow */

import * as React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { PagerRendererPropType } from './TabViewPropTypes';
import type { PagerRendererProps } from './TabViewTypeDefinitions';

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

export default class TabViewPagerScroll<T: *> extends React.Component<
  Props<T>,
  State
> {
  static propTypes = PagerRendererPropType;

  static defaultProps = {
    canJumpToTab: () => true,
  };

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
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (
      prevProps.layout.width !== this.props.layout.width ||
      prevProps.navigationState !== this.props.navigationState
    ) {
      this._scrollTo(
        this.props.navigationState.index * this.props.layout.width,
        prevProps.layout.width === this.props.layout.width
      );
    }
  }

  _scrollView: ?ScrollView;
  _idleCallback: any;
  _isIdle: boolean = true;
  _isInitial: boolean = true;

  _setInitialPage = () => {
    if (this.props.layout.width) {
      this._isInitial = true;
      this._scrollTo(
        this.props.navigationState.index * this.props.layout.width,
        false
      );
    }

    setTimeout(() => {
      this._isInitial = false;
    }, 50);
  };

  _scrollTo = (x: number, animated) => {
    if (this._isIdle && this._scrollView) {
      this._scrollView.scrollTo({
        x,
        animated: animated && this.props.animationEnabled !== false,
      });
    }
  };

  _handleMomentumScrollEnd = (e: ScrollEvent) => {
    let nextIndex = Math.round(
      e.nativeEvent.contentOffset.x / this.props.layout.width
    );

    if (this.props.canJumpToTab(this.props.navigationState.routes[nextIndex])) {
      this.props.jumpToIndex(nextIndex);
    } else {
      global.requestAnimationFrame(() => {
        this._scrollTo(
          this.props.navigationState.index * this.props.layout.width
        );
      });
    }
  };

  _handleScroll = (e: ScrollEvent) => {
    if (this._isInitial) {
      return;
    }

    const { navigationState, layout } = this.props;
    const offset = navigationState.index * layout.width;

    this.props.offsetX.setValue(-offset);
    this.props.panX.setValue(offset - e.nativeEvent.contentOffset.x);

    global.cancelAnimationFrame(this._idleCallback);

    this._isIdle = false;
    this._idleCallback = global.requestAnimationFrame(() => {
      this._isIdle = true;
    });
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
