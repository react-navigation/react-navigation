import * as React from 'react';
import { useTheme } from '@react-navigation/native';
import { WebStackHeaderLeftButtonProps } from '../../types';

type Props = WebStackHeaderLeftButtonProps;

export default function HeaderBackButton({ disabled, onClick, style }: Props) {
  const { colors } = useTheme();

  /* TODO: styling */
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        color: style?.color !== undefined ? style.color : colors.text,
        ...styles.button,
        ...style,
      }}
      onClick={onClick}
    >
      Back
      {/* TODO: SVG image for back button */}
    </button>
  );
}

const styles = {
  button: {},
};
