import * as React from 'react';
import type { SheetCommands } from 'react-native-screens';

export const FormSheetContext = React.createContext<
  React.RefObject<SheetCommands | null> | undefined
>(undefined);

export function useFormSheet(): {
  /**
   * Animate the sheet to the detent at the given index of `sheetAllowedDetents`.
   * Pass `'last'` to animate to the largest detent.
   */
  selectDetent: (index: number | 'last') => void;
} {
  const ref = React.use(FormSheetContext);

  if (ref === undefined) {
    throw new Error(
      "Couldn't find the form sheet. Are you inside a screen in a native stack navigator?"
    );
  }

  // The sheet is only attached on native platforms
  // So we look up the ref when a method is called instead of returning it directly
  return React.useMemo(
    () => ({
      selectDetent: (index: number | 'last') =>
        ref.current?.selectDetent(index),
    }),
    [ref]
  );
}
