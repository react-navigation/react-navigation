import * as React from 'react';
import {
  Animated,
  type ColorValue,
  type DimensionValue,
  FlatList,
  I18nManager,
  type ListRenderItemInfo,
  Platform,
  type PressableAndroidRippleConfig,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import {
  PRIMARY_INDICATOR_MIN_WIDTH,
  TAB_BAR_BACKGROUND_COLOR,
  TAB_BAR_BORDER_COLOR,
  TAB_MIN_WIDTH,
} from './constants';
import {
  type Props as IndicatorProps,
  TabBarIndicator,
} from './TabBarIndicator';
import { type Props as TabBarItemProps, TabBarItem } from './TabBarItem';
import type {
  Event,
  EventEmitterProps,
  LocaleDirection,
  NavigationState,
  Route,
  Scene,
  SceneRendererProps,
  TabDescriptor,
} from './types';
import { useAnimatedValue } from './useAnimatedValue';
import { useLayoutWidths } from './useLayoutWidths';
import { useMeasureLayout } from './useMeasureLayout';

export type Props<T extends Route> = SceneRendererProps &
  EventEmitterProps & {
    variant?: 'primary' | 'secondary' | undefined;
    navigationState: NavigationState<T>;
    scrollEnabled?: boolean | undefined;
    bounces?: boolean | undefined;
    activeColor?: ColorValue | undefined;
    inactiveColor?: ColorValue | undefined;
    pressColor?: ColorValue | undefined;
    pressOpacity?: number | undefined;
    options?: Record<string, TabDescriptor<T>> | undefined;
    renderIndicator?:
      | ((props: IndicatorProps<T>) => React.ReactNode)
      | undefined;
    renderTabBarItem?:
      | ((props: TabBarItemProps<T> & { key: string }) => React.ReactElement)
      | undefined;
    onTabPress?: ((scene: Scene<T> & Event) => void) | undefined;
    onTabLongPress?: ((scene: Scene<T>) => void) | undefined;
    tabStyle?: StyleProp<ViewStyle> | undefined;
    indicatorStyle?: StyleProp<ViewStyle> | undefined;
    indicatorContainerStyle?: StyleProp<ViewStyle> | undefined;
    contentContainerStyle?: StyleProp<ViewStyle> | undefined;
    style?: StyleProp<ViewStyle> | undefined;
    direction?: LocaleDirection | undefined;
    gap?: number | undefined;
    testID?: string | undefined;
    android_ripple?: PressableAndroidRippleConfig | undefined;
  };

type CalculationOptions = {
  layoutWidth: number;
  gap: number | undefined;
  scrollEnabled: boolean | undefined;
  tabWidths: Record<string, number>;
  flattenedPaddingStart: DimensionValue | undefined;
  flattenedPaddingEnd: DimensionValue | undefined;
  flattenedTabWidth: DimensionValue | undefined;
};

const Separator = ({ width }: { width: number }) => {
  return <View style={{ width }} />;
};

const getFlattenedTabWidth = (style: StyleProp<ViewStyle>) => {
  const tabStyle = StyleSheet.flatten(style);

  return tabStyle?.width;
};

const getFlattenedPaddingStart = (style: StyleProp<ViewStyle>) => {
  const flattenStyle = StyleSheet.flatten(style);

  return flattenStyle
    ? flattenStyle.paddingLeft ||
        flattenStyle.paddingStart ||
        flattenStyle.paddingHorizontal ||
        0
    : 0;
};

const getFlattenedPaddingEnd = (style: StyleProp<ViewStyle>) => {
  const flattenStyle = StyleSheet.flatten(style);

  return flattenStyle
    ? flattenStyle.paddingRight ||
        flattenStyle.paddingEnd ||
        flattenStyle.paddingHorizontal ||
        0
    : 0;
};

const convertPaddingPercentToSize = (
  value: DimensionValue | undefined,
  layoutWidth: number
): number => {
  switch (typeof value) {
    case 'number':
      return value;
    case 'string':
      if (value.endsWith('%')) {
        const width = parseFloat(value);
        if (Number.isFinite(width)) {
          return layoutWidth * (width / 100);
        }
      }
  }
  return 0;
};

const getComputedTabWidth = ({
  index,
  layoutWidth,
  routes,
  scrollEnabled,
  tabWidths,
  flattenedTabWidth,
  flattenedPaddingStart,
  flattenedPaddingEnd,
  gap,
}: CalculationOptions & {
  index: number;
  routes: Route[];
}) => {
  const route = routes[index];

  if (route == null) {
    throw new Error(`Couldn't find a route at index ${index}.`);
  }

  if (flattenedTabWidth === 'auto') {
    return tabWidths[route.key] || 0;
  }

  switch (typeof flattenedTabWidth) {
    case 'number':
      return flattenedTabWidth;
    case 'string':
      if (flattenedTabWidth.endsWith('%')) {
        const width = parseFloat(flattenedTabWidth);
        if (Number.isFinite(width)) {
          return layoutWidth * (width / 100);
        }
      }
  }

  if (scrollEnabled) {
    return tabWidths[route.key] || TAB_MIN_WIDTH;
  }

  const gapTotalWidth = (gap ?? 0) * (routes.length - 1);
  const paddingTotalWidth =
    convertPaddingPercentToSize(flattenedPaddingStart, layoutWidth) +
    convertPaddingPercentToSize(flattenedPaddingEnd, layoutWidth);

  return (layoutWidth - gapTotalWidth - paddingTotalWidth) / routes.length;
};

const calculateSize = (
  value: ViewStyle['width'] | undefined,
  referenceWidth: number
): number | undefined => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.endsWith('%')) {
    const parsed = parseFloat(value);

    if (Number.isFinite(parsed)) {
      return referenceWidth * (parsed / 100);
    }
  }

  return undefined;
};

