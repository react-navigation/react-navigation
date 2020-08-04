import * as React from 'react';
import { StyleSheet, Keyboard, InteractionManager } from 'react-native';
import Animated from 'react-native-reanimated';
import { Props } from './Pager';
import { Route, Listener } from './types';

const { event, divide, onChange, cond, eq, round, call, Value } = Animated;

type State = {
  initialOffset: { x: number; y: number };
};

export default class ScrollPager<T extends Route> extends React.Component<
  Props<T> & { overscroll?: boolean },
  State
> {
  static defaultProps = {
    bounces: true,
  };

  componentDidMount() {
    if (this.props.layout.width) {
      this.scrollTo(
        this.props.navigationState.index * this.props.layout.width,
        false
      );
    }
  }

  componentDidUpdate(prevProps: Props<T>) {
    const offset = this.props.navigationState.index * this.props.layout.width;

    if (
      prevProps.navigationState.routes.length !==
        this.props.navigationState.routes.length ||
      prevProps.layout.width !== this.props.layout.width
    ) {
      this.scrollTo(offset, false);
    } else if (
      prevProps.navigationState.index !== this.props.navigationState.index
    ) {
      this.scrollTo(offset);
    }

    if (prevProps.layout.width !== this.props.layout.width) {
      this.layoutWidthNode.setValue(this.props.layout.width);
    }
  }

  componentWillUnmount() {
    if (this.interactionHandle !== null) {
      InteractionManager.clearInteractionHandle(this.interactionHandle);
    }
  }

  private initialOffset = {
    x: this.props.navigationState.index * this.props.layout.width,
    y: 0,
  };

  private wasTouched: boolean = false;

  // InteractionHandle to handle tasks around animations
  private interactionHandle: number | null = null;

  private scrollViewRef = React.createRef<Animated.ScrollView>();

  private jumpTo = (key: string) => {
    this.wasTouched = false;
    const { navigationState, keyboardDismissMode, onIndexChange } = this.props;

    const index = navigationState.routes.findIndex(
      (route) => route.key === key
    );

    if (navigationState.index === index) {
      this.scrollTo(index * this.props.layout.width);
    } else {
      onIndexChange(index);
      if (keyboardDismissMode === 'auto') {
        Keyboard.dismiss();
      }
    }
  };

  private scrollTo = (x: number, animated = true) => {
    if (this.scrollViewRef.current) {
      // getNode() is not necessary in newer versions of React Native
      const scrollView =
        // @ts-ignore
        typeof this.scrollViewRef.current?.scrollTo === 'function'
          ? this.scrollViewRef.current
          : this.scrollViewRef.current?.getNode();

      // @ts-ignore
      scrollView?.scrollTo({
        x,
        animated: animated,
      });
    }
  };

  private enterListeners: Listener[] = [];

  private addListener = (type: 'enter', listener: Listener) => {
    switch (type) {
      case 'enter':
        this.enterListeners.push(listener);
        break;
    }
  };

  private removeListener = (type: 'enter', listener: Listener) => {
    switch (type) {
      case 'enter': {
        const index = this.enterListeners.indexOf(listener);

        if (index > -1) {
          this.enterListeners.splice(index, 1);
        }

        break;
      }
    }
  };

  private position = new Animated.Value(
    this.props.navigationState.index * this.props.layout.width
  );

  private onScroll = event([
    {
      nativeEvent: {
        contentOffset: {
          x: this.position,
        },
      },
    },
  ]);

  private layoutWidthNode = new Value(this.props.layout.width);

  private relativePosition = divide(this.position, this.layoutWidthNode);

  render() {
    const {
      children,
      layout,
      onSwipeStart,
      onSwipeEnd,
      overscroll,
      onIndexChange,
      navigationState,
    } = this.props;

    const handleSwipeStart = () => {
      this.wasTouched = false;
      onSwipeStart?.();
      this.interactionHandle = InteractionManager.createInteractionHandle();
    };

    const handleSwipeEnd = () => {
      this.wasTouched = true;
      onSwipeEnd?.();
      if (this.interactionHandle !== null) {
        InteractionManager.clearInteractionHandle(this.interactionHandle);
      }
    };

    return children({
      position: this.relativePosition,
      addListener: this.addListener,
      removeListener: this.removeListener,
      jumpTo: this.jumpTo,
      render: (children) => (
        <Animated.ScrollView
          pagingEnabled
          directionalLockEnabled
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          overScrollMode="never"
          scrollToOverflowEnabled
          scrollEnabled={this.props.swipeEnabled}
          automaticallyAdjustContentInsets={false}
          bounces={overscroll}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={this.onScroll}
          onScrollBeginDrag={handleSwipeStart}
          onScrollEndDrag={handleSwipeEnd}
          onMomentumScrollEnd={this.onScroll}
          contentOffset={this.initialOffset}
          style={styles.container}
          contentContainerStyle={
            layout.width
              ? {
                  flexDirection: 'row',
                  width: layout.width * navigationState.routes.length,
                  flex: 1,
                }
              : null
          }
          ref={this.scrollViewRef}
        >
          {children}
          <Animated.Code
            exec={onChange(
              this.relativePosition,
              cond(eq(round(this.relativePosition), this.relativePosition), [
                call([this.relativePosition], ([relativePosition]) => {
                  if (this.wasTouched) {
                    onIndexChange(relativePosition);
                    this.wasTouched = false;
                  }
                }),
              ])
            )}
          />
        </Animated.ScrollView>
      ),
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
