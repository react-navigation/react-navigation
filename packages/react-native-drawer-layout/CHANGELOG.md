# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.0.0-alpha.3](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-alpha.2...react-native-drawer-layout@4.0.0-alpha.3) (2023-11-17)

**Note:** Version bump only for package react-native-drawer-layout

# [4.0.0-alpha.2](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-alpha.1...react-native-drawer-layout@4.0.0-alpha.2) (2023-11-12)

### Bug Fixes

* cannot resolve use-latest-callback ([#11696](https://github.com/react-navigation/react-navigation/issues/11696)) ([361bc6a](https://github.com/react-navigation/react-navigation/commit/361bc6a3840b37ae082a70e4ff6315280814c7a1)) - by @jkaveri

# [4.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-alpha.0...react-native-drawer-layout@4.0.0-alpha.1) (2023-09-25)

### Bug Fixes

* call onGestureCancel correctly for drawer ([3cfb3e6](https://github.com/react-navigation/react-navigation/commit/3cfb3e63949f0aa6f4b14db02161dd88fd10cb12)) - by @satya164

# [4.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@3.2.1...react-native-drawer-layout@4.0.0-alpha.0) (2023-09-07)

* feat!: add a direction prop to NavigationContainer to specify rtl (#11393) ([8309636](https://github.com/react-navigation/react-navigation/commit/830963653fb5a489d02f1503222629373319b39e)), closes [#11393](https://github.com/react-navigation/react-navigation/issues/11393) - by @satya164

### BREAKING CHANGES

* Previously the navigators tried to detect RTL automatically and adjust the UI. However this is problematic since we cannot detect RTL in all cases (e.g. on Web).

This adds an optional `direction` prop to `NavigationContainer` instead so that user can specify when React Navigation's UI needs to be adjusted for RTL. It defaults to the value from `I18nManager` on native platforms, however it needs to be explicitly passed for Web.

## [3.2.1](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@3.2.0...react-native-drawer-layout@3.2.1) (2023-06-22)

**Note:** Version bump only for package react-native-drawer-layout

# [3.2.0](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@3.1.0...react-native-drawer-layout@3.2.0) (2023-03-01)

### Bug Fixes

* fix paths in sourcemap files ([368e069](https://github.com/react-navigation/react-navigation/commit/368e0691b9fb07d4b1cbe71cfe4c2f40512f93ad)) - by @satya164

### Features

* add gesture and transition events to drawer ([#11240](https://github.com/react-navigation/react-navigation/issues/11240)) ([50b94e4](https://github.com/react-navigation/react-navigation/commit/50b94e4f9518975b4fc7b46fe14d387bd9b17c7e)) - by @BeeMargarida

# 3.1.0 (2023-02-17)

### Bug Fixes

* added close drawer accessibility tap area ([#11184](https://github.com/react-navigation/react-navigation/issues/11184)) ([20ec204](https://github.com/react-navigation/react-navigation/commit/20ec2042b9d3c22388682c16fca4ef23e91ee011)) - by @mikegarfinkle

### Features

* extract drawer to a separate package ([58b7cae](https://github.com/react-navigation/react-navigation/commit/58b7caeaad00eafbcda36561e75e538e0f02c4af)) - by @satya164
