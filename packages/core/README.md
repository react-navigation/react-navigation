# `@react-navigation/core`

Core utilities for building navigators independent of the platform.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/core
```

## Usage

A basic custom navigator bundling a router and a view looks like this:

```js
import {
  createNavigatorFactory,
  useNavigationBuilder,
} from '@react-navigation/core';
import { StackRouter } from '@react-navigation/routers';

function StackNavigator({ initialRouteName, children, ...rest }) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder(StackRouter, {
      initialRouteName,
      children,
    });

  return (
    <NavigationContent>
      <StackView
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        {...rest}
      />
    </NavigationContent>
  );
}

export default createNavigatorFactory(StackNavigator);
```
