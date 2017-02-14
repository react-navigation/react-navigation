# Navigation Actions

Use dispatch to send any navigation action to the router. The other navigation functions use dispatch behind the scenes.

Note that if you want to dispatch react-navigation actions you should use the action creators provided in this library.

The following actions are supported:
* [Navigate](#navigate) - Navigate to another route
* [Reset](#reset) - Replace current state with a new state
* [Back](#back) - Go back to previous state
* [Set Params](#setparams) - Set Params for given route
* [Init](#init) - Used to initialize first state if state is undefined

### Navigate
The `Navigate` action will update the current state with the result of a `Navigate` action.

```js
import { NavigationActions } from 'react-navigation'

const navigationAction = NavigationActions.navigate({
  // (Required) Route name as defined when creating the Navigation View
  routeName: 'Profile',
  // (Optional) Additional params to be sent to new route
  params: {},
  // (Optional) navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ routeName: 'SubProfileRoute'})
})
this.props.navigation.dispatch(navigationAction)

```


### Reset

The `Reset` action wipes the whole navigation state and replaces it with the result of several actions.

```js
import { NavigationActions } from 'react-navigation'

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Profile'})
  ]
})
this.props.navigation.dispatch(resetAction)

```

You can issue multiple actions, but make sure to set `index` correctly:

```js
import { NavigationActions } from 'react-navigation'

const resetAction = NavigationActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'Profile'}),
    NavigationActions.navigate({ routeName: 'Settings'})
  ]
})
this.props.navigation.dispatch(resetAction)

```

### Back

Go back to previous screen and close current screen.

```js
import { NavigationActions } from 'react-navigation'

const setParamsAction = NavigationActions.back({
  // (Optional) By default, navigation state will try to remove the current route from navigation state but if a key is set, navigation state will try to go back from given key route
  key: 'Profile'

})
this.props.navigation.dispatch(setParamsAction)

```

### SetParams

When dispatching `SetParams`, the router will produce a new state that has changed the params of a particular route, as identified by the key

```js
import { NavigationActions } from 'react-navigation'

const setParamsAction = NavigationActions.setParams({
  params: {}, // these are the new params that will be merged into the existing route params
  // The key of the route that should get the new params
  key: 'screen-123',
})
this.props.navigation.dispatch(setParamsAction)

```

### Init

???
