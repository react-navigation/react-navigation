import { DrawerActionType } from './routers/DrawerActions';

export type Route = {
  key: string;
  routeName: string;
};

export type Scene = {
  route: Route;
  index: number;
  focused: boolean;
  tintColor?: string;
};

export type Navigation = {
  state: {
    key: string;
    index: number;
    routes: Route[];
    openId: string;
    closeId: string;
    toggleId: string;
    isDrawerIdle: boolean;
    isDrawerOpen: boolean;
  };
  openDrawer: () => void;
  closeDrawer: () => void;
  dispatch: (action: {
    type: DrawerActionType;
    key: string;
    willShow?: boolean;
  }) => void;
};
