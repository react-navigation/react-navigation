import * as React from 'react';

type Props = {
  enabled: boolean;
  render: () => React.ReactElement;
};

export function Lazy({ enabled, render }: Props) {
  const [rendered, setRendered] = React.useState(enabled);

  React.useLayoutEffect(() => {
    setImmediate(() => {
      if (enabled) {
        setRendered(true);
      }
    });
  }, [enabled]);

  if (rendered) {
    return render();
  }

  return null;
}
