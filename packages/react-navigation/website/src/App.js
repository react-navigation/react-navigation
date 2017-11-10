/*
 * @flow
 */

import React from 'react';

import AppFrame from './AppFrame';
import HomePage from './HomePage';
import PageWithSidebar from './PageWithSidebar';
import MDPage from './MDPage';

import {
  TabRouter,
  addNavigationHelpers,
  createNavigator,
} from 'react-navigation';

import type {
  NavigationScreenComponent,
  NavigationScreenProp,
  NavigationRoute,
} from 'react-navigation/src/TypeDefinition';

type ScreenOptions = {
  linkName: string,
  icon: string,
  title: string,
};

const NavView = ({ navigation, router }: { navigation: any, router: any }) => {
  const { state } = navigation;
  const Component = router.getComponentForState(state);
  return (
    <Component
      navigation={addNavigationHelpers({
        ...navigation,
        state: state.routes[state.index],
      })}
    />
  );
};

type DocPageConfig = {
  doc: string,
  title: string,
  linkName: string,
};

const createDocPage = (
  config: DocPageConfig
): NavigationScreenComponent<*, *> => {
  const Page = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<NavigationRoute>,
  }) => <MDPage docPath={config.doc} navigation={navigation} />;
  Page.navigationOptions = {
    doc: config.doc,
    title: config.title,
    linkName: config.linkName,
  };
  return Page;
};

const GuideDocs = createNavigator(
  TabRouter({
    GettingStarted: {
      screen: createDocPage({
        doc: 'guides/Guide-Intro',
        title: 'Introduction',
        linkName: 'Introduction',
      }),
      path: '',
    },
    QuickStart: {
      screen: createDocPage({
        doc: 'guides/Guide-Quick-Start',
        title: 'Quick Start',
        linkName: 'Quick Start',
      }),
      path: 'quick-start',
    },
    BasicExample: {
      screen: createDocPage({
        doc: 'guides/Guide-Basic-Example',
        title: 'Hello Mobile Navigation',
        linkName: 'Hello Mobile Navigation',
      }),
      path: 'basic-app',
    },
    NestedNavigator: {
      screen: createDocPage({
        doc: 'guides/Guide-Nested',
        title: 'Nesting Navigators',
        linkName: 'Nesting Navigators',
      }),
      path: 'nesting',
    },
    ConfiguringHeaders: {
      screen: createDocPage({
        doc: 'guides/Guide-Headers',
        title: 'Configuring Headers',
        linkName: 'Configuring Headers',
      }),
      path: 'headers',
    },
  })
)(NavView);

GuideDocs.navigationOptions = {
  linkName: 'Getting Started',
  icon: 'pt-icon-flows',
};

const GuidesDocs = createNavigator(
  TabRouter({
    ReduxIntegration: {
      screen: createDocPage({
        doc: 'guides/Redux-Integration',
        title: 'Redux Integration Guide',
        linkName: 'Redux Integration',
      }),
      path: 'redux',
    },
    WebIntegration: {
      screen: createDocPage({
        doc: 'guides/Web-Integration',
        title: 'Web Integration Guide',
        linkName: 'Web Integration',
      }),
      path: 'web',
    },
    DeepLinking: {
      screen: createDocPage({
        doc: 'guides/Deep-Linking',
        title: 'Deep Linking Guide',
        linkName: 'Deep Linking',
      }),
      path: 'linking',
    },
    ScreenTracking: {
      screen: createDocPage({
        doc: 'guides/Screen-Tracking',
        title: 'Screen tracking and analytics',
        linkName: 'Screen Tracking',
      }),
      path: 'screen-tracking',
    },
    Contributors: {
      screen: createDocPage({
        doc: 'CONTRIBUTING',
        title: 'Contributors Guide',
        linkName: 'Contributors',
      }),
      path: 'contributors',
    },
  })
)(NavView);

GuidesDocs.navigationOptions = {
  linkName: 'Advanced Guides',
  icon: 'pt-icon-manual',
};

const NavigatorsDocs = createNavigator(
  TabRouter({
    Navigators: {
      screen: createDocPage({
        doc: 'api/navigators/Navigators',
        title: 'Intro to Navigators',
        linkName: 'Intro to Navigators',
      }),
      path: '',
    },
    StackNavigator: {
      screen: createDocPage({
        doc: 'api/navigators/StackNavigator',
        title: 'StackNavigator',
        linkName: 'StackNavigator',
      }),
      path: 'stack',
    },
    TabNavigator: {
      screen: createDocPage({
        doc: 'api/navigators/TabNavigator',
        title: 'TabNavigator',
        linkName: 'TabNavigator',
      }),
      path: 'tab',
    },
    DrawerNavigator: {
      screen: createDocPage({
        doc: 'api/navigators/DrawerNavigator',
        title: 'DrawerNavigator',
        linkName: 'DrawerNavigator',
      }),
      path: 'drawer',
    },
    NavigationProp: {
      screen: createDocPage({
        doc: 'guides/Screen-Navigation-Prop',
        title: 'The Navigation Prop',
        linkName: 'The Navigation Prop',
      }),
      path: 'navigation-prop',
    },
    NavigationActions: {
      screen: createDocPage({
        doc: 'guides/Navigation-Actions',
        title: 'Navigation Actions',
        linkName: 'Navigation Actions',
      }),
      path: 'navigation-actions',
    },
    NavigationOptions: {
      screen: createDocPage({
        doc: 'guides/Screen-Nav-Options',
        title: 'Screen Nav Options',
        linkName: 'Screen Nav Options',
      }),
      path: 'navigation-options',
    },
    Custom: {
      screen: createDocPage({
        doc: 'guides/Custom-Navigators',
        title: 'Custom Navigators',
        linkName: 'Custom Navigators',
      }),
      path: 'custom',
    },
  })
)(NavView);

