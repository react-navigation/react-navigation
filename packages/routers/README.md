# `@react-navigation/routers`

Routers to help build custom navigators.

You probably don't need to use this package directly if you're not building custom navigators.

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/core @react-navigation/routers
```

## Usage

A basic custom navigator bundling a router and a view looks like this:

```js
import { useNavigationBuilder } from '@react-navigation/core';
import { StackRouter } from '@react-navigation/routers';

function StackNavigator({ initialRouteName, children, ...rest }) {
  const { state, navigation, descriptors } = useNavigationBuilder(StackRouter, {
    initialRouteName,
    children,
  });

  return (
    <StackView
      state={state}
      navigation={navigation}
      descriptors={descriptors}
      {...rest}
    />
  );
}

export default createNavigator(StackNavigator);
```
