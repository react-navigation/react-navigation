import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackNavigator, withNavigation } from 'react-navigation';
import { Constants } from 'expo';
import Touchable from 'react-native-platform-touchable';
import TabsScreen from './screens/TabsScreen';
import DrawerScreen from './screens/DrawerScreen';
import createDumbStack from './screens/createDumbStack';
import createDumbTabs from './screens/createDumbTabs';

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

@withNavigation
class ExampleItem extends React.Component {
  render() {
    return (
      <View
        style={{
          borderBottomColor: '#eee',
          borderBottomWidth: 1,
        }}>
        <Touchable
          onPress={this._handlePress}
          style={{
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.props.common ? '#fffcd3' : '#fff',
          }}>
          <Text style={{ fontSize: 15 }}>
            {this.props.title} {this.props.common ? '(commonly used)' : null}
          </Text>
        </Touchable>
      </View>
    );
  }

  _handlePress = () => {
    this.props.navigation.navigate(this.props.route);
  };
}

class ExampleListScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 50, backgroundColor: '#fff' }}>
          <Text
            style={{
              fontSize: 25,
              textAlign: 'center',
              marginBottom: 20,
              paddingBottom: 20,
            }}>
            SafeAreaView Examples
          </Text>

          <ExampleItem title="Basic Tabs" route="tabs" common />
          {/* <ExampleItem title="Basic Drawer" route="drawer" /> */}
          <ExampleItem title="Header height" route="headerHeight" common />
          <ExampleItem title="Header padding" route="headerPadding" />
          <ExampleItem
            title="Header height and padding"
            route="headerHeightAndPadding"
          />
          <ExampleItem
            title="Header padding as percent"
            route="headerPaddingPercent"
          />
          <ExampleItem title="Header with margin" route="headerMargin" />
          <ExampleItem title="Tab bar height" route="tabBarHeight" common />
          <ExampleItem title="Tab bar padding" route="tabBarPadding" common />
          <ExampleItem
            common
            title="Tab bar height and padding"
            route="tabBarHeightAndPadding"
          />
          <ExampleItem title="Tab bar margin" route="tabBarMargin" />
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: Constants.statusBarHeight,
            backgroundColor: '#fff',
          }}
        />
      </View>
    );
  }
}

const StackWithHeaderHeight = createDumbStack({
  title: 'height: 150',
  headerStyle: { height: 150 },
});
const StackWithHeaderPadding = createDumbStack({
  title: 'padding: 100',
  headerStyle: { padding: 100 },
});
const StackWithHeaderHeightAndPadding = createDumbStack({
  title: 'height: 150, padding: 100',
  headerStyle: { height: 150, padding: 100 },
});
const StackWithHeaderPaddingPercent = createDumbStack({
  title: 'padding: 60%',
  headerStyle: { padding: '60%' },
});
const StackWithHeaderMargin = createDumbStack({
  title: 'margin: 20 (but why? :/)',
  headerStyle: { margin: 20 },
});

const TabBarWithHeight = createDumbTabs(
  {
    tabBarLabel: 'label!',
    tabBarOptions: {
      style: {
        height: 100,
      },
    },
  },
  createDumbStack({
    title: 'tabBar height 100',
  })
);

const TabBarWithPadding = createDumbTabs(
  {
    tabBarLabel: 'label!',
    tabBarOptions: {
      style: {
        padding: 20,
      },
    },
  },
  createDumbStack({
    title: 'tabBar padding 20',
  })
);

const TabBarWithHeightAndPadding = createDumbTabs(
  {
    tabBarLabel: 'label!',
    tabBarOptions: {
      style: {
        padding: 20,
        height: 100,
      },
    },
  },
  createDumbStack({
    title: 'tabBar height 100 padding 20',
  })
);

const TabBarWithMargin = createDumbTabs(
  {
    tabBarLabel: 'label!',
    tabBarOptions: {
      style: {
        margin: 20,
      },
    },
  },
  createDumbStack({
    title: 'tabBar margin 20',
  })
);

const RootStack = StackNavigator(
  {
    exampleList: {
      screen: ExampleListScreen,
    },
    tabs: {
      screen: TabsScreen,
    },
    headerHeight: {
      screen: StackWithHeaderHeight,
    },
    headerPadding: {
      screen: StackWithHeaderPadding,
    },
    headerHeightAndPadding: {
      screen: StackWithHeaderHeightAndPadding,
    },
    headerPaddingPercent: {
      screen: StackWithHeaderPaddingPercent,
    },
    headerMargin: {
      screen: StackWithHeaderMargin,
    },
    tabBarHeight: {
      screen: TabBarWithHeight,
    },
    tabBarPadding: {
      screen: TabBarWithPadding,
    },
    tabBarHeightAndPadding: {
      screen: TabBarWithHeightAndPadding,
    },
    tabBarMargin: {
      screen: TabBarWithMargin,
    },
  },
  {
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#fff',
    },
  }
);

// basic tabs (different navbar color, different tabbar color)
// different header height
// different header padding
// different header height and padding
// different header margin
// different tabbar height
// different tabbar padding
// different tabbar height and padding
// different tabbar margin
// without navbar, without safeareaview in one tab and with safeareaview in another tab
// all should be able to toggle between landscape and portrait

// basic drawer (different navbar color, mess around with drawer options)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
