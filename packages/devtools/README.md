# `@react-navigation/devtools`

Developer tools for React Navigation.

Installation instructions and documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/devtools).

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/devtools
```

## Usage

For redux dev tools extension integration, you can pass a ref to the container:

```js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';

export default function App() {
  const navigationRef = React.useRef();

  useReduxDevToolsExtension(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>{/* ... */}</NavigationContainer>
  );
}
```
