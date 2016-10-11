/* @flow */

import React, { Component, Children, PropTypes } from 'react';
import {
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
    flex: 1,
  },
});

type Props = SceneRendererProps & {
  swipeEnabled?: boolean;
  children?: any;
}

export default class TabViewPagerAndroid extends Component<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    swipeEnabled: PropTypes.bool,
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
      this._viewPager.setPage(index);
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
    return (
      <ViewPagerAndroid
        key={this.props.navigationState.routes.length}
        keyboardDismissMode='on-drag'
        initialPage={this.props.navigationState.index}
        scrollEnabled={this.props.swipeEnabled !== false}
        onPageScroll={this._handlePageScroll}
        onPageScrollStateChanged={this._handlePageScrollStateChanged}
        onPageSelected={this._handlePageSelected}
        style={styles.container}
        ref={this._setRef}
      >
        {this.props.children}
      </ViewPagerAndroid>
    );
  }
}
