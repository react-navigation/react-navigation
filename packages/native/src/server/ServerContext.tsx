import * as React from 'react';

export type ServerContextType = {
  location: URL;
  /**
   * Get the path for the rendered navigation state.
   * This is set by the container with linking enabled during render.
   */
  getPath?: (() => string | undefined) | undefined;
};

export const ServerContext = React.createContext<ServerContextType | undefined>(
  undefined
);
