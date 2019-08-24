# react-navigation-animated-switch

This navigator uses the [Reanimated Transitions API](https://github.com/kmagiera/react-native-reanimated) to animate route change transitions. Aside from the animations, it is identical to the standard [switch navigator](https://reactnavigation.org/docs/en/switch-navigator.html).

## Installation

- [Install react-native-reanimated >= 1.0.0](https://github.com/kmagiera/react-native-reanimated#installation) if you have not already (the alpha version will not work!). If you have a managed Expo project, you need to use >= SDK 33 to have the correct version of Reanimated.
- Install `react-navigation-animated-switch` with your favorite JS package manager.

## Usage

```js
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';

const MySwitch = createAnimatedSwitchNavigator({
  Home: HomeScreen,
  Other: OtherScreen,
});
```

Ta da! When you change between routes the screens will cross-fade with each other. You can customize the transition using the `transition` prop:

```js
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

const MySwitch = createAnimatedSwitchNavigator(
  {
    Home: HomeScreen,
    Other: OtherScreen,
  },
  {
    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-bottom"
          durationMs={400}
          interpolation="easeIn"
        />
        <Transition.In type="fade" durationMs={500} />
      </Transition.Together>
    ),
  }
);
```

If you need to customize the underlying `Transitioning.View` style, you can pass in a `transitionViewStyle` option.

```js
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

const MySwitch = createAnimatedSwitchNavigator(
  {
    Home: HomeScreen,
    Other: OtherScreen,
  },
  {
    transitionViewStyle: { backgroundColor: 'red' },
  }
);
```

[Learn more about the `Transition` API here](https://github.com/kmagiera/react-native-reanimated).
