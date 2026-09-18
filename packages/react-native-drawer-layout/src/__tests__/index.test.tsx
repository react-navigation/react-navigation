import 'react-native-gesture-handler/jestSetup';

import { expect, jest, test } from '@jest/globals';
import { act, render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { setUpTests } from 'react-native-reanimated';

import { Drawer } from '../views/Drawer';

setUpTests();

jest.useFakeTimers();

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/src/mock')
);

test("doesn't call 'onClose' when the parent re-renders with the drawer closed", async () => {
  const onClose = jest.fn();
  const onOpen = jest.fn();

  const element = () => (
    <Drawer
      open={false}
      onOpen={() => onOpen()}
      onClose={() => onClose()}
      renderDrawerContent={() => <View />}
    >
      <Text>Content</Text>
    </Drawer>
  );

  const { rerender } = await render(element());

  expect(screen.getByText('Content')).not.toBeNull();

  await rerender(element());
  await rerender(element());

  expect(onOpen).not.toHaveBeenCalled();
  expect(onClose).not.toHaveBeenCalled();
});

test("calls 'onOpen' and 'onClose' when the drawer is toggled", async () => {
  const onOpen = jest.fn();
  const onClose = jest.fn();

  const element = (open: boolean) => (
    <Drawer
      open={open}
      onOpen={() => onOpen()}
      onClose={() => onClose()}
      // Pin the width so the open and closed positions differ
      // regardless of the layout measured in the test environment
      drawerStyle={{ width: 320 }}
      renderDrawerContent={() => <View />}
    >
      <Text>Content</Text>
    </Drawer>
  );

  const { rerender } = await render(element(false));

  expect(onOpen).not.toHaveBeenCalled();

  await rerender(element(true));
  await act(async () => {
    jest.runAllTimers();
  });

  expect(onOpen).toHaveBeenCalledTimes(1);
  expect(onClose).not.toHaveBeenCalled();

  await rerender(element(false));
  await act(async () => {
    jest.runAllTimers();
  });

  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onOpen).toHaveBeenCalledTimes(1);
});
