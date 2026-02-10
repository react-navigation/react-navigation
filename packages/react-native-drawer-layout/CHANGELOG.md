# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@5.0.0-alpha.0...react-native-drawer-layout@5.0.0-alpha.1) (2026-02-10)

### Bug Fixes

* respect drawerType='back' in animated zIndex for drawer ([#12953](https://github.com/react-navigation/react-navigation/issues/12953)) ([48d9119](https://github.com/react-navigation/react-navigation/commit/48d91197d7ba1e1169b3d215507892883297a1a7)) - by @BarakXYZ

# [5.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.12...react-native-drawer-layout@5.0.0-alpha.0) (2025-12-19)

### Bug Fixes

* add inert to drawer on web for proper a11y ([5eb5491](https://github.com/react-navigation/react-navigation/commit/5eb54912c1cc97c7162d30a7b87a51c34672d561)) - by @satya164
* fix flex direction when wrapping with Inert ([f69f4cc](https://github.com/react-navigation/react-navigation/commit/f69f4ccaf54a72937116750a7ac35c9e408b9ef3)) - by @satya164
* fix incorrect aria-hidden on drawer ([e471b13](https://github.com/react-navigation/react-navigation/commit/e471b13999ee8314a08a5c4ec6e0d68df6b9eeda)) - by @satya164
* replace `pointerEvents` props with styles ([#12693](https://github.com/react-navigation/react-navigation/issues/12693)) ([987aed6](https://github.com/react-navigation/react-navigation/commit/987aed623ad7eaf120d3af76ca2e05b2a3c7f103)), closes [#12441](https://github.com/react-navigation/react-navigation/issues/12441) - by @hassankhan

### Code Refactoring

* drop deprecated APIs and fallbacks for older versions of packages ([cf60189](https://github.com/react-navigation/react-navigation/commit/cf601898adf7ad18b3e4b298a82e04bfb170f01b)) - by @satya164
* drop deprecated navigation bar and status bar APIs from native stack ([143a967](https://github.com/react-navigation/react-navigation/commit/143a967e6cc5766251200d1f246a2e83a230f624)) - by @satya164
* drop InteractionManager usage ([95c0f18](https://github.com/react-navigation/react-navigation/commit/95c0f186258ee55092503b7e6e0e08962ef6887d)), closes [#12785](https://github.com/react-navigation/react-navigation/issues/12785) - by @satya164

### Features

* add ability to render native buttons in header on iOS ([#12657](https://github.com/react-navigation/react-navigation/issues/12657)) ([118e27d](https://github.com/react-navigation/react-navigation/commit/118e27d17f7c878ae13c930e2ffd4088c1ccfede)) - by @johankasperi

### BREAKING CHANGES

* Consumers will now need to add listeners for
`transitionStart`, `transitionEnd` etc. to defer code to run after transitions.

`InteractionManager` has been deprecated in latest React Native
versions: https://github.com/facebook/react-native/commit/a8a4ab10d0ee6004524f0e694e9d5a41836ad5c4
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
* On Android, users should now use react-native-edge-to-edge
* This bumps the minimum required versions of various peer deps

## [4.1.12](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.11...react-native-drawer-layout@4.1.12) (2025-07-07)

### Bug Fixes

* add px to drawer width on web. fixes [#12674](https://github.com/react-navigation/react-navigation/issues/12674) ([7e5ecb3](https://github.com/react-navigation/react-navigation/commit/7e5ecb39a025d0f6b94a9fe2a316b42450fde25d)) - by @

## [4.1.11](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.10...react-native-drawer-layout@4.1.11) (2025-06-14)

**Note:** Version bump only for package react-native-drawer-layout

## [4.1.10](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.9...react-native-drawer-layout@4.1.10) (2025-05-30)

### Bug Fixes

* position drawer offscreen by default on web ([833bfa6](https://github.com/react-navigation/react-navigation/commit/833bfa63004deeb0fd6e17faf6d65ea220ad1527)) - by @

## [4.1.9](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.8...react-native-drawer-layout@4.1.9) (2025-05-30)

### Bug Fixes

* allow Overlay to be focusable in iOS with Full Keyboard Access enabled ([#12600](https://github.com/react-navigation/react-navigation/issues/12600)) ([e1a6387](https://github.com/react-navigation/react-navigation/commit/e1a6387f420631e57a6736ac0ed67a1f434d554b)) - by @ckknight
* fix drawer tab order on web for better accessibility ([#12616](https://github.com/react-navigation/react-navigation/issues/12616)) ([ac51096](https://github.com/react-navigation/react-navigation/commit/ac51096e40d879cd8d065d4d2fc6497ecbe552bc)) - by @angelalagao
* keep drawer anchored to left/right on web ([0d7379b](https://github.com/react-navigation/react-navigation/commit/0d7379b2f7338cb28fbba8473d7d93c2e4458f8c)) - by @satya164

## [4.1.8](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.7...react-native-drawer-layout@4.1.8) (2025-05-04)

### Bug Fixes

* fix peer dep versions. closes [#12580](https://github.com/react-navigation/react-navigation/issues/12580) ([6fc3dd6](https://github.com/react-navigation/react-navigation/commit/6fc3dd677aecdcf8696fe723e17b9c028de7ad85)) - by @satya164

## [4.1.7](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.6...react-native-drawer-layout@4.1.7) (2025-05-02)

### Bug Fixes

* use aria props instead of accessibilityX ([#11848](https://github.com/react-navigation/react-navigation/issues/11848)) ([347ca97](https://github.com/react-navigation/react-navigation/commit/347ca975406e84a5e7452679b1dde7b9ecca1a22)) - by @satya164

## [4.1.6](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.5...react-native-drawer-layout@4.1.6) (2025-04-08)

### Bug Fixes

* add types field back to support legacy moduleResolution ([6c021d4](https://github.com/react-navigation/react-navigation/commit/6c021d442ede3a231e32486b2c391c2e850bf76e)), closes [#12534](https://github.com/react-navigation/react-navigation/issues/12534) - by @

## [4.1.5](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.3...react-native-drawer-layout@4.1.5) (2025-04-04)

### Bug Fixes

* drop commonjs module to avoid dual package hazard ([f0fbcc5](https://github.com/react-navigation/react-navigation/commit/f0fbcc5515e73b454f607bd95bba40a48e852d0f)) - by @satya164

## [4.1.4](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.3...react-native-drawer-layout@4.1.4) (2025-04-02)

**Note:** Version bump only for package react-native-drawer-layout

## [4.1.3](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.2...react-native-drawer-layout@4.1.3) (2025-04-01)

**Note:** Version bump only for package react-native-drawer-layout

## [4.1.2](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.1...react-native-drawer-layout@4.1.2) (2025-03-19)

**Note:** Version bump only for package react-native-drawer-layout

## [4.1.1](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.1.0...react-native-drawer-layout@4.1.1) (2024-12-12)

### Bug Fixes

* fix pressables not receiving touch in drawer ([9831292](https://github.com/react-navigation/react-navigation/commit/9831292375ddf6daca1cbf82cbe904ed4d73f7db)), closes [#12324](https://github.com/react-navigation/react-navigation/issues/12324) - by @

# [4.1.0](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.4...react-native-drawer-layout@4.1.0) (2024-12-11)

### Features

* provide gesture in DrawerGestureContext ([#12326](https://github.com/react-navigation/react-navigation/issues/12326)) ([fcf3f77](https://github.com/react-navigation/react-navigation/commit/fcf3f7790a7c1c53edb5deea16d022ef8d42a5e6)) - by @gaearon

## [4.0.4](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.3...react-native-drawer-layout@4.0.4) (2024-12-03)

### Bug Fixes

* remove zIndex from overlay to avoid flicker ([f662e27](https://github.com/react-navigation/react-navigation/commit/f662e274247088b142ef3087bf560f7542d4ef29)), closes [#12137](https://github.com/react-navigation/react-navigation/issues/12137) - by @

## [4.0.3](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.2...react-native-drawer-layout@4.0.3) (2024-11-28)

**Note:** Version bump only for package react-native-drawer-layout

## [4.0.2](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.1...react-native-drawer-layout@4.0.2) (2024-11-22)

**Note:** Version bump only for package react-native-drawer-layout

## [4.0.1](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0...react-native-drawer-layout@4.0.1) (2024-11-09)

### Bug Fixes

* **drawer:** fix gesture handler warnings to mark worklets explicitly  ([#12240](https://github.com/react-navigation/react-navigation/issues/12240)) ([13c0cc4](https://github.com/react-navigation/react-navigation/commit/13c0cc4126db6014e97ae4ff2e9d5f9af0697cfc)) - by @efstathiosntonas

# [4.0.0](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.11...react-native-drawer-layout@4.0.0) (2024-11-06)

**Note:** Version bump only for package react-native-drawer-layout

# [4.0.0-rc.11](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.10...react-native-drawer-layout@4.0.0-rc.11) (2024-10-24)

### Bug Fixes

* use * for react-native peer dep to support pre-release versions ([07267e5](https://github.com/react-navigation/react-navigation/commit/07267e54be752f600f808ec2898e5d76a1bc1d43)) - by @satya164

# [4.0.0-rc.10](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.9...react-native-drawer-layout@4.0.0-rc.10) (2024-08-01)

**Note:** Version bump only for package react-native-drawer-layout

# [4.0.0-rc.9](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.8...react-native-drawer-layout@4.0.0-rc.9) (2024-07-25)

### Bug Fixes

* remove transition listeners in effect cleanup ([000f7ba](https://github.com/react-navigation/react-navigation/commit/000f7ba4311364907d6efc1ed4a662c9b462e733)) - by @satya164

# [4.0.0-rc.8](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.7...react-native-drawer-layout@4.0.0-rc.8) (2024-07-14)

### Bug Fixes

* fix drawer animation when reduceMotion enabled. closes [#1198](https://github.com/react-navigation/react-navigation/issues/1198) ([c2caf87](https://github.com/react-navigation/react-navigation/commit/c2caf87bc5df50f665442fbb0c42794cad793a3a)) - by @satya164

# [4.0.0-rc.7](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.6...react-native-drawer-layout@4.0.0-rc.7) (2024-07-11)

### Bug Fixes

* upgrade react-native-builder-bob ([1575287](https://github.com/react-navigation/react-navigation/commit/1575287d40fadb97f33eb19c2914d8be3066b47a)) - by @

# [4.0.0-rc.6](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.5...react-native-drawer-layout@4.0.0-rc.6) (2024-07-10)

### Bug Fixes

* bump use-latest-callback to fix require ([40ddae9](https://github.com/react-navigation/react-navigation/commit/40ddae95fbbf84ff47f3447eef50ed9ddb66cab8)) - by @satya164

# [4.0.0-rc.5](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.4...react-native-drawer-layout@4.0.0-rc.5) (2024-07-07)

### Bug Fixes

* add missing exports entry to package.json ([ae16f52](https://github.com/react-navigation/react-navigation/commit/ae16f52adcfb58c59e5735b9caea79b1c2bfa94b)) - by @satya164
* upgrade use-latest-callback for esm compat ([187d41b](https://github.com/react-navigation/react-navigation/commit/187d41b3a139fe2a075a7809c0c4088cbd2fafdb)) - by @satya164

# [4.0.0-rc.4](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.3...react-native-drawer-layout@4.0.0-rc.4) (2024-07-04)

### Bug Fixes

* fix published files ([829caa0](https://github.com/react-navigation/react-navigation/commit/829caa019e125811eea5213fd380e8e1bdbe7030)) - by @

# [4.0.0-rc.3](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.2...react-native-drawer-layout@4.0.0-rc.3) (2024-07-04)

**Note:** Version bump only for package react-native-drawer-layout

# [4.0.0-rc.2](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.1...react-native-drawer-layout@4.0.0-rc.2) (2024-07-04)

### Features

* add package.json exports field ([1435cfe](https://github.com/react-navigation/react-navigation/commit/1435cfe3300767c221ebd4613479ad662d61efee)) - by @

# [4.0.0-rc.1](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-rc.0...react-native-drawer-layout@4.0.0-rc.1) (2024-07-01)

### Bug Fixes

* stop using react-native field in package.json ([efc33cb](https://github.com/react-navigation/react-navigation/commit/efc33cb0c4830a84ceae034dc1278c54f1faf32d)) - by @

# [4.0.0-rc.0](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-alpha.9...react-native-drawer-layout@4.0.0-rc.0) (2024-06-27)

### Bug Fixes

* fix drawer rtl on ios & android ([6fba631](https://github.com/react-navigation/react-navigation/commit/6fba631b588d83be0a731017adb46ce79ca9b2ec)) - by @satya164
* fix drawer rtl on web ([06209b9](https://github.com/react-navigation/react-navigation/commit/06209b9f04171c18b51638593d3f0fd5028a97f8)) - by @satya164

# [4.0.0-alpha.9](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-alpha.8...react-native-drawer-layout@4.0.0-alpha.9) (2024-03-25)

### Features

* migrate drawer to new RNGH API ([#11776](https://github.com/react-navigation/react-navigation/issues/11776)) ([5d7d81e](https://github.com/react-navigation/react-navigation/commit/5d7d81e633896b3a58e86d8ab9ca0a36dcad3ab6)) - by @osdnk

# [4.0.0-alpha.8](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-alpha.7...react-native-drawer-layout@4.0.0-alpha.8) (2024-03-14)

### Bug Fixes

* adjust drawer width according to md3 ([a88b2ea](https://github.com/react-navigation/react-navigation/commit/a88b2ea90f56d8dafbd5e1bae6a42fd9b0c73431)) - by @satya164

# [4.0.0-alpha.7](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-alpha.6...react-native-drawer-layout@4.0.0-alpha.7) (2024-03-10)

**Note:** Version bump only for package react-native-drawer-layout

# [4.0.0-alpha.6](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-alpha.5...react-native-drawer-layout@4.0.0-alpha.6) (2024-03-08)

### Bug Fixes

* fix right drawer layouts display over content ([#11651](https://github.com/react-navigation/react-navigation/issues/11651)) ([f6772c6](https://github.com/react-navigation/react-navigation/commit/f6772c6c2f95ed2c94c10c9632c8534fe59853b7)) - by @brannonvann
* update drawer and header styles according to material design 3 ([#11872](https://github.com/react-navigation/react-navigation/issues/11872)) ([bfa5689](https://github.com/react-navigation/react-navigation/commit/bfa568995940f956c9ec5944f2b0543eca5da546)) - by @groot007

# [4.0.0-alpha.5](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-alpha.4...react-native-drawer-layout@4.0.0-alpha.5) (2024-02-24)

### Bug Fixes

* fix peer dependency versions ([4b93b63](https://github.com/react-navigation/react-navigation/commit/4b93b6335ce180fe879f9fbe8f2400426b5484fb)) - by @

# [4.0.0-alpha.4](https://github.com/react-navigation/react-navigation/compare/react-native-drawer-layout@4.0.0-alpha.3...react-native-drawer-layout@4.0.0-alpha.4) (2024-02-23)

**Note:** Version bump only for package react-native-drawer-layout

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
