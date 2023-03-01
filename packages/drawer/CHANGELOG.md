# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@7.0.0-alpha.0...@react-navigation/drawer@7.0.0-alpha.1) (2023-03-01)

### Bug Fixes

* fix paths in sourcemap files ([368e069](https://github.com/react-navigation/react-navigation/commit/368e0691b9fb07d4b1cbe71cfe4c2f40512f93ad)) - by @satya164

### Features

* add ability to customize the fonts with the theme ([#11243](https://github.com/react-navigation/react-navigation/issues/11243)) ([1cd6836](https://github.com/react-navigation/react-navigation/commit/1cd6836f1d10bcdf7f96d9e4b9f7de0ddea9391f)) - by @satya164
* add gesture and transition events to drawer ([#11240](https://github.com/react-navigation/react-navigation/issues/11240)) ([50b94e4](https://github.com/react-navigation/react-navigation/commit/50b94e4f9518975b4fc7b46fe14d387bd9b17c7e)) - by @BeeMargarida

# [7.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.5.1...@react-navigation/drawer@7.0.0-alpha.0) (2023-02-17)

### Bug Fixes

* added close drawer accessibility tap area ([#11184](https://github.com/react-navigation/react-navigation/issues/11184)) ([20ec204](https://github.com/react-navigation/react-navigation/commit/20ec2042b9d3c22388682c16fca4ef23e91ee011)) - by @mikegarfinkle
* drawerstatuscontext should be exported ([#11041](https://github.com/react-navigation/react-navigation/issues/11041)) ([6e4cb06](https://github.com/react-navigation/react-navigation/commit/6e4cb06cc0e3de4d5fb3b8f2051f09fdc8aec53e)) - by @leonchabbey
* fix overlay not receiving clicks on web ([666c8db](https://github.com/react-navigation/react-navigation/commit/666c8dbad8f8d04b1c252f0b86e234b4a1133039)) - by @satya164

### Code Refactoring

* drop react-native-flipper-plugin ([643b8e8](https://github.com/react-navigation/react-navigation/commit/643b8e83b7eeb119b0a339fd8866d790d3178f50)), closes [/github.com/react-native-community/discussions-and-proposals/discussions/546#discussioncomment-4178951](https://github.com//github.com/react-native-community/discussions-and-proposals/discussions/546/issues/discussioncomment-4178951) - by @satya164

* refactor!: improve the API for Link component ([7f35837](https://github.com/react-navigation/react-navigation/commit/7f3583793ad17475531e155f1f433ffa16547015)) - by @satya164

### Features

* add testID and accessibilityLabel to DrawerItem ([#11168](https://github.com/react-navigation/react-navigation/issues/11168)) ([4471fa0](https://github.com/react-navigation/react-navigation/commit/4471fa035dbd79d984888866791c34937693814d)) - by @andrewtremblay
* extract drawer to a separate package ([58b7cae](https://github.com/react-navigation/react-navigation/commit/58b7caeaad00eafbcda36561e75e538e0f02c4af)) - by @satya164

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
* React Native team is focusing on migrating away from Flipper. So it doesn't make much sense for us to spend additional resources to support the Flipper plugin.

## [6.5.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.5.0...@react-navigation/drawer@6.5.1) (2022-11-21)

### Bug Fixes

* add accessibility props to NativeStack screens ([#11022](https://github.com/react-navigation/react-navigation/issues/11022)) ([3ab05af](https://github.com/react-navigation/react-navigation/commit/3ab05afeb6412b8e5566270442ac14a463136620))
* only call onGestureStart when criteria met in drawer ([#10929](https://github.com/react-navigation/react-navigation/issues/10929)) ([9041069](https://github.com/react-navigation/react-navigation/commit/9041069ec495e7a58aead43dc11ad8b97b3b34dd))

# [6.5.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.4.3...@react-navigation/drawer@6.5.0) (2022-09-16)

### Bug Fixes

* add helpful error when using legacy implementation with Reanimated v3 ([#10693](https://github.com/react-navigation/react-navigation/issues/10693)) ([d19987b](https://github.com/react-navigation/react-navigation/commit/d19987b0574975df434aa54e0f1c1fba62e7aaa3))
* export `PanGestureHandlerGestureEvent` as a type ([#10814](https://github.com/react-navigation/react-navigation/issues/10814)) ([f3d06ba](https://github.com/react-navigation/react-navigation/commit/f3d06ba7c3393fcdb30ad5cf515565cd5196b3f0))
* fix isRTL check in drawer ([2d2f4e3](https://github.com/react-navigation/react-navigation/commit/2d2f4e3a53a08b02866780e880338bf347092ff2))
* replace deprecated I18nManager.isRTL with 18nManager.getConstants().isRTL ([#10547](https://github.com/react-navigation/react-navigation/issues/10547)) ([50b88d4](https://github.com/react-navigation/react-navigation/commit/50b88d40496a04f613073c63119b21a104ec9bc2))

### Features

* add freezeOnBlur prop  ([#10834](https://github.com/react-navigation/react-navigation/issues/10834)) ([e13b4d9](https://github.com/react-navigation/react-navigation/commit/e13b4d9341362512ba4bf921a17552f3be8735c1))

## [6.4.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.4.3...@react-navigation/drawer@6.4.4) (2022-08-24)

### Bug Fixes

* add helpful error when using legacy implementation with Reanimated v3 ([#10693](https://github.com/react-navigation/react-navigation/issues/10693)) ([d19987b](https://github.com/react-navigation/react-navigation/commit/d19987b0574975df434aa54e0f1c1fba62e7aaa3))
* fix isRTL check in drawer ([2d2f4e3](https://github.com/react-navigation/react-navigation/commit/2d2f4e3a53a08b02866780e880338bf347092ff2))
* replace deprecated I18nManager.isRTL with 18nManager.getConstants().isRTL ([#10547](https://github.com/react-navigation/react-navigation/issues/10547)) ([50b88d4](https://github.com/react-navigation/react-navigation/commit/50b88d40496a04f613073c63119b21a104ec9bc2))

## [6.4.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.4.2...@react-navigation/drawer@6.4.3) (2022-07-05)

### Bug Fixes

* ensure same @types/react version in repo ([#10663](https://github.com/react-navigation/react-navigation/issues/10663)) ([e662465](https://github.com/react-navigation/react-navigation/commit/e6624653fbbd931158dbebd17142abf9637205b6)), closes [#10655](https://github.com/react-navigation/react-navigation/issues/10655)

## [6.4.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.4.1...@react-navigation/drawer@6.4.2) (2022-06-23)

### Bug Fixes

* detach drawer open/close from animation ([#10647](https://github.com/react-navigation/react-navigation/issues/10647)) ([68a4e53](https://github.com/react-navigation/react-navigation/commit/68a4e53a6c16b6a0f627270fe082d9f72f83539d)), closes [#10504](https://github.com/react-navigation/react-navigation/issues/10504) [#10410](https://github.com/react-navigation/react-navigation/issues/10410)

## [6.4.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.4.0...@react-navigation/drawer@6.4.1) (2022-04-01)

**Note:** Version bump only for package @react-navigation/drawer

# [6.4.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.3.3...@react-navigation/drawer@6.4.0) (2022-04-01)

### Features

* add an ID prop to navigators ([4e4935a](https://github.com/react-navigation/react-navigation/commit/4e4935ac2584bc1a00209609cc026fa73e12c10a))

## [6.3.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.3.2...@react-navigation/drawer@6.3.3) (2022-03-26)

### Bug Fixes

* **drawer:** fix drawer clearing interaction handle ([#10413](https://github.com/react-navigation/react-navigation/issues/10413)) ([ee7405e](https://github.com/react-navigation/react-navigation/commit/ee7405ee7e43539fc78f466b9f769b1834b4af49))

## [6.3.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.3.1...@react-navigation/drawer@6.3.2) (2022-03-25)

### Bug Fixes

* don't force legacy implementation on chrome debugger ([94730e0](https://github.com/react-navigation/react-navigation/commit/94730e0b69513481265a80375bbfd8198b5a9627))
* fix drawer in RTL and when on right. fixes [#10335](https://github.com/react-navigation/react-navigation/issues/10335) ([a3fad5b](https://github.com/react-navigation/react-navigation/commit/a3fad5b37b4fbb194071b25286767a81d52f8096))
* remove unsupported option from types ([08c61ad](https://github.com/react-navigation/react-navigation/commit/08c61ad9305a20d894ea0a67a620cf5b4440fdcd))

## [6.3.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.3.0...@react-navigation/drawer@6.3.1) (2022-02-07)

### Bug Fixes

* fix checking whether reanimated 2 is configured ([ba868fc](https://github.com/react-navigation/react-navigation/commit/ba868fcc87035958dd3250e81691f1f3098be033))

# [6.3.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.2.0...@react-navigation/drawer@6.3.0) (2022-02-02)

### Bug Fixes

* **drawer:** fix drawer when changing `drawerType` (ex: front -> permanent) ([#10304](https://github.com/react-navigation/react-navigation/issues/10304)) ([6f7c287](https://github.com/react-navigation/react-navigation/commit/6f7c287f4a2952b34caf2c52afa096776adaec74)), closes [#10305](https://github.com/react-navigation/react-navigation/issues/10305)

### Features

* add drawerAllowFontScaling prop to drawer package ([#10041](https://github.com/react-navigation/react-navigation/issues/10041)) ([bd7786e](https://github.com/react-navigation/react-navigation/commit/bd7786e197618353c40b5176486ae15763fa9973))
* add prop for new container ([#9772](https://github.com/react-navigation/react-navigation/issues/9772)) ([3fb2140](https://github.com/react-navigation/react-navigation/commit/3fb21409d6d0b66266c6d5eded2014ef2ebbda0a))
* add the 'drawerPress' event ([#9529](https://github.com/react-navigation/react-navigation/issues/9529)) ([0c86f76](https://github.com/react-navigation/react-navigation/commit/0c86f76401e06557d9ff76613ebfde832259f1d7))

# [6.2.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.1.8...@react-navigation/drawer@6.2.0) (2022-01-29)

### Bug Fixes

* fix drawer disappearing on web when switching drawerType ([5246574](https://github.com/react-navigation/react-navigation/commit/524657484e6b21ecc5754b63468dd00304a8e450)), closes [#10210](https://github.com/react-navigation/react-navigation/issues/10210)
* fix useDrawerStatus typings ([#10163](https://github.com/react-navigation/react-navigation/issues/10163)) ([a11ada8](https://github.com/react-navigation/react-navigation/commit/a11ada84604848090ec374990023d0a352628388)), closes [#10066](https://github.com/react-navigation/react-navigation/issues/10066)

### Features

* **native-stack:** export NativeStackView to support custom routers on native-stack ([#10260](https://github.com/react-navigation/react-navigation/issues/10260)) ([7b761f1](https://github.com/react-navigation/react-navigation/commit/7b761f1cc069ca68b96b5155be726024a345346f))

## [6.1.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.1.7...@react-navigation/drawer@6.1.8) (2021-10-12)

### Bug Fixes

* add some a11y props to drawer overlay ([5f94c1d](https://github.com/react-navigation/react-navigation/commit/5f94c1d6c421a7d6f8781c5188b4f2a654c338d2))
* don't make the overlay touchable if drawer isn't open ([7c99b9d](https://github.com/react-navigation/react-navigation/commit/7c99b9d631d76f55939deb534ff62e7fc8b5ed50))
* move [@ts-expect-error](https://github.com/ts-expect-error) to body to avoid issue in type definitions ([0a08688](https://github.com/react-navigation/react-navigation/commit/0a0868862c9d6ae77055c66938a764306d391b44))

## [6.1.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.1.6...@react-navigation/drawer@6.1.7) (2021-10-09)

### Bug Fixes

* properly handle history if drawer is open by default ([de2d4e4](https://github.com/react-navigation/react-navigation/commit/de2d4e4f0659fea87522b918fb09c8f07bdd0697))

## [6.1.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.1.5...@react-navigation/drawer@6.1.6) (2021-09-26)

**Note:** Version bump only for package @react-navigation/drawer

## [6.1.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.1.4...@react-navigation/drawer@6.1.5) (2021-09-26)

### Bug Fixes

* export header props for other navigators ([8475481](https://github.com/react-navigation/react-navigation/commit/84754812effd8bee576c5d9836c317889dabe11a)), closes [#9965](https://github.com/react-navigation/react-navigation/issues/9965)
* in cases where the drawer type is set to be permanent, do not apply any transformations ([2a88d0d](https://github.com/react-navigation/react-navigation/commit/2a88d0d5ee2f504e8b4f95a11eac77c764844352))

## [6.1.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.1.3...@react-navigation/drawer@6.1.4) (2021-08-17)

**Note:** Version bump only for package @react-navigation/drawer

## [6.1.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.1.2...@react-navigation/drawer@6.1.3) (2021-08-11)

### Bug Fixes

* use correct tint and background color from drawer items ([f8fddac](https://github.com/react-navigation/react-navigation/commit/f8fddac79d0f95aa4ece6b1c7645619f5497a112))

## [6.1.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.1.1...@react-navigation/drawer@6.1.2) (2021-08-11)

### Bug Fixes

* fix headerTransparent not working outside stack navigator ([42c43ff](https://github.com/react-navigation/react-navigation/commit/42c43ff7617112afd223ecb323be622666c79096))

## [6.1.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.1.0...@react-navigation/drawer@6.1.1) (2021-08-09)

**Note:** Version bump only for package @react-navigation/drawer

# [6.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.1...@react-navigation/drawer@6.1.0) (2021-08-07)

### Bug Fixes

* blink while switching screens ([#9705](https://github.com/react-navigation/react-navigation/issues/9705)) ([99735e1](https://github.com/react-navigation/react-navigation/commit/99735e1b730a2f308ba00dcaef54d5ec14769a3d))

### Features

* use forwardRef with DrawerContentScrollView ([#9695](https://github.com/react-navigation/react-navigation/issues/9695)) ([ebb5f24](https://github.com/react-navigation/react-navigation/commit/ebb5f246645246b445b1fd22d8ae8fe87d3d7c52)), closes [#9350](https://github.com/react-navigation/react-navigation/issues/9350)

## [6.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0...@react-navigation/drawer@6.0.1) (2021-08-03)

### Bug Fixes

* preserve params when switching tabs. fixes [#9782](https://github.com/react-navigation/react-navigation/issues/9782) ([98fa233](https://github.com/react-navigation/react-navigation/commit/98fa2330146457045c01af820c6d8e8cb955f9d1))

# [6.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.21...@react-navigation/drawer@6.0.0) (2021-08-01)

### Bug Fixes

* add deprecation warning for openByDefault ([9506ad1](https://github.com/react-navigation/react-navigation/commit/9506ad1f001b3ed295a36c6744ed17459fa193e4))

# [6.0.0-next.21](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.20...@react-navigation/drawer@6.0.0-next.21) (2021-07-16)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.20](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.19...@react-navigation/drawer@6.0.0-next.20) (2021-07-16)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.19](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.17...@react-navigation/drawer@6.0.0-next.19) (2021-07-01)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.18](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.17...@react-navigation/drawer@6.0.0-next.18) (2021-06-10)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.16...@react-navigation/drawer@6.0.0-next.17) (2021-06-01)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.15...@react-navigation/drawer@6.0.0-next.16) (2021-05-29)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.14...@react-navigation/drawer@6.0.0-next.15) (2021-05-29)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.13...@react-navigation/drawer@6.0.0-next.14) (2021-05-27)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.12...@react-navigation/drawer@6.0.0-next.13) (2021-05-26)

### Features

* add screenListeners prop on navigators similar to screenOptions ([cde44a5](https://github.com/react-navigation/react-navigation/commit/cde44a5785444a121aa08f94af9f8fe4fc89910a))

# [6.0.0-next.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.11...@react-navigation/drawer@6.0.0-next.12) (2021-05-25)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.10...@react-navigation/drawer@6.0.0-next.11) (2021-05-23)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.9...@react-navigation/drawer@6.0.0-next.10) (2021-05-16)

### Bug Fixes

* fix drawer content padding in RTL ([ea8ea20](https://github.com/react-navigation/react-navigation/commit/ea8ea20127d979d8c8ddbddf56de1bdfdf0243f9))

# [6.0.0-next.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.8...@react-navigation/drawer@6.0.0-next.9) (2021-05-10)

### Bug Fixes

* add a deprecation warning for mode prop in stack ([a6e4981](https://github.com/react-navigation/react-navigation/commit/a6e498170f59648190fa5513e273ca523e56c5d5))

### Features

* return a NavigationContent component from useNavigationBuilder ([1179d56](https://github.com/react-navigation/react-navigation/commit/1179d56c5008270753feef41acdc1dbd2191efcf))

# [6.0.0-next.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.7...@react-navigation/drawer@6.0.0-next.8) (2021-05-09)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.6...@react-navigation/drawer@6.0.0-next.7) (2021-05-09)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.5...@react-navigation/drawer@6.0.0-next.6) (2021-05-09)

### Bug Fixes

* enable screens only on supported platforms ([#9494](https://github.com/react-navigation/react-navigation/issues/9494)) ([8da4c58](https://github.com/react-navigation/react-navigation/commit/8da4c58065607d44e9dc1ad8943e09537598dcd7))
* make sure disabling react-native-screens works ([a369ba3](https://github.com/react-navigation/react-navigation/commit/a369ba36451ddc2bb5b247e61b725bce1e3fb5e5))

# [6.0.0-next.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.4...@react-navigation/drawer@6.0.0-next.5) (2021-05-01)

**Note:** Version bump only for package @react-navigation/drawer

# [6.0.0-next.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.3...@react-navigation/drawer@6.0.0-next.4) (2021-04-08)

### Bug Fixes

* don't handle back button with permanent drawer ([b893968](https://github.com/react-navigation/react-navigation/commit/b89396888f46ba79af3cfd84be55fba79d8387d2))
* fix drawer overlay on web ([3241190](https://github.com/react-navigation/react-navigation/commit/3241190b19946c1cd0a744fb09a19d79ba683d74))
* only handle back button in drawer when focused ([5ae0bad](https://github.com/react-navigation/react-navigation/commit/5ae0badc44b576d464f8841822a911b18a698403))

# [6.0.0-next.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.2...@react-navigation/drawer@6.0.0-next.3) (2021-03-22)

### Features

* add a Background component ([cbaabc1](https://github.com/react-navigation/react-navigation/commit/cbaabc1288e780698e499a00b9ca06ab9746a0da))

# [6.0.0-next.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0-next.1...@react-navigation/drawer@6.0.0-next.2) (2021-03-12)

### Features

* export drawer button ([2c8401d](https://github.com/react-navigation/react-navigation/commit/2c8401d5cb347d37c96e5b30f8ad05c17fd22ea4))

# [6.0.0-next.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@6.0.0...@react-navigation/drawer@6.0.0-next.1) (2021-03-10)

### Bug Fixes

* fix peer dep versions ([72f90b5](https://github.com/react-navigation/react-navigation/commit/72f90b50d27eda1315bb750beca8a36f26dafe17))

# [6.0.0-next.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.11.2...@react-navigation/drawer@6.0.0-next.0) (2021-03-09)

### Bug Fixes

* add missing helper types in descriptors ([21a1154](https://github.com/react-navigation/react-navigation/commit/21a11543bf41c4559c2570d5accc0bbb3b67eb8d))
* drop usage of Dimensions in favor of metrics from safe-area-context ([12b893d](https://github.com/react-navigation/react-navigation/commit/12b893d7ca8cdb726b973972797658ac9c7d17d7))
* enable detachInactiveScreens by default on web for better a11y ([4954d6a](https://github.com/react-navigation/react-navigation/commit/4954d6aae3cdbb5855d44ff17d80d16b81fb224e))
* fix drawer and bottom tabs not being visible on web. closes [#9225](https://github.com/react-navigation/react-navigation/issues/9225) ([b735de1](https://github.com/react-navigation/react-navigation/commit/b735de153ca650240625dba6d8b5c8d16b913bac))
* fix drawer screen content not being interactable on Android ([865d8b3](https://github.com/react-navigation/react-navigation/commit/865d8b3e51e117a01243966c160b7cd147d236ac))
* fix initial metrics on server ([69d333f](https://github.com/react-navigation/react-navigation/commit/69d333f6c23e0c37eaf4d3f8b413e8f96d6827f8))
* fix pointerEvents in ResourceSavingScene ([af53dd6](https://github.com/react-navigation/react-navigation/commit/af53dd6548630124f831446e0eee468da5d9bf5e)), closes [#9241](https://github.com/react-navigation/react-navigation/issues/9241) [#9242](https://github.com/react-navigation/react-navigation/issues/9242)
* fix typo for default prop in drawer ([b376e9c](https://github.com/react-navigation/react-navigation/commit/b376e9c5ed7097cea25c957d1de75f84cc9ea9f0))

### Code Refactoring

* don't use a boolean for drawer status ([cda6397](https://github.com/react-navigation/react-navigation/commit/cda6397b8989c552824eca4175577527c9d72f93))
* don't use absolute position for header ([79a85a4](https://github.com/react-navigation/react-navigation/commit/79a85a431ce0859ae35a13858b23c3919795e560))
* don't use deprecated APIs from react-native-safe-area-context ([ddf27bf](https://github.com/react-navigation/react-navigation/commit/ddf27bf41a2efc5d1573aad0f8fe6c27a98c32b3))
* drop drawerOpen and drawerClose events ([5648e1a](https://github.com/react-navigation/react-navigation/commit/5648e1a7b355068d105a2da79861d0add4717ff4))
* move drawerContentOptions to options ([15e5678](https://github.com/react-navigation/react-navigation/commit/15e5678037bc6656d891724b4262cb542d6aad0d))
* simplify props for stack and drawer headers ([4cad132](https://github.com/react-navigation/react-navigation/commit/4cad132c2c3daa6370a6916977f1f1db0036d4e4))

### Features

* add pressColor and pressOpacity props to drawerItem ([#8834](https://github.com/react-navigation/react-navigation/issues/8834)) ([52dbe4b](https://github.com/react-navigation/react-navigation/commit/52dbe4bd6663430745b07ea379d44d4d4f2944a0))
* initial implementation of @react-navigation/elements ([07ba7a9](https://github.com/react-navigation/react-navigation/commit/07ba7a96870efdb8acf99eb82ba0b1d3eac90bab))
* move lazy to options for bottom-tabs and drawer ([068a9a4](https://github.com/react-navigation/react-navigation/commit/068a9a456c31a08104097f2a8434c66c30a5be99))

### BREAKING CHANGES

* Drawer status is now a union ('open', 'closed') instead of a boolean. This will let us implement more types of status in future.

Following this the following exports have been renamed as well:
- getIsDrawerOpenFromState -> getDrawerStatusFromState
- useIsDrawerOpen -> useDrawerStatus
* We now use flexbox for header elements which could break some existing style code which relied on absolute positioning.
* The lazy prop now can be configured per screen instead of for the whole navigator. To keep previous behavior, you can specify it in screenOptions
* This commit moves options from `drawerContentOptions` to regular `options` in order to reduce confusion between the two, as well as to make it more flexible to configure the drawer on a per screen basis.
* We now require newer versions of safe area context library.
* drawer's status can be queried through the isDrawerOpen hook. no need for the events
* Previously, the stack header accepted scene and previous scene which contained things such as descriptor, navigation prop, progress etc. The commit simplifies them to pass `route`, `navigation`, `options` and `progress` directly to the header. Similaryly, the `previous` argument now contains `options`, `route` and `progress`.

## [5.11.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.11.1...@react-navigation/drawer@5.11.2) (2020-11-10)

**Note:** Version bump only for package @react-navigation/drawer

## [5.11.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.11.0...@react-navigation/drawer@5.11.1) (2020-11-09)

### Bug Fixes

* provide correct context to drawe header ([18bbd17](https://github.com/react-navigation/react-navigation/commit/18bbd177d91ccc4308516208a8b9f1a34ca5cc41))

# [5.11.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.10.7...@react-navigation/drawer@5.11.0) (2020-11-09)

### Bug Fixes

* try fixing drawer blink on Android ([5217245](https://github.com/react-navigation/react-navigation/commit/52172453dfb71822c2fb0f5947d00bac4a840d07))

### Features

* add a getIsDrawerOpenFromState utility to drawer ([5bd682f](https://github.com/react-navigation/react-navigation/commit/5bd682f0bf6b28a95fb3e7fc9e1974057a877cb0))
* add option to show a header in drawer navigator screens ([dbe961b](https://github.com/react-navigation/react-navigation/commit/dbe961ba5bb243e8da4d889c3c7dd6ed1de287c4))

## [5.10.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.10.6...@react-navigation/drawer@5.10.7) (2020-11-08)

**Note:** Version bump only for package @react-navigation/drawer

## [5.10.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.10.5...@react-navigation/drawer@5.10.6) (2020-11-04)

**Note:** Version bump only for package @react-navigation/drawer

## [5.10.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.10.4...@react-navigation/drawer@5.10.5) (2020-11-04)

**Note:** Version bump only for package @react-navigation/drawer

## [5.10.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.10.3...@react-navigation/drawer@5.10.4) (2020-11-03)

**Note:** Version bump only for package @react-navigation/drawer

## [5.10.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.10.2...@react-navigation/drawer@5.10.3) (2020-11-03)

**Note:** Version bump only for package @react-navigation/drawer

## [5.10.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.10.1...@react-navigation/drawer@5.10.2) (2020-10-30)

**Note:** Version bump only for package @react-navigation/drawer

## [5.10.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.10.0...@react-navigation/drawer@5.10.1) (2020-10-28)

**Note:** Version bump only for package @react-navigation/drawer

# [5.10.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.9.3...@react-navigation/drawer@5.10.0) (2020-10-24)

### Features

* add optional screens per navigator ([#8805](https://github.com/react-navigation/react-navigation/issues/8805)) ([7196889](https://github.com/react-navigation/react-navigation/commit/7196889bf1218eb6a736d9475e33a909c2248c3b))
* improve types for navigation state ([#8980](https://github.com/react-navigation/react-navigation/issues/8980)) ([7dc2f58](https://github.com/react-navigation/react-navigation/commit/7dc2f5832e371473f3263c01ab39824eb9e2057d))
* update helper types to have navigator specific methods ([f51086e](https://github.com/react-navigation/react-navigation/commit/f51086edea42f2382dac8c6914aac8574132114b))

## [5.9.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.9.2...@react-navigation/drawer@5.9.3) (2020-10-07)

### Bug Fixes

* use route keys instead of index for lazy load ([c49dab3](https://github.com/react-navigation/react-navigation/commit/c49dab31b2c63a1735f0ed0a1936ecf7bbcd8b13))

## [5.9.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.9.1...@react-navigation/drawer@5.9.2) (2020-09-28)

**Note:** Version bump only for package @react-navigation/drawer

## [5.9.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.9.0...@react-navigation/drawer@5.9.1) (2020-09-22)

### Bug Fixes

* add flex: 1 to DrawerItem style ([#8701](https://github.com/react-navigation/react-navigation/issues/8701)) ([1c4bd68](https://github.com/react-navigation/react-navigation/commit/1c4bd6813bc6f5151fd2d99a0245331ff5631c38)), closes [/github.com/react-navigation/react-navigation/blob/main/packages/drawer/src/views/DrawerItem.tsx#L167](https://github.com//github.com/react-navigation/react-navigation/blob/main/packages/drawer/src/views/DrawerItem.tsx/issues/L167)
* cleanly removing event listeners in useWindowDimensions ([#8866](https://github.com/react-navigation/react-navigation/issues/8866)) ([dcbfe52](https://github.com/react-navigation/react-navigation/commit/dcbfe52667d14b0dbed6a353675d02189f7f7b5b))

# [5.9.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.8.7...@react-navigation/drawer@5.9.0) (2020-08-04)

### Bug Fixes

* fix TouchableItem opacity on press on iOS ([40e2dba](https://github.com/react-navigation/react-navigation/commit/40e2dbaecffc43df41b7951f152bbcb4b7104bb1))

### Features

* add Windows and macOS support ([#8570](https://github.com/react-navigation/react-navigation/issues/8570)) ([8468c46](https://github.com/react-navigation/react-navigation/commit/8468c46cab01fe3bf0cf8a0ab978d16f4e78aca0))

## [5.8.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.8.6...@react-navigation/drawer@5.8.7) (2020-07-28)

### Bug Fixes

* add accessibilityState property ([#8548](https://github.com/react-navigation/react-navigation/issues/8548)) ([ce4eb7e](https://github.com/react-navigation/react-navigation/commit/ce4eb7e9273a25e4433eb82e255a58ba3bf4d632))

## [5.8.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.8.5...@react-navigation/drawer@5.8.6) (2020-07-19)

**Note:** Version bump only for package @react-navigation/drawer

## [5.8.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.8.4...@react-navigation/drawer@5.8.5) (2020-07-10)

**Note:** Version bump only for package @react-navigation/drawer

## [5.8.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.8.3...@react-navigation/drawer@5.8.4) (2020-06-25)

**Note:** Version bump only for package @react-navigation/drawer

## [5.8.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/drawer@5.8.2...@react-navigation/drawer@5.8.3) (2020-06-24)

### Bug Fixes

* make sure we don't miss dimensions updates ([c65f9ef](https://github.com/react-navigation/react-navigation/commit/c65f9ef1a9be93b399e724a9731605e408aca80e))
* use interpolateNode in drawer to support Reanimated 2 ([ea5affd](https://github.com/react-navigation/react-navigation/commit/ea5affd914d42595bbf39d8eb87fa531586a46d4))

## [5.8.2](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.8.1...@react-navigation/drawer@5.8.2) (2020-06-06)

### Bug Fixes

* typo on drawerPosition default props ([#8357](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/8357)) ([762cc44](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/762cc4457842182189eeac84aedbb88169452e1e))

## [5.8.1](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.8.0...@react-navigation/drawer@5.8.1) (2020-05-27)

**Note:** Version bump only for package @react-navigation/drawer

# [5.8.0](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.7.7...@react-navigation/drawer@5.8.0) (2020-05-23)

### Features

* update react-native-safe-area-context to 1.0.0 ([#8182](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/8182)) ([d62fbfe](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/d62fbfe255140f16b182e8b54b276a7c96f2aec6))

## [5.7.7](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.7.6...@react-navigation/drawer@5.7.7) (2020-05-20)

**Note:** Version bump only for package @react-navigation/drawer

## [5.7.6](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.7.5...@react-navigation/drawer@5.7.6) (2020-05-20)

**Note:** Version bump only for package @react-navigation/drawer

## [5.7.5](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.7.4...@react-navigation/drawer@5.7.5) (2020-05-16)

**Note:** Version bump only for package @react-navigation/drawer

## [5.7.4](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.7.3...@react-navigation/drawer@5.7.4) (2020-05-14)

**Note:** Version bump only for package @react-navigation/drawer

## [5.7.3](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.7.2...@react-navigation/drawer@5.7.3) (2020-05-14)

**Note:** Version bump only for package @react-navigation/drawer

## [5.7.2](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.7.1...@react-navigation/drawer@5.7.2) (2020-05-10)

**Note:** Version bump only for package @react-navigation/drawer

## [5.7.1](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.7.0...@react-navigation/drawer@5.7.1) (2020-05-08)

### Bug Fixes

* fix building typescript definitions. closes [#8216](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/8216) ([47a1229](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/47a12298378747edd2d22e54dc1c8677f98c49b4))

# [5.7.0](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.6.4...@react-navigation/drawer@5.7.0) (2020-05-08)

### Features

* add generic type aliases for screen props ([bea14aa](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/bea14aa26fd5cbfebc7973733c5cf1f44fd323aa)), closes [#7971](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/7971)

## [5.6.4](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.6.3...@react-navigation/drawer@5.6.4) (2020-05-05)

**Note:** Version bump only for package @react-navigation/drawer

## [5.6.3](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.6.2...@react-navigation/drawer@5.6.3) (2020-05-01)

**Note:** Version bump only for package @react-navigation/drawer

## [5.6.2](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.6.1...@react-navigation/drawer@5.6.2) (2020-05-01)

**Note:** Version bump only for package @react-navigation/drawer

## [5.6.1](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.6.0...@react-navigation/drawer@5.6.1) (2020-04-30)

**Note:** Version bump only for package @react-navigation/drawer

# [5.6.0](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.5.1...@react-navigation/drawer@5.6.0) (2020-04-30)

### Bug Fixes

* fix closing drawer on web with tap on overlay ([70be3f6](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/70be3f6d863c56211e2f90bdf743bd8526338248))
* make sure the address bar hides when scrolling on web ([0a19e94](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/0a19e94b23a4d2b5f22d1d9deb0544f586f475ee))

### Features

* add `useLinkBuilder` hook to build links ([2792f43](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/2792f438fe45428fe193e3708fee7ad61966cbf4))
* add action prop to Link ([942d2be](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/942d2be2c72720469475ce12ec8df23825994dbf))

## [5.5.1](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.5.0...@react-navigation/drawer@5.5.1) (2020-04-27)

**Note:** Version bump only for package @react-navigation/drawer

# [5.5.0](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.4.1...@react-navigation/drawer@5.5.0) (2020-04-17)

### Bug Fixes

* fix drawer not closing on web ([e2bcf51](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/e2bcf5168c389833eaaeadb4b8794aaea4a66d17)), closes [#6759](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/6759)
* webkit style error in overlay ([821343f](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/821343fed38577cfdc87a78f13f991d5760bf8f5))

### Features

* add openByDefault option to drawer ([36689e2](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/36689e24c21b474692bb7ecd0b901c8afbbe9a20))

## [5.4.1](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.4.0...@react-navigation/drawer@5.4.1) (2020-04-08)

### Bug Fixes

* don't hide content from accessibility with permanent drawer ([cb2f157](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/cb2f157a561a2ce3f073eb4ccb567532c77bd869)), closes [#7976](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/7976)
* mark type exports for all packages ([b71de6c](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/b71de6cc799143f1d0e8a0cfcc34f0a2381f9840))

# [5.4.0](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.3.4...@react-navigation/drawer@5.4.0) (2020-03-30)

### Bug Fixes

* disable only swipe gesture on safari ([105da6a](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/105da6ab2fe69847b676c4d4117638212cda1f9a))

### Features

* add swipeEnabled option to disable swipe gesture in drawer ([#7834](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/7834)) ([ac7f972](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/ac7f972e922a82cd32d943356941d100b68bd8b0))

## [5.3.4](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.3.3...@react-navigation/drawer@5.3.4) (2020-03-23)

**Note:** Version bump only for package @react-navigation/drawer

## [5.3.3](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.3.2...@react-navigation/drawer@5.3.3) (2020-03-22)

**Note:** Version bump only for package @react-navigation/drawer

## [5.3.2](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.3.1...@react-navigation/drawer@5.3.2) (2020-03-19)

### Bug Fixes

* close drawer on pressing Esc on web ([5c4afc5](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/5c4afc5cb40c1206a9d8c40efe3cf947030da48e)), closes [#6745](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/6745)
* don't use react-native-screens on web ([b1a65fc](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/b1a65fc73e8603ae2c06ef101a74df31e80bb9b2)), closes [#7485](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/7485)
* fix permanent sidebar position ([#7830](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/7830)) ([3ea8eec](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/3ea8eec4324ea82f0ed427f4662e68e1115e60ab))
* initialize height and width to zero if undefined ([3df65e2](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/3df65e28197db3bb8371059146546d57661c5ba3)), closes [#6789](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/6789)

## [5.3.1](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.3.0...@react-navigation/drawer@5.3.1) (2020-03-17)

**Note:** Version bump only for package @react-navigation/drawer

# [5.3.0](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.2.0...@react-navigation/drawer@5.3.0) (2020-03-17)

### Features

* add permanent drawer type ([#7818](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/7818)) ([6a5d0a0](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/6a5d0a035afae60d91aef78401ec8826295746fe))

# [5.2.0](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.1.1...@react-navigation/drawer@5.2.0) (2020-03-16)

### Features

* make useIsDrawerOpen workable inside drawer content ([#7746](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/7746)) ([cb46d0b](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/cb46d0bca4e17e847fff46ac94276213ac9697bf))

## [5.1.1](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.1.0...@react-navigation/drawer@5.1.1) (2020-03-03)

**Note:** Version bump only for package @react-navigation/drawer

# [5.1.0](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.7...@react-navigation/drawer@5.1.0) (2020-02-26)

### Features

* add ability add listeners with listeners prop ([1624108](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/162410843c4f175ae107756de1c3af04d1d47aa7)), closes [#6756](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/6756)

## [5.0.7](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.6...@react-navigation/drawer@5.0.7) (2020-02-21)

**Note:** Version bump only for package @react-navigation/drawer

## [5.0.6](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.5...@react-navigation/drawer@5.0.6) (2020-02-19)

### Bug Fixes

* delay showing drawer by one frame after layout ([e0c3298](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/e0c3298e64970dc01a61401cfbd7a623eb0fd735))

## [5.0.5](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.4...@react-navigation/drawer@5.0.5) (2020-02-14)

**Note:** Version bump only for package @react-navigation/drawer

## [5.0.4](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.3...@react-navigation/drawer@5.0.4) (2020-02-14)

**Note:** Version bump only for package @react-navigation/drawer

## [5.0.3](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.2...@react-navigation/drawer@5.0.3) (2020-02-12)

**Note:** Version bump only for package @react-navigation/drawer

## [5.0.2](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.1...@react-navigation/drawer@5.0.2) (2020-02-11)

### Bug Fixes

* remove unnecessary borderless from drawer item ([031136f](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/031136f7c86eff3c9139d1baa243da9f19bc61d4)), closes [#6801](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/6801)

## [5.0.1](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.47...@react-navigation/drawer@5.0.1) (2020-02-10)

### Bug Fixes

* prevent ripple from bleeding out of drawer item ([688d16d](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/688d16de5d9f4c5116b92e3ebf3029b56a659d7a)), closes [#6801](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/6801)

# [5.0.0-alpha.47](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.46...@react-navigation/drawer@5.0.0-alpha.47) (2020-02-04)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.46](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.45...@react-navigation/drawer@5.0.0-alpha.46) (2020-02-04)

### Features

* disable pan gesture by default in the browser for Apple devices ([b277927](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/b2779279251b1f157ba825cc34e39046b44f00d8)), closes [#287](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/287)

# [5.0.0-alpha.45](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.44...@react-navigation/drawer@5.0.0-alpha.45) (2020-02-03)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.44](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.41...@react-navigation/drawer@5.0.0-alpha.44) (2020-02-02)

### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))
* fix drawerType=back when drawer is on right ([9198597](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/9198597b7f0a34fbe3844ec86a8b82171036f8ed)), closes [#316](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/316)
* handle back button in drawer itself ([0e8fda3](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/0e8fda319685a34090cfe82da08084c156eb5783))
* screens integration on Android ([#294](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/294)) ([9bfb295](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/9bfb29562020c61b4d5c9bee278bcb1c7bdb8b67))
* update screens for native stack ([5411816](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/54118161885738a6d20b062c7e6679f3bace8424))
* wrap navigators in gesture handler root ([41a5e1a](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/41a5e1a385aa5180abc3992a4c67077c37b998b9))

### Features

* add useIsDrawerOpen hook ([#299](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/299)) ([ecd68af](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/ecd68afb46a4c56200748da5e5fb284fa5a839db))
* integrate with history API on web ([5a3f835](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/5a3f8356b05bff7ed20893a5db6804612da3e568))

# [5.0.0-alpha.42](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.41...@react-navigation/drawer@5.0.0-alpha.42) (2020-02-02)

### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))
* fix drawerType=back when drawer is on right ([9198597](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/9198597b7f0a34fbe3844ec86a8b82171036f8ed)), closes [#316](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/316)
* handle back button in drawer itself ([0e8fda3](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/0e8fda319685a34090cfe82da08084c156eb5783))
* screens integration on Android ([#294](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/294)) ([9bfb295](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/9bfb29562020c61b4d5c9bee278bcb1c7bdb8b67))
* update screens for native stack ([5411816](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/54118161885738a6d20b062c7e6679f3bace8424))

### Features

* add useIsDrawerOpen hook ([#299](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/299)) ([ecd68af](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/ecd68afb46a4c56200748da5e5fb284fa5a839db))
* integrate with history API on web ([5a3f835](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/5a3f8356b05bff7ed20893a5db6804612da3e568))

# [5.0.0-alpha.41](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.40...@react-navigation/drawer@5.0.0-alpha.41) (2020-01-24)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.40](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.39...@react-navigation/drawer@5.0.0-alpha.40) (2020-01-23)

### Features

* emit appear and dismiss events for native stack ([f1df4a0](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/f1df4a080877b3642e748a41a5ffc2da8c449a8c))
* let the navigator specify if default can be prevented ([da67e13](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/da67e134d2157201360427d3c10da24f24cae7aa))

# [5.0.0-alpha.39](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.38...@react-navigation/drawer@5.0.0-alpha.39) (2020-01-14)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.38](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.37...@react-navigation/drawer@5.0.0-alpha.38) (2020-01-13)

### Bug Fixes

* make sure paths aren't aliased when building definitions ([65a5dac](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/commit/65a5dac2bf887f4ba081ab15bd4c9870bb15697f)), closes [#265](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/issues/265)

# [5.0.0-alpha.37](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.36...@react-navigation/drawer@5.0.0-alpha.37) (2020-01-13)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.36](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.34...@react-navigation/drawer@5.0.0-alpha.36) (2020-01-09)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.35](https://github.com/react-navigation/react-navigation/tree/main/packages/drawer/compare/@react-navigation/drawer@5.0.0-alpha.34...@react-navigation/drawer@5.0.0-alpha.35) (2020-01-09)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.34](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.33...@react-navigation/drawer@5.0.0-alpha.34) (2020-01-05)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.33](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.32...@react-navigation/drawer@5.0.0-alpha.33) (2020-01-03)

### Bug Fixes

* provide initial values for safe area to prevent blank screen ([#238](https://github.com/react-navigation/navigation-ex/issues/238)) ([77b7570](https://github.com/react-navigation/navigation-ex/commit/77b757091c0451e20bca01138629669c7da544a8))

### Features

* add interaction handle to drawer ([#239](https://github.com/react-navigation/navigation-ex/issues/239)) ([fa4411a](https://github.com/react-navigation/navigation-ex/commit/fa4411a14dc4aae568794e4b884088e3276a2876))

# [5.0.0-alpha.32](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.31...@react-navigation/drawer@5.0.0-alpha.32) (2020-01-03)

### Bug Fixes

* pass backBehavior to the router in drawer. fixes [#230](https://github.com/react-navigation/navigation-ex/issues/230) ([3cd1aed](https://github.com/react-navigation/navigation-ex/commit/3cd1aedcf490a4c7962b2d36873d714637f3b9b0))

# [5.0.0-alpha.31](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.30...@react-navigation/drawer@5.0.0-alpha.31) (2020-01-01)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.30](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.29...@react-navigation/drawer@5.0.0-alpha.30) (2019-12-19)

### Bug Fixes

* set screen background in drawer from theme ([0635365](https://github.com/react-navigation/navigation-ex/commit/0635365483bf5ac38e75191b4ba8f52cf6d73896))

# [5.0.0-alpha.29](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.28...@react-navigation/drawer@5.0.0-alpha.29) (2019-12-16)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.28](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.27...@react-navigation/drawer@5.0.0-alpha.28) (2019-12-14)

### Features

* add custom theme support ([#211](https://github.com/react-navigation/navigation-ex/issues/211)) ([00fc616](https://github.com/react-navigation/navigation-ex/commit/00fc616de0572bade8aa85052cdc8290360b1d7f))

# [5.0.0-alpha.27](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.26...@react-navigation/drawer@5.0.0-alpha.27) (2019-12-11)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.26](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.25...@react-navigation/drawer@5.0.0-alpha.26) (2019-12-10)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.25](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.24...@react-navigation/drawer@5.0.0-alpha.25) (2019-12-07)

### Features

* export underlying views used to build navigators ([#191](https://github.com/react-navigation/navigation-ex/issues/191)) ([d618ab3](https://github.com/react-navigation/navigation-ex/commit/d618ab382ecc5eccbcd5faa89e76f9ed2d75f405))

# [5.0.0-alpha.24](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.23...@react-navigation/drawer@5.0.0-alpha.24) (2019-11-27)

### Bug Fixes

* enable gestures by default in drawer. closes [#188](https://github.com/react-navigation/navigation-ex/issues/188) ([7080517](https://github.com/react-navigation/navigation-ex/commit/7080517c914b4821e07a6320de94660e50d02950))

# [5.0.0-alpha.23](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.22...@react-navigation/drawer@5.0.0-alpha.23) (2019-11-17)

### Bug Fixes

* pass labelStyle prop in DrawerItem label ([#170](https://github.com/react-navigation/navigation-ex/issues/170)) ([cd7c9c4](https://github.com/react-navigation/navigation-ex/commit/cd7c9c4398ce12a1e965786d91fdbe6e3c42ee0a))
* workaround SafereaProvider causing jumping ([c17ad18](https://github.com/react-navigation/navigation-ex/commit/c17ad18b20cb05c577e1235a58ccc1c856fee086)), closes [#174](https://github.com/react-navigation/navigation-ex/issues/174)

# [5.0.0-alpha.22](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.21...@react-navigation/drawer@5.0.0-alpha.22) (2019-11-10)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.21](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.20...@react-navigation/drawer@5.0.0-alpha.21) (2019-11-08)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.20](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.19...@react-navigation/drawer@5.0.0-alpha.20) (2019-11-04)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.19](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.18...@react-navigation/drawer@5.0.0-alpha.19) (2019-11-02)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.18](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.17...@react-navigation/drawer@5.0.0-alpha.18) (2019-10-30)

### Bug Fixes

* hide screen from screen reader when drawer is open ([#147](https://github.com/react-navigation/navigation-ex/issues/147)) ([fb749ac](https://github.com/react-navigation/navigation-ex/commit/fb749ac))

### Features

* add an 'unmountInactiveScreens' option ([12d597f](https://github.com/react-navigation/navigation-ex/commit/12d597f))

# [5.0.0-alpha.17](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.16...@react-navigation/drawer@5.0.0-alpha.17) (2019-10-29)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.16](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.15...@react-navigation/drawer@5.0.0-alpha.16) (2019-10-22)

### Bug Fixes

* navigation drawer sometimes not closing when pressed outside ([0d8cdc8](https://github.com/react-navigation/navigation-ex/commit/0d8cdc8))

# [5.0.0-alpha.15](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.14...@react-navigation/drawer@5.0.0-alpha.15) (2019-10-17)

### Bug Fixes

* fix passing content options in drawer ([cab6160](https://github.com/react-navigation/navigation-ex/commit/cab6160))

# [5.0.0-alpha.14](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.13...@react-navigation/drawer@5.0.0-alpha.14) (2019-10-15)

### Bug Fixes

* add flex: 1 to drawer content ([2b57702](https://github.com/react-navigation/navigation-ex/commit/2b57702))
* fix content component not rendering in drawer ([0a5fb3e](https://github.com/react-navigation/navigation-ex/commit/0a5fb3e))

### Features

* initial version of native stack ([#102](https://github.com/react-navigation/navigation-ex/issues/102)) ([ba3f718](https://github.com/react-navigation/navigation-ex/commit/ba3f718))

# [5.0.0-alpha.13](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.12...@react-navigation/drawer@5.0.0-alpha.13) (2019-10-06)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.12](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.11...@react-navigation/drawer@5.0.0-alpha.12) (2019-10-03)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.11](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.10...@react-navigation/drawer@5.0.0-alpha.11) (2019-10-03)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.10](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.9...@react-navigation/drawer@5.0.0-alpha.10) (2019-09-27)

### Features

* export some more type aliases ([8b78d61](https://github.com/react-navigation/navigation-ex/commit/8b78d61))

# [5.0.0-alpha.9](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.8...@react-navigation/drawer@5.0.0-alpha.9) (2019-09-16)

### Features

* make example run as bare react-native project as well ([#85](https://github.com/react-navigation/navigation-ex/issues/85)) ([d16c20c](https://github.com/react-navigation/navigation-ex/commit/d16c20c))

# [5.0.0-alpha.8](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.7...@react-navigation/drawer@5.0.0-alpha.8) (2019-08-31)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.7](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.6...@react-navigation/drawer@5.0.0-alpha.7) (2019-08-30)

### Bug Fixes

* rename contentContainerStyle to sceneContainerStyle for drawer ([fdc24d2](https://github.com/react-navigation/navigation-ex/commit/fdc24d2))

# [5.0.0-alpha.6](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.5...@react-navigation/drawer@5.0.0-alpha.6) (2019-08-29)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.5](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.4...@react-navigation/drawer@5.0.0-alpha.5) (2019-08-28)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.4](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.3...@react-navigation/drawer@5.0.0-alpha.4) (2019-08-27)

**Note:** Version bump only for package @react-navigation/drawer

# [5.0.0-alpha.3](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.2...@react-navigation/drawer@5.0.0-alpha.3) (2019-08-22)

### Bug Fixes

* fix path to typescript definitions ([f182315](https://github.com/react-navigation/navigation-ex/commit/f182315))

# [5.0.0-alpha.2](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/drawer@5.0.0-alpha.1...@react-navigation/drawer@5.0.0-alpha.2) (2019-08-22)

**Note:** Version bump only for package @react-navigation/drawer

# 5.0.0-alpha.1 (2019-08-21)

### Bug Fixes

* fix "DrawerActions" typo ([#65](https://github.com/react-navigation/navigation-ex/issues/65)) ([57e0af2](https://github.com/react-navigation/navigation-ex/commit/57e0af2))
* fix peer deps and add git urls ([6b4fc74](https://github.com/react-navigation/navigation-ex/commit/6b4fc74))
* get rid of random red screen on iOS on opening drawer ([#68](https://github.com/react-navigation/navigation-ex/issues/68)) ([3c4f10d](https://github.com/react-navigation/navigation-ex/commit/3c4f10d))
* immediate closing drawer of fully opened ([3f64539](https://github.com/react-navigation/navigation-ex/commit/3f64539))
* only pass accessibility label if it is a string. fixes [#36](https://github.com/react-navigation/navigation-ex/issues/36) ([#38](https://github.com/react-navigation/navigation-ex/issues/38)) ([bbe20db](https://github.com/react-navigation/navigation-ex/commit/bbe20db))
* reset this.gestureX on manual setting ([2a1620d](https://github.com/react-navigation/navigation-ex/commit/2a1620d))
* rewrite tap callbacks to native calls ([d4c51f4](https://github.com/react-navigation/navigation-ex/commit/d4c51f4))
* spring was not triggered sometimes on tap ([#67](https://github.com/react-navigation/navigation-ex/issues/67)) ([8bbddb2](https://github.com/react-navigation/navigation-ex/commit/8bbddb2))
* tweak spring config for animation ([7946b9d](https://github.com/react-navigation/navigation-ex/commit/7946b9d))

### Features

* add custom GH props ([35d7304](https://github.com/react-navigation/navigation-ex/commit/35d7304))
* implement various navigators ([f0b80ce](https://github.com/react-navigation/navigation-ex/commit/f0b80ce))
* Move itemStyle to SafeAreaView ([#55](https://github.com/react-navigation/navigation-ex/issues/55)) ([a59ed91](https://github.com/react-navigation/navigation-ex/commit/a59ed91))
