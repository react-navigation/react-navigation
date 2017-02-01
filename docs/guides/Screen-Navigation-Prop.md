
# Screen Navigation Prop

Each screen in your app will recieve a navigation prop, which contains the following:


## `navigate` - Link to other screens

Call this to link to another screen in your app. Takes the following arguments:

- `routeName` - A destination routeName that has been registered somewhere in the app's router
- `params` - Params to merge into the destination route
- `action` - (advanced) The sub-action to run in the child router, if the screen is a navigator.

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

A screen has access to its route via `this.props.navigation.state`. Each will contain:

- `routeName` - the name of the route config in the router
- `key` - a unique identifier used to sort routes
- `params` - an optional object of string options for this screen

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

Optionally provide a key, which specifies the route to go back from. By default, goBack will close the route that it is called from. If the goal is to go back *anywhere*, without specifying what is getting closed, call `.goBack(null);`


## `dispatch` - Send an action to the router

Use dispatch to send any navigation action to the router. The other navigation functions use dispatch behind the scenes.

Note that if you want to dispatch react-navigation actions you should use the action creators provided in this library.

The following actions are supported:

### Navigate
```js
import { NavigationActions } from 'react-navigation'

NavigationActions.navigate({
  routeName: 'Profile',
  params: {},

  // navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ routeName: 'SubProfileRoute'})
})
```


### Reset

The `Reset` action wipes the whole navigation state and replaces it with the result of several actions.

```js
import { NavigationActions } from 'react-navigation'

NavigationActions.reset({
  actions: NavigationActions.navigate({ routeName: 'Profile'}),
})
```

### SetParams

When dispatching `SetParams`, the router will produce a new state that has changed the params of a particular route, as identified by the key

```js
import { NavigationActions } from 'react-navigation'

NavigationActions.setParams({
  params: {}, // these are the new params that will be merged into the existing route params
  // The key of the route that should get the new params
  key: 'screen-123',
})
```
