/* eslint-env jest */

jest.mock('react-native-gesture-handler/DrawerLayout', () => {
  const React = require('react');
  const View = require.requireActual('View');
  const DrawerLayout = React.forwardRef((props, ref) => (
    <View {...props} ref={ref} />
  ));

  DrawerLayout.positions = {
    Left: 'left',
    Right: 'right',
  };

  return DrawerLayout;
});
