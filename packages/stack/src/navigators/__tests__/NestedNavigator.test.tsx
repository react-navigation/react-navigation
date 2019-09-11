import * as React from 'react';
import renderer from 'react-test-renderer';
import { createAppContainer } from 'react-navigation';
import StackNavigator from '../createStackNavigator';

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
    screen: (props: any) => <SubNavigator {...props} />,
  },
});

/* Prevent React error boundaries from swallowing the errors */
NavNestedIndirect.prototype.componentDidCatch = null;
SubNavigator.prototype.componentDidCatch = null;

describe('Nested navigators', () => {
  it('renders succesfully as direct child', () => {
    const NavApp = createAppContainer(NavNestedDirect);
    const rendered = renderer.create(<NavApp />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('throw when trying to pass navigation prop', () => {
    const tryRender = () => {
      const NavApp = createAppContainer(NavNestedIndirect);
      renderer.create(<NavApp />);
    };
    expect(tryRender).toThrowErrorMatchingSnapshot();
  });
});
