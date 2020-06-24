import * as React from 'react';
import type { Route } from '@react-navigation/native';
import type { Scene } from '../types';

const PreviousSceneContext = React.createContext<
  Scene<Route<string>> | undefined
>(undefined);

export default PreviousSceneContext;
