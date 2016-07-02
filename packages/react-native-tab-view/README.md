React Native Tab View
=====================

A cross-platform Tab View component for React Native.

## Demo

<a href="https://raw.githubusercontent.com/satya164/react-native-tab-view/master/demo/demo.mp4"><img src="https://raw.githubusercontent.com/satya164/react-native-tab-view/master/demo/demo.gif" width="360"></a>

## Installation

```sh
npm install --save react-native-tab-view
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
    navigation: {
      index: 0,
      routes: [
        { key: '1', title: 'First' },
        { key: '2', title: 'Second' },
      ],
    },
  };

  _handleChangeTab = (index) => {
    this.setState({
      navigation: { ...this.state.navigation, index },
    });
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
        navigationState={this.state.navigation}
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
  - `onRequestChangeTab` - callback for when the current tab changes, should do the `setState`
  - `render` - callback which renders the tab view, gets a special set of props as argument

- `<TabViewAnimated />` - a convenience wrapper around `<TabViewTransitioner />`

  It accepts the following props in addition to `navigationState` and `onRequestChangeTab`,
  - `renderHeader` - callback which renders a header, useful for a top tab bar
  - `renderFooter` - callback which renders a footer, useful for a bottom tab bar
  - `renderScene` - callback which renders a single scene

- `<TabViewPage />` - container component for individual pages

  It accepts the following props,
  - `renderScene` - callback which receives the current scene and returns a React Element
  - `panHandlers` - pan handlers used for gesture (default is `TabViewPage.PanResponder.forSwipe(props)`), pass null to disable gestures
  - `style` - style object (default is `TabViewPage.StyleInterpolator.forSwipe(props)`), pass `TabViewPage.StyleInterpolator.forStatic(props)` to disable animations

- `<TabBarTop />` - material design themed tab bar

  It accepts the following props,
  - `pressColor` - color for material ripple (Android > 5.0 only)
  - `renderLabel` - callback which receives the current scene and returns a React Element to be used as a label
  - `tabItemStyle` - style object for the tab
  - `indicatorStyle` - style object for the tab indicator
