import type { DrawerContentComponentProps } from '../types';
import { DrawerContentScrollView } from './DrawerContentScrollView';
import { DrawerItemList } from './DrawerItemList';

export function DrawerContent({
  descriptors,
  state,
  ...rest
}: DrawerContentComponentProps) {
  const focusedRoute = state.routes[state.index];

  if (focusedRoute == null) {
    throw new Error(`Couldn't find a route at index ${state.index}.`);
  }

  const focusedOptions = descriptors[focusedRoute.key]?.options ?? {};

  const { drawerContentStyle, drawerContentContainerStyle } = focusedOptions;

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
