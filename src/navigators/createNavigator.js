import React from 'react';

import getChildEventSubscriber from '../getChildEventSubscriber';
import addNavigationHelpers from '../addNavigationHelpers';

function createNavigator(NavigatorView, router, navigationConfig) {
  class Navigator extends React.Component {
    static router = router;
    static navigationOptions = null;

    render() {
      const { navigation, screenProps } = this.props;
      const { dispatch, state, addListener } = navigation;
      const { routes } = state;

      const descriptors = {};
      routes.forEach(route => {
        const getComponent = () =>
          router.getComponentForRouteName(route.routeName);

        const childNavigation = addNavigationHelpers({
          dispatch,
          state: route,
          addListener: getChildEventSubscriber(addListener, route.key),
        });
        const options = router.getScreenOptions(childNavigation, screenProps);
        descriptors[route.key] = {
          key: route.key,
          getComponent,
          options,
          state: route,
          navigation: childNavigation,
        };
      });

      return (
        <NavigatorView
          screenProps={screenProps}
          navigation={navigation}
          navigationConfig={navigationConfig}
          descriptors={descriptors}
        />
      );
    }
  }
  return Navigator;
}

export default createNavigator;
