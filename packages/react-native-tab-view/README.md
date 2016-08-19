React Native Tab View
=====================

A cross-platform Tab View component for React Native.

This is a JavaScript-only implementation of swipeable tab views. It's super customizable, allowing you to do things like coverflow. Run the example app to see it in action.

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
import { TabViewAnimated, TabViewPage, TabBarTop } from 'react-native-tab-view';

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

  _renderPage = (props) => {
    return <TabViewPage {...props} renderScene={this._renderScene} />;
  };

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderPage}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}
```

## API

The package exposes the following components,

- `<TabViewTransitioner />` - container component responsible for managing tab transitions

  It accepts the following props,
  - `navigationState` - the current navigation state
  - `configureAnimation` - optional callback which performs animation and returns a promise
  - `onRequestChangeTab` - callback for when the current tab changes, should do the `setState`
  - `onChangePosition` - callback called with position value when the it changes, avoid doing anything expensive here
  - `render` - callback which renders the tab view, gets a special set of props as argument

- `<TabViewAnimated />` - a convenience wrapper around `<TabViewTransitioner />`

  It accepts the following props in addition to `navigationState` and `onRequestChangeTab`,
  - `renderHeader` - callback which renders a header, useful for a top tab bar
  - `renderFooter` - callback which renders a footer, useful for a bottom tab bar
  - `renderScene` - callback which renders a single scene
  - `lazy` - whether to load tabs lazily when you start switching

- `<TabViewPage />` - container component for individual pages

  It accepts the following props,
  - `renderScene` - callback which receives the current scene and returns a React Element
  - `panHandlers` - pan handlers used for gesture (default is `TabViewPage.PanResponder.forHorizontal(props)`), pass `null` to disable gestures
  - `style` - style object (default is `TabViewPage.StyleInterpolator.forHorizontal(props)`)

- `<TabBar />` - basic tab bar

  It accepts the following props,
  - `pressColor` - color for material ripple (Android > 5.0 only)
  - `renderIcon` - optional callback which receives the current scene and returns a React Element to be used as a icon
  - `renderLabel` - optional callback which receives the current scene and returns a React Element to be used as a label
  - `renderIndicator` - optional callback which receives the current scene and returns a React Element to be used as a tab indicator
  - `tabStyle` - style object for the tab

- `<TabBarTop />` - material design themed top tab bar

  It accepts the following props in addition to the props accepted by `<TabBar />`,
  - `renderLabel` - optional callback which receives the current scene and returns a React Element to be used as a label
  - `indicatorStyle` - style object for the tab indicator
  - `labelStyle` - style object for the tab label


Check the [type definitions](src/TabViewTypeDefinitions.js) for details on shape of different objects.


### Optimization Tips

- The `renderScene` function is called every time the index changes. If your `renderScene` function is expensive, it's good idea move it to a separate component if your `renderScene` function doesn't depend on the index, and apply `shouldComponentUpdate` to prevent unnecessary re-renders.
- If you've a large number of routes, especially images, it can slow the animation down quite a lot. You can instead render a limited number of routes. In your `renderScene` function, do the following to render only 2 routes on each side,

  ```js
  renderScene = ({ route }) => {
    if (Math.abs(this.state.navigation.index - this.state.navigation.routes.indexOf(route)) > 2) {
      return null;
    }

    return <MySceneComponent route={route} />;
  };
  ```
