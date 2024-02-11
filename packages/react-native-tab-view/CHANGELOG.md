# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.0.0-alpha.3](https://github.com/react-navigation/react-navigation/compare/react-native-tab-view@4.0.0-alpha.2...react-native-tab-view@4.0.0-alpha.3) (2024-01-17)

**Note:** Version bump only for package react-native-tab-view

# [4.0.0-alpha.2](https://github.com/react-navigation/react-navigation/compare/react-native-tab-view@4.0.0-alpha.1...react-native-tab-view@4.0.0-alpha.2) (2023-11-17)

**Note:** Version bump only for package react-native-tab-view

# [4.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/react-native-tab-view@4.0.0-alpha.0...react-native-tab-view@4.0.0-alpha.1) (2023-11-12)

### Bug Fixes

* cannot resolve use-latest-callback ([#11696](https://github.com/react-navigation/react-navigation/issues/11696)) ([361bc6a](https://github.com/react-navigation/react-navigation/commit/361bc6a3840b37ae082a70e4ff6315280814c7a1)) - by @jkaveri

# [4.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/react-native-tab-view@3.5.2...react-native-tab-view@4.0.0-alpha.0) (2023-09-07)

### Bug Fixes

* Allow to use `PlatformColor` in the theme ([#11570](https://github.com/react-navigation/react-navigation/issues/11570)) ([64734e7](https://github.com/react-navigation/react-navigation/commit/64734e7bc0d7f203d8e5db6abcc9a88157a5f16c)) - by @retyui
* TabBar horizontal padding for contentContainer ([#11408](https://github.com/react-navigation/react-navigation/issues/11408)) ([24c0392](https://github.com/react-navigation/react-navigation/commit/24c03924397a6e59aba9f6b74a9c5cb4b939d9e1)), closes [#8667](https://github.com/react-navigation/react-navigation/issues/8667) - by @Freddy03h

* feat!: add a direction prop to NavigationContainer to specify rtl (#11393) ([8309636](https://github.com/react-navigation/react-navigation/commit/830963653fb5a489d02f1503222629373319b39e)), closes [#11393](https://github.com/react-navigation/react-navigation/issues/11393) - by @satya164

### Features

* add children prop to tab bar indicator component ([#11566](https://github.com/react-navigation/react-navigation/issues/11566)) ([fe3b560](https://github.com/react-navigation/react-navigation/commit/fe3b56072e39a6c7b33747c4d9e3f3d6a52ec60c)) - by @grezxune
* add direction prop to TabView ([#11322](https://github.com/react-navigation/react-navigation/issues/11322)) ([46735a3](https://github.com/react-navigation/react-navigation/commit/46735a38c46ee195da836dadcf58d6a4db7a381b)) - by @okwasniewski

### BREAKING CHANGES

* Previously the navigators tried to detect RTL automatically and adjust the UI. However this is problematic since we cannot detect RTL in all cases (e.g. on Web).

This adds an optional `direction` prop to `NavigationContainer` instead so that user can specify when React Navigation's UI needs to be adjusted for RTL. It defaults to the value from `I18nManager` on native platforms, however it needs to be explicitly passed for Web.

## [3.5.2](https://github.com/react-navigation/react-navigation/compare/react-native-tab-view@3.5.1...react-native-tab-view@3.5.2) (2023-06-22)

### Bug Fixes

* optimize tabBarItem by memoizing getter functions ([#11427](https://github.com/react-navigation/react-navigation/issues/11427)) ([1f94c8b](https://github.com/react-navigation/react-navigation/commit/1f94c8b7b2e11f09a36001ce7b512ec9468a63b5)) - by @okwasniewski

## [3.5.1](https://github.com/react-navigation/react-navigation/compare/react-native-tab-view@3.5.0...react-native-tab-view@3.5.1) (2023-03-01)

### Bug Fixes

* fix paths in sourcemap files ([368e069](https://github.com/react-navigation/react-navigation/commit/368e0691b9fb07d4b1cbe71cfe4c2f40512f93ad)) - by @satya164

# [3.5.0](https://github.com/react-navigation/react-navigation/compare/react-native-tab-view@3.3.0...react-native-tab-view@3.5.0) (2023-02-17)

### Bug Fixes

* split updating state to batches on long lists ([#11046](https://github.com/react-navigation/react-navigation/issues/11046)) ([0aa6a18](https://github.com/react-navigation/react-navigation/commit/0aa6a18f15bca0c943e22e866d178ad347a19714)) - by @okwasniewski

### Features

* add support to override pager's overScrollMode ([#11194](https://github.com/react-navigation/react-navigation/issues/11194)) ([0c4e83a](https://github.com/react-navigation/react-navigation/commit/0c4e83adf0eb8ea8d5ba6ff5520cf16dd8b82cc7)) - by @ouabing
* allow users to pass `android_ripple` config in TabView ([#11203](https://github.com/react-navigation/react-navigation/issues/11203)) ([15939d8](https://github.com/react-navigation/react-navigation/commit/15939d82cd7d77d2a75a870279d08cb18c7f9919)), closes [#11198](https://github.com/react-navigation/react-navigation/issues/11198) - by @okwasniewski
* extract drawer to a separate package ([58b7cae](https://github.com/react-navigation/react-navigation/commit/58b7caeaad00eafbcda36561e75e538e0f02c4af)) - by @satya164
