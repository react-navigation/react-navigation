import { Button, Text } from '@react-navigation/elements';
import type {
  NavigatorScreenParams,
  StaticScreenProps,
} from '@react-navigation/native';
import { CommonActions } from '@react-navigation/routers';
import { StyleSheet, View } from 'react-native';

import type { NativeBottomTabParams } from './NativeBottomTabs.native';

export function NativeBottomTabs(
  _: StaticScreenProps<NavigatorScreenParams<NativeBottomTabParams>>
) {
  return (
    <View style={styles.container}>
      <Text>Not supported on this platform</Text>
      <Button action={CommonActions.goBack()}>Go back</Button>
    </View>
  );
}

NativeBottomTabs.title = 'Native Bottom Tabs';
NativeBottomTabs.linking = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});
