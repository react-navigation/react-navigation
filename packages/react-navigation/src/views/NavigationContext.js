import React from 'react';
import propTypes from 'prop-types';
import createReactContext from 'create-react-context';

const NavigationContext = createReactContext();

export const NavigationProvider = NavigationContext.Provider;
export const NavigationConsumer = NavigationContext.Consumer;
