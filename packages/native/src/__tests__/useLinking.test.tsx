import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/core';
import { render } from 'react-native-testing-library';
import useLinking from '../useLinking';

it('throws if multiple instances of useLinking are used', () => {
  const ref = React.createRef<NavigationContainerRef>();

  const options = { prefixes: [] };

  function Sample() {
    useLinking(ref, options);
    useLinking(ref, options);
    return null;
  }

  let element;

  expect(() => (element = render(<Sample />))).toThrowError(
    'Looks like you have configured linking in multiple places.'
  );

  // @ts-ignore
  element?.unmount();

  function A() {
    useLinking(ref, options);
    return null;
  }

  function B() {
    useLinking(ref, options);
    return null;
  }

  expect(
    () =>
      (element = render(
        <>
          <A />
          <B />
        </>
      ))
  ).toThrowError('Looks like you have configured linking in multiple places.');

  // @ts-ignore
  element?.unmount();

  function Sample2() {
    useLinking(ref, options);
    return null;
  }

  const wrapper2 = <Sample2 />;

  render(wrapper2).unmount();

  expect(() => (element = render(wrapper2))).not.toThrow();

  // @ts-ignore
  element?.unmount();

  function Sample3() {
    useLinking(ref, options);
    useLinking(ref, { ...options, enabled: false });
    return null;
  }

  expect(() => (element = render(<Sample3 />))).not.toThrowError();

  // @ts-ignore
  element?.unmount();
});
