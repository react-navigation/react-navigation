import {
  CornerAdaptivityView,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import searchIcon from '../assets/search-icon.png';
import { Color } from '../Color';
import { isLiquidGlassSupported } from '../LiquidGlassView';
import { PlatformColor } from '../PlatformColor';
import type { HeaderOptions } from '../types';
import { useFrameSize } from '../useFrameSize';
import { getDefaultHeaderHeight } from './getDefaultHeaderHeight';
import { HeaderBackButton } from './HeaderBackButton';
import { HeaderBackground } from './HeaderBackground';
import { BUTTON_SIZE, BUTTON_SPACING, HeaderButton } from './HeaderButton';
import { HeaderButtonBackground } from './HeaderButtonBackground';
import { HeaderIcon } from './HeaderIcon';
import { HeaderSearchBar } from './HeaderSearchBar';
import { HeaderShownContext } from './HeaderShownContext';
import { HeaderTitle } from './HeaderTitle';

type Props = HeaderOptions & {
  /**
   * Options for the back button.
   */
  back?: {
    /**
     * Title of the previous screen.
     */
    title: string | undefined;
    /**
     * The `href` to use for the anchor tag on web
     */
    href: string | undefined;
  };
  /**
   * Whether the header is in a modal
   */
  modal?: boolean;
  /**
   * Title text for the header.
   */
  title: string;
};

const STATUS_BAR_OFFSET = Platform.select({
  // The top inset on iOS is a bit less than the status bar height
  ios: -7,
  default: 0,
});

const warnIfHeaderStylesDefined = (styles: Record<string, any>) => {
  Object.keys(styles).forEach((styleProp) => {
    const value = styles[styleProp];

    if (styleProp === 'position' && value === 'absolute') {
      console.warn(
        "position: 'absolute' is not supported on headerStyle. If you would like to render content under the header, use the 'headerTransparent' option."
      );
    } else if (value !== undefined) {
      console.warn(
        `${styleProp} was given a value of ${value}, this has no effect on headerStyle.`
      );
    }
  });
};

const useNativeDriver = Platform.OS !== 'web';

export function Header(props: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const navigation = useNavigation();
  const isParentHeaderShown = React.useContext(HeaderShownContext);

  const [searchBarVisible, setSearchBarVisible] = React.useState(false);

  const {
    modal = false,
    back,
    title,
    headerTitle: customTitle,
    headerTitleAlign = Platform.OS === 'ios' ? 'center' : 'left',
    headerLeft = back ? (props) => <HeaderBackButton {...props} /> : undefined,
    headerSearchBarOptions,
    headerTransparent,
    headerTintColor,
    headerBackground,
    headerBlurEffect,
    headerRight,
    headerTitleAllowFontScaling: titleAllowFontScaling,
    headerTitleStyle: titleStyle,
    headerLeftContainerStyle: leftContainerStyle,
    headerRightContainerStyle: rightContainerStyle,
    headerTitleContainerStyle: titleContainerStyle,
    headerBackButtonDisplayMode = Platform.OS !== 'ios' ||
    isLiquidGlassSupported
      ? 'minimal'
      : 'default',
    headerBackTitleStyle,
    headerBackgroundContainerStyle: backgroundContainerStyle,
    headerStyle: customHeaderStyle,
    headerShadowVisible,
    headerPressColor,
    headerPressOpacity,
    headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top,
  } = props;

  const defaultHeight = useFrameSize((frame) =>
    getDefaultHeaderHeight({
      landscape: frame.width > frame.height,
      modalPresentation: modal,
      topInset: headerStatusBarHeight,
    })
  );

  const {
    height = defaultHeight,
    maxHeight,
    minHeight,
    backfaceVisibility,
    backgroundColor,
    borderBlockColor,
    borderBlockEndColor,
    borderBlockStartColor,
    borderBottomColor,
    borderBottomEndRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderBottomStartRadius,
    borderBottomWidth,
    borderColor,
    borderCurve,
    borderEndColor,
    borderEndEndRadius,
    borderEndStartRadius,
    borderEndWidth,
    borderLeftColor,
    borderLeftWidth,
    borderRadius,
    borderRightColor,
    borderRightWidth,
    borderStartColor,
    borderStartEndRadius,
    borderStartStartRadius,
    borderStartWidth,
    borderStyle,
    borderTopColor,
    borderTopEndRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderTopStartRadius,
    borderTopWidth,
    borderWidth,
    boxShadow,
    elevation,
    filter,
    mixBlendMode,
    opacity,
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    transform,
    transformOrigin,
    ...unsafeStyles
  } = StyleSheet.flatten(customHeaderStyle || {}) as ViewStyle;

  if (process.env.NODE_ENV !== 'production') {
    warnIfHeaderStylesDefined(unsafeStyles);
  }

  const safeStyles: ViewStyle = {
    backfaceVisibility,
    backgroundColor,
    borderBlockColor,
    borderBlockEndColor,
    borderBlockStartColor,
    borderBottomColor,
    borderBottomEndRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderBottomStartRadius,
    borderBottomWidth,
    borderColor,
    borderCurve,
    borderEndColor,
    borderEndEndRadius,
    borderEndStartRadius,
    borderEndWidth,
    borderLeftColor,
    borderLeftWidth,
    borderRadius,
    borderRightColor,
    borderRightWidth,
    borderStartColor,
    borderStartEndRadius,
    borderStartStartRadius,
    borderStartWidth,
    borderStyle,
    borderTopColor,
    borderTopEndRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderTopStartRadius,
    borderTopWidth,
    borderWidth,
    boxShadow,
    elevation,
    filter,
    mixBlendMode,
    opacity,
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    transform,
    transformOrigin,
  };

  // Setting a property to undefined triggers default style
  // So we need to filter them out
  // Users can use `null` instead
  for (const styleProp in safeStyles) {
    // @ts-expect-error: typescript wrongly complains that styleProp cannot be used to index safeStyles
    if (safeStyles[styleProp] === undefined) {
      // @ts-expect-error don't need to care about index signature for deletion
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete safeStyles[styleProp];
    }
  }

  const backgroundStyle = {
    ...(headerTransparent && { backgroundColor: 'transparent' }),
    ...((headerTransparent || headerShadowVisible === false) && {
      borderBottomWidth: 0,
      ...Platform.select({
        android: {
          elevation: 0,
        },
        web: {
          boxShadow: 'none',
        },
        default: {
          shadowOpacity: 0,
        },
      }),
    }),
    ...safeStyles,
  };

  const iconTintColor =
    headerTintColor ??
    Platform.select({
      ios:
        isLiquidGlassSupported && PlatformColor
          ? PlatformColor('label')
          : colors.primary,
      default: colors.text,
    });

  const leftButton = headerLeft
    ? headerLeft({
        tintColor: iconTintColor,
        pressColor: headerPressColor,
        pressOpacity: headerPressOpacity,
        displayMode: headerBackButtonDisplayMode,
        canGoBack: Boolean(back),
        onPress: back ? navigation.goBack : undefined,
        label: back?.title,
        labelStyle: headerBackTitleStyle,
        href: back?.href,
      })
    : null;

  const rightButton = headerRight
    ? headerRight({
        tintColor: iconTintColor,
        pressColor: headerPressColor,
        pressOpacity: headerPressOpacity,
        canGoBack: Boolean(back),
      })
    : null;

  const headerTitle =
    typeof customTitle !== 'function'
      ? (props: React.ComponentProps<typeof HeaderTitle>) => (
          <HeaderTitle {...props} />
        )
      : customTitle;

  const buttonMinWidth =
    headerTitleAlign === 'center' && (leftButton || rightButton)
      ? BUTTON_SIZE
      : 0;

  const [searchBarRendered, setSearchBarRendered] =
    React.useState(searchBarVisible);
  const searchBarVisibleRef = React.useRef(searchBarVisible);
  const [searchBarVisibleAnim] = React.useState(
    () => new Animated.Value(searchBarVisible ? 1 : 0)
  );

  if (searchBarVisible && !searchBarRendered) {
    setSearchBarRendered(true);
  }

  React.useEffect(() => {
    // Avoid act warning in tests just by rendering header
    if (searchBarVisible === searchBarVisibleRef.current) {
      return;
    }

    Animated.timing(searchBarVisibleAnim, {
      toValue: searchBarVisible ? 1 : 0,
      duration: 150,
      useNativeDriver,
      easing: Easing.in(Easing.linear),
    }).start(({ finished }) => {
      if (finished) {
        setSearchBarRendered(searchBarVisible);
        searchBarVisibleRef.current = searchBarVisible;
      }
    });

    return () => {
      searchBarVisibleAnim.stopAnimation();
    };
  }, [searchBarVisible, searchBarVisibleAnim]);

  const headerOpacity = searchBarVisibleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const searchBarOpacity = searchBarVisibleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      // FIXME: Liquid glass views don't work properly with `opacity: 0`
      // So we use a small value instead to workaround this issue.
      0.1, 1,
    ],
  });

  const statusBarSpacing = Math.max(
    headerStatusBarHeight + STATUS_BAR_OFFSET,
    0
  );

  return (
    <Animated.View
      style={[
        {
          pointerEvents: 'box-none',
          height,
          minHeight,
          maxHeight,
          opacity,
          transform,
        },
      ]}
    >
      <Animated.View style={[styles.background, backgroundContainerStyle]}>
        {headerBackground ? (
          headerBackground({ style: backgroundStyle })
        ) : (
          <HeaderBackground
            blurEffect={headerBlurEffect}
            style={[
              {
                // Allow touch through the header when background color is transparent
                pointerEvents:
                  headerTransparent &&
                  backgroundStyle.backgroundColor &&
                  (backgroundStyle.backgroundColor === 'transparent' ||
                    Color(backgroundStyle.backgroundColor)?.alpha() === 0)
                    ? 'none'
                    : 'auto',
              },
              backgroundStyle,
            ]}
          />
        )}
      </Animated.View>
      <CornerAdaptivityView direction="horizontal" style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              pointerEvents: searchBarVisible ? 'none' : 'auto',
              marginTop: statusBarSpacing,
              opacity: headerOpacity,
            },
          ]}
        >
          <View
            style={[
              styles.start,
              headerTitleAlign === 'center' ? styles.expand : styles.shrink,
              {
                minWidth: buttonMinWidth,
                marginStart: insets.left,
              },
            ]}
          >
            <HeaderButtonBackground
              style={[styles.buttonContainer, leftContainerStyle]}
            >
              {leftButton}
            </HeaderButtonBackground>
          </View>
          <Animated.View
            style={[
              styles.title,
              !leftButton && styles.titleStart,
              titleContainerStyle,
            ]}
          >
            {headerTitle({
              children: title,
              allowFontScaling: titleAllowFontScaling,
              tintColor: headerTintColor,
              style: [styles.titleText, titleStyle],
            })}
          </Animated.View>
          <View
            style={[
              styles.end,
              styles.expand,
              {
                minWidth: buttonMinWidth,
                marginEnd: insets.right,
              },
            ]}
          >
            <HeaderButtonBackground
              style={[styles.buttonContainer, rightContainerStyle]}
            >
              {rightButton}
              {headerSearchBarOptions ? (
                <HeaderButton
                  tintColor={iconTintColor}
                  pressColor={headerPressColor}
                  pressOpacity={headerPressOpacity}
                  onPress={() => {
                    setSearchBarVisible(true);
                    headerSearchBarOptions?.onOpen?.();
                  }}
                >
                  <HeaderIcon source={searchIcon} tintColor={iconTintColor} />
                </HeaderButton>
              ) : null}
            </HeaderButtonBackground>
          </View>
        </Animated.View>
      </CornerAdaptivityView>
      {searchBarRendered ? (
        <HeaderSearchBar
          {...headerSearchBarOptions}
          statusBarHeight={statusBarSpacing}
          visible={searchBarVisible}
          onClose={() => {
            setSearchBarVisible(false);
            headerSearchBarOptions?.onClose?.();
          }}
          tintColor={headerTintColor}
          style={[StyleSheet.absoluteFill, { opacity: searchBarOpacity }]}
        />
      ) : null}
    </Animated.View>
  );
}

const BUTTON_OFFSET = Platform.OS === 'ios' ? 10 : 4;
const TITLE_START_OFFSET =
  Platform.OS === 'ios'
    ? 0
    : // Since button container is always present,
      // We need to account for its horizontal margin as well
      16 - BUTTON_OFFSET * 2;

const styles = StyleSheet.create({
  content: {
    pointerEvents: 'box-none',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  title: {
    flexShrink: 1,
    minWidth: 0,
    justifyContent: 'center',
    pointerEvents: 'box-none',
    // Make sure title goes below liquid glass buttons
    zIndex: -1,
  },
  titleStart: {
    marginLeft: TITLE_START_OFFSET,
  },
  titleText: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    pointerEvents: 'box-none',
    gap: BUTTON_SPACING,
    marginHorizontal: BUTTON_OFFSET,
  },
  start: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    pointerEvents: 'box-none',
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  expand: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  shrink: {
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 0,
    maxWidth: '50%',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
  container: {
    flex: 1,
  },
});
