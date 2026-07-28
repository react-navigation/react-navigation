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

// eslint-disable-next-line @eslint-react/hooks-extra/no-unnecessary-use-prefix, @eslint-react/hooks-extra/ensure-custom-hooks-using-other-hooks
export function useHeaderConfig({
  headerLeftElement,
}: HeaderConfigOptions): HeaderConfigResult {
  return {
    platformConfig: {},
    usesHeaderLeftElement: headerLeftElement != null,
    headerBackgroundMode: 'screen',
  };
}
