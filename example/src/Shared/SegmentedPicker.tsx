import { Text } from '@react-navigation/elements';
import { Color } from '@react-navigation/elements/internal';
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
  const { colors, fonts } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {choices.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onValueChange(option.value)}
          style={[
            styles.segment,
            option.value === value && { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              fonts.medium,
              {
                color:
                  option.value === value
                    ? Color.foreground(colors.primary)
                    : colors.text,
              },
            ]}
          >
            {option.label}
          </Text>
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
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