const getMaxScrollDistance = (tabBarWidth: number, layoutWidth: number) =>
  tabBarWidth - layoutWidth;

const getTranslateX = (
  scrollAmount: Animated.Value,
  maxScrollDistance: number,
  direction: LocaleDirection
) => {
  const amount =
    // Android reports scroll from the opposite side in RTL
    Platform.OS === 'android' && direction === 'rtl'
      ? Animated.add(maxScrollDistance, Animated.multiply(scrollAmount, -1))
      : scrollAmount;

  return Animated.multiply(amount, direction === 'rtl' ? 1 : -1);
};

const getTabBarWidth = <T extends Route>({
  routes,
  layoutWidth,
  gap,
  scrollEnabled,
  flattenedTabWidth,
  flattenedPaddingStart,
  flattenedPaddingEnd,
  tabWidths,
}: CalculationOptions & {
  routes: T[];
}) => {
  const paddingsWidth = Math.max(
    0,
    convertPaddingPercentToSize(flattenedPaddingStart, layoutWidth) +
      convertPaddingPercentToSize(flattenedPaddingEnd, layoutWidth)
  );

  return routes.reduce<number>(
    (acc, _, i) =>
      acc +
      (i > 0 ? (gap ?? 0) : 0) +
      getComputedTabWidth({
        index: i,
        layoutWidth,
        routes,
        scrollEnabled,
        tabWidths,
        flattenedTabWidth,
        flattenedPaddingStart,
        flattenedPaddingEnd,
        gap,
      }),
    paddingsWidth
  );
};

const normalizeScrollValue = <T extends Route>({
  layoutWidth,
  routes,
  gap,
  scrollEnabled,
  tabWidths,
  value,
  flattenedTabWidth,
  flattenedPaddingStart,
  flattenedPaddingEnd,
}: CalculationOptions & {
  routes: T[];
  value: number;
}) => {
  const tabBarWidth = getTabBarWidth({
    layoutWidth,
    routes,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingStart,
    flattenedPaddingEnd,
  });
  const maxDistance = getMaxScrollDistance(tabBarWidth, layoutWidth);
  const scrollValue = Math.max(Math.min(value, maxDistance), 0);

  return scrollValue;
};

