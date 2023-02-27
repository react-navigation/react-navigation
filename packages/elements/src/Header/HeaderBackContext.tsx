import { getNamedContext } from '../getNamedContext';

export const HeaderBackContext = getNamedContext<{ title: string } | undefined>(
  'HeaderBackContext',
  undefined
);
