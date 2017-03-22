# Introducing React Navigation for React Native
_January 26, 2017_

Today we're excited to introduce React Navigation, a flexible navigation library for React Native and web, including customizable views for React Native, routers for any platform, and navigators that make it super easy to get started. We aim to provide a simple and extensible solution which enables developers to share one navigation paradigm for all of their React apps.


## Start Quick with pre-built Navigators

A navigator is a React component with a static `.router` declared on it. To make it super easy to get started, React Navigation ships with a few navigator factories, pairing common views with routers.

For example, the provided `StackNavigator` makes it easy to use a `CardStack` view and a `StackRouter` together:

```js
const MyApp = StackNavigator({
  Home: {screen: HomeScreen},
  Profile: {screen: ProfileScreen},
});
```

Each of these screens are just React components, and they can easily set their own title:

```js
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        onPress={() => navigate('Profile', { name: 'A' })}
        title="Go to A's profile"
      />
    );
  }
}
```

To learn more, [continue with the getting started guide](/docs/intro).


## Performant Views on React Native

Animations and gestures are critical for smooth navigation in a mobile app. React Navigation utilizes React Native's Animated library to provide 60fps animations that are driven from the native thread.

The views are designed to be highly extensible. For your app, you may want to build a custom modal, fork the stack header, or even utilize the underlying `<Transitioner>` component to build an entirely custom navigation presentation.


## Routers for Every Platform

In React Navigation, routers manage the [relationship between actions, state, and URIs](/docs/routers/api). The routers are cross-platform, and there is example code for iOS, Android, and web. Several routers are included, including [`TabRouter`](/docs/routers/tab) and [`StackRouter`](/docs/routers/stack), and it is encouraged to [override their behavior as needed](/docs/routers).

The routers are composable and can be useful for structuring your app. A common navigation structure in iOS is to have an independent navigation stack for each tab, where all tabs can be covered by a modal. This is three layers of router: a card stack, within tabs, all within a modal stack. So unlike our experience on web apps, the navigation state of mobile apps is too complex to encode into a single URI. Routers in `react-navigation` map from URIs to navigation actions, which are then used to compute navigation state.


## Future

React Navigation is born from the React Native community's need for an extensible yet easy-to-use navigation solution. It replaces and improves upon several navigation libraries in the ecosystem, including Ex-Navigation and React Native's Navigator and NavigationExperimental components.

Until the community lands on one navigation solution that works well on the web and React Native, we will forever be destined to re-invent navigation. We are extremely sensitive about the burden of change that accompanies a new navigation library, so we aim to provide a solution that will work long into the future. We are excited to support React Navigation for any platform, including cutting-edge frontiers like hybrid native apps, web server rendering, and ReactVR.

The first beta of React Navigation is available today on npm and GitHub, and you can [get started here](/docs/intro). We're excited to hear feedback from the React community, and together we still have a long way to go before our dream is realized. We'd love to see the community flourish with beautiful navigation views, custom router integrations, and more easy-to-use navigators. All of these individual contributions can work together seamlessly. If you have improvements for the built-in components, please [follow the contributors guide](/docs/guides/contributors) and dive right in!
