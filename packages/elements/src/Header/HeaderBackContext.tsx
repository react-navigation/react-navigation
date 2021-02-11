import getNamedContext from '../getNamedContext';

const HeaderBackContext = getNamedContext<{ title: string } | undefined>(
  'HeaderBackContext',
  undefined
);

export default HeaderBackContext;
