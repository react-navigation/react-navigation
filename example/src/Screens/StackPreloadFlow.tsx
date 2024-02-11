import { Button } from '@react-navigation/elements';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { PathConfigMap } from '../../../packages/core/src/types';

export type PreloadStackParams = {
  Home: undefined;
  Details: undefined;
  Profile: undefined;
};

export const preloadStackLinking: PathConfigMap<PreloadStackParams> = {
  Home: '',
  Details: 'details',
  Profile: 'profile',
};

const DetailsScreen = ({
  navigation,
}: StackScreenProps<PreloadStackParams, 'Details'>) => {
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
      <Button
        onPress={() => navigation.navigate('Profile')}
        style={styles.button}
      >
        Go to Profile
      </Button>
      <Button onPress={navigation.retain} style={styles.button}>
        Retain
      </Button>
    </View>
  );
};

const ProfileScreen = ({
  navigation,
}: StackScreenProps<PreloadStackParams, 'Profile'>) => {
  return (
    <View style={styles.content}>
      <Text style={styles.text}>Profile</Text>
      <Button onPress={navigation.goBack} style={styles.button}>
        Back to home
      </Button>
    </View>
  );
};

const HomeScreen = ({
  navigation,
}: StackScreenProps<PreloadStackParams, 'Home'>) => {
  const { navigate, preload, remove } = navigation;

  return (
    <View style={styles.content}>
      <Button onPress={() => preload('Details')} style={styles.button}>
        Preload Details
      </Button>
      <Button onPress={() => preload('Profile')} style={styles.button}>
        Preload Profile
      </Button>
      <Button onPress={() => navigate('Details')} style={styles.button}>
        Navigate Details
      </Button>
      <Button onPress={() => remove('Details')} style={styles.button}>
        Remove Details preload
      </Button>
    </View>
  );
};

const SimpleStack = createStackNavigator<PreloadStackParams>();

export function StackPreloadFlow() {
  return (
    <SimpleStack.Navigator screenOptions={{ headerShown: false }}>
      <SimpleStack.Screen name="Home" component={HomeScreen} />
      <SimpleStack.Screen name="Details" component={DetailsScreen} />
      <SimpleStack.Screen name="Profile" component={ProfileScreen} />
    </SimpleStack.Navigator>
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
