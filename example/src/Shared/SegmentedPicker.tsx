import { Text } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';

type Props<T extends string> = {
  choices: { label: string; value: T }[];
  value: T;
  onValueChange: (value: T) => void;
};

export function SegmentedPicker<T extends string>({
  choices,
  value,
  onValueChange,
}: Props<T>) {
  const { dark } = useTheme();

  return (
    <View style={styles.container}>
      {choices.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onValueChange(option.value)}
          style={[
            styles.segment,
            option.value === value && [
              styles.active,
              { backgroundColor: dark ? 'rgba(255, 255, 255, 0.15)' : '#fff' },
            ],
          ]}
        >
          <Text>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  segment: {
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  active: {
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
  },
});
