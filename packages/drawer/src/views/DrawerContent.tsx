import * as React from 'react';

import type { DrawerContentComponentProps } from '../types';
import DrawerContentScrollView from './DrawerContentScrollView';
import DrawerItemList from './DrawerItemList';

export default function DrawerContent({
  descriptors,
  state,
  ...rest
}: DrawerContentComponentProps) {
  const { drawerContentStyle, drawerContentContainerStyle } =
    descriptors[state.routes[state.index].key].options;

  return (
    <DrawerContentScrollView
      {...rest}
      contentContainerStyle={drawerContentContainerStyle}
      style={drawerContentStyle}
    >
      <DrawerItemList descriptors={descriptors} state={state} {...rest} />
    </DrawerContentScrollView>
  );
}
