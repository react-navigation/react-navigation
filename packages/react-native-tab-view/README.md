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
- Supports both top and bottom tab bars
- Follows Material Design spec
- Highly customizable
- Fully typed with [Flow](https://flow.org/)

## Demo

<a href="https://raw.githubusercontent.com/satya164/react-native-tab-view/master/demo/demo.mp4"><img src="https://raw.githubusercontent.com/satya164/react-native-tab-view/master/demo/demo.gif" width="360"></a>

## Installation

```sh
yarn add react-native-tab-view
```

## Quick Start

```js
import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);
const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

export default class TabViewExample extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
    ],
  };

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
```

[Try this example on Snack](https://snack.expo.io/@satya164/react-native-tab-view-quick-start)

## More examples on Snack

- [Custom Tab Bar](https://snack.expo.io/@satya164/react-native-tab-view-custom-tabbar)
- [Lazy Load](https://snack.expo.io/@satya164/react-native-tab-view-lazy-load)

## Integration with React Navigation

React Navigation integration can be achieved by the [react-navigation-tabs](https://github.com/react-navigation/react-navigation-tabs) package. Note that while it's easier to use, it is not as flexible as using the library directly.

## API reference

The package exports a `TabView` component which is the one you'd use to render the tab view, a `TabBar` component which is the default tab bar implementation, as well as several pager components for more fine-grained control.

In a trivial app, you'd mostly only use `TabView` and `TabBar`.

### `<TabView />`

Container component responsible for rendering and managing tabs.

#### Example

```js
<TabView
  navigationState={this.state}
  onIndexChange={index => this.setState({ index })}
  renderScene={SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  })}
/>
```

#### Props

- `navigationState` (required): the current navigation state, should contain a `routes` array containing the list of tabs, and an `index` property representing the current tab.
- `onIndexChange` (required): callback for when the current tab index changes, should update the navigation state.
- `renderScene` (required): callback which returns a React Element to use as the scene for a tab.
- `renderTabBar`: callback which returns a custom React Element to use as the tab bar.
- `renderPager`: callback which returns a custom React Element to handle swipe gesture and animation.
- `canJumpToTab`: callback which returns a boolean indicating whether jumping to the tab is allowed.
- `initialLayout`: object containing the initial `height` and `width`, can be passed to prevent the one frame delay in rendering.
- `tabBarPosition`: position of the tab bar, `'top'` or `'bottom'`. Defaults to `'top'`.

Any other props are passed to the underlying pager.

### `<TabBar />`

Material design themed tab bar. To pass props to the tab bar, you'd need to use the `renderTabBar` prop of `TabView` to render the `TabBar` and pass additional props.

#### Example

```js
renderTabBar={props =>
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'pink' }}
  />
}
```

#### Props

- `getLabelText`: callback which returns the label text to use for a tab. Defaults to uppercased route title.
- `getAccessible`: callback which returns a boolean to indicate whether to mark a tab as `accessible`. Defaults to `true`.
- `getAccessibilityLabel`: callback which returns an accessibility label for the tab. Defaults to route title.
- `getTestID`: callback which returns a test id for the tab.
- `renderIcon`: callback which returns a custom React Element to be used as a icon.
- `renderLabel`: callback which returns a custom React Element to be used as a label.
- `renderIndicator`: callback which returns a custom React Element to be used as a tab indicator.
- `renderBadge`: callback which returns a custom React Element to be used as a badge.
- `onTabPress`: callback invoked on tab press, useful for things like scroll to top.
- `onTabLongPress`: callback invoked on tab long-press, for example to show a drawer with more options.
- `pressColor`: color for material ripple (Android >= 5.0 only).
- `pressOpacity`: opacity for pressed tab (iOS and Android < 5.0 only).
- `scrollEnabled`: whether to enable scrollable tabs.
- `bounces`: whether the tab bar bounces when scrolling.
- `useNativeDriver`: whether to use native animations.
- `tabStyle`: style object for the individual tabs in the tab bar.
- `indicatorStyle`: style object for the active indicator.
- `labelStyle`: style object for the tab item label.
- `style`: style object for the tab bar.

### `<PagerPan />`

Cross-platform pager based on the [`PanResponder`](https://facebook.github.io/react-native/docs/panresponder.html).

#### Props

- `animationEnabled`: whether to enable page change animation.
- `swipeEnabled`: whether to enable swipe gestures.
- `swipeDistanceThreshold`: minimum swipe distance to trigger page switch.
- `swipeVelocityThreshold`: minimum swipe velocity to trigger page switch.
- `onSwipeStart`: optional callback when a swipe gesture starts.
- `onSwipeEnd`: optional callback when a swipe gesture ends.
- `onAnimationEnd`: optional callback when the transition animation ends.
- `getTestID`: optional callback which receives the current scene and returns a test id for the tab.
- `children`: React Element(s) to render.

### `<PagerScroll />`

Cross-platform pager based on [`ScrollView`](https://facebook.github.io/react-native/docs/scrollview.html) (default on iOS).

#### Props

- `animationEnabled`: whether to enable page change animation.
- `swipeEnabled`: whether to enable swipe gestures.
- `onSwipeStart`: optional callback when a swipe gesture starts.
- `onSwipeEnd`: optional callback when a swipe gesture ends.
- `onAnimationEnd`: optional callback when the transition animation ends.
- `getTestID`: optional callback which receives the current scene and returns a test id for the tab.
- `children`: React Element(s) to render.

There are some caveats when using this pager on Android, such as poor support for intial index other than `0` and weird animation curves.

### `<PagerAndroid />`

Android only pager based on `ViewPagerAndroid` (default on Android).

#### Props

- `animationEnabled`: whether to enable page change animation.
- `swipeEnabled`: whether to enable swipe gestures.
- `onSwipeStart`: optional callback when a swipe gesture starts.
- `onSwipeEnd`: optional callback when a swipe gesture ends.
- `onAnimationEnd`: optional callback when the transition animation ends.
- `keyboardDismissMode`: whether the keyboard gets dismissed in response to a drag in [ViewPagerAndroid](https://facebook.github.io/react-native/docs/viewpagerandroid.html#keyboarddismissmode) (Default: `on-drag`).
- `getTestID`: optional callback which receives the current scene and returns a test id for the tab.
- `children`: React Element(s) to render.

### `<PagerExperimental />`

Cross-platform pager component based on [`react-native-gesture-handler`](https://github.com/kmagiera/react-native-gesture-handler).

#### Props

- `GestureHandler`: the gesture handler module to use.
- `animationEnabled`: whether to enable page change animation.
- `swipeEnabled`: whether to enable swipe gestures.
- `onSwipeStart`: optional callback when a swipe gesture starts.
- `onSwipeEnd`: optional callback when a swipe gesture ends.
- `onAnimationEnd`: optional callback when the transition animation ends.
- `useNativeDriver`: whether to use native animations.
- `getTestID`: optional callback which receives the current scene and returns a test id for the tab.
- `children`: React Element(s) to render.

This pager is still experimental. To use this pager, you'll need to [link the `react-native-gesture-handler` library](https://github.com/kmagiera/react-native-gesture-handler#installation), and pass it as a prop to the pager:

```js
import * as GestureHandler from 'react-native-gesture-handler';

...

<PagerExperimental {...props} GestureHandler={GestureHandler} />
```

### `SceneMap`

Helper function which takes an object with the mapping of `route.key` to React components and returns a function to use with `renderScene` prop.

```js
renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});
```

Each scene receives the following props:

- `route`: the current route rendered by the component
- `jumpTo`: method to jump to other tabs, takes a `route.key` as it's argument

All the scenes rendered with `SceneMap` are optimized using `React.PureComponent` and don't re-render when parent's props or states change. If you don't want this behaviour, or want to pass additional props to your scene components, use `renderScene` directly instead of using `SceneMap`.

```js
renderScene = ({ route }) => {
  switch (route.key) {
    case 'first':
      return <FirstRoute />;
    case 'second':
      return <SecondRoute />;
    default:
      return null;
  }
}
```

If you don't use `SceneMap`, you will need to take care of optimizing the individual scenes.

_IMPORTANT:_ **Do not** pass inline functions to `SceneMap`, for example, don't do the following:

```js
SceneMap({
  first: () => <FirstRoute foo={this.props.foo} />,
  second: SecondRoute,
});
```

Always define your components elsewhere in the top level of the file. If you pass inline functions, it'll re-create the component every render, which will cause the entire route to unmount and remount every change. It's very bad for performance and will also cause any local state to be lost.

## Known Issues

- `TabView` cannot be nested inside another `TabView` or a horizontal `ScrollView` on Android. This is a limitation of the platform and we cannot fix it in the library.

## Optimization Tips

### Use native driver

Using native animations and gestures can greatly improve the performance. To use native animations and gestures, you will need to use `PagerExperimental` as your pager and pass `useNativeDriver` in `TabView`.

```js
<TabView
  navigationState={this.state}
  renderPager={this._renderPager}
  renderScene={this._renderScene}
  renderTabBar={this._renderTabBar}
  onIndexChange={this._handleIndexChange}
  useNativeDriver
/>
```

_NOTE:_ Native animations are supported only for properties such as `opacity` and `translation`. If you are using a custom tab bar or indicator, you need to make sure that you animate only these style properties.

### Avoid unnecessary re-renders

The `renderScene` function is called every time the index changes. If your `renderScene` function is expensive, it's good idea move each route to a separate component if they don't depend on the index, and apply `shouldComponentUpdate` in your route components to prevent unnecessary re-renders.

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
};
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
};
```

Where `<HomeComponent />` is a `PureComponent`:

```js
export default class HomeComponent extends React.PureComponent {
  render() {
    return (
      <View style={styles.page}>
        <Avatar />
        <NewsFeed />
      </View>
    )
  }
}
```

### Avoid one frame delay

We need to measure the width of the container and hence need to wait before rendering some elements on the screen. If you know the initial width upfront, you can pass it in and we won't need to wait for measuring it. Most of the time, it's just the window width.

For example, pass the following `initialLayout` to `TabView`:

```js
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};
```

The tab view will still react to changes in the dimension and adjust accordingly to accommodate things like orientation change.

### Optimize large number of routes

If you've a large number of routes, especially images, it can slow the animation down a lot. You can instead render a limited number of routes.

For example, do the following to render only 2 routes on each side:

```js
renderScene = ({ route }) => {
  if (Math.abs(this.state.index - this.state.routes.indexOf(route)) > 2) {
    return <View />;
  }

  return <MySceneComponent route={route} />;
};
```

### Avoid rendering TabView inside ScrollView

Nesting the `TabView` inside a vertical `ScrollView` will disable the optimizations in the `FlatList` components rendered inside the `TabView`. So avoid doing it if possible.

## Contributing

While developing, you can run the [example app](/example/README.md) to test your changes.

Make sure the tests still pass, and your code passes Flow and ESLint. Run the following to verify:

```sh
yarn test
yarn flow
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint -- --fix
```

Remember to add tests for your change if possible.

<!-- badges -->

[build-badge]: https://img.shields.io/circleci/project/github/react-native-community/react-native-tab-view/master.svg?style=flat-square
[build]: https://circleci.com/gh/react-native-community/react-native-tab-view
[version-badge]: https://img.shields.io/npm/v/react-native-tab-view.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-native-tab-view
[license-badge]: https://img.shields.io/npm/l/react-native-tab-view.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
