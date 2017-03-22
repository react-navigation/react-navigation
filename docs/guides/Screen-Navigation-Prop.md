
# Screen Navigation Prop

Each *screen* in your app will receive a navigation prop which contain the following:
* `navigate` - (helper) link to other screens
* `state` - screen's current state/routes
* `setParams` - (helper) make changes to route's params
* `goBack` - (helper) close active screen and move back
* `dispatch` - send an action to router

*NOTE:* The `navigation` prop is passed down to every navigation-aware component including navigators. The big exception is that a navigator's `navigation` prop may not have the helper functions (`navigate`, `goBack`, etc); it may only have `state` and `dispatch`. In order to `navigate` using the navigator's `navigation` prop, you will have to `dispatch` using an [action creator](navigation-actions).

*Notes regarding hooking things up with Redux*

> People don't always hook things up to redux correctly, because they mis-understand the navigator's top-level API, where the navigation prop is optional. The navigator will maintain its own state if it doesn't get a navigation prop, but this is not a feature you generally want to use when hooking your app up with redux. For navigators that are nested inside of your main navigator, you always want to pass the screen's navigation prop down. This allows your top-level navigator to communicate and provide state for all the children navigators. Only your top-level router needs to be integrated with redux, because all the other routers are inside it.

## `navigate` - Link to other screens

Call this to link to another screen in your app. Takes the following arguments:

`navigate(routeName, params, action)`

- `routeName` - A destination routeName that has been registered somewhere in the app's router
- `params` - Params to merge into the destination route
- `action` - (advanced) The sub-action to run in the child router, if the screen is a navigator. See [Actions Doc](navigation-actions) for a full list of supported actions.

```js
class HomeScreen extends React.Component {
  render() {
    const {navigate} = this.props.navigation;

    return (
      <View>
        <Text>This is the home screen of the app</Text>
        <Button
          onPress={() => navigate('Profile', {name: 'Brent'})}
          title="Go to Brent's profile"
        />
      </View>
     )
   }
}
```

## `state` - The screen's current state/route

A screen has access to its route via `this.props.navigation.state`. Each will return an object with the following:

```js
{
  // the name of the route config in the router
  routeName: 'profile',
  //a unique identifier used to sort routes
  key: 'main0',
  //an optional object of string options for this screen
  params: { hello: 'world' }
}
```

```js
class ProfileScreen extends React.Component {
  render() {
    const {state} = this.props.navigation;
    // state.routeName === 'Profile'
    return (
      <Text>Name: {state.params.name}</Text>
    );
  }
}
```


## `setParams` - Make changes to route params

Firing the `setParams` action allows a screen to change the params in the route, which is useful for updating the header buttons and title.

```js
class ProfileScreen extends React.Component {
  render() {
    const {setParams} = this.props.navigation;
    return (
      <Button
        onPress={() => setParams({name: 'Lucy'})}
        title="Set title name to 'Lucy'"
      />
     )
   }
}
```

## `goBack` - Close the active screen and move back

Optionally provide a key, which specifies the route to go back from. By default, goBack will close the route that it is called from. If the goal is to go back *anywhere*, without specifying what is getting closed, call `.goBack(null);`

```js
class HomeScreen extends React.Component {
  render() {
    const {goBack} = this.props.navigation;
    return (
      <View>
        <Button
          onPress={() => goBack()}
          title="Go back from this HomeScreen"
        />
        <Button
          onPress={() => goBack(null)}
          title="Go back anywhere"
        />
        <Button
          onPress={() => goBack('screen-123')}
          title="Go back from screen-123"
        />
      </View>
     )
   }
}
```

## `dispatch` - Send an action to the router

Use dispatch to send any navigation action to the router. The other navigation functions use dispatch behind the scenes.

Note that if you want to dispatch react-navigation actions you should use the action creators provided in this library.

See [Navigation Actions Docs](navigation-actions) for a full list of available actions.

```js
import { NavigationActions } from 'react-navigation'

const navigateAction = NavigationActions.navigate({
  routeName: 'Profile',
  params: {},

  // navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ routeName: 'SubProfileRoute'})
})
this.props.navigation.dispatch(navigateAction)

```
