import * as React from 'react';
import ServerContext, { ServerContextType } from './ServerContext';

type Props = ServerContextType & {
  children: React.ReactNode;
};

/**
 * Container component for server rendering.
 *
 * @param props.location Location object to base the initial URL for SSR.
 * @param props.children Child elements to render the content.
 */
export default function ServerContainer({ location, children }: Props) {
  return (
    <ServerContext.Provider value={{ location }}>
      {children}
    </ServerContext.Provider>
  );
}
