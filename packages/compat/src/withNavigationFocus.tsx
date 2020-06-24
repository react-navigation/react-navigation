import * as React from 'react';
import { useIsFocused } from '@react-navigation/native';

type InjectedProps = {
  isFocused: boolean;
};

export default function withNavigationFocus<
  P extends InjectedProps,
  C extends React.ComponentType<P>
>(Comp: C) {
  const WrappedComponent = ({
    onRef,
    ...rest
  }: Exclude<P, InjectedProps> & {
    onRef?: C extends React.ComponentClass<any>
      ? React.Ref<InstanceType<C>>
      : never;
  }): React.ReactElement => {
    const isFocused = useIsFocused();

    // @ts-expect-error: type checking HOC is hard
    return <Comp ref={onRef} isFocused={isFocused} {...rest} />;
  };

  WrappedComponent.displayName = `withNavigationFocus(${
    Comp.displayName || Comp.name
  })`;

  return WrappedComponent;
}
