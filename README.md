# React Navigation [![CircleCI](https://circleci.com/gh/react-community/react-navigation/tree/master.svg?style=shield&circle-token=622fcb1d78413084c2f44699ed2104246a177485)](https://circleci.com/gh/react-community/react-navigation/tree/master) [![npm version](https://badge.fury.io/js/react-navigation.svg)](https://badge.fury.io/js/react-navigation) [![codecov](https://codecov.io/gh/react-community/react-navigation/branch/master/graph/badge.svg)](https://codecov.io/gh/react-community/react-navigation) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactnavigation.org/docs/guides/contributors)

*Learn once, navigate anywhere.*

React Navigation is born from the React Native community's need for an extensible yet easy-to-use navigation solution based on Javascript.

React Navigation is the result of a collaboration between developers from Facebook, Expo and the React community at large: it replaces and improves upon several navigation libraries in the ecosystem, including Ex-Navigation, React Native's Navigator and NavigationExperimental components.

* [Installation](#installation)
* [Community contributions](#community-contributions)
  * [Introduction to the library](#introduction-to-the-library)
  * [Basic Tutorials](#basic-tutorials)
  * [Intermediate Concepts](#intermediate-concepts)
  * [Advanced Topics](#advanced-topics)
  * [Comparisons and Discussion](##comparisons-and-discussion)
  * [Example Projects](#example-projects)
  * [Libraries](#libraries)
* [FAQs](#faqs)
  * [When is version 1.0.0 going to be released?](#when-is-version-100-going-to-be-released)
  * [I'm having troubles using the library, what can I do?](#im-having-troubles-using-the-library-what-can-i-do)
  * [How can I help?](#how-can-i-help)
  * [Is this the only library available for navigation?](#is-this-the-only-library-available-for-navigation)
  * [Can I use this library for web?](#can-i-use-this-library-for-web)
* [Code of conduct](#code-of-conduct)
* [License](#license)

## Installation

Since the library is a JS-based solution, to install the latest version of react-navigation you only need to run:

  ```bash
  yarn add react-navigation
  ```

  or

  ```bash
  npm install --save react-navigation
  ```

## Get Started

To learn how the library work, head to the [introduction](https://reactnavigation.org/docs/intro/) on the website for a quick tutorial that will cover all the basics - or try it out [our expo demo](https://exp.host/@react-navigation/NavigationPlayground).

#### Advanced guides

* [Redux integration](https://reactnavigation.org/docs/guides/redux)
* [Deep linking](https://reactnavigation.org/docs/guides/linking)

#### React Navigation API

* [Navigators](https://reactnavigation.org/docs/navigators/)
* [Routers](https://reactnavigation.org/docs/routers/)
* [Views](https://reactnavigation.org/docs/views/)

## Community contributions

A lot of developers poured their knowledge in blog posts, and other repos - we will try to keep here a list of tutorials and resources to help someone who wants to learn about React Navigation and techniques to handle navigation effectively.

#### Introduction to the library

* [Getting Started with React Navigation](https://hackernoon.com/getting-started-with-react-navigation-the-navigation-solution-for-react-native-ea3f4bd786a4)

#### Basic Tutorials

* [Basic ReactNavigation Example App and Tutorial](http://docs.nativebase.io/docs/examples/navigation/StackNavigationExample.html)
* [Understanding Navigation in React Native](https://www.codementor.io/blessingoraz/understanding-navigation-in-react-native-a3wlcxmzu?published=1#.WXfDlvk_ooE.twitter)
* [Comprehensive routing and navigation in React Native made easy](https://medium.com/@kevinle/comprehensive-routing-and-navigation-in-react-native-made-easy-6383e6cdc293)
* [Replace a Screen Using React Navigation](https://medium.com/handlebar-labs/replace-a-screen-using-react-navigation-a503eab207eb)

#### Intermediate Concepts

* [Using React Navigation and Redux in your React Native Application](https://medium.com/modus-create-front-end-development/using-react-navigation-and-redux-in-your-react-native-application-efac33265138)
* [React-Navigation, complete Redux state management, tab-bar, and multiple navigators](https://medium.com/@parkerdan/react-navigation-with-complete-redux-state-management-tab-bar-and-multiple-navigators-ed30a69d9a4d)
* [Custom Drawer with React-Navigation in React-Native](http://www.skywardsoftwares.co.in/react-native/custom-drawer-with-react-navigation-in-react-native/)
* [React Navigation Drawer - a tutorial series](https://shift.infinite.red/react-navigation-drawer-tutorial-a802fc3ee6dc)

#### Advanced Topics

* [Full Stack React Native Development using GraphCool and Apollo Subscriptions + React Navigation](https://medium.com/react-native-training/full-stack-react-native-development-using-graphcool-and-apollo-subscriptions-react-navigation-cdb3e1374c05)

#### Comparisons and Discussion

* [Migrate from ExNavigation to React Navigation](https://hackernoon.com/migrate-from-exnavigation-to-react-navigation-1af661ec5082)
* [Playing with React Navigation and Airbnb's Native Navigation](https://medium.com/@ericvicenti/playing-with-react-navigation-and-airbnbs-native-navigation-4e49fc765489)
* [How we restructured our app with React Navigation](https://m.oursky.com/how-we-restructured-our-app-with-react-navigation-98a89e219c26)
* [What’s Happening with Navigation in React Native?](https://blog.revisify.com/whats-happening-with-navigation-in-react-native-c193535888c3)

#### Example Projects

* [Yaba-Social](https://github.com/allpwrfulroot/yaba-social)
* [React Native Boilerplate with React Navigation and Redux integration](https://github.com/verybluebot/react-native-boilerplate)

#### Libraries

* [react-navigation-addons](https://github.com/satya164/react-navigation-addons)
* [react-navigation-props-mapper](https://github.com/vonovak/react-navigation-props-mapper)

## FAQs

#### When is version 1.0.0 going to be released?

As soon as all the tasks [here](https://github.com/react-community/react-navigation/issues/2585) have been completed. You can read more about it in the [blog](https://reactnavigation.org/blog/2017/9/Renewed-v1).

(in the meantime, you can find the changelog for every release [here](https://github.com/react-community/react-navigation/releases))

#### I'm having troubles using the library, what can I do?

Head to the [issues](https://github.com/react-community/react-navigation/issues) and do a quick search: if you think you are experiencing a bug chances are somebody already opened an issue for it. If instead you are having more general problems, use [Stack Overflow](https://stackoverflow.com/search?q=react-navigation) - which is better suited and helps keeping the Issues section of the repo clean. Alternatively you could join the [Reactiflux](https://www.reactiflux.com/) community on Discord where there are React Native and React Navigation channels with helpful people who might be able to answer you.

You should **only** open a new issue if you believe that you are experiencing a bug or have a feature request, and please **follow** the dedicated template - it will help everyone helping you (and may get closed if it doesn't).

#### How can I help?

Glad you ask! This library is a community effort: it can only be great if we all help out in one way or another 😄 . If you feel like you aren't experienced enough using react navigation to contribute, you can still make an impact by:

1. Responding to one of the open [issues](https://github.com/react-community/react-navigation/issues). Even if you can't resolve or fully answer a question, asking for more information or clarity on an issue is extremely beneficial for someone to come after you to resolve the issue.

1. Creating public example repos of navigation problems you have solved.

1. Answering questions on [Stack Overflow](https://stackoverflow.com/search?q=react-navigation). Alternatively, asking questions on Stack Overflow instead of opening an issue.

1. Answering questions in our [Reactiflux](https://www.reactiflux.com/) channel.

1. Providing feedback on the open [PRs](https://github.com/react-community/react-navigation/pulls).

If you feel brave enough you can submit a PR: follow the [Contributors guide](https://reactnavigation.org/docs/guides/contributors) to find out how. If you don't know where to start, check the ones with the label [`Type: Good First Task`](https://github.com/react-community/react-navigation/labels/Type%3A%20Good%20First%20Task) - even [fixing a typo in the documentation](https://github.com/react-community/react-navigation/pull/2727) is a worthy contribution!

#### Is this the only library available for navigation?

No: there are some other libraries - which, depending on your project, can be better or worse suited for your project. They differ in the approach and implementation from `react-navigation`, but share the common goal of helping you create a good React Native application; you can find a general round up in the [React Native docs](http://facebook.github.io/react-native/docs/navigation.html).

#### Can I use this library for web?

This library originally planned to support web too - but at the moment [it is not a priority](https://github.com/react-community/react-navigation/issues/2585#issuecomment-330338793) for v1.0; a lot of work is necessary to reach it as-is and we had to freeze this support (consider it ["experimental"](https://reactnavigation.org/docs/guides/web)).

## Code of conduct

This library has adopted a Code of Conduct that we expect project participants to adhere to. Please read the [full text](https://github.com/react-community/react-navigation/blob/master/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## License

React-navigation is licensed under the [BSD 2-clause "Simplified" License](https://github.com/react-community/react-navigation/blob/master/LICENSE).