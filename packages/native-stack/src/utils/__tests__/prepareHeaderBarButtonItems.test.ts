import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Image } from 'react-native';

import { prepareHeaderBarButtonItems } from '../prepareHeaderBarButtonItems';

jest.mock('react-native', () => ({
  processColor: jest.fn((color) => `processed(${color})`),
  Image: {
    resolveAssetSource: jest.fn((img) => ({ uri: `resolved:${img}` })),
  },
}));

type BarButtonItem = ReturnType<typeof prepareHeaderBarButtonItems>[number];

function isSpacing(item: BarButtonItem): item is { spacing: number } {
  return 'spacing' in item;
}

function hasButtonId(
  item: BarButtonItem
): item is Exclude<BarButtonItem, { spacing: number }> & { buttonId: string } {
  return !isSpacing(item) && typeof (item as any).buttonId === 'string';
}

function hasMenu(
  item: BarButtonItem
): item is Exclude<BarButtonItem, { spacing: number }> & { menu: any } {
  return !isSpacing(item) && typeof (item as any).menu === 'object';
}

describe('prepareHeaderBarButtonItems', () => {
  const routeKey = 'route-key';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('processes a plain button', () => {
    const items = [{ title: 'Test', onPress: jest.fn() }];
    const result = prepareHeaderBarButtonItems(items, routeKey);
    const btn = result.find(hasButtonId)!;
    expect(btn.title).toBe('Test');
    expect(btn.buttonId).toContain('Test-0-route-key');
  });

  test('processes an icon button', () => {
    const items = [
      { image: 123, onPress: jest.fn() }, // image as number
    ];
    const result = prepareHeaderBarButtonItems(items, routeKey);
    const btn = result.find(hasButtonId)!;
    expect(Image.resolveAssetSource).toHaveBeenCalledWith(123);
    expect(btn.image).toEqual({ uri: 'resolved:123' });
    expect(btn.buttonId).toContain('123-0-route-key');
  });

  test('processes a button with titleStyle and tintColor', () => {
    const items = [
      {
        title: 'Styled',
        onPress: jest.fn(),
        titleStyle: { color: 'red', fontSize: 16 },
        tintColor: 'blue',
      },
    ];
    const result = prepareHeaderBarButtonItems(items, routeKey);
    const btn = result.find(hasButtonId)!;
    expect(btn.titleStyle).toEqual({ color: 'processed(red)', fontSize: 16 });
    expect(btn.tintColor).toBe('processed(blue)');
  });

  test('processes a button with badge', () => {
    const items = [
      {
        title: 'Badge',
        onPress: jest.fn(),
        badge: { value: '1', color: 'white', backgroundColor: 'red' },
      },
    ];
    const result = prepareHeaderBarButtonItems(items, routeKey);
    const btn = result.find(hasButtonId)!;
    expect(btn.badge).toEqual({
      value: '1',
      color: 'processed(white)',
      backgroundColor: 'processed(red)',
    });
  });

  test('passes through spacing item', () => {
    const items = [{ spacing: 24 }];
    const result = prepareHeaderBarButtonItems(items, routeKey);
    expect(result[0]).toEqual({ spacing: 24 });
  });

  test('processes a button with a menu and submenu', () => {
    const items = [
      {
        title: 'Menu',
        menu: {
          title: 'Main Menu',
          items: [
            {
              title: 'Action 1',
              onPress: jest.fn(),
            },
            {
              title: 'Submenu',
              items: [{ title: 'Sub Action 1', onPress: jest.fn() }],
            },
          ],
        },
      },
    ];
    const result = prepareHeaderBarButtonItems(items, routeKey);
    const btn = result.find(hasMenu)!;
    expect(btn.menu.title).toBe('Main Menu');
    expect(btn.menu.items[0]?.menuId).toContain('Action 1-0-0-route-key');
    expect(btn.menu.items[1]?.items[0]?.menuId).toContain(
      'Sub Action 1-0-1-route-key'
    );
  });
});
