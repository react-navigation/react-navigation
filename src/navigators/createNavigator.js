/*       */

import * as React from 'react';

// Props we want createNavigator to Inject

// NavigatorCreator type

/**
 * Creates a navigator based on a router and a view that renders the screens.
 */
export default function createNavigator(
  router,
  routeConfigs,
  navigatorConfig,
  navigatorType
) {
  return NavigationView => {
    class Navigator extends React.Component {
      static router = router;

      static routeConfigs = routeConfigs;
      static navigatorConfig = navigatorConfig;
      static navigatorType = navigatorType;
      static navigationOptions = null;

      render() {
        return <NavigationView {...this.props} router={router} />;
      }
    }

    return Navigator;
  };
}
