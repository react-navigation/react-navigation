/* @flow */

import * as React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { PagerRendererPropType } from './PropTypes';
import type { PagerRendererProps } from './TypeDefinitions';

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number,
      y: number,
    },
    contentSize: {
      height: number,
      width: number,
    },
  },
};

type State = {|
  initialOffset: {| x: number, y: number |},
|};

type Props<T> = PagerRendererProps<T>;

export default class PagerScroll<T: *> extends React.Component<
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
    const amount = this.props.navigationState.index * this.props.layout.width;

    if (
      prevProps.navigationState.routes !== this.props.navigationState.routes ||
      prevProps.layout.width !== this.props.layout.width
    ) {
      this._scrollTo(amount, false);
    } else if (
      prevProps.navigationState.index !== this.props.navigationState.index
    ) {
      this._scrollTo(amount);
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

  _scrollTo = (x: number, animated = true) => {
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

    const nextRoute = this.props.navigationState.routes[nextIndex];

    if (this.props.canJumpToTab({ route: nextRoute })) {
      this.props.jumpTo(nextRoute.key);
      this.props.onAnimationEnd && this.props.onAnimationEnd();
    } else {
      global.requestAnimationFrame(() => {
        this._scrollTo(
          this.props.navigationState.index * this.props.layout.width
        );
      });
    }
  };

  _handleScroll = (e: ScrollEvent) => {
    if (this._isInitial || e.nativeEvent.contentSize.width === 0) {
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
    const {
      children,
      layout,
      navigationState,
      onSwipeStart,
      onSwipeEnd,
    } = this.props;

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
        onScrollBeginDrag={onSwipeStart}
        onScrollEndDrag={onSwipeEnd}
        onMomentumScrollEnd={this._handleMomentumScrollEnd}
        contentOffset={this.state.initialOffset}
        style={styles.container}
        contentContainerStyle={layout.width ? null : styles.container}
        ref={el => (this._scrollView = el)}
      >
        {React.Children.map(children, (child, i) => {
          const route = navigationState.routes[i];
          const focused = i === navigationState.index;

          return (
            <View
              key={route.key}
              testID={this.props.getTestID({ route })}
              accessibilityElementsHidden={!focused}
              importantForAccessibility={
                focused ? 'auto' : 'no-hide-descendants'
              }
              style={
                layout.width
                  ? { width: layout.width, overflow: 'hidden' }
                  : focused
                    ? styles.page
                    : null
              }
            >
              {focused || layout.width ? child : null}
            </View>
          );
        })}
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
