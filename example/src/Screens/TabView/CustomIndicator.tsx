import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@react-navigation/elements';
import { useLocale } from '@react-navigation/native';
import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  type NavigationState,
  SceneMap,
  type SceneRendererProps,
  TabBar,
  type TabBarIndicatorProps,
  TabView,
} from 'react-native-tab-view';

import { Albums } from '../../Shared/Albums';
import { Article } from '../../Shared/Article';
import { Contacts } from '../../Shared/Contacts';

type Route = {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

type State = NavigationState<Route>;

const renderScene = SceneMap({
  article: () => <Article />,
  contacts: () => <Contacts />,
  albums: () => <Albums />,
});

export const CustomIndicator = () => {
  const { direction } = useLocale();
  const insets = useSafeAreaInsets();
  const [index, onIndexChange] = React.useState(0);
  const [routes] = React.useState<Route[]>([
    {
      key: 'article',
      icon: 'document',
    },
    {
      key: 'contacts',
      icon: 'people',
    },
    {
      key: 'albums',
      icon: 'albums',
    },
  ]);

  const renderIndicator = (props: TabBarIndicatorProps<Route>) => {
    const { position, getTabWidth, gap, width, style } = props;
    const inputRange = [
      0, 0.48, 0.49, 0.51, 0.52, 1, 1.48, 1.49, 1.51, 1.52, 2,
    ];

    const scale = position.interpolate({
      inputRange,
      outputRange: inputRange.map((x) => (Math.trunc(x) === x ? 2 : 0.1)),
    });

    const opacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map((x) => {
        const d = x - Math.trunc(x);
        return d === 0.49 || d === 0.51 ? 0 : 1;
      }),
    });

    const translateX = position.interpolate({
      inputRange: inputRange,
      outputRange: inputRange.map((x) => {
        const i = Math.round(x);
        return (
          (i * getTabWidth(i) + i * (gap ?? 0)) * (direction === 'rtl' ? -1 : 1)
        );
      }),
    });

    return (
      <Animated.View
        style={[
          style,
          styles.container,
          { width, transform: [{ translateX }] },
        ]}
      >
        <Animated.View
          style={[styles.indicator, { opacity, transform: [{ scale }] } as any]}
        />
      </Animated.View>
    );
  };

  const renderBadge = React.useCallback(
    () => (
      <View style={styles.badge}>
        <Text style={styles.count}>42</Text>
      </View>
    ),
    []
  );

  const renderIcon = React.useCallback((props: { route: Route }) => {
    return <Ionicons name={props.route.icon} style={styles.icon} {...props} />;
  }, []);

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: State }
  ) => (
    <View style={[styles.tabbar, { paddingBottom: insets.bottom }]}>
      <TabBar
        {...props}
        commonOptions={{
          icon: renderIcon,
        }}
        options={{
          albums: {
            badge: renderBadge,
          },
        }}
        direction={direction}
        renderIndicator={renderIndicator}
        style={styles.tabbar}
        contentContainerStyle={styles.tabbarContentContainer}
        gap={20}
      />
    </View>
  );

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      direction={direction}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      tabBarPosition="bottom"
      onIndexChange={onIndexChange}
    />
  );
};

CustomIndicator.options = {
  title: 'Custom indicator',
  headerShadowVisible: false,
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: '#263238',
  },
};

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#263238',
    overflow: 'hidden',
  },
  tabbarContentContainer: {
    paddingHorizontal: 10,
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    backgroundColor: 'rgb(0, 132, 255)',
    width: 48,
    height: 48,
    borderRadius: 24,
    margin: 6,
  },
  badge: {
    marginTop: 4,
    marginEnd: 32,
    backgroundColor: '#f44336',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
