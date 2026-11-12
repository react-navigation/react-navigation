import * as React from 'react';
import { Platform } from 'react-native';

type Props = {
  enabled: boolean;
  children: React.ReactNode;
};

/**
 * Makes its content unfocusable on the web when enabled.
 *
 * `aria-hidden` hides the content from assistive technologies, but it doesn't
 * prevent keyboard focus. So the `inert` attribute is needed as well, otherwise
 * focus can move to content that isn't visible.
 */
export function Inert({ enabled, children }: Props) {
  if (Platform.OS === 'web') {
    return (
      <div
        // `inert` is a boolean attribute, so it's the presence that enables it
        // We can't pass a boolean since React 18 doesn't know the attribute
        // and skips boolean values for attributes it doesn't know about
        inert={enabled ? ('inert' as unknown as boolean) : undefined}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 'auto',
        }}
      >
        {children}
      </div>
    );
  }

  return children;
}
