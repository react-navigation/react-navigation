import { Button, Text } from '@react-navigation/elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

export const NotFound = () => {
  const route = useRoute();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 Not Found ({route.path})</Text>
      <Button
        variant="filled"
        onPress={() => navigation.navigate('Home')}
        style={styles.button}
      >
        Go to home
      </Button>
    </View>
  );
};

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
