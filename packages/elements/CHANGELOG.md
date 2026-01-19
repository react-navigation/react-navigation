# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@3.0.0-alpha.0...@react-navigation/elements@3.0.0-alpha.1) (2026-01-19)

### Features

* add options to hide left and right item backgrounds ([57969cd](https://github.com/react-navigation/react-navigation/commit/57969cd3cc1eaa437edf9d40c5ee5587182851d9)) - by @satya164

# [3.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.6.0...@react-navigation/elements@3.0.0-alpha.0) (2025-12-19)

### Bug Fixes

* adjust header spacing on Android ([c3bf563](https://github.com/react-navigation/react-navigation/commit/c3bf5635ab61321aaab6ef41d4e3fbe527f0f60f)) - by @satya164
* avoid back label getting clipped if it's too small ([e9f72b2](https://github.com/react-navigation/react-navigation/commit/e9f72b2f88bfe8b61fa3d0af7f6d09b75395a2b5)) - by @satya164
* change order of views so react-native-screens finds nested navigators ([#12853](https://github.com/react-navigation/react-navigation/issues/12853)) ([b068c1a](https://github.com/react-navigation/react-navigation/commit/b068c1a1c075f85d54ff4e297ae1df312d3fc0f9)) - by @satya164
* don't extends RootParamList in Link to allow overrides ([d928289](https://github.com/react-navigation/react-navigation/commit/d9282892dbfe9c1ac2d3616adea0d2ed55176434)) - by @satya164
* fix font scaling and back title ([1b88142](https://github.com/react-navigation/react-navigation/commit/1b88142ee91bc6a9e80c37c9fed3ec5b221a97a1)) - by @satya164
* fix landscape header height to match native ([ad041a0](https://github.com/react-navigation/react-navigation/commit/ad041a0cf9cf0c961b665da4e9acd162a0fa09f6)) - by @satya164
* fix misaligned header search bar on android ([9778b67](https://github.com/react-navigation/react-navigation/commit/9778b67bb5a15af75dbb94f44dba15a09bb44558)) - by @satya164
* fix title shifting when searchbar is shown on ios ([a087e8a](https://github.com/react-navigation/react-navigation/commit/a087e8a8f94a034d1f369fcfe840e4d3b5896939)) - by @satya164
* handle disabled in PlatformPressable ([49431c0](https://github.com/react-navigation/react-navigation/commit/49431c0a6a001906b4f629516be29c1a0fb61b00)) - by @satya164
* measure frame size without an additional view ([#12882](https://github.com/react-navigation/react-navigation/issues/12882)) ([4c12529](https://github.com/react-navigation/react-navigation/commit/4c12529ba817c43c6e58decbd0c371f98033af2b)) - by @satya164
* measure header layout early in layout effect ([4428241](https://github.com/react-navigation/react-navigation/commit/4428241a9bd259e121b8bad9eb3add15a597b3ce)) - by @satya164
* remove overflow: hidden from background so shadow isn't hidden ([f1aa2dc](https://github.com/react-navigation/react-navigation/commit/f1aa2dc2cfe2e0a1e44d0111f1abd3a120d1c9ba)) - by @satya164
* replace `pointerEvents` props with styles ([#12693](https://github.com/react-navigation/react-navigation/issues/12693)) ([987aed6](https://github.com/react-navigation/react-navigation/commit/987aed623ad7eaf120d3af76ca2e05b2a3c7f103)), closes [#12441](https://github.com/react-navigation/react-navigation/issues/12441) - by @hassankhan
* tweak fallback colors ([defccac](https://github.com/react-navigation/react-navigation/commit/defccac0661f415bc755b007346c10cd7f631a1f)) - by @satya164
* tweak header styling ([2c2a20e](https://github.com/react-navigation/react-navigation/commit/2c2a20e3730cc394bd42d86aac24c38aac57f3ff)) - by @satya164
* tweak lazy rendering logic ([67152b9](https://github.com/react-navigation/react-navigation/commit/67152b9b1ec36863fb16574a32e1e690866a417a)) - by @satya164
* update back & search icons for latest iOS ([56c009d](https://github.com/react-navigation/react-navigation/commit/56c009d1d1c975cd42de15dade30e1b6355a67b6)) - by @satya164

### Code Refactoring

* drop Background component ([ec43b4e](https://github.com/react-navigation/react-navigation/commit/ec43b4e5c0e12bebaf7225b1af6a8aeb58f69c28)) - by @satya164
* drop deprecated APIs and fallbacks for older versions of packages ([cf60189](https://github.com/react-navigation/react-navigation/commit/cf601898adf7ad18b3e4b298a82e04bfb170f01b)) - by @satya164
* drop various layout arguments in public APIs ([514cc06](https://github.com/react-navigation/react-navigation/commit/514cc0602f08544562e8a99c18ae555043851b36)) - by @satya164
* improve API for getDefaultHeaderHeight ([548a2dd](https://github.com/react-navigation/react-navigation/commit/548a2dd4c437f654f26c90225ee79cc816d368e2)) - by @satya164
* make react-native-screens required ([92093f9](https://github.com/react-navigation/react-navigation/commit/92093f9be7c53856657c588d52777529d300b650)) - by @satya164
* rename onChangeText to onChange for header ([3c08e52](https://github.com/react-navigation/react-navigation/commit/3c08e52598a951bdea8195f5e07c49ca79a7becf)) - by @satya164
* rework how root types are specified ([7d63782](https://github.com/react-navigation/react-navigation/commit/7d63782b7ed90e5c1504325c51d1245e90817506)) - by @satya164

### Features

* add a container component as view alternative ([fcaf060](https://github.com/react-navigation/react-navigation/commit/fcaf060e309718331e22379021546be1927e50ea)) - by @satya164
* add unstable native bottom tabs integration ([#12791](https://github.com/react-navigation/react-navigation/issues/12791)) ([0cb67c7](https://github.com/react-navigation/react-navigation/commit/0cb67c7e57cfe1a83f21661de658253779506b45)) - by @osdnk
* allow more style properties on header ([998640f](https://github.com/react-navigation/react-navigation/commit/998640fa8216ed5503c6cce012556bc3ac90d49a)) - by @satya164
* cancel search on back button press to match native ([8ee9c5f](https://github.com/react-navigation/react-navigation/commit/8ee9c5ff25e041f1222ba2be19160e69a7bec4a7)) - by @satya164
* move Badge to elements and expose it in public API ([#12796](https://github.com/react-navigation/react-navigation/issues/12796)) ([987e318](https://github.com/react-navigation/react-navigation/commit/987e318d50695cf13b3b1967bab852fb2e1da132)) - by @Trancever
* rework header design to resemble latest iOS ([#12873](https://github.com/react-navigation/react-navigation/issues/12873)) ([260b604](https://github.com/react-navigation/react-navigation/commit/260b604ba4b96c35826b2a326a9137363b8de0fd)) - by @satya164
* support ColorValue instead of string for colors in theme ([#12711](https://github.com/react-navigation/react-navigation/issues/12711)) ([cfe746b](https://github.com/react-navigation/react-navigation/commit/cfe746be6d671da7f4fe785d5bd6142fc8152e14)) - by @satya164
* support headerBlurEffect on web in native-stack ([88df82c](https://github.com/react-navigation/react-navigation/commit/88df82c797578d28dd6b8e3d1f89edb14523b4d8)) - by @satya164
* use continuous rounded corners ([199c002](https://github.com/react-navigation/react-navigation/commit/199c0028de121b7d9e462f4a1158f4c1ce420d6d)) - by @satya164

### BREAKING CHANGES

* Users will need to update their code to use `onChange`.
* The types previously specified with `RootParamList`
using global augmentation will stop working.
* it now accepts an object with 3 properties:
- `landscape`
- `modalPresentation`
- `topInset`
* layout args are dropped to improve performance during window resize
if consumers need layout, it's recommended to measure directly
* Not having react native screens installed will now fail the build
* Background color can instead be applied by using it from `useTheme`
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

# [2.6.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.5.2...@react-navigation/elements@2.6.0) (2025-07-25)

### Features

* preserve params for backBehavior=fullHistory ([3f854bc](https://github.com/react-navigation/react-navigation/commit/3f854bc8f450672b7c24cb4c6fea1dce0682f6aa)) - by @satya164

## [2.5.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.5.1...@react-navigation/elements@2.5.2) (2025-06-24)

### Bug Fixes

* load SafeAreaListener with require to avoid webpack error ([4094a75](https://github.com/react-navigation/react-navigation/commit/4094a75bab1aaec407411528e59cbd9466b99267)), closes [#12654](https://github.com/react-navigation/react-navigation/issues/12654) - by @

## [2.5.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.5.0...@react-navigation/elements@2.5.1) (2025-06-22)

### Bug Fixes

* throttle frame size instead of debounce ([d016bd7](https://github.com/react-navigation/react-navigation/commit/d016bd7bdfbd6fd73cee4c2bcf890574237239f4)) - by @

# [2.5.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.4.6...@react-navigation/elements@2.5.0) (2025-06-21)

### Features

* use the new SafeAreaListener to listen to frame changes ([d9e295e](https://github.com/react-navigation/react-navigation/commit/d9e295eef251393b5280d661957e7d2c31a36ae1)) - by @satya164

## [2.4.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.4.5...@react-navigation/elements@2.4.6) (2025-06-19)

### Bug Fixes

* use use-sync-external-store for selector for frame size ([51ad10c](https://github.com/react-navigation/react-navigation/commit/51ad10c7ecbc5c24b9e916927296f66799e73261)) - by @

## [2.4.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.4.4...@react-navigation/elements@2.4.5) (2025-06-18)

**Note:** Version bump only for package @react-navigation/elements

## [2.4.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.4.3...@react-navigation/elements@2.4.4) (2025-06-14)

**Note:** Version bump only for package @react-navigation/elements

## [2.4.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.4.2...@react-navigation/elements@2.4.3) (2025-05-30)

**Note:** Version bump only for package @react-navigation/elements

## [2.4.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.4.1...@react-navigation/elements@2.4.2) (2025-05-11)

**Note:** Version bump only for package @react-navigation/elements

## [2.4.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.4.0...@react-navigation/elements@2.4.1) (2025-05-04)

### Bug Fixes

* fix peer dep versions. closes [#12580](https://github.com/react-navigation/react-navigation/issues/12580) ([6fc3dd6](https://github.com/react-navigation/react-navigation/commit/6fc3dd677aecdcf8696fe723e17b9c028de7ad85)) - by @satya164

# [2.4.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.3.8...@react-navigation/elements@2.4.0) (2025-05-02)

### Bug Fixes

* use aria props instead of accessibilityX ([#11848](https://github.com/react-navigation/react-navigation/issues/11848)) ([347ca97](https://github.com/react-navigation/react-navigation/commit/347ca975406e84a5e7452679b1dde7b9ecca1a22)) - by @satya164

### Features

* **elements:** add forwardRef to HeaderButton and PlatformPressable components ([#12554](https://github.com/react-navigation/react-navigation/issues/12554)) ([04a82f1](https://github.com/react-navigation/react-navigation/commit/04a82f1a34ebc265c2dac3ebae94170efc3d837a)) - by @erickreutz

## [2.3.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.3.7...@react-navigation/elements@2.3.8) (2025-04-08)

### Bug Fixes

* add types field back to support legacy moduleResolution ([6c021d4](https://github.com/react-navigation/react-navigation/commit/6c021d442ede3a231e32486b2c391c2e850bf76e)), closes [#12534](https://github.com/react-navigation/react-navigation/issues/12534) - by @

## [2.3.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.3.6...@react-navigation/elements@2.3.7) (2025-04-04)

### Bug Fixes

* drop commonjs module to avoid dual package hazard ([f0fbcc5](https://github.com/react-navigation/react-navigation/commit/f0fbcc5515e73b454f607bd95bba40a48e852d0f)) - by @satya164

## [2.3.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.3.5...@react-navigation/elements@2.3.6) (2025-04-03)

**Note:** Version bump only for package @react-navigation/elements

## [2.3.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.3.4...@react-navigation/elements@2.3.5) (2025-04-02)

**Note:** Version bump only for package @react-navigation/elements

## [2.3.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.3.3...@react-navigation/elements@2.3.4) (2025-04-02)

**Note:** Version bump only for package @react-navigation/elements

## [2.3.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.3.2...@react-navigation/elements@2.3.3) (2025-04-02)

**Note:** Version bump only for package @react-navigation/elements

## [2.3.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.3.1...@react-navigation/elements@2.3.2) (2025-04-01)

**Note:** Version bump only for package @react-navigation/elements

## [2.3.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.3.0...@react-navigation/elements@2.3.1) (2025-03-25)

**Note:** Version bump only for package @react-navigation/elements

# [2.3.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.2.8...@react-navigation/elements@2.3.0) (2025-03-22)

### Bug Fixes

* header search not taking remaining space when title is centered on Android ([#12461](https://github.com/react-navigation/react-navigation/issues/12461)) ([f06df9f](https://github.com/react-navigation/react-navigation/commit/f06df9f9af929f1629166554a69dadcda749fd00)) - by @ferretwithaberet

### Features

* add enterKeyHint option for search bar ([#12464](https://github.com/react-navigation/react-navigation/issues/12464)) ([96d25ce](https://github.com/react-navigation/react-navigation/commit/96d25cec3d51170e2183863e1085740a061d7797)) - by @ferretwithaberet
* add onOpen handler ([#12463](https://github.com/react-navigation/react-navigation/issues/12463)) ([e7e6562](https://github.com/react-navigation/react-navigation/commit/e7e65622ec6c9662fa39fe1989ae1f2788c2d4c6)) - by @ferretwithaberet
* add typing for onSubmitEditing ([#12462](https://github.com/react-navigation/react-navigation/issues/12462)) ([80278f4](https://github.com/react-navigation/react-navigation/commit/80278f4b3ac8ea08388f29e38a50ace04a7759c6)) - by @ferretwithaberet

## [2.2.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.2.7...@react-navigation/elements@2.2.8) (2025-03-19)

**Note:** Version bump only for package @react-navigation/elements

## [2.2.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.2.6...@react-navigation/elements@2.2.7) (2025-03-19)

**Note:** Version bump only for package @react-navigation/elements

## [2.2.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.2.5...@react-navigation/elements@2.2.6) (2025-03-02)

### Bug Fixes

* add top spacing to search bar when there's no top inset. fixes [#12405](https://github.com/react-navigation/react-navigation/issues/12405) ([36e630d](https://github.com/react-navigation/react-navigation/commit/36e630dd4299113f6147f983f06bda4c4ee41a71)) - by @satya164
* inherit header color for searchbar. fixes [#12405](https://github.com/react-navigation/react-navigation/issues/12405) ([ddcc07a](https://github.com/react-navigation/react-navigation/commit/ddcc07a9809f3bac70d05578d8af9fa32a0f3e2f)) - by @satya164

## [2.2.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.2.4...@react-navigation/elements@2.2.5) (2024-12-12)

**Note:** Version bump only for package @react-navigation/elements

## [2.2.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.2.3...@react-navigation/elements@2.2.4) (2024-12-02)

**Note:** Version bump only for package @react-navigation/elements

## [2.2.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.2.2...@react-navigation/elements@2.2.3) (2024-12-01)

**Note:** Version bump only for package @react-navigation/elements

## [2.2.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.2.1...@react-navigation/elements@2.2.2) (2024-12-01)

**Note:** Version bump only for package @react-navigation/elements

## [2.2.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.2.0...@react-navigation/elements@2.2.1) (2024-12-01)

**Note:** Version bump only for package @react-navigation/elements

# [2.2.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.1.7...@react-navigation/elements@2.2.0) (2024-11-28)

### Bug Fixes

* make it possible to click through transparent header ([#12307](https://github.com/react-navigation/react-navigation/issues/12307)) ([bcac0e1](https://github.com/react-navigation/react-navigation/commit/bcac0e1046841af7941aeb5f0cd29ea5b4220483)) - by @hirbod

### Features

* support header style when header is transparent ([cdb5bfb](https://github.com/react-navigation/react-navigation/commit/cdb5bfbe9c83cdcdb0ea91896ea3da22f9657755)) - by @

## [2.1.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.1.6...@react-navigation/elements@2.1.7) (2024-11-27)

**Note:** Version bump only for package @react-navigation/elements

## [2.1.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.1.5...@react-navigation/elements@2.1.6) (2024-11-26)

**Note:** Version bump only for package @react-navigation/elements

## [2.1.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.1.4...@react-navigation/elements@2.1.5) (2024-11-25)

**Note:** Version bump only for package @react-navigation/elements

## [2.1.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.1.3...@react-navigation/elements@2.1.4) (2024-11-25)

**Note:** Version bump only for package @react-navigation/elements

## [2.1.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.1.2...@react-navigation/elements@2.1.3) (2024-11-25)

**Note:** Version bump only for package @react-navigation/elements

## [2.1.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.1.1...@react-navigation/elements@2.1.2) (2024-11-25)

**Note:** Version bump only for package @react-navigation/elements

## [2.1.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.1.0...@react-navigation/elements@2.1.1) (2024-11-22)

**Note:** Version bump only for package @react-navigation/elements

# [2.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.4...@react-navigation/elements@2.1.0) (2024-11-19)

### Features

* add ref to header search bar ([360247d](https://github.com/react-navigation/react-navigation/commit/360247db2f3f9f28afe572b67dd28d33857d413c)) - by @

## [2.0.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.3...@react-navigation/elements@2.0.4) (2024-11-18)

### Bug Fixes

* `displayMode` description ([#12265](https://github.com/react-navigation/react-navigation/issues/12265)) ([9edabae](https://github.com/react-navigation/react-navigation/commit/9edabaea87ad0b7f2c189b690b1a02661995ca84)) - by @KirillTregubov
* fix deprecation warning for shadow styles on react-native-web ([#12253](https://github.com/react-navigation/react-navigation/issues/12253)) ([4d444f7](https://github.com/react-navigation/react-navigation/commit/4d444f77a446b622d75e6e19a3cf1c024d248a2d)), closes [#000](https://github.com/react-navigation/react-navigation/issues/000) [#000](https://github.com/react-navigation/react-navigation/issues/000) [#000](https://github.com/react-navigation/react-navigation/issues/000) - by @kubabutkiewicz

## [2.0.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.2...@react-navigation/elements@2.0.3) (2024-11-15)

**Note:** Version bump only for package @react-navigation/elements

## [2.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.1...@react-navigation/elements@2.0.2) (2024-11-14)

**Note:** Version bump only for package @react-navigation/elements

## [2.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0...@react-navigation/elements@2.0.1) (2024-11-13)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.26...@react-navigation/elements@2.0.0) (2024-11-06)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.26](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.25...@react-navigation/elements@2.0.0-rc.26) (2024-10-24)

### Bug Fixes

* use * for react-native peer dep to support pre-release versions ([07267e5](https://github.com/react-navigation/react-navigation/commit/07267e54be752f600f808ec2898e5d76a1bc1d43)) - by @satya164

# [2.0.0-rc.25](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.24...@react-navigation/elements@2.0.0-rc.25) (2024-10-11)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.24](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.23...@react-navigation/elements@2.0.0-rc.24) (2024-09-10)

### Features

* use href and precedence to deduplicate styles ([f830228](https://github.com/react-navigation/react-navigation/commit/f8302281a0589a7a774ee2d52d8579c7530f6290)) - by @satya164

# [2.0.0-rc.23](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.22...@react-navigation/elements@2.0.0-rc.23) (2024-09-08)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.22](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.21...@react-navigation/elements@2.0.0-rc.22) (2024-08-09)

### Bug Fixes

* fix alignment for center aligned title ([6e22370](https://github.com/react-navigation/react-navigation/commit/6e223705b8d8cf98b2e6e7fd8119571bffb11c61)) - by @satya164

# [2.0.0-rc.21](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.20...@react-navigation/elements@2.0.0-rc.21) (2024-08-08)

### Bug Fixes

* avoid using column-reverse for header for a11y on web ([3101d04](https://github.com/react-navigation/react-navigation/commit/3101d0406c32163c0576cb5c4712755c01b1a17c)) - by @satya164
* improve custom header in native stack & stack ([7e6b666](https://github.com/react-navigation/react-navigation/commit/7e6b6662342e63d241c1a2e8f57c56a3b5b0cef5)) - by @satya164
* use pointer cursor only on web & iOS ([ce1ce06](https://github.com/react-navigation/react-navigation/commit/ce1ce06df75991cb25f3647bcb3e52e08dfff145)) - by @satya164

### Features

* implement search bar in elements header ([#12097](https://github.com/react-navigation/react-navigation/issues/12097)) ([78b1535](https://github.com/react-navigation/react-navigation/commit/78b1535e01de1b4a1dc462c0690d69d3d39ab964)) - by @satya164

# [2.0.0-rc.20](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.19...@react-navigation/elements@2.0.0-rc.20) (2024-08-07)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.19](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.18...@react-navigation/elements@2.0.0-rc.19) (2024-08-05)

### Features

* add headerBackButtonDisplayMode for stack ([#12090](https://github.com/react-navigation/react-navigation/issues/12090)) ([35cd213](https://github.com/react-navigation/react-navigation/commit/35cd213d366a60afe9955cf10dffb83d9006ce73)) - by @satya164

### BREAKING CHANGES

* This removes the `headerBackTitleVisible` option, and
changes `headerTruncatedBackTitle` to `headerBackTruncatedTitle`.

Similarly, `headerLeft` now receives `displayMode` instead of
`labelVisible`, and `HeaderBackButton` accepts `displayMode` instead of
`labelVisible`

# [2.0.0-rc.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.17...@react-navigation/elements@2.0.0-rc.18) (2024-08-02)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.16...@react-navigation/elements@2.0.0-rc.17) (2024-08-01)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.15...@react-navigation/elements@2.0.0-rc.16) (2024-07-19)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.14...@react-navigation/elements@2.0.0-rc.15) (2024-07-12)

### Bug Fixes

* add masked-view to peerDependencies ([08b3ef1](https://github.com/react-navigation/react-navigation/commit/08b3ef1e16dd85d12f4c75753a7a02774d5f9abf)) - by @

# [2.0.0-rc.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.13...@react-navigation/elements@2.0.0-rc.14) (2024-07-12)

### Bug Fixes

* import from /native instead of /core ([66d5f45](https://github.com/react-navigation/react-navigation/commit/66d5f455b4a09b76c8f06690c1b01e4797eba393)) - by @

# [2.0.0-rc.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.12...@react-navigation/elements@2.0.0-rc.13) (2024-07-11)

### Bug Fixes

* upgrade react-native-builder-bob ([1575287](https://github.com/react-navigation/react-navigation/commit/1575287d40fadb97f33eb19c2914d8be3066b47a)) - by @

# [2.0.0-rc.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.11...@react-navigation/elements@2.0.0-rc.12) (2024-07-11)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.10...@react-navigation/elements@2.0.0-rc.11) (2024-07-10)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.9...@react-navigation/elements@2.0.0-rc.10) (2024-07-08)

### Bug Fixes

* pass correct tint color to header icons ([3c78290](https://github.com/react-navigation/react-navigation/commit/3c7829094760e361b8a6266ccaaa379422779935)) - by @satya164

# [2.0.0-rc.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.8...@react-navigation/elements@2.0.0-rc.9) (2024-07-07)

### Bug Fixes

* add missing exports entry to package.json ([ae16f52](https://github.com/react-navigation/react-navigation/commit/ae16f52adcfb58c59e5735b9caea79b1c2bfa94b)) - by @satya164
* use imports for assets for esm support ([0c37f65](https://github.com/react-navigation/react-navigation/commit/0c37f6517c6cfc224129ad3156bb7db443f265fd)) - by @satya164

# [2.0.0-rc.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.7...@react-navigation/elements@2.0.0-rc.8) (2024-07-04)

### Bug Fixes

* fix published files ([829caa0](https://github.com/react-navigation/react-navigation/commit/829caa019e125811eea5213fd380e8e1bdbe7030)) - by @

# [2.0.0-rc.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.6...@react-navigation/elements@2.0.0-rc.7) (2024-07-04)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.5...@react-navigation/elements@2.0.0-rc.6) (2024-07-04)

### Features

* add package.json exports field ([1435cfe](https://github.com/react-navigation/react-navigation/commit/1435cfe3300767c221ebd4613479ad662d61efee)) - by @

# [2.0.0-rc.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.4...@react-navigation/elements@2.0.0-rc.5) (2024-07-01)

### Bug Fixes

* adjust header shadow color on iOS ([9dc2aca](https://github.com/react-navigation/react-navigation/commit/9dc2acacd4ef52e5dc4ef7d8aebab162f761d74c)) - by @
* stop using react-native field in package.json ([efc33cb](https://github.com/react-navigation/react-navigation/commit/efc33cb0c4830a84ceae034dc1278c54f1faf32d)) - by @

# [2.0.0-rc.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.3...@react-navigation/elements@2.0.0-rc.4) (2024-06-29)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-rc.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.2...@react-navigation/elements@2.0.0-rc.3) (2024-06-28)

### Features

* add hoverEffect prop to Pressable ([c02689a](https://github.com/react-navigation/react-navigation/commit/c02689aef97af89b66f627d2c8b4ba46cb1de9c8)) - by @

# [2.0.0-rc.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.1...@react-navigation/elements@2.0.0-rc.2) (2024-06-28)

### Bug Fixes

* fix types for Link & Button components ([bc9d628](https://github.com/react-navigation/react-navigation/commit/bc9d628efab9ab9986dc38a0ba2868d0fbe64b49)) - by @
* tweak button effects on android & web ([65fa934](https://github.com/react-navigation/react-navigation/commit/65fa9344e57fc7d6602f4b52af7e2cf1e4838ffb)) - by @

# [2.0.0-rc.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-rc.0...@react-navigation/elements@2.0.0-rc.1) (2024-06-28)

### Bug Fixes

* fix header title margin if there's no left button ([ee8bc91](https://github.com/react-navigation/react-navigation/commit/ee8bc911ddc6328d674af1b9e0f27bad31b11b74)) - by @satya164

# [2.0.0-rc.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.17...@react-navigation/elements@2.0.0-rc.0) (2024-06-27)

### Bug Fixes

* add hover effect to buttons on iPad & VisionOS ([2cb77c0](https://github.com/react-navigation/react-navigation/commit/2cb77c0ce42575275dd723555d0ec9ae7be32c66)) - by @satya164
* fix back icon not showing in iOS production builds in Expo, fixes [#11792](https://github.com/react-navigation/react-navigation/issues/11792) ([#12019](https://github.com/react-navigation/react-navigation/issues/12019)) ([5e297a0](https://github.com/react-navigation/react-navigation/commit/5e297a05d7457336ef8f8d1bddaa486b5d8ab4e1)) - by @sparkertime
* fix incorrect header height in bottom tabs ([144f1ac](https://github.com/react-navigation/react-navigation/commit/144f1ac074102c6bae0db9dde5d11c5035b5ec53)) - by @satya164
* remove global in favor of globalThis for better compatibility ([#11976](https://github.com/react-navigation/react-navigation/issues/11976)) ([f497491](https://github.com/react-navigation/react-navigation/commit/f4974919242e7531ddd16da7b6bbf5e9ecfddc4c)) - by @natew
* tweak header so title takes more space ([ee4f516](https://github.com/react-navigation/react-navigation/commit/ee4f516839e99032d2f5b6d4a1f711a7ab5f7da4)) - by @satya164

# [2.0.0-alpha.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.16...@react-navigation/elements@2.0.0-alpha.17) (2024-03-25)

### Features

* pass href to headerLeft function ([ce6d885](https://github.com/react-navigation/react-navigation/commit/ce6d88559e4a1afeafa84fc839892bb846349d67)) - by @satya164

# [2.0.0-alpha.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.15...@react-navigation/elements@2.0.0-alpha.16) (2024-03-22)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-alpha.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.14...@react-navigation/elements@2.0.0-alpha.15) (2024-03-22)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-alpha.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.13...@react-navigation/elements@2.0.0-alpha.14) (2024-03-20)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-alpha.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.12...@react-navigation/elements@2.0.0-alpha.13) (2024-03-14)

### Bug Fixes

* adjust drawer width according to md3 ([a88b2ea](https://github.com/react-navigation/react-navigation/commit/a88b2ea90f56d8dafbd5e1bae6a42fd9b0c73431)) - by @satya164

# [2.0.0-alpha.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.11...@react-navigation/elements@2.0.0-alpha.12) (2024-03-10)

### Bug Fixes

* add a workaround for safe area frame not updating on web ([3799b16](https://github.com/react-navigation/react-navigation/commit/3799b1637067ba69983a8ab7b94f63bffb024d20)), closes [#8551](https://github.com/react-navigation/react-navigation/issues/8551) [#11398](https://github.com/react-navigation/react-navigation/issues/11398) - by @satya164

# [2.0.0-alpha.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.10...@react-navigation/elements@2.0.0-alpha.11) (2024-03-09)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-alpha.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.9...@react-navigation/elements@2.0.0-alpha.10) (2024-03-08)

### Bug Fixes

* update drawer and header styles according to material design 3 ([#11872](https://github.com/react-navigation/react-navigation/issues/11872)) ([bfa5689](https://github.com/react-navigation/react-navigation/commit/bfa568995940f956c9ec5944f2b0543eca5da546)) - by @groot007

# [2.0.0-alpha.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.8...@react-navigation/elements@2.0.0-alpha.9) (2024-03-04)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-alpha.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.7...@react-navigation/elements@2.0.0-alpha.8) (2024-02-24)

### Bug Fixes

* fix peer dependency versions ([4b93b63](https://github.com/react-navigation/react-navigation/commit/4b93b6335ce180fe879f9fbe8f2400426b5484fb)) - by @

# [2.0.0-alpha.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.6...@react-navigation/elements@2.0.0-alpha.7) (2024-02-23)

### Bug Fixes

* **iOS:** disable collapsable option from Background in Screen ([#11840](https://github.com/react-navigation/react-navigation/issues/11840)) ([c1e327c](https://github.com/react-navigation/react-navigation/commit/c1e327ca40679ff9356a38e5ef96e349f323fb94)), closes [#1997](https://github.com/react-navigation/react-navigation/issues/1997) - by @tboba

# [2.0.0-alpha.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.5...@react-navigation/elements@2.0.0-alpha.6) (2024-02-23)

### Bug Fixes

* fix header height for iOS devices with dynamic island ([#11786](https://github.com/react-navigation/react-navigation/issues/11786)) ([4c521b5](https://github.com/react-navigation/react-navigation/commit/4c521b5c865f2c46d58abb2e9e7fd1b0d2074215)), closes [#11655](https://github.com/react-navigation/react-navigation/issues/11655) - by @gianlucalippolis

### Features

* add a HeaderButton component to elements ([d8de228](https://github.com/react-navigation/react-navigation/commit/d8de228bafc9408855bdfdfcd48bbb10195501fb)) - by @satya164

# [2.0.0-alpha.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.4...@react-navigation/elements@2.0.0-alpha.5) (2024-01-17)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-alpha.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.3...@react-navigation/elements@2.0.0-alpha.4) (2023-11-17)

### Bug Fixes

* darken the tint color for light colored button text ([d5e6b9e](https://github.com/react-navigation/react-navigation/commit/d5e6b9eaa0f3d347e2449ff8459bad8274de653e)) - by @satya164
* update peer dependencies when publishing ([c440703](https://github.com/react-navigation/react-navigation/commit/c44070310f875e488708f2a6c52ffddcea05b0e6)) - by @

# [2.0.0-alpha.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.2...@react-navigation/elements@2.0.0-alpha.3) (2023-11-12)

### Bug Fixes

* headerHeight on phones with dynamic island ([#11338](https://github.com/react-navigation/react-navigation/issues/11338)) ([e4815c5](https://github.com/react-navigation/react-navigation/commit/e4815c538536ddccf4207b87bf3e2f1603dedd84)), closes [#10989](https://github.com/react-navigation/react-navigation/issues/10989) - by @dylancom

### Features

* add a button element to elements package  ([#11669](https://github.com/react-navigation/react-navigation/issues/11669)) ([25a85c9](https://github.com/react-navigation/react-navigation/commit/25a85c90384ddfb6db946e791c01d8e033e04aa6)) - by @satya164

# [2.0.0-alpha.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.1...@react-navigation/elements@2.0.0-alpha.2) (2023-09-25)

**Note:** Version bump only for package @react-navigation/elements

# [2.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@2.0.0-alpha.0...@react-navigation/elements@2.0.0-alpha.1) (2023-09-13)

### Features

* add option to show tabs on the side ([#11578](https://github.com/react-navigation/react-navigation/issues/11578)) ([cd15fda](https://github.com/react-navigation/react-navigation/commit/cd15fdafe7acc428826bd5106c7ba62c1b5153ca)) - by @satya164

# [2.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.4.0-alpha.1...@react-navigation/elements@2.0.0-alpha.0) (2023-09-07)

### Bug Fixes

* add default value to labelVisible in HeaderBackBox ([#11308](https://github.com/react-navigation/react-navigation/issues/11308)) ([bd96d89](https://github.com/react-navigation/react-navigation/commit/bd96d896f17a9930bf9c44ec176ab77ac7138bed)) - by @gkasdorf
* Allow to use `PlatformColor` in the theme ([#11570](https://github.com/react-navigation/react-navigation/issues/11570)) ([64734e7](https://github.com/react-navigation/react-navigation/commit/64734e7bc0d7f203d8e5db6abcc9a88157a5f16c)) - by @retyui
* make back button ripple visible ([#11386](https://github.com/react-navigation/react-navigation/issues/11386)) ([c43208f](https://github.com/react-navigation/react-navigation/commit/c43208fc196169e2bf5cea9e2530f5a37bf666bb)), closes [#9794](https://github.com/react-navigation/react-navigation/issues/9794) - by @vonovak

* feat!: add a direction prop to NavigationContainer to specify rtl (#11393) ([8309636](https://github.com/react-navigation/react-navigation/commit/830963653fb5a489d02f1503222629373319b39e)), closes [#11393](https://github.com/react-navigation/react-navigation/issues/11393) - by @satya164

### Features

* add animation prop to bottom tab ([#11323](https://github.com/react-navigation/react-navigation/issues/11323)) ([8d2a6d8](https://github.com/react-navigation/react-navigation/commit/8d2a6d8ef642872d3d506dca483b7474471a040c)) - by @teneeto
* add shifting animation to bottom-tabs and various fixes ([#11581](https://github.com/react-navigation/react-navigation/issues/11581)) ([6d93c2d](https://github.com/react-navigation/react-navigation/commit/6d93c2da661e1991f6e60f25abf137110a005509)) - by @satya164

### BREAKING CHANGES

* Previously the navigators tried to detect RTL automatically and adjust the UI. However this is problematic since we cannot detect RTL in all cases (e.g. on Web).

This adds an optional `direction` prop to `NavigationContainer` instead so that user can specify when React Navigation's UI needs to be adjusted for RTL. It defaults to the value from `I18nManager` on native platforms, however it needs to be explicitly passed for Web.

# [1.4.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.4.0-alpha.0...@react-navigation/elements@1.4.0-alpha.1) (2023-06-22)

**Note:** Version bump only for package @react-navigation/elements

# [1.4.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.9-alpha.0...@react-navigation/elements@1.4.0-alpha.0) (2023-03-01)

### Bug Fixes

* fix paths in sourcemap files ([368e069](https://github.com/react-navigation/react-navigation/commit/368e0691b9fb07d4b1cbe71cfe4c2f40512f93ad)) - by @satya164

### Features

* add ability to customize the fonts with the theme ([#11243](https://github.com/react-navigation/react-navigation/issues/11243)) ([1cd6836](https://github.com/react-navigation/react-navigation/commit/1cd6836f1d10bcdf7f96d9e4b9f7de0ddea9391f)) - by @satya164

## [1.3.9-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.7...@react-navigation/elements@1.3.9-alpha.0) (2023-02-17)

**Note:** Version bump only for package @react-navigation/elements

## [1.3.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.6...@react-navigation/elements@1.3.7) (2022-11-21)

### Bug Fixes

* add accessibility props to NativeStack screens ([#11022](https://github.com/react-navigation/react-navigation/issues/11022)) ([3ab05af](https://github.com/react-navigation/react-navigation/commit/3ab05afeb6412b8e5566270442ac14a463136620))
* supersede Platform.isTVOS for Platform.isTV ([#10973](https://github.com/react-navigation/react-navigation/issues/10973)) ([1846de6](https://github.com/react-navigation/react-navigation/commit/1846de6bd8247992286d39ee76e65f27debb1754))

## [1.3.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.4...@react-navigation/elements@1.3.6) (2022-09-16)

### Bug Fixes

* replace deprecated I18nManager.isRTL with 18nManager.getConstants().isRTL ([#10547](https://github.com/react-navigation/react-navigation/issues/10547)) ([50b88d4](https://github.com/react-navigation/react-navigation/commit/50b88d40496a04f613073c63119b21a104ec9bc2))

## [1.3.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.4...@react-navigation/elements@1.3.5) (2022-08-24)

### Bug Fixes

* replace deprecated I18nManager.isRTL with 18nManager.getConstants().isRTL ([#10547](https://github.com/react-navigation/react-navigation/issues/10547)) ([50b88d4](https://github.com/react-navigation/react-navigation/commit/50b88d40496a04f613073c63119b21a104ec9bc2))

## [1.3.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.3...@react-navigation/elements@1.3.4) (2022-07-05)

### Bug Fixes

* ensure same @types/react version in repo ([#10663](https://github.com/react-navigation/react-navigation/issues/10663)) ([e662465](https://github.com/react-navigation/react-navigation/commit/e6624653fbbd931158dbebd17142abf9637205b6)), closes [#10655](https://github.com/react-navigation/react-navigation/issues/10655)

## [1.3.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.2...@react-navigation/elements@1.3.3) (2022-04-01)

**Note:** Version bump only for package @react-navigation/elements

## [1.3.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.1...@react-navigation/elements@1.3.2) (2022-04-01)

### Bug Fixes

* fix type errors when passing animated styles to header ([9058b1c](https://github.com/react-navigation/react-navigation/commit/9058b1c22f4fc1358c72d67150a0e3f37ff802e7))

## [1.3.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.3.0...@react-navigation/elements@1.3.1) (2022-02-02)

**Note:** Version bump only for package @react-navigation/elements

# [1.3.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.2.1...@react-navigation/elements@1.3.0) (2022-01-29)

### Bug Fixes

* fix exposing custom header height with modals ([3b4edf7](https://github.com/react-navigation/react-navigation/commit/3b4edf7a8dfefb06a7ae1db2cbad48a5b19630bb))

### Features

* **native-stack:** add support for header background image ([393773b](https://github.com/react-navigation/react-navigation/commit/393773b688247456d09f397a794eff19424502f6))
* pass canGoBack to headerRight ([82a1669](https://github.com/react-navigation/react-navigation/commit/82a16690973a7935939a25a66d5786955b6c8ba7))

## [1.2.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.2.0...@react-navigation/elements@1.2.1) (2021-10-12)

**Note:** Version bump only for package @react-navigation/elements

# [1.2.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.1.2...@react-navigation/elements@1.2.0) (2021-10-09)

### Features

* add a headerShadowVisible option to header ([8e7ba69](https://github.com/react-navigation/react-navigation/commit/8e7ba692661b69f93768add4c103bc31c814327c))

## [1.1.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.1.1...@react-navigation/elements@1.1.2) (2021-09-26)

**Note:** Version bump only for package @react-navigation/elements

## [1.1.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.1.0...@react-navigation/elements@1.1.1) (2021-09-26)

### Bug Fixes

* resized view never re-appears on macos. fixes [#9889](https://github.com/react-navigation/react-navigation/issues/9889) ([#9904](https://github.com/react-navigation/react-navigation/issues/9904)) ([0dde476](https://github.com/react-navigation/react-navigation/commit/0dde476906006e84d42d754d06a4681633e9fb4b))

# [1.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.4...@react-navigation/elements@1.1.0) (2021-08-17)

### Features

* **elements:** add style to SafeAreaProviderCompat props ([#9793](https://github.com/react-navigation/react-navigation/issues/9793)) ([f73aa55](https://github.com/react-navigation/react-navigation/commit/f73aa55fb2b7e7ca65d5f66269a43281f7ce0680))

## [1.0.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.3...@react-navigation/elements@1.0.4) (2021-08-11)

### Bug Fixes

* fix headerTransparent not working outside stack navigator ([42c43ff](https://github.com/react-navigation/react-navigation/commit/42c43ff7617112afd223ecb323be622666c79096))

## [1.0.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.2...@react-navigation/elements@1.0.3) (2021-08-09)

### Bug Fixes

* avoid overflowing long titles ([bacdbbd](https://github.com/react-navigation/react-navigation/commit/bacdbbdd7c5df73b84aa1ed8c0329c9525d0fdba))
* pass onlayout to headerTitle ([#9808](https://github.com/react-navigation/react-navigation/issues/9808)) ([a79ce57](https://github.com/react-navigation/react-navigation/commit/a79ce57aa7f9be3a47a09728e920c0d4a805f5aa))

## [1.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.1...@react-navigation/elements@1.0.2) (2021-08-07)

**Note:** Version bump only for package @react-navigation/elements

## [1.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0...@react-navigation/elements@1.0.1) (2021-08-03)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.21...@react-navigation/elements@1.0.0) (2021-08-01)

### Bug Fixes

* match native iOS header height in stack ([51b636d](https://github.com/react-navigation/react-navigation/commit/51b636d7268fc05a8a9aca9e6aad0161674f238e))

### Features

* basic web implementation for native stack ([de84458](https://github.com/react-navigation/react-navigation/commit/de8445896021da4865089ba44e95afffbcee0919))
* expose header height in native-stack ([#9774](https://github.com/react-navigation/react-navigation/issues/9774)) ([20abccd](https://github.com/react-navigation/react-navigation/commit/20abccda0d5074f61b2beb555b881a2087d27bb0))

# [1.0.0-next.21](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.20...@react-navigation/elements@1.0.0-next.21) (2021-07-16)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.20](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.19...@react-navigation/elements@1.0.0-next.20) (2021-07-16)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.19](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.17...@react-navigation/elements@1.0.0-next.19) (2021-07-01)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.17...@react-navigation/elements@1.0.0-next.18) (2021-06-10)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.16...@react-navigation/elements@1.0.0-next.17) (2021-06-01)

### Bug Fixes

* tweak opacity animation for PlatformPressable ([b46c433](https://github.com/react-navigation/react-navigation/commit/b46c433f1e012fc3215ec32ac787c7c018963505))

# [1.0.0-next.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.15...@react-navigation/elements@1.0.0-next.16) (2021-05-29)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.14...@react-navigation/elements@1.0.0-next.15) (2021-05-29)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.13...@react-navigation/elements@1.0.0-next.14) (2021-05-27)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.12...@react-navigation/elements@1.0.0-next.13) (2021-05-26)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.11...@react-navigation/elements@1.0.0-next.12) (2021-05-25)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.10...@react-navigation/elements@1.0.0-next.11) (2021-05-23)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.9...@react-navigation/elements@1.0.0-next.10) (2021-05-16)

### Bug Fixes

* fix drawer content padding in RTL ([ea8ea20](https://github.com/react-navigation/react-navigation/commit/ea8ea20127d979d8c8ddbddf56de1bdfdf0243f9))

# [1.0.0-next.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.8...@react-navigation/elements@1.0.0-next.9) (2021-05-10)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.7...@react-navigation/elements@1.0.0-next.8) (2021-05-09)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.6...@react-navigation/elements@1.0.0-next.7) (2021-05-09)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.5...@react-navigation/elements@1.0.0-next.6) (2021-05-09)

### Bug Fixes

* animate pressable opacity ([459fd27](https://github.com/react-navigation/react-navigation/commit/459fd270503075343b71ad446efdc2517eedcf21))

# [1.0.0-next.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.4...@react-navigation/elements@1.0.0-next.5) (2021-05-01)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.3...@react-navigation/elements@1.0.0-next.4) (2021-04-08)

**Note:** Version bump only for package @react-navigation/elements

# [1.0.0-next.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.2...@react-navigation/elements@1.0.0-next.3) (2021-03-22)

### Features

* add a Background component ([cbaabc1](https://github.com/react-navigation/react-navigation/commit/cbaabc1288e780698e499a00b9ca06ab9746a0da))

# [1.0.0-next.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0-next.1...@react-navigation/elements@1.0.0-next.2) (2021-03-12)

### Bug Fixes

* use theme in PlatformPressable ([40439cc](https://github.com/react-navigation/react-navigation/commit/40439ccb420825a1aa480648526a816f2422ea6e))

### Features

* return nearest parent header height for useHeaderHeight ([24b3f73](https://github.com/react-navigation/react-navigation/commit/24b3f739da4b8af8dca77d92c72cfdaa762e564a))

# [1.0.0-next.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/elements@1.0.0...@react-navigation/elements@1.0.0-next.1) (2021-03-10)

### Bug Fixes

* fix peer dep versions ([72f90b5](https://github.com/react-navigation/react-navigation/commit/72f90b50d27eda1315bb750beca8a36f26dafe17))

# 1.0.0-next.0 (2021-03-09)

### Bug Fixes

* show a missing icon symbol instead of empty area in bottom tab bar ([2bc4882](https://github.com/react-navigation/react-navigation/commit/2bc4882692be9f02d781639892e1f98b891811c4))

### Features

* initial implementation of @react-navigation/elements ([07ba7a9](https://github.com/react-navigation/react-navigation/commit/07ba7a96870efdb8acf99eb82ba0b1d3eac90bab))
