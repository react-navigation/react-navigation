import * as React from 'react';

import { ServerContext } from './ServerContext';

export type ServerContainerProps = {
  location: URL;
  children: React.ReactNode;
};

/**
 * Provider for request-scoped server navigation state.
 */
export function ServerContainer({ location, children }: ServerContainerProps) {
  const value = React.useMemo(() => ({ location }), [location]);

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
}
