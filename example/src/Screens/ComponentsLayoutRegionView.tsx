import { Text } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

export function ComponentsLayoutRegionView(_: StaticScreenProps<{}>) {
  return (
    <View style={styles.centered}>
      <Text>LayoutRegionView is only available on iOS</Text>
    </View>
  );
}

ComponentsLayoutRegionView.title = 'Components - Layout Region View';
ComponentsLayoutRegionView.linking = {};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
