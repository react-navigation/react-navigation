# Common Navigation Spec

### Introduction

It is useful to have “one standard way” to handle navigation in a React app. Unfortunately, we've learned that a single navigation library cannot be the right fit for every application. There is often a tradeoff between several useful features:

* Simplicity
* Supporting complex animations
* Navigating between natively-implemented screens and JavaScript screens
* Precise fidelity to the native UI controls
* Default support for deep linking and the Android back button

Although the React Native community will need more than one navigation library, we can make them work nicely together. The goal of this document is to specify a common API for navigation libraries. Consistency will make several things easier for React Native developers:

* Combining multiple navigation libraries in one application
* Switching out navigation libraries when requirements change
* Learning navigation once, and applying that knowledge in different applications

Navigation libraries don't have to implement all of this API - it's just a recommendation.

(TODO: When we actually publish this spec, we should mention here what libraries are supporting it, what libraries will support it, and (link to?) how to migrate from other now-discouraged navigation libraries.)


## Key Concepts

#### Navigation Container

The parent component which hosts a navigation-aware component. It must provide the `navigation` prop, and usually uses the child component's static `router` to determine navigation state.

#### Navigation-Aware Component

A React component which can observe and initiate navigation in an app. It uses the navigation prop to see navigation state and request actions. It may expose a router to define navigation state and URI handling.

The card stack of your application may be a navigation-aware component. Also, one screen of your app that handles the Android back button is a navigation-aware component.

#### Navigation State

The object that defines the navigation state of your component, passed in as a prop. A router can define the state, which optionally specifies the title and URI of the component.

#### Action

A JSON object used to request changes in the app's navigation state.

#### Router

Defines the navigation behavior of a component by defining navigation state as a function of actions, and allows URIs to be optionally converted into an action that can be handled.

#### Navigator

A navigation-aware component that hosts other navigation-aware components. Most navigators are expected to delegate all router logic, manage child navigation state, and pass up actions as they are dispatched.

## Specification

### The `navigation` prop

The navigation prop should be provided to components who need access to navigation. If provided, it must follow this interface:

```javascript
type BackAction = {type: 'Navigation/BACK'};
type URIAction = {type: 'Navigation/URI', uri: string};

interface Navigation<S, A> {
  dispatch(action: (A | BackAction | URIAction)): boolean;
  state: S;
}
```

#### navigation.state

The controlled navigation state prop, as requested by the parent.

```javascript
const MyView = ({ navigation }) => {
  switch (navigation.state.myRequestedView) {
    case 'ViewA': return <ViewA />;
    case 'ViewB': return <ViewB />;
    default: return <OtherView />;
  }
}
```

#### navigation.dispatch(action)

The channel that a component can call to request navigation from its parent. When calling `dispatch`, you must provide an action object with a `type`. There are two special action types: 'Navigation/BACK' and 'Navigation/URI'.

```javascript
const MyLink = ({ navigation }) => (
  <Button onPress={() => {
    navigation.dispatch({
      type: 'MyNavigationRequest',
      myParam: 42,
    });
  }>
    Press me to navigate
  </Button>
);
```


### The static `router`

A router object may be statically defined on your component. If defined, it must follow this interface:

```javascript
type BackAction = {type: 'Navigation/BACK'};
type URIAction = {type: 'Navigation/URI', uri: string};

interface Router<S, A> {
  getStateForAction(action: (A | BackAction | URIAction), lastState: ?S): ?S;
  getActionForURI(uri: string): ?A;
}
```

The state and action types of the static router must match the state and action types associated with the navigation prop passed into the component.

#### router.getStateForAction(action, lastState)

This function is defined on the static router and is used to define the expected navigation state.

```javascript
class ScreenWithEditMode extends React.Component {
  static router = {
    getStateForAction: (action, prevState) => {
      return { isEditing: true };
    },
  };
  render() {
    // this.props.navigation.state.isEditing === true
    ...
  }
}
```

`getStateForAction` must **always** return a navigation state that can be rendered by the component when passed in as the `navigation.state` prop.

If null is returned, we are signaling that the previous navigation state has not changed, but the action is handled. This is usually used in cases where the action is being swallowed.


#### router.getActionForURI(uri)

Return an action if a URI can be handled, otherwise return `null`



### Special Actions

There are two special actions that can be fired into `navigation.dispatch` and can be handled by your `router.getStateForAction`.

#### Back Action

This action means the same thing as an Android back button press.

```
type BackAction = { type: 'Navigation/BACK' };
```

#### URI Open Action

Used to request the enclosing app or OS to open a link at a particular URI. If it is a web URI like `http` or `https`, the app may open a WebView to present the page. Or the app may open the URI in a web browser. In some cases, an app may choose to block a URI action or handle it differently.

```
type URIAction = { type: 'Navigation/URI', uri: string };
```


### Special Navigation State

The state defined by `router.getStateForAction` can contain special navigation properties that may be relevant to your app. The title and current URI of a component may change over time, and the parent often needs to observe the behavior.

#### `state.title`

If the navigation state contains 'title', it will be used as the title for the given component. This is relevant for top-level components on the web to update the browser title, and is relevant in mobile apps where a title is shown in the header.

#### `state.uri`

A URI can also be put in `state.uri`, which will signal to the parent how it may be possible to deep link into a similar navigation state. In web apps, this will be used to keep the URI bar in sync with the current navigation state of the app.


## Use Cases

### "Block the Android back button on one screen of my app"

To block the Android back button:

```
class Foo extends React.Component {
  static router = {
    getStateForAction(action, prevState = {}) {
      if (action.type === 'Navigation/BACK') return null;
      else return prevState;
    },
  };
  render() {
    ...
```

Because we return null, we signal to our container that the action has been handled but the state does not change. The parent should not handle the back behavior at this point, and nothing should be re-rendered.

### "Link deeply into one screen of my app"

```
class Foo extends React.Component {
  static router = {
    getStateForAction(action, prevState = {deep: false}) {
      if (action.type === 'GoDeep') return { deep: true };
      else return prevState;
    },
    getActionForURI(uri) {
      if (uri === 'myapp://foo')
        return {type: 'Go'};
      else if (uri === 'myapp://foo_deep')
        return {type: 'GoDeep'};
      return null;
    },
  };
  render() {
    // this.props.navigation.state.deep may be true or false
    ...
```

Based on the state URI we may decide to return an action. If an action is returned, `getStateForAction` is expected to output the correct state for a deep link.

## Reference Implementations

A library to that helps easily produce navigation-aware components: https://github.com/react-community/react-navigation . (Also uses a HOC to provide navigation containers when needed.)

A simple navigation container: https://gist.github.com/ericvicenti/77d190e2ec408012255937400e34bdb1

A web implementation of a navigation container: https://gist.github.com/ericvicenti/55bef95fcd8558029a3bae8483baea6c
