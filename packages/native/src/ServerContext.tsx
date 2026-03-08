import * as React from 'react';

export type ServerContextType = {
  location?:
    | {
        pathname: string;
        search: string;
      }
    | undefined;
};

export const ServerContext = React.createContext<ServerContextType | undefined>(
  undefined
);
