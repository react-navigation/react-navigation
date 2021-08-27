import * as React from 'react';
import { Animated, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import type { HeaderOptions, Layout } from '../types';
import getDefaultHeaderHeight from './getDefaultHeaderHeight';
import HeaderBackground from './HeaderBackground';
import HeaderShownContext from './HeaderShownContext';
import HeaderTitle from './HeaderTitle';

type Props = HeaderOptions & {
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

export default function Header(props: Props) {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  const isParentHeaderShown = React.useContext(HeaderShownContext);

  const {
    layout = frame,
    modal = false,
    title,
    headerTitle: customTitle,
    headerTitleAlign = Platform.select({
      ios: 'center',
      default: 'left',
    }),
    headerLeft,
    headerLeftLabelVisible,
    headerTransparent,
    headerTintColor,
    headerBackground,
    headerRight,
    headerTitleAllowFontScaling: titleAllowFontScaling,
    headerTitleStyle: titleStyle,
    headerLeftContainerStyle: leftContainerStyle,
    headerRightContainerStyle: rightContainerStyle,
    headerTitleContainerStyle: titleContainerStyle,
    headerBackgroundContainerStyle: backgroundContainerStyle,
    headerStyle: customHeaderStyle,
    headerPressColor,
    headerPressOpacity,
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
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete safeStyles[styleProp];
    }
  }

  const leftButton = headerLeft
    ? headerLeft({
        tintColor: headerTintColor,
        pressColor: headerPressColor,
        pressOpacity: headerPressOpacity,
        labelVisible: headerLeftLabelVisible,
      })
    : null;

  const rightButton = headerRight
    ? headerRight({
        tintColor: headerTintColor,
        pressColor: headerPressColor,
        pressOpacity: headerPressOpacity,
      })
    : null;

  const headerTitle =
    typeof customTitle !== 'function'
      ? (props: React.ComponentProps<typeof HeaderTitle>) => (
          <HeaderTitle {...props} />
        )
      : customTitle;

  return (
    <React.Fragment>
      <Animated.View
        pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFill,
          { zIndex: 0 },
          backgroundContainerStyle,
        ]}
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
        <View pointerEvents="none" style={{ height: headerStatusBarHeight }} />
        <View pointerEvents="box-none" style={styles.content}>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.left,
              headerTitleAlign === 'center' && styles.expand,
              { marginStart: insets.left },
              leftContainerStyle,
            ]}
          >
            {leftButton}
          </Animated.View>
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
                        ? headerLeftLabelVisible !== false
                          ? 80
                          : 32
                        : 16) +
                        Math.max(insets.left, insets.right)) *
                        2
                    : layout.width -
                      ((leftButton ? 72 : 16) +
                        (rightButton ? 72 : 16) +
                        insets.left -
                        insets.right),
              },
              titleContainerStyle,
            ]}
          >
            {headerTitle({
              children: title,
              allowFontScaling: titleAllowFontScaling,
              tintColor: headerTintColor,
              style: titleStyle,
            })}
          </Animated.View>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.right,
              styles.expand,
              { marginEnd: insets.right },
              rightContainerStyle,
            ]}
          >
            {rightButton}
          </Animated.View>
        </View>
      </Animated.View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  title: {
    marginHorizontal: 16,
    justifyContent: 'center',
  },
  left: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  right: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  expand: {
    flexGrow: 1,
    flexBasis: 0,
  },
});
