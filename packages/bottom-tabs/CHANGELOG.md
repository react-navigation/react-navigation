# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.0.0-alpha.3](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/bottom-tabs@5.0.0-alpha.2...@react-navigation/bottom-tabs@5.0.0-alpha.3) (2019-08-22)


### Bug Fixes

* fix path to typescript definitions ([f182315](https://github.com/react-navigation/navigation-ex/commit/f182315))





# [5.0.0-alpha.2](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/bottom-tabs@5.0.0-alpha.1...@react-navigation/bottom-tabs@5.0.0-alpha.2) (2019-08-22)

**Note:** Version bump only for package @react-navigation/bottom-tabs





# 5.0.0-alpha.1 (2019-08-21)


### Bug Fixes

* change opacity for hidden tabs only when not using rn-screens ([#80](https://github.com/react-navigation/navigation-ex/issues/80)) ([6490049](https://github.com/react-navigation/navigation-ex/commit/6490049)), closes [#5382](https://github.com/react-navigation/navigation-ex/issues/5382)
* correctly reset _isTabPress property ([80b7f1d](https://github.com/react-navigation/navigation-ex/commit/80b7f1d))
* fix hit slop for bottom tab bar ([#110](https://github.com/react-navigation/navigation-ex/issues/110)) ([ce3670b](https://github.com/react-navigation/navigation-ex/commit/ce3670b))
* fix peer deps and add git urls ([6b4fc74](https://github.com/react-navigation/navigation-ex/commit/6b4fc74))
* fix tabBarOnPress with MaterialTopTabs and fix isFocused ([#21](https://github.com/react-navigation/navigation-ex/issues/21)) ([491ee81](https://github.com/react-navigation/navigation-ex/commit/491ee81))
* import SceneView from react-navigation default export ([5d5f4d1](https://github.com/react-navigation/navigation-ex/commit/5d5f4d1))
* increase padding for iOS horizontal label alignment ([#114](https://github.com/react-navigation/navigation-ex/issues/114)) ([4adb3a9](https://github.com/react-navigation/navigation-ex/commit/4adb3a9)), closes [#113](https://github.com/react-navigation/navigation-ex/issues/113)
* iPad / horizontal layout works as expected in BottomTabBar ([3bb5ec4](https://github.com/react-navigation/navigation-ex/commit/3bb5ec4))
* NavigationActions.popToTop no longer exists, belongs to StackActions now ([273131f](https://github.com/react-navigation/navigation-ex/commit/273131f))
* remove tab icon wrapper to fix adaptive icons ([3fdb3d9](https://github.com/react-navigation/navigation-ex/commit/3fdb3d9))
* specify default values for getAccessibilityX ([3c7918d](https://github.com/react-navigation/navigation-ex/commit/3c7918d)), closes [#116](https://github.com/react-navigation/navigation-ex/issues/116)
* tweak hitSlop on bottom tab bar buttons ([a5514a2](https://github.com/react-navigation/navigation-ex/commit/a5514a2))
* typo in accessibilityLabel ([57a0d46](https://github.com/react-navigation/navigation-ex/commit/57a0d46))
* use react-lifecycles-compat for async mode compatibility ([93b45f2](https://github.com/react-navigation/navigation-ex/commit/93b45f2))
* use the JUMP_TO action for tab change ([242625a](https://github.com/react-navigation/navigation-ex/commit/242625a))


### Features

* add ability to render label beside the icon ([#103](https://github.com/react-navigation/navigation-ex/issues/103)) ([8f70ebb](https://github.com/react-navigation/navigation-ex/commit/8f70ebb))
* add accessibility role and state to bottom bar ([#90](https://github.com/react-navigation/navigation-ex/issues/90)) ([73e9b4c](https://github.com/react-navigation/navigation-ex/commit/73e9b4c))
* add accessibilityLabel and testID options ([#26](https://github.com/react-navigation/navigation-ex/issues/26)) ([4cc91d1](https://github.com/react-navigation/navigation-ex/commit/4cc91d1))
* add an option to swap out TouchableWithoutFeedback for another component ([#27](https://github.com/react-navigation/navigation-ex/issues/27)) ([34b0e5d](https://github.com/react-navigation/navigation-ex/commit/34b0e5d))
* add defaultHandler argument to tabBarOnPress. fixes [#22](https://github.com/react-navigation/navigation-ex/issues/22) ([267e9ec](https://github.com/react-navigation/navigation-ex/commit/267e9ec))
* add lazy option. fixes [#23](https://github.com/react-navigation/navigation-ex/issues/23) ([2a80c11](https://github.com/react-navigation/navigation-ex/commit/2a80c11))
* export individual navigators separately. fixes [#2](https://github.com/react-navigation/navigation-ex/issues/2) ([65b0c46](https://github.com/react-navigation/navigation-ex/commit/65b0c46))
* export tab bars ([a4ead48](https://github.com/react-navigation/navigation-ex/commit/a4ead48))
* hide tab bar when keyboard is shown ([#112](https://github.com/react-navigation/navigation-ex/issues/112)) ([ccb2d38](https://github.com/react-navigation/navigation-ex/commit/ccb2d38)), closes [#16](https://github.com/react-navigation/navigation-ex/issues/16)
* implement various navigators ([f0b80ce](https://github.com/react-navigation/navigation-ex/commit/f0b80ce))
* initial commit ([89934b9](https://github.com/react-navigation/navigation-ex/commit/89934b9))
* lazy initialized MaterialTopTabNavigator routes ([#9](https://github.com/react-navigation/navigation-ex/issues/9)) ([18fa131](https://github.com/react-navigation/navigation-ex/commit/18fa131))
* put material bottom tabs in another repository ([42e35f5](https://github.com/react-navigation/navigation-ex/commit/42e35f5))
* upgrade react-native-tab-view to 2.0 ([d8b4774](https://github.com/react-navigation/navigation-ex/commit/d8b4774))
* use resource saving view for scenes. fixes [#3](https://github.com/react-navigation/navigation-ex/issues/3) ([fd2c352](https://github.com/react-navigation/navigation-ex/commit/fd2c352))
