/**
 * Use a stub for MaskedView on all Platforms that don't support it.
 */
import type * as React from 'react';

type Props = {
  maskElement: React.ReactElement;
  children: React.ReactElement;
};

export default function MaskedView({ children }: Props) {
  return children;
}
