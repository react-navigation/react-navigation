import * as React from 'react';
import {
  Animated,
  View,
  StyleSheet,
  LayoutChangeEvent,
  Platform,
  ViewStyle,
} from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';
import { NavigationRoute } from 'react-navigation';
import HeaderBackButton from './HeaderBackButton';
import HeaderBackground from './HeaderBackground';
import memoize from '../../utils/memoize';
import {
  Layout,
  StackHeaderStyleInterpolator,
  StackHeaderLeftButtonProps,
  StackHeaderTitleProps,
  StackHeaderOptions,
  Scene,
} from '../../types';

type Props = StackHeaderOptions & {
  headerTitle: (props: StackHeaderTitleProps) => React.ReactNode;
  layout: Layout;
  insets: EdgeInsets;
  onGoBack?: () => void;
  title?: string;
  leftLabel?: string;
  scene: Scene<NavigationRoute>;
  styleInterpolator: StackHeaderStyleInterpolator;
};

type State = {
  titleLayout?: Layout;
  leftLabelLayout?: Layout;
};

const warnIfHeaderStylesDefined = (styles: Record<string, any>) => {
  Object.keys(styles).forEach(styleProp => {
    const value = styles[styleProp];

    if (styleProp === 'position' && value === 'absolute') {
      console.warn(
        "position: 'absolute' is not supported on headerStyle. If you would like to render content under the header, use the 'headerTransparent' navigationOption."
      );
    } else if (value !== undefined) {
      console.warn(
        `${styleProp} was given a value of ${value}, this has no effect on headerStyle.`
      );
    }
  });
};

export const getDefaultHeaderHeight = (
  layout: Layout,
  statusBarHeight: number
): number => {
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

  return headerHeight + statusBarHeight;
};

export default class HeaderSegment extends React.Component<Props, State> {
  state: State = {};

