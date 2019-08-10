import * as React from 'react';

type Props = {
  children: React.ReactNode;
};

const MULTIPLE_NAVIGATOR_ERROR = `Another navigator is already registered for this container. You likely have multiple navigators under a single "NavigationContainer" or "Screen". Make sure each navigator is under a separate "Screen" container.`;

export const SingleNavigatorContext = React.createContext<
  | {
      register(key: string): void;
      unregister(key: string): void;
    }
  | undefined
>(undefined);

/**
 * Component which ensures that there's only one navigator nested under it.
 */
export default function EnsureSingleNavigator({ children }: Props) {
  const [currentKey, setCurrentKey] = React.useState<string | undefined>();
  const value = React.useMemo(
    () => ({
      register(key: string) {
        if (currentKey !== undefined && key !== currentKey) {
          throw new Error(MULTIPLE_NAVIGATOR_ERROR);
        }

        setCurrentKey(key);
      },
      unregister(key: string) {
        if (currentKey !== undefined && key !== currentKey) {
          throw new Error(MULTIPLE_NAVIGATOR_ERROR);
        }

        setCurrentKey(undefined);
      },
    }),
    [currentKey]
  );

  return (
    <SingleNavigatorContext.Provider value={value}>
      {children}
    </SingleNavigatorContext.Provider>
  );
}
