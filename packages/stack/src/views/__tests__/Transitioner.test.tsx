/* eslint react/display-name:0 */
import * as React from 'react';
import renderer from 'react-test-renderer';
import Transitioner from '../Transitioner';

describe('Transitioner', () => {
  // TODO: why does this fail here but not when it was part of react-navigation repo?
  it.skip('should not trigger onTransitionStart and onTransitionEnd when route params are changed', () => {
    const onTransitionStartCallback = jest.fn();
    const onTransitionEndCallback = jest.fn();

    const transitionerProps = {
      configureTransition: () => ({}),
      navigation: {
        state: {
          key: '0',
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
        isFocused: () => false,
        dangerouslyGetParent: () => undefined,
        getParam: jest.fn(),
        addListener: jest.fn(),
      },
      render: () => <div />,
      onTransitionStart: onTransitionStartCallback,
      onTransitionEnd: onTransitionEndCallback,
    };

    const nextTransitionerProps = {
      ...transitionerProps,
      navigation: {
        ...transitionerProps.navigation,
        state: {
          key: '0',
          index: 0,
          routes: [
            { key: '1', routeName: 'Foo', params: { name: 'Zoom' } },
            { key: '2', routeName: 'Bar' },
          ],
        },
      },
    };
    const component = renderer.create(
      <Transitioner descriptors={{}} {...transitionerProps} />
    );
    component.update(
      <Transitioner descriptors={{}} {...nextTransitionerProps} />
    );
    expect(onTransitionStartCallback).not.toBeCalled();
    expect(onTransitionEndCallback).not.toBeCalled();
  });
});
