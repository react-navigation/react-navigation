// eslint-disable-next-line import-x/extensions
import type { LayoutInsetProps } from './LayoutInset.tsx';
import ReactNavigationLayoutInsetViewNativeComponent from './ReactNavigationLayoutInsetViewNativeComponent';

export function LayoutInset(props: LayoutInsetProps) {
  return <ReactNavigationLayoutInsetViewNativeComponent {...props} />;
}
