import * as React from 'react';

type Props = {
  enabled: boolean;
  render: () => React.ReactElement;
};

export function Lazy({ enabled, render }: Props) {
  const [rendered, setRendered] = React.useState(enabled);

  if (enabled === true && rendered === false) {
    setRendered(true);

    return render();
  }

  if (rendered) {
    return render();
  }

  return null;
}
