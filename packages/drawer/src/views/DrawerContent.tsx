import * as React from 'react';
import DrawerItemList from './DrawerItemList';
import DrawerContentScrollView from './DrawerContentScrollView';
import type { DrawerContentComponentProps } from '../types';

export default function DrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
