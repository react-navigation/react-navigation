export { default as Header } from './Header/Header';
export { default as HeaderBackground } from './Header/HeaderBackground';
export { default as HeaderTitle } from './Header/HeaderTitle';
export { default as HeaderBackButton } from './Header/HeaderBackButton';
export { default as HeaderBackContext } from './Header/HeaderBackContext';
export { default as HeaderShownContext } from './Header/HeaderShownContext';
export { default as HeaderHeightContext } from './Header/HeaderHeightContext';
export { default as useHeaderHeight } from './Header/useHeaderHeight';
export { default as getDefaultHeaderHeight } from './Header/getDefaultHeaderHeight';
export { default as getHeaderTitle } from './Header/getHeaderTitle';

export { default as MissingIcon } from './MissingIcon';
export { default as PlatformPressable } from './PlatformPressable';
export { default as ResourceSavingView } from './ResourceSavingView';
export { default as SafeAreaProviderCompat } from './SafeAreaProviderCompat';
export { default as Screen } from './Screen';
export { default as Background } from './Background';

export const Assets = [
  // eslint-disable-next-line import/no-commonjs
  require('./assets/back-icon.png'),
  // eslint-disable-next-line import/no-commonjs
  require('./assets/back-icon-mask.png'),
];

export * from './types';
