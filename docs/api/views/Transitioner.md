# Transitioner

`Transitioner` is a React component that helps manage transitions for complex animated components. It manages the timing of animations and keeps track of various screens as they enter and leave, but it doesn't know what anything looks like, because rendering is entirely deferred to the developer.

Under the covers, `Transitioner` is used to implement `CardStack`, and hence the `StackNavigator`.

The most useful thing `Transitioner` does is to take in a prop of the current navigation state. When routes are removed from that navigation state, `Transitioner` will coordinate the transition away from those routes, keeping them on screen even though they are gone from the navigation state.


## Example

```jsx
class MyNavView extends Component {
  ...
  render() {
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        render={this._render}
        onTransitionStart={this.onTransitionStart}
        onTransitionEnd={this.onTransitionEnd}
      />
    );
}
```

## Props

### `configureTransition` function

Invoked on `Transitioner.componentWillReceiveProps`, this function allows customization of animation parameters such as `duration`. The value returned from this function will be fed into a timing function, by default `Animated.timing()`, as its config.

#### Examples

```js
_configureTransition(transitionProps, prevTransitionProps) {
  return {
    // duration in milliseconds, default: 250
    duration: 500,
    // An easing function from `Easing`, default: Easing.inOut(Easing.ease)
    easing: Easing.bounce,
  }
}
```

Note: `duration` and `easing` are only applicable when the timing function is `Animated.timing`. We can also use a different timing function and its corresponding config parameters, like so:

```js
_configureTransition(transitionProps, prevTransitionProps) {
  return {
    // A timing function, default: Animated.timing.
    timing: Animated.spring,
    // Some parameters relevant to Animated.spring
    friction: 1,
    tension: 0.5,
  }
}
```

#### Flow definition

```js
  configureTransition: (
    transitionProps: NavigationTransitionProps,
    prevTransitionProps: ?NavigationTransitionProps,
  ) => NavigationTransitionSpec,
```

#### Parameters
- `transitionProps`: the current [NavigationTransitionProps](https://github.com/react-community/react-navigation/blob/master/src/TypeDefinition.js#L273) created from the current navigation state and props
- `prevTransitionProps`: the previous [NavigationTransitionProps](https://github.com/react-community/react-navigation/blob/master/src/TypeDefinition.js#L273) created from the previous navigation state and props

#### Returns
- An object of type [NavigationTransitionSpec](https://github.com/react-community/react-navigation/blob/master/src/TypeDefinition.js#L316) that will be fed into an Animated timing function as its config


### `navigation` prop
An object with `state` that represents the navigation state, with `routes` and an active route `index`. Also includes `dispatch` and other methods for requesting actions.

#### Example value

```js
{
   // Index refers to the active child route in the routes array.
  index: 1,
  routes: [
    { key: 'DF2FGWGAS-12', routeName: 'ContactHome' },
    { key: 'DF2FGWGAS-13', routeName: 'ContactDetail', params: { personId: 123 } }
  ]
}
```

#### Flow definition
```js
export type NavigationState = {
  index: number,
  routes: Array<NavigationRoute>,
};
```

For more information about the `NavigationRoute` type, check out its [flow definition](https://github.com/react-community/react-navigation/blob/master/src/TypeDefinition.js#L32).

### `render` function
Invoked from `Transitioner.render()`. This function performs the actual rendering delegated from `Transitioner`. In this function, we can use the information included in the `transitionProps` and `prevTransitionProps` parameters to render scenes, create animations and handle gestures.

There are a few important properties of the `transitionProps` and `prevTransitionProps` parameters that are useful for the tasks mentioned above:

- `scenes: Array<NavigationScene>` - a list of all available scenes
- `position: NavigationAnimatedValue` - the progressive index of the transitioner's navigation state
- `progress: NavigationAnimatedValue` - the value that represents the progress of the transition when navigation state changes from one to another. Its numeric value will range from 0 to 1.

For the complete list of properties of `NavigationTransitionProps`, check out its [flow definition](https://github.com/react-community/react-navigation/blob/master/src/TypeDefinition.js#L273).

#### Examples

`transitionProps.scenes` is the list of all available scenes. It is up to the implementor to determine how to lay them out on the screen. For example, we can render the scenes as a stack of cards like so:

```jsx
_render(transitionProps, prevTransitionProps) {
  const scenes = transitionProps.scenes.map(scene => this._renderScene(transitionProps, scene));
  return (
    <View style={styles.stack}>
      {scenes}
    </View>
  );
}
```

We can then use an `Animated.View` to animate the transition. To create necessary animated style properties, such as `opacity`, we can interpolate on `position` and `progress` values that come with `transitionProps`:

```jsx
_renderScene(transitionProps, scene) {
  const { position } = transitionProps;
  const { index } = scene;
  const opacity = position.interpolate({
    inputRange: [index-1, index, index+1],
    outputRange: [0, 1, 0],
  });
  // The prop `router` is populated when we call `createNavigator`.
  const Scene = this.props.router.getComponent(scene.route.routeName);
  return (
    <Animated.View style={{ opacity }}>
      { Scene }
    </Animated.View>
  )
}
```

The above code creates a cross fade animation during transition.

For a comprehensive tutorial on how to create custom transitions, see this [blog post](http://www.reactnativediary.com/2016/12/20/navigation-experimental-custom-transition-1.html).

#### Flow definition
```js
render: (transitionProps: NavigationTransitionProps, prevTransitionProps: ?NavigationTransitionProps) => React.Node,
```

#### Parameters
- `transitionProps`: the current [NavigationTransitionProps](https://github.com/react-community/react-navigation/blob/master/src/TypeDefinition.js#L273) created from the current state and props
- `prevTransitionProps`: the previous [NavigationTransitionProps](https://github.com/react-community/react-navigation/blob/master/src/TypeDefinition.js#L273) created from the previous state and props

#### Returns
- A ReactElement, which will be used to render the Transitioner component

### `onTransitionStart` function
Invoked when the transition animation is about to start.

#### Flow definition
```js
onTransitionStart: (transitionProps: NavigationTransitionProps, prevTransitionProps: ?NavigationTransitionProps) => void,
```
#### Parameters
- `transitionProps`: the current [NavigationTransitionProps](https://github.com/react-community/react-navigation/blob/master/src/TypeDefinition.js#L273) created from the current state and props
- `prevTransitionProps`: the previous [NavigationTransitionProps](https://github.com/react-community/react-navigation/blob/master/src/TypeDefinition.js#L273) created from the previous state and props

#### Returns
- none.

### `onTransitionEnd` function
Invoked once the transition animation completes.

#### Flow definition
```js
onTransitionEnd: () => void
```
#### Parameters
- none.

#### Returns
- none.
