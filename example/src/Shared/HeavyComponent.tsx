import { Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';

export function HeavyComponent() {
  const items = [];

  for (let index = 0; index < 500; index++) {
    let value = 0;

    for (let iteration = 0; iteration < 1000; iteration++) {
      value += Math.sqrt(index * iteration + 1);
    }

    items.push(
      <Text key={index} style={styles.item}>
        {Math.round(value)}
      </Text>
    );
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      {items}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
  item: {
    height: 1,
    opacity: 0,
  },
});
