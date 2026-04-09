import type {
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/core';

export function useBackButton<ParamList extends ParamListBase>(
  _: React.RefObject<NavigationContainerRef<ParamList> | null>
) {
  // No-op
  // BackHandler is not available on web
}