const getScrollAmount = <T extends Route>({
  index,
  routes,
  layoutWidth,
  gap,
  scrollEnabled,
  flattenedTabWidth,
  tabWidths,
  flattenedPaddingStart,
  flattenedPaddingEnd,
  direction,
}: CalculationOptions & {
  index: number;
  routes: T[];
  direction: LocaleDirection;
}) => {
  const paddingInitial =
    direction === 'rtl'
      ? convertPaddingPercentToSize(flattenedPaddingEnd, layoutWidth)
      : convertPaddingPercentToSize(flattenedPaddingStart, layoutWidth);

  const centerDistance = Array.from({
    length: index + 1,
  }).reduce<number>((total, _, i) => {
    const tabWidth = getComputedTabWidth({
      index: i,
      layoutWidth,
      routes,
      scrollEnabled,
      tabWidths,
      flattenedTabWidth,
      flattenedPaddingStart,
      flattenedPaddingEnd,
      gap,
    });

    // To get the current index centered we adjust scroll amount by width of indexes
    // 0 through (i - 1) and add half the width of current index i
    return (
      total + (i > 0 ? (gap ?? 0) : 0) + (index === i ? tabWidth / 2 : tabWidth)
    );
  }, paddingInitial);

  const scrollAmount = centerDistance - layoutWidth / 2;

  return normalizeScrollValue({
    layoutWidth,
    routes,
    tabWidths,
    value: scrollAmount,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingStart,
    flattenedPaddingEnd,
  });
};
const getLabelTextDefault = ({ route }: Scene<Route>) => route.title;

const getAccessibleDefault = ({ route }: Scene<Route>) =>
  typeof route.accessible !== 'undefined' ? route.accessible : true;

const getAccessibilityLabelDefault = ({ route }: Scene<Route>) =>
  typeof route.accessibilityLabel === 'string'
    ? route.accessibilityLabel
    : typeof route.title === 'string'
      ? route.title
      : undefined;

const renderIndicatorDefault = (props: IndicatorProps<Route>) => (
  <TabBarIndicator {...props} />
);

const getTestIdDefault = ({ route }: Scene<Route>) => route.testID;

// How many items measurements should we update per batch.
// Defaults to 10, since that's whats FlatList is using in initialNumToRender.
const RENDER_PER_BATCH = 10;

