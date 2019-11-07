import * as React from 'react';
import { CardInterpolationProps } from '../types';

export default React.createContext<CardInterpolationProps | undefined>(
  undefined
);
