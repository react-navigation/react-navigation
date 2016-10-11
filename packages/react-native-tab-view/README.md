React Native Tab View
=====================

A cross-platform Tab View component for React Native.

This is a JavaScript-only implementation of swipeable tab views. It's super customizable, allowing you to do things like coverflow.

- [Run the
example app to see it in
action](https://getexponent.com/@rncommunity/react-native-tab-view-demos).
- Checkout the [example/](https://github.com/react-native-community/react-native-tab-view/tree/master/example) folder for source code.

## Features

- Smooth animations and gestures
- Scrollable tabs
- Both top and bottom tab bars
- Follows Material Design spec
- Highly customizable

## Demo

<a href="https://raw.githubusercontent.com/satya164/react-native-tab-view/master/demo/demo.mp4"><img src="https://raw.githubusercontent.com/satya164/react-native-tab-view/master/demo/demo.gif" width="360"></a>


## Installation

```sh
npm install --save react-native-tab-view react-addons-shallow-compare
```


## Example

```js
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabViewAnimated, TabBarTop } from 'react-native-tab-view';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class TabViewExample extends Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'First' },
      { key: '2', title: 'Second' },
    ],
  };

  _handleChangeTab = (index) => {
    this.setState({ index });
  };

  _renderHeader = (props) => {
    return <TabBarTop {...props} />;
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
    case '1':
      return <View style={[ styles.page, { backgroundColor: '#ff4081' } ]} />;
    case '2':
      return <View style={[ styles.page, { backgroundColor: '#673ab7' } ]} />;
    default:
      return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}
```


## API

The package exposes the following components,

### `<TabViewTransitioner />`

Container component responsible for managing tab transitions

It accepts the following props,
- `navigationState` - the current navigation state
- `configureTransition` - optional callback which returns a configuration for the transition, return `null` to disable animation
- `onRequestChangeTab` - callback for when the current tab changes, should do the `setState`
- `onChangePosition` - callback called with position value as it changes (e.g. - on swipe or tab change), avoid doing anything expensive here
- `shouldOptimizeUpdates` - whether to implement a `shouldComponentUpdate` strategy to minimize updates, enabled by default
- `render` - callback which renders the tab view, gets a special set of props as argument

### `<TabViewAnimated />`

A convenience wrapper around `<TabViewTransitioner />`

It accepts the following props in addition to all the props accepted by `<TabViewTransitioner />` (except `render`),
- `renderPager` - optional callback which renders a pager responsible for handling swipes
- `renderHeader` - optional callback which renders a header, useful for a top tab bar
- `renderFooter` - optional callback which renders a footer, useful for a bottom tab bar
- `renderScene` - callback which renders a single scene
- `lazy` - whether to load tabs lazily when you start switching

### `<TabViewPagerPan />`

Pager component based on `PanResponder` (default)

It accepts the following props,
- `swipeEnabled` - whether to enable swipe gestures
- `swipeDistanceThreshold` - minimum swipe distance to trigger page switch
- `swipeVelocityThreshold` - minimum swipe velocity to trigger page switch
- `children` - React Element(s) to render

### `<TabViewPagerScroll />`

Pager component based on `ScrollView`

It accepts the following props,
- `swipeEnabled` - whether to enable swipe gestures
- `children` - React Element(s) to render

### `<TabViewPagerAndroid />`

Pager component based on `ViewPagerAndroid`
It accepts the following props,
- `swipeEnabled` - whether to enable swipe gestures
- `children` - React Element(s) to render

### `<TabBar />`

Basic tab bar

It accepts the following props,
- `renderIcon` - optional callback which receives the current scene and returns a React Element to be used as a icon
- `renderLabel` - optional callback which receives the current scene and returns a React Element to be used as a label
- `renderIndicator` - optional callback which receives the current scene and returns a React Element to be used as a tab indicator
- `renderBadge` - optional callback which receives the current scene and returns a React Element to be used as a badge
- `onTabPress` - optional callback invoked on tab press, useful for things like scroll to top
- `pressColor` - color for material ripple (Android > 5.0 only)
- `scrollEnabled` - whether to enable scrollable tabs
- `tabWidth` - optional custom tab width for scrollable tabs
- `tabStyle` - style object for the tab

### `<TabBarTop />`

Material design themed top tab bar

It accepts the following props in addition to the props accepted by `<TabBar />`,
- `renderLabel` - optional callback which receives the current scene and returns a React Element to be used as a label
- `indicatorStyle` - style object for the tab indicator
- `labelStyle` - style object for the tab label


Check the [type definitions](src/TabViewTypeDefinitions.js) for details on shape of different objects.


## Caveats

`<TabViewAnimated />` and `<TabViewTransitioner />` implement `shouldComponentUpdate` to prevent unnecessary re-rendering. As a side-effect, the tabs won't re-render if something changes in the parent's state. If you need it to trigger a re-render, put it in the `navigationState`.

For example, consider you have a `loaded` property on state which should trigger re-render. You can have your state like the following -

```js
state = {
  index: 0,
  routes: [
    { key: '1', title: 'First' },
    { key: '2', title: 'Second' },
  ],
  loaded: false,
}
```

Then pass `this.state` as the `navigationState` prop to `<TabViewAnimated />` or `<TabViewTransitioner />`.


```js
<TabViewAnimated
  navigationState={this.state}
  renderScene={this._renderPage}
  renderHeader={this._renderHeader}
  onRequestChangeTab={this._handleChangeTab}
/>
```


## Optimization Tips

- The `renderScene` function is called every time the index changes. If your `renderScene` function is expensive, it's good idea move it to a separate component if your `renderScene` function doesn't depend on the index, and apply `shouldComponentUpdate` to prevent unnecessary re-renders.
- If you've a large number of routes, especially images, it can slow the animation down a lot. You can instead render a limited number of routes. In your `renderScene` function, do the following to render only 2 routes on each side,

  ```js
  renderScene = ({ route }) => {
    if (Math.abs(this.state.navigation.index - this.state.navigation.routes.indexOf(route)) > 2) {
      return null;
    }

    return <MySceneComponent route={route} />;
  };
  ```
