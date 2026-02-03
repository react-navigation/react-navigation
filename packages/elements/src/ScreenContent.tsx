import { Activity, memo } from 'react';
import { type ViewStyle } from 'react-native';

import { Container } from './Container';

type Props = {
  visible: boolean;
  active: boolean;
  style?: React.CSSProperties & ViewStyle;
  children: React.ReactNode;
};

function ScreenContentInner({ visible, active, style, children }: Props) {
  return (
    <Activity mode={visible ? 'visible' : 'hidden'}>
      <Container inert={!active} style={style}>
        {children}
      </Container>
    </Activity>
  );
}

export const ScreenContent = memo(ScreenContentInner);
