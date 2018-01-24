/* @flow */
/* eslint react/display-name:0 */

import * as React from 'react';
import renderer from 'react-test-renderer';
import Transitioner from '../Transitioner';
import type { NavigationTransitionProps } from '../../TypeDefinition';

describe('Transitioner', () => {
  it('should not trigger transition on SET_PARAMS', () => {
    let transitionStartCalled = false;
    let transitionEndCalled = false;
    const transitionerProps = {
      configureTransition: (
        transitionProps: NavigationTransitionProps,
        prevTransitionProps: ?NavigationTransitionProps
      ) => ({}),
      navigation: {
        state: {
          index: 0,
          routes: [
            { key: '1', routeName: 'Foo' },
            { key: '2', routeName: 'Bar' },
          ],
        },
        goBack: () => false,
        dispatch: () => false,
        setParams: () => false,
        navigate: () => false,
      },
      render: () => <div />,
      onTransitionStart: () => {
        transitionStartCalled = true;
      },
      onTransitionEnd: () => {
        transitionEndCalled = true;
      },
    };
    const nextTransitionerProps = {
      ...transitionerProps,
      navigation: {
        ...transitionerProps.navigation,
        state: {
          index: 0,
          routes: [
            { key: '1', routeName: 'Foo', params: { name: 'Zoom' } },
            { key: '2', routeName: 'Bar' },
          ],
        },
      },
    };
    const component = renderer.create(<Transitioner {...transitionerProps} />);
    expect(transitionStartCalled).toEqual(false);
    expect(transitionEndCalled).toEqual(false);
    component.update(<Transitioner {...nextTransitionerProps} />);
    expect(transitionStartCalled).toEqual(false);
    expect(transitionEndCalled).toEqual(false);
  });
});
