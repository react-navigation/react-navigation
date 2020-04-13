import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

const NotFoundScreen = ({
  navigation,
}: {
  navigation: StackNavigationProp<{}>;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 Not Found</Text>
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
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
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
