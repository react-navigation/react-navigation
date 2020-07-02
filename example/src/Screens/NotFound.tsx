import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';

const NotFoundScreen = ({
  navigation,
}: StackScreenProps<{ Home: undefined }>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 Not Found</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Home')}
        style={styles.button}
      >
        Go to home
      </Button>
    </View>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  button: {
    margin: 24,
  },
});
