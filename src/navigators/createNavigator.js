import React from 'react';

/**
 * Creates a navigator based on a router and a view that renders the screens.
 */
export default function createNavigator(router, routeConfigs, navigatorConfig) {
  return NavigationView => {
    class Navigator extends React.Component {
      static router = router;
      static navigationOptions = null;

      render() {
        return <NavigationView {...this.props} router={router} />;
      }
    }

    return Navigator;
  };
}
