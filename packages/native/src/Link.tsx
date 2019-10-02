import * as React from 'react';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/core';
import { Text, TextProps } from 'react-native';

type TouchableProps = {
  accessibilityRole?: 'link';
  onPress?: () => void;
};

type Props<
  Navigation extends NavigationProp<ParamListBase>,
  ParamList extends ParamListBase = Navigation extends NavigationProp<infer P>
    ? P
    : {},
  RouteName extends keyof ParamList = keyof ParamList
> = {
  to: Extract<RouteName, string>;
} & (
  | (TextProps & { children: React.ReactNode })
  | { children: (props: TouchableProps) => React.ReactNode }
) &
  (ParamList[RouteName] extends undefined | any
    ? { params?: ParamList[RouteName] }
    : { params: ParamList[RouteName] });

export default function Link<Navigation extends NavigationProp<ParamListBase>>({
  to,
  params,
  children,
  ...rest
}: Props<Navigation>) {
  const navigation = useNavigation<Navigation>();
  const onPress = () => {
    navigation.navigate(to, params);
  };

  const props = {
    onPress,
    accessibilityRole: 'link' as const,
    ...rest,
  };

  if (typeof children === 'function') {
    return children(props);
  }

  return <Text {...props}>{children}</Text>;
}
