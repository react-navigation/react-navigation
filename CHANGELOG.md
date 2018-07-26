# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.9.3] - [2018-07-26](https://github.com/react-navigation/react-navigation/releases/tag/2.9.3)
### Added
- Add `NavigationTestUtils` which can be imported by path to be used with jest snapshot testing.

## [2.9.2] - [2018-07-25](https://github.com/react-navigation/react-navigation/releases/tag/2.9.2)
### Added
- Export `StackViewTransitionConfigs` to allow you to extend default config in custom transition configs. [#4761](https://github.com/react-navigation/react-navigation/pull/4761)

### Fixed
- Error when building with haul: ref to pathToRegexp.compile(#4658).
- Error when building with haul: ref to pathToRegexp.compile. [#4658](https://github.com/react-navigation/react-navigation/pull/4658).

## [2.9.1] - [2018-07-24](https://github.com/react-navigation/react-navigation/releases/tag/2.9.1)
### Fixed
- Incorrect parameters passed to title offset calculation led to bug in header layout when no right component (https://github.com/react-navigation/react-navigation/issues/4754)

### Fixed
- Typo in Header transition preset check.

## [2.9.0] - [2018-07-20](https://github.com/react-navigation/react-navigation/releases/tag/2.9.0)
### Added
- `headerLayoutPreset: 'center' | 'left'` to provide an easy solution for [questions like this](https://github.com/react-navigation/react-navigation/issues/4615).
- `headerBackTitleEnabled` - this configuration option for stack navigator allows you to force back button titles to either be rendered or not (if you disagree with defaults for your platform and layout preset).

### Fixed
- Android back button ripple is now appropriately sized (fixes [#3955](https://github.com/react-navigation/react-navigation/issues/3955)).
- Respect header background color on container (fixes edge case where user depended on displaying content that was rendered behind the navigator, this particular behavior should not be depended on and may break in the future, but this change is still useful regardless).


## [2.8.0] - [2018-07-19](https://github.com/react-navigation/react-navigation/releases/tag/2.8.0)
### Added
- `headerLeftContainerStyle`, `headerTitleContainerStyle`, and `headerRightContainerStyle` are exposed on `navigationOptions`. These properties allow you to customize the style of the container of `headerLeft`, `headerTitle` and `headerRight` components.

### Fixed
- Fixed memory leaks in `createNavigator`: [closure scope leak](https://github.com/react-navigation/react-navigation/commit/1a765562905e93bbae0262dd20c2688221c999e8), and [clean up old descriptors](https://github.com/react-navigation/react-navigation/commit/93642e16e7ff029586b68ee732ec790504ee4862).

## [2.7.0] - [2018-07-17](https://github.com/react-navigation/react-navigation/releases/tag/2.7.0)
### Added
- The enableURLHandling prop on the top level navigator component allows you to disable deep linking handling. Currently it is always enabled. To disable it, `<RootNavigator enableURLHandling={false} />`

### Changed
- StackNavigator.replace method no longer requires a key param. If the key is left undefined, the last screen in the stack will be replaced.

### Fixed
- Support headerLeft component for the first screen in a stack (#4608).
- Removed bottomBorder when `headerTransparent` is set to true.
- Improve empty path and param handling in deep linking (#4671). This fixes issues with deep linking and fully tests the differences between path: '' and path: null. Empty string matches empty paths, and null path will let the child router handle paths at the same level. Also it makes sure that params are not duplicated between path and query when they are serialized with getPathAndParamsForState.
- Fix onTransitionStart not being invoked when provided in navigator config.(#4100)
- Rare case when users navigated back and forth quickly with exactly the right timing would cause a crash due to a scene being queued to transition, then clobbered, then attempted to render as a stale scene but without a descriptor. ([commit](https://github.com/react-navigation/react-navigation/commit/cab4d71a5e09188df3f4a294c98779eecb860a78))

## [2.6.2] - [2018-07-06](https://github.com/react-navigation/react-navigation/releases/tag/2.6.2)
### Changed
- Relax vertical padding warnings on header.

## [2.6.1] - [2018-07-05](https://github.com/react-navigation/react-navigation/releases/tag/2.6.1)
### Added
- Warn for more invalid headerStyle properties (padding, top/right/bottom/left, position).

### Fixed
- Fixed missing header shadow on Android.

## [2.6.0] - [2018-07-04](https://github.com/react-navigation/react-navigation/releases/tag/2.6.0)
### Added
- [NavigationEvents](https://github.com/react-navigation/react-navigation/pull/4188) component as a declarative interface for subscribing to navigation focus events.

### Fixed
- Fix stack router child router delegation priority (https://github.com/react-navigation/react-navigation/commit/e8c1833053e37d28f0ce505ff323565abf23b6a2)
- Avoid crash when calling isFocused on old route (https://github.com/react-navigation/react-navigation/commit/0921889f7a3acfc6d6bcc4909d209eeeee985ba7)
- Stack router no longer attempts to parse query params within path handling
- Switch router now has exact same param treatment for URLs as stack router does

### Changed
- Internally we no longer need to special case PlatformHelpers by platform as react-native-web handles the APIs we mocked out with it now.

## [2.5.5] - [2018-06-27](https://github.com/react-navigation/react-navigation/releases/tag/2.5.5)
### Added
- Throw error in development mode when header navigation option is set to a string - a common mistake that would otherwise result in a cryptic error message.
- Throw error in development mode when title is not a string.

### Fixed
- Delegate to child routers for more than just the top screen in the stack.
- Update react-navigation-drawer to 0.4.3 to fix `initialRouteParams` option

## [2.5.4] - [2018-06-27](https://github.com/react-navigation/react-navigation/releases/tag/2.5.4)
### Fixed
- Header no longer sometimes flashes for 1 frame when using `header: null` on initial route of stack with floating header.
- Export `createSwitchNavigator` in react-navigation.web.js

## [2.5.3] - [2018-06-23](https://github.com/react-navigation/react-navigation/releases/tag/2.5.3)
### Fixed
- `setParams` applies to the navigation object it is called on even if that is the navigation object for a navigation view (more details in https://github.com/react-navigation/react-navigation/issues/4497)

## [2.5.2] - [2018-06-23](https://github.com/react-navigation/react-navigation/releases/tag/2.5.2)
### Fixed
- Update react-navigation-drawer to fix regression in toggleDrawer

## [2.5.1] - [2018-06-22](https://github.com/react-navigation/react-navigation/releases/tag/2.5.1)
### Fixed
- `transitionConfig` in stack navigator no longer passes incorrect `fromTransitionProps` when navigating back

## [2.5.0] - [2018-06-22](https://github.com/react-navigation/react-navigation/releases/tag/2.5.0)
### Changed
- Refactor internals to make it play more nicely with web

### Fixed
- `const defaultGetStateForAction = SwitchBasedNavigator.router.getStateForAction` no longer throws error.
- Updated react-navigation-drawer to 0.4.1 which should fix issues related to automatically closing drawer when changing routes.

## [2.4.1] - [2018-06-21](https://github.com/react-navigation/react-navigation/releases/tag/2.4.1)
### Changed
- Improved examples

[Unreleased]: https://github.com/react-navigation/react-navigation/compare/2.9.3...HEAD
[2.9.3]: https://github.com/react-navigation/react-navigation/compare/2.9.2...2.9.3
[2.9.2]: https://github.com/react-navigation/react-navigation/compare/2.9.1...2.9.2
[2.9.1]: https://github.com/react-navigation/react-navigation/compare/2.9.0...2.9.1
[2.9.0]: https://github.com/react-navigation/react-navigation/compare/2.8.0...2.9.0
[2.8.0]: https://github.com/react-navigation/react-navigation/compare/2.7.0...2.8.0
[2.7.0]: https://github.com/react-navigation/react-navigation/compare/2.6.2...2.7.0
[2.6.2]: https://github.com/react-navigation/react-navigation/compare/2.6.1...2.6.2
[2.6.1]: https://github.com/react-navigation/react-navigation/compare/2.6.0...2.6.1
[2.6.0]: https://github.com/react-navigation/react-navigation/compare/2.5.5...2.6.0
[2.5.5]: https://github.com/react-navigation/react-navigation/compare/2.5.4...2.5.5
[2.5.4]: https://github.com/react-navigation/react-navigation/compare/2.5.3...2.5.4
[2.5.3]: https://github.com/react-navigation/react-navigation/compare/2.5.2...2.5.3
[2.5.2]: https://github.com/react-navigation/react-navigation/compare/2.5.1...2.5.2
[2.5.1]: https://github.com/react-navigation/react-navigation/compare/2.5.0...2.5.1
[2.5.0]: https://github.com/react-navigation/react-navigation/compare/2.4.1...2.5.0
[2.4.1]: https://github.com/react-navigation/react-navigation/compare/2.4.0...2.4.1
