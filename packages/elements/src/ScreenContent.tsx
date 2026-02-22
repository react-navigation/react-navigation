import { Activity, memo, useCallback } from 'react';
import { Platform, View, type ViewStyle } from 'react-native';

import { Container } from './Container';

type Props = {
  visible: boolean;
  active: boolean;
  style?: React.CSSProperties & ViewStyle;
  children: React.ReactNode;
};

function ScreenContentInner({ visible, active, style, children }: Props) {
  /**
   * Activity has 2 modes, visible and hidden - hidden unmounts effects
   * But what we want is to unmount effects, without hiding content
   * So we use hidden mode, but unset display: none to make content visible
   */
  const onRef = useCallback(
    (node: HTMLDivElement | View | null) => {
      if (Platform.OS !== 'web' || !(node && node instanceof HTMLElement)) {
        return;
      }

      const observers: MutationObserver[] = [];

      const observe = () => {
        // Remove previous observers
        observers.forEach((o) => o.disconnect());
        observers.length = 0;

        const children = node.childNodes;

        // When the style attribute for children is updated by React
        // We observe it and update display to make content visible
        children.forEach((child) => {
          if (child instanceof HTMLElement) {
            const o = new MutationObserver(() => {
              child.style.display = visible ? 'flex' : 'none';
            });

            o.observe(child, {
              attributes: true,
              attributeFilter: ['style'],
            });

            observers.push(o);
          }
        });
      };

      observe();

      // React removes refs when `Activity` is hidden
      // So we render outside of the `Activity` and observer child list
      const observer = new MutationObserver(observe);

      observer.observe(node, {
        childList: true,
      });

      return () => {
        observer.disconnect();
        observers.forEach((o) => o.disconnect());
      };
    },
    [visible]
  );

  return (
    <Container ref={onRef} inert={!active} style={style}>
      <Activity mode={active ? 'visible' : 'hidden'}>{children}</Activity>
    </Container>
  );
}

export const ScreenContent = memo(ScreenContentInner);
