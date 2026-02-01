# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.0.0-alpha.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@8.0.0-alpha.5...@react-navigation/material-top-tabs@8.0.0-alpha.6) (2026-02-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [8.0.0-alpha.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@8.0.0-alpha.4...@react-navigation/material-top-tabs@8.0.0-alpha.5) (2026-01-29)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [8.0.0-alpha.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@8.0.0-alpha.3...@react-navigation/material-top-tabs@8.0.0-alpha.4) (2026-01-29)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [8.0.0-alpha.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@8.0.0-alpha.2...@react-navigation/material-top-tabs@8.0.0-alpha.3) (2026-01-22)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [8.0.0-alpha.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@8.0.0-alpha.1...@react-navigation/material-top-tabs@8.0.0-alpha.2) (2026-01-19)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [8.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@8.0.0-alpha.0...@react-navigation/material-top-tabs@8.0.0-alpha.1) (2026-01-19)

### Features

* add a ~meta property to navigation object ([#12931](https://github.com/react-navigation/react-navigation/issues/12931)) ([e570c72](https://github.com/react-navigation/react-navigation/commit/e570c72f119cd6506c6106e7eb1ebb9ad5d47a62)) - by @satya164

# [8.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.3.3...@react-navigation/material-top-tabs@8.0.0-alpha.0) (2025-12-19)

### Bug Fixes

* add more checks on how path param is parsed ([f05681d](https://github.com/react-navigation/react-navigation/commit/f05681d226663a582e23bf66e0bfa83145627af3)) - by @satya164
* replace `pointerEvents` props with styles ([#12693](https://github.com/react-navigation/react-navigation/issues/12693)) ([987aed6](https://github.com/react-navigation/react-navigation/commit/987aed623ad7eaf120d3af76ca2e05b2a3c7f103)), closes [#12441](https://github.com/react-navigation/react-navigation/issues/12441) - by @hassankhan

### Code Refactoring

* drop deprecated APIs and fallbacks for older versions of packages ([cf60189](https://github.com/react-navigation/react-navigation/commit/cf601898adf7ad18b3e4b298a82e04bfb170f01b)) - by @satya164
* get parent navigation by route name with getParent ([#12822](https://github.com/react-navigation/react-navigation/issues/12822)) ([2877968](https://github.com/react-navigation/react-navigation/commit/2877968680e14a8d4698c4762996fff6c086f793)) - by @satya164

### Features

* add scroll adapter to tab view and expose renderAdapter prop ([3579022](https://github.com/react-navigation/react-navigation/commit/35790223f488e3eda728b18931b8b5d8da5db13b)) - by @satya164
* add staticXScreen type to improve defining screens ([#12886](https://github.com/react-navigation/react-navigation/issues/12886)) ([7a5ebbd](https://github.com/react-navigation/react-navigation/commit/7a5ebbd91e7f8ad2ae3d810f45a2d27567dbae68)) - by @satya164
* infer params type based on linking and screen ([#12888](https://github.com/react-navigation/react-navigation/issues/12888)) ([84069bf](https://github.com/react-navigation/react-navigation/commit/84069bf11254ab60adc3e4490a96c87c9b1343f7)) - by @satya164
* remove UNSTABLE prefix from routeNamesChangeBehavior ([eda56ea](https://github.com/react-navigation/react-navigation/commit/eda56ea6840df32114d62ff9c77c066f240022a4)) - by @satya164
* restore unhandled state after route names change ([#12812](https://github.com/react-navigation/react-navigation/issues/12812)) ([52e8a45](https://github.com/react-navigation/react-navigation/commit/52e8a45d8e8b068a616f8a7df6357ad6198f0622)) - by @satya164
* support ColorValue instead of string for colors in theme ([#12711](https://github.com/react-navigation/react-navigation/issues/12711)) ([cfe746b](https://github.com/react-navigation/react-navigation/commit/cfe746be6d671da7f4fe785d5bd6142fc8152e14)) - by @satya164
* update default tab view colors to match react navigation ([90897a9](https://github.com/react-navigation/react-navigation/commit/90897a9431899c603a1fa309b5339651de32cfb7)) - by @satya164

### BREAKING CHANGES

* Navigators don't accept an ID anymore, and `getParent`
accepts only route names. Any code using navigator IDs needs to be
refactored.
* the minimum required version for `react-native-web` is now `~0.21.0`

**Motivation**

By replacing usages of `pointerEvents` to use styles instead of props,
we won't get an annoying warning in the logs.

The underlying issue in React Native Web which prevented children of a
`pointer-events: box-none` element from receiving pointer events is
resolved by https://github.com/necolas/react-native-web/pull/2789.

A follow-up fix to React Native Testing Library was also required, PR
here
https://github.com/callstack/react-native-testing-library/pull/1799.
* This bumps the minimum required versions of various peer deps

## [7.3.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.3.2...@react-navigation/material-top-tabs@7.3.3) (2025-07-25)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.3.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.3.1...@react-navigation/material-top-tabs@7.3.2) (2025-06-24)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.3.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.3.0...@react-navigation/material-top-tabs@7.3.1) (2025-06-22)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.3.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.17...@react-navigation/material-top-tabs@7.3.0) (2025-06-21)

### Features

* use the new SafeAreaListener to listen to frame changes ([d9e295e](https://github.com/react-navigation/react-navigation/commit/d9e295eef251393b5280d661957e7d2c31a36ae1)) - by @satya164

## [7.2.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.16...@react-navigation/material-top-tabs@7.2.17) (2025-06-19)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.15...@react-navigation/material-top-tabs@7.2.16) (2025-06-18)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.14...@react-navigation/material-top-tabs@7.2.15) (2025-06-14)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.13...@react-navigation/material-top-tabs@7.2.14) (2025-05-30)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.12...@react-navigation/material-top-tabs@7.2.13) (2025-05-11)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.11...@react-navigation/material-top-tabs@7.2.12) (2025-05-04)

### Bug Fixes

* fix peer dep versions. closes [#12580](https://github.com/react-navigation/react-navigation/issues/12580) ([6fc3dd6](https://github.com/react-navigation/react-navigation/commit/6fc3dd677aecdcf8696fe723e17b9c028de7ad85)) - by @satya164

## [7.2.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.10...@react-navigation/material-top-tabs@7.2.11) (2025-05-02)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.9...@react-navigation/material-top-tabs@7.2.10) (2025-04-08)

### Bug Fixes

* add types field back to support legacy moduleResolution ([6c021d4](https://github.com/react-navigation/react-navigation/commit/6c021d442ede3a231e32486b2c391c2e850bf76e)), closes [#12534](https://github.com/react-navigation/react-navigation/issues/12534) - by @

## [7.2.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.8...@react-navigation/material-top-tabs@7.2.9) (2025-04-04)

### Bug Fixes

* drop commonjs module to avoid dual package hazard ([f0fbcc5](https://github.com/react-navigation/react-navigation/commit/f0fbcc5515e73b454f607bd95bba40a48e852d0f)) - by @satya164

## [7.2.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.7...@react-navigation/material-top-tabs@7.2.8) (2025-04-03)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.6...@react-navigation/material-top-tabs@7.2.7) (2025-04-02)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.5...@react-navigation/material-top-tabs@7.2.6) (2025-04-02)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.4...@react-navigation/material-top-tabs@7.2.5) (2025-04-02)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.3...@react-navigation/material-top-tabs@7.2.4) (2025-04-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.2...@react-navigation/material-top-tabs@7.2.3) (2025-03-25)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.1...@react-navigation/material-top-tabs@7.2.2) (2025-03-22)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.2.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.2.0...@react-navigation/material-top-tabs@7.2.1) (2025-03-19)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.2.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.1.1...@react-navigation/material-top-tabs@7.2.0) (2025-03-19)

### Features

* add an option to override router in navigators ([5f201ee](https://github.com/react-navigation/react-navigation/commit/5f201ee435f887e655457c3aa1a81cbeb392ba05)) - by @

## [7.1.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.1.0...@react-navigation/material-top-tabs@7.1.1) (2025-03-02)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.18...@react-navigation/material-top-tabs@7.1.0) (2024-12-12)

### Features

* export *NavigatorProps for each navigator ([#12327](https://github.com/react-navigation/react-navigation/issues/12327)) ([316e2ff](https://github.com/react-navigation/react-navigation/commit/316e2ff7126c2c1e38ddd7296342a07155f78817)) - by @marklawlor

## [7.0.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.17...@react-navigation/material-top-tabs@7.0.18) (2024-12-02)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.16...@react-navigation/material-top-tabs@7.0.17) (2024-12-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.15...@react-navigation/material-top-tabs@7.0.16) (2024-12-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.14...@react-navigation/material-top-tabs@7.0.15) (2024-12-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.13...@react-navigation/material-top-tabs@7.0.14) (2024-11-28)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.12...@react-navigation/material-top-tabs@7.0.13) (2024-11-27)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.11...@react-navigation/material-top-tabs@7.0.12) (2024-11-26)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.10...@react-navigation/material-top-tabs@7.0.11) (2024-11-25)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.9...@react-navigation/material-top-tabs@7.0.10) (2024-11-25)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.8...@react-navigation/material-top-tabs@7.0.9) (2024-11-25)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.7...@react-navigation/material-top-tabs@7.0.8) (2024-11-25)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.6...@react-navigation/material-top-tabs@7.0.7) (2024-11-22)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.5...@react-navigation/material-top-tabs@7.0.6) (2024-11-19)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.4...@react-navigation/material-top-tabs@7.0.5) (2024-11-18)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.3...@react-navigation/material-top-tabs@7.0.4) (2024-11-15)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.2...@react-navigation/material-top-tabs@7.0.3) (2024-11-14)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.1...@react-navigation/material-top-tabs@7.0.2) (2024-11-13)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [7.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0...@react-navigation/material-top-tabs@7.0.1) (2024-11-07)

### Bug Fixes

* fix custom tab bar label and style not working for material top tabs ([1a0805b](https://github.com/react-navigation/react-navigation/commit/1a0805babe288fc78ffdaf520e238ceb294ab89d)), closes [#12236](https://github.com/react-navigation/react-navigation/issues/12236) - by @satya164

# [7.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.28...@react-navigation/material-top-tabs@7.0.0) (2024-11-06)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.28](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.27...@react-navigation/material-top-tabs@7.0.0-rc.28) (2024-10-31)

### Code Refactoring

* rename sceneContainerStyle to sceneStyle ([d1d0761](https://github.com/react-navigation/react-navigation/commit/d1d0761f0239caea1cc7b85d90de229f444f827d)) - by @satya164

### Features

* move options and commonOptions to TabView for react-native-tab-view ([3643926](https://github.com/react-navigation/react-navigation/commit/36439266d9d29cc643e7159458999a1adfb101d0)) - by @satya164

### BREAKING CHANGES

* This does the following changes:

- Remove the `sceneContainerStyle` prop from Bottom Tabs & Material Top Tabs
- Add a `sceneStyle` option to Bottom Tabs & Material Top Tabs
- Rename `sceneContainerStyle` option to `sceneStyle` for Drawer

# [7.0.0-rc.27](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.26...@react-navigation/material-top-tabs@7.0.0-rc.27) (2024-10-24)

### Bug Fixes

* use * for react-native peer dep to support pre-release versions ([07267e5](https://github.com/react-navigation/react-navigation/commit/07267e54be752f600f808ec2898e5d76a1bc1d43)) - by @satya164

# [7.0.0-rc.26](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.25...@react-navigation/material-top-tabs@7.0.0-rc.26) (2024-10-11)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.25](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.24...@react-navigation/material-top-tabs@7.0.0-rc.25) (2024-09-10)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.24](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.23...@react-navigation/material-top-tabs@7.0.0-rc.24) (2024-09-08)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.23](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.22...@react-navigation/material-top-tabs@7.0.0-rc.23) (2024-08-09)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.22](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.21...@react-navigation/material-top-tabs@7.0.0-rc.22) (2024-08-08)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.21](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.20...@react-navigation/material-top-tabs@7.0.0-rc.21) (2024-08-07)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.20](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.19...@react-navigation/material-top-tabs@7.0.0-rc.20) (2024-08-05)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.19](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.18...@react-navigation/material-top-tabs@7.0.0-rc.19) (2024-08-02)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.17...@react-navigation/material-top-tabs@7.0.0-rc.18) (2024-08-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.16...@react-navigation/material-top-tabs@7.0.0-rc.17) (2024-07-25)

### Bug Fixes

* fix type inference for params. closes [#12071](https://github.com/react-navigation/react-navigation/issues/12071) ([3299b70](https://github.com/react-navigation/react-navigation/commit/3299b70682adbf55811369535cca1cdd0dc59860)) - by @

# [7.0.0-rc.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.15...@react-navigation/material-top-tabs@7.0.0-rc.16) (2024-07-19)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.14...@react-navigation/material-top-tabs@7.0.0-rc.15) (2024-07-12)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.13...@react-navigation/material-top-tabs@7.0.0-rc.14) (2024-07-12)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.12...@react-navigation/material-top-tabs@7.0.0-rc.13) (2024-07-11)

### Bug Fixes

* upgrade react-native-builder-bob ([1575287](https://github.com/react-navigation/react-navigation/commit/1575287d40fadb97f33eb19c2914d8be3066b47a)) - by @

# [7.0.0-rc.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.11...@react-navigation/material-top-tabs@7.0.0-rc.12) (2024-07-11)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.10...@react-navigation/material-top-tabs@7.0.0-rc.11) (2024-07-10)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.9...@react-navigation/material-top-tabs@7.0.0-rc.10) (2024-07-08)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.8...@react-navigation/material-top-tabs@7.0.0-rc.9) (2024-07-07)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.7...@react-navigation/material-top-tabs@7.0.0-rc.8) (2024-07-04)

### Bug Fixes

* fix published files ([829caa0](https://github.com/react-navigation/react-navigation/commit/829caa019e125811eea5213fd380e8e1bdbe7030)) - by @

# [7.0.0-rc.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.6...@react-navigation/material-top-tabs@7.0.0-rc.7) (2024-07-04)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.5...@react-navigation/material-top-tabs@7.0.0-rc.6) (2024-07-04)

### Features

* add package.json exports field ([1435cfe](https://github.com/react-navigation/react-navigation/commit/1435cfe3300767c221ebd4613479ad662d61efee)) - by @

# [7.0.0-rc.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.4...@react-navigation/material-top-tabs@7.0.0-rc.5) (2024-07-01)

### Bug Fixes

* stop using react-native field in package.json ([efc33cb](https://github.com/react-navigation/react-navigation/commit/efc33cb0c4830a84ceae034dc1278c54f1faf32d)) - by @

# [7.0.0-rc.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.3...@react-navigation/material-top-tabs@7.0.0-rc.4) (2024-06-29)

### Bug Fixes

* add a workaround for incorrect inference [#12041](https://github.com/react-navigation/react-navigation/issues/12041) ([85c4bbb](https://github.com/react-navigation/react-navigation/commit/85c4bbbf535cde2ba9cd537a2a5ce34f060d32b9)) - by @

# [7.0.0-rc.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.2...@react-navigation/material-top-tabs@7.0.0-rc.3) (2024-06-28)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.1...@react-navigation/material-top-tabs@7.0.0-rc.2) (2024-06-28)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-rc.0...@react-navigation/material-top-tabs@7.0.0-rc.1) (2024-06-28)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-rc.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.19...@react-navigation/material-top-tabs@7.0.0-rc.0) (2024-06-27)

### Bug Fixes

* fix showing text in material top tabs ([7d65803](https://github.com/react-navigation/react-navigation/commit/7d6580396a27e90d7f911f94522623e0dcbf31da)) - by @satya164
* immediately update state after tapping tab on material top tabs ([#12020](https://github.com/react-navigation/react-navigation/issues/12020)) ([e177181](https://github.com/react-navigation/react-navigation/commit/e1771812c7bdf8f0199a51d1fb443323ebfaa4ff)) - by @Piotrfj
* update state on tab press for tab-view ([feb82e6](https://github.com/react-navigation/react-navigation/commit/feb82e62f8ed8df1fc1add00020a696c06a11e01)) - by @satya164

# [7.0.0-alpha.19](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.18...@react-navigation/material-top-tabs@7.0.0-alpha.19) (2024-03-25)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-alpha.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.17...@react-navigation/material-top-tabs@7.0.0-alpha.18) (2024-03-22)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-alpha.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.16...@react-navigation/material-top-tabs@7.0.0-alpha.17) (2024-03-22)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-alpha.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.15...@react-navigation/material-top-tabs@7.0.0-alpha.16) (2024-03-20)

### Features

* add getStateForRouteNamesChange to all navigators and mark it as unstable ([4edbb07](https://github.com/react-navigation/react-navigation/commit/4edbb071163742b60499178271fd3e3e92fb4002)) - by @satya164

# [7.0.0-alpha.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.14...@react-navigation/material-top-tabs@7.0.0-alpha.15) (2024-03-14)

### Features

* automatically infer types for navigation in options, listeners etc. ([#11883](https://github.com/react-navigation/react-navigation/issues/11883)) ([c54baf1](https://github.com/react-navigation/react-navigation/commit/c54baf14640e567be10cb8a5f68e5cbf0b35f120)) - by @satya164

# [7.0.0-alpha.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.13...@react-navigation/material-top-tabs@7.0.0-alpha.14) (2024-03-10)

### Features

* add a type for options arguments ([8e719e0](https://github.com/react-navigation/react-navigation/commit/8e719e0faefbd1eed9f7122a3d8e2c617d5f8254)) - by @satya164

# [7.0.0-alpha.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.12...@react-navigation/material-top-tabs@7.0.0-alpha.13) (2024-03-09)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-alpha.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.11...@react-navigation/material-top-tabs@7.0.0-alpha.12) (2024-03-08)

### Bug Fixes

* add href to tabs in material top tabs ([#11873](https://github.com/react-navigation/react-navigation/issues/11873)) ([c3459e1](https://github.com/react-navigation/react-navigation/commit/c3459e10e56446554d45130b28b232f08f491c4b)) - by @groot007

### Features

* implement tab-view new api ([#11548](https://github.com/react-navigation/react-navigation/issues/11548)) ([dca15c9](https://github.com/react-navigation/react-navigation/commit/dca15c9126f8751cfea43edc80c51d28de8f6fa6)) - by @okwasniewski

### BREAKING CHANGES

* react-native-tab-view now has a new API to address performance issues with current
implementation.

Co-authored-by: Michał Osadnik <micosa97@gmail.com>
Co-authored-by: Satyajit Sahoo <satyajit.happy@gmail.com>

# [7.0.0-alpha.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.10...@react-navigation/material-top-tabs@7.0.0-alpha.11) (2024-03-04)

### Bug Fixes

* update drawer and material tab bar to match latest md guidelines ([#11864](https://github.com/react-navigation/react-navigation/issues/11864)) ([8726597](https://github.com/react-navigation/react-navigation/commit/872659710dec1b097ec7c7b1dd59a6174e021b30)) - by @groot007

# [7.0.0-alpha.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.9...@react-navigation/material-top-tabs@7.0.0-alpha.10) (2024-02-24)

### Bug Fixes

* fix peer dependency versions ([4b93b63](https://github.com/react-navigation/react-navigation/commit/4b93b6335ce180fe879f9fbe8f2400426b5484fb)) - by @

# [7.0.0-alpha.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.8...@react-navigation/material-top-tabs@7.0.0-alpha.9) (2024-02-23)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-alpha.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.7...@react-navigation/material-top-tabs@7.0.0-alpha.8) (2024-02-23)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-alpha.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.6...@react-navigation/material-top-tabs@7.0.0-alpha.7) (2024-01-17)

### Bug Fixes

* broken condition in the preloading of material tabs ([#11757](https://github.com/react-navigation/react-navigation/issues/11757)) ([1900747](https://github.com/react-navigation/react-navigation/commit/190074753039a3e0bb19b6afbf164544c7608abc)) - by @osdnk

### Features

* add layout and screenLayout props for screens ([#11741](https://github.com/react-navigation/react-navigation/issues/11741)) ([2dc2178](https://github.com/react-navigation/react-navigation/commit/2dc217827a1caa615460563973d3d658be372b29)) - by @satya164
* enable preloading at material-top-tabs ([#11755](https://github.com/react-navigation/react-navigation/issues/11755)) ([58691ac](https://github.com/react-navigation/react-navigation/commit/58691ac973b40a93f4433dba0639dc3f45b21250)) - by @osdnk
* preloading for simple navigators - tabs, drawer ([#11709](https://github.com/react-navigation/react-navigation/issues/11709)) ([ad7c703](https://github.com/react-navigation/react-navigation/commit/ad7c703f1c0e66d77f0ab235e13fe43ca813ed1d)) - by @osdnk
* preloading in routers  ([382d6e6](https://github.com/react-navigation/react-navigation/commit/382d6e6f3312630b34332b1ae7d4bd7bf9b4ee60)) - by @osdnk

### Reverts

* Revert "feat: enable preloading at material-top-tabs (#11755)" (#11756) ([f8aee7b](https://github.com/react-navigation/react-navigation/commit/f8aee7b3eba73b8b9b9f544bfc6d25e6d32c970a)), closes [#11755](https://github.com/react-navigation/react-navigation/issues/11755) [#11756](https://github.com/react-navigation/react-navigation/issues/11756) - by @osdnk

# [7.0.0-alpha.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.5...@react-navigation/material-top-tabs@7.0.0-alpha.6) (2023-11-17)

### Bug Fixes

* update peer dependencies when publishing ([c440703](https://github.com/react-navigation/react-navigation/commit/c44070310f875e488708f2a6c52ffddcea05b0e6)) - by @

# [7.0.0-alpha.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.4...@react-navigation/material-top-tabs@7.0.0-alpha.5) (2023-11-12)

### Features

* add a button element to elements package  ([#11669](https://github.com/react-navigation/react-navigation/issues/11669)) ([25a85c9](https://github.com/react-navigation/react-navigation/commit/25a85c90384ddfb6db946e791c01d8e033e04aa6)) - by @satya164
* add a layout prop for navigators ([#11614](https://github.com/react-navigation/react-navigation/issues/11614)) ([1f51190](https://github.com/react-navigation/react-navigation/commit/1f511904b9437d1451557147e72962859e97b1ae)) - by @satya164

# [7.0.0-alpha.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.3...@react-navigation/material-top-tabs@7.0.0-alpha.4) (2023-09-25)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-alpha.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.2...@react-navigation/material-top-tabs@7.0.0-alpha.3) (2023-09-07)

### Bug Fixes

* Allow to use `PlatformColor` in the theme ([#11570](https://github.com/react-navigation/react-navigation/issues/11570)) ([64734e7](https://github.com/react-navigation/react-navigation/commit/64734e7bc0d7f203d8e5db6abcc9a88157a5f16c)) - by @retyui

### Features

* add direction prop to TabView ([#11322](https://github.com/react-navigation/react-navigation/issues/11322)) ([46735a3](https://github.com/react-navigation/react-navigation/commit/46735a38c46ee195da836dadcf58d6a4db7a381b)) - by @okwasniewski
* add useCardAnimation ([#11568](https://github.com/react-navigation/react-navigation/issues/11568)) ([36d19bd](https://github.com/react-navigation/react-navigation/commit/36d19bdf8c12bc3486a2517f7ebf1ab3f6738345)) - by @adamgrzybowski

# [7.0.0-alpha.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.1...@react-navigation/material-top-tabs@7.0.0-alpha.2) (2023-06-22)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [7.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@7.0.0-alpha.0...@react-navigation/material-top-tabs@7.0.0-alpha.1) (2023-03-01)

### Bug Fixes

* fix paths in sourcemap files ([368e069](https://github.com/react-navigation/react-navigation/commit/368e0691b9fb07d4b1cbe71cfe4c2f40512f93ad)) - by @satya164

### Features

* add ability to customize the fonts with the theme ([#11243](https://github.com/react-navigation/react-navigation/issues/11243)) ([1cd6836](https://github.com/react-navigation/react-navigation/commit/1cd6836f1d10bcdf7f96d9e4b9f7de0ddea9391f)) - by @satya164

# [7.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.3.1...@react-navigation/material-top-tabs@7.0.0-alpha.0) (2023-02-17)

### Code Refactoring

* move tab-view to direct dependency of material-top-tabs ([2bd585b](https://github.com/react-navigation/react-navigation/commit/2bd585b8055995daaacc20a3304d0a4e9ec70f44)) - by @satya164

### Features

* allow users to pass `android_ripple` config in TabView ([#11203](https://github.com/react-navigation/react-navigation/issues/11203)) ([15939d8](https://github.com/react-navigation/react-navigation/commit/15939d82cd7d77d2a75a870279d08cb18c7f9919)), closes [#11198](https://github.com/react-navigation/react-navigation/issues/11198) - by @okwasniewski
* expose tabBarGap option in material top tabs ([#11038](https://github.com/react-navigation/react-navigation/issues/11038)) ([29818a8](https://github.com/react-navigation/react-navigation/commit/29818a80d5086e0702b352e68996a4384eb997e3)) - by @mlecoq
* expose the original label in children prop for custom label functions in tab navigators ([a6fd49f](https://github.com/react-navigation/react-navigation/commit/a6fd49f9af9353cf5fd5364feafcbeea25c3ff7f)) - by @satya164

### BREAKING CHANGES

* This change will simplify installation of material-top-tabs, but that means user's version won't be used anymore. If users need to force specific version, they can use yarn's `resolutions` or npm's `overrides` feature.

## [6.3.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.3.0...@react-navigation/material-top-tabs@6.3.1) (2022-11-21)

### Bug Fixes

* add accessibility props to NativeStack screens ([#11022](https://github.com/react-navigation/react-navigation/issues/11022)) ([3ab05af](https://github.com/react-navigation/react-navigation/commit/3ab05afeb6412b8e5566270442ac14a463136620))

# [6.3.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.2.4...@react-navigation/material-top-tabs@6.3.0) (2022-10-11)

### Features

* expose animationEnabled in material top tabs ([d1bd31f](https://github.com/react-navigation/react-navigation/commit/d1bd31f11b1a40a319e7fb6e3fee074edd059349))

## [6.2.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.2.2...@react-navigation/material-top-tabs@6.2.4) (2022-09-16)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [6.2.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.2.2...@react-navigation/material-top-tabs@6.2.3) (2022-08-24)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [6.2.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.2.1...@react-navigation/material-top-tabs@6.2.2) (2022-07-05)

### Bug Fixes

* ensure same @types/react version in repo ([#10663](https://github.com/react-navigation/react-navigation/issues/10663)) ([e662465](https://github.com/react-navigation/react-navigation/commit/e6624653fbbd931158dbebd17142abf9637205b6)), closes [#10655](https://github.com/react-navigation/react-navigation/issues/10655)

## [6.2.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.2.0...@react-navigation/material-top-tabs@6.2.1) (2022-04-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.2.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.1.1...@react-navigation/material-top-tabs@6.2.0) (2022-04-01)

### Features

* add an ID prop to navigators ([4e4935a](https://github.com/react-navigation/react-navigation/commit/4e4935ac2584bc1a00209609cc026fa73e12c10a))

## [6.1.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.1.0...@react-navigation/material-top-tabs@6.1.1) (2022-02-02)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.6...@react-navigation/material-top-tabs@6.1.0) (2022-01-29)

### Features

* **native-stack:** export NativeStackView to support custom routers on native-stack ([#10260](https://github.com/react-navigation/react-navigation/issues/10260)) ([7b761f1](https://github.com/react-navigation/react-navigation/commit/7b761f1cc069ca68b96b5155be726024a345346f))

## [6.0.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.5...@react-navigation/material-top-tabs@6.0.6) (2021-10-12)

### Bug Fixes

* move [@ts-expect-error](https://github.com/ts-expect-error) to body to avoid issue in type definitions ([0a08688](https://github.com/react-navigation/react-navigation/commit/0a0868862c9d6ae77055c66938a764306d391b44))

## [6.0.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.4...@react-navigation/material-top-tabs@6.0.5) (2021-10-09)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [6.0.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.3...@react-navigation/material-top-tabs@6.0.4) (2021-09-26)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [6.0.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.2...@react-navigation/material-top-tabs@6.0.3) (2021-09-26)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [6.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.1...@react-navigation/material-top-tabs@6.0.2) (2021-08-07)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [6.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0...@react-navigation/material-top-tabs@6.0.1) (2021-08-03)

### Bug Fixes

* preserve params when switching tabs. fixes [#9782](https://github.com/react-navigation/react-navigation/issues/9782) ([98fa233](https://github.com/react-navigation/react-navigation/commit/98fa2330146457045c01af820c6d8e8cb955f9d1))

# [6.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.18...@react-navigation/material-top-tabs@6.0.0) (2021-08-01)

### Features

* add tabBarBadge and tabBarIndicator options for material top tabs ([fdb3ede](https://github.com/react-navigation/react-navigation/commit/fdb3ede3e0eb1e43c4be30c810663880e2f5467c))
* move some props to screenOptions in material top tabs ([5bfc396](https://github.com/react-navigation/react-navigation/commit/5bfc39668bb5dce8bd872e5ff87f4b3fd683cf62))

# [6.0.0-next.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.17...@react-navigation/material-top-tabs@6.0.0-next.18) (2021-07-16)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.16...@react-navigation/material-top-tabs@6.0.0-next.17) (2021-07-16)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.14...@react-navigation/material-top-tabs@6.0.0-next.16) (2021-07-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.14...@react-navigation/material-top-tabs@6.0.0-next.15) (2021-06-10)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.13...@react-navigation/material-top-tabs@6.0.0-next.14) (2021-05-29)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.12...@react-navigation/material-top-tabs@6.0.0-next.13) (2021-05-29)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.11...@react-navigation/material-top-tabs@6.0.0-next.12) (2021-05-27)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.10...@react-navigation/material-top-tabs@6.0.0-next.11) (2021-05-26)

### Features

* add screenListeners prop on navigators similar to screenOptions ([cde44a5](https://github.com/react-navigation/react-navigation/commit/cde44a5785444a121aa08f94af9f8fe4fc89910a))

# [6.0.0-next.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.9...@react-navigation/material-top-tabs@6.0.0-next.10) (2021-05-23)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.8...@react-navigation/material-top-tabs@6.0.0-next.9) (2021-05-16)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.7...@react-navigation/material-top-tabs@6.0.0-next.8) (2021-05-10)

### Bug Fixes

* add a deprecation warning for mode prop in stack ([a6e4981](https://github.com/react-navigation/react-navigation/commit/a6e498170f59648190fa5513e273ca523e56c5d5))

### Features

* return a NavigationContent component from useNavigationBuilder ([1179d56](https://github.com/react-navigation/react-navigation/commit/1179d56c5008270753feef41acdc1dbd2191efcf))

# [6.0.0-next.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.6...@react-navigation/material-top-tabs@6.0.0-next.7) (2021-05-09)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.5...@react-navigation/material-top-tabs@6.0.0-next.6) (2021-05-09)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.4...@react-navigation/material-top-tabs@6.0.0-next.5) (2021-05-09)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.3...@react-navigation/material-top-tabs@6.0.0-next.4) (2021-05-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.2...@react-navigation/material-top-tabs@6.0.0-next.3) (2021-04-08)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0-next.1...@react-navigation/material-top-tabs@6.0.0-next.2) (2021-04-08)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [6.0.0-next.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@6.0.0...@react-navigation/material-top-tabs@6.0.0-next.1) (2021-03-10)

### Bug Fixes

* fix peer dep versions ([72f90b5](https://github.com/react-navigation/react-navigation/commit/72f90b50d27eda1315bb750beca8a36f26dafe17))

# [6.0.0-next.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.3.9...@react-navigation/material-top-tabs@6.0.0-next.0) (2021-03-09)

### Bug Fixes

* add missing helper types in descriptors ([21a1154](https://github.com/react-navigation/react-navigation/commit/21a11543bf41c4559c2570d5accc0bbb3b67eb8d))

### Features

* move lazy to options for material-top-tabs ([cfd1c9b](https://github.com/react-navigation/react-navigation/commit/cfd1c9b6efb528c7737fb68766873f9c564196d7))
* upgrade to latest react-native-tab-view using ViewPager ([2261001](https://github.com/react-navigation/react-navigation/commit/22610014b3b1e649b368a63fd021362235ee585d))

### BREAKING CHANGES

* The lazy prop now can be configured per screen instead of for the whole navigator. To keep previous behavior, you can specify it in screenOptions

## [5.3.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.3.8...@react-navigation/material-top-tabs@5.3.9) (2020-11-10)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.3.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.3.7...@react-navigation/material-top-tabs@5.3.8) (2020-11-09)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.3.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.3.6...@react-navigation/material-top-tabs@5.3.7) (2020-11-08)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.3.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.3.5...@react-navigation/material-top-tabs@5.3.6) (2020-11-04)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.3.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.3.4...@react-navigation/material-top-tabs@5.3.5) (2020-11-04)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.3.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.3.3...@react-navigation/material-top-tabs@5.3.4) (2020-11-03)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.3.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.3.2...@react-navigation/material-top-tabs@5.3.3) (2020-11-03)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.3.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.3.1...@react-navigation/material-top-tabs@5.3.2) (2020-10-30)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.3.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.3.0...@react-navigation/material-top-tabs@5.3.1) (2020-10-28)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.3.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.2.19...@react-navigation/material-top-tabs@5.3.0) (2020-10-24)

### Features

* improve types for navigation state ([#8980](https://github.com/react-navigation/react-navigation/issues/8980)) ([7dc2f58](https://github.com/react-navigation/react-navigation/commit/7dc2f5832e371473f3263c01ab39824eb9e2057d))
* update helper types to have navigator specific methods ([f51086e](https://github.com/react-navigation/react-navigation/commit/f51086edea42f2382dac8c6914aac8574132114b))

## [5.2.19](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.2.18...@react-navigation/material-top-tabs@5.2.19) (2020-10-07)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.2.17...@react-navigation/material-top-tabs@5.2.18) (2020-09-28)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.2.16...@react-navigation/material-top-tabs@5.2.17) (2020-09-22)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.2.15...@react-navigation/material-top-tabs@5.2.16) (2020-08-04)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.2.14...@react-navigation/material-top-tabs@5.2.15) (2020-07-28)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.2.13...@react-navigation/material-top-tabs@5.2.14) (2020-07-19)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.2.12...@react-navigation/material-top-tabs@5.2.13) (2020-07-10)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.2.11...@react-navigation/material-top-tabs@5.2.12) (2020-06-25)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/material-top-tabs@5.2.10...@react-navigation/material-top-tabs@5.2.11) (2020-06-24)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.10](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.2.9...@react-navigation/material-top-tabs@5.2.10) (2020-06-06)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.9](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.2.8...@react-navigation/material-top-tabs@5.2.9) (2020-05-27)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.8](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.2.7...@react-navigation/material-top-tabs@5.2.8) (2020-05-23)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.7](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.2.6...@react-navigation/material-top-tabs@5.2.7) (2020-05-20)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.6](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.2.5...@react-navigation/material-top-tabs@5.2.6) (2020-05-20)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.5](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.2.4...@react-navigation/material-top-tabs@5.2.5) (2020-05-16)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.4](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.2.3...@react-navigation/material-top-tabs@5.2.4) (2020-05-14)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.3](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.2.2...@react-navigation/material-top-tabs@5.2.3) (2020-05-14)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.2](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.2.1...@react-navigation/material-top-tabs@5.2.2) (2020-05-10)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.2.1](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.2.0...@react-navigation/material-top-tabs@5.2.1) (2020-05-08)

### Bug Fixes

* fix building typescript definitions. closes [#8216](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/issues/8216) ([47a1229](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/commit/47a12298378747edd2d22e54dc1c8677f98c49b4))

# [5.2.0](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.15...@react-navigation/material-top-tabs@5.2.0) (2020-05-08)

### Features

* add generic type aliases for screen props ([bea14aa](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/commit/bea14aa26fd5cbfebc7973733c5cf1f44fd323aa)), closes [#7971](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/issues/7971)

## [5.1.15](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.14...@react-navigation/material-top-tabs@5.1.15) (2020-05-05)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.14](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.13...@react-navigation/material-top-tabs@5.1.14) (2020-05-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.13](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.12...@react-navigation/material-top-tabs@5.1.13) (2020-05-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.12](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.11...@react-navigation/material-top-tabs@5.1.12) (2020-04-30)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.11](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.10...@react-navigation/material-top-tabs@5.1.11) (2020-04-30)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.10](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.9...@react-navigation/material-top-tabs@5.1.10) (2020-04-27)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.9](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.8...@react-navigation/material-top-tabs@5.1.9) (2020-04-17)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.8](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.7...@react-navigation/material-top-tabs@5.1.8) (2020-04-08)

### Bug Fixes

* mark type exports for all packages ([b71de6c](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/commit/b71de6cc799143f1d0e8a0cfcc34f0a2381f9840))

## [5.1.7](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.6...@react-navigation/material-top-tabs@5.1.7) (2020-03-30)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.6](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.5...@react-navigation/material-top-tabs@5.1.6) (2020-03-23)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.5](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.4...@react-navigation/material-top-tabs@5.1.5) (2020-03-22)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.4](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.3...@react-navigation/material-top-tabs@5.1.4) (2020-03-19)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.3](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.2...@react-navigation/material-top-tabs@5.1.3) (2020-03-17)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.2](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.1...@react-navigation/material-top-tabs@5.1.2) (2020-03-16)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.1.1](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.1.0...@react-navigation/material-top-tabs@5.1.1) (2020-03-03)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.1.0](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.7...@react-navigation/material-top-tabs@5.1.0) (2020-02-26)

### Features

* add ability add listeners with listeners prop ([1624108](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/commit/162410843c4f175ae107756de1c3af04d1d47aa7)), closes [#6756](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/issues/6756)

## [5.0.7](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.6...@react-navigation/material-top-tabs@5.0.7) (2020-02-21)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.0.6](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.5...@react-navigation/material-top-tabs@5.0.6) (2020-02-19)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.0.5](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.4...@react-navigation/material-top-tabs@5.0.5) (2020-02-14)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.0.4](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.3...@react-navigation/material-top-tabs@5.0.4) (2020-02-14)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.0.3](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.2...@react-navigation/material-top-tabs@5.0.3) (2020-02-12)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.0.2](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.1...@react-navigation/material-top-tabs@5.0.2) (2020-02-11)

**Note:** Version bump only for package @react-navigation/material-top-tabs

## [5.0.1](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.41...@react-navigation/material-top-tabs@5.0.1) (2020-02-10)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.41](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.40...@react-navigation/material-top-tabs@5.0.0-alpha.41) (2020-02-04)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.40](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.39...@react-navigation/material-top-tabs@5.0.0-alpha.40) (2020-02-04)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.39](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.38...@react-navigation/material-top-tabs@5.0.0-alpha.39) (2020-02-03)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.38](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.35...@react-navigation/material-top-tabs@5.0.0-alpha.38) (2020-02-02)

### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))
* wrap navigators in gesture handler root ([41a5e1a](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/commit/41a5e1a385aa5180abc3992a4c67077c37b998b9))

# [5.0.0-alpha.36](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.35...@react-navigation/material-top-tabs@5.0.0-alpha.36) (2020-02-02)

### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))

# [5.0.0-alpha.35](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.34...@react-navigation/material-top-tabs@5.0.0-alpha.35) (2020-01-24)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.34](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.33...@react-navigation/material-top-tabs@5.0.0-alpha.34) (2020-01-23)

### Features

* let the navigator specify if default can be prevented ([da67e13](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/commit/da67e134d2157201360427d3c10da24f24cae7aa))

# [5.0.0-alpha.33](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.32...@react-navigation/material-top-tabs@5.0.0-alpha.33) (2020-01-14)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.32](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.31...@react-navigation/material-top-tabs@5.0.0-alpha.32) (2020-01-13)

### Bug Fixes

* make sure paths aren't aliased when building definitions ([65a5dac](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/commit/65a5dac2bf887f4ba081ab15bd4c9870bb15697f)), closes [#265](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/issues/265)

# [5.0.0-alpha.31](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.30...@react-navigation/material-top-tabs@5.0.0-alpha.31) (2020-01-13)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.30](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.29...@react-navigation/material-top-tabs@5.0.0-alpha.30) (2020-01-09)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.29](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.27...@react-navigation/material-top-tabs@5.0.0-alpha.29) (2020-01-09)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.28](https://github.com/react-navigation/react-navigation/tree/main/packages/material-top-tabs/compare/@react-navigation/material-top-tabs@5.0.0-alpha.27...@react-navigation/material-top-tabs@5.0.0-alpha.28) (2020-01-09)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.27](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.26...@react-navigation/material-top-tabs@5.0.0-alpha.27) (2020-01-05)

### Features

* add support for pager component ([dcc5f99](https://github.com/react-navigation/navigation-ex/commit/dcc5f99ecd495ad1903c9e99884e0d4e9b3994f1))

# [5.0.0-alpha.26](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.25...@react-navigation/material-top-tabs@5.0.0-alpha.26) (2020-01-01)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.25](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.24...@react-navigation/material-top-tabs@5.0.0-alpha.25) (2019-12-19)

### Bug Fixes

* fix backgroundColor in sceneContainerStyle overriden by theme ([ebd145a](https://github.com/react-navigation/navigation-ex/commit/ebd145a09d80f119070a14a8d4940b5757b5e7fb)), closes [#215](https://github.com/react-navigation/navigation-ex/issues/215)

# [5.0.0-alpha.24](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.23...@react-navigation/material-top-tabs@5.0.0-alpha.24) (2019-12-16)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.23](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.22...@react-navigation/material-top-tabs@5.0.0-alpha.23) (2019-12-14)

### Features

* add custom theme support ([#211](https://github.com/react-navigation/navigation-ex/issues/211)) ([00fc616](https://github.com/react-navigation/navigation-ex/commit/00fc616de0572bade8aa85052cdc8290360b1d7f))

# [5.0.0-alpha.22](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.21...@react-navigation/material-top-tabs@5.0.0-alpha.22) (2019-12-11)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.21](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.20...@react-navigation/material-top-tabs@5.0.0-alpha.21) (2019-12-10)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.20](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.19...@react-navigation/material-top-tabs@5.0.0-alpha.20) (2019-12-07)

### Features

* export underlying views used to build navigators ([#191](https://github.com/react-navigation/navigation-ex/issues/191)) ([d618ab3](https://github.com/react-navigation/navigation-ex/commit/d618ab382ecc5eccbcd5faa89e76f9ed2d75f405))

# [5.0.0-alpha.19](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.18...@react-navigation/material-top-tabs@5.0.0-alpha.19) (2019-11-20)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.18](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.17...@react-navigation/material-top-tabs@5.0.0-alpha.18) (2019-11-17)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.17](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.16...@react-navigation/material-top-tabs@5.0.0-alpha.17) (2019-11-10)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.16](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.15...@react-navigation/material-top-tabs@5.0.0-alpha.16) (2019-11-08)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.15](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.14...@react-navigation/material-top-tabs@5.0.0-alpha.15) (2019-11-04)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.14](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.13...@react-navigation/material-top-tabs@5.0.0-alpha.14) (2019-10-30)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.13](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.12...@react-navigation/material-top-tabs@5.0.0-alpha.13) (2019-10-29)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.12](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.11...@react-navigation/material-top-tabs@5.0.0-alpha.12) (2019-10-15)

### Features

* initial version of native stack ([#102](https://github.com/react-navigation/navigation-ex/issues/102)) ([ba3f718](https://github.com/react-navigation/navigation-ex/commit/ba3f718))

# [5.0.0-alpha.11](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.10...@react-navigation/material-top-tabs@5.0.0-alpha.11) (2019-10-06)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.10](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.9...@react-navigation/material-top-tabs@5.0.0-alpha.10) (2019-10-03)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.9](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.8...@react-navigation/material-top-tabs@5.0.0-alpha.9) (2019-10-03)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.8](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.7...@react-navigation/material-top-tabs@5.0.0-alpha.8) (2019-09-27)

### Features

* export some more type aliases ([8b78d61](https://github.com/react-navigation/navigation-ex/commit/8b78d61))

# [5.0.0-alpha.7](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.6...@react-navigation/material-top-tabs@5.0.0-alpha.7) (2019-08-31)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.6](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.5...@react-navigation/material-top-tabs@5.0.0-alpha.6) (2019-08-29)

### Bug Fixes

* allow making params optional. fixes [#80](https://github.com/react-navigation/navigation-ex/issues/80) ([a9d4813](https://github.com/react-navigation/navigation-ex/commit/a9d4813))

# [5.0.0-alpha.5](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.4...@react-navigation/material-top-tabs@5.0.0-alpha.5) (2019-08-28)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# [5.0.0-alpha.4](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.3...@react-navigation/material-top-tabs@5.0.0-alpha.4) (2019-08-27)

### Features

* add hook to scroll to top on tab press ([9e1104c](https://github.com/react-navigation/navigation-ex/commit/9e1104c))

# [5.0.0-alpha.3](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.2...@react-navigation/material-top-tabs@5.0.0-alpha.3) (2019-08-22)

### Bug Fixes

* fix path to typescript definitions ([f182315](https://github.com/react-navigation/navigation-ex/commit/f182315))

# [5.0.0-alpha.2](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/material-top-tabs@5.0.0-alpha.1...@react-navigation/material-top-tabs@5.0.0-alpha.2) (2019-08-22)

**Note:** Version bump only for package @react-navigation/material-top-tabs

# 5.0.0-alpha.1 (2019-08-21)

### Bug Fixes

* fix peer deps and add git urls ([6b4fc74](https://github.com/react-navigation/navigation-ex/commit/6b4fc74))

### Features

* add a simple stack and material tabs integration ([#39](https://github.com/react-navigation/navigation-ex/issues/39)) ([e0bee10](https://github.com/react-navigation/navigation-ex/commit/e0bee10))
* add integration for paper's bottom navigation ([f3b6d1f](https://github.com/react-navigation/navigation-ex/commit/f3b6d1f))
* integrate reanimated based stack ([#42](https://github.com/react-navigation/navigation-ex/issues/42)) ([dcf57c0](https://github.com/react-navigation/navigation-ex/commit/dcf57c0))
