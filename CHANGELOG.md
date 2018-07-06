# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.6.2] - [2018-07-05)(https://github.com/react-navigation/react-navigation/releases/tag/2.6.2)
### Changed
- Relax vertical padding warnings on header.

## [2.6.1] - [2018-07-05)(https://github.com/react-navigation/react-navigation/releases/tag/2.6.1)
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

[Unreleased]: https://github.com/react-navigation/react-navigation/compare/2.6.2...HEAD
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
