import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text } from '@react-navigation/elements';
import {
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
  const navigation = useNavigation<typeof Tabs>();

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

function CounterLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    count = 0;
  }, []);

  return <>{children}</>;
}

const Tabs = createBottomTabNavigator({
  backBehavior: 'fullHistory',
  layout: (props) => <CounterLayout {...props} />,
  implementation: 'custom',
  screenOptions: {
    headerShown: true,
  },
  screens: {
    First: {
      screen: TestScreen,
      linking: {
        path: 'first/:count?',
        parse: { count: Number },
      },
      options: {
        tabBarButtonTestID: 'first-tab',
      },
    },
    Second: {
      screen: TestScreen,
      linking: {
        path: 'second/:count?',
        parse: { count: Number },
      },
      options: {
        tabBarButtonTestID: 'second-tab',
      },
    },
    Third: {
      screen: TestScreen,
      linking: {
        path: 'third/:count?',
        parse: { count: Number },
      },
      options: {
        tabBarButtonTestID: 'third-tab',
      },
    },
  },
});

export const FullHistoryTabs = {
  screen: Tabs,
  title: 'Full History Tabs',
};

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
