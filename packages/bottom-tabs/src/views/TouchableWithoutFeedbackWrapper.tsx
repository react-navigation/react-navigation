import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

export default function TouchableWithoutFeedbackWrapper({
  onPress,
  onLongPress,
  testID,
  accessibilityLabel,
  accessibilityRole,
  accessibilityStates,
  ...rest
}: React.ComponentProps<typeof TouchableWithoutFeedback> & {
  children: React.ReactNode;
}) {
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
      hitSlop={{ left: 15, right: 15, top: 0, bottom: 5 }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityStates={accessibilityStates}
    >
      <View {...rest} />
    </TouchableWithoutFeedback>
  );
}
