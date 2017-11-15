# Navigation Actions

All Navigation Actions return an object that can be sent to the router using `navigation.dispatch()` method.

Note that if you want to dispatch react-navigation actions you should use the action creators provided in this library.

The following actions are supported:
* [Navigate](#Navigate) - Navigate to another route
* [Reset](#Reset) - Replace current state with a new state
* [Back](#Back) - Go back to previous state
* [Set Params](#SetParams) - Set Params for given route
* [Init](#Init) - Used to initialize first state if state is undefined

The action creator functions define `toString()` to return the action type, which enables easy usage with third-party Redux libraries, including redux-actions and redux-saga.

### Navigate
The `Navigate` action will update the current state with the result of a `Navigate` action.

- `routeName` - *String* - Required - A destination routeName that has been registered somewhere in the app's router
- `params` - *Object* - Optional - Params to merge into the destination route
- `action` - *Object* - Optional - (advanced) The sub-action to run in the child router, if the screen is a navigator. Any one of the actions described in this doc can be set as a sub-action.

```js
import { NavigationActions } from 'react-navigation'

const navigateAction = NavigationActions.navigate({

  routeName: 'Profile',

  params: {},

  action: NavigationActions.navigate({ routeName: 'SubProfileRoute'})
})

this.props.navigation.dispatch(navigateAction)

```


### Reset

The `Reset` action wipes the whole navigation state and replaces it with the result of several actions.

- `index` - *number* - required - Index of the active route on `routes` array in navigation `state`.
- `actions` - *array* - required - Array of Navigation Actions that will replace the navigation state.
- `key` - *string or null* - optional - If set, the navigator with the given key will reset. If null, the root navigator will reset.

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
#### How to use the `index` parameter
The `index` param is used to specify the current active route.

eg: given a basic stack navigation with two routes `Profile` and `Settings`.
To reset the state to a point where the active screen was `Settings` but have it stacked on top of a `Profile` screen, you would do the following:

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

Go back to previous screen and close current screen. `back` action creator takes in one optional parameter:
- `key` - *string or null* - optional - If set, navigation will go back from the given key. If null, navigation will go back anywhere.

```js
import { NavigationActions } from 'react-navigation'

const backAction = NavigationActions.back({
  key: 'Profile'
})
this.props.navigation.dispatch(backAction)

```

### SetParams

When dispatching `SetParams`, the router will produce a new state that has changed the params of a particular route, as identified by the key

- `params` - *object* - required - New params to be merged into existing route params
- `key` - *string* - required - Route key that should get the new params

```js
import { NavigationActions } from 'react-navigation'

const setParamsAction = NavigationActions.setParams({
  params: { title: 'Hello' },
  key: 'screen-123',
})
this.props.navigation.dispatch(setParamsAction)

```
