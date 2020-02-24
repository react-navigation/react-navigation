import * as React from 'react';

type Props = {
  maskElement: React.ReactElement;
  children: React.ReactElement;
};

export default function MaskedView({ children }: Props) {
  return children;
}
