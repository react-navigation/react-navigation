# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.4...@react-navigation/elements@2.0.0-alpha.5) (2024-01-17)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-alpha.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.3...@react-navigation/elements@2.0.0-alpha.4) (2023-11-17)

### Bug Fixes

* darken the tint color for light colored button text ([d5e6b9e](https://github.com/react-navigation/react-navigation/commit/d5e6b9eaa0f3d347e2449ff8459bad8274de653e)) - by @satya164
* update peer dependencies when publishing ([c440703](https://github.com/react-navigation/react-navigation/commit/c44070310f875e488708f2a6c52ffddcea05b0e6)) - by @

# [2.0.0-alpha.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.2...@react-navigation/elements@2.0.0-alpha.3) (2023-11-12)

### Bug Fixes

* headerHeight on phones with dynamic island ([#11338](https://github.com/react-navigation/react-navigation/issues/11338)) ([e4815c5](https://github.com/react-navigation/react-navigation/commit/e4815c538536ddccf4207b87bf3e2f1603dedd84)), closes [#10989](https://github.com/react-navigation/react-navigation/issues/10989) - by @dylancom

### Features

* add a button element to elements package  ([#11669](https://github.com/react-navigation/react-navigation/issues/11669)) ([25a85c9](https://github.com/react-navigation/react-navigation/commit/25a85c90384ddfb6db946e791c01d8e033e04aa6)) - by @satya164

# [2.0.0-alpha.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.1...@react-navigation/elements@2.0.0-alpha.2) (2023-09-25)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.0...@react-navigation/elements@2.0.0-alpha.1) (2023-09-13)

### Features

* add option to show tabs on the side ([#11578](https://github.com/react-navigation/react-navigation/issues/11578)) ([cd15fda](https://github.com/react-navigation/react-navigation/commit/cd15fdafe7acc428826bd5106c7ba62c1b5153ca)) - by @satya164

# [2.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.4.0-alpha.1...@react-navigation/elements@2.0.0-alpha.0) (2023-09-07)

### Bug Fixes

* add default value to labelVisible in HeaderBackBox ([#11308](https://github.com/react-navigation/react-navigation/issues/11308)) ([bd96d89](https://github.com/react-navigation/react-navigation/commit/bd96d896f17a9930bf9c44ec176ab77ac7138bed)) - by @gkasdorf
* Allow to use `PlatformColor` in the theme ([#11570](https://github.com/react-navigation/react-navigation/issues/11570)) ([64734e7](https://github.com/react-navigation/react-navigation/commit/64734e7bc0d7f203d8e5db6abcc9a88157a5f16c)) - by @retyui
* make back button ripple visible ([#11386](https://github.com/react-navigation/react-navigation/issues/11386)) ([c43208f](https://github.com/react-navigation/react-navigation/commit/c43208fc196169e2bf5cea9e2530f5a37bf666bb)), closes [#9794](https://github.com/react-navigation/react-navigation/issues/9794) - by @vonovak

* feat!: add a direction prop to NavigationContainer to specify rtl (#11393) ([8309636](https://github.com/react-navigation/react-navigation/commit/830963653fb5a489d02f1503222629373319b39e)), closes [#11393](https://github.com/react-navigation/react-navigation/issues/11393) - by @satya164

### Features

* add animation prop to bottom tab ([#11323](https://github.com/react-navigation/react-navigation/issues/11323)) ([8d2a6d8](https://github.com/react-navigation/react-navigation/commit/8d2a6d8ef642872d3d506dca483b7474471a040c)) - by @teneeto
* add shifting animation to bottom-tabs and various fixes ([#11581](https://github.com/react-navigation/react-navigation/issues/11581)) ([6d93c2d](https://github.com/react-navigation/react-navigation/commit/6d93c2da661e1991f6e60f25abf137110a005509)) - by @satya164

### BREAKING CHANGES

* Previously the navigators tried to detect RTL automatically and adjust the UI. However this is problematic since we cannot detect RTL in all cases (e.g. on Web).

This adds an optional `direction` prop to `NavigationContainer` instead so that user can specify when React Navigation's UI needs to be adjusted for RTL. It defaults to the value from `I18nManager` on native platforms, however it needs to be explicitly passed for Web.

# [1.4.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.4.0-alpha.0...@react-navigation/elements@1.4.0-alpha.1) (2023-06-22)

**Note:** Version bump only for package @react-navigation/elements

# [1.4.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.9-alpha.0...@react-navigation/elements@1.4.0-alpha.0) (2023-03-01)

### Bug Fixes

* fix paths in sourcemap files ([368e069](https://github.com/react-navigation/react-navigation/commit/368e0691b9fb07d4b1cbe71cfe4c2f40512f93ad)) - by @satya164

### Features

* add ability to customize the fonts with the theme ([#11243](https://github.com/react-navigation/react-navigation/issues/11243)) ([1cd6836](https://github.com/react-navigation/react-navigation/commit/1cd6836f1d10bcdf7f96d9e4b9f7de0ddea9391f)) - by @satya164

## [1.3.9-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.7...@react-navigation/elements@1.3.9-alpha.0) (2023-02-17)

**Note:** Version bump only for package @react-navigation/elements

## [1.3.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.6...@react-navigation/elements@1.3.7) (2022-11-21)

### Bug Fixes

* add accessibility props to NativeStack screens ([#11022](https://github.com/react-navigation/react-navigation/issues/11022)) ([3ab05af](https://github.com/react-navigation/react-navigation/commit/3ab05afeb6412b8e5566270442ac14a463136620))
* supersede Platform.isTVOS for Platform.isTV ([#10973](https://github.com/react-navigation/react-navigation/issues/10973)) ([1846de6](https://github.com/react-navigation/react-navigation/commit/1846de6bd8247992286d39ee76e65f27debb1754))

## [1.3.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.4...@react-navigation/elements@1.3.6) (2022-09-16)

### Bug Fixes

* replace deprecated I18nManager.isRTL with 18nManager.getConstants().isRTL ([#10547](https://github.com/react-navigation/react-navigation/issues/10547)) ([50b88d4](https://github.com/react-navigation/react-navigation/commit/50b88d40496a04f613073c63119b21a104ec9bc2))

## [1.3.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.4...@react-navigation/elements@1.3.5) (2022-08-24)

### Bug Fixes

* replace deprecated I18nManager.isRTL with 18nManager.getConstants().isRTL ([#10547](https://github.com/react-navigation/react-navigation/issues/10547)) ([50b88d4](https://github.com/react-navigation/react-navigation/commit/50b88d40496a04f613073c63119b21a104ec9bc2))

## [1.3.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.3...@react-navigation/elements@1.3.4) (2022-07-05)

### Bug Fixes

* ensure same @types/react version in repo ([#10663](https://github.com/react-navigation/react-navigation/issues/10663)) ([e662465](https://github.com/react-navigation/react-navigation/commit/e6624653fbbd931158dbebd17142abf9637205b6)), closes [#10655](https://github.com/react-navigation/react-navigation/issues/10655)

## [1.3.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.2...@react-navigation/elements@1.3.3) (2022-04-01)

**Note:** Version bump only for package @react-navigation/elements

## [1.3.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.1...@react-navigation/elements@1.3.2) (2022-04-01)

### Bug Fixes

* fix type errors when passing animated styles to header ([9058b1c](https://github.com/react-navigation/react-navigation/commit/9058b1c22f4fc1358c72d67150a0e3f37ff802e7))

## [1.3.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.0...@react-navigation/elements@1.3.1) (2022-02-02)

**Note:** Version bump only for package @react-navigation/elements

# [1.3.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.2.1...@react-navigation/elements@1.3.0) (2022-01-29)

### Bug Fixes

* fix exposing custom header height with modals ([3b4edf7](https://github.com/react-navigation/react-navigation/commit/3b4edf7a8dfefb06a7ae1db2cbad48a5b19630bb))

### Features

* **native-stack:** add support for header background image ([393773b](https://github.com/react-navigation/react-navigation/commit/393773b688247456d09f397a794eff19424502f6))
* pass canGoBack to headerRight ([82a1669](https://github.com/react-navigation/react-navigation/commit/82a16690973a7935939a25a66d5786955b6c8ba7))

## [1.2.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.2.0...@react-navigation/elements@1.2.1) (2021-10-12)

**Note:** Version bump only for package @react-navigation/elements

# [1.2.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.1.2...@react-navigation/elements@1.2.0) (2021-10-09)

### Features

* add a headerShadowVisible option to header ([8e7ba69](https://github.com/react-navigation/react-navigation/commit/8e7ba692661b69f93768add4c103bc31c814327c))

## [1.1.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.1.1...@react-navigation/elements@1.1.2) (2021-09-26)

**Note:** Version bump only for package @react-navigation/elements

## [1.1.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.1.0...@react-navigation/elements@1.1.1) (2021-09-26)

### Bug Fixes

* resized view never re-appears on macos. fixes [#9889](https://github.com/react-navigation/react-navigation/issues/9889) ([#9904](https://github.com/react-navigation/react-navigation/issues/9904)) ([0dde476](https://github.com/react-navigation/react-navigation/commit/0dde476906006e84d42d754d06a4681633e9fb4b))

# [1.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.4...@react-navigation/elements@1.1.0) (2021-08-17)

### Features

* **elements:** add style to SafeAreaProviderCompat props ([#9793](https://github.com/react-navigation/react-navigation/issues/9793)) ([f73aa55](https://github.com/react-navigation/react-navigation/commit/f73aa55fb2b7e7ca65d5f66269a43281f7ce0680))

## [1.0.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.3...@react-navigation/elements@1.0.4) (2021-08-11)

### Bug Fixes

* fix headerTransparent not working outside stack navigator ([42c43ff](https://github.com/react-navigation/react-navigation/commit/42c43ff7617112afd223ecb323be622666c79096))

## [1.0.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.2...@react-navigation/elements@1.0.3) (2021-08-09)

### Bug Fixes

* avoid overflowing long titles ([bacdbbd](https://github.com/react-navigation/react-navigation/commit/bacdbbdd7c5df73b84aa1ed8c0329c9525d0fdba))
* pass onlayout to headerTitle ([#9808](https://github.com/react-navigation/react-navigation/issues/9808)) ([a79ce57](https://github.com/react-navigation/react-navigation/commit/a79ce57aa7f9be3a47a09728e920c0d4a805f5aa))

## [1.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.1...@react-navigation/elements@1.0.2) (2021-08-07)

**Note:** Version bump only for package @react-navigation/elements

## [1.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0...@react-navigation/elements@1.0.1) (2021-08-03)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.21...@react-navigation/elements@1.0.0) (2021-08-01)

### Bug Fixes

* match native iOS header height in stack ([51b636d](https://github.com/react-navigation/react-navigation/commit/51b636d7268fc05a8a9aca9e6aad0161674f238e))

### Features

* basic web implementation for native stack ([de84458](https://github.com/react-navigation/react-navigation/commit/de8445896021da4865089ba44e95afffbcee0919))
* expose header height in native-stack ([#9774](https://github.com/react-navigation/react-navigation/issues/9774)) ([20abccd](https://github.com/react-navigation/react-navigation/commit/20abccda0d5074f61b2beb555b881a2087d27bb0))

# [1.0.0-next.21](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.20...@react-navigation/elements@1.0.0-next.21) (2021-07-16)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.20](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.19...@react-navigation/elements@1.0.0-next.20) (2021-07-16)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.19](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.17...@react-navigation/elements@1.0.0-next.19) (2021-07-01)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.17...@react-navigation/elements@1.0.0-next.18) (2021-06-10)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.16...@react-navigation/elements@1.0.0-next.17) (2021-06-01)

### Bug Fixes

* tweak opacity animation for PlatformPressable ([b46c433](https://github.com/react-navigation/react-navigation/commit/b46c433f1e012fc3215ec32ac787c7c018963505))

# [1.0.0-next.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.15...@react-navigation/elements@1.0.0-next.16) (2021-05-29)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.14...@react-navigation/elements@1.0.0-next.15) (2021-05-29)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.13...@react-navigation/elements@1.0.0-next.14) (2021-05-27)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.12...@react-navigation/elements@1.0.0-next.13) (2021-05-26)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.11...@react-navigation/elements@1.0.0-next.12) (2021-05-25)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.10...@react-navigation/elements@1.0.0-next.11) (2021-05-23)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.9...@react-navigation/elements@1.0.0-next.10) (2021-05-16)

### Bug Fixes

* fix drawer content padding in RTL ([ea8ea20](https://github.com/react-navigation/react-navigation/commit/ea8ea20127d979d8c8ddbddf56de1bdfdf0243f9))

# [1.0.0-next.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.8...@react-navigation/elements@1.0.0-next.9) (2021-05-10)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.7...@react-navigation/elements@1.0.0-next.8) (2021-05-09)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.6...@react-navigation/elements@1.0.0-next.7) (2021-05-09)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.5...@react-navigation/elements@1.0.0-next.6) (2021-05-09)

### Bug Fixes

* animate pressable opacity ([459fd27](https://github.com/react-navigation/react-navigation/commit/459fd270503075343b71ad446efdc2517eedcf21))

# [1.0.0-next.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.4...@react-navigation/elements@1.0.0-next.5) (2021-05-01)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.3...@react-navigation/elements@1.0.0-next.4) (2021-04-08)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.2...@react-navigation/elements@1.0.0-next.3) (2021-03-22)

### Features

* add a Background component ([cbaabc1](https://github.com/react-navigation/react-navigation/commit/cbaabc1288e780698e499a00b9ca06ab9746a0da))

# [1.0.0-next.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.1...@react-navigation/elements@1.0.0-next.2) (2021-03-12)

### Bug Fixes

* use theme in PlatformPressable ([40439cc](https://github.com/react-navigation/react-navigation/commit/40439ccb420825a1aa480648526a816f2422ea6e))

### Features

* return nearest parent header height for useHeaderHeight ([24b3f73](https://github.com/react-navigation/react-navigation/commit/24b3f739da4b8af8dca77d92c72cfdaa762e564a))

# [1.0.0-next.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0...@react-navigation/elements@1.0.0-next.1) (2021-03-10)

### Bug Fixes

* fix peer dep versions ([72f90b5](https://github.com/react-navigation/react-navigation/commit/72f90b50d27eda1315bb750beca8a36f26dafe17))

# 1.0.0-next.0 (2021-03-09)

### Bug Fixes

* show a missing icon symbol instead of empty area in bottom tab bar ([2bc4882](https://github.com/react-navigation/react-navigation/commit/2bc4882692be9f02d781639892e1f98b891811c4))

### Features

* initial implementation of @react-navigation/elements ([07ba7a9](https://github.com/react-navigation/react-navigation/commit/07ba7a96870efdb8acf99eb82ba0b1d3eac90bab))
