# Rethinking Navigation

An exploration of a component-first API for React Navigation for building more dynamic navigation solutions.

## Considerations

- Should play well with static type system
- Navigation state should be contained in root component (helpful for stuff such as deep linking)
- Component-first API

## Building blocks

### `NavigationContainer`

Component which wraps the whole app. It stores the state for the whole navigation tree.

### `useNavigationBuilder`

Hook which can access the navigation state from the context. Along with the state, it also provides some helpers to modify the navigation state provided by the router. All state changes are notified to the parent `NavigationContainer`.

### Router

An object that provides various actions to modify state as well as helpers.

### Navigator

Navigators bundle a `NavigationChild`, a `router` and a view which takes the navigation state and decides how to render it.

A simple navigator could look like this:

```js
function StackNavigator({ initialRouteName, children, ...rest }) {
  // The `navigation` object contains the navigation state and some helpers (e.g. push, pop)
  // The `descriptors` object contains `navigation` objects for children routes and helper for rendering a screen
  const { navigation, descriptors } = useNavigationBuilder(StackRouter, {
    initialRouteName,
    children,
  });

  return (
    // The view determines how to animate any state changes
    <StackView navigation={navigation} descriptors={descriptors} {...rest} />
  );
}
```

The navigator can render a screen by calling `descriptors[route.key].render()`. Internally, the descriptor wraps the screen in a `NavigationProvider` to support nested state:

```js
<NavigationProvider state={route}>
  <MyComponent />
</NavigationProvider>
```

## Basic usage

```js
function App() {
  return (
    <NavigationContainer>
      <StackNavigator initialRouteName="home">
        <Screen name="settings" component={Settings} />
        <Screen
          name="profile"
          component={Profile}
          options={{ title: 'John Doe' }}
        />
        <Screen name="home">
          {() => (
            <TabNavigator initialRouteName="feed">
              <Screen name="feed" component={Feed} />
              <Screen name="article" component={Article} />
              <Screen name="notifications">
                {props => <Notifications {...props} />}
              </Screen>
            </TabNavigator>
          )}
        </Screen>
      </StackNavigator>
    </NavigationContainer>
  );
}
```

Navigators need to have `Screen` components as their direct children. These components don't do anything by themselves, but the navigator can extract information from these and determine what to render. Implementation-wise, we'll use `React.Children` API for this purpose.

## Initial state

In the current implementation of React Navigation, the initial state is extracted from the navigator definitions. This is possible because they are defined statically. In our case, it's not possible because the screens are rendered dynamically.

Turns out we don't really need the initial state in the `NavigationContainer`. This state is the default state, so we can store `undefined` instead, and let the navigators initialize their initial state themselves. Next time an action modifies the state, we update the value in the container.

If an initial state is specified, e.g. as a result of `Linking.getInitialURL()`, the child navigators will use that state, instead of having to initialize it themselves.
