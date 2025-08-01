# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [7.12.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.12.3...@react-navigation/core@7.12.4) (2025-08-02)

### Bug Fixes

* use useEffect for useNavigationState so all listeners get notified ([4e18b8f](https://github.com/react-navigation/react-navigation/commit/4e18b8fd3e4ac5c2ac1b4d72db48bbfa2b764b4a)) - by @satya164

## [7.12.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.12.2...@react-navigation/core@7.12.3) (2025-07-26)

### Bug Fixes

* crash when path contains emoji ([#12679](https://github.com/react-navigation/react-navigation/issues/12679)) ([8123808](https://github.com/react-navigation/react-navigation/commit/81238086397eab1137ee8f0df246f8ea812a61c4)) - by @bernhardoj
* remove production check in useRouteCache ([#12686](https://github.com/react-navigation/react-navigation/issues/12686)) ([c492234](https://github.com/react-navigation/react-navigation/commit/c492234a61431d36bde6c7d9cc86dbc4ccd1ff93)) - by @Ubax
* use Object.is for equality checks ([13231ae](https://github.com/react-navigation/react-navigation/commit/13231ae7c72af707a2da113c7dde8ddc79e9308b)) - by @satya164

## [7.12.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.12.1...@react-navigation/core@7.12.2) (2025-07-25)

### Bug Fixes

* don't generate empty path if initial route already has a path ([4306ddd](https://github.com/react-navigation/react-navigation/commit/4306ddd754f1b554d9d8bed6056db528f9e2329b)) - by @satya164

## [7.12.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.12.0...@react-navigation/core@7.12.1) (2025-06-21)

### Bug Fixes

* fix error message for useNavigationState ([8740ae0](https://github.com/react-navigation/react-navigation/commit/8740ae0f495a2e55dd05ce3e4da6f35cc13a1e1f)) - by @satya164

# [7.12.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.11.0...@react-navigation/core@7.12.0) (2025-06-19)

### Bug Fixes

* remove .native extension in core for ESM compat ([93e5a83](https://github.com/react-navigation/react-navigation/commit/93e5a83319fb0f41485f9f86c5cb46af5057235f)) - by @

### Features

* make useNavigationState work in navigator level, e.g. layouts ([ba6be7d](https://github.com/react-navigation/react-navigation/commit/ba6be7d73a9805df29b7e00559caa292ccca6532)) - by @

# [7.11.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.10.1...@react-navigation/core@7.11.0) (2025-06-18)

### Features

* support merging params when navigating to nested navigator ([7754c15](https://github.com/react-navigation/react-navigation/commit/7754c153122ccfaff353da36efaa2a78d92cc1e5)) - by @satya164

## [7.10.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.10.0...@react-navigation/core@7.10.1) (2025-06-14)

### Bug Fixes

* remove non-existed method from navigation type ([8d2b1ec](https://github.com/react-navigation/react-navigation/commit/8d2b1ec3b56f6769c8bb0cba4d14b1802337ded8)) - by @satya164

# [7.10.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.9.2...@react-navigation/core@7.10.0) (2025-05-30)

### Features

* add a REPLACE_PARAMS action ([9739421](https://github.com/react-navigation/react-navigation/commit/97394212d88ccfc464db850b8a95d129befa5c80)) - by @satya164

## [7.9.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.9.1...@react-navigation/core@7.9.2) (2025-05-11)

### Bug Fixes

* add PRELOAD to unhandled error message ([bfa7ac1](https://github.com/react-navigation/react-navigation/commit/bfa7ac121424d24fb80c3d422db2e1771d28cde6)) - by @satya164

## [7.9.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.9.0...@react-navigation/core@7.9.1) (2025-05-04)

**Note:** Version bump only for package @react-navigation/core

# [7.9.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.8.5...@react-navigation/core@7.9.0) (2025-05-02)

### Features

* add `options` parameter to `layout` and `screenLayout` ([#12551](https://github.com/react-navigation/react-navigation/issues/12551)) ([68e2c92](https://github.com/react-navigation/react-navigation/commit/68e2c92ec7c5a99337eb7a184f98100260cd7c6c)) - by @Bram-dc

## [7.8.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.8.4...@react-navigation/core@7.8.5) (2025-04-08)

### Bug Fixes

* add types field back to support legacy moduleResolution ([6c021d4](https://github.com/react-navigation/react-navigation/commit/6c021d442ede3a231e32486b2c391c2e850bf76e)), closes [#12534](https://github.com/react-navigation/react-navigation/issues/12534) - by @

## [7.8.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.8.3...@react-navigation/core@7.8.4) (2025-04-04)

### Bug Fixes

* drop commonjs module to avoid dual package hazard ([f0fbcc5](https://github.com/react-navigation/react-navigation/commit/f0fbcc5515e73b454f607bd95bba40a48e852d0f)) - by @satya164

## [7.8.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.8.2...@react-navigation/core@7.8.3) (2025-04-03)

### Bug Fixes

* don't add undefined to path for optional params. fixes [#12528](https://github.com/react-navigation/react-navigation/issues/12528) ([76e995a](https://github.com/react-navigation/react-navigation/commit/76e995af30fbf63ea3461b975c52e9790adb9fe2)) - by @

## [7.8.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.8.1...@react-navigation/core@7.8.2) (2025-04-02)

### Bug Fixes

* make buildHref work inside route context ([a52efa1](https://github.com/react-navigation/react-navigation/commit/a52efa1334b8f1f2efe89def964f432895dadc6d)) - by @

## [7.8.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.8.0...@react-navigation/core@7.8.1) (2025-04-02)

**Note:** Version bump only for package @react-navigation/core

# [7.8.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.7.0...@react-navigation/core@7.8.0) (2025-04-01)

### Bug Fixes

* always create link regardless of linking enabled status ([d242d73](https://github.com/react-navigation/react-navigation/commit/d242d731bfcc1f3951d920f1dc30502409a62e4c)) - by @
* handle POP_TO in navigation action error ([2b45b9e](https://github.com/react-navigation/react-navigation/commit/2b45b9ea943fb40a74158836c24b1023163a4895)) - by @satya164

### Features

* add an API to get a minimal state to build a path ([1320931](https://github.com/react-navigation/react-navigation/commit/1320931d3cd02c8bfe2a9493b4ec18c870be4f22)) - by @

# [7.7.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.6.1...@react-navigation/core@7.7.0) (2025-03-25)

### Features

* add ready event to the container ref ([24de3d8](https://github.com/react-navigation/react-navigation/commit/24de3d81508d67422298cbf2e18793f23b872419)) - by @

## [7.6.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.6.0...@react-navigation/core@7.6.1) (2025-03-22)

### Bug Fixes

* fix JSX and useScrollToTop types for React 19 compatibility ([#12501](https://github.com/react-navigation/react-navigation/issues/12501)) ([4a7dfe1](https://github.com/react-navigation/react-navigation/commit/4a7dfe1f9b6dac66ea0651bf69dc9f5835dcd838)), closes [#12468](https://github.com/react-navigation/react-navigation/issues/12468) - by @teaualune

# [7.6.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.5.0...@react-navigation/core@7.6.0) (2025-03-19)

### Bug Fixes

* revert types for screen & params pair ([154b90c](https://github.com/react-navigation/react-navigation/commit/154b90cd86d4231b6f1d68738f22541c18d5f9df)), closes [/github.com/react-navigation/react-navigation/commit/a528b9b407dbaeaac0caae8edcb5b3c6840144fa#diff-9c2709d8522a6b9ec9697dd54c966da28deee393cc5effe69b47fdf93a2dbc5](https://github.com//github.com/react-navigation/react-navigation/commit/a528b9b407dbaeaac0caae8edcb5b3c6840144fa/issues/diff-9c2709d8522a6b9ec9697dd54c966da28deee393cc5effe69b47fdf93a2dbc5) [#12372](https://github.com/react-navigation/react-navigation/issues/12372) - by @satya164

### Features

* add pop option to navigate ([af19493](https://github.com/react-navigation/react-navigation/commit/af1949312d752849bfa72a708880e43fdcfab575)) - by @satya164

# [7.5.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.4.0...@react-navigation/core@7.5.0) (2025-03-19)

### Bug Fixes

* don't freeze objects in params ([881b97f](https://github.com/react-navigation/react-navigation/commit/881b97fe42720a5c71493ff450a1e47c1c43c81c)) - by @satya164

### Features

* add an option to override router in navigators ([5f201ee](https://github.com/react-navigation/react-navigation/commit/5f201ee435f887e655457c3aa1a81cbeb392ba05)) - by @

# [7.4.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.3.1...@react-navigation/core@7.4.0) (2025-03-02)

### Bug Fixes

* pop for deep links to screens containing navigators ([05d2d97](https://github.com/react-navigation/react-navigation/commit/05d2d97157ac1abf17957ee402634aa651b053ba)) - by @satya164

### Features

* add a pop option to navigate ([492237d](https://github.com/react-navigation/react-navigation/commit/492237d4a5ac2c3a3095a9a429bb1a440260301a)) - by @satya164

## [7.3.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.3.0...@react-navigation/core@7.3.1) (2024-12-12)

### Bug Fixes

* align path normalization behavior in static config ([b70823f](https://github.com/react-navigation/react-navigation/commit/b70823fa58ea36217534e646f172516665b684a0)) - by @satya164
* flush state updates before `setPreventRemove` called ([#12335](https://github.com/react-navigation/react-navigation/issues/12335)) ([70e9a2f](https://github.com/react-navigation/react-navigation/commit/70e9a2f2fc0e4e652bf219ed249bb3e1894c1c5f)), closes [/github.com/react-navigation/react-navigation/blob/2a745c8c598f95fcec5bbf5442045478d4046663/packages/core/src/PreventRemoveProvider.tsx#L69-L71](https://github.com//github.com/react-navigation/react-navigation/blob/2a745c8c598f95fcec5bbf5442045478d4046663/packages/core/src/PreventRemoveProvider.tsx/issues/L69-L71) [/github.com/react-navigation/react-navigation/blob/2a745c8c598f95fcec5bbf5442045478d4046663/packages/core/src/useScheduleUpdate.tsx#L11-L21](https://github.com//github.com/react-navigation/react-navigation/blob/2a745c8c598f95fcec5bbf5442045478d4046663/packages/core/src/useScheduleUpdate.tsx/issues/L11-L21) [/github.com/react-navigation/react-navigation/blob/fd2dda1bc43804f1a4c1cb9ee2739b39e8163210/packages/core/src/useSyncState.tsx#L43-L51](https://github.com//github.com/react-navigation/react-navigation/blob/fd2dda1bc43804f1a4c1cb9ee2739b39e8163210/packages/core/src/useSyncState.tsx/issues/L43-L51) [/github.com/react-navigation/react-navigation/blob/2a745c8c598f95fcec5bbf5442045478d4046663/packages/core/src/PreventRemoveProvider.tsx#L65-L67](https://github.com//github.com/react-navigation/react-navigation/blob/2a745c8c598f95fcec5bbf5442045478d4046663/packages/core/src/PreventRemoveProvider.tsx/issues/L65-L67) - by @andrejpavlovic
* nanoid vulberable version ([#12328](https://github.com/react-navigation/react-navigation/issues/12328)) ([2a745c8](https://github.com/react-navigation/react-navigation/commit/2a745c8c598f95fcec5bbf5442045478d4046663)) - by @khushilms

# [7.3.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.2.2...@react-navigation/core@7.3.0) (2024-12-02)

### Bug Fixes

* allow : inside of a regex for linking path ([cf610ef](https://github.com/react-navigation/react-navigation/commit/cf610ef532c5f6d08bd6e28bfd58578d66893b0a)) - by @satya164

### Features

* add support for alias in linking config ([bf1184c](https://github.com/react-navigation/react-navigation/commit/bf1184c3c5f1f5c907195c53c3b0c30e5f3b9634)) - by @

## [7.2.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.2.1...@react-navigation/core@7.2.2) (2024-12-01)

### Bug Fixes

* fix priority of matching wildcard path ([ff21b7e](https://github.com/react-navigation/react-navigation/commit/ff21b7ecdc1d0c3de68c589aac409e49ecc6e44c)) - by @

## [7.2.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.2.0...@react-navigation/core@7.2.1) (2024-12-01)

### Bug Fixes

* prioritize segements without param ([f68767c](https://github.com/react-navigation/react-navigation/commit/f68767cff386f70971a3289c61d3a70bd8afdc9f)) - by @

# [7.2.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.1.2...@react-navigation/core@7.2.0) (2024-12-01)

### Bug Fixes

* make sure paths start with a slash. fixes [#12163](https://github.com/react-navigation/react-navigation/issues/12163) ([e89ae7a](https://github.com/react-navigation/react-navigation/commit/e89ae7a25dcf5cf5c1c0447e3835dacf66e39e53)) - by @satya164

### Features

* add support for regex to linking config ([cf7c16e](https://github.com/react-navigation/react-navigation/commit/cf7c16e789b70704a393fe605273c4444f833bd3)) - by @satya164

## [7.1.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.1.1...@react-navigation/core@7.1.2) (2024-11-28)

### Bug Fixes

* fix initial screen detection being skipped if parent has empty path ([8717bcf](https://github.com/react-navigation/react-navigation/commit/8717bcf1c77a6e3889cf82c81528049f0e283bfc)) - by @satya164

## [7.1.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.1.0...@react-navigation/core@7.1.1) (2024-11-27)

### Bug Fixes

* fix initial screen detection if empty path is already present ([f3ae7a9](https://github.com/react-navigation/react-navigation/commit/f3ae7a94f152208c9ba83d7fa80a23a09bb8a9e3)) - by @satya164
* fix linking.enable: auto not working with only groups ([1129071](https://github.com/react-navigation/react-navigation/commit/1129071c6f406d89138dff6154335f18bac8b6d7)) - by @satya164

# [7.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.6...@react-navigation/core@7.1.0) (2024-11-26)

### Features

* add merge as third param to navigate and update tests ([b8bdd01](https://github.com/react-navigation/react-navigation/commit/b8bdd019b9e9381f7ae060eb3dd291b3bac3c4b7)) - by @

## [7.0.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.5...@react-navigation/core@7.0.6) (2024-11-25)

### Bug Fixes

* fix getState returning outdated state when handling action ([1489a81](https://github.com/react-navigation/react-navigation/commit/1489a8160d5eabba9320d57d5c5a0bd3b5463ce5)), closes [#672735](https://github.com/react-navigation/react-navigation/issues/672735) - by @

## [7.0.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.4...@react-navigation/core@7.0.5) (2024-11-25)

### Bug Fixes

* fix incorrect dep array when clearing state ([5a6988b](https://github.com/react-navigation/react-navigation/commit/5a6988b4408919ac1cbb0316ddea678120917bd6)), closes [#12296](https://github.com/react-navigation/react-navigation/issues/12296) - by @

## [7.0.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.3...@react-navigation/core@7.0.4) (2024-11-22)

### Bug Fixes

* revert back to how updates were scheduled in 6.x ([fac89e8](https://github.com/react-navigation/react-navigation/commit/fac89e823ca15bc9068799cae3732237d6343e88)), closes [#12283](https://github.com/react-navigation/react-navigation/issues/12283) - by @

## [7.0.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.2...@react-navigation/core@7.0.3) (2024-11-15)

### Bug Fixes

* batch and schedule updates to run them in correct order ([751f470](https://github.com/react-navigation/react-navigation/commit/751f4704daff4ddcc22d142081a51f4560efae10)), closes [#12262](https://github.com/react-navigation/react-navigation/issues/12262) [#12252](https://github.com/react-navigation/react-navigation/issues/12252) - by @
* fix navigator trying to handle params with screens or state again ([#12264](https://github.com/react-navigation/react-navigation/issues/12264)) ([6349b51](https://github.com/react-navigation/react-navigation/commit/6349b51d4904efd25d40ac1d85f3b927a92c83ac)), closes [#12259](https://github.com/react-navigation/react-navigation/issues/12259) - by @satya164

## [7.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.1...@react-navigation/core@7.0.2) (2024-11-14)

**Note:** Version bump only for package @react-navigation/core

## [7.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0...@react-navigation/core@7.0.1) (2024-11-13)

### Bug Fixes

* fix tearing of useNavigationState & useIsFocused on route names change ([d051fa9](https://github.com/react-navigation/react-navigation/commit/d051fa9a505729b9970a17ae2b9597fc796c0923)), closes [#12116](https://github.com/react-navigation/react-navigation/issues/12116) - by @

# [7.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.15...@react-navigation/core@7.0.0) (2024-11-06)

**Note:** Version bump only for package @react-navigation/core

# [7.0.0-rc.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.14...@react-navigation/core@7.0.0-rc.15) (2024-10-11)

**Note:** Version bump only for package @react-navigation/core

# [7.0.0-rc.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.13...@react-navigation/core@7.0.0-rc.14) (2024-09-08)

### Bug Fixes

* improve error message when navigating with invalid screen name ([9f2c310](https://github.com/react-navigation/react-navigation/commit/9f2c31020a7f39494de4b22d2fb591273ece1fd3)) - by @satya164

# [7.0.0-rc.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.12...@react-navigation/core@7.0.0-rc.13) (2024-08-07)

### Bug Fixes

* improve how navigate and other methods are typed ([#12093](https://github.com/react-navigation/react-navigation/issues/12093)) ([a528b9b](https://github.com/react-navigation/react-navigation/commit/a528b9b407dbaeaac0caae8edcb5b3c6840144fa)) - by @satya164

# [7.0.0-rc.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.11...@react-navigation/core@7.0.0-rc.12) (2024-08-05)

### Bug Fixes

* allow undefined in path config validation ([#12085](https://github.com/react-navigation/react-navigation/issues/12085)) ([4f20056](https://github.com/react-navigation/react-navigation/commit/4f2005621e3cacdbf9871b5cdbee3d992e67ae04)) - by @janicduplessis

# [7.0.0-rc.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.10...@react-navigation/core@7.0.0-rc.11) (2024-08-01)

**Note:** Version bump only for package @react-navigation/core

# [7.0.0-rc.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.9...@react-navigation/core@7.0.0-rc.10) (2024-07-11)

### Bug Fixes

* upgrade react-native-builder-bob ([1575287](https://github.com/react-navigation/react-navigation/commit/1575287d40fadb97f33eb19c2914d8be3066b47a)) - by @

# [7.0.0-rc.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.8...@react-navigation/core@7.0.0-rc.9) (2024-07-11)

### Bug Fixes

* preserve order when reading screens and groups ([4a928f9](https://github.com/react-navigation/react-navigation/commit/4a928f943da8ecbcb6658d7c2ccebefd7816c6bd)) - by @

# [7.0.0-rc.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.7...@react-navigation/core@7.0.0-rc.8) (2024-07-10)

### Bug Fixes

* bump use-latest-callback to fix require ([40ddae9](https://github.com/react-navigation/react-navigation/commit/40ddae95fbbf84ff47f3447eef50ed9ddb66cab8)) - by @satya164

# [7.0.0-rc.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.6...@react-navigation/core@7.0.0-rc.7) (2024-07-07)

### Bug Fixes

* upgrade use-latest-callback for esm compat ([187d41b](https://github.com/react-navigation/react-navigation/commit/187d41b3a139fe2a075a7809c0c4088cbd2fafdb)) - by @satya164

# [7.0.0-rc.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.5...@react-navigation/core@7.0.0-rc.6) (2024-07-04)

### Bug Fixes

* fix published files ([829caa0](https://github.com/react-navigation/react-navigation/commit/829caa019e125811eea5213fd380e8e1bdbe7030)) - by @

# [7.0.0-rc.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.4...@react-navigation/core@7.0.0-rc.5) (2024-07-04)

**Note:** Version bump only for package @react-navigation/core

# [7.0.0-rc.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.3...@react-navigation/core@7.0.0-rc.4) (2024-07-04)

### Features

* add package.json exports field ([1435cfe](https://github.com/react-navigation/react-navigation/commit/1435cfe3300767c221ebd4613479ad662d61efee)) - by @

# [7.0.0-rc.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.2...@react-navigation/core@7.0.0-rc.3) (2024-07-01)

### Bug Fixes

* stop using react-native field in package.json ([efc33cb](https://github.com/react-navigation/react-navigation/commit/efc33cb0c4830a84ceae034dc1278c54f1faf32d)) - by @

# [7.0.0-rc.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.1...@react-navigation/core@7.0.0-rc.2) (2024-06-29)

### Bug Fixes

* add a workaround for incorrect inference [#12041](https://github.com/react-navigation/react-navigation/issues/12041) ([85c4bbb](https://github.com/react-navigation/react-navigation/commit/85c4bbbf535cde2ba9cd537a2a5ce34f060d32b9)) - by @
* fix type error with listeners for static config ([54437e2](https://github.com/react-navigation/react-navigation/commit/54437e29aa81c34e2cb3ea1de45e182eac74cfb4)) - by @satya164

# [7.0.0-rc.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-rc.0...@react-navigation/core@7.0.0-rc.1) (2024-06-28)

### Features

* make NavigationContainerRef.getCurrentRoute type safe ([#11525](https://github.com/react-navigation/react-navigation/issues/11525)) ([9bedc0c](https://github.com/react-navigation/react-navigation/commit/9bedc0cc29287689881e43aa88de9ef9fe853109)) - by @lucasloisp

# [7.0.0-rc.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.17...@react-navigation/core@7.0.0-rc.0) (2024-06-27)

### Bug Fixes

* throw proper error if invalid initialRouteName is passed ([e86f3b4](https://github.com/react-navigation/react-navigation/commit/e86f3b4ece709c1b0c51a0bc722a5b87931ab5a9)) - by @satya164

# [7.0.0-alpha.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.16...@react-navigation/core@7.0.0-alpha.17) (2024-03-22)

### Bug Fixes

* accept partial linking.config for static navigation ([3825046](https://github.com/react-navigation/react-navigation/commit/3825046a2320b721b7458dcc5441807bf57ea091)) - by @satya164

### Features

* add automatic home screen detection for auto linking ([b0bec6f](https://github.com/react-navigation/react-navigation/commit/b0bec6fb3eda83f145d123f02fb2096fa2300658)) - by @satya164

# [7.0.0-alpha.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.15...@react-navigation/core@7.0.0-alpha.16) (2024-03-22)

### Features

* add a way to automatically generate linking config ([d090836](https://github.com/react-navigation/react-navigation/commit/d090836f34bee659f4ea08176d6840703ef7247f)) - by @satya164
* automatically enable linking if any config is specified ([c91d247](https://github.com/react-navigation/react-navigation/commit/c91d247e62d8b30d8f55abff784df81616e70580)) - by @satya164

# [7.0.0-alpha.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.14...@react-navigation/core@7.0.0-alpha.15) (2024-03-20)

### Bug Fixes

* only replace trailing slash on decode ([#11899](https://github.com/react-navigation/react-navigation/issues/11899)) ([31bb8a1](https://github.com/react-navigation/react-navigation/commit/31bb8a1d7d4bd7eddfff6a5f9f552951f5fc6caa)) - by @cranberyxl

### Features

* add getStateForRouteNamesChange to all navigators and mark it as unstable ([4edbb07](https://github.com/react-navigation/react-navigation/commit/4edbb071163742b60499178271fd3e3e92fb4002)) - by @satya164

# [7.0.0-alpha.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.13...@react-navigation/core@7.0.0-alpha.14) (2024-03-14)

### Features

* automatically infer types for navigation in options, listeners etc. ([#11883](https://github.com/react-navigation/react-navigation/issues/11883)) ([c54baf1](https://github.com/react-navigation/react-navigation/commit/c54baf14640e567be10cb8a5f68e5cbf0b35f120)) - by @satya164

# [7.0.0-alpha.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.12...@react-navigation/core@7.0.0-alpha.13) (2024-03-10)

### Features

* deep freeze state to avoid issues due to mutation ([2a5721b](https://github.com/react-navigation/react-navigation/commit/2a5721b3a3560b76192d3aa46a4ea3be9a50db7d)) - by @satya164

# [7.0.0-alpha.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.11...@react-navigation/core@7.0.0-alpha.12) (2024-03-09)

### Bug Fixes

* fix handling groups with linking config and types ([a847715](https://github.com/react-navigation/react-navigation/commit/a84771541f97cc207d0529ecffd5980da342096a)) - by @satya164
* fix incomplete types for screen listeners ([5f0e2aa](https://github.com/react-navigation/react-navigation/commit/5f0e2aa8dfbb662a6ec8ce9fba54f89aedb8703f)), closes [#11293](https://github.com/react-navigation/react-navigation/issues/11293) - by @satya164

# [7.0.0-alpha.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.10...@react-navigation/core@7.0.0-alpha.11) (2024-03-08)

### Bug Fixes

* adjust URL encoding to avoid encoding unnecessarily ([#11867](https://github.com/react-navigation/react-navigation/issues/11867)) ([7991ce8](https://github.com/react-navigation/react-navigation/commit/7991ce8fd17e0823287ecc0eed7c0efb1ac4869e)) - by @groot007
* fix navigation not working in strict mode ([11dbba9](https://github.com/react-navigation/react-navigation/commit/11dbba92ce6f91b3664ae3c856ab1ad67f333030)) - by @satya164
* handle conflicting nested path params for linking ([#11849](https://github.com/react-navigation/react-navigation/issues/11849)) ([aeaadd6](https://github.com/react-navigation/react-navigation/commit/aeaadd63349216a1fb1bc3cfb4ba4a5f33ad2c5a)) - by @rexfordessilfie
* linking on initial path plus wildcard ([#11844](https://github.com/react-navigation/react-navigation/issues/11844)) ([2c2881f](https://github.com/react-navigation/react-navigation/commit/2c2881fde0a188e2cf4480f7ecf00e6b07e5d07f)), closes [/github.com/react-navigation/react-navigation/blob/fe4d4289e2bdec7614c6f2e5ca95d9b8f714af39/packages/core/src/getStateFromPath.tsx#L138](https://github.com//github.com/react-navigation/react-navigation/blob/fe4d4289e2bdec7614c6f2e5ca95d9b8f714af39/packages/core/src/getStateFromPath.tsx/issues/L138) - by @rexfordessilfie

# [7.0.0-alpha.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.9...@react-navigation/core@7.0.0-alpha.10) (2024-03-04)

### Bug Fixes

* don't throw on setParams on ref ([b99d3c3](https://github.com/react-navigation/react-navigation/commit/b99d3c3a94d7f4efe7fb0309d7a41654c21406ea)) - by @satya164

# [7.0.0-alpha.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.8...@react-navigation/core@7.0.0-alpha.9) (2024-02-23)

### Bug Fixes

* type errors when getState used outside of a screen ([#11827](https://github.com/react-navigation/react-navigation/issues/11827)) ([b3512a5](https://github.com/react-navigation/react-navigation/commit/b3512a5aa7fdcdac0ea3f23acda33b0cbce270e1)), closes [#11701](https://github.com/react-navigation/react-navigation/issues/11701) - by @MrRefactor

# [7.0.0-alpha.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.7...@react-navigation/core@7.0.0-alpha.8) (2024-02-23)

### Bug Fixes

* handle non-function screens in static navigation ([7ba61f2](https://github.com/react-navigation/react-navigation/commit/7ba61f2a3532ad33b7e12beaec63b646eedeeb5e)) - by @satya164
* throw if screens property isn't specified in static config ([a5fc69e](https://github.com/react-navigation/react-navigation/commit/a5fc69ed694903dbc4def69e2b60a444ace6e80c)) - by @satya164

# [7.0.0-alpha.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.6...@react-navigation/core@7.0.0-alpha.7) (2024-01-17)

### Features

* add a new 'describe' method to create placeholder descriptor ([#11726](https://github.com/react-navigation/react-navigation/issues/11726)) ([0b83a9b](https://github.com/react-navigation/react-navigation/commit/0b83a9b79e92c61b2f547a9e31fb303cc9b07a51)) - by @osdnk
* add layout and screenLayout props for screens ([#11741](https://github.com/react-navigation/react-navigation/issues/11741)) ([2dc2178](https://github.com/react-navigation/react-navigation/commit/2dc217827a1caa615460563973d3d658be372b29)) - by @satya164
* move theming to core and pass theme to options ([#11707](https://github.com/react-navigation/react-navigation/issues/11707)) ([8e7ac4f](https://github.com/react-navigation/react-navigation/commit/8e7ac4f18545887b905f921df469dbf69d7951c7)) - by @satya164
* preloading for stack navigator ([#11733](https://github.com/react-navigation/react-navigation/issues/11733)) ([14fa6df](https://github.com/react-navigation/react-navigation/commit/14fa6dfa4484cf2784f0e5cd0d06252fdf8a4ba5)), closes [#11702](https://github.com/react-navigation/react-navigation/issues/11702) [#11727](https://github.com/react-navigation/react-navigation/issues/11727) - by @osdnk
* preloading in routers  ([382d6e6](https://github.com/react-navigation/react-navigation/commit/382d6e6f3312630b34332b1ae7d4bd7bf9b4ee60)) - by @osdnk

# [7.0.0-alpha.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.5...@react-navigation/core@7.0.0-alpha.6) (2023-11-17)

**Note:** Version bump only for package @react-navigation/core

# [7.0.0-alpha.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.4...@react-navigation/core@7.0.0-alpha.5) (2023-11-12)

### Bug Fixes

* cannot resolve use-latest-callback ([#11696](https://github.com/react-navigation/react-navigation/issues/11696)) ([361bc6a](https://github.com/react-navigation/react-navigation/commit/361bc6a3840b37ae082a70e4ff6315280814c7a1)) - by @jkaveri
* onReady not getting called on native ([#11628](https://github.com/react-navigation/react-navigation/issues/11628)) ([67232f1](https://github.com/react-navigation/react-navigation/commit/67232f1367129deb0b118cdbfa06d090eefa60a9)) - by @osdnk

* fix!: don't use screen from params as initialRouteName (#11680) ([4b681a9](https://github.com/react-navigation/react-navigation/commit/4b681a9837d1f7dd221363cc4ba5c94c23dbbfb6)), closes [#11680](https://github.com/react-navigation/react-navigation/issues/11680) - by @satya164

### Features

* add `useUnhandledLinking` for handling deep links behind auth etc. ([#11602](https://github.com/react-navigation/react-navigation/issues/11602)) ([688c43a](https://github.com/react-navigation/react-navigation/commit/688c43af4b27c90d1a99876d6daebbbf69820f56)), closes [#10939](https://github.com/react-navigation/react-navigation/issues/10939) - by @osdnk
* add a layout prop for navigators ([#11614](https://github.com/react-navigation/react-navigation/issues/11614)) ([1f51190](https://github.com/react-navigation/react-navigation/commit/1f511904b9437d1451557147e72962859e97b1ae)) - by @satya164
* add API for unhandled linking ([#11672](https://github.com/react-navigation/react-navigation/issues/11672)) ([5758b26](https://github.com/react-navigation/react-navigation/commit/5758b2615e70ce4943b23ead0227507c63b11c7c)) - by @osdnk

### BREAKING CHANGES

* Previously when using nested navigation API, we used that screen as
`initialRouteName`.

e.g.

```js
navigation.navigate('MyScreen', { screen: 'NestedScreen' });
```

Here, the `'NestedScreen'` will be set as `initialRouteName`.

It has the result of rendering the navigator with that screen as focused
screen. While this behaviour is expected, that screen was also used as
the `initialRouteName` for every other operation ignoring the
`initialRouteName` prop - which is not expected.

This change refactors the way the focused screen for initial render is
set to avoid this behavior.

# [7.0.0-alpha.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.3...@react-navigation/core@7.0.0-alpha.4) (2023-09-25)

**Note:** Version bump only for package @react-navigation/core

# [7.0.0-alpha.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.2...@react-navigation/core@7.0.0-alpha.3) (2023-09-07)

### Bug Fixes

* avoid re-rendering screen when nested navigator state changes ([#11547](https://github.com/react-navigation/react-navigation/issues/11547)) ([2c0f604](https://github.com/react-navigation/react-navigation/commit/2c0f604345f01e75ba542fa7422e78c91fc323c0)) - by @okwasniewski
* PathConfigMap type error: Type 'T' does not satisfy the constrai… ([#11238](https://github.com/react-navigation/react-navigation/issues/11238)) ([8e8ad0c](https://github.com/react-navigation/react-navigation/commit/8e8ad0c6bc6baee3142a6646a2e8a1982ffabd74)) - by @AntonYushkevich

### Features

* allow full linking config in static config ([ba53154](https://github.com/react-navigation/react-navigation/commit/ba53154b51edcdcfcac4cb249c5d93b8e4dc3564)) - by @satya164

### BREAKING CHANGES

* This breaks `getFocusedRouteNameFromRoute` inside components as it requires a re-render to get the new value. However, it still works in `options` callback which is its intended use case.

# [7.0.0-alpha.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.1...@react-navigation/core@7.0.0-alpha.2) (2023-06-22)

### Bug Fixes

* fix infering params when a screen is in a group ([5e9f001](https://github.com/react-navigation/react-navigation/commit/5e9f001e770637ce8f438da981b5d069aa7a4532)), closes [#11325](https://github.com/react-navigation/react-navigation/issues/11325) - by @satya164

### Code Refactoring

* drop custom fromEntries in favor of Object.fromEntries ([9fe34b4](https://github.com/react-navigation/react-navigation/commit/9fe34b445fcb86e5666f61e144007d7540f014fa)), closes [/reactnative.dev/blog/2022/06/21/version-069#highlights-of-069](https://github.com//reactnative.dev/blog/2022/06/21/version-069/issues/highlights-of-069) - by @satya164

### Features

* support a top-level path configuration in linking config ([1d0297e](https://github.com/react-navigation/react-navigation/commit/1d0297ed17788c01d7b901ad04b63d3f37f47266)) - by @satya164

### BREAKING CHANGES

* this means we now require at least iOS 12.2 and React Native 0.69 whose minimum supported iOS version is 12.4

# [7.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@7.0.0-alpha.0...@react-navigation/core@7.0.0-alpha.1) (2023-03-01)

### Bug Fixes

* fix paths in sourcemap files ([368e069](https://github.com/react-navigation/react-navigation/commit/368e0691b9fb07d4b1cbe71cfe4c2f40512f93ad)) - by @satya164
* properly export types to avoid webpack warning ([4f597a8](https://github.com/react-navigation/react-navigation/commit/4f597a8614630a7d42728b1221a5880e6a265a1c)) - by @satya164

# [7.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.4.1...@react-navigation/core@7.0.0-alpha.0) (2023-02-17)

### Bug Fixes

* bump query-string version ([#11069](https://github.com/react-navigation/react-navigation/issues/11069)) ([e6c05e2](https://github.com/react-navigation/react-navigation/commit/e6c05e28b901923bd38707676705b7cd564c9620)) - by @krudos
* fix type of setOptions and mark data passed to callbacks as Readonly ([6655c66](https://github.com/react-navigation/react-navigation/commit/6655c6624f0a66ceeac677ccdb34a9e79e83ab62)) - by @satya164
* remove defaultScreenOptions from default navigator options ([6267952](https://github.com/react-navigation/react-navigation/commit/6267952001015a9d51ae9fcb3a385f25a136623e)) - by @satya164
* support dispatching action to child without 'navigationInChildEnabled' if 'target' is specified ([debd620](https://github.com/react-navigation/react-navigation/commit/debd620a12f7eafca0483c16fc33e9ec4a937d43)) - by @satya164

* fix!: align onReady callback and navigationRef.isReady ([1959baa](https://github.com/react-navigation/react-navigation/commit/1959baa97c101712db84905827f13a8a78a42ca7)) - by @satya164
* feat!: add `popTo` method for stack and remove going back behaviour of ([c9c2163](https://github.com/react-navigation/react-navigation/commit/c9c2163d28da963bd760cf395d17efe9b851f531)) - by @satya164
* refactor!: drop support for key property in navigate ([61c53bb](https://github.com/react-navigation/react-navigation/commit/61c53bb1836a47083b3b5ea0f4fddba6081885f2)) - by @satya164

### Features

* add navigateDeprecated for backward compatibility ([8ea6dc7](https://github.com/react-navigation/react-navigation/commit/8ea6dc793d8596da5e6052dbbae2e4825578dc50)) - by @satya164
* extract drawer to a separate package ([58b7cae](https://github.com/react-navigation/react-navigation/commit/58b7caeaad00eafbcda36561e75e538e0f02c4af)) - by @satya164
* support statically confguring navigation tree ([#11144](https://github.com/react-navigation/react-navigation/issues/11144)) ([4cc322e](https://github.com/react-navigation/react-navigation/commit/4cc322e08b3d6fe089710c9c6869bbdc183c2bd6)) - by @satya164

### BREAKING CHANGES

* Previously, the `onReady` prop and `navigationRef.isReady()` work slightly
differently. The
`onReady` callback fired when `NavigationContainer` finishes mounting and deep links is resolved.
The `navigationRef.isReady()` method additionally checks if there are any navigators rendered - which may not be `true` if the user is rendering their navigators conditionally inside a
`NavigationContainer`.

This changes `onReady` to work similar to `navigationRef.isReady()`. The `onReady` callback will now fire only when there are navigators rendered - reflecting the value of
`navigationRef.isReady()`.
* Previously, `navigate` method navigated back if the screen
already exists in the stack. I have seen many people get confused by this
behavior. This behavior is also used for sending params to a previous
screen in the documentation. However, it's also problematic since it could
either push or pop the screens based on the scenario.

This removes the going back behavior from `navigate` and adds a new method
`popTo` to go back to a specific screen in the stack.

The methods now behave as follows:

- `navigate(screenName)` will stay on the current screen if the screen is
already focused, otherwise push a new screen to the stack.
- `popTo(screenName)` will go back to the screen if it exists in the stack,
otherwise pop the current screen and add this screen to the stack.
- To achieve the previous behavior with `navigate`, you can use the `getId`
prop in which case it'll go to the screen with the matching ID and push or
pop screens accordingly.
* Previously, you could specify a route `key` to navigate to, e.g.
`navigation.navigate({ key: 'someuniquekey' })`. It's problematic since `key` is an internal
implementation detail and created by the library internally - which makes it weird to use. None
of the other actions support such usage either.

In addition, we have already added a better API (`getId`) which can be used for similar use
cases - and gives users full control since they provide the ID and it's not autogenerated by the
library.

So this change removes the `key` option from the `navigate` action.

## [6.4.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.4.0...@react-navigation/core@6.4.1) (2022-11-21)

### Bug Fixes

* add accessibility props to NativeStack screens ([#11022](https://github.com/react-navigation/react-navigation/issues/11022)) ([3ab05af](https://github.com/react-navigation/react-navigation/commit/3ab05afeb6412b8e5566270442ac14a463136620))

# [6.4.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.2.2...@react-navigation/core@6.4.0) (2022-09-16)

### Bug Fixes

* add missing parentheses typo in useFocusEffect error message ([#10688](https://github.com/react-navigation/react-navigation/issues/10688)) ([9203045](https://github.com/react-navigation/react-navigation/commit/9203045b9c3cd39973b6085e5dfef17d7524f22e))
* handle path with empty string properly for linking ([#10708](https://github.com/react-navigation/react-navigation/issues/10708)) ([e8c374e](https://github.com/react-navigation/react-navigation/commit/e8c374e0643a1521566c654e0052b53f2fd0667a))
* potential prototype pollution attacks ([#10455](https://github.com/react-navigation/react-navigation/issues/10455)) ([10e5d2b](https://github.com/react-navigation/react-navigation/commit/10e5d2bbc0b19af7e87ee96e4c402ed6d9d54d79))
* prevent Object properties to be used as parsing functions ([#10570](https://github.com/react-navigation/react-navigation/issues/10570)) ([7fbd3e5](https://github.com/react-navigation/react-navigation/commit/7fbd3e5025ecf6f5d20b05c0ac2d583d772435ab))
* strongly type the `component` prop on `RouteConfigComponent` ([#10519](https://github.com/react-navigation/react-navigation/issues/10519)) ([55da7c9](https://github.com/react-navigation/react-navigation/commit/55da7c9b72076c98a65eb4b1b338e990a2f5a21c))
* wrong setParams type if route does not have params ([#10512](https://github.com/react-navigation/react-navigation/issues/10512)) ([8ed42cd](https://github.com/react-navigation/react-navigation/commit/8ed42cdfe886e0b004319eea7c92d6081bdf289d))

### Features

* implement usePreventRemove hook ([#10682](https://github.com/react-navigation/react-navigation/issues/10682)) ([7411516](https://github.com/react-navigation/react-navigation/commit/741151654752e0e55affbc8e04dd4876eaedd760))

# [6.3.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.2.2...@react-navigation/core@6.3.0) (2022-08-24)

### Bug Fixes

* add missing parentheses typo in useFocusEffect error message ([#10688](https://github.com/react-navigation/react-navigation/issues/10688)) ([9203045](https://github.com/react-navigation/react-navigation/commit/9203045b9c3cd39973b6085e5dfef17d7524f22e))
* handle path with empty string properly for linking ([#10708](https://github.com/react-navigation/react-navigation/issues/10708)) ([e8c374e](https://github.com/react-navigation/react-navigation/commit/e8c374e0643a1521566c654e0052b53f2fd0667a))
* potential prototype pollution attacks ([#10455](https://github.com/react-navigation/react-navigation/issues/10455)) ([10e5d2b](https://github.com/react-navigation/react-navigation/commit/10e5d2bbc0b19af7e87ee96e4c402ed6d9d54d79))
* prevent Object properties to be used as parsing functions ([#10570](https://github.com/react-navigation/react-navigation/issues/10570)) ([7fbd3e5](https://github.com/react-navigation/react-navigation/commit/7fbd3e5025ecf6f5d20b05c0ac2d583d772435ab))
* strongly type the `component` prop on `RouteConfigComponent` ([#10519](https://github.com/react-navigation/react-navigation/issues/10519)) ([55da7c9](https://github.com/react-navigation/react-navigation/commit/55da7c9b72076c98a65eb4b1b338e990a2f5a21c))
* wrong setParams type if route does not have params ([#10512](https://github.com/react-navigation/react-navigation/issues/10512)) ([8ed42cd](https://github.com/react-navigation/react-navigation/commit/8ed42cdfe886e0b004319eea7c92d6081bdf289d))

### Features

* implement usePreventRemove hook ([#10682](https://github.com/react-navigation/react-navigation/issues/10682)) ([7411516](https://github.com/react-navigation/react-navigation/commit/741151654752e0e55affbc8e04dd4876eaedd760))

## [6.2.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.2.1...@react-navigation/core@6.2.2) (2022-07-05)

### Bug Fixes

* ensure same @types/react version in repo ([#10663](https://github.com/react-navigation/react-navigation/issues/10663)) ([e662465](https://github.com/react-navigation/react-navigation/commit/e6624653fbbd931158dbebd17142abf9637205b6)), closes [#10655](https://github.com/react-navigation/react-navigation/issues/10655)
* make event listeners idempotent ([#10667](https://github.com/react-navigation/react-navigation/issues/10667)) ([3bb31e9](https://github.com/react-navigation/react-navigation/commit/3bb31e9821fa723574359c61fcf674bce550f16d)), closes [#10664](https://github.com/react-navigation/react-navigation/issues/10664)

## [6.2.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.2.0...@react-navigation/core@6.2.1) (2022-04-01)

### Bug Fixes

* return undefined instead of throwing when parent is not found ([28a3993](https://github.com/react-navigation/react-navigation/commit/28a39932490496e7131954f96ce19663ec109d47))

# [6.2.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.1.1...@react-navigation/core@6.2.0) (2022-04-01)

### Features

* add an ID prop to navigators ([4e4935a](https://github.com/react-navigation/react-navigation/commit/4e4935ac2584bc1a00209609cc026fa73e12c10a))

## [6.1.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.1.0...@react-navigation/core@6.1.1) (2022-01-29)

### Bug Fixes

* removal of non-existing listener should not break updating ref ([#10067](https://github.com/react-navigation/react-navigation/issues/10067)) ([d206ffe](https://github.com/react-navigation/react-navigation/commit/d206ffe77c06595243743f3190f79f723cfd0520))
* warn for components starting with lower case names ([4b4a7c5](https://github.com/react-navigation/react-navigation/commit/4b4a7c5e78825c63cfe162157f0f9c99a060c040))

# [6.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.3...@react-navigation/core@6.1.0) (2021-10-12)

### Features

* add a `navigationKey` prop to Screen and Group ([b2fa62c](https://github.com/react-navigation/react-navigation/commit/b2fa62c8ea5c5ad40a3541a7258cba62467e7a56))

## [6.0.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.2...@react-navigation/core@6.0.3) (2021-10-09)

**Note:** Version bump only for package @react-navigation/core

## [6.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.1...@react-navigation/core@6.0.2) (2021-09-26)

### Bug Fixes

* automatically queue listeners when container isn't ready ([acdde18](https://github.com/react-navigation/react-navigation/commit/acdde18d8938741fd27d8ff8c8249977e0cb03e7))
* change error when using React Navigation 4 API ([a802c9d](https://github.com/react-navigation/react-navigation/commit/a802c9df95b9299dd96fa196b4d56fc865f35a86))
* update the error message for registering navigators ([171d7e1](https://github.com/react-navigation/react-navigation/commit/171d7e1d5beb1f962b15c249dfa746ef7f068835))

## [6.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0...@react-navigation/core@6.0.1) (2021-08-03)

### Bug Fixes

* add merge to the navigate types ([#9777](https://github.com/react-navigation/react-navigation/issues/9777)) ([be8532c](https://github.com/react-navigation/react-navigation/commit/be8532c0867bdb0cff4b29c0892bdfe85c33e8e3))

# [6.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.17...@react-navigation/core@6.0.0) (2021-08-01)

### Bug Fixes

* clear options set from a screen when it unmounts. closes [#9756](https://github.com/react-navigation/react-navigation/issues/9756) ([d2d7f8d](https://github.com/react-navigation/react-navigation/commit/d2d7f8d95e84e8d45b6807f59afcf4d0e64c3828))

# [6.0.0-next.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.16...@react-navigation/core@6.0.0-next.17) (2021-07-16)

### Bug Fixes

* use nested params for initial state only ([577d79e](https://github.com/react-navigation/react-navigation/commit/577d79e98c6d6f1c78e0f3232225b2b6b331340b))

# [6.0.0-next.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.15...@react-navigation/core@6.0.0-next.16) (2021-07-16)

### Bug Fixes

* prevent navigation state updates after state cleanup ([#9688](https://github.com/react-navigation/react-navigation/issues/9688)) ([16f0e11](https://github.com/react-navigation/react-navigation/commit/16f0e11822b14aa5b1ba4b288fb38fcf15088419))
* sort wildcard and :params  ([#9672](https://github.com/react-navigation/react-navigation/issues/9672)) ([4135d09](https://github.com/react-navigation/react-navigation/commit/4135d09c6f14030257b2da47658e102b083c7727))

# [6.0.0-next.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.13...@react-navigation/core@6.0.0-next.15) (2021-07-01)

### Bug Fixes

* fix typechecking in linking config ([b1134c8](https://github.com/react-navigation/react-navigation/commit/b1134c8a34f96be2817cb780c4bd23b2025b4c35))

### Features

* show stack trace in the flipper plugin ([97772af](https://github.com/react-navigation/react-navigation/commit/97772affa3c8f26489f0bdbfb6872ef4377b8ed1))

# [6.0.0-next.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.13...@react-navigation/core@6.0.0-next.14) (2021-06-10)

### Features

* show stack trace in the flipper plugin ([97772af](https://github.com/react-navigation/react-navigation/commit/97772affa3c8f26489f0bdbfb6872ef4377b8ed1))

# [6.0.0-next.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.12...@react-navigation/core@6.0.0-next.13) (2021-05-29)

### Bug Fixes

* validate property names in linking config ([324ea71](https://github.com/react-navigation/react-navigation/commit/324ea7181db6b743f512854be267cc9d65975b6f))

# [6.0.0-next.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.11...@react-navigation/core@6.0.0-next.12) (2021-05-29)

### Bug Fixes

* try to fix [#9631](https://github.com/react-navigation/react-navigation/issues/9631) ([b4d7b0e](https://github.com/react-navigation/react-navigation/commit/b4d7b0ee86c09419a18357867a0a25bb90d960c0))

# [6.0.0-next.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.10...@react-navigation/core@6.0.0-next.11) (2021-05-27)

**Note:** Version bump only for package @react-navigation/core

# [6.0.0-next.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.9...@react-navigation/core@6.0.0-next.10) (2021-05-26)

### Features

* add screenListeners prop on navigators similar to screenOptions ([cde44a5](https://github.com/react-navigation/react-navigation/commit/cde44a5785444a121aa08f94af9f8fe4fc89910a))
* expose container ref in useNavigation ([1d40279](https://github.com/react-navigation/react-navigation/commit/1d40279db18ab2aed12517ed3ca6af6d509477d2))

# [6.0.0-next.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.8...@react-navigation/core@6.0.0-next.9) (2021-05-23)

**Note:** Version bump only for package @react-navigation/core

# [6.0.0-next.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.7...@react-navigation/core@6.0.0-next.8) (2021-05-16)

### Bug Fixes

* fix type error when passing unannotated navigation ref ([dc4ffc0](https://github.com/react-navigation/react-navigation/commit/dc4ffc0171b4535fe1b6e839b9d54350121bcf55))

# [6.0.0-next.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.6...@react-navigation/core@6.0.0-next.7) (2021-05-10)

### Features

* return a NavigationContent component from useNavigationBuilder ([1179d56](https://github.com/react-navigation/react-navigation/commit/1179d56c5008270753feef41acdc1dbd2191efcf))

# [6.0.0-next.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.5...@react-navigation/core@6.0.0-next.6) (2021-05-09)

### Bug Fixes

* fix type annotations for useNavigation (again) ([929c3e3](https://github.com/react-navigation/react-navigation/commit/929c3e3a3b3eb32d197ef1f887dc4cbdce48eaff))

# [6.0.0-next.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.4...@react-navigation/core@6.0.0-next.5) (2021-05-09)

### Bug Fixes

* fix type annotations for useNavigation ([7da45e1](https://github.com/react-navigation/react-navigation/commit/7da45e1e8951ff46e09db4ebc2c88085c67ab8e9))

# [6.0.0-next.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.3...@react-navigation/core@6.0.0-next.4) (2021-05-09)

### Features

* add a new component to group multiple screens with common options ([1a6aebe](https://github.com/react-navigation/react-navigation/commit/1a6aebefcb77ea708687475c55742407d69808ce))
* add ability to specify root param list ([b28bfdd](https://github.com/react-navigation/react-navigation/commit/b28bfddc17cbf3996fac04a34b2a7085ecf88be5))

# [6.0.0-next.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.2...@react-navigation/core@6.0.0-next.3) (2021-05-01)

### Features

* add a CompositeScreenProps type ([def7c03](https://github.com/react-navigation/react-navigation/commit/def7c03d7d7b42cf322f4e277f8f76858717654e))
* add helper and hook for container ref ([0ecd112](https://github.com/react-navigation/react-navigation/commit/0ecd112ec9786a26261ada3d33ef44dc1ec84da0))

# [6.0.0-next.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0-next.1...@react-navigation/core@6.0.0-next.2) (2021-04-08)

### Bug Fixes

* properly resolve initialRouteNames ([c38906a](https://github.com/react-navigation/react-navigation/commit/c38906a7a09b997f37ce56734ea823c75ea744db))

### Features

* improve useNavigationState typing ([#9464](https://github.com/react-navigation/react-navigation/issues/9464)) ([84020a0](https://github.com/react-navigation/react-navigation/commit/84020a0b27ebae50d3037438a51d95eb31b02424))

# [6.0.0-next.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@6.0.0...@react-navigation/core@6.0.0-next.1) (2021-03-10)

**Note:** Version bump only for package @react-navigation/core

# [6.0.0-next.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.14.3...@react-navigation/core@6.0.0-next.0) (2021-03-09)

### Bug Fixes

* add missing helper types in descriptors ([21a1154](https://github.com/react-navigation/react-navigation/commit/21a11543bf41c4559c2570d5accc0bbb3b67eb8d))
* check duplicate names only for immediate nested screens ([36a9b4f](https://github.com/react-navigation/react-navigation/commit/36a9b4f866c49d6f7350405c54b86bd77e374eb5))
* don't merge params on navigation ([366d018](https://github.com/react-navigation/react-navigation/commit/366d0181dc02597b8d11e343f37fc77bee164c70))
* drop dangerously prefix from getState and getParent ([227f133](https://github.com/react-navigation/react-navigation/commit/227f133536af85dc5ff85eeb269b76ed80cd3f05))
* drop support for legacy linking config ([0e13e8d](https://github.com/react-navigation/react-navigation/commit/0e13e8d23cc2ea74f3b0fce9334ee5c8be2484f4))
* fix default screen options not being respected ([03ba1f2](https://github.com/react-navigation/react-navigation/commit/03ba1f2930cb731266e6bc3044c67fb267837ed1))
* fix incorrect state change events in independent nested container ([b82a912](https://github.com/react-navigation/react-navigation/commit/b82a9126bb91a84e21473723ce40da0cce732a39)), closes [#9080](https://github.com/react-navigation/react-navigation/issues/9080)
* print an error when passing a second argument to useFocusEffect ([c361795](https://github.com/react-navigation/react-navigation/commit/c361795d97eb20150913ddc3fbf139e095d25830))
* remove the state property from route prop ([ebab518](https://github.com/react-navigation/react-navigation/commit/ebab5183522f5ae03f50f88289c0e7acc208dc02))
* show redbox instead of crash if navigation isn't initialized ([13d8553](https://github.com/react-navigation/react-navigation/commit/13d85530ae684eb956d3c4df25919572caf0ec1a))

### Features

* add a way to specify an unique ID for screens ([15b8bb3](https://github.com/react-navigation/react-navigation/commit/15b8bb34584db3cb166f6aafd45f0b95f14fde62))
* add an option to specify default options for the navigator ([c85f2ff](https://github.com/react-navigation/react-navigation/commit/c85f2ff47a2b3d403a3cbe993b46d04914358ba5))
* allow returning null or undefined to skip actions with dispatch ([d6466b7](https://github.com/react-navigation/react-navigation/commit/d6466b7a4b5d3087981dbd50a5f5f56a6092edb3))
* associate path with the route it opens when deep linking ([#9384](https://github.com/react-navigation/react-navigation/issues/9384)) ([86e64fd](https://github.com/react-navigation/react-navigation/commit/86e64fdcd81a57cf3f3bdab4c9035b52984e7009)), closes [#9102](https://github.com/react-navigation/react-navigation/issues/9102)
* warn on duplicate screen names across navigators ([02a031e](https://github.com/react-navigation/react-navigation/commit/02a031e46eac432fc3e26c5de30c7bdf0a81ce49))

### BREAKING CHANGES

* This commit drops support for legacy linking config which allowed screens to be specified without the screens property in the config.
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
* any code which relies on `route.state` will break.

Previous versions printed a warning on accessing `route.state`. This commit removes the property entirely. Accessing this property isn't safe since child navigator state isn't gurranteed to be in sync with parent navigator state and cause subtle bugs in apps.

## [5.14.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.14.2...@react-navigation/core@5.14.3) (2020-11-10)

### Bug Fixes

* improve the error message for incorrect screen configuration ([8f764d8](https://github.com/react-navigation/react-navigation/commit/8f764d8b0809604716d5d92ea33cc1beee02e804))

## [5.14.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/core@5.14.1...@react-navigation/core@5.14.2) (2020-11-09)

### Bug Fixes

* throw if the same pattern resolves to multiple screens ([48b2e77](https://github.com/react-navigation/react-navigation/commit/48b2e777307908e8b3fcb49d8555b610dc0e38f2))

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
