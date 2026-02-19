type Props = {
  children: React.ReactNode;
  collapsable: false;
  style: {
    display: 'contents' | 'hidden';
  };
};

export function ReactNavigationView(_: Props): React.JSX.Element {
  throw new Error('ReactNavigationView is only supported on Android and iOS.');
}
