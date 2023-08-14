# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.0.0-alpha.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@7.0.0-alpha.1...@react-navigation/native@7.0.0-alpha.2) (2023-06-22)

### Features

* support a top-level path configuration in linking config ([1d0297e](https://github.com/react-navigation/react-navigation/commit/1d0297ed17788c01d7b901ad04b63d3f37f47266)) - by @satya164

# [7.0.0-alpha.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@7.0.0-alpha.0...@react-navigation/native@7.0.0-alpha.1) (2023-03-01)

### Bug Fixes

* fix paths in sourcemap files ([368e069](https://github.com/react-navigation/react-navigation/commit/368e0691b9fb07d4b1cbe71cfe4c2f40512f93ad)) - by @satya164

### Features

* add ability to customize the fonts with the theme ([#11243](https://github.com/react-navigation/react-navigation/issues/11243)) ([1cd6836](https://github.com/react-navigation/react-navigation/commit/1cd6836f1d10bcdf7f96d9e4b9f7de0ddea9391f)) - by @satya164

# [7.0.0-alpha.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.14...@react-navigation/native@7.0.0-alpha.0) (2023-02-17)

### Bug Fixes

* add `ScrollView` type to 'getScrollResponder' ([#11112](https://github.com/react-navigation/react-navigation/issues/11112)) ([f4324cd](https://github.com/react-navigation/react-navigation/commit/f4324cdbb50218bed30abf673f5070e20e2d7db8)) - by @ken0nek
* don't modify browser history on re-render ([ab66777](https://github.com/react-navigation/react-navigation/commit/ab66777c092fae3d28c9c8381aeb5b92945ca256)) - by @satya164
* keep hash/fragment section un URLs on web ([#11078](https://github.com/react-navigation/react-navigation/issues/11078)) ([a30daa0](https://github.com/react-navigation/react-navigation/commit/a30daa07fb667389420d78590757914487e32c19)) - by @nikgraf

* refactor!: improve the API for Link component ([7f35837](https://github.com/react-navigation/react-navigation/commit/7f3583793ad17475531e155f1f433ffa16547015)) - by @satya164
* fix!: align onReady callback and navigationRef.isReady ([1959baa](https://github.com/react-navigation/react-navigation/commit/1959baa97c101712db84905827f13a8a78a42ca7)) - by @satya164

### Features

* make useScrollToTop work when nesting multiple tab navigators ([#11063](https://github.com/react-navigation/react-navigation/issues/11063)) ([dce463a](https://github.com/react-navigation/react-navigation/commit/dce463a0e39b21509670b5c1d0cab933aa9e4962)), closes [/github.com/react-navigation/react-navigation/pull/9434#issuecomment-1328345015](https://github.com//github.com/react-navigation/react-navigation/pull/9434/issues/issuecomment-1328345015) - by @anthonyguay
* support statically confguring navigation tree ([#11144](https://github.com/react-navigation/react-navigation/issues/11144)) ([4cc322e](https://github.com/react-navigation/react-navigation/commit/4cc322e08b3d6fe089710c9c6869bbdc183c2bd6)) - by @satya164

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
* Previously, the `onReady` prop and `navigationRef.isReady()` work slightly
differently. The
`onReady` callback fired when `NavigationContainer` finishes mounting and deep links is resolved.
The `navigationRef.isReady()` method additionally checks if there are any navigators rendered - which may not be `true` if the user is rendering their navigators conditionally inside a
`NavigationContainer`.

This changes `onReady` to work similar to `navigationRef.isReady()`. The `onReady` callback will now fire only when there are navigators rendered - reflecting the value of
`navigationRef.isReady()`.

## [6.0.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.13...@react-navigation/native@6.0.14) (2022-11-21)

### Bug Fixes

* add accessibility props to NativeStack screens ([#11022](https://github.com/react-navigation/react-navigation/issues/11022)) ([3ab05af](https://github.com/react-navigation/react-navigation/commit/3ab05afeb6412b8e5566270442ac14a463136620))

## [6.0.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.11...@react-navigation/native@6.0.13) (2022-09-16)

### Bug Fixes

* handle path with empty string properly for linking ([#10708](https://github.com/react-navigation/react-navigation/issues/10708)) ([e8c374e](https://github.com/react-navigation/react-navigation/commit/e8c374e0643a1521566c654e0052b53f2fd0667a))

## [6.0.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.11...@react-navigation/native@6.0.12) (2022-08-24)

### Bug Fixes

* handle path with empty string properly for linking ([#10708](https://github.com/react-navigation/react-navigation/issues/10708)) ([e8c374e](https://github.com/react-navigation/react-navigation/commit/e8c374e0643a1521566c654e0052b53f2fd0667a))

## [6.0.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.10...@react-navigation/native@6.0.11) (2022-07-05)

### Bug Fixes

* ensure same @types/react version in repo ([#10663](https://github.com/react-navigation/react-navigation/issues/10663)) ([e662465](https://github.com/react-navigation/react-navigation/commit/e6624653fbbd931158dbebd17142abf9637205b6)), closes [#10655](https://github.com/react-navigation/react-navigation/issues/10655)
* expose `LinkingContext` ([#10604](https://github.com/react-navigation/react-navigation/issues/10604)) ([ac24e61](https://github.com/react-navigation/react-navigation/commit/ac24e617af10c48b161d1aaa7dfc8c1c1218a3cd))
* prevent `history.go()` navigation outside bounds ([#10601](https://github.com/react-navigation/react-navigation/issues/10601)) ([ff8d8a3](https://github.com/react-navigation/react-navigation/commit/ff8d8a31d83f76129be5a8ee0a95ef2919eb1240)), closes [#10481](https://github.com/react-navigation/react-navigation/issues/10481)

## [6.0.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.9...@react-navigation/native@6.0.10) (2022-04-01)

**Note:** Version bump only for package @react-navigation/native

## [6.0.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.8...@react-navigation/native@6.0.9) (2022-04-01)

**Note:** Version bump only for package @react-navigation/native

## [6.0.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.7...@react-navigation/native@6.0.8) (2022-02-02)

### Bug Fixes

* broken history items index when items reset ([#10312](https://github.com/react-navigation/react-navigation/issues/10312)) ([16f3462](https://github.com/react-navigation/react-navigation/commit/16f3462fb258e7e1264d3eb3f4f6c3a93381e01e))

## [6.0.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.6...@react-navigation/native@6.0.7) (2022-01-29)

### Bug Fixes

* fix crash in useLinking on Web ([#10262](https://github.com/react-navigation/react-navigation/issues/10262)) ([e612a4c](https://github.com/react-navigation/react-navigation/commit/e612a4c837f73dc5830b0ff9e7e24e1e06d2451c)), closes [/github.com/react-navigation/react-navigation/pull/9970/files#r784475821](https://github.com//github.com/react-navigation/react-navigation/pull/9970/files/issues/r784475821) [/github.com/react-navigation/react-navigation/blob/fb84805c889bbb7059e7e95592c004aea2a510d6/packages/native/src/useLinking.tsx#L84](https://github.com//github.com/react-navigation/react-navigation/blob/fb84805c889bbb7059e7e95592c004aea2a510d6/packages/native/src/useLinking.tsx/issues/L84) [/github.com/react-navigation/react-navigation/blob/fb84805c889bbb7059e7e95592c004aea2a510d6/packages/native/src/useLinking.tsx#L86](https://github.com//github.com/react-navigation/react-navigation/blob/fb84805c889bbb7059e7e95592c004aea2a510d6/packages/native/src/useLinking.tsx/issues/L86) [/github.com/react-navigation/react-navigation/blob/fb84805c889bbb7059e7e95592c004aea2a510d6/packages/native/src/useLinking.tsx#L108](https://github.com//github.com/react-navigation/react-navigation/blob/fb84805c889bbb7059e7e95592c004aea2a510d6/packages/native/src/useLinking.tsx/issues/L108) [/github.com/react-navigation/react-navigation/blob/fb84805c889bbb7059e7e95592c004aea2a510d6/packages/native/src/useLinking.tsx#L110](https://github.com//github.com/react-navigation/react-navigation/blob/fb84805c889bbb7059e7e95592c004aea2a510d6/packages/native/src/useLinking.tsx/issues/L110)
* update URL on web when params change. fixes [#10046](https://github.com/react-navigation/react-navigation/issues/10046) ([4468b96](https://github.com/react-navigation/react-navigation/commit/4468b96db5065be8342483392d939742d21b20bc))
* **web:** avoid passing undefined root state in web ([#10186](https://github.com/react-navigation/react-navigation/issues/10186)) ([9087439](https://github.com/react-navigation/react-navigation/commit/90874397e653a6db642822bff18014a3e5980fed)), closes [#10185](https://github.com/react-navigation/react-navigation/issues/10185)

## [6.0.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.5...@react-navigation/native@6.0.6) (2021-10-12)

**Note:** Version bump only for package @react-navigation/native

## [6.0.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.4...@react-navigation/native@6.0.5) (2021-10-09)

**Note:** Version bump only for package @react-navigation/native

## [6.0.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.3...@react-navigation/native@6.0.4) (2021-09-26)

### Bug Fixes

* fix building link with useLinkProps ([bcdc559](https://github.com/react-navigation/react-navigation/commit/bcdc55975d64b8a5267f0b0dc47efb395a409762))

## [6.0.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.2...@react-navigation/native@6.0.3) (2021-09-26)

### Bug Fixes

* fix href with useLinkProps. fixes [#9930](https://github.com/react-navigation/react-navigation/issues/9930) ([4ae53e1](https://github.com/react-navigation/react-navigation/commit/4ae53e1705e39aee75041928c07a56ec110bfd05))
* fix navigation when going back and forth in history on web ([#9970](https://github.com/react-navigation/react-navigation/issues/9970)) ([fb84805](https://github.com/react-navigation/react-navigation/commit/fb84805c889bbb7059e7e95592c004aea2a510d6)), closes [#9408](https://github.com/react-navigation/react-navigation/issues/9408) [#9128](https://github.com/react-navigation/react-navigation/issues/9128)
* make useScrollToTop work with react-native-largelist ([#9960](https://github.com/react-navigation/react-navigation/issues/9960)) ([073fd57](https://github.com/react-navigation/react-navigation/commit/073fd57537466a054dc902e915430f69bbe363e1))
* use console.error for linking conflicts instead of throwing ([4b36bcf](https://github.com/react-navigation/react-navigation/commit/4b36bcf346a6196bbc8d5792e8eb4614709161a2))

## [6.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.1...@react-navigation/native@6.0.2) (2021-08-07)

### Bug Fixes

* fix crash in useLinkTo when passing an object ([#9800](https://github.com/react-navigation/react-navigation/issues/9800)) ([dfd0cc7](https://github.com/react-navigation/react-navigation/commit/dfd0cc78fe4531ba7c957f826bc556829e231735))

## [6.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0...@react-navigation/native@6.0.1) (2021-08-03)

**Note:** Version bump only for package @react-navigation/native

# [6.0.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.17...@react-navigation/native@6.0.0) (2021-08-01)

### Features

* add a way to filter out deep links from being handled ([c322b05](https://github.com/react-navigation/react-navigation/commit/c322b0501c6a9941a033471aed9e5b486b3ace7e))

# [6.0.0-next.17](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.16...@react-navigation/native@6.0.0-next.17) (2021-07-16)

**Note:** Version bump only for package @react-navigation/native

# [6.0.0-next.16](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.15...@react-navigation/native@6.0.0-next.16) (2021-07-16)

**Note:** Version bump only for package @react-navigation/native

# [6.0.0-next.15](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.13...@react-navigation/native@6.0.0-next.15) (2021-07-01)

### Bug Fixes

* disable duplicate linking check for independent containers ([20b8ebd](https://github.com/react-navigation/react-navigation/commit/20b8ebd40547d93ccf626fcd9dad327fe1807b52))

# [6.0.0-next.14](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.13...@react-navigation/native@6.0.0-next.14) (2021-06-10)

**Note:** Version bump only for package @react-navigation/native

# [6.0.0-next.13](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.12...@react-navigation/native@6.0.0-next.13) (2021-05-29)

### Bug Fixes

* validate property names in linking config ([324ea71](https://github.com/react-navigation/react-navigation/commit/324ea7181db6b743f512854be267cc9d65975b6f))

# [6.0.0-next.12](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.11...@react-navigation/native@6.0.0-next.12) (2021-05-29)

### Bug Fixes

* try to fix [#9631](https://github.com/react-navigation/react-navigation/issues/9631) ([b4d7b0e](https://github.com/react-navigation/react-navigation/commit/b4d7b0ee86c09419a18357867a0a25bb90d960c0))

# [6.0.0-next.11](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.10...@react-navigation/native@6.0.0-next.11) (2021-05-27)

**Note:** Version bump only for package @react-navigation/native

# [6.0.0-next.10](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.9...@react-navigation/native@6.0.0-next.10) (2021-05-26)

### Features

* expose container ref in useNavigation ([1d40279](https://github.com/react-navigation/react-navigation/commit/1d40279db18ab2aed12517ed3ca6af6d509477d2))

# [6.0.0-next.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.8...@react-navigation/native@6.0.0-next.9) (2021-05-23)

### Features

* initial implementation of a flipper plugin ([d6f6f5f](https://github.com/react-navigation/react-navigation/commit/d6f6f5f94db85bd9166a5a97889c37690846d519))

# [6.0.0-next.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.7...@react-navigation/native@6.0.0-next.8) (2021-05-16)

### Bug Fixes

* add ability to pass generic params to Link ([9c30c42](https://github.com/react-navigation/react-navigation/commit/9c30c42c0bddbc90c58b79a8be6d57e57a131e77))

# [6.0.0-next.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.6...@react-navigation/native@6.0.0-next.7) (2021-05-10)

### Features

* return a NavigationContent component from useNavigationBuilder ([1179d56](https://github.com/react-navigation/react-navigation/commit/1179d56c5008270753feef41acdc1dbd2191efcf))

# [6.0.0-next.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.5...@react-navigation/native@6.0.0-next.6) (2021-05-09)

**Note:** Version bump only for package @react-navigation/native

# [6.0.0-next.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.4...@react-navigation/native@6.0.0-next.5) (2021-05-09)

**Note:** Version bump only for package @react-navigation/native

# [6.0.0-next.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.3...@react-navigation/native@6.0.0-next.4) (2021-05-09)

### Features

* add ability to specify root param list ([b28bfdd](https://github.com/react-navigation/react-navigation/commit/b28bfddc17cbf3996fac04a34b2a7085ecf88be5))
* support navigate-like object in Link ([1478659](https://github.com/react-navigation/react-navigation/commit/14786594c004d8176570f1a4ab013b57b3180665))

# [6.0.0-next.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.2...@react-navigation/native@6.0.0-next.3) (2021-05-01)

### Features

* add helper and hook for container ref ([0ecd112](https://github.com/react-navigation/react-navigation/commit/0ecd112ec9786a26261ada3d33ef44dc1ec84da0))

# [6.0.0-next.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0-next.1...@react-navigation/native@6.0.0-next.2) (2021-04-08)

**Note:** Version bump only for package @react-navigation/native

# [6.0.0-next.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@6.0.0...@react-navigation/native@6.0.0-next.1) (2021-03-10)

**Note:** Version bump only for package @react-navigation/native

# [6.0.0-next.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.8.9...@react-navigation/native@6.0.0-next.0) (2021-03-09)

### Bug Fixes

* address breaking change in react-native for Linking ([61c6bb0](https://github.com/react-navigation/react-navigation/commit/61c6bb01b9e3aacaf93ecc7398b6c45834a2216d))
* default to backBehavior: firstRoute for TabRouter ([8bdc6c6](https://github.com/react-navigation/react-navigation/commit/8bdc6c6b9bc957a00a01eec2fcf6f971998c9380))
* drop dangerously prefix from getState and getParent ([227f133](https://github.com/react-navigation/react-navigation/commit/227f133536af85dc5ff85eeb269b76ed80cd3f05))
* normalize prefix when parsing. fixes [#9081](https://github.com/react-navigation/react-navigation/issues/9081) ([fd034fe](https://github.com/react-navigation/react-navigation/commit/fd034fea35cd0ae23dac979d90d8fc8598dadcc3))
* support sync getInitialURL in native useLinking ([52dd4e7](https://github.com/react-navigation/react-navigation/commit/52dd4e7ac92e3e176ac9f106e646ff6e300f3412))

### Features

* associate path with the route it opens when deep linking ([#9384](https://github.com/react-navigation/react-navigation/issues/9384)) ([86e64fd](https://github.com/react-navigation/react-navigation/commit/86e64fdcd81a57cf3f3bdab4c9035b52984e7009)), closes [#9102](https://github.com/react-navigation/react-navigation/issues/9102)
* stop exporting useLinking hook ([5a9a1ed](https://github.com/react-navigation/react-navigation/commit/5a9a1edae7366d26af3494de341d9503a011974a))

### BREAKING CHANGES

* Returning to first route after pressing back seems more common in apps. This commit changes the default for tab and drawer navigators to follow this common practice. To preserve previous behavior, you can pass backBehavior=history to tab and drawer navigators.
* we have added linking prop for the same use case which is easier to use. so no need to export useLinking anymore.

## [5.8.9](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.8.8...@react-navigation/native@5.8.9) (2020-11-10)

**Note:** Version bump only for package @react-navigation/native

## [5.8.8](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.8.7...@react-navigation/native@5.8.8) (2020-11-09)

**Note:** Version bump only for package @react-navigation/native

## [5.8.7](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.8.6...@react-navigation/native@5.8.7) (2020-11-08)

**Note:** Version bump only for package @react-navigation/native

## [5.8.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.8.5...@react-navigation/native@5.8.6) (2020-11-04)

### Bug Fixes

* ignore any errors from deep linking ([4c2379c](https://github.com/react-navigation/react-navigation/commit/4c2379cec1e661aa132002fd1c50909ea64cb983))

## [5.8.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.8.4...@react-navigation/native@5.8.5) (2020-11-04)

**Note:** Version bump only for package @react-navigation/native

## [5.8.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.8.3...@react-navigation/native@5.8.4) (2020-11-03)

**Note:** Version bump only for package @react-navigation/native

## [5.8.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.8.2...@react-navigation/native@5.8.3) (2020-11-03)

### Bug Fixes

* make sure that invalid linking config doesn't work if app is open ([52451d1](https://github.com/react-navigation/react-navigation/commit/52451d11094b8551e3c6950b3e005d68225c7da9))

## [5.8.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.8.1...@react-navigation/native@5.8.2) (2020-10-30)

**Note:** Version bump only for package @react-navigation/native

## [5.8.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.8.0...@react-navigation/native@5.8.1) (2020-10-28)

**Note:** Version bump only for package @react-navigation/native

# [5.8.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.7.6...@react-navigation/native@5.8.0) (2020-10-24)

### Features

* add `getInitialURL` and `subscribe` options to linking config ([748e92f](https://github.com/react-navigation/react-navigation/commit/748e92f120b9ff73c6b1e14515f60c76701081db))
* allow deep linking to reset state ([#8973](https://github.com/react-navigation/react-navigation/issues/8973)) ([7f3b27a](https://github.com/react-navigation/react-navigation/commit/7f3b27a9ec8edd9604ac19774baa1f60963ccdc9)), closes [#8952](https://github.com/react-navigation/react-navigation/issues/8952)
* support wildcard string prefixes ([#8942](https://github.com/react-navigation/react-navigation/issues/8942)) ([23ab350](https://github.com/react-navigation/react-navigation/commit/23ab3504921b7e741a48d66c6a953905206df4b7)), closes [#8941](https://github.com/react-navigation/react-navigation/issues/8941)

## [5.7.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.7.5...@react-navigation/native@5.7.6) (2020-10-07)

### Bug Fixes

* add missing check for initial state on web ([9e36508](https://github.com/react-navigation/react-navigation/commit/9e3650831c22b47130d2b388390f7eb7910fe91d))

## [5.7.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.7.4...@react-navigation/native@5.7.5) (2020-09-28)

### Bug Fixes

* check for correct resolved value in useThenable. fixes [#8798](https://github.com/react-navigation/react-navigation/issues/8798) ([cc8f1f4](https://github.com/react-navigation/react-navigation/commit/cc8f1f4205373f605fc457b40666305b3e117772))

## [5.7.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.7.3...@react-navigation/native@5.7.4) (2020-09-22)

**Note:** Version bump only for package @react-navigation/native

## [5.7.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.7.2...@react-navigation/native@5.7.3) (2020-08-04)

### Bug Fixes

* make sure we don't exit the page when going back ([2a48b91](https://github.com/react-navigation/react-navigation/commit/2a48b917ecaf5b9adcfb5e31fb5bc787d114af23))
* wait longer for history.go and handle interruptions ([b1f1377](https://github.com/react-navigation/react-navigation/commit/b1f13774295465942aafa1b0ff611b9eebccbd77))

## [5.7.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.7.1...@react-navigation/native@5.7.2) (2020-07-28)

**Note:** Version bump only for package @react-navigation/native

## [5.7.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.7.0...@react-navigation/native@5.7.1) (2020-07-19)

**Note:** Version bump only for package @react-navigation/native

# [5.7.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.6.1...@react-navigation/native@5.7.0) (2020-07-10)

### Bug Fixes

* ensure correct document title after going back on Chrome ([8f5286e](https://github.com/react-navigation/react-navigation/commit/8f5286ef501d2e88cffbe4f7d8cdeb23a4af6cf1))
* tweak border color to match iOS default ([c665c02](https://github.com/react-navigation/react-navigation/commit/c665c027a6531cf841690940a7e2cb4ea498ba03))

### Features

* add a hook to update document title ([13c9d1e](https://github.com/react-navigation/react-navigation/commit/13c9d1e281b4626199671bce11ba62d83767564f))
* add support for badges to bottom tab bar ([96c7b68](https://github.com/react-navigation/react-navigation/commit/96c7b688ce773b3dd1f1cf7775367cd7080c94a2))

## [5.6.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.6.0...@react-navigation/native@5.6.1) (2020-06-25)

**Note:** Version bump only for package @react-navigation/native

# [5.6.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/native@5.5.1...@react-navigation/native@5.6.0) (2020-06-24)

### Bug Fixes

* fix forward with history API. closes [#8409](https://github.com/react-navigation/react-navigation/issues/8409) ([d85d27c](https://github.com/react-navigation/react-navigation/commit/d85d27c43252630ea5c093fa6ad0d5a8c502b7c9))

### Features

* add an onReady callback to the container ([#8491](https://github.com/react-navigation/react-navigation/issues/8491)) ([8177c45](https://github.com/react-navigation/react-navigation/commit/8177c45d14ca6d1552574ad9ac740723f9cc8f5b))
* rework linking configuration to be more strict ([#8502](https://github.com/react-navigation/react-navigation/issues/8502)) ([a021cfb](https://github.com/react-navigation/react-navigation/commit/a021cfb8af4afd50f785f6ee9b51d361e25704ca))

## [5.5.1](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.5.0...@react-navigation/native@5.5.1) (2020-06-06)

**Note:** Version bump only for package @react-navigation/native

# [5.5.0](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.4.3...@react-navigation/native@5.5.0) (2020-05-27)

### Bug Fixes

* export types from /native ([af1722d](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/af1722d1e915f3ec234df202f74c4b4c631472c7))

### Features

* add a `ServerContainer` component for SSR ([#8297](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/8297)) ([68e750d](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/68e750d5a6d198a2f5bdb86ba631de0a27732943))
* add ref to get current options in `ServerContainer` ([#8333](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/8333)) ([0b1a718](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/0b1a718756e208d84b20e45ca56004332308ad54))

## [5.4.3](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.4.2...@react-navigation/native@5.4.3) (2020-05-23)

**Note:** Version bump only for package @react-navigation/native

## [5.4.2](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.4.1...@react-navigation/native@5.4.2) (2020-05-20)

**Note:** Version bump only for package @react-navigation/native

## [5.4.1](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.4.0...@react-navigation/native@5.4.1) (2020-05-20)

**Note:** Version bump only for package @react-navigation/native

# [5.4.0](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.3.2...@react-navigation/native@5.4.0) (2020-05-16)

### Bug Fixes

* fix types for linking options ([d14f38b](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/d14f38b80ad569d5828c1919cea426c659173924))

### Features

* add a PathConfig type ([60cb3c9](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/60cb3c9ba76d7ef166c9fe8b55f23728975b5b6e))

## [5.3.2](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.3.1...@react-navigation/native@5.3.2) (2020-05-14)

**Note:** Version bump only for package @react-navigation/native

## [5.3.1](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.3.0...@react-navigation/native@5.3.1) (2020-05-14)

**Note:** Version bump only for package @react-navigation/native

# [5.3.0](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.2.6...@react-navigation/native@5.3.0) (2020-05-10)

### Features

* initialState should take priority over deep link ([039017b](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/039017bc2af69120d2d10e8f2c8a62919c37eb65))

## [5.2.6](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.2.5...@react-navigation/native@5.2.6) (2020-05-08)

### Bug Fixes

* fix building typescript definitions. closes [#8216](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/8216) ([47a1229](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/47a12298378747edd2d22e54dc1c8677f98c49b4))

## [5.2.5](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.2.4...@react-navigation/native@5.2.5) (2020-05-08)

### Bug Fixes

* return a promise-like from getInitialState ([#8210](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/8210)) ([85ae378](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/85ae378d8cb1073895b281e13ebccee881d4c062))

## [5.2.4](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.2.3...@react-navigation/native@5.2.4) (2020-05-05)

### Bug Fixes

* return undefined for buildLink if linking is not enabled ([9fd2635](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/9fd2635756362c8da79656b4d9b101bebaaf7003))

## [5.2.3](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.2.2...@react-navigation/native@5.2.3) (2020-05-01)

### Bug Fixes

* default linking enabled to true ([c7b8e2e](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/c7b8e2e9666733143eef156b27f3e4995c36b856))

## [5.2.2](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.2.1...@react-navigation/native@5.2.2) (2020-05-01)

### Bug Fixes

* don't throw when using 'useLinking'. fixes [#8171](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/8171) ([10eca8b](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/10eca8b92edbce6dbef8abaf189e4b59a29b3748))

## [5.2.1](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.2.0...@react-navigation/native@5.2.1) (2020-04-30)

### Bug Fixes

* render fallback only if linking is enabled. closes [#8161](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/8161) ([1c075ff](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/1c075ffb169d233ed0515efea264a5a69b4de52e))

# [5.2.0](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.1.7...@react-navigation/native@5.2.0) (2020-04-30)

### Bug Fixes

* add catch to thenable returned by getInitialState ([d6fa279](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/d6fa279d9371c7a6403d10d209a2a64147891c63))
* return onPress instead of onClick for useLinkProps ([ae5442e](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/ae5442ebe812b91fa1f12164f27d1aeed918ab0e))

### Features

* add `useLinkBuilder` hook to build links ([2792f43](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/2792f438fe45428fe193e3708fee7ad61966cbf4))
* add a useLinkProps hook ([f2291d1](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/f2291d110faa2aa8e10c9133c1c0c28d54af7917))
* add action prop to Link ([942d2be](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/942d2be2c72720469475ce12ec8df23825994dbf))
* add Link component as useLinkTo hook for navigating to links ([2573b5b](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/2573b5beaac1240434e52f3f57bb29da2f541c88))

## [5.1.7](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.1.6...@react-navigation/native@5.1.7) (2020-04-27)

**Note:** Version bump only for package @react-navigation/native

## [5.1.6](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.1.5...@react-navigation/native@5.1.6) (2020-04-17)

### Bug Fixes

* handle in-page go back when there's no history ([6bdf6ae](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/6bdf6ae4ed0f83ac1deb3172d9075a6a2adbbe11)), closes [#7852](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/7852)

## [5.1.5](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.1.4...@react-navigation/native@5.1.5) (2020-04-08)

**Note:** Version bump only for package @react-navigation/native

## [5.1.4](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.1.3...@react-navigation/native@5.1.4) (2020-03-30)

**Note:** Version bump only for package @react-navigation/native

## [5.1.3](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.1.2...@react-navigation/native@5.1.3) (2020-03-23)

### Bug Fixes

* add info about android launchMode in useLinking error ([d94e43c](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/d94e43c3c8625b209a5c883b8cb560496d07fda7))

## [5.1.2](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.1.1...@react-navigation/native@5.1.2) (2020-03-22)

**Note:** Version bump only for package @react-navigation/native

## [5.1.1](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.1.0...@react-navigation/native@5.1.1) (2020-03-19)

**Note:** Version bump only for package @react-navigation/native

# [5.1.0](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.10...@react-navigation/native@5.1.0) (2020-03-17)

### Features

* add permanent drawer type ([#7818](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/7818)) ([6a5d0a0](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/6a5d0a035afae60d91aef78401ec8826295746fe))

## [5.0.10](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.9...@react-navigation/native@5.0.10) (2020-03-16)

**Note:** Version bump only for package @react-navigation/native

## [5.0.9](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.8...@react-navigation/native@5.0.9) (2020-03-03)

**Note:** Version bump only for package @react-navigation/native

## [5.0.8](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.7...@react-navigation/native@5.0.8) (2020-02-26)

**Note:** Version bump only for package @react-navigation/native

## [5.0.7](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.6...@react-navigation/native@5.0.7) (2020-02-21)

**Note:** Version bump only for package @react-navigation/native

## [5.0.6](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.5...@react-navigation/native@5.0.6) (2020-02-19)

**Note:** Version bump only for package @react-navigation/native

## [5.0.5](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.4...@react-navigation/native@5.0.5) (2020-02-14)

**Note:** Version bump only for package @react-navigation/native

## [5.0.4](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.3...@react-navigation/native@5.0.4) (2020-02-14)

**Note:** Version bump only for package @react-navigation/native

## [5.0.3](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.2...@react-navigation/native@5.0.3) (2020-02-12)

**Note:** Version bump only for package @react-navigation/native

## [5.0.2](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.1...@react-navigation/native@5.0.2) (2020-02-11)

### Bug Fixes

* make getInitialState async on web ([6c6102b](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/6c6102b4597b5f0e3eada9e802bc5c171ee988d0))

## [5.0.1](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.35...@react-navigation/native@5.0.1) (2020-02-10)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.35](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.34...@react-navigation/native@5.0.0-alpha.35) (2020-02-04)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.34](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.33...@react-navigation/native@5.0.0-alpha.34) (2020-02-04)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.33](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.32...@react-navigation/native@5.0.0-alpha.33) (2020-02-03)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.32](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.29...@react-navigation/native@5.0.0-alpha.32) (2020-02-02)

### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))

### Features

* add error if multiple instances of useLinking are used ([#310](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/310)) ([4bc0c8f](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/4bc0c8f66f98c0f8ce4e766648125640d01780c4))
* integrate with history API on web ([5a3f835](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/5a3f8356b05bff7ed20893a5db6804612da3e568))

# [5.0.0-alpha.30](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.29...@react-navigation/native@5.0.0-alpha.30) (2020-02-02)

### Bug Fixes

* add licenses ([0c159db](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/0c159db4c9bc85e83b5cfe6819ab2562669a4d8f))

### Features

* add error if multiple instances of useLinking are used ([#310](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/310)) ([4bc0c8f](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/4bc0c8f66f98c0f8ce4e766648125640d01780c4))
* integrate with history API on web ([5a3f835](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/5a3f8356b05bff7ed20893a5db6804612da3e568))

# [5.0.0-alpha.29](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.28...@react-navigation/native@5.0.0-alpha.29) (2020-01-24)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.28](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.27...@react-navigation/native@5.0.0-alpha.28) (2020-01-23)

### Features

* let the navigator specify if default can be prevented ([da67e13](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/da67e134d2157201360427d3c10da24f24cae7aa))

# [5.0.0-alpha.27](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.26...@react-navigation/native@5.0.0-alpha.27) (2020-01-14)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.26](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.25...@react-navigation/native@5.0.0-alpha.26) (2020-01-13)

### Bug Fixes

* make sure paths aren't aliased when building definitions ([65a5dac](https://github.com/react-navigation/react-navigation/tree/main/packages/native/commit/65a5dac2bf887f4ba081ab15bd4c9870bb15697f)), closes [#265](https://github.com/react-navigation/react-navigation/tree/main/packages/native/issues/265)

# [5.0.0-alpha.25](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.24...@react-navigation/native@5.0.0-alpha.25) (2020-01-13)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.24](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.22...@react-navigation/native@5.0.0-alpha.24) (2020-01-09)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.23](https://github.com/react-navigation/react-navigation/tree/main/packages/native/compare/@react-navigation/native@5.0.0-alpha.22...@react-navigation/native@5.0.0-alpha.23) (2020-01-09)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.22](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.21...@react-navigation/native@5.0.0-alpha.22) (2020-01-01)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.21](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.20...@react-navigation/native@5.0.0-alpha.21) (2019-12-19)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.20](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.19...@react-navigation/native@5.0.0-alpha.20) (2019-12-16)

### Features

* add nested config in deep linking ([#210](https://github.com/react-navigation/navigation-ex/issues/210)) ([8002d51](https://github.com/react-navigation/navigation-ex/commit/8002d5179524a7211c37760a4ed45e8c12af4358)), closes [#154](https://github.com/react-navigation/navigation-ex/issues/154)

# [5.0.0-alpha.19](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.18...@react-navigation/native@5.0.0-alpha.19) (2019-12-14)

### Features

* add custom theme support ([#211](https://github.com/react-navigation/navigation-ex/issues/211)) ([00fc616](https://github.com/react-navigation/navigation-ex/commit/00fc616de0572bade8aa85052cdc8290360b1d7f))

# [5.0.0-alpha.18](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.17...@react-navigation/native@5.0.0-alpha.18) (2019-12-11)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.17](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.16...@react-navigation/native@5.0.0-alpha.17) (2019-12-10)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.16](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.15...@react-navigation/native@5.0.0-alpha.16) (2019-11-17)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.15](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.14...@react-navigation/native@5.0.0-alpha.15) (2019-11-08)

### Bug Fixes

* don't call getNode if ref is already scrollable ([#162](https://github.com/react-navigation/navigation-ex/issues/162)) ([66551f2](https://github.com/react-navigation/navigation-ex/commit/66551f2))

# [5.0.0-alpha.14](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.13...@react-navigation/native@5.0.0-alpha.14) (2019-10-30)

### Bug Fixes

* support scroll to top in navigators nested in tab ([50dea65](https://github.com/react-navigation/navigation-ex/commit/50dea65))

# [5.0.0-alpha.13](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.12...@react-navigation/native@5.0.0-alpha.13) (2019-10-22)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.12](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.11...@react-navigation/native@5.0.0-alpha.12) (2019-10-15)

### Features

* initial version of native stack ([#102](https://github.com/react-navigation/navigation-ex/issues/102)) ([ba3f718](https://github.com/react-navigation/navigation-ex/commit/ba3f718))

# [5.0.0-alpha.11](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.10...@react-navigation/native@5.0.0-alpha.11) (2019-10-06)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.10](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.9...@react-navigation/native@5.0.0-alpha.10) (2019-10-03)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.9](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.8...@react-navigation/native@5.0.0-alpha.9) (2019-10-03)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.8](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.7...@react-navigation/native@5.0.0-alpha.8) (2019-09-16)

### Features

* make deep link handling more flexible ([849d952](https://github.com/react-navigation/navigation-ex/commit/849d952))
* make example run as bare react-native project as well ([#85](https://github.com/react-navigation/navigation-ex/issues/85)) ([d16c20c](https://github.com/react-navigation/navigation-ex/commit/d16c20c))

# [5.0.0-alpha.7](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.5...@react-navigation/native@5.0.0-alpha.7) (2019-08-31)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.6](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.5...@react-navigation/native@5.0.0-alpha.6) (2019-08-31)

**Note:** Version bump only for package @react-navigation/native

# [5.0.0-alpha.5](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.4...@react-navigation/native@5.0.0-alpha.5) (2019-08-29)

### Bug Fixes

* handle both null and undefined in useScrollToTop ([c951027](https://github.com/react-navigation/navigation-ex/commit/c951027))

### Features

* handle animated component wrappers in `useScrollToTop` ([#81](https://github.com/react-navigation/navigation-ex/issues/81)) ([cdbf1e9](https://github.com/react-navigation/navigation-ex/commit/cdbf1e9))
* handle more methods in useScrollToTop ([f9e8c7e](https://github.com/react-navigation/navigation-ex/commit/f9e8c7e))

# [5.0.0-alpha.4](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.3...@react-navigation/native@5.0.0-alpha.4) (2019-08-28)

### Bug Fixes

* fix stack nested in tab always getting reset ([dead4e8](https://github.com/react-navigation/navigation-ex/commit/dead4e8))

# [5.0.0-alpha.3](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.2...@react-navigation/native@5.0.0-alpha.3) (2019-08-27)

### Features

* add hook to scroll to top on tab press ([9e1104c](https://github.com/react-navigation/navigation-ex/commit/9e1104c))
* add native container ([d26b77f](https://github.com/react-navigation/navigation-ex/commit/d26b77f))

# [5.0.0-alpha.2](https://github.com/react-navigation/navigation-ex/compare/@react-navigation/native@5.0.0-alpha.1...@react-navigation/native@5.0.0-alpha.2) (2019-08-22)

### Bug Fixes

* fix path to typescript definitions ([f182315](https://github.com/react-navigation/navigation-ex/commit/f182315))

# 5.0.0-alpha.1 (2019-08-21)

### Bug Fixes

* fix peer deps and add git urls ([6b4fc74](https://github.com/react-navigation/navigation-ex/commit/6b4fc74))

### Features

* add hook for deep link support ([35987ae](https://github.com/react-navigation/navigation-ex/commit/35987ae))
* add native container with back button integration ([#48](https://github.com/react-navigation/navigation-ex/issues/48)) ([b7735af](https://github.com/react-navigation/navigation-ex/commit/b7735af))
