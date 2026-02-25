import { Activity } from 'react';
import {
  type HostComponent,
  NativeComponentRegistry,
  View,
  type ViewProps,
} from 'react-native';

// eslint-disable-next-line import-x/extensions
import type { Props } from './ActivityView.tsx';
import { Container } from './Container';

export function ActivityView({ mode, visible, style, children }: Props) {
  return (
    <Container inert={mode !== 'normal'} style={style}>
      <Activity mode={mode === 'paused' ? 'hidden' : 'visible'}>
        <ActivityContentView style={{ display: 'contents' }}>
          <View
            style={{
              /**
               * The visibility of the nested view is controlled by `Activity`
               * It'll be overridden to `display: 'none'` when `mode="hidden"` regardless of what we set
               * So we set the visibility on another view instead
               */
              display: visible ? 'contents' : 'none',
            }}
          >
            {children}
          </View>
        </ActivityContentView>
      </Activity>
    </Container>
  );
}

const STYLE: Record<string, true | { process?: (arg1: any) => any }> = {
  display: {
    /**
     * React `Activity` sets `display: 'none'` when `mode="hidden"` to unmount effects
     * But we want to keep the content visible, so we switch it to `display: 'contents'`
     */
    process: () => 'contents',
  },
};

const VIEW_CONFIG = {
  uiViewClassName: 'RCTView',
  validAttributes: {
    style: STYLE,
  },
};

type ActivityContentViewProps = Omit<ViewProps, 'style'> & {
  style?: {
    display?: 'contents';
  };
};

const ActivityContentView: HostComponent<ActivityContentViewProps> =
  NativeComponentRegistry.get<ActivityContentViewProps>(
    'ReactNavigationActivityContentView',
    () => VIEW_CONFIG
  );
