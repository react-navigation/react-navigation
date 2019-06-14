import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { getStatusBarHeight } from 'react-native-safe-area-view';
import HeaderTitle from './HeaderTitle';
import HeaderBackButton from './HeaderBackButton';
import HeaderBackground from './HeaderBackground';
import memoize from '../../utils/memoize';
import {
  Layout,
  HeaderStyleInterpolator,
  Route,
  HeaderBackButtonProps,
  HeaderOptions,
  HeaderScene,
} from '../../types';

export type Scene<T> = {
  route: T;
  progress: Animated.Node<number>;
};

type Props = HeaderOptions & {
  layout: Layout;
  onGoBack?: () => void;
  title?: string;
  leftLabel?: string;
  scene: HeaderScene<Route>;
  styleInterpolator: HeaderStyleInterpolator;
};

type State = {
  titleLayout?: Layout;
  leftLabelLayout?: Layout;
};

export const getDefaultHeaderHeight = (layout: Layout) => {
  const isLandscape = layout.width > layout.height;

  let headerHeight;

  if (Platform.OS === 'ios') {
    // @ts-ignore
    if (isLandscape && !Platform.isPad) {
      headerHeight = 32;
    } else {
      headerHeight = 44;
    }
  } else if (Platform.OS === 'android') {
    headerHeight = 56;
  } else {
    headerHeight = 64;
  }

  return headerHeight + getStatusBarHeight(isLandscape);
};

export default class HeaderSegment extends React.Component<Props, State> {
  static defaultProps = {
    headerBackground: () => <HeaderBackground />,
  };

  state: State = {};

  private handleTitleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;
    const { titleLayout } = this.state;

    if (
      titleLayout &&
      height === titleLayout.height &&
      width === titleLayout.width
    ) {
      return;
    }

    this.setState({ titleLayout: { height, width } });
  };

  private handleLeftLabelLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;
    const { leftLabelLayout } = this.state;

    if (
      leftLabelLayout &&
      height === leftLabelLayout.height &&
      width === leftLabelLayout.width
    ) {
      return;
    }

    this.setState({ leftLabelLayout: { height, width } });
  };

  private getInterpolatedStyle = memoize(
    (
      styleInterpolator: HeaderStyleInterpolator,
      layout: Layout,
      current: Animated.Node<number>,
      next: Animated.Node<number> | undefined,
      titleLayout: Layout | undefined,
      leftLabelLayout: Layout | undefined
    ) =>
      styleInterpolator({
        progress: {
          current,
          next,
        },
        layouts: {
          screen: layout,
          title: titleLayout,
          leftLabel: leftLabelLayout,
        },
      })
  );

  render() {
    const {
      scene,
      layout,
      title: currentTitle,
      leftLabel: previousTitle,
      onGoBack,
      headerLeft: left = (props: HeaderBackButtonProps) => (
        <HeaderBackButton {...props} />
      ),
      headerBackground,
      // @ts-ignore
      headerStatusBarHeight = getStatusBarHeight(layout.width > layout.height),
      headerRight: right,
      headerBackImage: backImage,
      headerBackTitle: leftLabel,
      headerTruncatedBackTitle: truncatedLabel,
      headerPressColorAndroid: pressColorAndroid,
      headerBackAllowFontScaling: backAllowFontScaling,
      headerTitleAllowFontScaling: titleAllowFontScaling,
      headerTitleStyle: customTitleStyle,
      headerBackTitleStyle: customLeftLabelStyle,
      headerLeftContainerStyle: leftContainerStyle,
      headerRightContainerStyle: rightContainerStyle,
      headerTitleContainerStyle: titleContainerStyle,
      styleInterpolator,
    } = this.props;

    const { leftLabelLayout, titleLayout } = this.state;

    const {
      titleStyle,
      leftButtonStyle,
      leftLabelStyle,
      rightButtonStyle,
      backgroundStyle,
    } = this.getInterpolatedStyle(
      styleInterpolator,
      layout,
      scene.progress.current,
      scene.progress.next,
      titleLayout,
      previousTitle ? leftLabelLayout : undefined
    );

    return (
      <React.Fragment>
        {headerBackground ? (
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, backgroundStyle]}
          >
            {headerBackground()}
          </Animated.View>
        ) : null}
        <View pointerEvents="none" style={{ height: headerStatusBarHeight }} />
        <View pointerEvents="box-none" style={styles.container}>
          {onGoBack ? (
            <Animated.View
              style={[styles.left, leftButtonStyle, leftContainerStyle]}
            >
              {left({
                backImage,
                pressColorAndroid,
                allowFontScaling: backAllowFontScaling,
                onPress: onGoBack,
                label: leftLabel !== undefined ? leftLabel : previousTitle,
                truncatedLabel,
                labelStyle: [leftLabelStyle, customLeftLabelStyle],
                onLabelLayout: this.handleLeftLabelLayout,
                screenLayout: layout,
                titleLayout,
              })}
            </Animated.View>
          ) : null}
          {currentTitle ? (
            <Animated.View
              style={[
                Platform.select({
                  ios: null,
                  default: { left: onGoBack ? 72 : 16 },
                }),
                styles.title,
                titleStyle,
                titleContainerStyle,
              ]}
            >
              <HeaderTitle
                onLayout={this.handleTitleLayout}
                allowFontScaling={titleAllowFontScaling}
                style={customTitleStyle}
              >
                {currentTitle}
              </HeaderTitle>
            </Animated.View>
          ) : null}
          {right ? (
            <Animated.View
              style={[styles.right, rightButtonStyle, rightContainerStyle]}
            >
              {right()}
            </Animated.View>
          ) : null}
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  title: Platform.select({
    ios: {},
    default: { position: 'absolute' },
  }),
});
