import * as React from 'react';
import { View } from 'react-native';
import { Subheading, Switch } from 'react-native-paper';

type Props = {
  label: string;
  value: boolean;
  onValueChange: () => void;
};

export default function SettingsItem({ label, value, onValueChange }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Subheading>{label}</Subheading>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}
