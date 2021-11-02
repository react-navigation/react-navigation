import * as React from 'react';
import { Platform, View, ViewProps } from 'react-native';
// @ts-ignore Getting private component
import AppContainer from 'react-native/Libraries/ReactNative/AppContainer';
import type { StackPresentationTypes } from 'react-native-screens';

type ContainerProps = ViewProps & {
  stackPresentation: StackPresentationTypes;
  children: React.ReactNode;
};

let Container = View as unknown as React.ComponentType<ContainerProps>;

if (process.env.NODE_ENV !== 'production') {
  const DebugContainer = (props: ContainerProps) => {
    const { stackPresentation, ...rest } = props;

    if (Platform.OS === 'ios' && stackPresentation !== 'push') {
      // This is necessary for LogBox
      return (
        <AppContainer>
          <View {...rest} />
        </AppContainer>
      );
    }

    return <View {...rest} />;
  };

  Container = DebugContainer;
}

export default Container;
