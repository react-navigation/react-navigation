import React from 'react';
import renderer from 'react-test-renderer';
import StackNavigator from '../createContainedStackNavigator';

const SubNavigator = StackNavigator({
  Home: {
    screen: () => null,
  },
});

const NavNestedDirect = StackNavigator({
  Sub: {
    screen: SubNavigator,
  },
});

const NavNestedIndirect = StackNavigator({
  Sub: {
    // eslint-disable-next-line react/display-name
    screen: props => <SubNavigator {...props} />,
  },
});

/* Prevent React error boundaries from swallowing the errors */
NavNestedIndirect.prototype.componentDidCatch = null;
SubNavigator.prototype.componentDidCatch = null;

describe('Nested navigators', () => {
  it('renders succesfully as direct child', () => {
    const rendered = renderer.create(<NavNestedDirect />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('throw when trying to pass navigation prop', () => {
    const tryRender = () => {
      renderer.create(<NavNestedIndirect />);
    };
    expect(tryRender).toThrowErrorMatchingSnapshot();
  });
});
