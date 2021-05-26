import {
  createNavigationContainerRef,
  ParamListBase,
} from '@react-navigation/core';
import { render, RenderAPI } from '@testing-library/react-native';
import * as React from 'react';

import useLinking from '../useLinking';

it('throws if multiple instances of useLinking are used', () => {
  const ref = createNavigationContainerRef<ParamListBase>();

  const options = { prefixes: [] };

  function Sample() {
    useLinking(ref, options);
    useLinking(ref, options);
    return null;
  }

  let element: RenderAPI | undefined;

  expect(() => (element = render(<Sample />))).toThrowError(
    'Looks like you have configured linking in multiple places.'
  );

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

  element?.unmount();

  function Sample2() {
    useLinking(ref, options);
    return null;
  }

  const wrapper2 = <Sample2 />;

  render(wrapper2).unmount();

  expect(() => (element = render(wrapper2))).not.toThrow();

  element?.unmount();

  function Sample3() {
    useLinking(ref, options);
    useLinking(ref, { ...options, enabled: false });
    return null;
  }

  expect(() => (element = render(<Sample3 />))).not.toThrowError();

  element?.unmount();
});
