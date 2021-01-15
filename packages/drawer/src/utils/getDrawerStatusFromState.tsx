import type {
  DrawerNavigationState,
  ParamListBase,
} from '@react-navigation/native';

export default function getDrawerStatusFromState(
  state: DrawerNavigationState<ParamListBase>
) {
  if (state.history == null) {
    throw new Error(
      "Couldn't find the drawer status in the state object. Is it a valid state object of drawer navigator?"
    );
  }

  const entry = state.history.find((it) => it.type === 'drawer') as
    | { type: 'drawer'; status: 'open' }
    | undefined;

  return entry?.status ?? 'closed';
}
