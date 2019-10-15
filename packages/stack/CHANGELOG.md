# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.0.0-alpha.25](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.24...@react-navigation/stack@5.0.0-alpha.25) (2019-10-15)


### Bug Fixes

* don't ignore descriptors change ([9d9fe31](https://github.com/react-navigation/navigation-ex/commit/9d9fe31))
* increase hitSlop of back button on Android ([c7da1e4](https://github.com/react-navigation/navigation-ex/commit/c7da1e4))
* interpolation in iOS modal presentation ([b32cda2](https://github.com/react-navigation/navigation-ex/commit/b32cda2))
* make modal presentation mode fullscreen on landscape ([#124](https://github.com/react-navigation/navigation-ex/issues/124)) ([e789846](https://github.com/react-navigation/navigation-ex/commit/e789846))


### Features

* add a headerTitleAlign option to center or left align title ([6a0ca90](https://github.com/react-navigation/navigation-ex/commit/6a0ca90))
* export TransitionSpecs ([708dde0](https://github.com/react-navigation/navigation-ex/commit/708dde0))
* initial version of native stack ([#102](https://github.com/react-navigation/navigation-ex/issues/102)) ([ba3f718](https://github.com/react-navigation/navigation-ex/commit/ba3f718))





# [5.0.0-alpha.24](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.23...@react-navigation/stack@5.0.0-alpha.24) (2019-10-06)


### Bug Fixes

* actually expose gestureVelocityImpact in the public API ([16079d1](https://github.com/react-navigation/navigation-ex/commit/16079d1))
* don't recompute if routes didn't change ([615b523](https://github.com/react-navigation/navigation-ex/commit/615b523))
* handling vertical gesture in RTL ([#122](https://github.com/react-navigation/navigation-ex/issues/122)) ([a27ade8](https://github.com/react-navigation/navigation-ex/commit/a27ade8))
* use next screen's animation when not focused. fixes [#87](https://github.com/react-navigation/navigation-ex/issues/87) ([b4a7681](https://github.com/react-navigation/navigation-ex/commit/b4a7681))


### Features

* add gestureVelocityImpact as a prop for stack ([#123](https://github.com/react-navigation/navigation-ex/issues/123)) ([8294efc](https://github.com/react-navigation/navigation-ex/commit/8294efc))
* drop header: null in favor of more explitit headerShown option ([ba6b6ae](https://github.com/react-navigation/navigation-ex/commit/ba6b6ae))





# [5.0.0-alpha.23](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.22...@react-navigation/stack@5.0.0-alpha.23) (2019-10-03)


### Bug Fixes

* fix passing insets to interpolator ([6f5f4b7](https://github.com/react-navigation/navigation-ex/commit/6f5f4b7))
* fix vertical gesture ([a7c4a4d](https://github.com/react-navigation/navigation-ex/commit/a7c4a4d))





# [5.0.0-alpha.22](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.21...@react-navigation/stack@5.0.0-alpha.22) (2019-10-03)

**Note:** Version bump only for package @react-navigation/stack





# [5.0.0-alpha.21](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.20...@react-navigation/stack@5.0.0-alpha.21) (2019-10-03)


### Bug Fixes

* add missing React import ([ece6e38](https://github.com/react-navigation/navigation-ex/commit/ece6e38))
* fix header buttons not clickable on Android. fixes [#108](https://github.com/react-navigation/navigation-ex/issues/108) ([da944cc](https://github.com/react-navigation/navigation-ex/commit/da944cc))
* keep the routes we are closing or replacing ([bc3586a](https://github.com/react-navigation/navigation-ex/commit/bc3586a))





# [5.0.0-alpha.20](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.19...@react-navigation/stack@5.0.0-alpha.20) (2019-09-27)


### Features

* export some more type aliases ([8b78d61](https://github.com/react-navigation/navigation-ex/commit/8b78d61))





# [5.0.0-alpha.19](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.18...@react-navigation/stack@5.0.0-alpha.19) (2019-09-23)


### Bug Fixes

* vertical gesture in stack ([4ee19bc](https://github.com/react-navigation/navigation-ex/commit/4ee19bc))





# [5.0.0-alpha.18](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.17...@react-navigation/stack@5.0.0-alpha.18) (2019-09-23)


### Bug Fixes

* fix header rendered behind card. closes [#108](https://github.com/react-navigation/navigation-ex/issues/108) ([2f66556](https://github.com/react-navigation/navigation-ex/commit/2f66556))


### Features

* **stack:** use Animated.Text for header title ([#105](https://github.com/react-navigation/navigation-ex/issues/105)) ([f398136](https://github.com/react-navigation/navigation-ex/commit/f398136))
* **stack:** use Animated.View for header background ([#106](https://github.com/react-navigation/navigation-ex/issues/106)) ([089390c](https://github.com/react-navigation/navigation-ex/commit/089390c))





# [5.0.0-alpha.17](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.16...@react-navigation/stack@5.0.0-alpha.17) (2019-09-17)


### Bug Fixes

* add fallbacks for non-web modules ([b4bbf9b](https://github.com/react-navigation/navigation-ex/commit/b4bbf9b)), closes [#95](https://github.com/react-navigation/navigation-ex/issues/95) [#96](https://github.com/react-navigation/navigation-ex/issues/96)
* provide navigation prop in header ([30e510d](https://github.com/react-navigation/navigation-ex/commit/30e510d))





# [5.0.0-alpha.16](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.15...@react-navigation/stack@5.0.0-alpha.16) (2019-09-16)


### Bug Fixes

* don't remove route if animation isn't finished when dragging ([#100](https://github.com/react-navigation/navigation-ex/issues/100)) ([6af8400](https://github.com/react-navigation/navigation-ex/commit/6af8400))
* tweak android q animations ([f57a91c](https://github.com/react-navigation/navigation-ex/commit/f57a91c))


### Features

* integrate `InterationManager` in stack ([9563a27](https://github.com/react-navigation/navigation-ex/commit/9563a27))
* make example run as bare react-native project as well ([#85](https://github.com/react-navigation/navigation-ex/issues/85)) ([d16c20c](https://github.com/react-navigation/navigation-ex/commit/d16c20c))





# [5.0.0-alpha.15](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.14...@react-navigation/stack@5.0.0-alpha.15) (2019-09-04)


### Features

* add approximate android Q transition ([196cce0](https://github.com/react-navigation/navigation-ex/commit/196cce0))





# [5.0.0-alpha.14](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.13...@react-navigation/stack@5.0.0-alpha.14) (2019-09-03)


### Bug Fixes

* change order of attaching nodes in card exec ([167d58c](https://github.com/react-navigation/navigation-ex/commit/167d58c))





# [5.0.0-alpha.13](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.12...@react-navigation/stack@5.0.0-alpha.13) (2019-09-01)


### Features

* useForeground if possible in stack header backButton ([aa6313c](https://github.com/react-navigation/navigation-ex/commit/aa6313c))





# [5.0.0-alpha.12](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.11...@react-navigation/stack@5.0.0-alpha.12) (2019-09-01)


### Bug Fixes

* defer running the animation to next frame ([c7a79a6](https://github.com/react-navigation/navigation-ex/commit/c7a79a6))
* stack with gesture enabled ([55ec815](https://github.com/react-navigation/navigation-ex/commit/55ec815))





# [5.0.0-alpha.11](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/stack@5.0.0-alpha.10...@react-navigation/stack@5.0.0-alpha.11) (2019-09-01)


### Features

* optimizations in stack ([3f853d4](https://github.com/react-navigation/navigation-ex/commit/3f853d4))





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
