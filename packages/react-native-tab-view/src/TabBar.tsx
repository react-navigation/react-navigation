import * as React from 'react';
import {
  Animated,
  type DimensionValue,
  FlatList,
  I18nManager,
  type LayoutChangeEvent,
  type ListRenderItemInfo,
  Platform,
  type PressableAndroidRippleConfig,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
  type ViewToken,
} from 'react-native';
import useLatestCallback from 'use-latest-callback';

import {
  type Props as IndicatorProps,
  TabBarIndicator,
} from './TabBarIndicator';
import { type Props as TabBarItemProps, TabBarItem } from './TabBarItem';
import type {
  Event,
  Layout,
  LocaleDirection,
  NavigationState,
  Route,
  Scene,
  SceneRendererProps,
  TabDescriptor,
} from './types';
import { useAnimatedValue } from './useAnimatedValue';

export type Props<T extends Route> = SceneRendererProps & {
  navigationState: NavigationState<T>;
  scrollEnabled?: boolean;
  bounces?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  pressColor?: string;
  pressOpacity?: number;
  options?: Record<string, TabDescriptor<T>>;
  renderIndicator?: (props: IndicatorProps<T>) => React.ReactNode;
  renderTabBarItem?: (
    props: TabBarItemProps<T> & { key: string }
  ) => React.ReactElement;
  onTabPress?: (scene: Scene<T> & Event) => void;
  onTabLongPress?: (scene: Scene<T>) => void;
  tabStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  indicatorContainerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  direction?: LocaleDirection;
  gap?: number;
  testID?: string;
  android_ripple?: PressableAndroidRippleConfig;
};

const useNativeDriver = Platform.OS !== 'web';

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
  layout: Layout
): number => {
  switch (typeof value) {
    case 'number':
      return value;
    case 'string':
      if (value.endsWith('%')) {
        const width = parseFloat(value);
        if (Number.isFinite(width)) {
          return layout.width * (width / 100);
        }
      }
  }
  return 0;
};

const getComputedTabWidth = (
  index: number,
  layout: Layout,
  routes: Route[],
  scrollEnabled: boolean | undefined,
  tabWidths: { [key: string]: number },
  flattenedWidth: DimensionValue | undefined,
  flattenedPaddingStart: DimensionValue | undefined,
  flattenedPaddingEnd: DimensionValue | undefined,
  gap?: number
) => {
  if (flattenedWidth === 'auto') {
    return tabWidths[routes[index].key] || 0;
  }

  switch (typeof flattenedWidth) {
    case 'number':
      return flattenedWidth;
    case 'string':
      if (flattenedWidth.endsWith('%')) {
        const width = parseFloat(flattenedWidth);
        if (Number.isFinite(width)) {
          return layout.width * (width / 100);
        }
      }
  }

  if (scrollEnabled) {
    return (layout.width / 5) * 2;
  }

  const gapTotalWidth = (gap ?? 0) * (routes.length - 1);
  const paddingTotalWidth =
    convertPaddingPercentToSize(flattenedPaddingStart, layout) +
    convertPaddingPercentToSize(flattenedPaddingEnd, layout);

  return (layout.width - gapTotalWidth - paddingTotalWidth) / routes.length;
};

const getMaxScrollDistance = (tabBarWidth: number, layoutWidth: number) =>
  tabBarWidth - layoutWidth;

const getTranslateX = (
  scrollAmount: Animated.Value,
  maxScrollDistance: number,
  direction: LocaleDirection
) =>
  Animated.multiply(
    Platform.OS === 'android' && direction === 'rtl'
      ? Animated.add(maxScrollDistance, Animated.multiply(scrollAmount, -1))
      : scrollAmount,
    direction === 'rtl' ? 1 : -1
  );

const getTabBarWidth = <T extends Route>({
  navigationState,
  layout,
  gap,
  scrollEnabled,
  flattenedTabWidth,
  flattenedPaddingStart,
  flattenedPaddingEnd,
  tabWidths,
}: Pick<Props<T>, 'navigationState' | 'gap' | 'layout' | 'scrollEnabled'> & {
  tabWidths: Record<string, number>;
  flattenedPaddingStart: DimensionValue | undefined;
  flattenedPaddingEnd: DimensionValue | undefined;
  flattenedTabWidth: DimensionValue | undefined;
}) => {
  const { routes } = navigationState;

  const paddingsWidth = Math.max(
    0,
    convertPaddingPercentToSize(flattenedPaddingStart, layout) +
      convertPaddingPercentToSize(flattenedPaddingEnd, layout)
  );

  return routes.reduce<number>(
    (acc, _, i) =>
      acc +
      (i > 0 ? (gap ?? 0) : 0) +
      getComputedTabWidth(
        i,
        layout,
        routes,
        scrollEnabled,
        tabWidths,
        flattenedTabWidth,
        flattenedPaddingStart,
        flattenedPaddingEnd,
        gap
      ),
    paddingsWidth
  );
};

