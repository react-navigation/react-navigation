import {
  type BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Button, Text } from '@react-navigation/elements';
import {
  createComponentForStaticNavigation,
  createPathConfigForStaticNavigation,
  type StaticParamList,
  type StaticScreenProps,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

let count = 0;

function TestScreen({
  route: { params },
}: StaticScreenProps<{ count: number } | undefined>) {
  const route = useRoute();
  const navigation = useNavigation<BottomTabNavigationProp<TabsParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Tab {route.name} ({params?.count ?? '-'})
      </Text>
      <View style={styles.buttons}>
        {(['First', 'Second', 'Third'] as const).map((name) => (
          <Button
            key={name}
            onPress={() => {
              navigation.navigate(name, { count: ++count });
            }}
          >
            Navigate to {name}
          </Button>
        ))}
        <Button
          variant="plain"
          onPress={() => {
            navigation.goBack();
          }}
        >
          Go back
        </Button>
      </View>
    </View>
  );
}

type TabsParamList = StaticParamList<typeof Tabs>;

const Tabs = createBottomTabNavigator({
  backBehavior: 'fullHistory',
  screens: {
    First: {
      screen: TestScreen,
      linking: 'first/:count?',
    },
    Second: {
      screen: TestScreen,
      linking: 'second/:count?',
    },
    Third: {
      screen: TestScreen,
      linking: 'third/:count?',
    },
  },
});

const FullHistoryTabsComponent = createComponentForStaticNavigation(
  Tabs,
  'FullHistoryTabs'
);

export function FullHistoryTabs() {
  useEffect(() => {
    count = 0;
  }, []);

  return <FullHistoryTabsComponent />;
}

FullHistoryTabs.title = 'Full History Tabs';
FullHistoryTabs.linking = createPathConfigForStaticNavigation(Tabs, {});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttons: {
    gap: 8,
  },
});
