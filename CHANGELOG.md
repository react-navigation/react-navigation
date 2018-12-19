# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/react-navigation/react-navigation/compare/3.0.9...HEAD
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
