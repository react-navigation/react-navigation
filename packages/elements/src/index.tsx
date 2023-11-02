export { Background } from './Background';
export { Button } from './Button';
export { getDefaultSidebarWidth } from './getDefaultSidebarWidth';
export { getDefaultHeaderHeight } from './Header/getDefaultHeaderHeight';
export { getHeaderTitle } from './Header/getHeaderTitle';
export { Header } from './Header/Header';
export { HeaderBackButton } from './Header/HeaderBackButton';
export { HeaderBackContext } from './Header/HeaderBackContext';
export { HeaderBackground } from './Header/HeaderBackground';
export { HeaderHeightContext } from './Header/HeaderHeightContext';
export { HeaderShownContext } from './Header/HeaderShownContext';
export { HeaderTitle } from './Header/HeaderTitle';
export { useHeaderHeight } from './Header/useHeaderHeight';
export { getLabel } from './Label/getLabel';
export { Label } from './Label/Label';
export { MissingIcon } from './MissingIcon';
export { PlatformPressable } from './PlatformPressable';
export { ResourceSavingView } from './ResourceSavingView';
export { SafeAreaProviderCompat } from './SafeAreaProviderCompat';
export { Screen } from './Screen';
export { Text } from './Text';

export const Assets = [
  // eslint-disable-next-line import/no-commonjs
  require('./assets/back-icon.png'),
  // eslint-disable-next-line import/no-commonjs
  require('./assets/back-icon-mask.png'),
];

export * from './types';
