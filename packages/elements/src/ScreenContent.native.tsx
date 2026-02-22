import { Activity, memo } from 'react';
import {
  type HostComponent,
  NativeComponentRegistry,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { Container } from './Container';

type Props = {
  visible: boolean;
  active: boolean;
  style?: React.CSSProperties & ViewStyle;
  children: React.ReactNode;
};

function ScreenContentInner({ visible, active, style, children }: Props) {
  return (
    <Container inert={!active} style={style}>
      <Activity mode={active ? 'visible' : 'hidden'}>
        <ScreenContentView
          collapsable={false}
          style={{ display: visible ? 'contents' : 'hidden' }}
        >
          {children}
        </ScreenContentView>
      </Activity>
    </Container>
  );
}

export const ScreenContent = memo(ScreenContentInner);

const STYLE: Record<string, true | { process?: (arg1: any) => any }> = {
  display: {
    process: (value) => {
      /**
       * React `Activity` sets `display: 'none'` when `mode="hidden"` to unmount effects
       * But we want to keep the content visible, so we switch it to `display: 'contents'`
       * To also support hiding the content, we add a custom value `hidden` which is switched to `display: 'none'`
       */
      switch (value) {
        case 'hidden':
          return 'none';
        default:
          // Since this view doesn't accept any styles
          // Use display: contents to make sure it doesn't interfere with the layout
          return 'contents';
      }
    },
  },
};

const VIEW_CONFIG = {
  uiViewClassName: 'RCTView',
  validAttributes: {
    style: STYLE,
  },
};

type ScreenContentViewProps = Omit<ViewProps, 'style'> & {
  style: {
    display: 'hidden' | 'contents';
  };
};

const ScreenContentView: HostComponent<ScreenContentViewProps> =
  NativeComponentRegistry.get<ScreenContentViewProps>(
    'ReactNavigationScreenContentView',
    () => VIEW_CONFIG
  );
