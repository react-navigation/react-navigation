import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Animated, I18nManager, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';

import Albums from '../../Shared/Albums';
import Article from '../../Shared/Article';
import Contacts from '../../Shared/Contacts';

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

const CustomIndicator = () => {
  const insets = useSafeAreaInsets();
  const [index, onIndexChange] = React.useState(0);
  const [routes] = React.useState<Route[]>([
    {
      key: 'article',
      icon: 'ios-document',
    },
    {
      key: 'contacts',
      icon: 'ios-people',
    },
    {
      key: 'albums',
      icon: 'ios-albums',
    },
  ]);

  const renderIndicator = (
    props: SceneRendererProps & {
      navigationState: State;
      getTabWidth: (i: number) => number;
    }
  ) => {
    const { position, navigationState, getTabWidth } = props;
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
        return i * getTabWidth(i) * (I18nManager.isRTL ? -1 : 1);
      }),
    });

    return (
      <Animated.View
        style={[
          styles.container,
          {
            width: `${100 / navigationState.routes.length}%`,
            transform: [{ translateX }] as any,
          },
        ]}
      >
        <Animated.View
          style={[styles.indicator, { opacity, transform: [{ scale }] } as any]}
        />
      </Animated.View>
    );
  };

  const renderIcon = ({ route }: { route: Route }) => (
    <Ionicons name={route.icon} size={24} style={styles.icon} />
  );

  const renderBadge = ({ route }: { route: Route }) => {
    if (route.key === 'albums') {
      return (
        <View style={styles.badge}>
          <Text style={styles.count}>42</Text>
        </View>
      );
    }
    return null;
  };

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: State }
  ) => (
    <View style={[styles.tabbar, { paddingBottom: insets.bottom }]}>
      <TabBar
        {...props}
        renderIcon={renderIcon}
        renderBadge={renderBadge}
        renderIndicator={renderIndicator}
        style={styles.tabbar}
      />
    </View>
  );

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
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

export default CustomIndicator;

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#263238',
    overflow: 'hidden',
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
    marginRight: 32,
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
