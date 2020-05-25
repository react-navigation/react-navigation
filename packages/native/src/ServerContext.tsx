import * as React from 'react';

export type ServerContextType = {
  location?: {
    pathname: string;
    search: string;
  };
};

const ServerContext = React.createContext<ServerContextType | undefined>(
  undefined
);

export default ServerContext;
