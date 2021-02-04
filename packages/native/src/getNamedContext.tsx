import * as React from 'react';

const contexts = new Map<string, React.Context<any>>();

export default function getNamedContext<T>(
  name: string,
  initialValue: T
): React.Context<T> {
  let context = contexts.get(name);

  if (context) {
    return context;
  }

  context = React.createContext<T>(initialValue);
  context.displayName = name;

  contexts.set(name, context);

  return context;
}
