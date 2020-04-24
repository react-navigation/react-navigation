import * as React from 'react';
import { RouteProp, ParamListBase, useTheme } from '@react-navigation/native';
import HeaderBackButton from './HeaderBackButton';
import {
  WebStackHeaderLeftButtonProps,
  WebStackHeaderTitleProps,
  WebStackHeaderOptions,
  WebStackDescriptor,
} from '../../types';

type Props = WebStackHeaderOptions & {
  headerTitle: (props: WebStackHeaderTitleProps) => React.ReactNode;
  onGoBack?: () => void;
  title?: string;
  route: RouteProp<ParamListBase, string>;
  descriptor: WebStackDescriptor;
};

export default function HeaderSegment(props: Props) {
  const {
    title: currentTitle,
    onGoBack,
    headerTitle,
    headerLeft: left = onGoBack
      ? (props: WebStackHeaderLeftButtonProps) => (
          <HeaderBackButton {...props} />
        )
      : undefined,
    headerTintColor,
    headerRight: right,
    headerTitleStyle,
    headerStyle,
  } = props;

  const { colors } = useTheme();

  const leftButton = left
    ? left({
        onClick: onGoBack,
        canGoBack: Boolean(onGoBack),
      })
    : null;

  return (
    <div
      style={{
        backgroundColor: colors.card,
        borderBottomColor: colors.border,
        ...styles.header,
        ...headerStyle,
      }}
    >
      {leftButton}
      {headerTitle({
        children: currentTitle,
        style: { marginLeft: 18, marginRight: 16, ...headerTitleStyle },
      })}
      {right ? right({ tintColor: headerTintColor }) : null}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
};
