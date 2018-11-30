# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/react-navigation/react-navigation/compare/3.0.4...HEAD
[3.0.4]: https://github.com/react-navigation/react-navigation/compare/3.0.3...3.0.4
[3.0.3]: https://github.com/react-navigation/react-navigation/compare/3.0.2...3.0.3
[3.0.2]: https://github.com/react-navigation/react-navigation/compare/3.0.1...3.0.2
[3.0.1]: https://github.com/react-navigation/react-navigation/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/react-navigation/react-navigation/compare/2.x...3.0.0
