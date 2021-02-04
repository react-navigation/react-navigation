import * as React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import HeaderShownContext from './HeaderShownContext';
import HeaderHeightContext from './HeaderHeightContext';
import type { HeaderOptions } from './types';

type Layout = { width: number; height: number };

type Props = HeaderOptions & {
  /**
   * Layout of the screen.
   */
  layout: Layout;
};

const getDefaultHeight = (layout: Layout, statusBarHeight: number): number => {
  const isLandscape = layout.width > layout.height;

  let headerHeight;

  if (Platform.OS === 'ios') {
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

export default function Header(props: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const isParentHeaderShown = React.useContext(HeaderShownContext);

  const {
    layout,
    headerTitle,
    headerTitleAlign = Platform.select({
      ios: 'center',
      default: 'left',
    }),
    headerLeft,
    headerLeftAccessibilityLabel,
    headerRight,
    headerRightAccessibilityLabel,
    headerPressColor,
    headerPressOpacity,
    headerTitleAllowFontScaling,
    headerTitleStyle,
    headerTintColor,
    headerStyle,
    headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top,
  } = props;

  const defaultHeight = getDefaultHeight(layout, headerStatusBarHeight);

  const leftButton = headerLeft
    ? headerLeft({
        tintColor: headerTintColor,
        pressColor: headerPressColor,
        pressOpacity: headerPressOpacity,
        accessibilityLabel: headerLeftAccessibilityLabel,
      })
    : null;

  const rightButton = headerRight
    ? headerRight({
        tintColor: headerTintColor,
        pressColor: headerPressColor,
        pressOpacity: headerPressOpacity,
        accessibilityLabel: headerRightAccessibilityLabel,
      })
    : null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          height: defaultHeight,
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          shadowColor: colors.border,
        },
        styles.container,
        headerStyle,
      ]}
    >
      <View pointerEvents="none" style={{ height: headerStatusBarHeight }} />
      <View pointerEvents="box-none" style={styles.content}>
        <View
          pointerEvents="box-none"
          style={[styles.left, { marginLeft: insets.left }]}
        >
          {leftButton}
        </View>
        <View
          pointerEvents="box-none"
          style={[
            headerTitleAlign === 'left'
              ? {
                  marginLeft: (leftButton ? 72 : 16) + insets.left,
                  marginRight: (rightButton ? 72 : 16) + insets.right,
                }
              : {
                  marginHorizontal:
                    (leftButton ? 32 : 16) +
                    Math.max(insets.left, insets.right),
                },
          ]}
        >
          {typeof headerTitle === 'function' ? (
            headerTitle({
              allowFontScaling: headerTitleAllowFontScaling,
              tintColor: headerTintColor,
              style: headerTitleStyle,
            })
          ) : (
            <Text
              accessibilityRole="header"
              aria-level="1"
              numberOfLines={1}
              allowFontScaling={headerTitleAllowFontScaling}
              style={[
                styles.title,
                { color: headerTintColor ?? colors.text },
                styles.title,
                headerTitleStyle,
              ]}
            >
              {headerTitle}
            </Text>
          )}
        </View>
        <View
          pointerEvents="box-none"
          style={[styles.right, { marginRight: insets.right }]}
        >
          {rightButton}
        </View>
      </View>
    </View>
  );
}

Header.getDefaultHeight = getDefaultHeight;
Header.ShownContext = HeaderShownContext;
Header.HeightContext = HeaderHeightContext;

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowOpacity: 0.85,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth,
        },
      },
      default: {
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
    zIndex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: Platform.select({
    ios: {
      fontSize: 17,
      fontWeight: '600',
    },
    android: {
      fontSize: 20,
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    default: {
      fontSize: 18,
      fontWeight: '500',
    },
  }),
  left: {
    flexGrow: 1,
    flexBasis: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  right: {
    flexGrow: 1,
    flexBasis: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
