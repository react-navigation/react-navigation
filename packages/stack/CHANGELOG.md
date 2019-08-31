# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.0.0-alpha.10](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.9...@react-navigation/stack@5.0.0-alpha.10) (2019-08-31)

**Note:** Version bump only for package @react-navigation/stack





# [5.0.0-alpha.9](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.8...@react-navigation/stack@5.0.0-alpha.9) (2019-08-30)


### Bug Fixes

* change interpolated style when idle to avoid messing up reanimated ([3ad2e6e](https://github.com/react-navigation/navigation-ex/commit/3ad2e6e))
* properly set animated node on gestureEnabled change ([6a8242c](https://github.com/react-navigation/navigation-ex/commit/6a8242c))





# [5.0.0-alpha.8](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.7...@react-navigation/stack@5.0.0-alpha.8) (2019-08-29)


### Bug Fixes

* allow making params optional. fixes [#80](https://github.com/react-navigation/navigation-ex/issues/80) ([a9d4813](https://github.com/react-navigation/navigation-ex/commit/a9d4813))
* fix gestures not working in stack ([8c1acc3](https://github.com/react-navigation/navigation-ex/commit/8c1acc3))





# [5.0.0-alpha.7](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.6...@react-navigation/stack@5.0.0-alpha.7) (2019-08-28)


### Bug Fixes

* fix stack nested in tab always getting reset ([dead4e8](https://github.com/react-navigation/navigation-ex/commit/dead4e8))





# [5.0.0-alpha.6](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.5...@react-navigation/stack@5.0.0-alpha.6) (2019-08-28)


### Features

* disable gesture logic when no gesture stack ([38336b0](https://github.com/react-navigation/navigation-ex/commit/38336b0))





# [5.0.0-alpha.5](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.4...@react-navigation/stack@5.0.0-alpha.5) (2019-08-27)


### Bug Fixes

* link proper descriptor for StackView ([469ec31](https://github.com/react-navigation/navigation-ex/commit/469ec31))
* set correct pointer events when active prop changes ([1bbd6ac](https://github.com/react-navigation/navigation-ex/commit/1bbd6ac))


### Features

* add hook to scroll to top on tab press ([9e1104c](https://github.com/react-navigation/navigation-ex/commit/9e1104c))
* add memoization of spring for stack ([7990cf2](https://github.com/react-navigation/navigation-ex/commit/7990cf2))





# [5.0.0-alpha.4](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.3...@react-navigation/stack@5.0.0-alpha.4) (2019-08-22)


### Bug Fixes

* fix path to typescript definitions ([f182315](https://github.com/react-navigation/navigation-ex/commit/f182315))





# [5.0.0-alpha.3](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.2...@react-navigation/stack@5.0.0-alpha.3) (2019-08-22)

**Note:** Version bump only for package @react-navigation/stack





# [5.0.0-alpha.2](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.1...@react-navigation/stack@5.0.0-alpha.2) (2019-08-21)


### Bug Fixes

* check if left button is truthy to add a left offset ([8645e36](https://github.com/react-navigation/navigation-ex/commit/8645e36))





# 5.0.0-alpha.1 (2019-08-21)


### Bug Fixes

* bunch of fixes regarding reliability of callbacks ([4878d18](https://github.com/react-navigation/navigation-ex/commit/4878d18))
* change single param to props object in onTransition callba… ([#171](https://github.com/react-navigation/navigation-ex/issues/171)) ([53f8ba9](https://github.com/react-navigation/navigation-ex/commit/53f8ba9))
* disable react-native-screens on iOS ([fb9dbf9](https://github.com/react-navigation/navigation-ex/commit/fb9dbf9))
* don't enable overlay on iOS by default ([27f0ec4](https://github.com/react-navigation/navigation-ex/commit/27f0ec4))
* don't enable screens for modal stacks ([fdf8b1a](https://github.com/react-navigation/navigation-ex/commit/fdf8b1a))
* don't ignore headerLeft if specified. fixes [#164](https://github.com/react-navigation/navigation-ex/issues/164) ([c9b2c4d](https://github.com/react-navigation/navigation-ex/commit/c9b2c4d))
* don't set a header height when a custom header is specified ([1b82e25](https://github.com/react-navigation/navigation-ex/commit/1b82e25))
* fix back button not working in header ([73424b8](https://github.com/react-navigation/navigation-ex/commit/73424b8))
* fix border radius of modal presentation ([1cf7dc5](https://github.com/react-navigation/navigation-ex/commit/1cf7dc5))
* fix broken shadows on card ([da8da3d](https://github.com/react-navigation/navigation-ex/commit/da8da3d))
* fix header tint color not applied ([879b0ea](https://github.com/react-navigation/navigation-ex/commit/879b0ea))
* fix peer deps and add git urls ([6b4fc74](https://github.com/react-navigation/navigation-ex/commit/6b4fc74))
* fix types for stack config ([bba0feb](https://github.com/react-navigation/navigation-ex/commit/bba0feb))
* fix typo preventing the screen from being cleaned up ([354da7d](https://github.com/react-navigation/navigation-ex/commit/354da7d))
* handle RTL properly ([29de72a](https://github.com/react-navigation/navigation-ex/commit/29de72a))
* hide background for unfocused header in fade ([3164527](https://github.com/react-navigation/navigation-ex/commit/3164527))
* hide overflow in wipe preset ([3f7a54d](https://github.com/react-navigation/navigation-ex/commit/3f7a54d))
* make sure components update when descriptor changes ([6792be3](https://github.com/react-navigation/navigation-ex/commit/6792be3))
* make sure left button isn't bigger than screen width / 2 ([ebc4865](https://github.com/react-navigation/navigation-ex/commit/ebc4865))
* make the header appear static when sibling of headerless screen ([55c3085](https://github.com/react-navigation/navigation-ex/commit/55c3085))
* mark descriptors as optional properties ([006a4ea](https://github.com/react-navigation/navigation-ex/commit/006a4ea))
* properly handle floating header height ([06f628b](https://github.com/react-navigation/navigation-ex/commit/06f628b))
* properly normalize velocity ([f2e3c2b](https://github.com/react-navigation/navigation-ex/commit/f2e3c2b))
* properly set pointerEvents on the views ([0589275](https://github.com/react-navigation/navigation-ex/commit/0589275))
* reduce card gesture velocity impact ([#161](https://github.com/react-navigation/navigation-ex/issues/161)) ([81b1bdf](https://github.com/react-navigation/navigation-ex/commit/81b1bdf))
* support specifying header background color in headerStyle ([98d29da](https://github.com/react-navigation/navigation-ex/commit/98d29da))
* tweak the easing for android ([78c4f25](https://github.com/react-navigation/navigation-ex/commit/78c4f25))
* tweak transition spec to prevent jumping effect ([9f3b70f](https://github.com/react-navigation/navigation-ex/commit/9f3b70f))
* use a separate shadow view for the cards ([d2397d5](https://github.com/react-navigation/navigation-ex/commit/d2397d5))
* use a shadow instead of a border for header on iOS ([6e9d05b](https://github.com/react-navigation/navigation-ex/commit/6e9d05b)), closes [#97](https://github.com/react-navigation/navigation-ex/issues/97)
* use MaskedView from @react-native-community/masked-view ([7772ac5](https://github.com/react-navigation/navigation-ex/commit/7772ac5))
* use opacity in headerStyle ([9dce71c](https://github.com/react-navigation/navigation-ex/commit/9dce71c))
* use pure component for stack items ([aeec520](https://github.com/react-navigation/navigation-ex/commit/aeec520))
* when header mode is screen, disable animations by default ([4e2afa0](https://github.com/react-navigation/navigation-ex/commit/4e2afa0))
* whitelist supported styles instead of blacklist ([1fb33c8](https://github.com/react-navigation/navigation-ex/commit/1fb33c8))


### Features

* add a canGoBack prop to header back button ([7c86cfa](https://github.com/react-navigation/navigation-ex/commit/7c86cfa))
* add cardX options in navigationOptions ([30002a1](https://github.com/react-navigation/navigation-ex/commit/30002a1))
* add comments ([c2eb482](https://github.com/react-navigation/navigation-ex/commit/c2eb482))
* add headerBackgroundStyle option ([2ea0912](https://github.com/react-navigation/navigation-ex/commit/2ea0912))
* add headerBackTitleVisible option to navigation options ([27c4861](https://github.com/react-navigation/navigation-ex/commit/27c4861))
* add headerTransparent option ([d973817](https://github.com/react-navigation/navigation-ex/commit/d973817))
* add iOS modal presentation style ([838732d](https://github.com/react-navigation/navigation-ex/commit/838732d))
* add on transition end callback ([#153](https://github.com/react-navigation/navigation-ex/issues/153)) ([51b1069](https://github.com/react-navigation/navigation-ex/commit/51b1069))
* allow specifying style interpolators in navigationOptions ([#155](https://github.com/react-navigation/navigation-ex/issues/155)) ([282cfe5](https://github.com/react-navigation/navigation-ex/commit/282cfe5))
* consider both velocity and position while calculating the next position ([#146](https://github.com/react-navigation/navigation-ex/issues/146)) ([b8237de](https://github.com/react-navigation/navigation-ex/commit/b8237de))
* implement various navigators ([f0b80ce](https://github.com/react-navigation/navigation-ex/commit/f0b80ce))
* inform whether screen is opening/closing in onTransition callbacks ([#169](https://github.com/react-navigation/navigation-ex/issues/169)) ([c0c17e9](https://github.com/react-navigation/navigation-ex/commit/c0c17e9))
* integrate react-native-screens ([#145](https://github.com/react-navigation/navigation-ex/issues/145)) ([a8460e5](https://github.com/react-navigation/navigation-ex/commit/a8460e5))
* make listeners reliable ([73b8d22](https://github.com/react-navigation/navigation-ex/commit/73b8d22))
* new implementation with reanimated ([9b176e9](https://github.com/react-navigation/navigation-ex/commit/9b176e9))
* support a function for headerTitle ([95055c1](https://github.com/react-navigation/navigation-ex/commit/95055c1))
