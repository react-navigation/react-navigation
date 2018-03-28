/* @flow */

import * as React from 'react';
import { View, ViewPagerAndroid, StyleSheet, I18nManager } from 'react-native';
import { PagerRendererPropType } from './TabViewPropTypes';
import type { PagerRendererProps } from './TabViewTypeDefinitions';

type PageScrollEvent = {
  nativeEvent: {
    position: number,
    offset: number,
  },
};

type PageScrollState = 'dragging' | 'settling' | 'idle';

type Props<T> = PagerRendererProps<T> & {
  keyboardDismissMode: 'none' | 'on-drag',
};

export default class TabViewPagerAndroid<T: *> extends React.Component<
  Props<T>
> {
  static propTypes = PagerRendererPropType;

  static defaultProps = {
    canJumpToTab: () => true,
    keyboardDismissMode: 'on-drag',
  };

  constructor(props: Props<T>) {
    super(props);
    this._currentIndex = this.props.navigationState.index;
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (
      prevProps.navigationState.routes !== this.props.navigationState.routes ||
      prevProps.layout.width !== this.props.layout.width
    ) {
      this._handlePageChange(this.props.navigationState.index, false);
    } else if (
      prevProps.navigationState.index !== this.props.navigationState.index
    ) {
      this._handlePageChange(this.props.navigationState.index);
    }
  }

  _pageChangeCallabck: any;
  _viewPager: ?ViewPagerAndroid;
  _isIdle: boolean = true;
  _currentIndex = 0;

  _getPageIndex = (index: number) =>
    I18nManager.isRTL
      ? this.props.navigationState.routes.length - (index + 1)
      : index;

  _setPage = (index: number, animated = true) => {
    const pager = this._viewPager;

    if (pager) {
      const page = this._getPageIndex(index);

      if (this.props.animationEnabled === false || animated === false) {
        pager.setPageWithoutAnimation(page);
      } else {
        pager.setPage(page);
      }
    }
  };

  _handlePageChange = (index: number, animated?: boolean) => {
    if (this._isIdle && this._currentIndex !== index) {
      this._setPage(index, animated);
      this._currentIndex = index;
    }
  };

  _handlePageScroll = (e: PageScrollEvent) => {
    this.props.offsetX.setValue(
      e.nativeEvent.position *
        this.props.layout.width *
        (I18nManager.isRTL ? 1 : -1)
    );
    this.props.panX.setValue(
      e.nativeEvent.offset *
        this.props.layout.width *
        (I18nManager.isRTL ? 1 : -1)
    );
  };

  _handlePageScrollStateChanged = (e: PageScrollState) => {
    this._isIdle = e === 'idle';

    let nextIndex = this._currentIndex;

    const nextRoute = this.props.navigationState.routes[nextIndex];

    if (this.props.canJumpToTab(nextRoute)) {
      this.props.jumpTo(nextRoute.key);
    } else {
      this._setPage(this.props.navigationState.index);
      this._currentIndex = this.props.navigationState.index;
    }

    switch (e) {
      case 'dragging':
        this.props.onSwipeStart && this.props.onSwipeStart();
        break;
      case 'settling':
        this.props.onSwipeEnd && this.props.onSwipeEnd();
        break;
      case 'idle':
        this.props.onAnimationEnd && this.props.onAnimationEnd();
        break;
    }
  };

  _handlePageSelected = (e: PageScrollEvent) => {
    const index = this._getPageIndex(e.nativeEvent.position);
    this._currentIndex = index;
  };

  _setRef = (el: ?ViewPagerAndroid) => (this._viewPager = el);

  render() {
    const {
      children,
      navigationState,
      swipeEnabled,
      keyboardDismissMode,
    } = this.props;
    const content = React.Children.map(children, (child, i) => (
      <View
        key={navigationState.routes[i].key}
        testID={navigationState.routes[i].testID}
        style={styles.page}
      >
        {child}
      </View>
    ));

    if (I18nManager.isRTL) {
      content.reverse();
    }

    const initialPage = this._getPageIndex(navigationState.index);

    return (
      <ViewPagerAndroid
        key={navigationState.routes.length}
        keyboardDismissMode={keyboardDismissMode}
        initialPage={initialPage}
        scrollEnabled={swipeEnabled !== false}
        onPageScroll={this._handlePageScroll}
        onPageScrollStateChanged={this._handlePageScrollStateChanged}
        onPageSelected={this._handlePageSelected}
        style={styles.container}
        ref={this._setRef}
      >
        {content}
      </ViewPagerAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  page: {
    overflow: 'hidden',
  },
});
