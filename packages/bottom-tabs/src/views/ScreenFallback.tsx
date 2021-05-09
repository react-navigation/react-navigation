import * as React from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import { Screen, screensEnabled } from 'react-native-screens';
import { ResourceSavingView } from '@react-navigation/elements';

type Props = {
  visible: boolean;
  children: React.ReactNode;
  enabled: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function ScreenFallback({ visible, children, ...rest }: Props) {
  // react-native-screens is buggy on web
  if (screensEnabled?.() && Platform.OS !== 'web') {
    return (
      <Screen activityState={visible ? 2 : 0} {...rest}>
        {children}
      </Screen>
    );
  }

  return (
    <ResourceSavingView visible={visible} {...rest}>
      {children}
    </ResourceSavingView>
  );
}
