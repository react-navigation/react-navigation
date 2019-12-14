import * as React from 'react';
import DrawerItemList from './DrawerItemList';
import { DrawerContentComponentProps } from '../types';
import DrawerContentScrollView from './DrawerContentScrollView';

export default function DrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
