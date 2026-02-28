import { Activity, useCallback, useEffect, useState } from 'react';
import { Platform, View, type ViewStyle } from 'react-native';

import { Container } from './Container';

export type Props = {
  /**
   * Mode of the activity view
   * - `normal`: The view renders normally
   * - `inert`: Content is not interactive
   * - `paused`: Effects are unmounted and content is not interactive
   */
  mode: 'normal' | 'inert' | 'paused';
  /**
   * Whether the content is visible or not
   */
  visible: boolean;
  /**
   * Delay before hiding content or pausing effects.
   * So pending animations have time to finish.
   *
   * Defaults to 500ms.
   */
  delay?: number;
  /**
   * The style for the container view
   */
  style?: Omit<React.CSSProperties & ViewStyle, 'display'>;
  /**
   * The content of the activity view
   */
  children: React.ReactNode;
};

export function ActivityView({
  mode,
  visible,
  delay = 500,
  style,
  children,
}: Props) {
  const [delayed, setDelayed] = useState({ visible, mode });

  useEffect(() => {
    if (!delay) {
      return;
    }

    const timer = setTimeout(() => {
      setDelayed({ visible, mode });
    }, delay);

    return () => clearTimeout(timer);
  }, [visible, delay, mode]);

  const display = visible || (delay && delayed.visible) ? 'flex' : 'none';
  const activityMode =
    mode !== 'paused' || (delay && delayed.mode !== 'paused')
      ? 'visible'
      : 'hidden';

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
            child.style.display = display;

            const o = new MutationObserver(() => {
              child.style.display = display;
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
    [display]
  );

  return (
    <Container ref={onRef} style={{ display: 'contents' }}>
      <Activity mode={activityMode}>
        <Container inert={mode !== 'normal'} style={{ ...style, display }}>
          {children}
        </Container>
      </Activity>
    </Container>
  );
}
