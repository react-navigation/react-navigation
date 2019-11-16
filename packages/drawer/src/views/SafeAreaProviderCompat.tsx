import * as React from 'react';
import {
  SafeAreaProvider,
  SafeAreaConsumer,
} from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
};

export default function SafeAreaProviderCompat({ children }: Props) {
  return (
    <SafeAreaConsumer>
      {insets => {
        if (insets) {
          // If we already have insets, don't wrap the stack in another safe area provider
          // This avoids an issue with updates at the cost of potentially incorrect values
          // https://github.com/react-navigation/navigation-ex/issues/174
          return children;
        }

        return <SafeAreaProvider>{children}</SafeAreaProvider>;
      }}
    </SafeAreaConsumer>
  );
}
