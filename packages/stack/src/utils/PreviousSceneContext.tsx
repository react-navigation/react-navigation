import * as React from 'react';
import type { Scene } from '../types';

const PreviousSceneContext = React.createContext<Scene | undefined>(undefined);

export default PreviousSceneContext;
