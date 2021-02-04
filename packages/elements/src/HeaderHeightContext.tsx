import { getNamedContext } from '@react-navigation/native';

const HeaderHeightContext = getNamedContext<number | undefined>(
  'HeaderHeightContext',
  undefined
);

export default HeaderHeightContext;
