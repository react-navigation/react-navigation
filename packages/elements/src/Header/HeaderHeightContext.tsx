import getNamedContext from '../getNamedContext';

const HeaderHeightContext = getNamedContext<number | undefined>(
  'HeaderHeightContext',
  undefined
);

export default HeaderHeightContext;
