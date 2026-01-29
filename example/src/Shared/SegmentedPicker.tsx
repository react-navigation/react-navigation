import { Text } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

type Props<T extends string | number> = {
  choices: { label: string; value: T }[];
  value: T;
  onValueChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

export function SegmentedPicker<T extends string | number>({
  choices,
  value,
  onValueChange,
  style,
}: Props<T>) {
  const { dark, fonts } = useTheme();

  return (
    <View style={[styles.container, style]}>
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
          <Text style={fonts.medium}>{option.label}</Text>
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
