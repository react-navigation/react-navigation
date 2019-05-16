import * as React from 'react';

export type Route = {
  key: string;
  routeName: string;
} & (NavigationState | undefined);

export type NavigationEventName =
  | 'willFocus'
  | 'didFocus'
  | 'willBlur'
  | 'didBlur';

export type NavigationState = {
  key: string;
  index: number;
  routes: Route[];
  isTransitioning?: boolean;
  params?: { [key: string]: unknown };
};

export type NavigationProp<RouteName = string, Params = object> = {
  emit(eventName: string): void;
  navigate(routeName: RouteName): void;
  goBack(): void;
  goBack(key: string | null): void;
  addListener: (
    event: NavigationEventName,
    callback: () => void
  ) => { remove: () => void };
  isFocused(): boolean;
  state: NavigationState;
  setParams(params: Params): void;
  getParam(): Params;
  dispatch(action: { type: string }): void;
  dangerouslyGetParent(): NavigationProp | undefined;
};

export type NavigationTabOptions = {
  title?: string;
  tabBarLabel?: React.ReactNode;
  tabBarIcon?:
    | React.ReactNode
    | ((props: {
        focused: boolean;
        tintColor: string;
        horizontal: boolean;
      }) => React.ReactNode);
  tabBarTestID?: string;
  tabBarOnPress?: (props: {
    navigation: NavigationProp;
    defaultHandler: () => void;
  }) => void;
  tabBarOnLongPress?: (props: {
    navigation: NavigationProp;
    defaultHandler: () => void;
  }) => void;
  tabBarAccessibilityLabel?: string;
};

export type SceneDescriptor = {
  key: string;
  options: NavigationTabOptions;
  navigation: NavigationProp;
  getComponent(): React.ComponentType;
};

export type Screen = React.ComponentType<any> & {
  navigationOptions?: NavigationTabOptions & {
    [key: string]: any;
  };
};
