import * as React from 'react';
import { useTheme } from '@react-navigation/native';

type Props = JSX.IntrinsicElements['h1'];

export default function HeaderTitle({ style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <h1
      {...rest}
      style={{
        color: style?.color === undefined ? colors.text : style?.color,
        ...styles.title,
        ...style,
      }}
    />
  );
}

const styles = {
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
};
