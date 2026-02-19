import {
  type HostComponent,
  NativeComponentRegistry,
  type ViewProps,
} from 'react-native';

const STYLE: Record<string, true | { process?: (arg1: any) => any }> = {
  display: {
    process: (value: string) => {
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
  uiViewClassName: 'ReactNavigationView',
  validAttributes: {
    style: STYLE,
  },
};

export const ReactNavigationView: HostComponent<ViewProps> =
  NativeComponentRegistry.get<ViewProps>(
    'ReactNavigationView',
    () => VIEW_CONFIG
  );