export function TabBar<T extends Route>({
  variant = 'primary',
  renderIndicator = renderIndicatorDefault,
  gap = 0,
  scrollEnabled,
  jumpTo,
  navigationState,
  position,
  activeColor,
  bounces,
  contentContainerStyle,
  inactiveColor,
  indicatorContainerStyle,
  indicatorStyle,
  onTabLongPress,
  onTabPress,
  pressColor,
  pressOpacity,
  direction = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr',
  renderTabBarItem,
  style,
  tabStyle,
  testID,
  android_ripple,
  options,
}: Props<T>) {
  const containerRef = React.useRef<View>(null);
  const [layout, onLayout] = useMeasureLayout(containerRef);

  // Prioritize measuring tabs upto focused item
  // Since we need those measurements for calculation
  const priorityKeysForLayout = navigationState.routes
    .slice(0, navigationState.index + 1)
    .map((r) => r.key);

  const [tabWidths, onMeasureTabWidth] = useLayoutWidths(priorityKeysForLayout);
  const [labelWidths, onMeasureLabelWidth] = useLayoutWidths(
    priorityKeysForLayout
  );

  const flatListRef = React.useRef<FlatList | null>(null);
  const isFirst = React.useRef(true);

  const { routes } = navigationState;

  const flattenedTabWidth = getFlattenedTabWidth(tabStyle);
  const isWidthAuto = flattenedTabWidth === 'auto';
  const isWidthDynamic =
    isWidthAuto || (scrollEnabled && flattenedTabWidth == null);

  const flattenedPaddingEnd = getFlattenedPaddingEnd(contentContainerStyle);
  const flattenedPaddingStart = getFlattenedPaddingStart(contentContainerStyle);

  const paddingEnd = convertPaddingPercentToSize(
    flattenedPaddingEnd,
    layout.width
  );

  const paddingStart = convertPaddingPercentToSize(
    flattenedPaddingStart,
    layout.width
  );

  const scrollOffset = getScrollAmount({
    layoutWidth: layout.width,
    routes,
    index: navigationState.index,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingStart,
    flattenedPaddingEnd,
    direction,
  });

  const hasMeasuredTabWidths =
    Boolean(layout?.width) &&
    routes
      .slice(0, navigationState.index)
      .every((r) => typeof tabWidths[r.key] === 'number');

  React.useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (isWidthAuto && !hasMeasuredTabWidths) {
      return;
    }

    if (scrollEnabled) {
      flatListRef.current?.scrollToOffset({
        offset: scrollOffset,
        animated: true,
      });
    }
  }, [hasMeasuredTabWidths, isWidthAuto, scrollEnabled, scrollOffset]);

  const tabBarWidth = getTabBarWidth({
    layoutWidth: layout.width,
    routes,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingStart,
    flattenedPaddingEnd,
  });

  const maxScrollDistance = getMaxScrollDistance(tabBarWidth, layout.width);
  const scrollAmount = useAnimatedValue(0);

  React.useLayoutEffect(() => {
    scrollAmount.setValue(
      Platform.OS === 'android' && direction === 'rtl' ? maxScrollDistance : 0
    );
  }, [direction, maxScrollDistance, scrollAmount]);

  const translateX = React.useMemo(
    () => getTranslateX(scrollAmount, maxScrollDistance, direction),
    [direction, maxScrollDistance, scrollAmount]
  );

  const flattenedTabStyle = StyleSheet.flatten(tabStyle);
  const isTabWidthSet = flattenedTabStyle?.width !== undefined;

  // Calculate the default width for tab for FlatList to work.
  const defaultTabWidth = !isWidthDynamic
    ? getComputedTabWidth({
        // When `isWidthDynamic` is false, every tab gets the same width and
        // `getComputedTabWidth` ignores `index`, so we compute it once with index 0.
        index: 0,
        layoutWidth: layout.width,
        routes,
        scrollEnabled,
        tabWidths,
        flattenedTabWidth,
        flattenedPaddingStart,
        flattenedPaddingEnd,
        gap,
      })
    : undefined;

  const renderItem = React.useCallback(
    ({ item: route, index }: ListRenderItemInfo<T>) => (
      <MemoizedTabBarItemWrapper
        route={route}
        index={index}
        option={options?.[route.key]}
        position={position}
        navigationState={navigationState}
        variant={variant}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        pressColor={pressColor}
        pressOpacity={pressOpacity}
        android_ripple={android_ripple}
        tabStyle={tabStyle}
        defaultTabWidth={defaultTabWidth}
        isWidthSet={isTabWidthSet}
        gap={gap}
        onMeasureTabWidth={onMeasureTabWidth}
        onMeasureLabelWidth={onMeasureLabelWidth}
        onTabPress={onTabPress}
        onTabLongPress={onTabLongPress}
        jumpTo={jumpTo}
        renderTabBarItem={renderTabBarItem}
      />
    ),
    [
      options,
      position,
      navigationState,
      variant,
      activeColor,
      inactiveColor,
      pressColor,
      pressOpacity,
      android_ripple,
      tabStyle,
      defaultTabWidth,
      isTabWidthSet,
      gap,
      onMeasureTabWidth,
      onMeasureLabelWidth,
      onTabPress,
      onTabLongPress,
      jumpTo,
      renderTabBarItem,
    ]
  );

  const keyExtractor = React.useCallback((item: T) => item.key, []);

  const contentContainerStyleMemoized = React.useMemo(
    () => [
      styles.tabContent,
      scrollEnabled ? { width: tabBarWidth } : null,
      contentContainerStyle,
    ],
    [contentContainerStyle, scrollEnabled, tabBarWidth]
  );

  const handleScroll = React.useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { x: scrollAmount },
            },
          },
        ],
        { useNativeDriver: Platform.OS !== 'web' }
      ),
    [scrollAmount]
  );

  const flattenedIndicatorStyle = StyleSheet.flatten(indicatorStyle);
  const defaultIndicatorStyle =
    variant === 'primary' ? styles.primaryIndicator : styles.secondaryIndicator;

  const tabWidthByIndex = routes.map((_, i) =>
    getComputedTabWidth({
      index: i,
      layoutWidth: layout.width,
      routes,
      scrollEnabled,
      tabWidths,
      flattenedTabWidth,
      flattenedPaddingEnd,
      flattenedPaddingStart,
      gap,
    })
  );

  const indicatorBaseWidths = tabWidthByIndex.map((tabWidth, i) => {
    const customIndicatorWidth = calculateSize(
      flattenedIndicatorStyle?.width,
      tabWidth
    );

    if (customIndicatorWidth != null) {
      return customIndicatorWidth;
    }

    if (variant === 'primary') {
      const route = routes[i];

      if (route == null) {
        throw new Error(`Couldn't find a route at index ${i}.`);
      }

      const labelWidth = labelWidths[route.key];

      return labelWidth ? Math.max(PRIMARY_INDICATOR_MIN_WIDTH, labelWidth) : 0;
    }

    return tabWidth;
  });

  const indicatorMargins = indicatorBaseWidths.map((width) => {
    if (!width) {
      return { left: 0, right: 0 };
    }

    const marginHorizontal =
      flattenedIndicatorStyle?.marginHorizontal ??
      flattenedIndicatorStyle?.margin;

    const leftMargin =
      (direction === 'ltr'
        ? flattenedIndicatorStyle?.marginStart
        : flattenedIndicatorStyle?.marginEnd) ??
      flattenedIndicatorStyle?.marginLeft ??
      marginHorizontal;

    const rightMargin =
      (direction === 'rtl'
        ? flattenedIndicatorStyle?.marginStart
        : flattenedIndicatorStyle?.marginEnd) ??
      flattenedIndicatorStyle?.marginRight ??
      marginHorizontal;

    return {
      left: calculateSize(leftMargin, width) ?? 0,
      right: calculateSize(rightMargin, width) ?? 0,
    };
  });

  const indicatorWidths = indicatorBaseWidths.map((width, i) => {
    if (!width) {
      return 0;
    }

    const margin = indicatorMargins[i];

    if (margin == null) {
      throw new Error(`Couldn't find an indicator margin at index ${i}.`);
    }

    return Math.max(0, width - margin.left - margin.right);
  });

  const indicatorOffsets = tabWidthByIndex.map((tabWidth, i) => {
    const precedingTabsWidth = tabWidthByIndex
      .slice(0, i)
      .reduce((sum, width) => sum + width, 0);

    const tabStart = precedingTabsWidth + gap * i;
    const customIndicatorWidth = calculateSize(
      flattenedIndicatorStyle?.width,
      tabWidth
    );

    const margin = indicatorMargins[i];

    if (margin == null) {
      throw new Error(`Couldn't find an indicator margin at index ${i}.`);
    }

    const indicatorBaseWidth = indicatorBaseWidths[i];

    if (indicatorBaseWidth == null) {
      throw new Error(`Couldn't find an indicator width at index ${i}.`);
    }

    const shouldCenterIndicator =
      variant === 'primary' ||
      (customIndicatorWidth != null &&
        (flattenedIndicatorStyle?.margin === 'auto' ||
          flattenedIndicatorStyle?.marginHorizontal === 'auto'));

    const baseOffset = shouldCenterIndicator
      ? (tabWidth - indicatorBaseWidth) / 2
      : 0;

    return tabStart + baseOffset + margin.left;
  });

  return (
    <Animated.View
      ref={containerRef}
      onLayout={onLayout}
      style={[styles.tabBar, { direction }, style]}
    >
      <Animated.View
        style={[
          styles.indicatorContainer,
          scrollEnabled ? { transform: [{ translateX }] } : null,
          scrollEnabled ? { width: tabBarWidth } : null,
          indicatorContainerStyle,
        ]}
      >
        {renderIndicator({
          variant,
          position,
          navigationState,
          jumpTo,
          direction,
          widths: indicatorWidths,
          offsets: indicatorOffsets,
          style: [
            defaultIndicatorStyle,
            indicatorStyle,
            { start: paddingStart, end: paddingEnd },
          ],
        })}
      </Animated.View>
      <View style={styles.scroll}>
        <Animated.FlatList
          data={routes as Animated.WithAnimatedValue<T>[]}
          keyExtractor={keyExtractor}
          horizontal
          role="tablist"
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollEnabled}
          bounces={bounces}
          initialNumToRender={RENDER_PER_BATCH}
          alwaysBounceHorizontal={false}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          overScrollMode="never"
          contentContainerStyle={contentContainerStyleMemoized}
          scrollEventThrottle={16}
          renderItem={renderItem}
          onScroll={handleScroll}
          ref={flatListRef}
          testID={testID}
        />
      </View>
    </Animated.View>
  );
}

