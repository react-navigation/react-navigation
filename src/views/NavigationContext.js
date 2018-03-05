import React from 'react';
import propTypes from 'prop-types';
import createReactContext from 'create-react-context';

const NavigationContext = createReactContext();

export class NavigationProvider extends React.PureComponent {
  render() {
    const { navigation, children } = this.props;
    return (
      <NavigationContext.Provider value={navigation}>
        {children}
      </NavigationContext.Provider>
    );
  }
}

export const NavigationConsumer = NavigationContext.Consumer;
