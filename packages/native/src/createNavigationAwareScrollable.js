import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { withNavigation } from '@react-navigation/core';

export default function createNavigationAwareScrollable(Component: any) {
  class ComponentWithNavigationScrolling extends React.PureComponent<any> {
    static displayName = `NavigationAwareScrollable(${Component.displayName ||
      Component.name})`;

    _subscription: any;

    componentDidMount() {
      this._subscription = this.props.navigation.addListener('refocus', () => {
        const scrollableNode = this.getNode();
        if (this.props.navigation.isFocused() && scrollableNode !== null) {
          if (scrollableNode.scrollToTop != null) {
            scrollableNode.scrollToTop();
          } else if (scrollableNode.scrollTo != null) {
            scrollableNode.scrollTo({ y: 0 });
          }
        }
      });
    } 

    setNativeProps = (...args) => {
      return this.getNode().setNativeProps(...args);
    }

    getScrollResponder = (...args) => {
      return this.getNode().getScrollResponder(...args);
    }

    getScrollableNode = (...args) => {
      return this.getNode().getScrollableNode(...args);
    }

    getInnerViewNode = (...args) => {
      return this.getNode().getInnerViewNode(...args);
    }

    scrollTo = (...args) => {
      return this.getNode().scrollTo(...args);
    }

    scrollToEnd = (...args) => {
      return this.getNode().scrollToEnd(...args);
    }

    scrollWithoutAnimationTo = (...args) => {
      return this.getNode().scrollWithoutAnimationTo(...args);
    }

    flashScrollIndicators = (...args) => {
      return this.getNode().flashScrollIndicators(...args);
    }

    getNode() {
      if (this._scrollRef === null) {
        return null;
      }

      if (this._scrollRef.getScrollResponder) {
        return this._scrollRef.getScrollResponder();
      } else if (this._scrollRef.getNode) {
        return this._scrollRef.getNode();
      } else {
        return this._scrollRef;
      }
    }

    componentWillUnmount() {
      if (this._subscription != null) {
        this._subscription.remove();
      }
    }

    render() {
      return (
        <Component
          ref={view => {
            this._scrollRef = view;
          }}
          {...this.props}
        />
      );
    }
  }

  return hoistStatics(
    withNavigation(ComponentWithNavigationScrolling),
    Component
  );
}