type TabBarItemWrapperProps<T extends Route> = {
  route: T;
  index: number;
  option: TabDescriptor<T> | undefined;
  position: Animated.AnimatedInterpolation<number>;
  navigationState: NavigationState<T>;
  variant: 'primary' | 'secondary';
  activeColor: ColorValue | undefined;
  inactiveColor: ColorValue | undefined;
  pressColor: ColorValue | undefined;
  pressOpacity: number | undefined;
  android_ripple: PressableAndroidRippleConfig | undefined;
  tabStyle: StyleProp<ViewStyle>;
  defaultTabWidth: number | undefined;
  isWidthSet: boolean;
  gap: number;
  onMeasureTabWidth: (key: string, width: number) => void;
  onMeasureLabelWidth: (key: string, width: number) => void;
  onTabPress: ((scene: Scene<T> & Event) => void) | undefined;
  onTabLongPress: ((scene: Scene<T>) => void) | undefined;
  jumpTo: (key: string) => void;
  renderTabBarItem:
    | ((props: TabBarItemProps<T> & { key: string }) => React.ReactElement)
    | undefined;
};

function TabBarItemWrapper<T extends Route>({
  route,
  index,
  option,
  position,
  navigationState,
  variant,
  activeColor,
  inactiveColor,
  pressColor,
  pressOpacity,
  android_ripple,
  tabStyle,
  defaultTabWidth,
  isWidthSet,
  gap,
  onMeasureTabWidth,
  onMeasureLabelWidth,
  onTabPress,
  onTabLongPress,
  jumpTo,
  renderTabBarItem,
}: TabBarItemWrapperProps<T>) {
  const {
    testID = getTestIdDefault({ route }),
    labelText = getLabelTextDefault({ route }),
    accessible = getAccessibleDefault({ route }),
    accessibilityLabel = getAccessibilityLabelDefault({ route }),
    ...rest
  } = option ?? {};

  const onMeasureLayout = React.useCallback(
    ({ width }: { width: number }) => onMeasureTabWidth(route.key, width),
    [route.key, onMeasureTabWidth]
  );

  const onMeasureLabelLayout = React.useCallback(
    ({ width }: { width: number }) => onMeasureLabelWidth(route.key, width),
    [route.key, onMeasureLabelWidth]
  );

  const onPress = React.useCallback(() => {
    const event: Scene<T> & Event = {
      route,
      defaultPrevented: false,
      preventDefault: () => {
        event.defaultPrevented = true;
      },
    };

    onTabPress?.(event);

    if (event.defaultPrevented) {
      return;
    }

    jumpTo(route.key);
  }, [route, onTabPress, jumpTo]);

  const onLongPress = React.useCallback(
    () => onTabLongPress?.({ route }),
    [route, onTabLongPress]
  );

  const style = React.useMemo(
    () => [
      tabStyle,
      isWidthSet
        ? null
        : defaultTabWidth !== undefined
          ? { width: defaultTabWidth }
          : { minWidth: TAB_MIN_WIDTH },
    ],
    [tabStyle, isWidthSet, defaultTabWidth]
  );

  const props = {
    ...rest,
    position,
    route,
    navigationState,
    testID,
    labelText,
    accessible,
    accessibilityLabel,
    variant,
    activeColor,
    inactiveColor,
    pressColor,
    pressOpacity,
    onMeasureLayout,
    onMeasureLabelLayout,
    onPress,
    onLongPress,
    style,
    android_ripple,
  } satisfies TabBarItemProps<T>;

  return (
    <>
      {gap > 0 && index > 0 ? <Separator width={gap} /> : null}
      {renderTabBarItem ? (
        renderTabBarItem({ key: route.key, ...props })
      ) : (
        <TabBarItem key={route.key} {...props} />
      )}
    </>
  );
}

const MemoizedTabBarItemWrapper = React.memo(
  TabBarItemWrapper
) as typeof TabBarItemWrapper;

const styles = StyleSheet.create({
  scroll: {
    overflow: Platform.select({ default: 'scroll', web: undefined }),
  },
  tabBar: {
    zIndex: 1,
    backgroundColor: TAB_BAR_BACKGROUND_COLOR,
    borderBottomColor: TAB_BAR_BORDER_COLOR,
    borderBottomWidth: 1,
  },
  tabContent: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  primaryIndicator: {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  secondaryIndicator: {
    height: 2,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
