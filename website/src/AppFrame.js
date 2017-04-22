import React from 'react';
import {
  addNavigationHelpers,
} from 'react-navigation';

import Link from './Link';
import Footer from './Footer';

import docs from '../docs';

const NavigationLinks = ({
  childNavigation,
  navigation,
  className,
  reverse,
}) => {
  let links = [
    ...navigation.state.routes.map((route, i) => {
      if (route.routeName === 'Home' || route.routeName === 'NotFound') {
        return null;
      }
      return (
        <Link
          to={route.routeName}
          className={i === navigation.state.index ? 'active':''}
          key={route.routeName}>
          {route.routeName}
        </Link>
      );
    }),

    <a href="https://github.com/react-community/react-navigation" key="github">
      GitHub
    </a>,
  ];
  if (reverse) {
    links = links.reverse();
  }
  return (
    <div className={className}>
      {links}
    </div>
  );
}

class VersionSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = { menuShown: false };

    this.toggleMenuShown = this.toggleMenuShown.bind(this);
    this.handleVersionClick = this.handleVersionClick.bind(this);
  }

  toggleMenuShown() {
    this.setState({ menuShown: !this.state.menuShown });
  }

  handleVersionClick(version) {
    const { setParams } = this.props.childNavigation;
    return () => {
      setParams({ version });
    }
  }

  render() {
    const { menuShown } = this.state;
    const { state } = this.props.childNavigation;
    
    const isUndef = (obj) => obj === undefined;
    const docVersionIsUndefined = (state) => (
      isUndef(state) || 
      isUndef(state.params) || 
      isUndef(state.params.version)
    );

    const currentVersion = docVersionIsUndefined(state) ? 'edge' : state.params.version;
    const versionsList = Object.keys(docs).map((version) => (
      <li
        key={version}
        onClick={this.handleVersionClick(version)}
        style={{
          color: (currentVersion === version) ? '#6b52ae' : '#555'
        }}
      >
        {version}
      </li>
    ));

    return (
      <div className='versionselector'>
        <span className="versionbutton" onClick={this.toggleMenuShown}>
          version: {currentVersion} ▼
        </span>
        <ul
          style={{
            //display: menuShown ? 'inline' : 'none',
            visibility: menuShown ? 'visible' : 'hidden',
            listStyleType: 'none',
          }}
        >
          {versionsList}
        </ul>
      </div>
    );
  }
}

class AppFrame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobileMenuOpen: false,
    };

    this.setVersion = this.setVersion.bind(this);
  }
  
  componentWillReceiveProps(props) {
    if (this.props.navigation.state !== props.navigation.state) {
      this.setState({isMobileMenuOpen: false});
      window.scrollTo(0,0);
    }
  }
  
  setVersion(version) {
    return () => this.setState({ version });
  }

  render() {
    const { navigation, router } = this.props;
    const { isMobileMenuOpen } = this.state;
    const childNavigation = addNavigationHelpers({
      ...navigation,
      state: navigation.state.routes[navigation.state.index],
    });
    const { state } = navigation;
    const ScreenView = router.getComponentForRouteName(state.routes[state.index].routeName);
    const { routes, index } = state;
    const route = routes[index];
    const hasChildNavigation = !!route.routes;

    return (
      <div className={`main-app ${isMobileMenuOpen ? 'mobileMenuActive' : ''}`}>

        <nav className="pt-navbar" id="navbar"><div className="inner-navbar">

          <Link className="pt-navbar-group pt-align-left project-title" to="Home">
            <img src="/assets/react-nav-logo.svg" role="presentation" className="logo" />
            <h1 className="pt-navbar-heading">
              React Navigation
            </h1>
          </Link>

          <VersionSelector
            className="versionselector"
            childNavigation={childNavigation}
          />

          <NavigationLinks
            navigation={navigation}
            className="navbuttons"
            childNavigation={childNavigation}
          />

          {hasChildNavigation && (
            <span
              className={`pt-icon-properties openMenuButton ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => {
                this.setState(s => ({ isMobileMenuOpen: !s.isMobileMenuOpen}));
                window.scrollTo(0,0);
              }}
            />
          )}

        </div></nav>

        <NavigationLinks
          navigation={navigation}
          className="mobile-navbuttons"
          childNavigation={childNavigation}
          reverse
        />

        <ScreenView navigation={childNavigation} />

        <Footer />
      </div>
    );
  }
}

export default AppFrame;
