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

An object that provides a reducer to update the state as well as some action creators.

### Navigator

Navigators bundle a `router` and a view which takes the navigation state and decides how to render it.

A simple navigator could look like this:

```js
function StackNavigator({ initialRouteName, children, ...rest }) {
  // The `navigation` object contains the navigation state and some helpers (e.g. push, pop)
  // The `descriptors` object contains the screen options and a helper for rendering a screen
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

The navigator can render a screen by calling `descriptors[route.key].render()`. Internally, the descriptor wraps the screen in a `NavigationStateContext.Provider` to support nested state:

```js
<NavigationStateContext.Provider state={route.state}>
  <MyComponent />
</NavigationStateContext.Provider>
```

## Initial state

In the current implementation of React Navigation, the initial state is extracted from the navigator definitions. This is possible because they are defined statically. In our case, it's not possible because the screens are rendered dynamically.

Turns out we don't really need the initial state in the `NavigationContainer`. This state is the default state, so we can store `undefined` instead, and let the navigators initialize their initial state themselves. Next time an action modifies the state, we update the value in the container.

If an initial state is specified, e.g. as a result of `Linking.getInitialURL()`, the child navigators will use that state, instead of having to initialize it themselves.

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

## Type-checking

The library exports few helper types. Each navigator also need to export a custom type for the `navigation` prop which should contain the actions they provide, .e.g. `push` for stack, `jumpTo` for tab etc.

Currently type checking and intelliSense works for route name and params. The user has to define a type alias with a list of routes along with the type of params they use.

For our example above, we need 2 separate types for stack and tabs:

```ts
type StackParamList = {
  settings: void;
  profile: { userId: string };
  home: void;
};

type TabParamList = {
  feed: void;
  article: void;
  notifications: void;
};
```

In a component, it's possible to annotate the `navigation` prop using these types:

```ts
function Profile({
  navigation,
}: {
  navigation: StackNavigationProp<StackParamList, 'profile'>;
}) {
  // Content
}
```

For nested navigators, the `navigation` prop is a combination of multiple `navigation` props, so we need to combine multiple types to type them:

```ts
function Feed({
  navigation,
}: {
  navigation: CompositeNavigationProp<
    NavigationHelpers<TabParamList, 'feed'>,
    StackNavigationProp<StackParamList>
  >;
}) {
  // Content
}
```

Annotating the `navigation` prop will be enough for provide type-checking for actions such as `navigate`, as well as accessing `params` for the current route etc.

It's also possible to type-check the navigator to some extent. To do this, we need to create a typed navigator object:

```ts
const Stack: TypedNavigator<StackParamList, typeof StackNavigator> = {
  Navigator: StackNavigator,
  Screen,
};
```

And then we use the typed navigator instead:

```js
<Stack.Navigator initialRouteName="profile">
  <Stack.Screen name="settings" component={Settings} />
  <Stack.Screen name="profile" component={Profile} />
  <Stack.Screen name="home" component={Home} />
</Stack.Navigator>
```
