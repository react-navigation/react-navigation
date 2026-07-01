import * as React from 'react';

export const GestureHandlerContext = React.createContext<
  import('react-native-gesture-handler').PanGesture | null
>(null);
