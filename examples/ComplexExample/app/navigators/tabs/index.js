import React from "react";
import { TabNavigator } from "react-navigation";

// Screens
// Only one for now, add more as required
import Home from "./home";

// Tabs
import Tab from "../../components/tabs/tab";

// TabNavigator options
const options = {
  lazyLoad: true,
  tabBarOptions: {
    inactiveTintColor: "#aaa",
    activeTintColor: "#fff",
    showIcon: true,
    showLabel: false,
    style: {
      backgroundColor: "#272822"
    }
  },
  animationEnabled: false
};

export default TabNavigator(
  {
    List: {
      screen: Home,
      navigationOptions: {
        tabBar: { label: "", icon: props => <Tab {...props} icon="home" /> }
      }
    },
    Groups: {
      screen: Home,
      navigationOptions: {
        tabBar: { label: "", icon: props => <Tab {...props} icon="chat" /> }
      }
    },
    Stats: {
      screen: Home,
      navigationOptions: {
        tabBar: {
          label: "",
          icon: props => <Tab {...props} icon="show-chart" />
        }
      }
    },
    User: {
      screen: Home,
      navigationOptions: {
        tabBar: { label: "", icon: props => <Tab {...props} icon="person" /> }
      }
    },
    Admin: {
      screen: Home,
      navigationOptions: {
        tabBar: { label: "", icon: props => <Tab {...props} icon="settings" /> }
      }
    }
  },
  options
);
