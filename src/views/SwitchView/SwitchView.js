import React from 'react';
import SceneView from '../SceneView';
import withCachedChildNavigation from '../../withCachedChildNavigation';

class SwitchContainer extends React.Component {
  render() {
    const { screenProps } = this.props;

    const route = this.props.navigation.state.routes[
      this.props.navigation.state.index
    ];
    const childNavigation = this.props.childNavigationProps[route.key];
    const ChildComponent = this.props.router.getComponentForRouteName(
      route.routeName
    );

    return (
      <SceneView
        component={ChildComponent}
        navigation={childNavigation}
        screenProps={screenProps}
      />
    );
  }
}

export default withCachedChildNavigation(SwitchContainer);
