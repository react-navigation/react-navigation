import {
  createNavigationContainerRef,
  ParamListBase,
} from '@react-navigation/core';
import { render, RenderAPI } from '@testing-library/react-native';
import * as React from 'react';

import { useLinking } from '../useLinking';

it('throws if multiple instances of useLinking are used', () => {
  const ref = createNavigationContainerRef<ParamListBase>();

  const options = { prefixes: [] };

  function Sample() {
    const lastUnhandledLinking = React.useRef<string | undefined>();
    useLinking(ref, options, lastUnhandledLinking);
    useLinking(ref, options, lastUnhandledLinking);
    return null;
  }

  const spy = jest.spyOn(console, 'error').mockImplementation();

  let element: RenderAPI | undefined;

  element = render(<Sample />);

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toMatch(
    'Looks like you have configured linking in multiple places.'
  );

  element?.unmount();

  function A() {
    const lastUnhandledLinking = React.useRef<string | undefined>();
    useLinking(ref, options, lastUnhandledLinking);
    return null;
  }

  function B() {
    const lastUnhandledLinking = React.useRef<string | undefined>();
    useLinking(ref, options, lastUnhandledLinking);
    return null;
  }

  element = render(
    <>
      <A />
      <B />
    </>
  );

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy.mock.calls[1][0]).toMatch(
    'Looks like you have configured linking in multiple places.'
  );

  element?.unmount();

  function Sample2() {
    const lastUnhandledLinking = React.useRef<string | undefined>();
    useLinking(ref, options, lastUnhandledLinking);
    return null;
  }

  const wrapper2 = <Sample2 />;

  render(wrapper2).unmount();

  render(wrapper2);

  expect(spy).toHaveBeenCalledTimes(2);

  element?.unmount();
});
