# `@react-navigation/native`

React Native integration for React Navigation.

Documentation can be found on the [React Navigation website](https://reactnavigation.org/docs/en/next/getting-started.html).

## Installation

Open a Terminal in your project's folder and run,

```sh
yarn add @react-navigation/native
```

## Usage

```js
const ref = React.useRef();

useBackButton(ref);

const { getInitialState } = useLinking(ref, {
  prefixes: ['https://myapp.com', 'myapp://'],
});

const [isReady, setIsReady] = React.useState(false);
const [initialState, setInitialState] = React.useState();

React.useEffect(() => {
  getInitialState()
    .catch(() => {})
    .then(state => {
      if (state !== undefined) {
        setInitialState(state);
      }

      setIsReady(true);
    });
}, [getInitialState]);

if (!isReady) {
  return null;
}

return (
  <NavigationContainer initialState={initialState} ref={ref}>
    {/* content */}
  </NavigationContainer>
);
```
