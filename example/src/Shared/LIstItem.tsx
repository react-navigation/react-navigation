import { PlatformPressable, Text } from '@react-navigation/elements';
import { StyleSheet } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  testID?: string;
};

export function ListItem({ title, testID, onPress }: Props) {
  return (
    <PlatformPressable
      testID={testID}
      onPress={onPress}
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
  },
});
