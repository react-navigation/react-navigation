# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.7.8](https://github.com/react-navigation/react-navigation-core/compare/@react-navigation/core@3.7.7...@react-navigation/core@3.7.8) (2020-10-02)


### Bug Fixes

* NavigationEvents subscribe events on new nav state ([#8920](https://github.com/react-navigation/react-navigation-core/issues/8920)) ([6390aac](https://github.com/react-navigation/react-navigation-core/commit/6390aacd07fd647d925dfec842a766c8aad5272f))





## [3.7.7](https://github.com/react-navigation/react-navigation-core/compare/@react-navigation/core@3.7.6...@react-navigation/core@3.7.7) (2020-09-24)

**Note:** Version bump only for package @react-navigation/core





## [3.7.6](https://github.com/react-navigation/react-navigation-core/compare/@react-navigation/core@3.7.5...@react-navigation/core@3.7.6) (2020-04-30)


### Bug Fixes

* change old docUrl to new docUrl due v5 ([e09906a](https://github.com/react-navigation/react-navigation-core/commit/e09906a4235a0fca09140923ebe7af34b50b491a))





## [3.7.5](https://github.com/react-navigation/react-navigation-core/compare/@react-navigation/core@3.7.4...@react-navigation/core@3.7.5) (2020-04-02)


### Bug Fixes

* emit refocus for child navigators ([66a4dbc](https://github.com/react-navigation/react-navigation-core/commit/66a4dbccd8e7b3cda51a1d9c7e9397dfc58d6b9e))





## [3.7.4](https://github.com/react-navigation/react-navigation-core/compare/@react-navigation/core@3.7.3...@react-navigation/core@3.7.4) (2020-03-31)


### Bug Fixes

* remove isTransitioning from SwitchRouter state ([3bec1c9](https://github.com/react-navigation/react-navigation-core/commit/3bec1c964a49136c0ead8e8ba8a8c66c556bbcba))





## [3.7.3](https://github.com/react-navigation/react-navigation-core/compare/@react-navigation/core@3.7.1...@react-navigation/core@3.7.3) (2020-03-28)


### Bug Fixes

* always emit didFocus/didBlur for root navigator ([ac98c0a](https://github.com/react-navigation/react-navigation-core/commit/ac98c0a668fe21200d0c6f62ae3043f92cc5aa7e))
* don't handle prune if there's only one route ([d2433f0](https://github.com/react-navigation/react-navigation-core/commit/d2433f0ab8f9791df8169de4ddfdeed9bc699e3e))
* emit didFocus and didBlur events based on parent's transition ([14a6538](https://github.com/react-navigation/react-navigation-core/commit/14a6538cc8e12c50d5d10722d75c9395a0a281ec))
* rework focus and blur events to make them more reliable ([cd08338](https://github.com/react-navigation/react-navigation-core/commit/cd083381866506a192f1ec842ac169f2b4277ca5)), closes [#4867](https://github.com/react-navigation/react-navigation-core/issues/4867) [#6187](https://github.com/react-navigation/react-navigation-core/issues/6187) [#6451](https://github.com/react-navigation/react-navigation-core/issues/6451) [#7628](https://github.com/react-navigation/react-navigation-core/issues/7628) [#7749](https://github.com/react-navigation/react-navigation-core/issues/7749)





## [3.7.2](https://github.com/react-navigation/react-navigation-core/compare/@react-navigation/core@3.7.1...@react-navigation/core@3.7.2) (2020-03-27)


### Bug Fixes

* don't handle prune if there's only one route ([d2433f0](https://github.com/react-navigation/react-navigation-core/commit/d2433f0ab8f9791df8169de4ddfdeed9bc699e3e))
* rework focus and blur events to make them more reliable ([cd08338](https://github.com/react-navigation/react-navigation-core/commit/cd083381866506a192f1ec842ac169f2b4277ca5)), closes [#4867](https://github.com/react-navigation/react-navigation-core/issues/4867) [#6187](https://github.com/react-navigation/react-navigation-core/issues/6187) [#6451](https://github.com/react-navigation/react-navigation-core/issues/6451) [#7628](https://github.com/react-navigation/react-navigation-core/issues/7628) [#7749](https://github.com/react-navigation/react-navigation-core/issues/7749)





## [3.7.1](https://github.com/react-navigation/react-navigation-core/compare/@react-navigation/core@3.7.0...@react-navigation/core@3.7.1) (2020-03-22)

**Note:** Version bump only for package @react-navigation/core





# [3.7.0](https://github.com/react-navigation/react-navigation-core/compare/@react-navigation/core@3.6.1...@react-navigation/core@3.7.0) (2020-03-16)


### Features

* add prune option to pop action to match v5 behaviour ([5927f42](https://github.com/react-navigation/react-navigation-core/commit/5927f4287f5e1ab106537865523daa1c03b14b47))





## [3.6.1](https://github.com/react-navigation/react-navigation-core/compare/@react-navigation/core@3.6.0...@react-navigation/core@3.6.1) (2020-02-24)


### Bug Fixes

* fix file extensions. closes [#7246](https://github.com/react-navigation/react-navigation-core/issues/7246) ([fc24ebd](https://github.com/react-navigation/react-navigation-core/commit/fc24ebd16c1010be4caaf3ead705909f283532f4))





# 3.6.0 (2020-02-24)


### Bug Fixes

* add back change to defaultNavigationOptions ([75661e7](https://github.com/react-navigation/react-navigation-core/commit/75661e761595aa01c61820784bc40324c60344ed))
* avoid error when updateNextStateHistory called with state ([f9defd5](https://github.com/react-navigation/react-navigation-core/commit/f9defd5afb171870aa015fd9c40e91adfa8ffe3b))
* don't keep descriptors for routes that have been removed ([a6872b9](https://github.com/react-navigation/react-navigation-core/commit/a6872b900af3687ab7775e639cc06eb38d65ebbb))
* don't pop routeKeyHistory when child handles back action ([#75](https://github.com/react-navigation/react-navigation-core/issues/75)) ([531dc30](https://github.com/react-navigation/react-navigation-core/commit/531dc30530d133fe37086e9ef8804da8cf1db0ae))
* drop custom history logic for isFirstRouteInParent ([#52](https://github.com/react-navigation/react-navigation-core/issues/52)) ([9434cfa](https://github.com/react-navigation/react-navigation-core/commit/9434cfa41835e7f709b505e846ee46cab7330a84))
* fix optional flag on testRegex ([#16](https://github.com/react-navigation/react-navigation-core/issues/16)) ([1501d4c](https://github.com/react-navigation/react-navigation-core/commit/1501d4cd85d04ac6187a58cc39a9aee8c97ce1ab)), closes [#15](https://github.com/react-navigation/react-navigation-core/issues/15)
* fix regression updating route object on navigation ([b5b7cb9](https://github.com/react-navigation/react-navigation-core/commit/b5b7cb91b2619faa64cb4955b5785e55fcb23af0))
* fixed Tab/SwitchRouter incorrectly switching children on "ba… ([#74](https://github.com/react-navigation/react-navigation-core/issues/74)) ([80da403](https://github.com/react-navigation/react-navigation-core/commit/80da403c61ec83deb306ce8482b8e74610a8c77f))
* getScreen getting called for each route on init ([#62](https://github.com/react-navigation/react-navigation-core/issues/62)) ([720f943](https://github.com/react-navigation/react-navigation-core/commit/720f943fcf04f841897f16bea680ec9f427a35e1))
* remove console.log ([#32](https://github.com/react-navigation/react-navigation-core/issues/32)) ([4f79a70](https://github.com/react-navigation/react-navigation-core/commit/4f79a705e585c15eec4fa39dc664e6333bb2ca19))
* update navigation prop invariant for v4 ([#84](https://github.com/react-navigation/react-navigation-core/issues/84)) ([aeb5682](https://github.com/react-navigation/react-navigation-core/commit/aeb5682693798d1eeee12e372e4a33177099c06e))
* use compiled files for react native. closes [#58](https://github.com/react-navigation/react-navigation-core/issues/58) ([d80418a](https://github.com/react-navigation/react-navigation-core/commit/d80418a2ec7532b4d3f000c3e67a96f7d8c27282))


### Features

* add a JUMP_TO action for switch ([6101d7c](https://github.com/react-navigation/react-navigation-core/commit/6101d7c1810366555a077a59f8bd375ff7dd7134))
* add theme support ([8d49ee2](https://github.com/react-navigation/react-navigation-core/commit/8d49ee27717ad8c7fb56c14fa0acbad2ae16e981))
* support string array for uriPrefix ([#66](https://github.com/react-navigation/react-navigation-core/issues/66)) ([5b1a8fe](https://github.com/react-navigation/react-navigation-core/commit/5b1a8fed6056a2487311820b325af5f0c9bdadb1))


### Reverts

* Revert "wip: removed code block that prevents event dispatch (#73)" ([b4a6810](https://github.com/react-navigation/react-navigation-core/commit/b4a6810235e302bcf05b62a0f01c30b29d06d96e)), closes [#73](https://github.com/react-navigation/react-navigation-core/issues/73)
