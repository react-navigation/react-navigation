import * as React from 'react';

const contexts = '__react_navigation__elements_contexts';

declare global {
  var __react_navigation__elements_contexts: Map<string, React.Context<any>>;
}

// We use a global variable to keep our contexts so that we can reuse same contexts across packages
global[contexts] = global[contexts] ?? new Map<string, React.Context<any>>();

export default function getNamedContext<T>(
  name: string,
  initialValue: T
): React.Context<T> {
  let context = global[contexts].get(name);

  if (context) {
    return context;
  }

  context = React.createContext<T>(initialValue);
  context.displayName = name;

  global[contexts].set(name, context);

  return context;
}
