import { Text } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, Switch, View } from 'react-native';

type Props = {
  label: string;
  value: boolean;
  disabled?: boolean;
  onValueChange: () => void;
};

export function SettingsItem({ label, value, disabled, onValueChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      <Switch
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
  },
});
