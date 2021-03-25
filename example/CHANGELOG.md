# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.1.0](https://github.com/react-navigation/react-navigation/compare/@react-navigation/example@5.0.0-alpha.23...@react-navigation/example@5.1.0) (2020-05-20)


### Bug Fixes

* add config to enable redux devtools integration ([c9c825b](https://github.com/react-navigation/react-navigation/commit/c9c825bee61426635a28ee149eeeff3d628171cd))
* clamp interpolated styles ([67798af](https://github.com/react-navigation/react-navigation/commit/67798af869dcbbf323629fc7e7cc9062d1e12c29))
* disable screens when mode is modal on older expo versions ([94d7b28](https://github.com/react-navigation/react-navigation/commit/94d7b28c0b2ce0d56c99b224610f305be6451626))
* dispatch pop early when screen is closed with gesture ([#336](https://github.com/react-navigation/react-navigation/issues/336)) ([3d937d1](https://github.com/react-navigation/react-navigation/commit/3d937d1e6571cd613e830d64f7b2e7426076d371)), closes [#267](https://github.com/react-navigation/react-navigation/issues/267)
* provide initial values for safe area to prevent blank screen ([#238](https://github.com/react-navigation/react-navigation/issues/238)) ([77b7570](https://github.com/react-navigation/react-navigation/commit/77b757091c0451e20bca01138629669c7da544a8))
* render fallback only if linking is enabled. closes [#8161](https://github.com/react-navigation/react-navigation/issues/8161) ([1c075ff](https://github.com/react-navigation/react-navigation/commit/1c075ffb169d233ed0515efea264a5a69b4de52e))
* return onPress instead of onClick for useLinkProps ([ae5442e](https://github.com/react-navigation/react-navigation/commit/ae5442ebe812b91fa1f12164f27d1aeed918ab0e))
* rtl in native app example ([50b366e](https://github.com/react-navigation/react-navigation/commit/50b366e7341f201d29a44f20b7771b3a832b0045))
* screens integration on Android ([#294](https://github.com/react-navigation/react-navigation/issues/294)) ([9bfb295](https://github.com/react-navigation/react-navigation/commit/9bfb29562020c61b4d5c9bee278bcb1c7bdb8b67))
* spread parent params to children in compat navigator ([24febf6](https://github.com/react-navigation/react-navigation/commit/24febf6ea99be2e5f22005fdd2a82136d647255c)), closes [#6785](https://github.com/react-navigation/react-navigation/issues/6785)
* update screens for native stack ([5411816](https://github.com/react-navigation/react-navigation/commit/54118161885738a6d20b062c7e6679f3bace8424))
* wrap navigators in gesture handler root ([41a5e1a](https://github.com/react-navigation/react-navigation/commit/41a5e1a385aa5180abc3992a4c67077c37b998b9))


### Features

* add `animationTypeForReplace` option ([#297](https://github.com/react-navigation/react-navigation/issues/297)) ([6262f72](https://github.com/react-navigation/react-navigation/commit/6262f7298bff843571fb4b1a677d3beabe29833e))
* add `screens` prop for nested configs ([#308](https://github.com/react-navigation/react-navigation/issues/308)) ([b931ae6](https://github.com/react-navigation/react-navigation/commit/b931ae62dfb2c5253c94ea5ace73e9070ec17c4a))
* add `useLinkBuilder` hook to build links ([2792f43](https://github.com/react-navigation/react-navigation/commit/2792f438fe45428fe193e3708fee7ad61966cbf4))
* add a useLinkProps hook ([f2291d1](https://github.com/react-navigation/react-navigation/commit/f2291d110faa2aa8e10c9133c1c0c28d54af7917))
* add action prop to Link ([942d2be](https://github.com/react-navigation/react-navigation/commit/942d2be2c72720469475ce12ec8df23825994dbf))
* add custom theme support ([#211](https://github.com/react-navigation/react-navigation/issues/211)) ([00fc616](https://github.com/react-navigation/react-navigation/commit/00fc616de0572bade8aa85052cdc8290360b1d7f))
* add deeplinking to native example ([#309](https://github.com/react-navigation/react-navigation/issues/309)) ([e55e866](https://github.com/react-navigation/react-navigation/commit/e55e866af2f2163ee89bc527997cda13ffeb2abe))
* add headerStatusBarHeight option to stack ([b201fd2](https://github.com/react-navigation/react-navigation/commit/b201fd20716a2f03cb9373c72281f5d396a9356d))
* add Link component as useLinkTo hook for navigating to links ([2573b5b](https://github.com/react-navigation/react-navigation/commit/2573b5beaac1240434e52f3f57bb29da2f541c88))
* add openByDefault option to drawer ([36689e2](https://github.com/react-navigation/react-navigation/commit/36689e24c21b474692bb7ecd0b901c8afbbe9a20))
* add permanent drawer type ([#7818](https://github.com/react-navigation/react-navigation/issues/7818)) ([6a5d0a0](https://github.com/react-navigation/react-navigation/commit/6a5d0a035afae60d91aef78401ec8826295746fe))
* add preventDefault functionality in material bottom tabs ([3dede31](https://github.com/react-navigation/react-navigation/commit/3dede316ccab3b2403a475f60ce20b5c4e4cc068))
* emit appear and dismiss events for native stack ([f1df4a0](https://github.com/react-navigation/react-navigation/commit/f1df4a080877b3642e748a41a5ffc2da8c449a8c))
* initialState should take priority over deep link ([039017b](https://github.com/react-navigation/react-navigation/commit/039017bc2af69120d2d10e8f2c8a62919c37eb65))
* integrate with history API on web ([5a3f835](https://github.com/react-navigation/react-navigation/commit/5a3f8356b05bff7ed20893a5db6804612da3e568))
