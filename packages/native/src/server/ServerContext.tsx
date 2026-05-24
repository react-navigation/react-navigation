import * as React from 'react';

export type ServerContextType = {
  location: URL;
};

export const ServerContext = React.createContext<ServerContextType | undefined>(
  undefined
);
