import React from 'react';
import createNavigationContainer from '../createNavigationContainer';
import createNavigator from './createNavigator';
import CardStackTransitioner from '../views/CardStack/CardStackTransitioner';
import StackRouter from '../routers/StackRouter';
import NavigationActions from '../NavigationActions';

// A stack navigators props are the intersection between
// the base navigator props (navgiation, screenProps, etc)
// and the view's props

export default (routeConfigMap, stackConfig = {}) => {
  const {
    initialRouteName,
    initialRouteParams,
    paths,
    headerMode,
    mode,
    cardStyle,
    transitionConfig,
    onTransitionStart,
    onTransitionEnd,
    navigationOptions,
  } = stackConfig;

  const stackRouterConfig = {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  };

  const router = StackRouter(routeConfigMap, stackRouterConfig);

  // Create a navigator with CardStackTransitioner as the view
  const navigator = createNavigator(router, routeConfigMap, stackConfig)(
    props => (
      <CardStackTransitioner
        {...props}
        headerMode={headerMode}
        mode={mode}
        cardStyle={cardStyle}
        transitionConfig={transitionConfig}
        onTransitionStart={onTransitionStart}
        onTransitionEnd={(lastTransition, transition) => {
          const { state, dispatch } = props.navigation;
          dispatch(NavigationActions.completeTransition());
          onTransitionEnd && onTransitionEnd();
        }}
      />
    )
  );

  return createNavigationContainer(navigator);
};