NavigatorsDocs.navigationOptions = {
  linkName: 'Navigators',
  icon: 'pt-icon-briefcase',
};

const RoutersDocs = createNavigator(
  TabRouter({
    Routers: {
      screen: createDocPage({
        doc: 'api/routers/Routers',
        title: 'Routers',
        linkName: 'Routers',
      }),
      path: '',
    },
    RoutersAPI: {
      screen: createDocPage({
        doc: 'api/routers/RoutersAPI',
        title: 'Router API',
        linkName: 'Custom Router API',
      }),
      path: 'api',
    },
    StackRouter: {
      screen: createDocPage({
        doc: 'api/routers/StackRouter',
        title: 'StackRouter',
        linkName: 'StackRouter',
      }),
      path: 'stack',
    },
    TabRouter: {
      screen: createDocPage({
        doc: 'api/routers/TabRouter',
        title: 'TabRouter',
        linkName: 'TabRouter',
      }),
      path: 'tab',
    },
  })
)(NavView);

RoutersDocs.navigationOptions = {
  linkName: 'Routers',
  icon: 'pt-icon-fork',
};

const ViewsDocs = createNavigator(
  TabRouter({
    Views: {
      screen: createDocPage({
        doc: 'api/views/Views',
        title: 'Views',
        linkName: 'Navigation Views',
      }),
      path: '',
    },
    TransitionerView: {
      screen: createDocPage({
        doc: 'api/views/Transitioner',
        title: 'Transitioner',
        linkName: 'Transitioner',
      }),
      path: 'transitioner',
    },
    WithNavigation: {
      screen: createDocPage({
        doc: 'api/withNavigation',
        title: 'WithNavigation',
        linkName: 'withNavigation',
      }),
      path: 'with-navigation',
    },
  })
)(NavView);
ViewsDocs.navigationOptions = {
  linkName: 'Views',
  icon: 'pt-icon-eye-open',
};

const DocsPage = createNavigator(
  TabRouter({
    GuideDocs: {
      screen: GuideDocs,
      path: 'intro',
    },
    NavigatorsTab: {
      screen: NavigatorsDocs,
      path: 'navigators',
    },
    GuidesTab: {
      screen: GuidesDocs,
      path: 'guides',
    },
    RoutersTab: {
      screen: RoutersDocs,
      path: 'routers',
    },
    ViewsTab: {
      screen: ViewsDocs,
      path: 'views',
    },
  })
)(PageWithSidebar);
DocsPage.navigationOptions = ({
  navigationOptions,
}: {
  navigationOptions: any,
}) => ({
  title: `${navigationOptions.title} | React Navigation`,
});

const IntroPost = () => <h1> Hello, world!</h1>;
IntroPost.navigationOptions = {
  title: 'Introducing React Navigation',
  linkName: 'Introduction',
};

const BlogHistoryPage = createNavigator(
  TabRouter({
    RenewedV1: {
      screen: createDocPage({
        doc: 'blog/2017-09-Renewed-v1',
        title: 'A (Renewed) Path to React Navigation V1',
        linkName: 'A (Renewed) Path to React Navigation V1',
      }),
      path: '2017/9/Renewed-v1',
    },
    RoadToV1: {
      screen: createDocPage({
        doc: 'blog/2017-04-On-the-path-to-v1',
        title: 'On the path to v1',
        linkName: 'On the path to v1',
      }),
      path: '2017/4/On-the-path-to-v1',
    },
    IntroPost: {
      screen: createDocPage({
        doc: 'blog/2017-01-Introducing-React-Navigation',
        title: 'Introducing React Navigation for React Native',
        linkName: 'React Navigation Intro',
      }),
      path: '2017/1/Introducing-React-Navigation',
    },
  })
)(PageWithSidebar);
BlogHistoryPage.navigationOptions = {
  linkName: 'Recent Posts',
  icon: 'pt-icon-history',
};

const BlogPage = createNavigator(
  TabRouter({
    HistoryTab: {
      screen: BlogHistoryPage,
      path: '',
    },
  })
)(PageWithSidebar);

const NotFoundError = () => (
  <div className="errorScreen">
    <h1>Page not found</h1>
  </div>
);

const App = createNavigator(
  TabRouter({
    Home: {
      screen: HomePage,
      path: '',
    },
    Docs: {
      screen: DocsPage,
      path: 'docs',
    },
    Blog: {
      screen: BlogPage,
      path: 'blog',
    },
    NotFound: {
      screen: NotFoundError,
      navigationOptions: {
        title: 'Page Not Found | React Navigation',
      },
    },
  })
)(AppFrame);

export default App;
