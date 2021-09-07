import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { NavigationProp } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
const useNativeDriver = Platform.OS !== 'web';

const useAnimatedTabbarVisible = (
  navigation: NavigationProp<ReactNavigation.RootParamList>,
  isParentNavigatorFunction: boolean = false,
  isVisible: boolean = true
) => {
  const tabbarheight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [isTabBarHidden, setIsTabBarHidden] = useState<boolean>(isVisible);
  const getPaddingBottom = (insets: EdgeInsets) =>
    Math.max(insets.bottom - Platform.select({ ios: 4, default: 0 }), 0);
  const paddingBottom = getPaddingBottom(insets);
  const [visible] = useState(() => new Animated.Value(isVisible ? 1 : 0));
  const tabBarStyle = useMemo(
    () => ({
      position: isTabBarHidden ? 'absolute' : (null as any),
      height: tabbarheight,
      paddingBottom,
      paddingHorizontal: Math.max(insets.left, insets.right),
      transform: [
        {
          translateY: visible.interpolate({
            inputRange: [0, 1],
            outputRange: [
              tabbarheight + paddingBottom + StyleSheet.hairlineWidth,
              0,
            ],
          }),
        },
      ],
    }),
    [isTabBarHidden]
  );
  const setTabbarVisible = useCallback((tabBarVisible) => {
    if (tabBarVisible) {
      const animation = Animated.timing;

      animation(visible, {
        toValue: 1,
        useNativeDriver,
        duration: 250,
      }).start(({ finished }) => {
        if (finished) {
          setIsTabBarHidden(false);
        }
      });
    } else {
      setIsTabBarHidden(true);

      const animation = Animated.timing;

      animation(visible, {
        toValue: 0,
        useNativeDriver,
        duration: 200,
      }).start();
    }
  }, []);

  useEffect(() => {
    isParentNavigatorFunction && setIsTabBarHidden(false);
  }, [isParentNavigatorFunction]);

  useEffect(() => {
    navigation?.setOptions({
      tabBarStyle,
    });
  }, [navigation, isTabBarHidden]);

  return setTabbarVisible;
};

export default useAnimatedTabbarVisible;
