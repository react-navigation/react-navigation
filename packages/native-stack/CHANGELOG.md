# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.0.0-rc.30](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.29...@react-navigation/native-stack@7.0.0-rc.30) (2024-10-29)

### Bug Fixes

* bump peer dep version requirement for screens ([63f1687](https://github.com/react-navigation/react-navigation/commit/63f16871c4db0c275c2d393f668adec45d31ac7a)) - by @satya164

# [7.0.0-rc.29](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.28...@react-navigation/native-stack@7.0.0-rc.29) (2024-10-24)

### Bug Fixes

* fix headerBack and canGoBack parameters ([41d2ac2](https://github.com/react-navigation/react-navigation/commit/41d2ac2edd6d6b539adc8e956119b9b8e5836176)) - by @satya164
* use * for react-native peer dep to support pre-release versions ([07267e5](https://github.com/react-navigation/react-navigation/commit/07267e54be752f600f808ec2898e5d76a1bc1d43)) - by @satya164

# [7.0.0-rc.28](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.27...@react-navigation/native-stack@7.0.0-rc.28) (2024-10-11)

### Bug Fixes

* **native-stack:** incorrect text truncation in header title on Android ([#12125](https://github.com/react-navigation/react-navigation/issues/12125)) ([6b6b846](https://github.com/react-navigation/react-navigation/commit/6b6b846f4984ac4834bab6bd8474b390313c741e)) - by @kkafar

### Features

* preload using activityState prop ([#12189](https://github.com/react-navigation/react-navigation/issues/12189)) ([496012c](https://github.com/react-navigation/react-navigation/commit/496012c32ae86af335160d569fb0d025cd092bd8)) - by @maciekstosio
* support for Android sheets & iOS custom detents ([#12032](https://github.com/react-navigation/react-navigation/issues/12032)) ([af20d57](https://github.com/react-navigation/react-navigation/commit/af20d57b1a12d0d79a51425e2a7088efe140ae57)) - by @kkafar

# [7.0.0-rc.27](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.26...@react-navigation/native-stack@7.0.0-rc.27) (2024-09-10)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.26](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.25...@react-navigation/native-stack@7.0.0-rc.26) (2024-09-08)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.25](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.24...@react-navigation/native-stack@7.0.0-rc.25) (2024-08-09)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.24](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.23...@react-navigation/native-stack@7.0.0-rc.24) (2024-08-08)

### Bug Fixes

* avoid using column-reverse for header for a11y on web ([3101d04](https://github.com/react-navigation/react-navigation/commit/3101d0406c32163c0576cb5c4712755c01b1a17c)) - by @satya164
* improve custom header in native stack & stack ([7e6b666](https://github.com/react-navigation/react-navigation/commit/7e6b6662342e63d241c1a2e8f57c56a3b5b0cef5)) - by @satya164

### Features

* implement search bar in elements header ([#12097](https://github.com/react-navigation/react-navigation/issues/12097)) ([78b1535](https://github.com/react-navigation/react-navigation/commit/78b1535e01de1b4a1dc462c0690d69d3d39ab964)) - by @satya164

# [7.0.0-rc.23](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.22...@react-navigation/native-stack@7.0.0-rc.23) (2024-08-07)

### Bug Fixes

* add more fallbacks for headerBackButtonDisplayMode ([#12094](https://github.com/react-navigation/react-navigation/issues/12094)) ([bc01c15](https://github.com/react-navigation/react-navigation/commit/bc01c15e6e4b5f225b6204f42ac1fc61478bfb65)) - by @satya164

# [7.0.0-rc.22](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.21...@react-navigation/native-stack@7.0.0-rc.22) (2024-08-05)

### Features

* add headerBackButtonDisplayMode for native stack ([#12089](https://github.com/react-navigation/react-navigation/issues/12089)) ([89ffa1b](https://github.com/react-navigation/react-navigation/commit/89ffa1baa1dc3ad8260361a3f84aa21d24c1643e)), closes [#11980](https://github.com/react-navigation/react-navigation/issues/11980) - by @dylancom

### BREAKING CHANGES

* This removes the `headerBackTitleVisible` option,

Adds corresponding functionality from
https://github.com/software-mansion/react-native-screens/pull/2123.

# [7.0.0-rc.21](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.20...@react-navigation/native-stack@7.0.0-rc.21) (2024-08-02)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.20](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.19...@react-navigation/native-stack@7.0.0-rc.20) (2024-08-01)

### Bug Fixes

* fix incorrect condition due to bad merge ([3a0b0b5](https://github.com/react-navigation/react-navigation/commit/3a0b0b5e264defaed261864cf09de93c591ac2d7)) - by @satya164

# [7.0.0-rc.19](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.18...@react-navigation/native-stack@7.0.0-rc.19) (2024-08-01)

### Bug Fixes

* fix useAnimatedHeaderHeight on web for native stack ([03b39d6](https://github.com/react-navigation/react-navigation/commit/03b39d66d8bdb2c87997ad6f3e7551aead7a25ae)) - by @satya164
* fix wrong header height for translucent header on Android ([ca64015](https://github.com/react-navigation/react-navigation/commit/ca64015a9526bb1eed14ef31453abba04ca5508b)) - by @satya164

# [7.0.0-rc.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.17...@react-navigation/native-stack@7.0.0-rc.18) (2024-07-25)

### Bug Fixes

* fix type inference for params. closes [#12071](https://github.com/react-navigation/react-navigation/issues/12071) ([3299b70](https://github.com/react-navigation/react-navigation/commit/3299b70682adbf55811369535cca1cdd0dc59860)) - by @

### Features

* add fullScreenSwipeShadowEnabled prop to NativeStackView ([#12053](https://github.com/react-navigation/react-navigation/issues/12053)) ([da34512](https://github.com/react-navigation/react-navigation/commit/da34512873604f83bda7d9c1db5f500d3447364d)) - by @maksg

# [7.0.0-rc.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.16...@react-navigation/native-stack@7.0.0-rc.17) (2024-07-19)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.15...@react-navigation/native-stack@7.0.0-rc.16) (2024-07-12)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.14...@react-navigation/native-stack@7.0.0-rc.15) (2024-07-12)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.13...@react-navigation/native-stack@7.0.0-rc.14) (2024-07-11)

### Bug Fixes

* upgrade react-native-builder-bob ([1575287](https://github.com/react-navigation/react-navigation/commit/1575287d40fadb97f33eb19c2914d8be3066b47a)) - by @

# [7.0.0-rc.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.12...@react-navigation/native-stack@7.0.0-rc.13) (2024-07-11)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.11...@react-navigation/native-stack@7.0.0-rc.12) (2024-07-10)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.10...@react-navigation/native-stack@7.0.0-rc.11) (2024-07-08)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.9...@react-navigation/native-stack@7.0.0-rc.10) (2024-07-07)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.8...@react-navigation/native-stack@7.0.0-rc.9) (2024-07-04)

### Bug Fixes

* fix published files ([829caa0](https://github.com/react-navigation/react-navigation/commit/829caa019e125811eea5213fd380e8e1bdbe7030)) - by @

# [7.0.0-rc.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.7...@react-navigation/native-stack@7.0.0-rc.8) (2024-07-04)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.6...@react-navigation/native-stack@7.0.0-rc.7) (2024-07-04)

### Features

* add package.json exports field ([1435cfe](https://github.com/react-navigation/react-navigation/commit/1435cfe3300767c221ebd4613479ad662d61efee)) - by @

# [7.0.0-rc.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.5...@react-navigation/native-stack@7.0.0-rc.6) (2024-07-02)

### Bug Fixes

* drop leftover empty string for headerBackTitleVisible ([b93f861](https://github.com/react-navigation/react-navigation/commit/b93f86155fe9185c5197cd6d44b625aabb8ca4a7)) - by @satya164

# [7.0.0-rc.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.4...@react-navigation/native-stack@7.0.0-rc.5) (2024-07-01)

### Bug Fixes

* stop using react-native field in package.json ([efc33cb](https://github.com/react-navigation/react-navigation/commit/efc33cb0c4830a84ceae034dc1278c54f1faf32d)) - by @

# [7.0.0-rc.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.3...@react-navigation/native-stack@7.0.0-rc.4) (2024-06-29)

### Bug Fixes

* add a workaround for incorrect inference [#12041](https://github.com/react-navigation/react-navigation/issues/12041) ([85c4bbb](https://github.com/react-navigation/react-navigation/commit/85c4bbbf535cde2ba9cd537a2a5ce34f060d32b9)) - by @

# [7.0.0-rc.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.2...@react-navigation/native-stack@7.0.0-rc.3) (2024-06-28)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.1...@react-navigation/native-stack@7.0.0-rc.2) (2024-06-28)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-rc.0...@react-navigation/native-stack@7.0.0-rc.1) (2024-06-28)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-rc.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.20...@react-navigation/native-stack@7.0.0-rc.0) (2024-06-27)

### Bug Fixes

* **native-stack:**  set `headerTopInstetEnabled` to the same value as `statusBarTranslucent` to prevent header content jump ([#12014](https://github.com/react-navigation/react-navigation/issues/12014)) ([7791191](https://github.com/react-navigation/react-navigation/commit/77911917bb4d1137be267a321fb8a20bba772a06)), closes [/github.com/react-navigation/react-navigation/blob/25e834b4f330fb05b4ecdbe81ef7f2f065fd26c8/packages/elements/src/SafeAreaProviderCompat.tsx#L55](https://github.com//github.com/react-navigation/react-navigation/blob/25e834b4f330fb05b4ecdbe81ef7f2f065fd26c8/packages/elements/src/SafeAreaProviderCompat.tsx/issues/L55) [#10827](https://github.com/react-navigation/react-navigation/issues/10827) - by @kkafar
* setting headerBackTitleVisible to false not working on iOS ([#11937](https://github.com/react-navigation/react-navigation/issues/11937)) ([52a3234](https://github.com/react-navigation/react-navigation/commit/52a3234b7aaf4d4fcc9c0155f44f3ea2233f0f40)), closes [/github.com/software-mansion/react-native-screens/blob/d54a19a/ios/RNSScreenStackHeaderConfig.mm#L506](https://github.com//github.com/software-mansion/react-native-screens/blob/d54a19a/ios/RNSScreenStackHeaderConfig.mm/issues/L506) [/github.com/software-mansion/react-native-screens/blob/d54a19a9789b799566da16a89e2cd8d8f1ad0ba7/ios/RNSScreenStackHeaderConfig.h#L42](https://github.com//github.com/software-mansion/react-native-screens/blob/d54a19a9789b799566da16a89e2cd8d8f1ad0ba7/ios/RNSScreenStackHeaderConfig.h/issues/L42) [/github.com/software-mansion/react-native-screens/blob/d54a19a/ios/RNSScreenStackHeaderConfig.mm#L514-L539](https://github.com//github.com/software-mansion/react-native-screens/blob/d54a19a/ios/RNSScreenStackHeaderConfig.mm/issues/L514-L539) - by @zetavg
* use measured header height when exposing it ([#11917](https://github.com/react-navigation/react-navigation/issues/11917)) ([d90ed76](https://github.com/react-navigation/react-navigation/commit/d90ed7665be74c570ed2a6a4da612230fcf6a01c)) - by @satya164

### Features

* add navigationBarTranslucent option to native stack ([#11998](https://github.com/react-navigation/react-navigation/issues/11998)) ([2864b6c](https://github.com/react-navigation/react-navigation/commit/2864b6cc5b776c86ae23218464e379a3705700bb)) - by @alduzy

# [7.0.0-alpha.20](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.19...@react-navigation/native-stack@7.0.0-alpha.20) (2024-03-25)

### Features

* pass href to headerLeft function ([ce6d885](https://github.com/react-navigation/react-navigation/commit/ce6d88559e4a1afeafa84fc839892bb846349d67)) - by @satya164

# [7.0.0-alpha.19](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.18...@react-navigation/native-stack@7.0.0-alpha.19) (2024-03-22)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-alpha.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.17...@react-navigation/native-stack@7.0.0-alpha.18) (2024-03-22)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-alpha.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.16...@react-navigation/native-stack@7.0.0-alpha.17) (2024-03-20)

### Features

* add getStateForRouteNamesChange to all navigators and mark it as unstable ([4edbb07](https://github.com/react-navigation/react-navigation/commit/4edbb071163742b60499178271fd3e3e92fb4002)) - by @satya164

# [7.0.0-alpha.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.15...@react-navigation/native-stack@7.0.0-alpha.16) (2024-03-14)

### Features

* automatically infer types for navigation in options, listeners etc. ([#11883](https://github.com/react-navigation/react-navigation/issues/11883)) ([c54baf1](https://github.com/react-navigation/react-navigation/commit/c54baf14640e567be10cb8a5f68e5cbf0b35f120)) - by @satya164

# [7.0.0-alpha.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.14...@react-navigation/native-stack@7.0.0-alpha.15) (2024-03-10)

### Bug Fixes

* support custom fontFamily configurations in headerTitleStyle ([#11880](https://github.com/react-navigation/react-navigation/issues/11880)) ([1e9e838](https://github.com/react-navigation/react-navigation/commit/1e9e8385f2677a363d2e7416f5c3acda0c43d517)), closes [#11429](https://github.com/react-navigation/react-navigation/issues/11429) - by @Kasendwa

### Features

* add a type for options arguments ([8e719e0](https://github.com/react-navigation/react-navigation/commit/8e719e0faefbd1eed9f7122a3d8e2c617d5f8254)) - by @satya164

# [7.0.0-alpha.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.13...@react-navigation/native-stack@7.0.0-alpha.14) (2024-03-09)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-alpha.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.12...@react-navigation/native-stack@7.0.0-alpha.13) (2024-03-08)

### Bug Fixes

* update drawer and header styles according to material design 3 ([#11872](https://github.com/react-navigation/react-navigation/issues/11872)) ([bfa5689](https://github.com/react-navigation/react-navigation/commit/bfa568995940f956c9ec5944f2b0543eca5da546)) - by @groot007

### Features

* make all screens after presentation: 'modal' as modal unless specified ([#11860](https://github.com/react-navigation/react-navigation/issues/11860)) ([f16216c](https://github.com/react-navigation/react-navigation/commit/f16216c65740c2795cdef6c2249edffa9e9416ae)) - by @groot007

# [7.0.0-alpha.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.11...@react-navigation/native-stack@7.0.0-alpha.12) (2024-03-04)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-alpha.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.10...@react-navigation/native-stack@7.0.0-alpha.11) (2024-02-24)

### Bug Fixes

* fix peer dependency versions ([4b93b63](https://github.com/react-navigation/react-navigation/commit/4b93b6335ce180fe879f9fbe8f2400426b5484fb)) - by @

# [7.0.0-alpha.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.9...@react-navigation/native-stack@7.0.0-alpha.10) (2024-02-23)

### Bug Fixes

* White flash transitions with DarkTheme ([#11800](https://github.com/react-navigation/react-navigation/issues/11800)) ([1770c96](https://github.com/react-navigation/react-navigation/commit/1770c96834abf8af28aa0f3c6bffb618ea3dcce9)) - by @gianlucalippolis

# [7.0.0-alpha.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.8...@react-navigation/native-stack@7.0.0-alpha.9) (2024-02-23)

### Bug Fixes

* fix header height for iOS devices with dynamic island ([#11786](https://github.com/react-navigation/react-navigation/issues/11786)) ([4c521b5](https://github.com/react-navigation/react-navigation/commit/4c521b5c865f2c46d58abb2e9e7fd1b0d2074215)), closes [#11655](https://github.com/react-navigation/react-navigation/issues/11655) - by @gianlucalippolis

### Features

* add a HeaderButton component to elements ([d8de228](https://github.com/react-navigation/react-navigation/commit/d8de228bafc9408855bdfdfcd48bbb10195501fb)) - by @satya164
* introduce missing props from native-stack v5 ([#11803](https://github.com/react-navigation/react-navigation/issues/11803)) ([90cfbf2](https://github.com/react-navigation/react-navigation/commit/90cfbf23bcc5259f3262691a9eec6c5b906e5262)) - by @tboba

# [7.0.0-alpha.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.7...@react-navigation/native-stack@7.0.0-alpha.8) (2024-01-17)

### Features

* add layout and screenLayout props for screens ([#11741](https://github.com/react-navigation/react-navigation/issues/11741)) ([2dc2178](https://github.com/react-navigation/react-navigation/commit/2dc217827a1caa615460563973d3d658be372b29)) - by @satya164
* preloading in routers  ([382d6e6](https://github.com/react-navigation/react-navigation/commit/382d6e6f3312630b34332b1ae7d4bd7bf9b4ee60)) - by @osdnk

# [7.0.0-alpha.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.6...@react-navigation/native-stack@7.0.0-alpha.7) (2023-11-17)

### Bug Fixes

* update peer dependencies when publishing ([c440703](https://github.com/react-navigation/react-navigation/commit/c44070310f875e488708f2a6c52ffddcea05b0e6)) - by @

# [7.0.0-alpha.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.5...@react-navigation/native-stack@7.0.0-alpha.6) (2023-11-12)

### Bug Fixes

* fix header customization in native stack ([6885210](https://github.com/react-navigation/react-navigation/commit/6885210ec02aabb8c3736517482fc21ac32ca3ab)) - by @satya164
* headerHeight on phones with dynamic island ([#11338](https://github.com/react-navigation/react-navigation/issues/11338)) ([e4815c5](https://github.com/react-navigation/react-navigation/commit/e4815c538536ddccf4207b87bf3e2f1603dedd84)), closes [#10989](https://github.com/react-navigation/react-navigation/issues/10989) - by @dylancom

### Features

* add a layout prop for navigators ([#11614](https://github.com/react-navigation/react-navigation/issues/11614)) ([1f51190](https://github.com/react-navigation/react-navigation/commit/1f511904b9437d1451557147e72962859e97b1ae)) - by @satya164
* add useAnimatedHeaderHeight hook ([#11663](https://github.com/react-navigation/react-navigation/issues/11663)) ([5a88c74](https://github.com/react-navigation/react-navigation/commit/5a88c740a6acb022dded823469a347868ef12ad4)), closes [#11338](https://github.com/react-navigation/react-navigation/issues/11338) - by @tboba

# [7.0.0-alpha.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.4...@react-navigation/native-stack@7.0.0-alpha.5) (2023-09-25)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-alpha.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.3...@react-navigation/native-stack@7.0.0-alpha.4) (2023-09-13)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-alpha.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.2...@react-navigation/native-stack@7.0.0-alpha.3) (2023-09-07)

### Bug Fixes

* Allow to use `PlatformColor` in the theme ([#11570](https://github.com/react-navigation/react-navigation/issues/11570)) ([64734e7](https://github.com/react-navigation/react-navigation/commit/64734e7bc0d7f203d8e5db6abcc9a88157a5f16c)) - by @retyui
* buggy behaviour of search bar / large title on Fabric with native stack v7 ([#11501](https://github.com/react-navigation/react-navigation/issues/11501)) ([dcb4e4c](https://github.com/react-navigation/react-navigation/commit/dcb4e4c775b0e22ef84475de350794c21764632e)) - by @kkafar

* feat!: add a direction prop to NavigationContainer to specify rtl (#11393) ([8309636](https://github.com/react-navigation/react-navigation/commit/830963653fb5a489d02f1503222629373319b39e)), closes [#11393](https://github.com/react-navigation/react-navigation/issues/11393) - by @satya164

### BREAKING CHANGES

* Previously the navigators tried to detect RTL automatically and adjust the UI. However this is problematic since we cannot detect RTL in all cases (e.g. on Web).

This adds an optional `direction` prop to `NavigationContainer` instead so that user can specify when React Navigation's UI needs to be adjusted for RTL. It defaults to the value from `I18nManager` on native platforms, however it needs to be explicitly passed for Web.

# [7.0.0-alpha.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.1...@react-navigation/native-stack@7.0.0-alpha.2) (2023-06-22)

**Note:** Version bump only for package @react-navigation/native-stack

# [7.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@7.0.0-alpha.0...@react-navigation/native-stack@7.0.0-alpha.1) (2023-03-01)

### Bug Fixes

* fix paths in sourcemap files ([368e069](https://github.com/react-navigation/react-navigation/commit/368e0691b9fb07d4b1cbe71cfe4c2f40512f93ad)) - by @satya164

### Features

* add ability to customize the fonts with the theme ([#11243](https://github.com/react-navigation/react-navigation/issues/11243)) ([1cd6836](https://github.com/react-navigation/react-navigation/commit/1cd6836f1d10bcdf7f96d9e4b9f7de0ddea9391f)) - by @satya164

# [7.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.9.2...@react-navigation/native-stack@7.0.0-alpha.0) (2023-02-17)

### Bug Fixes

* fix headerBackVisible type annotation ([#11220](https://github.com/react-navigation/react-navigation/issues/11220)) ([d18936a](https://github.com/react-navigation/react-navigation/commit/d18936a21fbd8a3974a4a83f613df0ef00aafbcd)) - by @Vin-Xi
* make headerBackground visible with transparent header ([#11109](https://github.com/react-navigation/react-navigation/issues/11109)) ([2b1e8dc](https://github.com/react-navigation/react-navigation/commit/2b1e8dccc315ffa47fb7d4fabb1c597f508c5511)) - by @yhkaplan

* refactor!: improve the API for Link component ([7f35837](https://github.com/react-navigation/react-navigation/commit/7f3583793ad17475531e155f1f433ffa16547015)) - by @satya164

### BREAKING CHANGES

* Initially the `Link` component was designed to work with path strings via the `to` prop. But it has few issues:

- The path strings are not type-safe, making it easy to cause typos and bugs after
refactor
- The API made navigating via screen name more incovenient, even if that's the preferred approach

This revamps the API of the `Link` component to make it easier to use. Instead of `to` prop, it now accepts `screen` and `params` props, as well as an optional `href` prop to
use instead of the generated path.

e.g.:

```js
<Link screen="Details" params={{ foo: 42 }}>Go to Details</Link>
```

This also drops the `useLinkTo` hook and consolidates into the `useLinkTools` hook - which lets us build a `href` for a screen or action for a path.

## [6.9.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.9.1...@react-navigation/native-stack@6.9.2) (2022-11-21)

### Bug Fixes

* add accessibility props to NativeStack screens ([#11022](https://github.com/react-navigation/react-navigation/issues/11022)) ([3ab05af](https://github.com/react-navigation/react-navigation/commit/3ab05afeb6412b8e5566270442ac14a463136620))
* let headerShadowVisible: true display a shadow even if headerTransparent is true ([#10993](https://github.com/react-navigation/react-navigation/issues/10993)) ([06b6be2](https://github.com/react-navigation/react-navigation/commit/06b6be2495b1cc2615185eea981a689b7b9fe6d2)), closes [#10845](https://github.com/react-navigation/react-navigation/issues/10845)
* supersede Platform.isTVOS for Platform.isTV ([#10973](https://github.com/react-navigation/react-navigation/issues/10973)) ([1846de6](https://github.com/react-navigation/react-navigation/commit/1846de6bd8247992286d39ee76e65f27debb1754))

## [6.9.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.9.0...@react-navigation/native-stack@6.9.1) (2022-10-11)

### Bug Fixes

* fix headerTransparent with custom header in native-stack ([#10919](https://github.com/react-navigation/react-navigation/issues/10919)) ([40bed38](https://github.com/react-navigation/react-navigation/commit/40bed380147a194edc8500d5220cd983ecfb27e0)), closes [#10822](https://github.com/react-navigation/react-navigation/issues/10822) [#10902](https://github.com/react-navigation/react-navigation/issues/10902)

# [6.9.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.7.0...@react-navigation/native-stack@6.9.0) (2022-09-16)

### Bug Fixes

* fix incorrect height in useHeaderHeight in native-stack ([#10827](https://github.com/react-navigation/react-navigation/issues/10827)) ([b8ea527](https://github.com/react-navigation/react-navigation/commit/b8ea5279d65beb44833b0f40af95ef563b9831f7)), closes [#10333](https://github.com/react-navigation/react-navigation/issues/10333)
* improve when back button is shown in nested native stacks ([#10761](https://github.com/react-navigation/react-navigation/issues/10761)) ([05dab7d](https://github.com/react-navigation/react-navigation/commit/05dab7d6f146ba076a00cb4ed1bbc1070224e9ab))
* replace deprecated I18nManager.isRTL with 18nManager.getConstants().isRTL ([#10547](https://github.com/react-navigation/react-navigation/issues/10547)) ([50b88d4](https://github.com/react-navigation/react-navigation/commit/50b88d40496a04f613073c63119b21a104ec9bc2))
* restore native behavior of back button ([7ba7246](https://github.com/react-navigation/react-navigation/commit/7ba72468c0434e02bdaa6a8af80c809119b344e9)), closes [#10761](https://github.com/react-navigation/react-navigation/issues/10761) [software-mansion/react-native-screens#1589](https://github.com/software-mansion/react-native-screens/issues/1589)

### Features

* add freezeOnBlur prop  ([#10834](https://github.com/react-navigation/react-navigation/issues/10834)) ([e13b4d9](https://github.com/react-navigation/react-navigation/commit/e13b4d9341362512ba4bf921a17552f3be8735c1))
* implement usePreventRemove hook ([#10682](https://github.com/react-navigation/react-navigation/issues/10682)) ([7411516](https://github.com/react-navigation/react-navigation/commit/741151654752e0e55affbc8e04dd4876eaedd760))

# [6.8.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.7.0...@react-navigation/native-stack@6.8.0) (2022-08-24)

### Bug Fixes

* improve when back button is shown in nested native stacks ([#10761](https://github.com/react-navigation/react-navigation/issues/10761)) ([05dab7d](https://github.com/react-navigation/react-navigation/commit/05dab7d6f146ba076a00cb4ed1bbc1070224e9ab))
* replace deprecated I18nManager.isRTL with 18nManager.getConstants().isRTL ([#10547](https://github.com/react-navigation/react-navigation/issues/10547)) ([50b88d4](https://github.com/react-navigation/react-navigation/commit/50b88d40496a04f613073c63119b21a104ec9bc2))

### Features

* implement usePreventRemove hook ([#10682](https://github.com/react-navigation/react-navigation/issues/10682)) ([7411516](https://github.com/react-navigation/react-navigation/commit/741151654752e0e55affbc8e04dd4876eaedd760))

# [6.7.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.6.2...@react-navigation/native-stack@6.7.0) (2022-07-05)

### Bug Fixes

* ensure same @types/react version in repo ([#10663](https://github.com/react-navigation/react-navigation/issues/10663)) ([e662465](https://github.com/react-navigation/react-navigation/commit/e6624653fbbd931158dbebd17142abf9637205b6)), closes [#10655](https://github.com/react-navigation/react-navigation/issues/10655)
* explicitly set gestureDirection default value in native-stack ([#10674](https://github.com/react-navigation/react-navigation/issues/10674)) ([25a0d4c](https://github.com/react-navigation/react-navigation/commit/25a0d4c3f7422d2e7cecd5afba253cab13a888a1))
* fix typo in native-stack types ([f4df53a](https://github.com/react-navigation/react-navigation/commit/f4df53aac999a20272445a01dcf999087c5cf434))
* use top inset for header height on ipad ([#10652](https://github.com/react-navigation/react-navigation/issues/10652)) ([d5b2600](https://github.com/react-navigation/react-navigation/commit/d5b2600776d34dc94240ba642d82691030920331)), closes [#10609](https://github.com/react-navigation/react-navigation/issues/10609)

### Features

* add missing props from react-native-screens to native-stack ([#10578](https://github.com/react-navigation/react-navigation/issues/10578)) ([7e9027b](https://github.com/react-navigation/react-navigation/commit/7e9027bedb3d63a400ac09f61b9f0c757ddeae57)), closes [#10454](https://github.com/react-navigation/react-navigation/issues/10454)

## [6.6.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.6.1...@react-navigation/native-stack@6.6.2) (2022-04-22)

### Bug Fixes

* fix incorrect header title when headerLeft is specified ([bc6f6b5](https://github.com/react-navigation/react-navigation/commit/bc6f6b5eadf1233dd94905efaa8ae2bf65311963)), closes [#10452](https://github.com/react-navigation/react-navigation/issues/10452)
* fix incorrect warning for headerTransparent in native-stack ([4ff1ef5](https://github.com/react-navigation/react-navigation/commit/4ff1ef5028a1a618eb67c500b2ada274ce7cd37b)), closes [#10502](https://github.com/react-navigation/react-navigation/issues/10502)

## [6.6.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.6.0...@react-navigation/native-stack@6.6.1) (2022-04-01)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.6.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.5.2...@react-navigation/native-stack@6.6.0) (2022-04-01)

### Features

* add an ID prop to navigators ([4e4935a](https://github.com/react-navigation/react-navigation/commit/4e4935ac2584bc1a00209609cc026fa73e12c10a))

## [6.5.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.5.1...@react-navigation/native-stack@6.5.2) (2022-03-23)

### Bug Fixes

* provide proper context to header elements in native stack ([5b01241](https://github.com/react-navigation/react-navigation/commit/5b012411076e8acc20ca779cbc19e36d7606d2b9)), closes [#10453](https://github.com/react-navigation/react-navigation/issues/10453)

## [6.5.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.5.0...@react-navigation/native-stack@6.5.1) (2022-03-23)

### Bug Fixes

* take screen count to dismiss from native side for native stack ([#10377](https://github.com/react-navigation/react-navigation/issues/10377)) ([27225a2](https://github.com/react-navigation/react-navigation/commit/27225a2d97c774c8c61f3d75c47690e5f212bb34))

# [6.5.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.4.1...@react-navigation/native-stack@6.5.0) (2022-02-06)

### Features

* add customAnimationOnGesture & fullScreenSwipeEnabled props to native-stack ([#10321](https://github.com/react-navigation/react-navigation/issues/10321)) ([ab86045](https://github.com/react-navigation/react-navigation/commit/ab86045efecf03fb9cb704cad1f6add536f01e89))

## [6.4.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.4.0...@react-navigation/native-stack@6.4.1) (2022-02-03)

### Bug Fixes

* correctly set header to translucent ([c9eed38](https://github.com/react-navigation/react-navigation/commit/c9eed386cd46caee5534e3c339b573858f7de7eb))

# [6.4.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.3.0...@react-navigation/native-stack@6.4.0) (2022-02-02)

### Bug Fixes

* set header to translucent when using searchbar or large title ([a410f84](https://github.com/react-navigation/react-navigation/commit/a410f84d1426ac3cc7bc4052db9072189f236f71))

### Features

* add search bar to native-stack on Android ([e329c43](https://github.com/react-navigation/react-navigation/commit/e329c43334a01fa1282338cf519a3fc37dd453ad))

# [6.3.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.2.5...@react-navigation/native-stack@6.3.0) (2022-01-29)

### Bug Fixes

* fix exposing custom header height with modals ([3b4edf7](https://github.com/react-navigation/react-navigation/commit/3b4edf7a8dfefb06a7ae1db2cbad48a5b19630bb))
* fix useRoute & useNavigation in custom header in native stack ([826b0c5](https://github.com/react-navigation/react-navigation/commit/826b0c52c976137927223a03e4d91b5aae00ec77))
* hide header shadow for transparent header ([ffcd171](https://github.com/react-navigation/react-navigation/commit/ffcd1713e0518e551207c1b7a6fb259a4db619a0))
* make native stack background transparent when using transparentModal ([d58f4b9](https://github.com/react-navigation/react-navigation/commit/d58f4b9c09fbc0150ef3110127b79a6f0dd5006c))
* wrap native stack with NavigationContent ([#10288](https://github.com/react-navigation/react-navigation/issues/10288)) ([d0f8620](https://github.com/react-navigation/react-navigation/commit/d0f8620549a9fa5f8c4828775f06df7ea6d55afb)), closes [#10287](https://github.com/react-navigation/react-navigation/issues/10287) [/github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/core/src/useNavigation.tsx#L16](https://github.com//github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/core/src/useNavigation.tsx/issues/L16) [/github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/native/src/useLinkProps.tsx#L26](https://github.com//github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/native/src/useLinkProps.tsx/issues/L26) [/github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/core/src/useNavigationBuilder.tsx#L606](https://github.com//github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/core/src/useNavigationBuilder.tsx/issues/L606) [/github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/bottom-tabs/src/navigators/createBottomTabNavigator.tsx#L101](https://github.com//github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/bottom-tabs/src/navigators/createBottomTabNavigator.tsx/issues/L101) [/github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/drawer/src/navigators/createDrawerNavigator.tsx#L99](https://github.com//github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/drawer/src/navigators/createDrawerNavigator.tsx/issues/L99) [/github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/stack/src/navigators/createStackNavigator.tsx#L110](https://github.com//github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/stack/src/navigators/createStackNavigator.tsx/issues/L110) [/github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/native-stack/src/navigators/createNativeStackNavigator.tsx#L67](https://github.com//github.com/react-navigation/react-navigation/blob/b91c9b05ff96727f5fa6ef0bec51b5d7eac06600/packages/native-stack/src/navigators/createNativeStackNavigator.tsx/issues/L67)

### Features

* **native-stack:** add support for header background image ([393773b](https://github.com/react-navigation/react-navigation/commit/393773b688247456d09f397a794eff19424502f6))
* **native-stack:** export NativeStackView to support custom routers on native-stack ([#10260](https://github.com/react-navigation/react-navigation/issues/10260)) ([7b761f1](https://github.com/react-navigation/react-navigation/commit/7b761f1cc069ca68b96b5155be726024a345346f))
* **native-stack:** expose custom header height ([#10113](https://github.com/react-navigation/react-navigation/issues/10113)) ([e93b2e9](https://github.com/react-navigation/react-navigation/commit/e93b2e9cb48b30eab895945e4da0c83324914e8b))
* pass canGoBack to headerRight ([82a1669](https://github.com/react-navigation/react-navigation/commit/82a16690973a7935939a25a66d5786955b6c8ba7))

## [6.2.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.2.4...@react-navigation/native-stack@6.2.5) (2021-10-16)

### Bug Fixes

* fix default for animationTypeForReplace to match with JS stack ([ec4c8cc](https://github.com/react-navigation/react-navigation/commit/ec4c8cc97943cde0c2f482bc2abcb20e3a074d48))

## [6.2.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.2.3...@react-navigation/native-stack@6.2.4) (2021-10-12)

**Note:** Version bump only for package @react-navigation/native-stack

## [6.2.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.2.2...@react-navigation/native-stack@6.2.3) (2021-10-09)

**Note:** Version bump only for package @react-navigation/native-stack

## [6.2.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.2.1...@react-navigation/native-stack@6.2.2) (2021-09-27)

### Bug Fixes

* fix invalid headerTintColor in native-stack ([#9972](https://github.com/react-navigation/react-navigation/issues/9972)) ([43d3211](https://github.com/react-navigation/react-navigation/commit/43d32117656800380e6d759b8b85a29c9e633e51))

## [6.2.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.2.0...@react-navigation/native-stack@6.2.1) (2021-09-26)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.2.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.1.0...@react-navigation/native-stack@6.2.0) (2021-09-26)

### Bug Fixes

* export header props for other navigators ([8475481](https://github.com/react-navigation/react-navigation/commit/84754812effd8bee576c5d9836c317889dabe11a)), closes [#9965](https://github.com/react-navigation/react-navigation/issues/9965)
* pass title style to <HeaderTtitle />. fixes [#9885](https://github.com/react-navigation/react-navigation/issues/9885) ([127e030](https://github.com/react-navigation/react-navigation/commit/127e030e03cfec9600cca0327edd159a7bb08896))
* support same styles in centered title in native stack ([77080d8](https://github.com/react-navigation/react-navigation/commit/77080d84f7632e318d061f1cc6a0a520ceaba401))

### Features

* add headerBackButtonMenuEnabled prop ([#9881](https://github.com/react-navigation/react-navigation/issues/9881)) ([c15bcfb](https://github.com/react-navigation/react-navigation/commit/c15bcfba0aeb613220118c876045bd566a675f0f)), closes [/github.com/software-mansion/react-native-screens/discussions/1071#discussioncomment-1227326](https://github.com//github.com/software-mansion/react-native-screens/discussions/1071/issues/discussioncomment-1227326)
* pass more props to header left in native-stack ([ef41211](https://github.com/react-navigation/react-navigation/commit/ef412116b1ac28262e30fdc85ca963221ae5b685))

# [6.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.6...@react-navigation/native-stack@6.1.0) (2021-08-18)

### Bug Fixes

* content container in native web stack should fill parent ([#9832](https://github.com/react-navigation/react-navigation/issues/9832)) ([ec0d113](https://github.com/react-navigation/react-navigation/commit/ec0d113eb25c39ef9defb6c7215640f44e3569ae))

### Features

* add headerTitleAlign prop in native stack. closes [#9829](https://github.com/react-navigation/react-navigation/issues/9829) ([fe692c2](https://github.com/react-navigation/react-navigation/commit/fe692c2f564f4fc72c18c19b8e5830ab69bcd58c))

## [6.0.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.5...@react-navigation/native-stack@6.0.6) (2021-08-17)

**Note:** Version bump only for package @react-navigation/native-stack

## [6.0.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.4...@react-navigation/native-stack@6.0.5) (2021-08-11)

### Bug Fixes

* fix headerTransparent not working outside stack navigator ([42c43ff](https://github.com/react-navigation/react-navigation/commit/42c43ff7617112afd223ecb323be622666c79096))

## [6.0.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.3...@react-navigation/native-stack@6.0.4) (2021-08-09)

**Note:** Version bump only for package @react-navigation/native-stack

## [6.0.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.2...@react-navigation/native-stack@6.0.3) (2021-08-07)

**Note:** Version bump only for package @react-navigation/native-stack

## [6.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.1...@react-navigation/native-stack@6.0.2) (2021-08-05)

### Bug Fixes

* fix incorrect name for headerTransparent ([1da575e](https://github.com/react-navigation/react-navigation/commit/1da575e0e74c9510d6a57d473500cf84668c3824))

## [6.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0...@react-navigation/native-stack@6.0.1) (2021-08-03)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.11...@react-navigation/native-stack@6.0.0) (2021-08-01)

### Bug Fixes

* show error when beforeRemove is used to prevent action in naive stack ([6d518a4](https://github.com/react-navigation/react-navigation/commit/6d518a46b89496f4a3bfd2da24245fe344f97290))

### Features

* add custom header option to native-stack ([1a39632](https://github.com/react-navigation/react-navigation/commit/1a3963265648e6f0672a2f49f3d647f9acfa6597))
* basic web implementation for native stack ([de84458](https://github.com/react-navigation/react-navigation/commit/de8445896021da4865089ba44e95afffbcee0919))
* expose header height in native-stack ([#9774](https://github.com/react-navigation/react-navigation/issues/9774)) ([20abccd](https://github.com/react-navigation/react-navigation/commit/20abccda0d5074f61b2beb555b881a2087d27bb0))

# [6.0.0-next.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.10...@react-navigation/native-stack@6.0.0-next.11) (2021-07-16)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.0.0-next.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.9...@react-navigation/native-stack@6.0.0-next.10) (2021-07-16)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.0.0-next.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.7...@react-navigation/native-stack@6.0.0-next.9) (2021-07-01)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.0.0-next.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.7...@react-navigation/native-stack@6.0.0-next.8) (2021-06-10)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.0.0-next.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.6...@react-navigation/native-stack@6.0.0-next.7) (2021-06-01)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.0.0-next.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.5...@react-navigation/native-stack@6.0.0-next.6) (2021-05-29)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.0.0-next.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.4...@react-navigation/native-stack@6.0.0-next.5) (2021-05-29)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.0.0-next.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.3...@react-navigation/native-stack@6.0.0-next.4) (2021-05-27)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.0.0-next.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.2...@react-navigation/native-stack@6.0.0-next.3) (2021-05-26)

### Features

* add screenListeners prop on navigators similar to screenOptions ([cde44a5](https://github.com/react-navigation/react-navigation/commit/cde44a5785444a121aa08f94af9f8fe4fc89910a))

# [6.0.0-next.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@6.0.0-next.1...@react-navigation/native-stack@6.0.0-next.2) (2021-05-25)

**Note:** Version bump only for package @react-navigation/native-stack

# [6.0.0-next.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native-stack@5.0.5...@react-navigation/native-stack@6.0.0-next.1) (2021-05-23)

### Bug Fixes

* automatically set top inset on Android in native stack ([2cb44a5](https://github.com/react-navigation/react-navigation/commit/2cb44a566315cc29243227f4289e42ee02e0aa42))

### Features

* add native-stack to repo ([#9596](https://github.com/react-navigation/react-navigation/issues/9596)) ([a55d6a8](https://github.com/react-navigation/react-navigation/commit/a55d6a8d796fa2b9f46cfcaf71f05c6d87738072))

## [5.0.5](https://github.com/react-navigation/react-navigation/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.4...@react-navigation/native-stack@5.0.5) (2020-02-14)

**Note:** Version bump only for package @react-navigation/native-stack

## [5.0.4](https://github.com/react-navigation/react-navigation/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.3...@react-navigation/native-stack@5.0.4) (2020-02-14)

**Note:** Version bump only for package @react-navigation/native-stack

## [5.0.3](https://github.com/react-navigation/react-navigation/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.2...@react-navigation/native-stack@5.0.3) (2020-02-12)

**Note:** Version bump only for package @react-navigation/native-stack

## [5.0.2](https://github.com/react-navigation/react-navigation/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.1...@react-navigation/native-stack@5.0.2) (2020-02-11)

**Note:** Version bump only for package @react-navigation/native-stack

## [5.0.1](https://github.com/react-navigation/react-navigation/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.35...@react-navigation/native-stack@5.0.1) (2020-02-10)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.35](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.34...@react-navigation/native-stack@5.0.0-alpha.35) (2020-02-04)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.34](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.33...@react-navigation/native-stack@5.0.0-alpha.34) (2020-02-04)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.33](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.32...@react-navigation/native-stack@5.0.0-alpha.33) (2020-02-03)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.32](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.29...@react-navigation/native-stack@5.0.0-alpha.32) (2020-02-02)

### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))
* screens integration on Android ([#294](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/issues/294)) ([9bfb295](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/commit/9bfb29562020c61b4d5c9bee278bcb1c7bdb8b67))
* update screens for native stack ([5411816](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/commit/54118161885738a6d20b062c7e6679f3bace8424))

# [5.0.0-alpha.30](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.29...@react-navigation/native-stack@5.0.0-alpha.30) (2020-02-02)

### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))
* screens integration on Android ([#294](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/issues/294)) ([9bfb295](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/commit/9bfb29562020c61b4d5c9bee278bcb1c7bdb8b67))
* update screens for native stack ([5411816](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/commit/54118161885738a6d20b062c7e6679f3bace8424))

# [5.0.0-alpha.29](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.28...@react-navigation/native-stack@5.0.0-alpha.29) (2020-01-24)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.28](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.27...@react-navigation/native-stack@5.0.0-alpha.28) (2020-01-23)

### Bug Fixes

* fix types for native stack ([1da4a64](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/commit/1da4a6437f4607c1d4547d26dd5068615631982e))

### Features

* emit appear and dismiss events for native stack ([f1df4a0](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/commit/f1df4a080877b3642e748a41a5ffc2da8c449a8c))
* let the navigator specify if default can be prevented ([da67e13](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/commit/da67e134d2157201360427d3c10da24f24cae7aa))

# [5.0.0-alpha.27](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.26...@react-navigation/native-stack@5.0.0-alpha.27) (2020-01-14)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.26](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.25...@react-navigation/native-stack@5.0.0-alpha.26) (2020-01-13)

### Bug Fixes

* make sure paths aren't aliased when building definitions ([65a5dac](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/commit/65a5dac2bf887f4ba081ab15bd4c9870bb15697f)), closes [#265](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/issues/265)

# [5.0.0-alpha.25](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.24...@react-navigation/native-stack@5.0.0-alpha.25) (2020-01-13)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.24](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.22...@react-navigation/native-stack@5.0.0-alpha.24) (2020-01-09)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.23](https://github.com/react-navigation/navigation-ex/tree/master/packages/native-stack/compare/@react-navigation/native-stack@5.0.0-alpha.22...@react-navigation/native-stack@5.0.0-alpha.23) (2020-01-09)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.22](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.21...@react-navigation/native-stack@5.0.0-alpha.22) (2020-01-05)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.21](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.20...@react-navigation/native-stack@5.0.0-alpha.21) (2020-01-03)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.20](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.19...@react-navigation/native-stack@5.0.0-alpha.20) (2020-01-01)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.19](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.18...@react-navigation/native-stack@5.0.0-alpha.19) (2019-12-19)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.18](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.17...@react-navigation/native-stack@5.0.0-alpha.18) (2019-12-16)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.17](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.16...@react-navigation/native-stack@5.0.0-alpha.17) (2019-12-14)

### Features

* add custom theme support ([#211](https://github.com/react-navigation/navigation-ex/issues/211)) ([00fc616](https://github.com/react-navigation/navigation-ex/commit/00fc616de0572bade8aa85052cdc8290360b1d7f))

# [5.0.0-alpha.16](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.15...@react-navigation/native-stack@5.0.0-alpha.16) (2019-12-11)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.15](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.14...@react-navigation/native-stack@5.0.0-alpha.15) (2019-12-07)

### Features

* export underlying views used to build navigators ([#191](https://github.com/react-navigation/navigation-ex/issues/191)) ([d618ab3](https://github.com/react-navigation/navigation-ex/commit/d618ab382ecc5eccbcd5faa89e76f9ed2d75f405))

# [5.0.0-alpha.14](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.13...@react-navigation/native-stack@5.0.0-alpha.14) (2019-11-20)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.13](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.12...@react-navigation/native-stack@5.0.0-alpha.13) (2019-11-17)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.12](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.11...@react-navigation/native-stack@5.0.0-alpha.12) (2019-11-10)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.11](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.10...@react-navigation/native-stack@5.0.0-alpha.11) (2019-11-08)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.10](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.9...@react-navigation/native-stack@5.0.0-alpha.10) (2019-11-04)

### Bug Fixes

* popToTop on tab press in native stack ([301c35e](https://github.com/react-navigation/navigation-ex/commit/301c35e))

# [5.0.0-alpha.9](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.8...@react-navigation/native-stack@5.0.0-alpha.9) (2019-11-04)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.8](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.7...@react-navigation/native-stack@5.0.0-alpha.8) (2019-11-02)

### Features

* add headerBackTitleVisible to navigation options in native stack ([77f29d3](https://github.com/react-navigation/navigation-ex/commit/77f29d3))

# [5.0.0-alpha.7](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.6...@react-navigation/native-stack@5.0.0-alpha.7) (2019-11-02)

### Bug Fixes

* remove top margin from screen in native stack on Android ([5cd6940](https://github.com/react-navigation/navigation-ex/commit/5cd6940))

# [5.0.0-alpha.6](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.5...@react-navigation/native-stack@5.0.0-alpha.6) (2019-10-30)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.5](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.4...@react-navigation/native-stack@5.0.0-alpha.5) (2019-10-29)

**Note:** Version bump only for package @react-navigation/native-stack

# [5.0.0-alpha.4](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.3...@react-navigation/native-stack@5.0.0-alpha.4) (2019-10-22)

### Features

* **native-stack:** add support for large title attributes ([#135](https://github.com/react-navigation/navigation-ex/issues/135)) ([6cf1a04](https://github.com/react-navigation/navigation-ex/commit/6cf1a04))

# [5.0.0-alpha.3](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.2...@react-navigation/native-stack@5.0.0-alpha.3) (2019-10-18)

### Bug Fixes

* remove top margin when header is hidden in native stack. fixes [#131](https://github.com/react-navigation/navigation-ex/issues/131) ([fb726ee](https://github.com/react-navigation/navigation-ex/commit/fb726ee))

# [5.0.0-alpha.2](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native-stack@5.0.0-alpha.1...@react-navigation/native-stack@5.0.0-alpha.2) (2019-10-18)

### Bug Fixes

* fix header font size config in native stack ([#128](https://github.com/react-navigation/navigation-ex/issues/128)) ([477c088](https://github.com/react-navigation/navigation-ex/commit/477c088))

# 5.0.0-alpha.1 (2019-10-15)

### Bug Fixes

* increase hitSlop of back button on Android ([c7da1e4](https://github.com/react-navigation/navigation-ex/commit/c7da1e4))
* update supported options for native stack ([b71f4e5](https://github.com/react-navigation/navigation-ex/commit/b71f4e5))

### Features

* initial version of native stack ([#102](https://github.com/react-navigation/navigation-ex/issues/102)) ([ba3f718](https://github.com/react-navigation/navigation-ex/commit/ba3f718))