const normalizeScrollValue = <T extends Route>({
  layout,
  navigationState,
  gap,
  scrollEnabled,
  tabWidths,
  value,
  flattenedTabWidth,
  flattenedPaddingStart,
  flattenedPaddingEnd,
  direction,
}: Pick<Props<T>, 'layout' | 'navigationState' | 'gap' | 'scrollEnabled'> & {
  tabWidths: Record<string, number>;
  value: number;
  flattenedTabWidth: DimensionValue | undefined;
  flattenedPaddingStart: DimensionValue | undefined;
  flattenedPaddingEnd: DimensionValue | undefined;
  direction: LocaleDirection;
}) => {
  const tabBarWidth = getTabBarWidth({
    layout,
    navigationState,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingStart,
    flattenedPaddingEnd,
  });
  const maxDistance = getMaxScrollDistance(tabBarWidth, layout.width);
  const scrollValue = Math.max(Math.min(value, maxDistance), 0);

  if (Platform.OS === 'android' && direction === 'rtl') {
    // On Android, scroll value is not applied in reverse in RTL
    // so we need to manually adjust it to apply correct value
    return maxDistance - scrollValue;
  }

  return scrollValue;
};

const getScrollAmount = <T extends Route>({
  layout,
  navigationState,
  gap,
  scrollEnabled,
  flattenedTabWidth,
  tabWidths,
  flattenedPaddingStart,
  flattenedPaddingEnd,
  direction,
}: Pick<Props<T>, 'layout' | 'navigationState' | 'scrollEnabled' | 'gap'> & {
  tabWidths: Record<string, number>;
  flattenedTabWidth: DimensionValue | undefined;
  flattenedPaddingStart: DimensionValue | undefined;
  flattenedPaddingEnd: DimensionValue | undefined;
  direction: LocaleDirection;
}) => {
  const paddingInitial =
    direction === 'rtl'
      ? convertPaddingPercentToSize(flattenedPaddingEnd, layout)
      : convertPaddingPercentToSize(flattenedPaddingStart, layout);

  const centerDistance = Array.from({
    length: navigationState.index + 1,
  }).reduce<number>((total, _, i) => {
    const tabWidth = getComputedTabWidth(
      i,
      layout,
      navigationState.routes,
      scrollEnabled,
      tabWidths,
      flattenedTabWidth,
      flattenedPaddingStart,
      flattenedPaddingEnd,
      gap
    );

    // To get the current index centered we adjust scroll amount by width of indexes
    // 0 through (i - 1) and add half the width of current index i
    return (
      total +
      (i > 0 ? (gap ?? 0) : 0) +
      (navigationState.index === i ? tabWidth / 2 : tabWidth)
    );
  }, paddingInitial);

  const scrollAmount = centerDistance - layout.width / 2;

  return normalizeScrollValue({
    layout,
    navigationState,
    tabWidths,
    value: scrollAmount,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingStart,
    flattenedPaddingEnd,
    direction,
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
const MEASURE_PER_BATCH = 10;

export function TabBar<T extends Route>({
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
  layout: propLayout,
  testID,
  android_ripple,
  options,
}: Props<T>) {
  const [layout, setLayout] = React.useState<Layout>(
    propLayout ?? { width: 0, height: 0 }
  );
  const [tabWidths, setTabWidths] = React.useState<Record<string, number>>({});
  const flatListRef = React.useRef<FlatList | null>(null);
  const isFirst = React.useRef(true);
  const scrollAmount = useAnimatedValue(0);
  const measuredTabWidths = React.useRef<Record<string, number>>({});
  const { routes } = navigationState;
  const flattenedTabWidth = getFlattenedTabWidth(tabStyle);
  const isWidthDynamic = flattenedTabWidth === 'auto';
  const flattenedPaddingEnd = getFlattenedPaddingEnd(contentContainerStyle);
  const flattenedPaddingStart = getFlattenedPaddingStart(contentContainerStyle);
  const scrollOffset = getScrollAmount({
    layout,
    navigationState,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingStart,
    flattenedPaddingEnd,
    direction,
  });

  const hasMeasuredTabWidths =
    Boolean(layout.width) &&
    routes
      .slice(0, navigationState.index)
      .every((r) => typeof tabWidths[r.key] === 'number');

  React.useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (isWidthDynamic && !hasMeasuredTabWidths) {
      return;
    }

    if (scrollEnabled) {
      flatListRef.current?.scrollToOffset({
        offset: scrollOffset,
        animated: true,
      });
    }
  }, [hasMeasuredTabWidths, isWidthDynamic, scrollEnabled, scrollOffset]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    setLayout((layout) =>
      layout.width === width && layout.height === height
        ? layout
        : { width, height }
    );
  };

  const tabBarWidth = getTabBarWidth({
    layout,
    navigationState,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingStart,
    flattenedPaddingEnd,
  });

  const separatorsWidth = Math.max(0, routes.length - 1) * gap;
  const paddingsWidth = Math.max(
    0,
    convertPaddingPercentToSize(flattenedPaddingStart, layout) +
      convertPaddingPercentToSize(flattenedPaddingEnd, layout)
  );

  const translateX = React.useMemo(
    () =>
      getTranslateX(
        scrollAmount,
        getMaxScrollDistance(tabBarWidth, layout.width),
        direction
      ),
    [direction, layout.width, scrollAmount, tabBarWidth]
  );

  const renderItem = React.useCallback(
    ({ item: route, index }: ListRenderItemInfo<T>) => {
      const {
        testID = getTestIdDefault({ route }),
        labelText = getLabelTextDefault({ route }),
        accessible = getAccessibleDefault({ route }),
        accessibilityLabel = getAccessibilityLabelDefault({ route }),
        ...rest
      } = options?.[route.key] ?? {};

      const onLayout = isWidthDynamic
        ? (e: LayoutChangeEvent) => {
            measuredTabWidths.current[route.key] = e.nativeEvent.layout.width;

            // When we have measured widths for all of the tabs, we should updates the state
            // We avoid doing separate setState for each layout since it triggers multiple renders and slows down app
            // If we have more than 10 routes divide updating tabWidths into multiple batches. Here we update only first batch of 10 items.
            if (
              routes.length > MEASURE_PER_BATCH &&
              index === MEASURE_PER_BATCH &&
              routes
                .slice(0, MEASURE_PER_BATCH)
                .every(
                  (r) => typeof measuredTabWidths.current[r.key] === 'number'
                )
            ) {
              setTabWidths({ ...measuredTabWidths.current });
            } else if (
              routes.every(
                (r) => typeof measuredTabWidths.current[r.key] === 'number'
              )
            ) {
              // When we have measured widths for all of the tabs, we should updates the state
              // We avoid doing separate setState for each layout since it triggers multiple renders and slows down app
              setTabWidths({ ...measuredTabWidths.current });
            }
          }
        : undefined;

      const onPress = () => {
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
      };

      const onLongPress = () => onTabLongPress?.({ route });

      // Calculate the default width for tab for FlatList to work
      const defaultTabWidth = !isWidthDynamic
        ? getComputedTabWidth(
            index,
            layout,
            routes,
            scrollEnabled,
            tabWidths,
            getFlattenedTabWidth(tabStyle),
            getFlattenedPaddingEnd(contentContainerStyle),
            getFlattenedPaddingStart(contentContainerStyle),
            gap
          )
        : undefined;

      const props = {
        ...rest,
        position,
        route,
        navigationState,
        testID,
        labelText,
        accessible,
        accessibilityLabel,
        activeColor,
        inactiveColor,
        pressColor,
        pressOpacity,
        onLayout,
        onPress,
        onLongPress,
        style: tabStyle,
        defaultTabWidth,
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
    },
    [
      position,
      navigationState,
      options,
      activeColor,
      inactiveColor,
      pressColor,
      pressOpacity,
      isWidthDynamic,
      tabStyle,
      layout,
      routes,
      scrollEnabled,
      tabWidths,
      contentContainerStyle,
      gap,
      android_ripple,
      renderTabBarItem,
      onTabPress,
      jumpTo,
      onTabLongPress,
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
        { useNativeDriver }
      ),
    [scrollAmount]
  );

  const handleViewableItemsChanged = useLatestCallback(
    ({ changed }: { changed: ViewToken[] }) => {
      if (routes.length <= MEASURE_PER_BATCH) {
        return;
      }
      // Get next vievable item
      const item = changed[changed.length - 1];
      const index = item?.index || 0;
      if (
        item.isViewable &&
        (index % 10 === 0 ||
          index === navigationState.index ||
          index === routes.length - 1)
      ) {
        setTabWidths({ ...measuredTabWidths.current });
      }
    }
  );

  return (
    <Animated.View onLayout={handleLayout} style={[styles.tabBar, style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicatorContainer,
          scrollEnabled ? { transform: [{ translateX }] as any } : null,
          scrollEnabled ? { width: tabBarWidth } : null,
          indicatorContainerStyle,
        ]}
      >
        {renderIndicator({
          position,
          layout,
          navigationState,
          jumpTo,
          direction,
          width: isWidthDynamic
            ? 'auto'
            : Math.max(
                0,
                (tabBarWidth - separatorsWidth - paddingsWidth) / routes.length
              ),
          style: [
            indicatorStyle,
            { start: flattenedPaddingStart, end: flattenedPaddingEnd },
          ],
          getTabWidth: (i: number) =>
            getComputedTabWidth(
              i,
              layout,
              routes,
              scrollEnabled,
              tabWidths,
              flattenedTabWidth,
              flattenedPaddingEnd,
              flattenedPaddingStart,
              gap
            ),
          gap,
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
          initialNumToRender={MEASURE_PER_BATCH}
          onViewableItemsChanged={handleViewableItemsChanged}
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

const styles = StyleSheet.create({
  scroll: {
    overflow: Platform.select({ default: 'scroll', web: undefined }),
  },
  tabBar: {
    zIndex: 1,
    backgroundColor: '#2196f3',
    elevation: 4,
    ...Platform.select({
      default: {
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
          height: StyleSheet.hairlineWidth,
          width: 0,
        },
      },
      web: {
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
      },
    }),
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
  },
});
