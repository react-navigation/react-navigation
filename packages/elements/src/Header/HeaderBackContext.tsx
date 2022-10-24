import { getNamedContext } from '../getNamedContext';

export const HeaderBackContext = getNamedContext<
  { title: string; href?: string } | undefined
>('HeaderBackContext', undefined);
