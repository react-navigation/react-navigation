import { useNavigation, useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import searchIcon from '../assets/search-icon.png';
import type { HeaderOptions, Layout } from '../types';
import { getDefaultHeaderHeight } from './getDefaultHeaderHeight';
import { HeaderBackButton } from './HeaderBackButton';
import { HeaderBackground } from './HeaderBackground';
import { HeaderButton } from './HeaderButton';
import { HeaderIcon } from './HeaderIcon';
import { HeaderSearchBar } from './HeaderSearchBar';
import { HeaderShownContext } from './HeaderShownContext';
import { HeaderTitle } from './HeaderTitle';

// Width of the screen in split layout on portrait mode on iPad Mini
const IPAD_MINI_MEDIUM_WIDTH = 414;

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
   * Layout of the screen.
   */
  layout?: Layout;
  /**
   * Title text for the header.
   */
  title: string;
};

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

export function Header(props: Props) {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  const { colors } = useTheme();

  const navigation = useNavigation();
  const isParentHeaderShown = React.useContext(HeaderShownContext);

  const [searchBarVisible, setSearchBarVisible] = React.useState(false);
  const [titleLayout, setTitleLayout] = React.useState<Layout | undefined>(
    undefined
  );

  const onTitleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    setTitleLayout((titleLayout) => {
      if (
        titleLayout &&
        height === titleLayout.height &&
        width === titleLayout.width
      ) {
        return titleLayout;
      }

      return { height, width };
    });
  };

  const {
    // eslint-disable-next-line @eslint-react/no-unstable-default-props
    layout = frame,
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
    headerRight,
    headerTitleAllowFontScaling: titleAllowFontScaling,
    headerTitleStyle: titleStyle,
    headerLeftContainerStyle: leftContainerStyle,
    headerRightContainerStyle: rightContainerStyle,
    headerTitleContainerStyle: titleContainerStyle,
    headerBackButtonDisplayMode = Platform.OS === 'ios' ? 'default' : 'minimal',
    headerBackTitleStyle,
    headerBackgroundContainerStyle: backgroundContainerStyle,
    headerStyle: customHeaderStyle,
    headerShadowVisible,
    headerPressColor,
    headerPressOpacity,
    // eslint-disable-next-line @eslint-react/no-unstable-default-props
    headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top,
  } = props;

  const defaultHeight = getDefaultHeaderHeight(
    layout,
    modal,
    headerStatusBarHeight
  );

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
    // @ts-expect-error: web support for shadow
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

  const safeStyles: ViewStyle = {
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
    // @ts-expect-error: boxShadow is only for Web
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
    // @ts-expect-error: typescript wrongly complains that styleProp cannot be used to index safeStyles
    if (safeStyles[styleProp] === undefined) {
      // @ts-expect-error don't need to care about index signature for deletion
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete safeStyles[styleProp];
    }
  }

  const backgroundStyle = [
    safeStyles,
    headerShadowVisible === false && {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
  ];

  const iconTintColor =
    headerTintColor ??
    Platform.select({
      ios: colors.primary,
      default: colors.text,
    });

  const leftButton = headerLeft
    ? headerLeft({
        tintColor: iconTintColor,
        pressColor: headerPressColor,
        pressOpacity: headerPressOpacity,
        displayMode: headerBackButtonDisplayMode,
        titleLayout,
        screenLayout: layout,
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

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[{ height, minHeight, maxHeight, opacity, transform }]}
    >
      <Animated.View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, backgroundContainerStyle]}
      >
        {headerBackground ? (
          headerBackground({ style: backgroundStyle })
        ) : headerTransparent ? null : (
          <HeaderBackground style={backgroundStyle} />
        )}
      </Animated.View>
      <View pointerEvents="none" style={{ height: headerStatusBarHeight }} />
      <View
        pointerEvents="box-none"
        style={[
          styles.content,
          Platform.OS === 'ios' && frame.width >= IPAD_MINI_MEDIUM_WIDTH
            ? styles.large
            : null,
        ]}
      >
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.start,
            headerTitleAlign === 'center' && styles.expand,
            { marginStart: insets.left },
            leftContainerStyle,
          ]}
        >
          {leftButton}
        </Animated.View>
        {Platform.OS === 'ios' || !searchBarVisible ? (
          <>
            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.title,
                {
                  // Avoid the title from going offscreen or overlapping buttons
                  maxWidth:
                    headerTitleAlign === 'center'
                      ? layout.width -
                        ((leftButton
                          ? headerBackButtonDisplayMode !== 'minimal'
                            ? 80
                            : 32
                          : 16) +
                          (rightButton || headerSearchBarOptions ? 16 : 0) +
                          Math.max(insets.left, insets.right)) *
                          2
                      : layout.width -
                        ((leftButton ? 52 : 16) +
                          (rightButton || headerSearchBarOptions ? 52 : 16) +
                          insets.left -
                          insets.right),
                },
                headerTitleAlign === 'left' && leftButton
                  ? { marginStart: 4 }
                  : { marginHorizontal: 16 },
                titleContainerStyle,
              ]}
            >
              {headerTitle({
                children: title,
                allowFontScaling: titleAllowFontScaling,
                tintColor: headerTintColor,
                onLayout: onTitleLayout,
                style: titleStyle,
              })}
            </Animated.View>
            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.end,
                styles.expand,
                { marginEnd: insets.right },
                rightContainerStyle,
              ]}
            >
              {rightButton}
              {headerSearchBarOptions ? (
                <HeaderButton
                  tintColor={iconTintColor}
                  pressColor={headerPressColor}
                  pressOpacity={headerPressOpacity}
                  onPress={() => setSearchBarVisible(true)}
                >
                  <HeaderIcon
                    style={
                      Boolean(iconTintColor) && { tintColor: iconTintColor }
                    }
                    source={searchIcon}
                  />
                </HeaderButton>
              ) : null}
            </Animated.View>
          </>
        ) : null}
        {Platform.OS === 'ios' || searchBarVisible ? (
          <HeaderSearchBar
            {...headerSearchBarOptions}
            visible={searchBarVisible}
            onClose={() => {
              setSearchBarVisible(false);
              headerSearchBarOptions?.onClose?.();
            }}
            style={[
              Platform.OS === 'ios'
                ? [StyleSheet.absoluteFill, { backgroundColor: colors.card }]
                : !leftButton && { marginStart: 8 },
            ]}
          />
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  large: {
    marginHorizontal: 5,
  },
  title: {
    justifyContent: 'center',
  },
  start: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  expand: {
    flexGrow: 1,
    flexBasis: 0,
  },
});
