import * as React from 'react';
import { ScrollView } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import DrawerItemList from './DrawerItemList';
import { DrawerContentComponentProps } from '../types';

export default function DrawerContent({
  state,
  navigation,
  descriptors,
  contentContainerStyle,
  drawerPosition,
  ...rest
}: DrawerContentComponentProps) {
  const insets = useSafeArea();

  return (
    <ScrollView
      contentContainerStyle={[
        {
          paddingTop: insets.top + 4,
          paddingLeft: drawerPosition === 'left' ? insets.left : 0,
          paddingRight: drawerPosition === 'right' ? insets.right : 0,
        },
        contentContainerStyle,
      ]}
    >
      <DrawerItemList
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        {...rest}
      />
    </ScrollView>
  );
}
