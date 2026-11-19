import { Text } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

export function ComponentsWindowInsetsView(_: StaticScreenProps<{}>) {
  return (
    <View style={styles.centered}>
      <Text>WindowInsetsView is only available on Android</Text>
    </View>
  );
}

ComponentsWindowInsetsView.title = 'Components - Window Insets View';
ComponentsWindowInsetsView.linking = {};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
