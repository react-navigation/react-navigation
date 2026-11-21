import type { AdapterProps } from 'react-native-tab-view';

// The edge swipe conflict only happens with the native pager on iOS
// So the default adapter is used on Web
export const drawerAwareAdapter:
  | ((props: AdapterProps) => React.ReactElement)
  | undefined = undefined;
