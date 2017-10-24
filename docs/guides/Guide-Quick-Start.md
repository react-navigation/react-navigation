# Quick Start Guide

To get started with React Navigation, all you have to do is install the `react-navigation` npm package.

### Install with NPM

```
npm install --save react-navigation
```

### Install with Yarn

```
yarn add react-navigation
```

To start using React Navigation you'll have to create a navigator. React Navigation comes with three default navigators.

- `StackNavigator` - Provides a way for your app to transition between screens where each new screen is placed on top of a stack.
- `TabNavigator` - Used to set up a screen with several tabs.
- `DrawerNavigator` - Used to set up a screen with drawer navigation.

## Creating a StackNavigator

StackNavigator's are the most common form of navigator so we'll use it as a basic demonstration. To get started, create a `StackNavigator`.

```javascript
import { StackNavigator } from 'react-navigation';

const RootNavigator = StackNavigator({

});

export default RootNavigator;
```

We can then add screens to this `StackNavigator`. Each key represents a screen.

```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

const HomeScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home Screen</Text>
  </View>
);

const DetailsScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Details Screen</Text>
  </View>
);

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Details: {
    screen: DetailsScreen,
  },
});

export default RootNavigator;
```

Now let's add a title to the navigation bar.

```javascript
...

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home',
    },
  },
  Details: {
    screen: DetailsScreen,
    navigationOptions: {
      headerTitle: 'Details',
    },
  },
});

export default RootNavigator;
```

Finally, we should be able to navigate from the home screen to the details screen. When you register a component with a navigator that component will then have a `navigation` prop added to it. This `navigation` prop drives how we use move between different screens.

To move from the home screen to the details screen we'll want to use `navigation.navigate`, like so:

```javascript
...
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home Screen</Text>
    <Button
      onPress={() => navigation.navigate('Details')}
      title="Go to details"
    />
  </View>
);

...
```

And there you have it! That's the basics of using the [StackNavigator](/docs/navigators/stack), and React Navigation as a whole. Here's the full code from this example:

<div class="snack" data-snack-id="HJlnU0XTb" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.16);border-radius:4px;height:505px;width:100%"></div>

## Creating a TabNavigator

To get started with `TabNavigator` first import and create a new `RootTabs` component.

```javascript
import { TabNavigator } from 'react-navigation';

const RootTabs = TabNavigator({

});

export default RootTabs;
```

We then need to create some screens and add them to our `TabNavigator`.

```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { TabNavigator } from 'react-navigation';

const HomeScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

const RootTabs = TabNavigator({
  Home: {
    screen: HomeScreen,
  },
  Profile: {
    screen: ProfileScreen,
  },
});

export default RootTabs;
```

Getting there! Now let's explicity set a label and icon for the tab bar.

> We'll be using [`react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons) in the example. If you don't have it installed in your project already please do so.

```javascript
...
import Ionicons from 'react-native-vector-icons/Ionicons';

...

const RootTabs = TabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-home' : 'ios-home-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-person' : 'ios-person-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
});

export default RootTabs;
```

This will ensure the `tabBarLabel` is consistent (important when using nested navigators) and it will set a `tabBarIcon`. This icon will only be visible on iOS by default given the tab bar component used, which aligns with standard design patterns on Android.

You can view the complete finished code below:

<div class="snack" data-snack-id="BJZ2GVVpb" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.16);border-radius:4px;height:505px;width:100%"></div>

## Creating a DrawerNavigator

To get started with `DrawerNavigator` first import and create a new `RootDrawer` component.

```javascript
import { DrawerNavigator } from 'react-navigation';

const RootDrawer = DrawerNavigator({

});

export default RootDrawer;
```

We then need to create some screens and add them to our `DrawerNavigator`.

```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { DrawerNavigator } from 'react-navigation';

const HomeScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

const RootDrawer = DrawerNavigator({
  Home: {
    screen: HomeScreen,
  },
  Profile: {
    screen: ProfileScreen,
  },
});

export default RootDrawer;
```

Getting there! Now let's explicity set a label and icon for the drawer items.

> We'll be using `react-native-vector-icons` in the example. If you don't have it installed in your project already please do so.

```javascript
...
import Ionicons from 'react-native-vector-icons/Ionicons';

...

const RootDrawer = DrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: 'Home',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-home' : 'ios-home-outline'}
          size={20}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      drawerLabel: 'Profile',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-person' : 'ios-person-outline'}
          size={20}
          style={{ color: tintColor }}
        />
      ),
    },
  },
});

export default RootDrawer;
```

To open the drawer you can swipe from the left edge of the screen to the right. You've also got the option to open the drawer view `navigation.navigate('DrawerToggle')`, which we'll add to the Home component now. Make sure you import the `Button` component from `react-native`.

```javascript
...

const HomeScreen = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home Screen</Text>
    <Button
      onPress={() => navigation.navigate('DrawerToggle')}
      title="Open Drawer"
    />
  </View>
);

...
```

You can view the finished code below.

<div class="snack" data-snack-id="rk90N44a-" data-snack-platform="ios" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.16);border-radius:4px;height:505px;width:100%"></div>
