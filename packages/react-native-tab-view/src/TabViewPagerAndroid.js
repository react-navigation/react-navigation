/* @flow */

import React, { PureComponent, Children, PropTypes } from 'react';
import {
  View,
  ViewPagerAndroid,
  StyleSheet,
} from 'react-native';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { SceneRendererProps } from './TabViewTypeDefinitions';

type PageScrollEvent = {
  nativeEvent: {
    position: number;
    offset: number;
  };
}

type PageScrollState = 'dragging' | 'settling' | 'idle'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  page: {
    overflow: 'hidden',
  },
});

type Props = SceneRendererProps & {
  swipeEnabled?: boolean;
  animationEnabled?: boolean;
  children?: any;
}

export default class TabViewPagerAndroid extends PureComponent<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    swipeEnabled: PropTypes.bool,
    animationEnabled: PropTypes.bool,
    children: PropTypes.node,
  };

  componentWillMount() {
    this._currentIndex = this.props.navigationState.index;
    this._jumpListener = this.props.subscribe('jump', this._handleJump);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.layout !== nextProps.layout || Children.count(this.props.children) !== Children.count(nextProps.children)) {
      global.requestAnimationFrame(() => {
        if (this._viewPager) {
          this._viewPager.setPageWithoutAnimation(nextProps.navigationState.index);
        }
      });
    }
  }

  componentDidUpdate() {
    if (this._isIdle) {
      this._setPage(this.props.navigationState.index);
    }
  }

  componentWillUnmount() {
    this._jumpListener.remove();
  }

  _jumpListener: Object;
  _viewPager: Object;
  _isDrag: boolean = false;
  _isIdle: boolean = true;
  _currentIndex: number;

  _setPage = (index: number) => {
    if (this._viewPager && this._currentIndex !== index) {
      this._currentIndex = index;
      if (this.props.animationEnabled !== false) {
        this._viewPager.setPage(index);
      } else {
        this._viewPager.setPageWithoutAnimation(index);
      }
    }
  }

  _handleJump = (index: number) => {
    if (this._isIdle) {
      this._setPage(index);
    }
  };

  _handlePageScroll = (e: PageScrollEvent) => {
    if (this._isDrag) {
      this.props.position.setValue(
        e.nativeEvent.position + e.nativeEvent.offset
      );
    }
  };

  _handlePageScrollStateChanged = (e: PageScrollState) => {
    this._isIdle = e === 'idle';
    if (e === 'dragging') {
      this._isDrag = true;
    } else if (e === 'idle') {
      this._isDrag = false;
      if (this._currentIndex !== this.props.navigationState.index) {
        this.props.jumpToIndex(this._currentIndex);
      }
    }
  };

  _handlePageSelected = (e: PageScrollEvent) => {
    this._currentIndex = e.nativeEvent.position;
  };

  _setRef = (el: Object) => (this._viewPager = el);

  render() {
    const { children, navigationState, swipeEnabled } = this.props;
    return (
      <ViewPagerAndroid
        key={navigationState.routes.length}
        keyboardDismissMode='on-drag'
        initialPage={navigationState.index}
        scrollEnabled={swipeEnabled !== false}
        onPageScroll={this._handlePageScroll}
        onPageScrollStateChanged={this._handlePageScrollStateChanged}
        onPageSelected={this._handlePageSelected}
        style={styles.container}
        ref={this._setRef}
      >
        {Children.map(children, (child, i) => (
          <View
            key={navigationState.routes[i].key}
            testID={navigationState.routes[i].testID}
            style={styles.page}
          >
            {child}
          </View>
        ))}
      </ViewPagerAndroid>
    );
  }
}
