import React, { Component } from 'react';

import Link from './Link';

import { NavigationActions, addNavigationHelpers } from 'react-navigation';

const LinkableLi = Link.Linkable(props => <li {...props} />);

function getConfig(router, state, action, configName) {
  if (action) {
    state = router.getStateForAction(action, state);
  }
  const Component = router.getComponentForState(state);
  return Component.navigationOptions[configName];
}

class PageWithSidebar extends Component {
  render() {
    const { router, navigation } = this.props;
    const { dispatch, state } = navigation;
    const ActiveScreen = router.getComponentForState(state);
    let prevAction = null;
    if (state.routes[state.index].index > 0) {
      const prev = state.routes[state.index].index - 1;
      prevAction = NavigationActions.navigate({
        routeName: state.routes[state.index].routes[prev].routeName,
      });
    }
    if (!prevAction && state.index > 0) {
      const prev = state.index - 1;
      prevAction = NavigationActions.navigate({
        routeName: state.routes[prev].routeName,
        action: NavigationActions.navigate({
          routeName:
            state.routes[prev].routes[state.routes[prev].routes.length - 1]
              .routeName,
        }),
      });
    }
    let nextAction = null;
    if (
      state.routes[state.index].index <
      state.routes[state.index].routes.length - 1
    ) {
      const next = state.routes[state.index].index + 1;
      nextAction = NavigationActions.navigate({
        routeName: state.routes[state.index].routes[next].routeName,
      });
    }
    if (!nextAction && state.index < state.routes.length - 1) {
      const next = state.index + 1;
      nextAction = NavigationActions.navigate({
        routeName: state.routes[next].routeName,
      });
    }
    let prevName =
      prevAction && getConfig(router, state, prevAction, 'linkName');
    let nextName =
      nextAction && getConfig(router, state, nextAction, 'linkName');
    const docPath = getConfig(router, state, null, 'doc') + '.md';
    return (
      <div className="page-body">
        <div className="inner-page-body">
          <div className="left-sidebar">
            <ul className="pt-menu pt-elevation-1 navmenu">
              {state.routes &&
                state.routes.map((route, i) => {
                  const DocComponent = router.getComponentForRouteName(
                    route.routeName
                  );
                  const childNavigation = addNavigationHelpers({
                    state: route,
                    dispatch,
                  });
                  const options = router.getScreenOptions(childNavigation, {});
                  const isActive = state.index === i;
                  return (
                    <span key={i}>
                      <LinkableLi
                        to={route.routeName}
                        className={
                          'pt-menu-header ' +
                          options.icon +
                          ' ' +
                          (isActive ? 'active' : '')
                        }
                      >
                        <h6>
                          {options.linkName}
                        </h6>
                      </LinkableLi>
                      <div>
                        {route.routes &&
                          route.routes.map((childRoute, childI) => {
                            const isChildActive =
                              isActive && route.index === childI;
                            const secondChildNavigation = addNavigationHelpers({
                              state: childRoute,
                              dispatch,
                            });
                            const secondOptions =
                              DocComponent.router &&
                              DocComponent.router.getScreenOptions(
                                secondChildNavigation,
                                {}
                              );
                            const routerLinkName =
                              secondOptions && secondOptions.linkName;
                            const linkName =
                              routerLinkName || childRoute.routeName;
                            return (
                              <Link
                                to={childRoute.routeName}
                                className={`pt-menu-item page ${isChildActive
                                  ? 'active'
                                  : ''}`}
                                key={childI}
                              >
                                {linkName}
                              </Link>
                            );
                          })}
                      </div>
                    </span>
                  );
                })}
            </ul>
          </div>

          <div className="main-section">
            <ActiveScreen navigation={this.props.navigation} />
            <hr />
            {state.routeName === 'Docs' &&
              <Link
                href={`https://github.com/react-community/react-navigation/tree/master/docs/${docPath}`}
                className="editLink"
              >
                {' '}Edit on GitHub
              </Link>}
            {prevAction &&
              <Link to={prevAction}>
                Previous: {prevName}
              </Link>}
            {nextAction &&
              <Link to={nextAction} className="nextLink">
                Next: {nextName}
              </Link>}
          </div>
        </div>
      </div>
    );
  }
}

export default PageWithSidebar;
