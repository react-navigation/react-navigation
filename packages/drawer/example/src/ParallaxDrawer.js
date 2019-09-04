import React from 'react';
import {
  Button,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { createStackNavigator } from 'react-navigation-stack';
import { ThemeColors, useTheme } from '@react-navigation/core';
import { Themed, SafeAreaView } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated from 'react-native-reanimated';
import { createDrawerNavigator } from 'react-navigation-drawer';

const SampleText = ({ children }) => <Themed.Text>{children}</Themed.Text>;

const MyNavScreen = ({ navigation, banner }) => {
  let theme = useTheme();

  return (
    <ScrollView>
      <SafeAreaView forceInset={{ top: 'always' }}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <SampleText>{banner}</SampleText>
        </View>
        <Themed.TextInput
          style={{
            flex: 1,
            height: 35,
            marginHorizontal: 10,
            marginVertical: 10,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: ThemeColors[theme].bodyBorder,
            textAlign: 'center',
          }}
          placeholder="Focus this TextInput then drag the drawer!"
        />
        <Button onPress={() => navigation.openDrawer()} title="Open drawer" />
        <Button
          onPress={() => navigation.toggleDrawer()}
          title="Toggle drawer"
        />
        <Button
          onPress={() => {
            navigation.openDrawer();
            navigation.closeDrawer();
          }}
          title="Open and immediately close"
        />
        <Button
          onPress={() => {
            navigation.closeDrawer();
            navigation.openDrawer();
          }}
          title="Close and immediately open"
        />
        <Button
          onPress={() => {
            navigation.openDrawer();
            setTimeout(() => {
              navigation.closeDrawer();
            }, 150);
          }}
          title="Open then close drawer shortly after"
        />
        <Button
          onPress={() => navigation.navigate('Email')}
          title="Open other screen"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back" />
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Go back to list"
        />
        {
          {
            'locked-open': (
              <Button
                onPress={() =>
                  navigation.setParams({ drawerLockMode: 'locked-closed' })
                }
                title="Set locked-closed"
              />
            ),
            'locked-closed': (
              <Button
                onPress={() =>
                  navigation.setParams({ drawerLockMode: 'unlocked' })
                }
                title="Set unlocked"
              />
            ),
            unlocked: (
              <Button
                onPress={() =>
                  navigation.setParams({ drawerLockMode: 'locked-open' })
                }
                title="Set locked-open"
              />
            ),
          }[navigation.getParam('drawerLockMode', 'unlocked')]
        }
      </SafeAreaView>
      <Themed.StatusBar />
    </ScrollView>
  );
};

const InboxScreen = ({ navigation }) => (
  <MyNavScreen banner="Inbox Screen" navigation={navigation} />
);
InboxScreen.navigationOptions = {
  headerTitle: 'Inbox',
};

const EmailScreen = ({ navigation }) => (
  <MyNavScreen banner="Email Screen" navigation={navigation} />
);

const DraftsScreen = ({ navigation }) => (
  <MyNavScreen banner="Drafts Screen" navigation={navigation} />
);
DraftsScreen.navigationOptions = {
  headerTitle: 'Drafts',
};

const InboxStack = createStackNavigator(
  {
    Inbox: { screen: InboxScreen },
    Email: { screen: EmailScreen },
  },
  {
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Inbox',
      drawerLockMode: (
        navigation.state.routes[navigation.state.index].params || {}
      ).drawerLockMode,
      drawerIcon: ({ tintColor }) => (
        <MaterialIcons
          name="move-to-inbox"
          size={24}
          style={{ color: tintColor }}
        />
      ),
    }),
  }
);

const DraftsStack = createStackNavigator(
  {
    Drafts: { screen: DraftsScreen },
    Email: { screen: EmailScreen },
  },
  {
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Drafts',
      drawerLockMode: (
        navigation.state.routes[navigation.state.index].params || {}
      ).drawerLockMode,
      drawerIcon: ({ tintColor }) => (
        <MaterialIcons name="drafts" size={24} style={{ color: tintColor }} />
      ),
    }),
  }
);

const DrawerContents = ({ drawerOpenProgress, navigation }) => {
  // `contentComponent` is passed an Animated.Value called drawerOpenProgress
  // that can be used to do interesting things like a simple parallax drawe
  const translateX = Animated.interpolate(drawerOpenProgress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      <ScrollView>
        <SafeAreaView forceInset={{ top: 'always' }}>
          <DrawerItem navigation={navigation} item="Drafts" />
          <DrawerItem navigation={navigation} item="Email" />
        </SafeAreaView>
      </ScrollView>
    </Animated.View>
  );
};

const DrawerItem = props => {
  return (
    <TouchableOpacity onPress={() => props.navigation.navigate(props.item)}>
      <Themed.Text style={{ padding: 10, fontSize: 18, fontWeight: '600' }}>
        {props.item}
      </Themed.Text>
    </TouchableOpacity>
  );
};

function createDrawerExample(options = {}) {
  let DrawerExample = createDrawerNavigator(
    {
      Inbox: {
        path: '/',
        screen: InboxStack,
      },
      Drafts: {
        path: '/sent',
        screen: DraftsStack,
      },
    },
    {
      overlayColor: 'rgba(0,0,0,0)',
      drawerType: 'back',
      drawerBackgroundColor: {
        light: '#eee',
        dark: '#888',
      },
      screenContainerStyle: {
        shadowColor: '#000000',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: { height: 0, width: -4 },
      },
      contentComponent: DrawerContents,
      drawerWidth: Dimensions.get('window').width * 0.8,
      navigationOptions: {
        header: null,
      },
      contentOptions: {
        activeTintColor: '#e91e63',
      },
      ...options,
    }
  );

  return DrawerExample;
}

export const ParallaxDrawer = createDrawerExample();
