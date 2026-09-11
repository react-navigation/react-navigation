# `@react-navigation/core`

Core utilities for building navigators independent of the platform.

## Installation

Open a Terminal in your project's folder and run,

```sh
npm install @react-navigation/core
```

## Usage

A basic custom navigator bundling a router and a view looks like this:

```js
import {
  createNavigatorFactory,
  createScreenFactory,
  useNavigationBuilder,
} from '@react-navigation/core';
import { StackRouter } from '@react-navigation/routers';

function StackNavigator({ initialRouteName, children, ...rest }) {
  const { state, navigation, descriptors, render } = useNavigationBuilder(
    StackRouter,
    {
      initialRouteName,
      children,
    }
  );

  return render(
    <StackView
      state={state}
      navigation={navigation}
      descriptors={descriptors}
      {...rest}
    />
  );
}

export const createStackNavigator = createNavigatorFactory(StackNavigator);

export const createStackScreen = createScreenFactory();
```
