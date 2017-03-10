/* @flow */

import React, { PureComponent, Children, PropTypes } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { SceneRendererProps } from './TabViewTypeDefinitions';

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number;
      y: number;
    };
  };
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },

  page: {
    flex: 1,
    overflow: 'hidden',
  },
});

type Props = SceneRendererProps & {
  swipeEnabled?: boolean;
  children?: any;
}

export default class TabViewPagerScroll extends PureComponent<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    swipeEnabled: PropTypes.bool,
    children: PropTypes.node,
  };

  componentDidMount() {
    this._scrollTo(this.props.navigationState.index * this.props.layout.width);
    this._positionListener = this.props.subscribe('position', this._updatePosition);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.layout !== this.props.layout || Children.count(prevProps.children) !== Children.count(this.props.children)) {
      global.requestAnimationFrame(() =>
        this._scrollTo(this.props.navigationState.index * this.props.layout.width)
      );
    }
  }

  componentWillUnmount() {
    this._positionListener.remove();
  }

  _positionListener: Object;
  _scrollView: Object;
  _isManualScroll: boolean = false;
  _isMomentumScroll: boolean = false;

  _scrollTo = (x: number) => {
    if (this._scrollView) {
      this._scrollView.scrollTo({
        x,
        animated: false,
      });
    }
  };

  _updatePosition = (value: number) => {
    if (this._isManualScroll || !this._scrollView) {
      return;
    }
    this._scrollTo(value * this.props.layout.width);
  };

  _handleBeginDrag = () => {
    // onScrollBeginDrag fires when user touches the ScrollView
    this._isManualScroll = true;
    this._isMomentumScroll = false;
  };

  _handleEndDrag = () => {
    // onScrollEndDrag fires when user lifts his finger
    // onMomentumScrollBegin fires after touch end
    // run the logic in next frame so we get onMomentumScrollBegin first
    global.requestAnimationFrame(() => {
      if (this._isMomentumScroll) {
        return;
      }
      this._isManualScroll = false;
    });
  };

  _handleMomentumScrollBegin = () => {
    // onMomentumScrollBegin fires on flick, as well as programmatic scroll
    this._isMomentumScroll = true;
  };

  _handleMomentumScrollEnd = (e: ScrollEvent) => {
    // onMomentumScrollEnd fires when the scroll finishes
    this._isMomentumScroll = false;
    this._isManualScroll = false;

    const nextIndex = Math.round(e.nativeEvent.contentOffset.x / this.props.layout.width);
    this.props.jumpToIndex(nextIndex);
  };

  _handleScroll = (e: ScrollEvent) => {
    if (!this._isManualScroll) {
      return;
    }
    this.props.position.setValue(
      e.nativeEvent.contentOffset.x / this.props.layout.width
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
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='always'
        scrollEnabled={this.props.swipeEnabled}
        automaticallyAdjustContentInsets={false}
        bounces={false}
        alwaysBounceHorizontal={false}
        scrollsToTop={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={this._handleScroll}
        onScrollBeginDrag={this._handleBeginDrag}
        onScrollEndDrag={this._handleEndDrag}
        onMomentumScrollBegin={this._handleMomentumScrollBegin}
        onMomentumScrollEnd={this._handleMomentumScrollEnd}
        contentOffset={{ x: this.props.navigationState.index * this.props.layout.width, y: 0 }}
        style={styles.container}
        contentContainerStyle={layout.width ? null : styles.container}
        ref={this._setRef}
      >
        {Children.map(children, (child, i) => (
          <View
            key={navigationState.routes[i].key}
            testID={navigationState.routes[i].testID}
            style={
              layout.width ?
                { width: layout.width, overflow: 'hidden' } :
                i === 0 ? styles.page : null
            }
          >
            {i === 0 || layout.width ? child : null}
          </View>
        ))}
      </ScrollView>
    );
  }
}
