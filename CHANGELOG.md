# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.8.1] - [2019-04-12](https://github.com/react-navigation/react-navigation/releases/tag/3.8.1)

## Changed

- Add missing type for `enableURLHandling` to TypeScript definition (#5803)
- Update Flow types (#5806)

## [3.8.0] - [2019-04-12](https://github.com/react-navigation/react-navigation/releases/tag/3.8.0)

## Fixes

- `onRefresh` on exported lists `FlatList` and `SectionList` works as expected now (no need to add `refreshControl` prop explicitly)
- On Android, the exported `ScrollView` is now same as the React Native ScrollView (but with scroll-to-top behavior added), whereas on iOS we still use react-native-gesture-handler ScrollView. We can change Android back to react-native-gesture-handler ScrollView when https://github.com/kmagiera/react-native-gesture-handler/issues/560 is resolved.
- Look for `scrollResponderScrollTo` function in our ScrollView, in react-native 0.59 the interface appears to have changed for FlatList such that this is needed. (react-navigation-native#20)

## Changed

- Stack header style improvements for web (react-navigation-stack#104)

## [3.7.1] - [2019-04-10](https://github.com/react-navigation/react-navigation/releases/tag/3.7.1)

## Fixes

- Update Flow types (#5800 and #5801)
- More open `navigationOptions` types for bottom tab navigator config (#5796)
- Fix hit slop for bottom tab bar (react-navigation-tabs#110)

## Added

- Add accessibility role and state to bottom bar (react-navigation-tabs#90)
- Hide tab bar when keyboard is shown (react-navigation-tabs#112)
- Specify default values for getAccessibilityX on tabs (react-navigation-tabs##116)
- Add a isFirstRouteInParent method to navigation object (react-navigation-core#51)

## [3.6.1] - [2019-04-02](https://github.com/react-navigation/react-navigation/releases/tag/3.6.1)

## Fixed

- Move event subscriptions to constructor in `withNavigationFocus` to ensure initial `didFocus` event is received.

## [3.6.0] - [2019-03-31](https://github.com/react-navigation/react-navigation/releases/tag/3.6.0)

## Added

- Export TabBarIconProps, TabBarLabelProps, DrawerIconProps, DrawerLabelProps, ScreenProps and InitialLayout.
- Add `disabled` prop to HeaderBackButton
- Add `StackViewTransitionConfigs.NoAnimation`
- Add `drawerContainerStyle` to navigator config for drawer navigator

## [3.5.1] - [2019-03-19](https://github.com/react-navigation/react-navigation/releases/tag/3.5.1)

## Added

- Export StackGestureContext and DrawerGestureContext
- Add missing type for withOrientation

## Fixed

- Fix header HeaderBackButton title TypeScript type

## [3.5.0] - [2019-03-19](https://github.com/react-navigation/react-navigation/releases/tag/3.5.0)

## Fixed

- Fixed types for `BottomTabBar`
- export `NavigationContext` type

## Changed

- Make 'react-native-gesture-handler' a peer dependency rather than a hard dependency

## [3.4.1] - [2019-03-16](https://github.com/react-navigation/react-navigation/releases/tag/3.4.1)

## Fixed

- Fix missing TypeScript definitions file in release package

## [3.4.0] - [2019-03-15](https://github.com/react-navigation/react-navigation/releases/tag/3.4.0)

## Added

- TypeScript type definition now included in the project.
- Better support for react-native-web in core and stack.

## Fixed

- Default key to null in stack reset action (https://github.com/react-navigation/react-navigation-core/commit/59238160d86284a3353d53af10688fcf3f36004f)
- Fix header back button label and title label scaling. Defaults to false. (https://github.com/react-navigation/react-navigation-stack/commit/c1f1dff465e9eebe274a08e274cf10570045fa23)

## Changed

- Remove react-lifecycles-compat from @react-navigation/core
- NavigationPlayground uses TypeScript

## [3.3.2] - [2019-02-25](https://github.com/react-navigation/react-navigation/releases/tag/3.3.2)

## Fixed

- Updated Flow types (https://github.com/react-navigation/react-navigation/commit/d3040e52b39bc8e91ffc1354d9c5f8c096baf597)

## [3.3.1] - [2019-02-25](https://github.com/react-navigation/react-navigation/releases/tag/3.3.1)

## Fixed

- SafeAreaView bottom inset on iPhone XR and XS fixed. (https://github.com/react-navigation/react-navigation/issues/5625)

## [3.3.0] - [2019-02-16](https://github.com/react-navigation/react-navigation/releases/tag/3.3.0)

## Added

- Pass through `drawerOpenProgress` to drawer content component (https://github.com/react-navigation/react-navigation-drawer/pull/40)

## [3.2.3] - [2019-02-09](https://github.com/react-navigation/react-navigation/releases/tag/3.2.3)

## Fixed

- `await` the result of `onTransitionStart` before starting the transition (https://github.com/react-navigation/react-navigation-stack/pull/79)

## [3.2.2]

- Oops, I skipped it. Nothing here.

## [3.2.1] - [2019-02-09](https://github.com/react-navigation/react-navigation/releases/tag/3.2.1)

## Fixed

- Remove accidental console.log

## [3.2.0] - [2019-02-08](https://github.com/react-navigation/react-navigation/releases/tag/3.2.0)

## Added

- Add support for `backBehavior: history'` and `backBehavior: 'order'` to any navigator based on SwitchRouter (eg: tab navigators). (https://github.com/react-navigation/react-navigation-core/pull/31)

## [3.1.5] - [2019-02-06](https://github.com/react-navigation/react-navigation/releases/tag/3.1.5)

## Fixed

- Revert "Transparent header measurement fix (https://github.com/react-navigation/react-navigation-stack/pull/71)"

## [3.1.4] - [2019-02-05](https://github.com/react-navigation/react-navigation/releases/tag/3.1.4)

## Fixed

- Fix references to onGestureFinish in StackViewLayout, should be onGestureEnd

## [3.1.3] - [2019-02-04](https://github.com/react-navigation/react-navigation/releases/tag/3.1.3)

## Fixed

- Stack navigator properly dismisses and restores keyboard when gesture starts and is cancelled
- Transparent header measurement fix (https://github.com/react-navigation/react-navigation-stack/pull/71)

## [3.1.2] - [2019-02-01](https://github.com/react-navigation/react-navigation/releases/tag/3.1.2)

## Fixed

- Update flow definition for `withNavigation` and `withNavigationFocus` to support `defaultProps`
- Prevent onRef callback be called twice on withNavigationFocus components (https://github.com/react-navigation/react-navigation-core/pull/30)
- Bump react-navigation-drawer version to improve performance - if you use Expo, you will need expo@^32.0.3 to update!

## [3.0.9] - [2018-12-19](https://github.com/react-navigation/react-navigation/releases/tag/3.0.9)

## Fixed

- Intermittent flicker when changing tabs while using react-native-screens fixed by not changing opacity (https://github.com/react-navigation/react-navigation-tabs/pull/80)
- Prevent fading the previous screen on push/pop on Android (https://github.com/react-navigation/react-navigation-stack/pull/73)

## [3.0.8] - [2018-12-08](https://github.com/react-navigation/react-navigation/releases/tag/3.0.8)

## Changed

- Lock create-react-context to 0.2.2

## [3.0.7] - [2018-12-08](https://github.com/react-navigation/react-navigation/releases/tag/3.0.7)

## Changed

- Optimize stack gesture to avoid a setState and reduce unnecessary Animated node creation (https://github.com/react-navigation/react-navigation-stack/pull/70)

## [3.0.6] - [2018-12-06](https://github.com/react-navigation/react-navigation/releases/tag/3.0.6)

## Fixes

- Fix drawer accessibility label when drawer label is not a string


## [3.0.5] - [2018-12-03](https://github.com/react-navigation/react-navigation/releases/tag/3.0.5)

## Fixes

- Fix crash in rare case where onNavigationStateChange on container leads to setState and container has screenProps (https://github.com/react-navigation/react-navigation/issues/5301)
- Expose underlaying ScrollView methods to NavigationAwareScrollable (https://github.com/react-navigation/react-navigation-native/pull/8)

## [3.0.4] - [2018-11-30](https://github.com/react-navigation/react-navigation/releases/tag/3.0.4)

## Changed

- Lock dependencies to exact versions

## Fixes

- Fix crash when screenInterpolator is null (https://github.com/react-navigation/react-navigation-stack/issues/64)
- Fix renderPager override (https://github.com/react-navigation/react-navigation-tabs/pull/70)

## Added

- Accessibility labels on drawer items (https://github.com/react-navigation/react-navigation-drawer/pull/30)


## [3.0.3] - [2018-11-30](https://github.com/react-navigation/react-navigation/releases/tag/3.0.3)

## Fixes

- Fix bug where if you navigate immediately when the navigator is first mounted the stack could get in an invalid state.
- Transparent stack card factors in header height now, even though you probably won't want to use this.
- Fix bug where shadow was still rendered on transparent stack
- Fix gestureResponseDistance custom values being ignored for modal stack

## [3.0.2] - [2018-11-27](https://github.com/react-navigation/react-navigation/releases/tag/3.0.2)

## Fixes

- Fix `drawerLockMode` on drawer navigator
- Fix RTL support in drawer navigator

## [3.0.1] - [2018-11-26](https://github.com/react-navigation/react-navigation/releases/tag/3.0.1)

## Fixes

- fix NavigationTestUtils.js deprecated file import.
- Update `getParam` flow typings to check `key` and `fallback` arguments, as well as return the correct type automatically.
- Fix regression in backgroundColor on cardStyle for stack navigator.

## [3.0.0] - [2018-11-17](https://github.com/react-navigation/react-navigation/releases/tag/3.0.0)

- Changes between the latest 2.x release and 3.0.0 are listed on the blog at https://reactnavigation.org/blog/2018/11/17/react-navigation-3.0.html

# [Previous major versions]

- [2.x](https://github.com/react-navigation/react-navigation/blob/2.x/CHANGELOG.md)

[Unreleased]: https://github.com/react-navigation/react-navigation/compare/3.8.1...HEAD
[3.8.1]: https://github.com/react-navigation/react-navigation/compare/3.8.0...3.8.1
[3.8.0]: https://github.com/react-navigation/react-navigation/compare/3.7.1...3.8.0
[3.7.1]: https://github.com/react-navigation/react-navigation/compare/3.6.1...3.7.1
[3.6.1]: https://github.com/react-navigation/react-navigation/compare/3.6.0...3.6.1
[3.6.0]: https://github.com/react-navigation/react-navigation/compare/3.5.1...3.6.0
[3.5.1]: https://github.com/react-navigation/react-navigation/compare/3.5.0...3.5.1
[3.5.0]: https://github.com/react-navigation/react-navigation/compare/3.4.1...3.5.0
[3.4.1]: https://github.com/react-navigation/react-navigation/compare/3.4.0...3.4.1
[3.4.0]: https://github.com/react-navigation/react-navigation/compare/3.3.2...3.4.0
[3.3.2]: https://github.com/react-navigation/react-navigation/compare/3.3.1...3.3.2
[3.3.1]: https://github.com/react-navigation/react-navigation/compare/3.3.0...3.3.1
[3.3.0]: https://github.com/react-navigation/react-navigation/compare/3.2.3...3.3.0
[3.2.3]: https://github.com/react-navigation/react-navigation/compare/3.2.1...3.2.3
[3.2.1]: https://github.com/react-navigation/react-navigation/compare/3.2.0...3.2.1
[3.2.0]: https://github.com/react-navigation/react-navigation/compare/3.1.5...3.2.0
[3.1.5]: https://github.com/react-navigation/react-navigation/compare/3.1.4...3.1.5
[3.1.4]: https://github.com/react-navigation/react-navigation/compare/3.1.3...3.1.4
[3.1.3]: https://github.com/react-navigation/react-navigation/compare/3.1.2...3.1.3
[3.1.2]: https://github.com/react-navigation/react-navigation/compare/3.0.9...3.1.2
[3.0.9]: https://github.com/react-navigation/react-navigation/compare/3.0.8...3.0.9
[3.0.8]: https://github.com/react-navigation/react-navigation/compare/3.0.7...3.0.8
[3.0.7]: https://github.com/react-navigation/react-navigation/compare/3.0.6...3.0.7
[3.0.6]: https://github.com/react-navigation/react-navigation/compare/3.0.5...3.0.6
[3.0.5]: https://github.com/react-navigation/react-navigation/compare/3.0.4...3.0.5
[3.0.4]: https://github.com/react-navigation/react-navigation/compare/3.0.3...3.0.4
[3.0.3]: https://github.com/react-navigation/react-navigation/compare/3.0.2...3.0.3
[3.0.2]: https://github.com/react-navigation/react-navigation/compare/3.0.1...3.0.2
[3.0.1]: https://github.com/react-navigation/react-navigation/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/react-navigation/react-navigation/compare/2.x...3.0.0
