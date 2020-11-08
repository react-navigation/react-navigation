# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.14.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.14.0...@react-navigation/core@5.14.1) (2020-11-08)


### Bug Fixes

* tweak error message when navigator has non-screen children ([360b0e9](https://github.com/react-navigation/react-navigation/commit/360b0e995835990c55b75898757ebdd120d52446))





# [5.14.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.13.5...@react-navigation/core@5.14.0) (2020-11-04)


### Bug Fixes

* always respect key in the route object when generating action ([cb2e744](https://github.com/react-navigation/react-navigation/commit/cb2e744dcebf7f71ddaa5462d393a6dbfd971fcd))


### Features

* add a NavigatorScreenParams type. closes [#6931](https://github.com/react-navigation/react-navigation/issues/6931) ([e3e58c2](https://github.com/react-navigation/react-navigation/commit/e3e58c2d890e7fab75d78371e349aea55a402fcd))
* add warning on accessing the state object on route prop ([ec7b02a](https://github.com/react-navigation/react-navigation/commit/ec7b02af2ca835122b9000799e2366d7009da6e3))





## [5.13.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.13.4...@react-navigation/core@5.13.5) (2020-11-04)


### Bug Fixes

* don't use use-subscription to avoid peer dep related errors ([66f3a4a](https://github.com/react-navigation/react-navigation/commit/66f3a4a0bb39475434668bc94fb1750dbe618ee0)), closes [/github.com/react-navigation/react-navigation/issues/9021#issuecomment-721679760](https://github.com//github.com/react-navigation/react-navigation/issues/9021/issues/issuecomment-721679760)
* use useDebugValue in more places ([b20f2d1](https://github.com/react-navigation/react-navigation/commit/b20f2d1f7ccb82db70df9cddf5746557912daa99))





## [5.13.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.13.3...@react-navigation/core@5.13.4) (2020-11-03)


### Bug Fixes

* fix nested navigation not working the first time ([ebc7f9e](https://github.com/react-navigation/react-navigation/commit/ebc7f9ea75bbf6e3b6303027cfa023d7c97342ff))





## [5.13.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.13.2...@react-navigation/core@5.13.3) (2020-11-03)


### Bug Fixes

* handle navigating to same screen again for nested screens ([0945689](https://github.com/react-navigation/react-navigation/commit/0945689b70d71a4b5d766c61d57009761c460bf6))





## [5.13.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.13.1...@react-navigation/core@5.13.2) (2020-10-30)


### Bug Fixes

* fix params from for the root screen when creating action ([e8515f9](https://github.com/react-navigation/react-navigation/commit/e8515f9cd94a912c107a407dea3d953c4172393f)), closes [#9006](https://github.com/react-navigation/react-navigation/issues/9006)
* trim routes if an index is specified in state ([fb7ac96](https://github.com/react-navigation/react-navigation/commit/fb7ac960c8e1ffca200ecb12696ce5531a139e50))





## [5.13.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.13.0...@react-navigation/core@5.13.1) (2020-10-28)


### Bug Fixes

* improve types for route prop in screenOptions ([d26bcc0](https://github.com/react-navigation/react-navigation/commit/d26bcc057ef31f8950f909adf83e263171a42d74))





# [5.13.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.12.5...@react-navigation/core@5.13.0) (2020-10-24)


### Bug Fixes

* fix imports from query-string. closes [#8971](https://github.com/react-navigation/react-navigation/issues/8971) ([#8976](https://github.com/react-navigation/react-navigation/issues/8976)) ([261a33a](https://github.com/react-navigation/react-navigation/commit/261a33a0d03150c87b06f01aeace4926b1c03eb6))


### Features

* add an unhandled action listener ([#8895](https://github.com/react-navigation/react-navigation/issues/8895)) ([80ff5a9](https://github.com/react-navigation/react-navigation/commit/80ff5a9c543a44fa2fd7ba7fda0598f1b0d52a64))
* allow deep linking to reset state ([#8973](https://github.com/react-navigation/react-navigation/issues/8973)) ([7f3b27a](https://github.com/react-navigation/react-navigation/commit/7f3b27a9ec8edd9604ac19774baa1f60963ccdc9)), closes [#8952](https://github.com/react-navigation/react-navigation/issues/8952)
* improve types for navigation state ([#8980](https://github.com/react-navigation/react-navigation/issues/8980)) ([7dc2f58](https://github.com/react-navigation/react-navigation/commit/7dc2f5832e371473f3263c01ab39824eb9e2057d))
* update helper types to have navigator specific methods ([f51086e](https://github.com/react-navigation/react-navigation/commit/f51086edea42f2382dac8c6914aac8574132114b))





## [5.12.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.12.4...@react-navigation/core@5.12.5) (2020-10-07)

**Note:** Version bump only for package @react-navigation/core





## [5.12.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.12.3...@react-navigation/core@5.12.4) (2020-09-22)


### Bug Fixes

* typo in logic of getStateFromPath ([#8868](https://github.com/react-navigation/react-navigation/issues/8868)) ([97c215d](https://github.com/react-navigation/react-navigation/commit/97c215d2f2ea9f6bbade7503348827c5b6dc4186))





## [5.12.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.12.2...@react-navigation/core@5.12.3) (2020-08-04)

**Note:** Version bump only for package @react-navigation/core





## [5.12.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.12.1...@react-navigation/core@5.12.2) (2020-07-28)

**Note:** Version bump only for package @react-navigation/core





## [5.12.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.12.0...@react-navigation/core@5.12.1) (2020-07-19)


### Bug Fixes

* make sure new state events are emitted when new navigators mount ([af8b274](https://github.com/react-navigation/react-navigation/commit/af8b27414c8628570d946003f4fdff3341cb8954))





# [5.12.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.11.1...@react-navigation/core@5.12.0) (2020-07-10)


### Bug Fixes

* avoid error setting warning for devtools migration. closes [#8534](https://github.com/react-navigation/react-navigation/issues/8534) ([1801a13](https://github.com/react-navigation/react-navigation/commit/1801a13323eff149fb6bc4e3c3f12422b401f178))
* fix bubbling actions to correct target when specified ([9671c76](https://github.com/react-navigation/react-navigation/commit/9671c76c5121aaa64a956e2ca696b2f1712cd6f4))
* fix options event being emitted incorrectly ([#8559](https://github.com/react-navigation/react-navigation/issues/8559)) ([a255e35](https://github.com/react-navigation/react-navigation/commit/a255e350f9a54c6d8e410167c9c8661e70b23779))
* improve the warning message for non-serializable values ([e63580e](https://github.com/react-navigation/react-navigation/commit/e63580edbef8e77239f3dbefc919d1a41723eff1))
* mark some types as read-only ([7c3a0a0](https://github.com/react-navigation/react-navigation/commit/7c3a0a0f23629da0beb956ba5a9689ab965061ce))


### Features

* add a `beforeRemove` event ([6925e92](https://github.com/react-navigation/react-navigation/commit/6925e92dc3e9885e3f552ca5e5eb51ae1521e54e))
* add a getComponent prop to lazily specify components ([f418029](https://github.com/react-navigation/react-navigation/commit/f4180295bf22e32c65f6a7ab7089523cb2de58fb))





## [5.11.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.11.0...@react-navigation/core@5.11.1) (2020-06-25)


### Bug Fixes

* fix error with type definitions. closes [#8511](https://github.com/react-navigation/react-navigation/issues/8511) ([d1210a8](https://github.com/react-navigation/react-navigation/commit/d1210a861b37201827c333a5c012c4f0ebd9bb6a))





# [5.11.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.10.0...@react-navigation/core@5.11.0) (2020-06-24)


### Bug Fixes

* fix getCurrentOptions for nested screens ([6730690](https://github.com/react-navigation/react-navigation/commit/67306905299314bda053e553ded228374e3e23c9))
* fix getCurrentOptions for nested screens ([afc83ee](https://github.com/react-navigation/react-navigation/commit/afc83eedf8c308c958a08900e069948e3d8a6aa1))
* more improvements to types ([d244488](https://github.com/react-navigation/react-navigation/commit/d2444887be227bbbdcfcb13a7f26a8ebb344043e))


### Features

* add devtools package ([#8436](https://github.com/react-navigation/react-navigation/issues/8436)) ([95b044e](https://github.com/react-navigation/react-navigation/commit/95b044ecf95939f40ced4da740a365140b3952b7))
* add event for options on container ([#8334](https://github.com/react-navigation/react-navigation/issues/8334)) ([fe3f98e](https://github.com/react-navigation/react-navigation/commit/fe3f98eb9cdd986c32460b78520b4d3d2435c279))
* add helper to get focused route name from nested state ([#8435](https://github.com/react-navigation/react-navigation/issues/8435)) ([f51f9c8](https://github.com/react-navigation/react-navigation/commit/f51f9c8493e079f73688adaf9dc43a2171c3e44a))
* rework linking configuration to be more strict ([#8502](https://github.com/react-navigation/react-navigation/issues/8502)) ([a021cfb](https://github.com/react-navigation/react-navigation/commit/a021cfb8af4afd50f785f6ee9b51d361e25704ca))





# [5.10.0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.9.0...@react-navigation/core@5.10.0) (2020-06-06)


### Bug Fixes

* catch missing params when they are required in navigate ([#8389](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8389)) ([8774ca9](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/8774ca97e1da91e97677ecd816c85f66af296b93))
* make sure the wildcard pattern catches nested unmatched routes ([c3bd349](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/c3bd349d77688011c9c55027edd66c6f39de2ade))
* only use the query params for focused route in path ([2d66ef9](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/2d66ef93ec9923a452415c482c40e7c6b769917c))
* prevent state change being emitted unnecessarily ([ab1f79c](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/ab1f79c096e94475a4da1acf1c850d04fb1bc4cf))


### Features

* add wildcard patterns for paths ([4fe72e3](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/4fe72e3ce7bae9120d04e490401f3bad58ebdf5c)), closes [#8019](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8019)





# [5.9.0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.8.2...@react-navigation/core@5.9.0) (2020-05-27)


### Features

* add ref to get current options in `ServerContainer` ([#8333](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8333)) ([0b1a718](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/0b1a718756e208d84b20e45ca56004332308ad54))





## [5.8.2](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.8.1...@react-navigation/core@5.8.2) (2020-05-23)

**Note:** Version bump only for package @react-navigation/core





## [5.8.1](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.8.0...@react-navigation/core@5.8.1) (2020-05-20)

**Note:** Version bump only for package @react-navigation/core





# [5.8.0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.7.0...@react-navigation/core@5.8.0) (2020-05-20)


### Features

* add getCurrentOptions ([#8277](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8277)) ([d024ec6](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/d024ec6d74dffe481ce6fde732c729e20c1668f4))
* add getCurrentRoute ([#8254](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8254)) ([7b25c8e](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/7b25c8eb2e6f96128fd86b92615346ce55bedeca))





# [5.7.0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.6.1...@react-navigation/core@5.7.0) (2020-05-16)


### Bug Fixes

* don't use Object.fromEntries ([51f4d11](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/51f4d11fdf4bd2bb06f8cd4094f051816590e62c))


### Features

* add a PathConfig type ([60cb3c9](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/60cb3c9ba76d7ef166c9fe8b55f23728975b5b6e))





## [5.6.1](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.6.0...@react-navigation/core@5.6.1) (2020-05-14)


### Bug Fixes

* don't use flat since it's not supported in node ([21b397f](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/21b397f0d6b96ec4875d3172f47533130bb08009))





# [5.6.0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.5.2...@react-navigation/core@5.6.0) (2020-05-14)


### Bug Fixes

* ignore extra slashes in the pattern ([3c47716](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/3c47716826d0dfa69dfa6112141c116723372ea1))
* ignore state updates when we're not mounted ([0149e85](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/0149e85a95b90c6a9d487fa753ddbf5d01c03e3d)), closes [#8226](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8226)


### Features

* merge path patterns for nested screens ([#8253](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8253)) ([acc9646](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/acc9646426fee53558d686dfbe5fd0e35361d8c0))





## [5.5.2](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.5.1...@react-navigation/core@5.5.2) (2020-05-08)


### Bug Fixes

* fix building typescript definitions. closes [#8216](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8216) ([47a1229](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/47a12298378747edd2d22e54dc1c8677f98c49b4))





## [5.5.1](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.5.0...@react-navigation/core@5.5.1) (2020-05-08)


### Bug Fixes

* avoid cleaning up state when a new navigator is mounted. fixes [#8195](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8195) ([f6d0676](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/f6d06768d3c36d1f5beaffcb660f3c259209f2e7))





# [5.5.0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.4.0...@react-navigation/core@5.5.0) (2020-05-05)


### Features

* add support for optional params to linking ([#8196](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8196)) ([fcd1cc6](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/fcd1cc64c151e4941f3f544a54b5048d853821f6))
* support params anywhere in path segement ([#8184](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/8184)) ([3999fc2](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/3999fc28365c3a06a17d963c7be7fb7e897f99e0))





# [5.4.0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.3.5...@react-navigation/core@5.4.0) (2020-04-30)


### Bug Fixes

* handle empty paths when parsing ([c3fa83e](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/c3fa83efe0d73db76365f8be3d6a8ca1d1289b71))
* parsing url ([bd35b4f](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/bd35b4fc202c3868fb75c3675b62de67557089e1))


### Features

* add `useLinkBuilder` hook to build links ([2792f43](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/2792f438fe45428fe193e3708fee7ad61966cbf4))





## [5.3.5](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.3.4...@react-navigation/core@5.3.5) (2020-04-27)


### Bug Fixes

* add config to enable redux devtools integration ([c9c825b](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/c9c825bee61426635a28ee149eeeff3d628171cd))





## [5.3.4](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.3.3...@react-navigation/core@5.3.4) (2020-04-17)


### Bug Fixes

* add initial option for navigating to nested navigators ([004c7d7](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/004c7d7ab1f80faf04b2a1836ec6b79a5419e45f))
* add initial param for actions from deep link ([a3f7a5f](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/a3f7a5feba2e6aa2158aeaea6cde73ae1603173e))
* handle initial: false for nested route after first initialization ([187aefe](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/187aefe9c400b499f920c212bf856414e25c5aaf))





## [5.3.3](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.3.2...@react-navigation/core@5.3.3) (2020-04-08)


### Bug Fixes

* switch order of focus and blur events. closes [#7963](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/7963) ([ce3994c](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/ce3994c82c28669d5742017eb7627e9adf996933))
* workaround warning about setState in another component in render ([d4fd906](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/d4fd906915cc20d6fb21508384c05a540d8644d8))





## [5.3.2](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.3.1...@react-navigation/core@5.3.2) (2020-03-30)


### Bug Fixes

* handle no path property and undefined query params ([#7911](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/7911)) ([cd47915](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/cd47915861a56cd7eaa9ac79f5139cde56ca95a7))





## [5.3.1](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.3.0...@react-navigation/core@5.3.1) (2020-03-23)


### Bug Fixes

* don't emit events for screens that don't exist anymore ([1c00142](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/1c001424b595b40f9db9343096c833f75353b099))
* only call listeners for focused screen for global events ([3096de6](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/3096de62868a7ed9ed65e529c8ddfa001b9be486))





# [5.3.0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.2.3...@react-navigation/core@5.3.0) (2020-03-22)


### Bug Fixes

* return correct value for isFocused after changing screens ([5b15c71](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/5b15c7164f5503f2f0d51006a3f23bd0c58fd9b7)), closes [#7843](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/7843)


### Features

* support function in listeners prop ([3709e65](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/3709e652f41a16c2c2b05d5dbbe1da2017ba2c3f))





## [5.2.3](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.2.2...@react-navigation/core@5.2.3) (2020-03-19)

**Note:** Version bump only for package @react-navigation/core





## [5.2.2](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.2.1...@react-navigation/core@5.2.2) (2020-03-16)

**Note:** Version bump only for package @react-navigation/core





## [5.2.1](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.2.0...@react-navigation/core@5.2.1) (2020-03-03)


### Bug Fixes

* fix links for documentation ([5bb0f40](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/5bb0f405ceb5755d39a0b5b1f2e4ecee0da051bc))
* move updating state to useEffect ([2dfa4f3](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/2dfa4f36293a2acb718814f6b2fa79d7c7ddf09c))





# [5.2.0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.1.6...@react-navigation/core@5.2.0) (2020-02-26)


### Features

* add ability add listeners with listeners prop ([1624108](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/162410843c4f175ae107756de1c3af04d1d47aa7)), closes [#6756](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/6756)





## [5.1.6](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.1.5...@react-navigation/core@5.1.6) (2020-02-21)


### Bug Fixes

* avoid emitting focus events twice ([f167008](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/f16700812f3757713b04ca3a860209795b4a6c44)), closes [#6749](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/6749)
* preserve screen order with numeric names ([125bd70](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/125bd70e49b708d936a2eee72ba5cb92eacf26a9)), closes [#6900](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/6900)





## [5.1.5](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.1.4...@react-navigation/core@5.1.5) (2020-02-19)


### Bug Fixes

* show descriptive error for invalid return for useFocusEffect ([1a28c29](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/1a28c299b5e3f0805eb6e9ea3cf5e9cc90c7a280))





## [5.1.4](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.1.3...@react-navigation/core@5.1.4) (2020-02-14)


### Bug Fixes

* link to migration guide on invalid usage ([c5fcfbd](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/c5fcfbd4277541e131acbaa7602a5d7e636afebb))
* return '/' for empty paths ([aaf01e0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/aaf01e01e7b47b375f68aebe6d0effe82878d060))





## [5.1.3](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.1.2...@react-navigation/core@5.1.3) (2020-02-14)


### Bug Fixes

* return false for canGoBack if navigator hasn't finished mounting ([c8ac5fa](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/c8ac5fab61cf127985431075a3c59c1f3dfa42da))
* throw a descriptive error if navigation object hasn't initialized ([b6accd0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/b6accd03f69dd438e595094d8bf8599cc12e71ac))
* update links in error messages ([f964200](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/f964200b0dcbc19d5f88ad2dd1eb8e5576973497))





## [5.1.2](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.1.1...@react-navigation/core@5.1.2) (2020-02-12)


### Bug Fixes

* fix false positives for circular object check ([030c63c](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/030c63c89fe447aa484b767831c8f8e26e90431c)), closes [#6827](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/6827)
* static container memo check ([#6825](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/6825)) ([2bf0958](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/2bf09585021470f500d967e9242836840efe970f))





## [5.1.1](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.1.0...@react-navigation/core@5.1.1) (2020-02-11)


### Bug Fixes

* don't cleanup state on switching navigator ([359ae1b](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/359ae1bfacec5ef880b3944f465c881aedb16767))





# [5.1.0](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.43...@react-navigation/core@5.1.0) (2020-02-10)


### Bug Fixes

* add some links in the error messages ([13b4e07](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/13b4e07348496f7cb516d625b44a6a7d310ef9af))


### Features

* support ignoring empty path strings ([#349](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/349)) ([61b1134](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/61b1134f90310390fe819622c1f33273fca0bd42))





# [5.0.0-alpha.43](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.42...@react-navigation/core@5.0.0-alpha.43) (2020-02-04)


### Bug Fixes

* improve error message for unhandled action ([ca4a360](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/ca4a36070a21c4fe86cb1cc55a4452dca293f215))


### Features

* add initialRouteName property to config ([#322](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/322)) ([4ca5cc6](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/4ca5cc632992187f12870281e4cf4c7d1f799967))





# [5.0.0-alpha.42](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.41...@react-navigation/core@5.0.0-alpha.42) (2020-02-04)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.41](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.40...@react-navigation/core@5.0.0-alpha.41) (2020-02-03)


### Bug Fixes

* ignore circular references when checking serializable ([e5063b9](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/e5063b93398350511f3fd2ef48425559f871781f))





# [5.0.0-alpha.40](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.37...@react-navigation/core@5.0.0-alpha.40) (2020-02-02)


### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))
* add warning when passing inline function to component prop ([fa4a959](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/fa4a959549ccd9dc2f9bd2ea495e99abdedc9f94))
* tweak error messages for validation ([2243b45](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/2243b45cc1addf83727166d82736d214f181b1fb))


### Features

* add `screens` prop for nested configs ([#308](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/308)) ([b931ae6](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/b931ae62dfb2c5253c94ea5ace73e9070ec17c4a))
* add useIsDrawerOpen hook ([#299](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/299)) ([ecd68af](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/ecd68afb46a4c56200748da5e5fb284fa5a839db))
* integrate with history API on web ([5a3f835](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/5a3f8356b05bff7ed20893a5db6804612da3e568))





# [5.0.0-alpha.38](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.37...@react-navigation/core@5.0.0-alpha.38) (2020-02-02)


### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))
* add warning when passing inline function to component prop ([fa4a959](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/fa4a959549ccd9dc2f9bd2ea495e99abdedc9f94))
* tweak error messages for validation ([2243b45](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/2243b45cc1addf83727166d82736d214f181b1fb))


### Features

* add `screens` prop for nested configs ([#308](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/308)) ([b931ae6](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/b931ae62dfb2c5253c94ea5ace73e9070ec17c4a))
* add useIsDrawerOpen hook ([#299](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/299)) ([ecd68af](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/ecd68afb46a4c56200748da5e5fb284fa5a839db))
* integrate with history API on web ([5a3f835](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/5a3f8356b05bff7ed20893a5db6804612da3e568))





# [5.0.0-alpha.37](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.36...@react-navigation/core@5.0.0-alpha.37) (2020-01-24)


### Bug Fixes

* add error message when trying to use v4 API with v5 ([179e807](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/179e807a64a7d031d671c2c4b12edaee3c3440c5))
* validate screen configs ([2f1f0af](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/2f1f0af862ef8625da4c2aaf463d45fe17a4ac88))
* warn if non-serializable values found in state ([5751e7f](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/5751e7f97a1731a5c71862174dfd931b6ffe13e2))





# [5.0.0-alpha.36](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.35...@react-navigation/core@5.0.0-alpha.36) (2020-01-23)


### Bug Fixes

* disallow canPreventDefault option if not present in types ([d9059b5](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/d9059b56d8a89b39fec43d38a7b0514d41c0b550))
* don't add ?if query params is empty ([3bf5ddd](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/3bf5ddde2ac1ba45f1123752d37532175f18a3d9))
* fix types for useFocusEffect ([23ab45a](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/23ab45aceb72cc27ebfacdedfbf60d0c540fecfb)), closes [#270](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/270)
* make sure that we return correct value if selector changes ([6c2acbb](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/6c2acbb304a9f11789b45a410b6c41911eca3947)), closes [/github.com/react-navigation/navigation-ex/pull/273#issuecomment-576581225](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/issuecomment-576581225)
* use protected for private value store ([ad4eaff](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/ad4eaff1e99e4f9fca3a193764fd0f26efa41341))


### Features

* add useNavigationState hook ([32a2206](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/32a2206513bc084d8da07187385d11db498f1e2a))
* let the navigator specify if default can be prevented ([da67e13](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/da67e134d2157201360427d3c10da24f24cae7aa))
* support nested config in getPathFromState ([#266](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/266)) ([1e53821](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/1e53821d52be182369add07a86c72221c5dba53e))





# [5.0.0-alpha.35](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.34...@react-navigation/core@5.0.0-alpha.35) (2020-01-14)


### Bug Fixes

* fix intellisense for CompositeNavigationProp ([a912323](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/a912323c1dfa0c3564ca82c448a86f85d1658f7f))





# [5.0.0-alpha.34](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.33...@react-navigation/core@5.0.0-alpha.34) (2020-01-13)


### Bug Fixes

* make sure paths aren't aliased when building definitions ([65a5dac](https://github.com/react-navigation/react-navigation/tree/main/packages/core/commit/65a5dac2bf887f4ba081ab15bd4c9870bb15697f)), closes [#265](https://github.com/react-navigation/react-navigation/tree/main/packages/core/issues/265)





# [5.0.0-alpha.33](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.32...@react-navigation/core@5.0.0-alpha.33) (2020-01-13)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.32](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.30...@react-navigation/core@5.0.0-alpha.32) (2020-01-09)

**Note:** Version bump only for package @react-navigation/core





# [5.0.0-alpha.31](https://github.com/react-navigation/react-navigation/tree/main/packages/core/compare/@react-navigation/core@5.0.0-alpha.30...@react-navigation/core@5.0.0-alpha.31) (2020-01-09)

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
