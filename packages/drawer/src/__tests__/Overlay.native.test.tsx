import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { setUpTests } from 'react-native-reanimated';

// eslint-disable-next-line import-x/no-relative-packages
import { Overlay } from '../../../react-native-drawer-layout/src/views/Overlay.native';

setUpTests();

afterEach(() => {
  jest.restoreAllMocks();
});

const createProgress = (value: number): SharedValue<number> => ({
  value,
  get: () => value,
  set: () => {},
  addListener: () => {},
  removeListener: () => {},
  modify: () => {},
});

describe('Overlay accessibility on iOS', () => {
  test('hides overlay from accessibility when drawer is closed (progress = 0)', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    await render(
      <Overlay
        open={false}
        progress={createProgress(0)}
        onPress={() => {}}
        accessibilityLabel="Close drawer"
      />
    );

    expect(screen.queryByLabelText('Close drawer')).toBeNull();

    const hiddenButton = screen.getByLabelText('Close drawer', {
      includeHiddenElements: true,
    });
    expect(hiddenButton.parent?.props.accessibilityElementsHidden).toBe(true);
  });

  test('hides overlay at threshold boundary (progress = 0.05)', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    await render(
      <Overlay
        open={false}
        progress={createProgress(0.05)}
        onPress={() => {}}
        accessibilityLabel="Close drawer"
      />
    );

    expect(screen.queryByLabelText('Close drawer')).toBeNull();

    const hiddenButton = screen.getByLabelText('Close drawer', {
      includeHiddenElements: true,
    });
    expect(hiddenButton.parent?.props.accessibilityElementsHidden).toBe(true);
  });

  test('shows overlay when opening just above threshold (progress = 0.06)', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    await render(
      <Overlay
        open={true}
        progress={createProgress(0.06)}
        onPress={() => {}}
        accessibilityLabel="Close drawer"
      />
    );

    const button = screen.getByLabelText('Close drawer');
    expect(button).toBeDefined();
    expect(button.parent?.props.accessibilityElementsHidden).toBe(false);
  });

  test('shows overlay when fully open (progress = 1)', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');

    await render(
      <Overlay
        open={true}
        progress={createProgress(1)}
        onPress={() => {}}
        accessibilityLabel="Close drawer"
      />
    );

    const button = screen.getByLabelText('Close drawer');
    expect(button).toBeDefined();
    expect(button.parent?.props.accessibilityElementsHidden).toBe(false);
  });
});

describe('Overlay accessibility on Android', () => {
  test('hides overlay from accessibility when drawer is closed (progress = 0)', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    await render(
      <Overlay
        open={false}
        progress={createProgress(0)}
        onPress={() => {}}
        accessibilityLabel="Close drawer"
      />
    );

    expect(screen.queryByLabelText('Close drawer')).toBeNull();

    const hiddenButton = screen.getByLabelText('Close drawer', {
      includeHiddenElements: true,
    });
    expect(hiddenButton.parent?.props.importantForAccessibility).toBe(
      'no-hide-descendants'
    );
  });

  test('hides overlay at threshold boundary (progress = 0.05)', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    await render(
      <Overlay
        open={false}
        progress={createProgress(0.05)}
        onPress={() => {}}
        accessibilityLabel="Close drawer"
      />
    );

    expect(screen.queryByLabelText('Close drawer')).toBeNull();

    const hiddenButton = screen.getByLabelText('Close drawer', {
      includeHiddenElements: true,
    });
    expect(hiddenButton.parent?.props.importantForAccessibility).toBe(
      'no-hide-descendants'
    );
  });

  test('shows overlay when opening just above threshold (progress = 0.06)', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    await render(
      <Overlay
        open={true}
        progress={createProgress(0.06)}
        onPress={() => {}}
        accessibilityLabel="Close drawer"
      />
    );

    const button = screen.getByLabelText('Close drawer');
    expect(button).toBeDefined();
    expect(button.parent?.props.importantForAccessibility).toBe('auto');
  });

  test('shows overlay when fully open (progress = 1)', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    await render(
      <Overlay
        open={true}
        progress={createProgress(1)}
        onPress={() => {}}
        accessibilityLabel="Close drawer"
      />
    );

    const button = screen.getByLabelText('Close drawer');
    expect(button).toBeDefined();
    expect(button.parent?.props.importantForAccessibility).toBe('auto');
  });
});
