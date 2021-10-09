import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Platform } from 'react-native';

import DrawerItem from '../../views/DrawerItem';

let originalPlatformOS: typeof Platform.OS;

beforeEach(() => {
  originalPlatformOS = Platform.OS;
});

afterEach(() => {
  Platform.OS = originalPlatformOS;
});

it('passes accessibilityState={{ selected: true }} to PlatformPressable from focused DrawerItem', () => {
  Platform.OS = 'android';

  let { getByRole } = render(
    <DrawerItem label="Some label" to="Some to" onPress={() => {}} focused />
  );

  expect(getByRole('button').props.accessibilityState).toBeDefined();
  expect(getByRole('button').props.accessibilityState).toEqual({
    selected: true,
  });
});

it('passes accessibilityState={{ selected: false }} to PlatformPressable from non-focused DrawerItem', () => {
  Platform.OS = 'android';

  let { getByRole } = render(
    <DrawerItem label="Some label" to="Some to" onPress={() => {}} />
  );

  expect(getByRole('button').props.accessibilityState).toBeDefined();
  expect(getByRole('button').props.accessibilityState).toEqual({
    selected: false,
  });
});

it('does not pass accessibilityState to Link (on web platform with `to` property)', () => {
  Platform.OS = 'web';

  const { getByRole } = render(
    <DrawerItem label="Some label" to="Some to" onPress={() => {}} />
  );

  expect(getByRole('link').props.accessibilityState).not.toBeDefined();
});
