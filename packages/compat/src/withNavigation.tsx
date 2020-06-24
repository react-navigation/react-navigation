import * as React from 'react';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import useCompatNavigation from './useCompatNavigation';
import type { CompatNavigationProp } from './types';

type InjectedProps<T extends NavigationProp<ParamListBase>> = {
  navigation: CompatNavigationProp<T>;
};

export default function withNavigation<
  T extends NavigationProp<ParamListBase>,
  P extends InjectedProps<T>,
  C extends React.ComponentType<P>
>(Comp: C) {
  const WrappedComponent = ({
    onRef,
    ...rest
  }: Exclude<P, InjectedProps<T>> & {
    onRef?: C extends React.ComponentClass<any>
      ? React.Ref<InstanceType<C>>
      : never;
  }): React.ReactElement => {
    const navigation = useCompatNavigation<T>();

    // @ts-expect-error: type checking HOC is hard
    return <Comp ref={onRef} navigation={navigation} {...rest} />;
  };

  WrappedComponent.displayName = `withNavigation(${
    Comp.displayName || Comp.name
  })`;

  return WrappedComponent;
}
