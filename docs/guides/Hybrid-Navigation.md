## Common React Navigation API - Hybrid Integration

This is a purely speculative API that demonstrates how it may be possible to integrate the [JS navigation API](./Common-Navigation-Spec.md) in a hybrid app.

## Setting up a screen

It should be possible to register new screens from JS into native. In your main bundle:

```
const HybridNavigationModule = require('NativeModules').HybridNavigation;

HybridNavigationModule.registerScreens([
  {
    type: 'Marketplace',
    screen: MarketplaceScreen,
  },
  {
  	type: 'Product',
  	screen: ProductScreen,
  },
]);
```

## Linking to JS

Now, your native code can open a react screen by type name:

```
// please pretend this is Obj-C or Java syntax:
CoreHybridNavigation.openReactScreen('Profile', {id: 123});
```

## Linking to Native

If JS product code wants to request navigation to a screen that may *or may not* be in native, it can do this:

```
const MarketplaceScreen = ({ navigation }) => (
  <View>
    <Button onPress={() => navigation.dispatch({
      type: 'Product',
      id: 42,
    })}>
      See product 42
    </Button>
  </View>
);
```

Inside the infra:

```
class InfraScreen extends React.Component {
  constructor() {
    const {initURI, type} = this.props;
    const ScreenView = ScreenRegistry[type].screen;
    const router = ScreenView.router;
    const deepLinkAction = router.getActionForURI(initURI);
    const initAction = deepLinkAction || {type: 'init'}
    const nav = router.getStateForAction(initAction);
    this.state = {
      nav,
    };
    HybridNavigationModule.setNavOptions(this.state.nav);
  }
  componentWillUpdate() {
    HybridNavigationModule.setNavOptions(this.state.nav);
  }
  dispatch = (action) => {
    const {type} = this.props;
    const ScreenView = ScreenRegistry[type].screen;
    const {getStateForAction} = ScreenView.router;
    const newNavState = getStateForAction(action, this.state.nav);
    if (newNavState !== this.state.nav) {
      this.setState({ nav: newNavState });
      return true;
    }
    if (action.type === 'URI') {
      HybridNavigationModule.openURI(action.uri);
      return true;
    }
    if (action.type === NavigationActions.BACK) {
      HybridNavigationModule.goBack();
      return true;
    }
    HybridNavigationModule.openAction(action);
    return true;
  }
  render() {
    const {type} = this.props;
    const ScreenView = ScreenRegistry[type].screen;
    const navigation = {
      dispatch: this.dispatch,
      state: this.state.nav,
    };
    return <ScreenView navigation={navigation} />;
  }
}
```

## Setting title

```
MarketplaceScreen.router = {
  getStateForAction(action, lastState) {
    return lastState || {title: 'Marketplace Home'};
  },
};
```
A HOC could be used to make this feel more elegant.


## Disabling/Enabling the right button

```
const TestScreen = ({ navigation }) => (
  <View>
    <Button onPress={() => navigation.dispatch({
      type: 'ToggleMyButtonPressability',
    })}>
      {navigation.state.rightButtonEnabled ? 'Disable' : 'Enable'} right button
    </Button>
    <Text>Pressed {navigation.state} times</Text>
  </View>
);
TestScreen.router = {
  getStateForAction(action, lastState = {}) {
    let state = lastState || {
      rightButtonEnabled: true,
      rightButtonTitle: 'Tap Me',
      pressCount: 0,
    };
    if (action.type === 'ToggleMyButtonPressability') {
      state = {
        ...state,
        rightButtonEnabled: !state.rightButtonEnabled,
      };
    } else if (action.type === 'RightButtonPress') {
      state = {
        ...state,
        pressCount: state.pressCount + 1,
      };
    }
    return state;
  },
};
```


## Before JS starts

A JSON file could be defined for native to consume before JS spins up:

```
{
  "screens": [
    {
      "type": "Profile",
      "path": "/users/:id?name=:name",
      "params": {
        "name": "string",
        "id": "number"
      },
      "title": "%name%' s Profile",
      "rightButtonTitle": "Message %name%"
    },
    {
      ...
    }
  ]
}
```

This seems like a pain to set up, so we can statically analyze our JS and autogenerate this JSON! If the JS in an app changes, there could be a way for JS to report the new routing configuration to native for use on the next cold start.
