import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@react-navigation/elements';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { PathConfigMap } from '../../../packages/core/src/types';

export type PreloadBottomTabsParams = {
  Home: undefined;
  Details: undefined;
};

export const preloadBottomTabsLinking: PathConfigMap<PreloadBottomTabsParams> =
  {
    Home: '',
    Details: 'details',
  };

const DetailsScreen = ({
  navigation,
}: BottomTabScreenProps<PreloadBottomTabsParams, 'Details'>) => {
  const [loadingCountdown, setLoadingCountdown] = useState(3);
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingCountdown((loadingCountdown) => {
        if (loadingCountdown === 1) {
          clearInterval(interval);
        }
        return loadingCountdown - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.content}>
      <Text style={[styles.text, styles.countdown]}>
        {loadingCountdown > 0 && loadingCountdown}
      </Text>
      <Text style={styles.text}>
        {loadingCountdown === 0 ? 'Loaded!' : 'Loading...'}
      </Text>
      <Button onPress={navigation.goBack} style={styles.button}>
        Back to home
      </Button>
    </View>
  );
};

const HomeScreen = ({
  navigation,
}: BottomTabScreenProps<PreloadBottomTabsParams, 'Home'>) => {
  const { navigate, preload } = navigation;

  return (
    <View style={styles.content}>
      <Button onPress={() => preload('Details')} style={styles.button}>
        Preload screen
      </Button>
      <Button onPress={() => navigate('Details')} style={styles.button}>
        Navigate
      </Button>
    </View>
  );
};

const BottomsTabs = createBottomTabNavigator<PreloadBottomTabsParams>();

export function TabPreloadFlow() {
  return (
    <BottomsTabs.Navigator screenOptions={{ headerShown: false }}>
      <BottomsTabs.Screen name="Home" component={HomeScreen} />
      <BottomsTabs.Screen name="Details" component={DetailsScreen} />
    </BottomsTabs.Navigator>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  button: {
    margin: 8,
  },
  text: {
    textAlign: 'center',
    margin: 8,
  },
  countdown: {
    fontSize: 24,
    minHeight: 32,
  },
});
