# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [6.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@6.0.2...@react-navigation/routers@6.1.0) (2021-10-12)


### Features

* add a `navigationKey` prop to Screen and Group ([b2fa62c](https://github.com/react-navigation/react-navigation/commit/b2fa62c8ea5c5ad40a3541a7258cba62467e7a56))





## [6.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@6.0.1...@react-navigation/routers@6.0.2) (2021-10-09)


### Bug Fixes

* properly handle history if drawer is open by default ([de2d4e4](https://github.com/react-navigation/react-navigation/commit/de2d4e4f0659fea87522b918fb09c8f07bdd0697))





## [6.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@6.0.0...@react-navigation/routers@6.0.1) (2021-08-03)


### Reverts

* Revert "fix: don't merge initial params when merge !== true" ([8086772](https://github.com/react-navigation/react-navigation/commit/80867722c5891b786e8c47f18135419b7cb915b3))





# [6.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@6.0.0-next.6...@react-navigation/routers@6.0.0) (2021-08-01)


### Bug Fixes

* don't merge initial params when merge !== true ([54b215b](https://github.com/react-navigation/react-navigation/commit/54b215b9d3192d11c4c28bd469dd217d90d6c5c5))





# [6.0.0-next.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@6.0.0-next.4...@react-navigation/routers@6.0.0-next.6) (2021-07-01)

**Note:** Version bump only for package @react-navigation/routers





# [6.0.0-next.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@6.0.0-next.4...@react-navigation/routers@6.0.0-next.5) (2021-06-10)

**Note:** Version bump only for package @react-navigation/routers





# [6.0.0-next.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@6.0.0-next.3...@react-navigation/routers@6.0.0-next.4) (2021-05-27)

**Note:** Version bump only for package @react-navigation/routers





# [6.0.0-next.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@6.0.0-next.2...@react-navigation/routers@6.0.0-next.3) (2021-05-23)

**Note:** Version bump only for package @react-navigation/routers





# [6.0.0-next.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@6.0.0-next.1...@react-navigation/routers@6.0.0-next.2) (2021-04-08)

**Note:** Version bump only for package @react-navigation/routers





# [6.0.0-next.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@6.0.0...@react-navigation/routers@6.0.0-next.1) (2021-03-10)

**Note:** Version bump only for package @react-navigation/routers





# [6.0.0-next.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.6.2...@react-navigation/routers@6.0.0-next.0) (2021-03-09)


### Bug Fixes

* default to backBehavior: firstRoute for TabRouter ([8bdc6c6](https://github.com/react-navigation/react-navigation/commit/8bdc6c6b9bc957a00a01eec2fcf6f971998c9380))
* don't merge params on navigation ([366d018](https://github.com/react-navigation/react-navigation/commit/366d0181dc02597b8d11e343f37fc77bee164c70))
* fix getId being called for incorrect routes. closes [#9343](https://github.com/react-navigation/react-navigation/issues/9343) ([61e653d](https://github.com/react-navigation/react-navigation/commit/61e653d7c484e8ff09045e8635cce4f566a141b4))
* fix StackRouter incorrectly handling invalid route if key is present ([3367ddf](https://github.com/react-navigation/react-navigation/commit/3367ddf9df5696c2b596deee7342040b8ea50763))


### Code Refactoring

* don't use a boolean for drawer status ([cda6397](https://github.com/react-navigation/react-navigation/commit/cda6397b8989c552824eca4175577527c9d72f93))


### Features

* add a new backBehavior: firstRoute for TabRouter ([7c1cd26](https://github.com/react-navigation/react-navigation/commit/7c1cd261bfe70f14294daa598a5c72c777c911d3))
* add a way to specify an unique ID for screens ([15b8bb3](https://github.com/react-navigation/react-navigation/commit/15b8bb34584db3cb166f6aafd45f0b95f14fde62))
* add pressColor and pressOpacity props to drawerItem ([#8834](https://github.com/react-navigation/react-navigation/issues/8834)) ([52dbe4b](https://github.com/react-navigation/react-navigation/commit/52dbe4bd6663430745b07ea379d44d4d4f2944a0))
* associate path with the route it opens when deep linking ([#9384](https://github.com/react-navigation/react-navigation/issues/9384)) ([86e64fd](https://github.com/react-navigation/react-navigation/commit/86e64fdcd81a57cf3f3bdab4c9035b52984e7009)), closes [#9102](https://github.com/react-navigation/react-navigation/issues/9102)


### BREAKING CHANGES

* Drawer status is now a union ('open', 'closed') instead of a boolean. This will let us implement more types of status in future.

Following this the following exports have been renamed as well:
- getIsDrawerOpenFromState -> getDrawerStatusFromState
- useIsDrawerOpen -> useDrawerStatus
* Returning to first route after pressing back seems more common in apps. This commit changes the default for tab and drawer navigators to follow this common practice. To preserve previous behavior, you can pass backBehavior=history to tab and drawer navigators.
* Previous versions of React Navigation merged params on navigation which caused confusion. This commit changes params not to be merged.

The old behaviour can still be achieved by passing `merge: true` explicitly:

```js
CommonActions.navigate({
  name: 'bar',
  params: { fruit: 'orange' },
  merge: true,
})
```
`initialParams` specified for the screen are always merged.





## [5.6.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.6.1...@react-navigation/routers@5.6.2) (2020-11-09)

**Note:** Version bump only for package @react-navigation/routers





## [5.6.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.6.0...@react-navigation/routers@5.6.1) (2020-11-08)

**Note:** Version bump only for package @react-navigation/routers





# [5.6.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.5.1...@react-navigation/routers@5.6.0) (2020-11-04)


### Features

* add a merge option to navigate to control merging params ([9beca3a](https://github.com/react-navigation/react-navigation/commit/9beca3a8027c6e2135dbef2abb8eede6b0b4bc44))





## [5.5.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.5.0...@react-navigation/routers@5.5.1) (2020-10-28)


### Bug Fixes

* improve types for route prop in screenOptions ([d26bcc0](https://github.com/react-navigation/react-navigation/commit/d26bcc057ef31f8950f909adf83e263171a42d74))





# [5.5.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.4.12...@react-navigation/routers@5.5.0) (2020-10-24)


### Bug Fixes

* handle pushing a route with duplicate key ([091b2a2](https://github.com/react-navigation/react-navigation/commit/091b2a2038af1097be57a1bb451623d64a1efc92))


### Features

* allow deep linking to reset state ([#8973](https://github.com/react-navigation/react-navigation/issues/8973)) ([7f3b27a](https://github.com/react-navigation/react-navigation/commit/7f3b27a9ec8edd9604ac19774baa1f60963ccdc9)), closes [#8952](https://github.com/react-navigation/react-navigation/issues/8952)
* improve types for navigation state ([#8980](https://github.com/react-navigation/react-navigation/issues/8980)) ([7dc2f58](https://github.com/react-navigation/react-navigation/commit/7dc2f5832e371473f3263c01ab39824eb9e2057d))





## [5.4.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.4.11...@react-navigation/routers@5.4.12) (2020-09-22)

**Note:** Version bump only for package @react-navigation/routers





## [5.4.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.4.10...@react-navigation/routers@5.4.11) (2020-08-04)

**Note:** Version bump only for package @react-navigation/routers





## [5.4.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.4.9...@react-navigation/routers@5.4.10) (2020-07-28)


### Bug Fixes

* make sure history is correct after rehydration ([b70e3fe](https://github.com/react-navigation/react-navigation/commit/b70e3fe61852502322b2cb46c5934800462b0267))
* make sure index is correct when rehydrating state for tabs ([#8638](https://github.com/react-navigation/react-navigation/issues/8638)) ([1aa8219](https://github.com/react-navigation/react-navigation/commit/1aa8219021f6c231a3e150fc9bea73f12542f85c))





## [5.4.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.4.8...@react-navigation/routers@5.4.9) (2020-07-10)


### Bug Fixes

* mark some types as read-only ([7c3a0a0](https://github.com/react-navigation/react-navigation/commit/7c3a0a0f23629da0beb956ba5a9689ab965061ce))
* only remove non-existed routes from tab history. closes [#8567](https://github.com/react-navigation/react-navigation/issues/8567) ([374b081](https://github.com/react-navigation/react-navigation/commit/374b081b1c4b2e590259a050430eb1fcdbad3557))





## [5.4.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/routers@5.4.7...@react-navigation/routers@5.4.8) (2020-06-24)


### Bug Fixes

* more improvements to types ([d244488](https://github.com/react-navigation/react-navigation/commit/d2444887be227bbbdcfcb13a7f26a8ebb344043e))





## [5.4.7](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.4.6...@react-navigation/routers@5.4.7) (2020-05-23)

**Note:** Version bump only for package @react-navigation/routers





## [5.4.6](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.4.5...@react-navigation/routers@5.4.6) (2020-05-20)

**Note:** Version bump only for package @react-navigation/routers





## [5.4.5](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.4.4...@react-navigation/routers@5.4.5) (2020-05-20)

**Note:** Version bump only for package @react-navigation/routers





## [5.4.4](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.4.3...@react-navigation/routers@5.4.4) (2020-05-08)


### Bug Fixes

* fix building typescript definitions. closes [#8216](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/issues/8216) ([47a1229](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/47a12298378747edd2d22e54dc1c8677f98c49b4))





## [5.4.3](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.4.2...@react-navigation/routers@5.4.3) (2020-05-08)

**Note:** Version bump only for package @react-navigation/routers





## [5.4.2](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.4.1...@react-navigation/routers@5.4.2) (2020-04-30)


### Bug Fixes

* fix backBehavior with initialRoute ([#8110](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/issues/8110)) ([420f692](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/420f6926e111d32c2388c44ff0bee2b8ea238a57))





## [5.4.1](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.4.0...@react-navigation/routers@5.4.1) (2020-04-27)


### Bug Fixes

* fix behaviour of openByDefault in drawer when focus changes ([b172b51](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/b172b51f175a9f8044cb2a8e9d74a86480d8f11e))





# [5.4.0](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.3.0...@react-navigation/routers@5.4.0) (2020-04-17)


### Features

* add openByDefault option to drawer ([36689e2](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/36689e24c21b474692bb7ecd0b901c8afbbe9a20))





# [5.3.0](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.2.1...@react-navigation/routers@5.3.0) (2020-04-08)


### Bug Fixes

* separate normal exports and type exports ([303f0b7](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/303f0b78a5ab717b2d606cd9c8a22f3dae051f0f))


### Features

* make replace bubble up ([ba1f405](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/ba1f4051299ad86001592b8d3601c16fece159df))





## [5.2.1](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.2.0...@react-navigation/routers@5.2.1) (2020-03-30)

**Note:** Version bump only for package @react-navigation/routers





# [5.2.0](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.1.1...@react-navigation/routers@5.2.0) (2020-03-22)


### Features

* add keys to routes missing keys during reset ([813a590](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/813a5903b5f44506b9097538ed85229e565b855e))





## [5.1.1](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.1.0...@react-navigation/routers@5.1.1) (2020-03-16)


### Bug Fixes

* don't handle action if no routes are present ([660cac3](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/660cac3557bce8978812ce2750e961e7ada92d13))





# [5.1.0](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.3...@react-navigation/routers@5.1.0) (2020-03-03)


### Bug Fixes

* fix links for documentation ([5bb0f40](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/5bb0f405ceb5755d39a0b5b1f2e4ecee0da051bc))


### Features

* make reset bubble up ([09f6808](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/09f6808d7d43c70b2c502151f9f20fad03972886))





## [5.0.3](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.2...@react-navigation/routers@5.0.3) (2020-02-26)

**Note:** Version bump only for package @react-navigation/routers





## [5.0.2](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.1...@react-navigation/routers@5.0.2) (2020-02-21)


### Bug Fixes

* tweak error message for navigate ([c8ea419](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/c8ea4199f4b19a58d5e409cfcc96e587fe354a9a))





## [5.0.1](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.33...@react-navigation/routers@5.0.1) (2020-02-10)


### Bug Fixes

* merge initial params on replace ([80629bf](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/80629bf30baf8f17620e6d3127e00376182af074))





# [5.0.0-alpha.33](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.32...@react-navigation/routers@5.0.0-alpha.33) (2020-02-04)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.32](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.31...@react-navigation/routers@5.0.0-alpha.32) (2020-02-04)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.31](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.30...@react-navigation/routers@5.0.0-alpha.31) (2020-02-03)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.30](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.27...@react-navigation/routers@5.0.0-alpha.30) (2020-02-02)


### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))





# [5.0.0-alpha.28](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.27...@react-navigation/routers@5.0.0-alpha.28) (2020-02-02)


### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))





# [5.0.0-alpha.27](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.26...@react-navigation/routers@5.0.0-alpha.27) (2020-01-24)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.26](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.25...@react-navigation/routers@5.0.0-alpha.26) (2020-01-23)


### Bug Fixes

* handle popping more than available screens in stack ([68ed8a7](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/68ed8a725950f39228847ab10b3dd7f3ebd2e2dc))





# [5.0.0-alpha.25](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.24...@react-navigation/routers@5.0.0-alpha.25) (2020-01-14)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.24](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.23...@react-navigation/routers@5.0.0-alpha.24) (2020-01-13)


### Bug Fixes

* make sure paths aren't aliased when building definitions ([65a5dac](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/65a5dac2bf887f4ba081ab15bd4c9870bb15697f)), closes [#265](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/issues/265)





# [5.0.0-alpha.23](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.22...@react-navigation/routers@5.0.0-alpha.23) (2020-01-13)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.22](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.20...@react-navigation/routers@5.0.0-alpha.22) (2020-01-09)


### Bug Fixes

* change POP behaviour to remove elements from index only ([7a3d652](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/7a3d652e847e173964a06cc9d859129ca0317861)), closes [#256](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/issues/256)





# [5.0.0-alpha.21](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/compare/@react-navigation/routers@5.0.0-alpha.20...@react-navigation/routers@5.0.0-alpha.21) (2020-01-09)


### Bug Fixes

* change POP behaviour to remove elements from index only ([7a3d652](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/commit/7a3d652e847e173964a06cc9d859129ca0317861)), closes [#256](https://github.com/react-navigation/react-navigation/tree/main/packages/routers/issues/256)





# [5.0.0-alpha.20](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.19...@react-navigation/routers@5.0.0-alpha.20) (2020-01-05)


### Bug Fixes

* preserve focused route in tab on changing screens list ([adbeb29](https://github.com/react-navigation/navigation-ex/commit/adbeb292f522be8d7a58dd3f84e560a6d83d01a8))





# [5.0.0-alpha.19](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.18...@react-navigation/routers@5.0.0-alpha.19) (2020-01-01)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.18](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.17...@react-navigation/routers@5.0.0-alpha.18) (2019-12-19)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.17](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.16...@react-navigation/routers@5.0.0-alpha.17) (2019-12-16)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.16](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.15...@react-navigation/routers@5.0.0-alpha.16) (2019-12-11)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.15](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.14...@react-navigation/routers@5.0.0-alpha.15) (2019-11-17)


### Bug Fixes

* merge initial params on push ([11efb06](https://github.com/react-navigation/navigation-ex/commit/11efb066429a3fc8b7e8e48d897286208d9a5449))





# [5.0.0-alpha.14](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.13...@react-navigation/routers@5.0.0-alpha.14) (2019-11-10)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.13](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.12...@react-navigation/routers@5.0.0-alpha.13) (2019-11-08)


### Bug Fixes

* handle invalid initialRouteName gracefully ([b5d9ad9](https://github.com/react-navigation/navigation-ex/commit/b5d9ad9))





# [5.0.0-alpha.12](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.11...@react-navigation/routers@5.0.0-alpha.12) (2019-11-04)


### Bug Fixes

* close drawer on back button press ([3a4c38b](https://github.com/react-navigation/navigation-ex/commit/3a4c38b))





# [5.0.0-alpha.11](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.10...@react-navigation/routers@5.0.0-alpha.11) (2019-10-30)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.10](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.9...@react-navigation/routers@5.0.0-alpha.10) (2019-10-29)


### Bug Fixes

* use index of first route when rehydrating tab state ([7635373](https://github.com/react-navigation/navigation-ex/commit/7635373))





# [5.0.0-alpha.9](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.8...@react-navigation/routers@5.0.0-alpha.9) (2019-10-03)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.8](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.7...@react-navigation/routers@5.0.0-alpha.8) (2019-09-27)


### Bug Fixes

* close drawer on navigate ([655a220](https://github.com/react-navigation/navigation-ex/commit/655a220))





# [5.0.0-alpha.7](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.6...@react-navigation/routers@5.0.0-alpha.7) (2019-08-31)


### Bug Fixes

* handle route names change when all routes are removed ([#86](https://github.com/react-navigation/navigation-ex/issues/86)) ([1b2983e](https://github.com/react-navigation/navigation-ex/commit/1b2983e))





# [5.0.0-alpha.6](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.5...@react-navigation/routers@5.0.0-alpha.6) (2019-08-29)


### Features

* handle navigating with both with both key and name ([#83](https://github.com/react-navigation/navigation-ex/issues/83)) ([6b75cba](https://github.com/react-navigation/navigation-ex/commit/6b75cba))





# [5.0.0-alpha.5](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.4...@react-navigation/routers@5.0.0-alpha.5) (2019-08-28)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.4](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.3...@react-navigation/routers@5.0.0-alpha.4) (2019-08-27)

**Note:** Version bump only for package @react-navigation/routers





# [5.0.0-alpha.3](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.2...@react-navigation/routers@5.0.0-alpha.3) (2019-08-22)


### Bug Fixes

* fix path to typescript definitions ([f182315](https://github.com/react-navigation/navigation-ex/commit/f182315))





# [5.0.0-alpha.2](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/routers@5.0.0-alpha.1...@react-navigation/routers@5.0.0-alpha.2) (2019-08-22)


### Bug Fixes

* properly handle pop action from stack ([61dce7a](https://github.com/react-navigation/navigation-ex/commit/61dce7a))





# 5.0.0-alpha.1 (2019-08-21)


### Bug Fixes

* don't lose child state when rehydrating in tab router ([5676dea](https://github.com/react-navigation/navigation-ex/commit/5676dea))
* don't use action.source for stack router ([afa24c1](https://github.com/react-navigation/navigation-ex/commit/afa24c1))
* fix peer deps and add git urls ([6b4fc74](https://github.com/react-navigation/navigation-ex/commit/6b4fc74))
* handle partial initial state better when rehydrating ([8ed54da](https://github.com/react-navigation/navigation-ex/commit/8ed54da))
* implement canGoBack for tab router ([#51](https://github.com/react-navigation/navigation-ex/issues/51)) ([2b8f2ed](https://github.com/react-navigation/navigation-ex/commit/2b8f2ed))


### Features

* add a simple stack and material tabs integration ([#39](https://github.com/react-navigation/navigation-ex/issues/39)) ([e0bee10](https://github.com/react-navigation/navigation-ex/commit/e0bee10))
* add a target key to actions and various fixes ([747ce66](https://github.com/react-navigation/navigation-ex/commit/747ce66))
* add canGoBack ([#50](https://github.com/react-navigation/navigation-ex/issues/50)) ([e9da86e](https://github.com/react-navigation/navigation-ex/commit/e9da86e))
* add drawer navigator integration ([#43](https://github.com/react-navigation/navigation-ex/issues/43)) ([d02277b](https://github.com/react-navigation/navigation-ex/commit/d02277b))
* add hook for deep link support ([35987ae](https://github.com/react-navigation/navigation-ex/commit/35987ae))
* integrate reanimated based stack ([#42](https://github.com/react-navigation/navigation-ex/issues/42)) ([dcf57c0](https://github.com/react-navigation/navigation-ex/commit/dcf57c0))
