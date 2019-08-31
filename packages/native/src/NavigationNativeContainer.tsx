import * as React from 'react';
import {
  NavigationContainer,
  NavigationContainerProps,
  NavigationContainerRef,
} from '@react-navigation/core';
import useBackButton from './useBackButton';

/**
 * Container component which holds the navigation state
 * designed for mobile apps.
 * This should be rendered at the root wrapping the whole app.
 *
 * @param props.initialState Initial state object for the navigation tree.
 * @param props.onStateChange Callback which is called with the latest navigation state when it changes.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */
const NavigationNativeContainer = React.forwardRef(function NativeContainer(
  props: NavigationContainerProps,
  ref: React.Ref<NavigationContainerRef>
) {
  const refContainer = React.useRef<NavigationContainerRef>(null);

  useBackButton(refContainer);

  React.useImperativeHandle(ref, () => refContainer.current);

  return (
    <NavigationContainer
      {...props}
      ref={refContainer}
      children={props.children}
    />
  );
});

export default NavigationNativeContainer;
