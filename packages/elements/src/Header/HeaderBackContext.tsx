import getNamedContext from '../getNamedContext';

const HeaderBackContext = getNamedContext<
  { title: string; path?: string } | undefined
>('HeaderBackContext', undefined);

export default HeaderBackContext;
