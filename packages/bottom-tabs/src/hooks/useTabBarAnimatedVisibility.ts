import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';

import type { BottomTabNavigationOptions } from '..';
import useIsKeyboardShown from '../utils/useIsKeyboardShown';

const useNativeDriver = Platform.OS !== 'web';

type UseTabBarAnimatedVisibilityOptions = Pick<
  BottomTabNavigationOptions,
  'tabBarHideOnKeyboard' | 'tabBarVisibilityAnimationConfig'
> & {
  paddingBottom: number;
  layout: {
    width: number;
    height: number;
  };
};

export default function useTabBarAnimatedVisibility({
  tabBarHideOnKeyboard,
  tabBarVisibilityAnimationConfig,
  paddingBottom,
  layout,
}: UseTabBarAnimatedVisibilityOptions) {
  const isKeyboardShown = useIsKeyboardShown();
  const shouldShowTabBar = !(tabBarHideOnKeyboard && isKeyboardShown);
  const [isTabBarHidden, setIsTabBarHidden] = useState(!shouldShowTabBar);
  const [visible] = useState(
    () => new Animated.Value(shouldShowTabBar ? 1 : 0)
  );

  const visibilityAnimationConfigRef = useRef(tabBarVisibilityAnimationConfig);
  useEffect(() => {
    visibilityAnimationConfigRef.current = tabBarVisibilityAnimationConfig;
  });

  useEffect(() => {
    const visibilityAnimationConfig = visibilityAnimationConfigRef.current;

    if (shouldShowTabBar) {
      const animation =
        visibilityAnimationConfig?.show?.animation === 'spring'
          ? Animated.spring
          : Animated.timing;

      animation(visible, {
        toValue: 1,
        useNativeDriver,
        duration: 250,
        ...visibilityAnimationConfig?.show?.config,
      }).start(({ finished }) => {
        if (finished) {
          setIsTabBarHidden(false);
        }
      });
    } else {
      setIsTabBarHidden(true);

      const animation =
        visibilityAnimationConfig?.hide?.animation === 'spring'
          ? Animated.spring
          : Animated.timing;

      animation(visible, {
        toValue: 0,
        useNativeDriver,
        duration: 200,
        ...visibilityAnimationConfig?.hide?.config,
      }).start();
    }

    return () => visible.stopAnimation();
  }, [visible, shouldShowTabBar]);

  return {
    isTabBarHidden,
    animatedStyles: {
      transform: [
        {
          translateY: visible.interpolate({
            inputRange: [0, 1],
            outputRange: [
              layout.height + paddingBottom + StyleSheet.hairlineWidth,
              0,
            ],
          }),
        },
      ],
      // Absolutely position the tab bar so that the content is below it
      // This is needed to avoid gap at bottom when the tab bar is hidden
      position: isTabBarHidden ? 'absolute' : (null as any),
    },
  };
}
