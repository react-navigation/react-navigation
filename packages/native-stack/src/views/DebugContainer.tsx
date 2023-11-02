import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import type { StackPresentationTypes } from 'react-native-screens';

type ContainerProps = ViewProps & {
  stackPresentation: StackPresentationTypes;
  children: React.ReactNode;
};

export function DebugContainer(props: ContainerProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { stackPresentation: _, ...rest } = props;
  return <View {...rest} />;
}
