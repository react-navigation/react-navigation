import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { type ReactNode } from 'react';
import { type NativeSyntheticEvent, View } from 'react-native';
import ViewPager from 'react-native-pager-view';
import type { NativeProps } from 'react-native-pager-view/lib/typescript/specs/PagerViewNativeComponent';

import { PagerViewAdapter } from '../PagerViewAdapter';

// Mock the Animated ViewPager component
jest.mock('react-native-pager-view', () => {
  const MockViewPager = jest.fn().mockImplementation((({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: any;
  }) => {
    return (
      <div {...props} data-testid="mocked-viewpager">
        {children}
      </div>
    );
  }) as any);

  return MockViewPager;
});

test('passes onPageSelected prop to ViewPager', () => {
  const onIndexChangeMock = jest.fn();
  const onPageSelectedMock = jest.fn();

  const navigationState = {
    index: 0,
    routes: [
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
    ],
  };

  // Render the PagerViewAdapter with the onPageSelected prop
  render(
    <PagerViewAdapter
      navigationState={navigationState}
      onIndexChange={onIndexChangeMock}
      onPageSelected={onPageSelectedMock as NativeProps['onPageSelected']}
    >
      {({ render }) => {
        // The PagerViewAdapter expects a ReactElement to be returned from its children function
        return (
          <View>{render([<View key="first" />, <View key="second" />])}</View>
        );
      }}
    </PagerViewAdapter>
  );

  // Verify the ViewPager was created with our onPageSelected prop
  expect(ViewPager).toHaveBeenCalledWith(
    expect.objectContaining({
      onPageSelected: expect.any(Function),
    }),
    expect.anything()
  );

  // Get the onPageSelected handler that was passed to ViewPager
  const viewPagerProps = (ViewPager as unknown as jest.Mock).mock
    .calls[0][0] as {
    onPageSelected: NativeProps['onPageSelected'];
  };
  const viewPagerPageSelectedHandler = viewPagerProps.onPageSelected;

  // Simulate a page selected event
  const mockEvent = {
    nativeEvent: {
      position: 1,
    },
  };
  viewPagerPageSelectedHandler?.(
    mockEvent as unknown as NativeSyntheticEvent<Readonly<{ position: number }>>
  );

  // Verify both handlers were called
  expect(onIndexChangeMock).toHaveBeenCalledWith(1);
  expect(onPageSelectedMock).toHaveBeenCalledWith(mockEvent);
});
