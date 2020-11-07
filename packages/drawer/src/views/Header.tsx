import * as React from 'react';
import { Text, View, Image, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions, useTheme } from '@react-navigation/native';
import TouchableItem from './TouchableItem';
import type { Layout, DrawerHeaderProps } from '../types';

export const getDefaultHeaderHeight = (
  layout: Layout,
  statusBarHeight: number
): number => {
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

export default function HeaderSegment({ scene, layout }: DrawerHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const {
    title,
    headerTitle,
    headerTitleAlign = Platform.select({
      ios: 'center',
      default: 'left',
    }),
    headerLeft,
    headerLeftAccessibilityLabel,
    headerRight,
    headerTitleAllowFontScaling,
    headerTitleStyle,
    headerTintColor,
    headerPressColorAndroid,
    headerStyle,
    headerStatusBarHeight = insets.top,
  } = scene.descriptor.options;

  const currentTitle =
    typeof headerTitle !== 'function' && headerTitle !== undefined
      ? headerTitle
      : title !== undefined
      ? title
      : scene.route.name;

  const defaultHeight = getDefaultHeaderHeight(layout, headerStatusBarHeight);

  const leftButton = headerLeft ? (
    headerLeft({ tintColor: headerTintColor })
  ) : (
    <TouchableItem
      accessible
      accessibilityRole="button"
      accessibilityComponentType="button"
      accessibilityLabel={headerLeftAccessibilityLabel}
      accessibilityTraits="button"
      delayPressIn={0}
      onPress={() =>
        scene.descriptor.navigation.dispatch(DrawerActions.toggleDrawer())
      }
      style={styles.touchable}
      pressColor={headerPressColorAndroid}
      hitSlop={Platform.select({
        ios: undefined,
        default: { top: 16, right: 16, bottom: 16, left: 16 },
      })}
      borderless
    >
      <Image
        style={[
          styles.icon,
          headerTintColor ? { tintColor: headerTintColor } : null,
        ]}
        source={require('./assets/toggle-drawer-icon.png')}
        fadeDuration={0}
      />
    </TouchableItem>
  );
  const rightButton = headerRight
    ? headerRight({ tintColor: headerTintColor })
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
        {leftButton ? (
          <View
            pointerEvents="box-none"
            style={[styles.left, { left: insets.left }]}
          >
            {leftButton}
          </View>
        ) : null}
        <View
          pointerEvents="box-none"
          style={[
            headerTitleAlign === 'left'
              ? {
                  position: 'absolute',
                  left: (leftButton ? 72 : 16) + insets.left,
                  right: (rightButton ? 72 : 16) + insets.right,
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
              children: currentTitle,
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
              {currentTitle}
            </Text>
          )}
        </View>
        {rightButton ? (
          <View
            pointerEvents="box-none"
            style={[styles.right, { right: insets.right }]}
          >
            {rightButton}
          </View>
        ) : null}
      </View>
    </View>
  );
}

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
  icon: {
    height: 24,
    width: 24,
    margin: 3,
    resizeMode: 'contain',
  },
  touchable: {
    marginHorizontal: 11,
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
