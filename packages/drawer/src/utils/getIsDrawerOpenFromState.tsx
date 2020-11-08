import type {
  DrawerNavigationState,
  ParamListBase,
} from '@react-navigation/native';

export default function getIsDrawerOpenFromState(
  state: DrawerNavigationState<ParamListBase>
): boolean {
  if (state.history == null) {
    throw new Error(
      "Couldn't find the drawer status in the state object. Is it a valid state object of drawer navigator?"
    );
  }

  return state.history.some((it) => it.type === 'drawer');
}
