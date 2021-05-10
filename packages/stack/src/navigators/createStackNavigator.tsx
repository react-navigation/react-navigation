import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  EventArg,
  StackRouter,
  StackRouterOptions,
  StackNavigationState,
  StackActions,
  ParamListBase,
  StackActionHelpers,
} from '@react-navigation/native';
import warnOnce from 'warn-once';
import StackView from '../views/Stack/StackView';
import type {
  StackNavigationConfig,
  StackNavigationOptions,
  StackNavigationEventMap,
  StackHeaderMode,
} from '../types';

type Props = DefaultNavigatorOptions<StackNavigationOptions> &
  StackRouterOptions &
  StackNavigationConfig;

function StackNavigator({
  initialRouteName,
  children,
  screenOptions,
  ...rest
}: Props) {
  // @ts-expect-error: mode is deprecated
  const mode = rest.mode as 'card' | 'modal' | undefined;

  // @ts-expect-error: headerMode='none' is deprecated
  const headerMode = rest.headerMode as StackHeaderMode | 'none' | undefined;

  warnOnce(
    mode != null,
    `Stack Navigator: 'mode="${mode}"' is deprecated. Use 'presentation: "${mode}"' in 'screenOptions' instead.`
  );

  warnOnce(
    headerMode === 'none',
    `Stack Navigator: 'headerMode="none"' is deprecated. Use 'headerShown: false' in 'screenOptions' instead.`
  );

  warnOnce(
    headerMode != null && headerMode !== 'none',
    `Stack Navigator: 'headerMode' is moved to 'options'. Moved it to 'screenOptions' to keep current behavior.`
  );

  const {
    state,
    descriptors,
    navigation,
    NavigationContent,
  } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    StackNavigationOptions,
    StackNavigationEventMap
  >(StackRouter, {
    initialRouteName,
    children,
    screenOptions,
    defaultScreenOptions: () => ({
      presentation: mode,
      headerShown: headerMode ? headerMode !== 'none' : true,
      headerMode: headerMode && headerMode !== 'none' ? headerMode : undefined,
    }),
  });

  React.useEffect(
    () =>
      navigation.addListener?.('tabPress', (e) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (
            state.index > 0 &&
            isFocused &&
            !(e as EventArg<'tabPress', true>).defaultPrevented
          ) {
            // When user taps on already focused tab and we're inside the tab,
            // reset the stack to replicate native behaviour
            navigation.dispatch({
              ...StackActions.popToTop(),
              target: state.key,
            });
          }
        });
      }),
    [navigation, state.index, state.key]
  );

  return (
    <NavigationContent>
      <StackView
        {...rest}
        state={state}
        descriptors={descriptors}
        navigation={navigation}
      />
    </NavigationContent>
  );
}

export default createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap,
  typeof StackNavigator
>(StackNavigator);
