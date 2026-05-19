import { PlatformPressable, Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  testID?: string;
  children?: React.ReactNode;
};

export function ListItem({ title, onPress, testID, children }: Props) {
  if (onPress) {
    return (
      <PlatformPressable
        disabled={!onPress}
        onPress={onPress}
        testID={testID}
        style={styles.container}
      >
        <Text style={styles.title}>{title}</Text>
        {children}
      </PlatformPressable>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID={testID}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    marginVertical: 16,
  },
});
