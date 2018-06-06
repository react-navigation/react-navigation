import createNavigationContainer from './createNavigationContainer';
import StateUtils from './StateUtils';

import createNavigator from './navigators/createNavigator';
import createStackNavigator from './navigators/createStackNavigator';
import createSwitchNavigator from './navigators/createSwitchNavigator';
import createDrawerNavigator from './navigators/createDrawerNavigator';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation-tabs';

import NavigationActions from './NavigationActions';
import StackActions from './routers/StackActions';
import DrawerActions from './routers/DrawerActions';
import getNavigationActionCreators from './routers/getNavigationActionCreators';

import StackRouter from './routers/StackRouter';
import TabRouter from './routers/TabRouter';
import DrawerRouter from './routers/DrawerRouter';
import SwitchRouter from './routers/SwitchRouter';

import Transitioner from './views/Transitioner';
import StackView from './views/StackView/StackView';
import StackViewCard from './views/StackView/StackViewCard';
import SafeAreaView from 'react-native-safe-area-view';
import SceneView from './views/SceneView';
import ResourceSavingSceneView from './views/ResourceSavingSceneView';

import Header from './views/Header/Header';
import HeaderTitle from './views/Header/HeaderTitle';
import HeaderBackButton from './views/Header/HeaderBackButton';

import DrawerView from './views/Drawer/DrawerView';
import DrawerItems from './views/Drawer/DrawerNavigatorItems';
import DrawerSidebar from './views/Drawer/DrawerSidebar';

import SwitchView from './views/SwitchView/SwitchView';

import withNavigation from './views/withNavigation';
import withNavigationFocus from './views/withNavigationFocus';
import withOrientation from './views/withOrientation';

export {
  // Core
  createNavigationContainer,
  StateUtils,
  // Navigators
  createNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  // Actions
  NavigationActions,
  StackActions,
  DrawerActions,
  getNavigationActionCreators,
  // Routers
  StackRouter,
  TabRouter,
  DrawerRouter,
  SwitchRouter,
  // Views
  Transitioner,
  StackView,
  StackViewCard,
  SafeAreaView,
  SceneView,
  ResourceSavingSceneView,
  // Header
  Header,
  HeaderTitle,
  HeaderBackButton,
  // DrawerView
  DrawerView,
  DrawerItems,
  DrawerSidebar,
  // SwitchView
  SwitchView,
  // HOCs
  withNavigation,
  withNavigationFocus,
  withOrientation,
};
