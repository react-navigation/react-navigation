import * as React from 'react';

import type { PagerViewAdapterProps } from './PagerViewAdapter';
import {
  PanResponderAdapter,
  type PanResponderAdapterProps,
} from './PanResponderAdapter';

export type DefaultAdapterProps = PagerViewAdapterProps &
  PanResponderAdapterProps;

export const DefaultAdapter: React.ComponentType<DefaultAdapterProps> =
  PanResponderAdapter;
