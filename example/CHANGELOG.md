# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.6](https://github.com/react-navigation/react-navigation/compare/@react-navigation/example@6.0.5...@react-navigation/example@6.0.6) (2023-09-25)

**Note:** Version bump only for package @react-navigation/example

## [6.0.5](https://github.com/react-navigation/react-navigation/compare/@react-navigation/example@6.0.4...@react-navigation/example@6.0.5) (2023-06-22)

**Note:** Version bump only for package @react-navigation/example

## [6.0.4](https://github.com/react-navigation/react-navigation/compare/@react-navigation/example@6.0.3...@react-navigation/example@6.0.4) (2023-02-26)

**Note:** Version bump only for package @react-navigation/example

## [6.0.3](https://github.com/react-navigation/react-navigation/compare/@react-navigation/example@6.0.2...@react-navigation/example@6.0.3) (2023-02-14)

### Bug Fixes

* added close drawer accessibility tap area ([#11184](https://github.com/react-navigation/react-navigation/issues/11184)) ([061fb13](https://github.com/react-navigation/react-navigation/commit/061fb13273686bc5337442f1026ae426399b9808)) - by @mikegarfinkle

## [6.0.2](https://github.com/react-navigation/react-navigation/compare/@react-navigation/example@6.0.1...@react-navigation/example@6.0.2) (2022-12-12)

**Note:** Version bump only for package @react-navigation/example

## [6.0.1](https://github.com/react-navigation/react-navigation/compare/@react-navigation/example@6.0.0...@react-navigation/example@6.0.1) (2022-12-07)

**Note:** Version bump only for package @react-navigation/example

# 6.0.0 (2022-11-29)

### Bug Fixes

* add config to enable redux devtools integration ([036eae0](https://github.com/react-navigation/react-navigation/commit/036eae053a4253955a5fb6029cf5565c91c78ad0)) - by @satya164
* adjust index when route names are changed ([9bc6913](https://github.com/react-navigation/react-navigation/commit/9bc6913d28bf6d2d0bb9a59146922cf580d0b849)) - by @satya164
* automatically set top inset on Android in native stack ([ab93bd7](https://github.com/react-navigation/react-navigation/commit/ab93bd7aa371a6892103734b8484a04b462969b2)) - by @satya164
* clamp interpolated styles ([c8ac148](https://github.com/react-navigation/react-navigation/commit/c8ac1488c9bef172cee74cee5a280140eaeab698)) - by @satya164
* disable screens when mode is modal on older expo versions ([fb0775c](https://github.com/react-navigation/react-navigation/commit/fb0775cea55cc2628c4f3dc1a2031c89d3ba75d0)) - by @satya164
* dispatch pop early when screen is closed with gesture ([#336](https://github.com/react-navigation/react-navigation/issues/336)) ([9d9bd93](https://github.com/react-navigation/react-navigation/commit/9d9bd9351107e316279a1c231593d0616c1fda85)), closes [#267](https://github.com/react-navigation/react-navigation/issues/267) - by @satya164
* don't force legacy implementation on chrome debugger ([4a5a202](https://github.com/react-navigation/react-navigation/commit/4a5a2029723722232f0e66de11e4d0a20665b849)) - by @satya164
* don't hide child header automatically in stack ([da8581e](https://github.com/react-navigation/react-navigation/commit/da8581e93eaf5e08486e873ded2e859b9ff4fac7)) - by @satya164
* don't perform side-effects in setState ([a62e9e5](https://github.com/react-navigation/react-navigation/commit/a62e9e5b4263e9bae11dd0debe7c51090bd47af1)) - by @satya164
* drop dangerously prefix from getState and getParent ([fb12380](https://github.com/react-navigation/react-navigation/commit/fb12380f8b64c58c17de434fc3390171d729e331)) - by @satya164
* ensure same @types/react version in repo ([#10663](https://github.com/react-navigation/react-navigation/issues/10663)) ([c9de2c1](https://github.com/react-navigation/react-navigation/commit/c9de2c1e8a990eb393fa9b9b44c339bfb12aed3c)), closes [#10655](https://github.com/react-navigation/react-navigation/issues/10655) - by @kacperkapusciak
* fix building link with useLinkProps ([ec813fb](https://github.com/react-navigation/react-navigation/commit/ec813fb426615e8d2de780322f366346ed71d761)) - by @satya164
* fix error with type definitions. closes [#8511](https://github.com/react-navigation/react-navigation/issues/8511) ([2b55133](https://github.com/react-navigation/react-navigation/commit/2b55133461cc9b83949224a6860463a0e8ac12ea)) - by @satya164
* fix false warning due to change in Object.assign in metro preset ([98d6938](https://github.com/react-navigation/react-navigation/commit/98d69381d406c9c6d87e9725771f47985a2e4391)), closes [#8584](https://github.com/react-navigation/react-navigation/issues/8584) - by @satya164
* fix headerTransparent not working outside stack navigator ([02ab54e](https://github.com/react-navigation/react-navigation/commit/02ab54e8a376ef39d4605786072fed7312b48e30)) - by @satya164
* fix incorrect name for headerTransparent ([6f24a6d](https://github.com/react-navigation/react-navigation/commit/6f24a6d60f44ef532dcdabb1725f96b63503776f)) - by @satya164
* fix incorrect warning for headerTransparent in native-stack ([a7180cf](https://github.com/react-navigation/react-navigation/commit/a7180cf033f14d46118e85faf7fef59cfb518bbf)), closes [#10502](https://github.com/react-navigation/react-navigation/issues/10502) - by @satya164
* fix integration tests ([f2cb389](https://github.com/react-navigation/react-navigation/commit/f2cb38952b98e5a072c5a9f56bc118394c624e9a)) - by @satya164
* fix modal animation not being set properly ([8985503](https://github.com/react-navigation/react-navigation/commit/8985503dbcec638e267975a1d7ee06d1f7f67080)) - by @satya164
* fix tab router in example app ([79a2b12](https://github.com/react-navigation/react-navigation/commit/79a2b12aeffdd7235ceadcdf46871837b52b6e29)) - by @satya164
* fix transparent modal when another screen is pushed on top ([97efa7b](https://github.com/react-navigation/react-navigation/commit/97efa7b56859eccb6dbec4f3cdbe136525690ee8)), closes [#10298](https://github.com/react-navigation/react-navigation/issues/10298) - by @satya164
* fix type error when passing unannotated navigation ref ([5d35bd9](https://github.com/react-navigation/react-navigation/commit/5d35bd9f363bb2351ea4cdbacc86fbfa121f661f)) - by @satya164
* fix type signature for setParams ([#24](https://github.com/react-navigation/react-navigation/issues/24)) ([469800b](https://github.com/react-navigation/react-navigation/commit/469800be232f476f02a0f63f9994b18fd925d9c0)) - by @satya164
* focus a navigator when you navigate to a screen in it ([1cc7728](https://github.com/react-navigation/react-navigation/commit/1cc7728b7168db0a09175288c73d859cfe514a3b)) - by @satya164
* hide header shadow for transparent header ([a3b2e29](https://github.com/react-navigation/react-navigation/commit/a3b2e29a0ce035cba2175829628417139844a687)) - by @satya164
* improve when back button is shown in nested native stacks ([#10761](https://github.com/react-navigation/react-navigation/issues/10761)) ([4cfc9ac](https://github.com/react-navigation/react-navigation/commit/4cfc9ac3583b858ebc89914fa73e8b96e9f6f01d)) - by @satya164
* make native stack background transparent when using transparentModal ([cf6687b](https://github.com/react-navigation/react-navigation/commit/cf6687b08cd0cc125baa6291de907fa12c404f42)) - by @satya164
* make rehydration keys stable ([98393b6](https://github.com/react-navigation/react-navigation/commit/98393b64d951ac000484e945a1221fdd21f12118)) - by @satya164
* make sure disabling react-native-screens works ([95572bd](https://github.com/react-navigation/react-navigation/commit/95572bd5d410c70d75dceabd5fcfbcc493076100)) - by @satya164
* make sure new state events are emitted when new navigators mount ([ddcd84c](https://github.com/react-navigation/react-navigation/commit/ddcd84c205f178342a2e9fcb7dc91c48b2ae5503)) - by @satya164
* make sure the wildcard pattern catches nested unmatched routes ([72d2135](https://github.com/react-navigation/react-navigation/commit/72d2135ed84c632842fd7d99f5bdaa93faeae0ca)) - by @satya164
* make transparent modal work with modal presentation ([338e008](https://github.com/react-navigation/react-navigation/commit/338e0086f90f2af195c70b9650be49b436a64546)) - by @satya164
* merge params on navigate in example ([0167e79](https://github.com/react-navigation/react-navigation/commit/0167e794d7c64df1c4954c0c5766cee6bffef28c)) - by @satya164
* only propagate navigate to children ([68ab592](https://github.com/react-navigation/react-navigation/commit/68ab592ac931e73456976c856bbb5eb1f6957d8b)) - by @satya164
* properly handle history if drawer is open by default ([c24dc92](https://github.com/react-navigation/react-navigation/commit/c24dc928fff5cf2f2c08316aa3acb13d707bce49)) - by @satya164
* provide initial values for safe area to prevent blank screen ([#238](https://github.com/react-navigation/react-navigation/issues/238)) ([ee63e7c](https://github.com/react-navigation/react-navigation/commit/ee63e7c097c3ea0a66561958e18c05eb94aecc5b)) - by @satya164
* relatively position float Header if !headerTransparent ([#8285](https://github.com/react-navigation/react-navigation/issues/8285)) ([9ef7119](https://github.com/react-navigation/react-navigation/commit/9ef71197890bb2170cb927bbb3bcf6f8b89713a5)) - by @Ashoat
* render fallback only if linking is enabled. closes [#8161](https://github.com/react-navigation/react-navigation/issues/8161) ([09cd33d](https://github.com/react-navigation/react-navigation/commit/09cd33df1ceac8c2798ba08cd9e6fb0ff8449b39)) - by @satya164
* replace deprecated I18nManager.isRTL with 18nManager.getConstants().isRTL ([#10547](https://github.com/react-navigation/react-navigation/issues/10547)) ([cf2aea3](https://github.com/react-navigation/react-navigation/commit/cf2aea386ed494641008bf06184c77e15df3d8f4)) - by @mohammadgharouni
* return onPress instead of onClick for useLinkProps ([9b96e46](https://github.com/react-navigation/react-navigation/commit/9b96e46bab0966c0deb959c72ed7fcad73bd6e32)) - by @satya164
* rtl in native app example ([d189e1f](https://github.com/react-navigation/react-navigation/commit/d189e1f8fa1bafdb201195728607a35060ebfd1c)) - by @osdnk
* screens integration on Android ([#294](https://github.com/react-navigation/react-navigation/issues/294)) ([de5cc08](https://github.com/react-navigation/react-navigation/commit/de5cc08fcecb0f15019e874a1beda901db86c9d1)) - by @osdnk
* set header to translucent when using searchbar or large title ([8df0c47](https://github.com/react-navigation/react-navigation/commit/8df0c4714e3ea5762b2eb1ced4b24b44639d5530)) - by @satya164
* set statusbar to translucent on Android ([b320b8d](https://github.com/react-navigation/react-navigation/commit/b320b8d0238ba1ac414bb0e8c203a51c77559439)) - by @satya164
* show a missing icon symbol instead of empty area in bottom tab bar ([e017428](https://github.com/react-navigation/react-navigation/commit/e017428504d927bb0f0a35240196ff69c2a6af33)) - by @satya164
* show error when beforeRemove is used to prevent action in naive stack ([61505bc](https://github.com/react-navigation/react-navigation/commit/61505bc7adae1bd5e9b48dcc98f31682c366335e)) - by @satya164
* spread parent params to children in compat navigator ([bbfeb86](https://github.com/react-navigation/react-navigation/commit/bbfeb8668d7da25109e24590688edf610f2c7936)), closes [#6785](https://github.com/react-navigation/react-navigation/issues/6785) - by @satya164
* strongly type the `component` prop on `RouteConfigComponent` ([#10519](https://github.com/react-navigation/react-navigation/issues/10519)) ([8850c51](https://github.com/react-navigation/react-navigation/commit/8850c51848ca081dc02365ef574d11f7f7b97dd3)) - by @thomasttvo
* update ci image for playwright ([afb6df5](https://github.com/react-navigation/react-navigation/commit/afb6df53035a9e9a060fa94ce2e04a533dae927c)) - by @satya164
* update screens for native stack ([698334b](https://github.com/react-navigation/react-navigation/commit/698334b5566475a9c1686bf94cd50f63dde6be2e)) - by @satya164
* update URL on web when params change. fixes [#10046](https://github.com/react-navigation/react-navigation/issues/10046) ([6b01b21](https://github.com/react-navigation/react-navigation/commit/6b01b21f70a2ae402a8979e5834200ef8e8642bf)) - by @satya164
* use safe area context in material bottom tabs ([2037779](https://github.com/react-navigation/react-navigation/commit/2037779c3ffe3610d1d25d3c782a78352990d587)) - by @satya164
* wrap navigators in gesture handler root ([699d376](https://github.com/react-navigation/react-navigation/commit/699d3768a6ae965cb1d713ab3f35c1da3998e3e4)) - by @satya164
* wrong setParams type if route does not have params ([#10512](https://github.com/react-navigation/react-navigation/issues/10512)) ([a3a998d](https://github.com/react-navigation/react-navigation/commit/a3a998da16cf62ed09df01705ee20f17c8b8f68d)) - by @Gustash

### Code Refactoring

* drop mode prop in favor of animationPresentation option ([554e440](https://github.com/react-navigation/react-navigation/commit/554e440fb4c5bbb3a70a951d6c3281a08ab23b66)) - by @satya164
* drop support for tabBarVisible option ([689e4c4](https://github.com/react-navigation/react-navigation/commit/689e4c4cf0be8297ecf323ed9bc5355de5568c21)) - by @satya164
* move drawerContentOptions to options ([eb65363](https://github.com/react-navigation/react-navigation/commit/eb653636c566c8b656608a39ab71d4407cfa3a7c)) - by @satya164
* move headerMode to options ([50f50a6](https://github.com/react-navigation/react-navigation/commit/50f50a68f3323b896a8c3ab0a6da027d97739069)) - by @satya164
* simplify props for stack and drawer headers ([f21a630](https://github.com/react-navigation/react-navigation/commit/f21a630de94c9919fd09f34de319ba25a4b25a29)) - by @satya164

### Features

* add 'transparentModal' presentation to JS stack ([c3cfe75](https://github.com/react-navigation/react-navigation/commit/c3cfe75546d316ea0d6c1b40f3d95c0a67e6a9cf)) - by @satya164
* add `animationTypeForReplace` option ([#297](https://github.com/react-navigation/react-navigation/issues/297)) ([f1e85b0](https://github.com/react-navigation/react-navigation/commit/f1e85b075f69bc9d4860df358f760ebd909f093c)) - by @satya164
* add `screens` prop for nested configs ([#308](https://github.com/react-navigation/react-navigation/issues/308)) ([6990cc4](https://github.com/react-navigation/react-navigation/commit/6990cc4ddc9c5c53897b4ff4dd87f54e69855440)) - by @WoLewicki
* add `useLinkBuilder` hook to build links ([e49eea0](https://github.com/react-navigation/react-navigation/commit/e49eea00b529cc88945200801d3fee5633afdd97)) - by @satya164
* add a `beforeRemove` event ([9d321d0](https://github.com/react-navigation/react-navigation/commit/9d321d096862fa12191fdbdab73dcf4b83b420a1)) - by @satya164
* add a `navigationKey` prop to Screen and Group ([f75ffac](https://github.com/react-navigation/react-navigation/commit/f75ffacac63baddaa0d6d6ac7bfd3ef6ec03df20)) - by @satya164
* add a Background component ([727ae2d](https://github.com/react-navigation/react-navigation/commit/727ae2d647ba58382ab40d78773363d2292adb27)) - by @satya164
* add a getComponent prop to lazily specify components ([74592a4](https://github.com/react-navigation/react-navigation/commit/74592a4f3854bceebb1ca0a218da5bce5843edc9)) - by @satya164
* add a hook to update document title ([2d86d23](https://github.com/react-navigation/react-navigation/commit/2d86d2399e4394f040766b034fbe745d8f745898)) - by @satya164
* add a NavigatorScreenParams type. closes [#6931](https://github.com/react-navigation/react-navigation/issues/6931) ([c0c7a1f](https://github.com/react-navigation/react-navigation/commit/c0c7a1f013c7e0614283753ceaa9616b0c7560e4)) - by @satya164
* add a new component to group multiple screens with common options ([12df3d7](https://github.com/react-navigation/react-navigation/commit/12df3d7700fd68768c92ec366ded3e30aabde461)) - by @satya164
* add a setOptions method to set screen options ([5973985](https://github.com/react-navigation/react-navigation/commit/5973985587f147c0cee6a030f9ae63e76b1d8f98)) - by @satya164
* add a slide animation for modals on Android ([4b639fb](https://github.com/react-navigation/react-navigation/commit/4b639fbacff9b6c509046b0b5d5effc2f4619096)) - by @satya164
* add a tabBarBackground option to bottom tabs ([608d7c5](https://github.com/react-navigation/react-navigation/commit/608d7c5fd4e3f71b81401384282bf914aaf9d0ad)) - by @satya164
* add a useFocusEffect hook ([62218ea](https://github.com/react-navigation/react-navigation/commit/62218eaa793baad77740d3c3f3321a7730be6691)) - by @satya164
* add a useLinkProps hook ([ef4776d](https://github.com/react-navigation/react-navigation/commit/ef4776d700bfd2adee14ba51de9b6fb3da2ccfdc)) - by @satya164
* add ability to specify root param list ([d0bff2d](https://github.com/react-navigation/react-navigation/commit/d0bff2d7bd25ead73e47e69e4955373bdf17d64e)) - by @satya164
* add action prop to Link ([7d51b9e](https://github.com/react-navigation/react-navigation/commit/7d51b9e3b672a3fca659791bbcb9c9fa3f912df3)) - by @satya164
* add an ID prop to navigators ([5949831](https://github.com/react-navigation/react-navigation/commit/5949831f7a33b45ca10a1df92d5c3416d184959d)) - by @satya164
* add an isFirstRouteInParent method ([7d1070a](https://github.com/react-navigation/react-navigation/commit/7d1070a402a8eec3e75557c3e56be3083c688bcf)) - by @satya164
* add backBehavior to TabRouter ([52777c6](https://github.com/react-navigation/react-navigation/commit/52777c6306c0f238590852dfdd373d90c32c4b00)) - by @satya164
* add basic deep linking example ([752c126](https://github.com/react-navigation/react-navigation/commit/752c12615dc538951a5faea9632ecb79d6496d0d)) - by @satya164
* add basic nesting example ([07fd3e4](https://github.com/react-navigation/react-navigation/commit/07fd3e4646cbb6a4be4fca8a1881f58526e5fa0d)) - by @satya164
* add custom theme support ([#211](https://github.com/react-navigation/react-navigation/issues/211)) ([a83f6e0](https://github.com/react-navigation/react-navigation/commit/a83f6e0e251178f1176a996ae1659908360ef17a)) - by @satya164
* add customAnimationOnGesture & fullScreenSwipeEnabled props to native-stack ([#10321](https://github.com/react-navigation/react-navigation/issues/10321)) ([e114cba](https://github.com/react-navigation/react-navigation/commit/e114cbaf67d2d70b074290b69312d6caa0fea608)) - by @kacperkapusciak
* add deeplinking to native example ([#309](https://github.com/react-navigation/react-navigation/issues/309)) ([b4178f0](https://github.com/react-navigation/react-navigation/commit/b4178f00a75d39e640b10d68c1a4a57affb69213)) - by @osdnk
* add devtools package ([#8436](https://github.com/react-navigation/react-navigation/issues/8436)) ([02c3e2c](https://github.com/react-navigation/react-navigation/commit/02c3e2c9693ae8c39d139188653af9b232876021)) - by @satya164
* add headerStatusBarHeight option to stack ([4022a4e](https://github.com/react-navigation/react-navigation/commit/4022a4e7069fbd978e5c14490c49ec6b03b30409)) - by @satya164
* add helper and hook for container ref ([15caa56](https://github.com/react-navigation/react-navigation/commit/15caa56b615a4f4090d4f6637e03bc965b514454)) - by @satya164
* add helper to get focused route name from nested state ([#8435](https://github.com/react-navigation/react-navigation/issues/8435)) ([6f2b9c6](https://github.com/react-navigation/react-navigation/commit/6f2b9c6dc21ffa4716d446dabc5ea0d4deabc9e2)) - by @satya164
* add Link component as useLinkTo hook for navigating to links ([1d6773c](https://github.com/react-navigation/react-navigation/commit/1d6773c9cbfde8747c4be1830013b8fb35f190c8)) - by @satya164
* add more acttions ([7e05004](https://github.com/react-navigation/react-navigation/commit/7e050044da27c3e1800dfb2c23a7fb9813037663)) - by @satya164
* add openByDefault option to drawer ([e9740c3](https://github.com/react-navigation/react-navigation/commit/e9740c38499d60ef123e54dc38ffe6c0f45cc553)) - by @satya164
* add option to show a header in drawer navigator screens ([ea0adc4](https://github.com/react-navigation/react-navigation/commit/ea0adc4ba01accbbf38c382bbba9fb1307df9318)) - by @satya164
* add permanent drawer type ([#7818](https://github.com/react-navigation/react-navigation/issues/7818)) ([09fa393](https://github.com/react-navigation/react-navigation/commit/09fa3935ae93fe9c2c33e6705af96dbe84e26eb3)) - by @satya164
* add preventDefault functionality in material bottom tabs ([db67b7d](https://github.com/react-navigation/react-navigation/commit/db67b7d7af346772c979132a6c387f637034a136)) - by @satya164
* add search bar to native-stack on Android ([9b94f2c](https://github.com/react-navigation/react-navigation/commit/9b94f2c02b10b94e923317b258f4598457535e5a)) - by @ChrisEdson
* add support for badges to bottom tab bar ([4d40daf](https://github.com/react-navigation/react-navigation/commit/4d40daf246c44d9fcc86d626f53fe421eb02d2ac)) - by @satya164
* add support for params ([6b83581](https://github.com/react-navigation/react-navigation/commit/6b8358175aedfb31738b7a0f6135d06b44ee3caf)) - by @satya164
* add target argument to setParams ([#18](https://github.com/react-navigation/react-navigation/issues/18)) ([0c9618f](https://github.com/react-navigation/react-navigation/commit/0c9618f013a9ddbcd50d57b706294b0f4c7f170c)) - by @osdnk
* add typed navigator for better typechecking ([c1e14de](https://github.com/react-navigation/react-navigation/commit/c1e14de5b7b0d9f9e6646288338b68df12e649f3)) - by @satya164
* add wildcard patterns for paths ([0a58014](https://github.com/react-navigation/react-navigation/commit/0a580145cf708a5682deff8be9d5809d5fc311ae)), closes [#8019](https://github.com/react-navigation/react-navigation/issues/8019) - by @satya164
* associate path with the route it opens when deep linking ([#9384](https://github.com/react-navigation/react-navigation/issues/9384)) ([cc8bb8c](https://github.com/react-navigation/react-navigation/commit/cc8bb8c92c3eaa1fb980bac5db451b8dbe6a5a43)), closes [#9102](https://github.com/react-navigation/react-navigation/issues/9102) - by @satya164
* automatically hide header in nested stacks ([ad5048d](https://github.com/react-navigation/react-navigation/commit/ad5048d01c3ba2632e57cd77460e005f2fc740d2)) - by @satya164
* automatically set headerMode if it's modal presentation style ([c9a683c](https://github.com/react-navigation/react-navigation/commit/c9a683c7d8931a3a3dfe5486fa9288998bec52ae)) - by @satya164
* emit appear and dismiss events for native stack ([c8e1d74](https://github.com/react-navigation/react-navigation/commit/c8e1d741a428878d8b80f60f1c9963dd69541560)) - by @satya164
* expose animationEnabled in material top tabs ([c0130ff](https://github.com/react-navigation/react-navigation/commit/c0130ffe046f30241e26d95d05df235fcf6d70de)) - by @satya164
* handle route names change ([66c7131](https://github.com/react-navigation/react-navigation/commit/66c71319cde9cd4d3db6c75b547a03420f3ade6c)) - by @satya164
* implement usePreventRemove hook ([#10682](https://github.com/react-navigation/react-navigation/issues/10682)) ([501b9e6](https://github.com/react-navigation/react-navigation/commit/501b9e603cc558bce49a4b07342a6587929d6cde)) - by @kacperkapusciak
* improve types for options and support a function ([8473db5](https://github.com/react-navigation/react-navigation/commit/8473db5f8c4f9039134a610c42998bc78a43d671)) - by @satya164
* initial implementation of a flipper plugin ([2cdb1f4](https://github.com/react-navigation/react-navigation/commit/2cdb1f43a9d253f1eaa9fb0b1cee364b167b0bf9)) - by @satya164
* initialState should take priority over deep link ([bdf5e11](https://github.com/react-navigation/react-navigation/commit/bdf5e112c9dba9dbe2522765f6275f2c51436daf)) - by @satya164
* integrate with history API on web ([998dc97](https://github.com/react-navigation/react-navigation/commit/998dc97a713cf5b1f5be0db4e39129ee29810182)) - by @satya164
* let child navigators handle actions from parent ([21f7a9e](https://github.com/react-navigation/react-navigation/commit/21f7a9eedfbd1e5dfe633548df9a9ad3af1e6992)) - by @osdnk
* make actions work across navigators ([83c8d5a](https://github.com/react-navigation/react-navigation/commit/83c8d5a19d4f9fad599817784880eccd563a952d)) - by @satya164
* make NAVIGATE and JUMP_TO to support key and name of the route ([#16](https://github.com/react-navigation/react-navigation/issues/16)) ([0150c60](https://github.com/react-navigation/react-navigation/commit/0150c600c476a7726c8463e74b12b36d6545419e)) - by @osdnk
* **native-stack:** add support for header background image ([bc174a8](https://github.com/react-navigation/react-navigation/commit/bc174a8c545ce3baabc9904ddac2debf69e0febf)) - by @
* respect key when reseting state ([d2c658e](https://github.com/react-navigation/react-navigation/commit/d2c658ed018cce67899a78d27dea1a192c6be7fa)) - by @satya164
* rework linking configuration to be more strict ([#8502](https://github.com/react-navigation/react-navigation/issues/8502)) ([5ce7554](https://github.com/react-navigation/react-navigation/commit/5ce75544e1ddfa5d83581c421c68d698126ccd89)) - by @satya164
* support mixing regular and modal presentation in same stack ([af9f1db](https://github.com/react-navigation/react-navigation/commit/af9f1db6f6b2fecc83993e63630f86886cb49463)) - by @satya164
* support navigate-like object in Link ([3cf4e3d](https://github.com/react-navigation/react-navigation/commit/3cf4e3d63ab76e0ed7542a459f53155e0803ec7a)) - by @satya164
* support options ([ebf811c](https://github.com/react-navigation/react-navigation/commit/ebf811cc08b47fb0af6a86a2d50d2a59d4b85156)) - by @satya164
* update react-native-safe-area-context to 1.0.0 ([#8182](https://github.com/react-navigation/react-navigation/issues/8182)) ([2a6667f](https://github.com/react-navigation/react-navigation/commit/2a6667fe55eca9db436eb18fdde447a3a143bb7e)) - by @janicduplessis
* upgrade to latest react-native-tab-view using ViewPager ([75ac824](https://github.com/react-navigation/react-navigation/commit/75ac8249eb0694727f88e6b30ac7a23e54e81dd8)) - by @satya164
* use modal presentation style for modals on iOS by default ([f1ad641](https://github.com/react-navigation/react-navigation/commit/f1ad641566b4d3b37be0453fc8d5acf18f2b8664)) - by @satya164

### BREAKING CHANGES

* This drops the mode prop on the navigator in favor of a per-screen option animationPresentation
* headerMode is now moved to options instead of props
* This commit moves options from `drawerContentOptions` to regular `options` in order to reduce confusion between the two, as well as to make it more flexible to configure the drawer on a per screen basis.
* We need to add support for specifying style for tab bar in options to support the use cases which need this.
* Previously, the stack header accepted scene and previous scene which contained things such as descriptor, navigation prop, progress etc. The commit simplifies them to pass `route`, `navigation`, `options` and `progress` directly to the header. Similaryly, the `previous` argument now contains `options`, `route` and `progress`.

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
