/* eslint react/display-name:0 */
import * as React from 'react';
import renderer from 'react-test-renderer';
import Transitioner from '../Transitioner';

describe('Transitioner', () => {
  it('should not trigger onTransitionStart and onTransitionEnd when route params are changed', () => {
    const onTransitionStartCallBack = jest.fn();
    const onTransitionEndCallBack = jest.fn();

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
      onTransitionStart: onTransitionStartCallBack,
      onTransitionEnd: onTransitionEndCallBack,
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
    expect(onTransitionStartCallBack).not.toBeCalled();
    expect(onTransitionEndCallBack).not.toBeCalled();
  });
});
