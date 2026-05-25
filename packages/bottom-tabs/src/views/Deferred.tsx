import * as React from 'react';

type Props = {
  /**
   * Whether lazy rendering is enabled.
   */
  lazy: boolean;
  /**
   * Whether the component is visible.
   */
  visible: boolean;
  /**
   * Content to render.
   */
  children: React.ReactElement;
};

/**
 * Render content lazily based on visibility.
 *
 * When lazy is enabled:
 * - If content is visible, it will render immediately
 * - If content is not visible, it won't render until it becomes visible
 *
 * Otherwise:
 * - If content is visible, it will render immediately
 * - If content is not visible, it will defer rendering
 *
 * Once rendered, the content remains rendered.
 */
export function Deferred({ lazy, visible, children }: Props) {
  const [rendered, setRendered] = React.useState(lazy ? visible : false);

  const shouldRenderDeferred = !(lazy || visible || rendered);

  React.useEffect(() => {
    if (shouldRenderDeferred === false) {
      return;
    }

    React.startTransition(() => {
      setRendered(true);
    });
  }, [shouldRenderDeferred]);

  if (visible && rendered === false) {
    setRendered(true);

    return children;
  }

  if (rendered) {
    return children;
  }

  return null;
}
