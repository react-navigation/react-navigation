/* eslint react/display-name:0 */
import * as React from 'react';
import renderer from 'react-test-renderer';
import Transitioner from '../Transitioner';

describe('Transitioner', () => {
  it('should not trigger onTransitionStart and onTransitionEnd when route params are changed', () => {
    const onTransitionStartCallback = jest.fn();
    const onTransitionEndCallback = jest.fn();

    const transitionerProps = {
      configureTransition: (transitionProps, prevTransitionProps) => ({}),
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
      onTransitionStart: onTransitionStartCallback,
      onTransitionEnd: onTransitionEndCallback,
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
    component.update(<Transitioner {...nextTransitionerProps} />);
    expect(onTransitionStartCallback).not.toBeCalled();
    expect(onTransitionEndCallback).not.toBeCalled();
  });
});
