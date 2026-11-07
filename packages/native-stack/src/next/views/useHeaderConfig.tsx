import type * as React from 'react';
import type { ColorValue } from 'react-native';
import type {
  StackHeaderConfigProps,
  StackHeaderConfigRef,
} from 'react-native-screens';

import type { NativeStackNavigationOptions } from '../../types';

export type HeaderConfigOptions = {
  options: NativeStackNavigationOptions;
  hasCustomHeader: boolean;
  headerLeftElement: React.ReactNode;
  headerRightElement: React.ReactNode;
  headerTitleElement: React.ReactNode;
  headerTitleText: string;
  canGoBack: boolean;
  tintColor: ColorValue;
};

export type HeaderConfigResult = {
  platformConfig: Pick<StackHeaderConfigProps, 'android' | 'ios'>;
  headerConfigRef?: React.RefObject<StackHeaderConfigRef | null> | undefined;
  usesHeaderLeftElement: boolean;
  headerBackgroundMode: 'native' | 'screen' | 'none';
};

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export function useHeaderConfig({
  headerLeftElement,
}: HeaderConfigOptions): HeaderConfigResult {
  return {
    platformConfig: {},
    usesHeaderLeftElement: headerLeftElement != null,
    headerBackgroundMode: 'screen',
  };
}
