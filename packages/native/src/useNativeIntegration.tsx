import * as React from 'react';
import { NavigationHelpers, ParamListBase } from '@navigation-ex/core';
import useBackButton from './useBackButton';

export default function useNativeIntegration(
  ref: React.RefObject<NavigationHelpers<ParamListBase>>
) {
  useBackButton(ref);
}
