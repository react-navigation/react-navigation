# Navigators

Navigators allow you to define your application's navigation structure. Navigators also render common elements such as headers and tab bars which you can configure.

Under the hood, navigators are plain React components.

## Built-in Navigators

`react-navigation` includes the following functions to help you create navigators:

- [StackNavigator](/docs/navigators/stack) - Renders one screen at a time and provides transitions between screens. When a new screen is opened it is placed on top of the stack.
- [TabNavigator](/docs/navigators/tab) - Renders a tab bar that lets the user switch between several screens
- [DrawerNavigator](/docs/navigators/drawer) - Provides a drawer that slides in from the left of the screen

## Rendering screens with Navigators

The navigators render application screens which are just React components.

To learn how to create screens, read about:
- [Screen `navigation` prop](/docs/navigators/navigation-prop) to allow the screen to dispatch navigation actions, such as opening another screen
- [Screen `navigationOptions`](/docs/navigators/navigation-options) to customize how the screen gets presented by the navigator (e.g. header title, tab label)

### Calling Navigate on Top Level Component

In case you want to use Navigator from the same level you declare it you can use react's [`ref`](https://facebook.github.io/react/docs/refs-and-the-dom.html#the-ref-callback-attribute) option:  
```js
import { NavigationActions } from 'react-navigation';

const AppNavigator = StackNavigator(SomeAppRouteConfigs);

class App extends React.Component {
  someEvent() {
    // call navigate for AppNavigator here:
    this.navigator && this.navigator.dispatch(
      NavigationActions.navigate({ routeName: someRouteName })
    );
  }
  render() {
    return (
      <AppNavigator ref={nav => { this.navigator = nav; }} />
    );
  }
}
```
Please notice that this solution should only be used on the top level navigator.  

## Navigation Containers

The built in navigators can automatically behave like top-level navigators when the navigation prop is missing. This functionality provides a transparent navigation container, which is where the top-level navigation prop comes from.

When rendering one of the included navigators, the navigation prop is optional. When it is missing, the container steps in and manages its own navigation state. It also handles URLs, external linking, and Android back button integration.

For the purpose of convenience, the built-in navigators have this ability because behind the scenes they use `createNavigationContainer`. Usually, navigators require a navigation prop in order to function.

Top-level navigators accept the following props:  

### `onNavigationStateChange(prevState, newState, action)`

Function that gets called every time navigation state managed by the navigator changes. It receives the previous state, the new state of the navigation and the action that issued state change. By default it prints state changes to the console.

### `uriPrefix`

The prefix of the URIs that the app might handle. This will be used when handling a [deep link](/docs/guides/linking) to extract the path passed to the router.
