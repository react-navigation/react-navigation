import type {
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/core';

// eslint-disable-next-line @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
export function useBackButton(
  _: React.RefObject<NavigationContainerRef<ParamListBase>>
) {
  // No-op
  // BackHandler is not available on web
}
