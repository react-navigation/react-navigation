/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPagerAndroid, StyleSheet, I18nManager } from 'react-native';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { SceneRendererProps, Route } from './TabViewTypeDefinitions';

type PageScrollEvent = {
  nativeEvent: {
    position: number,
    offset: number,
  },
};

type PageScrollState = 'dragging' | 'settling' | 'idle';

type Props<T> = SceneRendererProps<T> & {
  animationEnabled?: boolean,
  swipeEnabled?: boolean,
  children?: React.Node,
};

export default class TabViewPagerAndroid<T: Route<*>> extends React.Component<
  Props<T>
> {
  static propTypes = {
    ...SceneRendererPropType,
    animationEnabled: PropTypes.bool,
    swipeEnabled: PropTypes.bool,
    children: PropTypes.node,
  };

  constructor(props: Props<T>) {
    super(props);
    this._currentIndex = this.props.navigationState.index;
  }

  componentDidMount() {
    this._resetListener = this.props.subscribe('reset', this._handlePageChange);
  }

  componentWillReceiveProps(nextProps: Props<T>) {
    if (
      this.props.layout !== nextProps.layout ||
      React.Children.count(this.props.children) !==
        React.Children.count(nextProps.children)
    ) {
      this._animationFrameCallback = () => {
        if (this._viewPager) {
          const { navigationState } = nextProps;
          const page = I18nManager.isRTL
            ? navigationState.routes.length - (navigationState.index + 1)
            : navigationState.index;

          this._viewPager.setPageWithoutAnimation(page);
        }
      };

      if (!this._isRequestingAnimationFrame) {
        this._isRequestingAnimationFrame = true;

        global.requestAnimationFrame(() => {
          this._isRequestingAnimationFrame = false;

          if (this._animationFrameCallback) {
            this._animationFrameCallback();
          }
        });
      }
    }
  }

  componentDidUpdate() {
    this._handlePageChange(this.props.navigationState.index);
  }

  componentWillUnmount() {
    this._resetListener.remove();
  }

  _animationFrameCallback: ?() => void;
  _isRequestingAnimationFrame: boolean = false;
  _resetListener: Object;
  _viewPager: ?ViewPagerAndroid;
  _isIdle: boolean = true;
  _currentIndex = 0;

  _getPageIndex = (index: number) =>
    I18nManager.isRTL
      ? this.props.navigationState.routes.length - (index + 1)
      : index;

  _setPage = (index: number) => {
    const { _viewPager } = this;
    if (_viewPager) {
      this._animationFrameCallback = null;

      const page = this._getPageIndex(index);
      if (this.props.animationEnabled !== false) {
        _viewPager.setPage(page);
      } else {
        _viewPager.setPageWithoutAnimation(page);
      }
    }
  };

  _handlePageChange = (index: number) => {
    if (this._isIdle && this._currentIndex !== index) {
      this._setPage(index);
      this._currentIndex = index;
    }
  };

  _handlePageScroll = (e: PageScrollEvent) => {
    this.props.position.setValue(
      this._getPageIndex(e.nativeEvent.position) +
        e.nativeEvent.offset * (I18nManager.isRTL ? -1 : 1)
    );
  };

  _handlePageScrollStateChanged = (e: PageScrollState) => {
    this._isIdle = e === 'idle';
    this.props.jumpToIndex(this._currentIndex);
  };

  _handlePageSelected = (e: PageScrollEvent) => {
    const index = this._getPageIndex(e.nativeEvent.position);
    this._currentIndex = index;
  };

  _setRef = (el: ?ViewPagerAndroid) => (this._viewPager = el);

  render() {
    const { children, navigationState, swipeEnabled } = this.props;
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
        keyboardDismissMode="on-drag"
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