  private handleTitleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    this.setState(({ titleLayout }) => {
      if (
        titleLayout &&
        height === titleLayout.height &&
        width === titleLayout.width
      ) {
        return null;
      }

      return {
        titleLayout: { height, width },
      };
    });
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
      styleInterpolator: StackHeaderStyleInterpolator,
      layout: Layout,
      current: Animated.AnimatedInterpolation,
      next: Animated.AnimatedInterpolation | undefined,
      titleLayout: Layout | undefined,
      leftLabelLayout: Layout | undefined,
      headerHeight: number
    ) =>
      styleInterpolator({
        current: { progress: current },
        next: next && { progress: next },
        layouts: {
          header: {
            height: headerHeight,
            width: layout.width,
          },
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
      insets,
      title: currentTitle,
      leftLabel: previousTitle,
      onGoBack,
      headerTitle,
      headerTitleAlign = Platform.select({
        ios: 'center',
        default: 'left',
      }),
      headerLeft: left = onGoBack
        ? (props: StackHeaderLeftButtonProps) => <HeaderBackButton {...props} />
        : undefined,
      headerTransparent,
      headerTintColor,
      headerBackground,
      headerRight: right,
      headerBackImage: backImage,
      headerBackTitle: leftLabel,
      headerBackTitleVisible,
      headerTruncatedBackTitle: truncatedLabel,
      headerPressColorAndroid: pressColorAndroid,
      headerBackAllowFontScaling: backAllowFontScaling,
      headerTitleAllowFontScaling: titleAllowFontScaling,
      headerTitleStyle: customTitleStyle,
      headerBackTitleStyle: customLeftLabelStyle,
      headerLeftContainerStyle: leftContainerStyle,
      headerRightContainerStyle: rightContainerStyle,
      headerTitleContainerStyle: titleContainerStyle,
      headerStyle: customHeaderStyle,
      headerStatusBarHeight = insets.top,
      styleInterpolator,
    } = this.props;

    const { leftLabelLayout, titleLayout } = this.state;

    const defaultHeight = getDefaultHeaderHeight(layout, headerStatusBarHeight);

    const {
      height = defaultHeight,
      minHeight,
      maxHeight,
      backgroundColor,
      borderBottomColor,
      borderBottomEndRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderBottomStartRadius,
      borderBottomWidth,
      borderColor,
      borderEndColor,
      borderEndWidth,
      borderLeftColor,
      borderLeftWidth,
      borderRadius,
      borderRightColor,
      borderRightWidth,
      borderStartColor,
      borderStartWidth,
      borderStyle,
      borderTopColor,
      borderTopEndRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderTopStartRadius,
      borderTopWidth,
      borderWidth,
      // @ts-ignore: web support for shadow
      boxShadow,
      elevation,
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
      opacity,
      transform,
      ...unsafeStyles
    } = StyleSheet.flatten(customHeaderStyle || {}) as ViewStyle;

    if (process.env.NODE_ENV !== 'production') {
      warnIfHeaderStylesDefined(unsafeStyles);
    }

    const safeStyles = {
      backgroundColor,
      borderBottomColor,
      borderBottomEndRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderBottomStartRadius,
      borderBottomWidth,
      borderColor,
      borderEndColor,
      borderEndWidth,
      borderLeftColor,
      borderLeftWidth,
      borderRadius,
      borderRightColor,
      borderRightWidth,
      borderStartColor,
      borderStartWidth,
      borderStyle,
      borderTopColor,
      borderTopEndRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderTopStartRadius,
      borderTopWidth,
      borderWidth,
      // @ts-ignore
      boxShadow,
      elevation,
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
      opacity,
      transform,
    };

    // Setting a property to undefined triggers default style
    // So we need to filter them out
    // Users can use `null` instead
    for (const styleProp in safeStyles) {
      // @ts-ignore
      if (safeStyles[styleProp] === undefined) {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete safeStyles[styleProp];
      }
    }

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
      previousTitle ? leftLabelLayout : undefined,
      typeof height === 'number' ? height : defaultHeight
    );

    const leftButton = left
      ? left({
          backImage,
          pressColorAndroid,
          allowFontScaling: backAllowFontScaling,
          onPress: onGoBack,
          labelVisible: headerBackTitleVisible,
          label: leftLabel !== undefined ? leftLabel : previousTitle,
          truncatedLabel,
          labelStyle: [leftLabelStyle, customLeftLabelStyle],
          onLabelLayout: this.handleLeftLabelLayout,
          screenLayout: layout,
          titleLayout,
          tintColor: headerTintColor,
          canGoBack: Boolean(onGoBack),
        })
      : null;

    return (
      <React.Fragment>
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, backgroundStyle]}
        >
          {headerBackground ? (
            headerBackground({ style: safeStyles })
          ) : headerTransparent ? null : (
            <HeaderBackground style={safeStyles} />
          )}
        </Animated.View>
        <Animated.View
          pointerEvents="box-none"
          style={[{ height, minHeight, maxHeight, opacity, transform }]}
        >
          <View
            pointerEvents="none"
            style={{ height: headerStatusBarHeight }}
          />
          <View pointerEvents="box-none" style={styles.content}>
            {leftButton ? (
              <Animated.View
                pointerEvents="box-none"
                style={[
                  styles.left,
                  { left: insets.left },
                  leftButtonStyle,
                  leftContainerStyle,
                ]}
              >
                {leftButton}
              </Animated.View>
            ) : null}
            <Animated.View
              pointerEvents="box-none"
              style={[
                headerTitleAlign === 'left'
                  ? { position: 'absolute', left: leftButton ? 72 : 16 }
                  : { marginHorizontal: 18 },
                titleStyle,
                titleContainerStyle,
              ]}
            >
              {headerTitle({
                children: currentTitle,
                onLayout: this.handleTitleLayout,
                allowFontScaling: titleAllowFontScaling,
                tintColor: headerTintColor,
                style: customTitleStyle,
              })}
            </Animated.View>
            {right ? (
              <Animated.View
                pointerEvents="box-none"
                style={[
                  styles.right,
                  { right: insets.right },
                  rightButtonStyle,
                  rightContainerStyle,
                ]}
              >
                {right({ tintColor: headerTintColor })}
              </Animated.View>
            ) : null}
          </View>
        </Animated.View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
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
});
