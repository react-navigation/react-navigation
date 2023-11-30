import { Button } from '@react-navigation/elements';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type PreloadStackParams = {
  Home: undefined;
  Details: undefined;
};

const DetailsScreen = ({
  navigation,
}: StackScreenProps<PreloadStackParams, 'Details'>) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    console.log('Mounted!');
    const timeout = setTimeout(() => {
      setLoaded(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.content}>
      <Text style={styles.text}>{loaded ? 'Loaded!' : 'Loading...'}</Text>
      <Button onPress={navigation.goBack} style={styles.button}>
        Back to home
      </Button>
    </View>
  );
};

const HomeScreen = ({
  navigation,
}: StackScreenProps<PreloadStackParams, 'Home'>) => {
  const { navigate, preload, removePreload } = navigation;

  return (
    <View style={styles.content}>
      <Button onPress={() => preload('Details')} style={styles.button}>
        Preload screen
      </Button>
      <Button onPress={() => navigate('Details')} style={styles.button}>
        Navigate
      </Button>
      <Button onPress={() => removePreload('Details')} style={styles.button}>
        Remove preload
      </Button>
    </View>
  );
};

const SimpleStack = createStackNavigator<PreloadStackParams>();

export function PreloadFlow() {
  return (
    <SimpleStack.Navigator>
      <SimpleStack.Screen name="Home" component={HomeScreen} />
      <SimpleStack.Screen name="Details" component={DetailsScreen} />
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
});
