# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
