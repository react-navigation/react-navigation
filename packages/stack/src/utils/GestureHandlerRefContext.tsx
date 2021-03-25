import * as React from 'react';

export default React.createContext<React.Ref<
  import('react-native-gesture-handler').PanGestureHandler
> | null>(null);
