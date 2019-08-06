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

The router object provides various helper methods to deal with the state and actions, a reducer to update the state as well as some action creators.

The router is responsible for handling actions dispatched by calling methods on the `navigation` object. If the router cannot handle an action, it can return `null`, which would propagate the action to other routers until it's handled.

### Navigator

Navigators bundle a router and a view which takes the navigation state and decides how to render it.

A simple navigator could look like this:

```js
function StackNavigator({ initialRouteName, children, ...rest }) {
  // The `navigation` object contains the navigation state and some helpers (e.g. push, pop)
  // The `descriptors` object contains the screen options and a helper for rendering a screen
  const { state, navigation, descriptors } = useNavigationBuilder(StackRouter, {
    initialRouteName,
    children,
  });

  return (
    // The view determines how to animate any state changes
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

The navigator can render a screen by calling `descriptors[route.key].render()`. Internally, the descriptor adds appropriate wrappers to handle nested state.

## Architectural differences

### Shape of the navigation state

The shape of the navigation state looks very similar to the current implementation. There are few important differences:

- The name of the route is in the `route.name` property instead of `route.routeName`.
- The state of the child navigator exists on a separate property `route.state`.
- The state object contains a `routeNames` property which contains the list of defined route names in an array of strings,

Example:

```js
{
  index: 0,
  key: 'stack-ytwk65',
  routeNames: ['home', 'profile', 'settings'],
  routes: [
    {
      key: 'home-hjds3b',
      name: 'home',
      state: {
        index: 1,
        key: 'tab-jhsf6g',
        routeNames: ['feed', 'recommended'],
        routes: [
          {
            key: 'feed-jv2iud',
            name: 'feed',
          },
          {
            key: 'recommended-njdh63',
            name: 'recommended',
          },
        ],
      },
    },
  ],
}
```

### Deriving initial state

In the current implementation of React Navigation, the initial state is extracted from the navigator definitions. This is possible because they are defined statically. In our case, it's not possible because the screens are rendered dynamically.

Turns out we don't really need the initial state in the `NavigationContainer`. This state is the default state, so we can store `undefined` instead, and let the navigators initialize their initial state themselves. Next time an action modifies the state, we update the value in the container.

If an initial state is specified, e.g. as a result of `Linking.getInitialURL()`, the child navigators will use that state, instead of having to initialize it themselves.

### Passing state to child navigator

Navigation state is exposed to children navigators via React context instead of having to pass it down manually. This lets the user nest navigators freely without having to worry about properly passing the state down.

### Accessing state of other navigators

Navigators should not access the state of other navigators. It might be tempting to access the state of a child route to perform some checks, but it's not going to work correctly, as the state object may not exist yet.

Instead of direct state access, navigators should communicate via events. Each navigator should access and modify its own state only.

### Bubbling of actions

In the current implementation of React Navigation, routers manually call the child routers to apply any actions. Since we have a component based architecture, this is not really possible.

Instead, we use an event based system. Child navigators can add listeners to handle actions. If the parent couldn't handle the action, it'll call the listeners. The event system is built into the core and the routers don't need to worry about it.

When an action can be bubble, the `getStateForAction` method from a router should return `null`, otherwise it should return the state object.

It's also possible to disable bubbling of actions when dispatching them by adding a `target` key in the action. The `target` key should refer to the key of the navigator that should handle the action.

## Basic usage

```js
const Stack = createStackNavigator();
const Tab = createTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen name="settings" component={Settings} />
        <Stack.Screen
          name="profile"
          component={Profile}
          options={{ title: 'John Doe' }}
        />
        <Stack.Screen name="home">
          {() => (
            <Tab.Navigator initialRouteName="feed">
              <Tab.Screen name="feed" component={Feed} />
              <Tab.Screen name="article" component={Article} />
              <Tab.Screen name="notifications">
                {props => <Notifications {...props} />}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Navigators need to have `Screen` components as their direct children. These components don't do anything by themselves, but the navigator can extract information from these and determine what to render. Implementation-wise, we use `React.Children` API for this purpose.

The content to render can be specified in 2 ways:

1. React component in `component` prop (recommended)
2. Render callback as children

When a React component is specified, the navigator takes care of adding a `React.memo` to prevent unnecessary re-renders. However, it's not possible to pass extra props to the component this way. It's preferable to use the context API for such cases instead of props.

A render callback which doesn't have such limitation and is easier to use for this purpose. However, performance optimization for the component is left to the user in such case.

The rendered component will receives a `navigation` prop with various helpers and a `route` prop which represents the route being rendered.

## Setting screen options

In React Navigation, screen options can be specified in a static property on the component (`navigationOptions`). This poses few issues:

- It's not possible to configure options based on props, state or context
- To update the props based on an action in the component (such as button press), we need to do it in a hacky way by changing params
- It breaks when used with HOCs which don't hoist static props, which is a common source of confusion

Instead of a static property, we expose a method to configure screen options:

```js
function Selection({ navigation }) {
  const [selectedIds, setSelectedIds] = React.useState([]);

  navigation.setOptions({
    title: `${selectedIds.length} items selected`,
  });

  return <SelectionList onSelect={id => setSelectedIds(ids => [...ids, id])} />;
}
```

This allows options to be changed based on props, state or context, and doesn't have the disadvantages of static configuration.

## Navigation events

Screens can add listeners on the `navigation` prop like in React Navigation. By default, `focus` and `blur` events are fired when focused screen changes:

```js
function Profile({ navigation }) {
  React.useEffect(() =>
    navigation.addListener('focus', () => {
      // do something
    })
  );

  return <ProfileContent />;
}
```

Navigators can also emit custom events using the `emit` method in the `navigation` object passed:

```js
navigation.emit({
  type: 'transitionStart',
  data: { blurring: false },
  target: route.key,
});
```

The `data` is available under the `data` property in the `event` object, i.e. `event.data`.

The `target` property determines the screen that will receive the event. If the `target` property is omitted, the event is dispatched to all screens in the navigator.

Screens cannot emit events as there is no `emit` method on a screen's `navigation` prop.

If you don't need to get notified of focus change, but just need to check if the screen is currently focused in a callback, you can use the `navigation.isFocused()` method which returns a boolean. Note that it's not safe to use this in `render`. Only use it in callbacks, event listeners etc.

## Side-effects in focused screen

Sometimes we want to run side-effects when a screen is focused. A side effect may involve things like adding an event listener, fetching data, updating document title, etc. While this can be achieved using `focus` and `blur` events, it's not very ergonomic.

To make this easier, the library exports a `useFocusEffect` hook:

```js
function Profile({ userId }) {
  const [user, setUser] = React.useState(null);

  const fetchUser = React.useCallback(() => {
    const request = API.fetchUser(userId).then(
      data => setUser(data),
      error => alert(error.message)
    );

    return () => request.abort();
  }, [userId]);

  useFocusEffect(fetchUser);

  return <ProfileContent user={user} />;
}
```

The `useFocusEffect` is analogous to React's `useEffect` hook. The only difference is that it runs on focus instead of render.

**NOTE:** To avoid the running the effect too often, it's important to wrap the callback in `useCallback` before passing it to `useFocusEffect` as shown in the example.

## Access navigation anywhere

Passing the `navigation` prop down can be tedious. The library exports a `useNavigation` hook which can access the `navigation` prop from the parent screen.

```js
const navigation = useNavigation();
```

## Type-checking

The library exports few helper types. Each navigator also need to export a custom type for the `navigation` prop which should contain the actions they provide, .e.g. `push` for stack, `jumpTo` for tab etc.

Currently type checking and intelliSense works for route name and params. The user has to define a type alias with a list of routes along with the type of params they use.

For our example above, we need 2 separate types for stack and tabs:

```ts
type StackParamList = {
  settings: undefined;
  profile: { userId: string };
  home: undefined;
};

type TabParamList = {
  feed: undefined;
  article: undefined;
  notifications: undefined;
};
```

In a component, it's possible to annotate the `navigation` and `route` props using these types:

```ts
type Props = {
  navigation: StackNavigationProp<StackParamList, 'profile'>;
  route: RouteProp<StackParamList, 'profile'>;
};

function Profile(props: Props) {
  // Content
}
```

Annotating the `navigation` prop will be enough for provide type-checking for actions such as `navigate` etc. Annotating `route` will provide type-checking for accessing `params` for the current route.

For nested navigators, the `navigation` prop is a combination of multiple `navigation` props, so we need to combine multiple types to type them. We export a type called `CompositeNavigationProp` to make it easier:

```ts
type FeedScreenNavigationProp = CompositeNavigationProp<
  TabNavigationProp<TabParamList, 'feed'>,
  StackNavigationProp<StackParamList>
>;
```

The `CompositeNavigationProp` type takes 2 parameters, first parameter is the primary navigation type (type for the navigator that owns this screen) and second parameter is the secondary navigation type (type for a parent navigator). The primary navigation type should always have the screen's route name as it's second parameter.

For multiple parent navigators, this secondary type should be nested:

```ts
type FeedScreenNavigationProp = CompositeNavigationProp<
  TabNavigationProp<TabParamList, 'feed'>,
  CompositeNavigationProp<
    StackNavigationProp<StackParamList>,
    DrawerNavigationProp<DrawerParamList>
  >
>;
```

To annotate the `navigation` prop from `useNavigation`, we can use a type parameter:

```ts
const navigation = useNavigation<FeedScreenNavigationProp>();
```

It's also possible to type-check the navigator to some extent. To do this, we need to pass a generic when creating the navigator object:

```ts
const Stack = StackNavigator<StackParamList>();
```

And then we can use it:

```js
<Stack.Navigator initialRouteName="profile">
  <Stack.Screen name="settings" component={Settings} />
  <Stack.Screen
    name="profile"
    component={Profile}
    options={{ title: 'My profile' }}
  />
  <Stack.Screen name="home" component={Home} />
</Stack.Navigator>
```

Unfortunately it's not possible to verify that the type of children elements are correct since [TypeScript doesn't support type-checking JSX elements](https://github.com/microsoft/TypeScript/issues/21699).
