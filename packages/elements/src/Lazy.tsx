import * as React from 'react';

type Props = {
  /**
   * Whether lazy rendering is enabled.
   */
  enabled: boolean;
  /**
   * Whether the component is visible.
   */
  visible: boolean;
  /**
   * Function that returns the content to render.
   */
  render: () => React.ReactElement;
};

/**
 * Render content lazily based on visibility.
 *
 * When enabled:
 * - If content is visible, it will render immediately
 * - If content is not visible, it won't render until it becomes visible
 *
 * Otherwise:
 * - If content is visible, it will render immediately
 * - If content is not visible, it will defer rendering until idle
 *
 * Once rendered, the content remains rendered.
 */
export function Lazy({ enabled, visible, render }: Props) {
  const [rendered, setRendered] = React.useState(enabled ? visible : false);

  React.useEffect(() => {
    if (enabled || visible || rendered) {
      return;
    }

    const id = requestIdleCallback(() => {
      setRendered(true);
    });

    return () => cancelIdleCallback(id);
  }, [enabled, rendered, visible]);

  if (visible && rendered === false) {
    setRendered(true);

    return render();
  }

  if (rendered) {
    return render();
  }

  return null;
}
