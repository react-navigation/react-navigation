# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.0.0-alpha.31](https://github.com/react-navigation/navigation-ex/tree/master/packages/core/compare/@react-navigation/core@5.0.0-alpha.30...@react-navigation/core@5.0.0-alpha.31) (2020-01-09)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.30](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.29...@react-navigation/core@5.0.0-alpha.30) (2020-01-01)


### Bug Fixes

* cleanup transaction even if action wasn't handled ([f462d67](https://github.com/react-navigation/navigation-ex/commit/f462d672708cabfb0477c3a48505bd194ea626fd))
* show error if an action was not handled ([0252bdc](https://github.com/react-navigation/navigation-ex/commit/0252bdc2222ebe7410a0ed593bf03b2bdf5dc7ca))





# [5.0.0-alpha.29](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.28...@react-navigation/core@5.0.0-alpha.29) (2019-12-19)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.28](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.27...@react-navigation/core@5.0.0-alpha.28) (2019-12-16)


### Bug Fixes

* use Partial type for initialParam ([#206](https://github.com/react-navigation/navigation-ex/issues/206)) ([c3d3748](https://github.com/react-navigation/navigation-ex/commit/c3d374814308b0bd6d259099444f0f24593f4d7e))


### Features

* add nested config in deep linking ([#210](https://github.com/react-navigation/navigation-ex/issues/210)) ([8002d51](https://github.com/react-navigation/navigation-ex/commit/8002d5179524a7211c37760a4ed45e8c12af4358)), closes [#154](https://github.com/react-navigation/navigation-ex/issues/154)





# [5.0.0-alpha.27](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.26...@react-navigation/core@5.0.0-alpha.27) (2019-12-10)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.26](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.25...@react-navigation/core@5.0.0-alpha.26) (2019-12-07)


### Bug Fixes

* don't handle replace if screen to replace with isn't present ([7b13a81](https://github.com/react-navigation/navigation-ex/commit/7b13a81ac8260879c8658be5704f46db59a72c73)), closes [#193](https://github.com/react-navigation/navigation-ex/issues/193)





# [5.0.0-alpha.25](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.24...@react-navigation/core@5.0.0-alpha.25) (2019-11-29)


### Bug Fixes

* wrap reset and resetRoot inside transaction ([#189](https://github.com/react-navigation/navigation-ex/issues/189)) ([5a0dfa1](https://github.com/react-navigation/navigation-ex/commit/5a0dfa1a155715714c8483fafc5a94dbc5120754)), closes [#185](https://github.com/react-navigation/navigation-ex/issues/185)





# [5.0.0-alpha.24](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.23...@react-navigation/core@5.0.0-alpha.24) (2019-11-20)


### Bug Fixes

* allow passing partial params to `setParams` ([#177](https://github.com/react-navigation/navigation-ex/issues/177)) ([c3e9e45](https://github.com/react-navigation/navigation-ex/commit/c3e9e4578e98aa5b0635949a288e19eaeec12c85))





# [5.0.0-alpha.23](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.22...@react-navigation/core@5.0.0-alpha.23) (2019-11-17)


### Bug Fixes

* merge initial params on push ([11efb06](https://github.com/react-navigation/navigation-ex/commit/11efb066429a3fc8b7e8e48d897286208d9a5449))





# [5.0.0-alpha.22](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.21...@react-navigation/core@5.0.0-alpha.22) (2019-11-10)


### Bug Fixes

* throw when containers are nested within another ([d4072e7](https://github.com/react-navigation/navigation-ex/commit/d4072e7))





# [5.0.0-alpha.21](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.20...@react-navigation/core@5.0.0-alpha.21) (2019-11-08)


### Bug Fixes

* don't crash if initialState is null ([270fbdc](https://github.com/react-navigation/navigation-ex/commit/270fbdc))
* fix types for resetRoot to accept undefined ([e871fdb](https://github.com/react-navigation/navigation-ex/commit/e871fdb))





# [5.0.0-alpha.20](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.19...@react-navigation/core@5.0.0-alpha.20) (2019-11-02)


### Bug Fixes

* pass rehydrated state in onStateChange and devtools ([5a34764](https://github.com/react-navigation/navigation-ex/commit/5a34764))





# [5.0.0-alpha.19](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.18...@react-navigation/core@5.0.0-alpha.19) (2019-10-30)


### Bug Fixes

* drop isFirstRouteInParent method ([#145](https://github.com/react-navigation/navigation-ex/issues/145)) ([3a77107](https://github.com/react-navigation/navigation-ex/commit/3a77107))





# [5.0.0-alpha.18](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.17...@react-navigation/core@5.0.0-alpha.18) (2019-10-29)


### Bug Fixes

* improve type annotation for screens ([8f16085](https://github.com/react-navigation/navigation-ex/commit/8f16085))





# [5.0.0-alpha.17](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.16...@react-navigation/core@5.0.0-alpha.17) (2019-10-22)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.16](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.15...@react-navigation/core@5.0.0-alpha.16) (2019-10-18)


### Bug Fixes

* rehydrate state before using it ([3e92e22](https://github.com/react-navigation/navigation-ex/commit/3e92e22))


### Features

* make it easier to navigate to a specific route in navigator ([#114](https://github.com/react-navigation/navigation-ex/issues/114)) ([a543f1b](https://github.com/react-navigation/navigation-ex/commit/a543f1b)), closes [#90](https://github.com/react-navigation/navigation-ex/issues/90)





# [5.0.0-alpha.15](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.14...@react-navigation/core@5.0.0-alpha.15) (2019-10-15)


### Features

* initial version of native stack ([#102](https://github.com/react-navigation/navigation-ex/issues/102)) ([ba3f718](https://github.com/react-navigation/navigation-ex/commit/ba3f718))





# [5.0.0-alpha.14](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.13...@react-navigation/core@5.0.0-alpha.14) (2019-10-06)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.13](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.12...@react-navigation/core@5.0.0-alpha.13) (2019-10-03)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.12](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.11...@react-navigation/core@5.0.0-alpha.12) (2019-10-03)


### Bug Fixes

* don't merge state with existing state during reset. fixes [#111](https://github.com/react-navigation/navigation-ex/issues/111) ([7393464](https://github.com/react-navigation/navigation-ex/commit/7393464))
* don't throw when switching navigator. fixes [#91](https://github.com/react-navigation/navigation-ex/issues/91) ([19be2b4](https://github.com/react-navigation/navigation-ex/commit/19be2b4))


### Features

* add a getRootState method ([#119](https://github.com/react-navigation/navigation-ex/issues/119)) ([7a5bcb4](https://github.com/react-navigation/navigation-ex/commit/7a5bcb4))





# [5.0.0-alpha.11](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.10...@react-navigation/core@5.0.0-alpha.11) (2019-09-27)


### Bug Fixes

* fire blur event when a route is removed with a delay ([1153d55](https://github.com/react-navigation/navigation-ex/commit/1153d55)), closes [#110](https://github.com/react-navigation/navigation-ex/issues/110)


### Features

* add a method to reset root navigator state ([e61f594](https://github.com/react-navigation/navigation-ex/commit/e61f594))





# [5.0.0-alpha.10](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.9...@react-navigation/core@5.0.0-alpha.10) (2019-09-17)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.9](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.8...@react-navigation/core@5.0.0-alpha.9) (2019-09-16)


### Features

* compatibility layer ([e0f28a4](https://github.com/react-navigation/navigation-ex/commit/e0f28a4))
* make deep link handling more flexible ([849d952](https://github.com/react-navigation/navigation-ex/commit/849d952))
* make example run as bare react-native project as well ([#85](https://github.com/react-navigation/navigation-ex/issues/85)) ([d16c20c](https://github.com/react-navigation/navigation-ex/commit/d16c20c))





# [5.0.0-alpha.8](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.7...@react-navigation/core@5.0.0-alpha.8) (2019-09-04)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.7](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.5...@react-navigation/core@5.0.0-alpha.7) (2019-08-31)


### Bug Fixes

* fix navigation object changing too often ([3c840bb](https://github.com/react-navigation/navigation-ex/commit/3c840bb))


### Features

* add useRoute ([#89](https://github.com/react-navigation/navigation-ex/issues/89)) ([b0a3756](https://github.com/react-navigation/navigation-ex/commit/b0a3756))
* support function in screenOptions ([eff0c04](https://github.com/react-navigation/navigation-ex/commit/eff0c04))





# [5.0.0-alpha.6](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.5...@react-navigation/core@5.0.0-alpha.6) (2019-08-31)


### Features

* add useRoute ([#89](https://github.com/react-navigation/navigation-ex/issues/89)) ([b0a3756](https://github.com/react-navigation/navigation-ex/commit/b0a3756))
* support function in screenOptions ([eff0c04](https://github.com/react-navigation/navigation-ex/commit/eff0c04))





# [5.0.0-alpha.5](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.4...@react-navigation/core@5.0.0-alpha.5) (2019-08-30)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.4](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.3...@react-navigation/core@5.0.0-alpha.4) (2019-08-29)


### Bug Fixes

* allow making params optional. fixes [#80](https://github.com/react-navigation/navigation-ex/issues/80) ([a9d4813](https://github.com/react-navigation/navigation-ex/commit/a9d4813))


### Features

* export NavigationContext ([9245c79](https://github.com/react-navigation/navigation-ex/commit/9245c79))
* handle navigating with both with both key and name ([#83](https://github.com/react-navigation/navigation-ex/issues/83)) ([6b75cba](https://github.com/react-navigation/navigation-ex/commit/6b75cba))





# [5.0.0-alpha.3](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.2...@react-navigation/core@5.0.0-alpha.3) (2019-08-27)


### Features

* add hook to scroll to top on tab press ([9e1104c](https://github.com/react-navigation/navigation-ex/commit/9e1104c))
* add native container ([d26b77f](https://github.com/react-navigation/navigation-ex/commit/d26b77f))





# [5.0.0-alpha.2](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/core@5.0.0-alpha.1...@react-navigation/core@5.0.0-alpha.2) (2019-08-22)


### Bug Fixes

* fix path to typescript definitions ([f182315](https://github.com/react-navigation/navigation-ex/commit/f182315))





# 5.0.0-alpha.1 (2019-08-21)


### Bug Fixes

* don't apply action to an unrelated router ([e1d7333](https://github.com/react-navigation/navigation-ex/commit/e1d7333))
* fix peer deps and add git urls ([6b4fc74](https://github.com/react-navigation/navigation-ex/commit/6b4fc74))
* handle partial initial state better when rehydrating ([8ed54da](https://github.com/react-navigation/navigation-ex/commit/8ed54da))
* implement canGoBack for tab router ([#51](https://github.com/react-navigation/navigation-ex/issues/51)) ([2b8f2ed](https://github.com/react-navigation/navigation-ex/commit/2b8f2ed))
* properly infer route type in screen elements ([7e3a2c8](https://github.com/react-navigation/navigation-ex/commit/7e3a2c8))
* throw when duplicate screens are defined ([adc2fe4](https://github.com/react-navigation/navigation-ex/commit/adc2fe4))
* use correct dispatch in methods in screen's navigation prop ([8134895](https://github.com/react-navigation/navigation-ex/commit/8134895))


### Features

* add a target key to actions and various fixes ([747ce66](https://github.com/react-navigation/navigation-ex/commit/747ce66))
* add a useIsFocused hook to get focus state ([#52](https://github.com/react-navigation/navigation-ex/issues/52)) ([2b59f7e](https://github.com/react-navigation/navigation-ex/commit/2b59f7e))
* add canGoBack ([#50](https://github.com/react-navigation/navigation-ex/issues/50)) ([e9da86e](https://github.com/react-navigation/navigation-ex/commit/e9da86e))
* add dangerouslyGetParent ([#62](https://github.com/react-navigation/navigation-ex/issues/62)) ([c0045d8](https://github.com/react-navigation/navigation-ex/commit/c0045d8))
* add dangerouslyGetState ([#63](https://github.com/react-navigation/navigation-ex/issues/63)) ([f7ff0c1](https://github.com/react-navigation/navigation-ex/commit/f7ff0c1))
* add helpers to convert between url and state ([dbe2b91](https://github.com/react-navigation/navigation-ex/commit/dbe2b91))
* add hook for deep link support ([35987ae](https://github.com/react-navigation/navigation-ex/commit/35987ae))
* add integration with redux devtools extension ([ca985bb](https://github.com/react-navigation/navigation-ex/commit/ca985bb))
* add native container with back button integration ([#48](https://github.com/react-navigation/navigation-ex/issues/48)) ([b7735af](https://github.com/react-navigation/navigation-ex/commit/b7735af))
* integrate reanimated based stack ([#42](https://github.com/react-navigation/navigation-ex/issues/42)) ([dcf57c0](https://github.com/react-navigation/navigation-ex/commit/dcf57c0))
