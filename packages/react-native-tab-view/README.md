# React Native Tab View

[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]

A cross-platform Tab View component for React Native.

This is a JavaScript-only implementation of swipeable tab views. It's super customizable, allowing you to do things like coverflow.

- [Run the example app to see it in action](https://expo.io/@satya164/react-native-tab-view-demos).
- Checkout the [example/](https://github.com/react-native-community/react-native-tab-view/tree/master/example) folder for source code.


## Features

- Smooth animations and gestures
- Scrollable tabs
- Both top and bottom tab bars
- Follows Material Design spec
- Highly customizable
- Fully typed with [Flow](https://flow.org/)


## Demo

<a href="https://raw.githubusercontent.com/satya164/react-native-tab-view/master/demo/demo.mp4"><img src="https://raw.githubusercontent.com/satya164/react-native-tab-view/master/demo/demo.gif" width="360"></a>


## Installation

```sh
yarn add react-native-tab-view react-native-gesture-handler
```


## Example

```js
import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const FirstRoute = () => <View style={[ styles.container, { backgroundColor: '#ff4081' } ]} />;
const SecondRoute = () => <View style={[ styles.container, { backgroundColor: '#673ab7' } ]} />;

export default class TabViewExample extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} />;

  _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```


## API

The package exposes a `TabViewAnimated` component which manages the state and animated values, and renders components such as the headers, footers and the pager. Pager components render the routes as pages, as well as handle the gestures and transitions. Various pager components are implemented in the library to provide the best experience according to the platform. The pager best suited to the platform is automatically used by default.

Check the [type definitions](src/TabViewTypeDefinitions.js) for details on shape of different props.

### `<TabViewAnimated />`

Container component responsible for managing tab transitions.

#### Props

- `navigationState` - the current navigation state
- `onIndexChange` - callback for when the current tab index changes, should do the `setState`
- `canJumpToTab` - optional callback which accepts a route, and returns a boolean indicating whether jumping to the tab is allowed
- `initialLayout` - optional object containing the initial `height` and `width`, can be passed to prevent the one frame delay in rendering
- `renderHeader` - optional callback which returns a react element to use as top tab bar
- `renderFooter` - optional callback which returns a react element to use as bottom tab bar
- `renderPager` - optional callback which returns a react element to handle swipe gesture and animation
- `renderScene` - callback which returns a react element to use as a scene

Any other props are passed to the underlying pager.

### `<TabBar />`

Material design themed tab bar. Can be used as both top and bottom tab bar.

#### Props

- `getLabelText` - optional callback which receives the current scene and returns the tab label
- `renderIcon` - optional callback which receives the current scene and returns a React Element to be used as a icon
- `renderLabel` - optional callback which receives the current scene and returns a React Element to be used as a label
- `renderIndicator` - optional callback which receives the current scene and returns a React Element to be used as a tab indicator
- `renderBadge` - optional callback which receives the current scene and returns a React Element to be used as a badge
- `onTabPress` - optional callback invoked on tab press which receives the scene for the pressed tab, useful for things like scroll to top
- `pressColor` - color for material ripple (Android >= 5.0 only)
- `pressOpacity` - opacity for pressed tab (iOS and Android < 5.0 only)
- `scrollEnabled` - whether to enable scrollable tabs
- `useNativeDriver` - whether to use native animations
- `tabStyle` - style object for the individual tabs in the tab bar
- `indicatorStyle` - style object for the active indicator
- `labelStyle` - style object for the tab item label
- `style` - style object for the tab bar

### `<TabViewPagerPan />`

Cross-platform pager based on the [`PanResponder`](https://facebook.github.io/react-native/docs/panresponder.html).

#### Props

- `configureTransition` - optional callback which returns a configuration for the transition
- `animationEnabled` - whether to enable page change animation
- `swipeEnabled` - whether to enable swipe gestures
- `swipeDistanceThreshold` - minimum swipe distance to trigger page switch
- `swipeVelocityThreshold` - minimum swipe velocity to trigger page switch
- `onSwipeStart` - optional callback when a swipe gesture starts
- `onSwipeEnd` - optional callback when a swipe gesture ends
- `children` - React Element(s) to render

### `<TabViewPagerScroll />`

Cross-platform pager based on [`ScrollView`](https://facebook.github.io/react-native/docs/scrollview.html) (default on iOS).

#### Props

- `animationEnabled` - whether to enable page change animation
- `swipeEnabled` - whether to enable swipe gestures
- `children` - React Element(s) to render

There are some caveats when using this pager on Android, such as poor support for intial index other than `0` and weird animation curves.

### `<TabViewPagerAndroid />`

Android only pager based on `ViewPagerAndroid` (default on Android).

#### Props

- `animationEnabled` - whether to enable page change animation
- `swipeEnabled` - whether to enable swipe gestures
- `children` - React Element(s) to render

### `<TabViewPagerExperimental />`

Cross-platform pager component based on [`react-native-gesture-handler`](https://github.com/kmagiera/react-native-gesture-handler).

#### Props

- `GestureHandler` - the gesture handler module to use
- `animationEnabled` - whether to enable page change animation
- `swipeEnabled` - whether to enable swipe gestures
- `useNativeDriver` - whether to use native animations
- `children` - React Element(s) to render

This pager is still experimental as the underlying library is still in alpha. To use this pager, you'll need to [link the `react-native-gesture-handler` library](https://github.com/kmagiera/react-native-gesture-handler#installation), and pass it as a prop to the pager:

```js
import * as GestureHandler from 'react-native-gesture-handler';

...

<TabViewPagerExperimental {...props} GestureHandler={GestureHandler} />
```


## Optimization Tips

### Use native driver

Using native animations and gestures can greatly improve the performance. To use native animations and gestures, you will need to use `TabViewPagerExperimental` as your pager and pass `useNativeDriver` in `TabViewAnimated`.

```js
<TabViewAnimated
  navigationState={this.state}
  renderPager={this._renderPager}
  renderScene={this._renderScene}
  renderHeader={this._renderHeader}
  onIndexChange={this._handleIndexChange}
  useNativeDriver
/>
```

_NOTE:_ Native animations are supported only for properties such as `opacity` and `translation`. If you are using a custom tab bar or indicator, you need to make sure that you animate only these style properties.

### Avoid unnecessary re-renders

The `renderScene` function is called every time the index changes. If your `renderScene` function is expensive, it's good idea move each route to a separate component if they don't depend on the index, and apply `shouldComponentUpdate` to prevent unnecessary re-renders.

For example, instead of:

```js
renderScene = ({ route }) => {
  switch (route.key) {
  case 'home':
    return (
      <View style={styles.page}>
        <Avatar />
        <NewsFeed />
      </View>
    );
  default:
    return null;
  }
}
```

Do the following:

```js
renderScene = ({ route }) => {
  switch (route.key) {
  case 'home':
    return <HomeComponent />;
  default:
    return null;
  }
}
```

Where `<HomeComponent />` is a `PureComponent`.

If you are using the `SceneMap` helper, the scenes are already optimized with `PureComponent` and won't re-render if parent's state changes.

### Avoid one frame delay

We need to measure the width of the container and hence need to wait before rendering some elements on the screen. If you know the initial width upfront, you can pass it in and we won't need to wait for measuring it. Most of the time, it's just the window width.

For example, pass the following `initialLayout` to `TabViewAnimated`:

```js
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};
```

The tabview will still react to changes in the dimension and adjust accordingly to accommodate things like orientation change.


### Optimize large number of routes

If you've a large number of routes, especially images, it can slow the animation down a lot. You can instead render a limited number of routes.

For example, do the following to render only 2 routes on each side:

```js
renderScene = ({ route }) => {
  if (Math.abs(this.state.index - this.state.routes.indexOf(route)) > 2) {
    return null;
  }

  return <MySceneComponent route={route} />;
};
```


## Contributing

While developing, you can run the [example app](/example/README.md) to test your changes.

Make sure the tests still pass, and your code passes Flow and ESLint. Run the following to verify:

```sh
yarn test
yarn run flow
yarn run lint
```

To fix formatting errors, run the following:

```sh
yarn run lint -- --fix
```

Remember to add tests for your change if possible.

<!-- badges -->
[build-badge]: https://img.shields.io/circleci/project/github/react-native-community/react-native-tab-view/master.svg?style=flat-square
[build]: https://circleci.com/gh/react-native-community/react-native-tab-view
[version-badge]: https://img.shields.io/npm/v/react-native-tab-view.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-native-tab-view
[license-badge]: https://img.shields.io/npm/l/react-native-tab-view.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
