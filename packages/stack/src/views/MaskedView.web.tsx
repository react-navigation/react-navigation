import * as React from 'react';

type Props = {
  children: React.ReactElement;
};

export default function MaskedView({ children }: Props) {
  return children;
}
