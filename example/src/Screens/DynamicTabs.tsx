import Feather from '@expo/vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text } from '@react-navigation/elements';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import type { PathConfigMap } from '../../../packages/core/src/types';

export type DynamicBottomTabParams = {
  [key: `tab-${number}`]: undefined;
};

export const dynamicBottomTabLinking: PathConfigMap<DynamicBottomTabParams> = {
  'tab-0': 'tab/0',
  'tab-1': 'tab/1',
  'tab-2': 'tab/2',
  'tab-3': 'tab/3',
  'tab-4': 'tab/4',
  'tab-5': 'tab/5',
};

const BottomTabs = createBottomTabNavigator<DynamicBottomTabParams>();

export function DynamicTabs() {
  const [tabs, setTabs] = React.useState([0, 1]);

  return (
    <BottomTabs.Navigator>
      {tabs.map((i) => (
        <BottomTabs.Screen
          key={i}
          name={`tab-${i}`}
          options={{
            title: `Tab ${i}`,
            tabBarIcon: ({ color, size }) => (
              <Feather name="octagon" color={color} size={size} />
            ),
          }}
        >
          {() => (
            <View style={styles.container}>
              <Text style={styles.heading}>Tab {i}</Text>
              <View style={styles.buttons}>
                {tabs.length < 5 && (
                  <Button
                    onPress={() =>
                      setTabs((tabs) => {
                        if (tabs.length < 5) {
                          return [...tabs, tabs.length];
                        } else {
                          return tabs;
                        }
                      })
                    }
                  >
                    Add a tab
                  </Button>
                )}
                {tabs.length > 1 && (
                  <Button
                    onPress={() =>
                      setTabs((tabs) => {
                        if (tabs.length > 1) {
                          return tabs.slice(0, -1);
                        } else {
                          return tabs;
                        }
                      })
                    }
                  >
                    Remove a tab
                  </Button>
                )}
              </View>
            </View>
          )}
        </BottomTabs.Screen>
      ))}
    </BottomTabs.Navigator>
  );
}

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
