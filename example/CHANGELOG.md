# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 6.0.0-alpha.0 (2025-12-19)

* feat!: add a direction prop to NavigationContainer to specify rtl (#11393) ([8309636](https://github.com/react-navigation/react-navigation/commit/830963653fb5a489d02f1503222629373319b39e)), closes [#11393](https://github.com/react-navigation/react-navigation/issues/11393) - by @
* refactor!: improve the API for Link component ([7f35837](https://github.com/react-navigation/react-navigation/commit/7f3583793ad17475531e155f1f433ffa16547015)) - by @
* fix!: align onReady callback and navigationRef.isReady ([1959baa](https://github.com/react-navigation/react-navigation/commit/1959baa97c101712db84905827f13a8a78a42ca7)) - by @
* feat!: add `popTo` method for stack and remove going back behaviour of ([c9c2163](https://github.com/react-navigation/react-navigation/commit/c9c2163d28da963bd760cf395d17efe9b851f531)) - by @

### Bug Fixes

* add a workaround for incorrect inference [#12041](https://github.com/react-navigation/react-navigation/issues/12041) ([85c4bbb](https://github.com/react-navigation/react-navigation/commit/85c4bbbf535cde2ba9cd537a2a5ce34f060d32b9)) - by @
* add config to enable redux devtools integration ([036eae0](https://github.com/react-navigation/react-navigation/commit/036eae053a4253955a5fb6029cf5565c91c78ad0)) - by @
* add fallback for PagerViewAdapter on web ([4a02c42](https://github.com/react-navigation/react-navigation/commit/4a02c42b3cfa2df1e57eed8f8c60119be8e42efb)) - by @satya164
* add more checks on how path param is parsed ([f05681d](https://github.com/react-navigation/react-navigation/commit/f05681d226663a582e23bf66e0bfa83145627af3)) - by @satya164
* adjust header shadow color on iOS ([9dc2aca](https://github.com/react-navigation/react-navigation/commit/9dc2acacd4ef52e5dc4ef7d8aebab162f761d74c)) - by @
* adjust header spacing on Android ([c3bf563](https://github.com/react-navigation/react-navigation/commit/c3bf5635ab61321aaab6ef41d4e3fbe527f0f60f)) - by @satya164
* adjust index when route names are changed ([9bc6913](https://github.com/react-navigation/react-navigation/commit/9bc6913d28bf6d2d0bb9a59146922cf580d0b849)) - by @
* adjust useNavigationState type for dynamic navigators ([fe13455](https://github.com/react-navigation/react-navigation/commit/fe13455f255f6dadf1c373ece1cea4e3703727ab)) - by @satya164
* Allow to use `PlatformColor` in the theme ([#11570](https://github.com/react-navigation/react-navigation/issues/11570)) ([64734e7](https://github.com/react-navigation/react-navigation/commit/64734e7bc0d7f203d8e5db6abcc9a88157a5f16c)) - by @
* animate rearranging screens as push ([dd16a57](https://github.com/react-navigation/react-navigation/commit/dd16a5715783a3fc02f899ad2a0470f7b22b04eb)) - by @
* automatically set top inset on Android in native stack ([ab93bd7](https://github.com/react-navigation/react-navigation/commit/ab93bd7aa371a6892103734b8484a04b462969b2)) - by @
* avoid re-rendering screen when nested navigator state changes ([#11547](https://github.com/react-navigation/react-navigation/issues/11547)) ([2c0f604](https://github.com/react-navigation/react-navigation/commit/2c0f604345f01e75ba542fa7422e78c91fc323c0)) - by @
* avoid using column-reverse for header for a11y on web ([3101d04](https://github.com/react-navigation/react-navigation/commit/3101d0406c32163c0576cb5c4712755c01b1a17c)) - by @
* bottom bar animation tied with a screen ([#11572](https://github.com/react-navigation/react-navigation/issues/11572)) ([9ee55bc](https://github.com/react-navigation/react-navigation/commit/9ee55bc0eee9e7257b7dd914ca994c37384877a0)) - by @
* clamp interpolated styles ([c8ac148](https://github.com/react-navigation/react-navigation/commit/c8ac1488c9bef172cee74cee5a280140eaeab698)) - by @
* disable prevent default for native tabs ([ea14dc1](https://github.com/react-navigation/react-navigation/commit/ea14dc1594d7558b3765e996ca19cb279dd416f9)) - by @satya164
* disable screens when mode is modal on older expo versions ([fb0775c](https://github.com/react-navigation/react-navigation/commit/fb0775cea55cc2628c4f3dc1a2031c89d3ba75d0)) - by @
* dispatch pop early when screen is closed with gesture ([#336](https://github.com/react-navigation/react-navigation/issues/336)) ([9d9bd93](https://github.com/react-navigation/react-navigation/commit/9d9bd9351107e316279a1c231593d0616c1fda85)), closes [#267](https://github.com/react-navigation/react-navigation/issues/267) - by @
* don't extends RootParamList in Link to allow overrides ([d928289](https://github.com/react-navigation/react-navigation/commit/d9282892dbfe9c1ac2d3616adea0d2ed55176434)) - by @satya164
* don't force legacy implementation on chrome debugger ([4a5a202](https://github.com/react-navigation/react-navigation/commit/4a5a2029723722232f0e66de11e4d0a20665b849)) - by @
* don't hide child header automatically in stack ([da8581e](https://github.com/react-navigation/react-navigation/commit/da8581e93eaf5e08486e873ded2e859b9ff4fac7)) - by @
* don't override headerRight with headerRightItems on Android ([9517a1a](https://github.com/react-navigation/react-navigation/commit/9517a1ade770c00efc4d13cc9e82b3ef50be0d4e)) - by @satya164
* don't perform side-effects in setState ([a62e9e5](https://github.com/react-navigation/react-navigation/commit/a62e9e5b4263e9bae11dd0debe7c51090bd47af1)) - by @
* drop commonjs module to avoid dual package hazard ([f0fbcc5](https://github.com/react-navigation/react-navigation/commit/f0fbcc5515e73b454f607bd95bba40a48e852d0f)) - by @
* drop dangerously prefix from getState and getParent ([fb12380](https://github.com/react-navigation/react-navigation/commit/fb12380f8b64c58c17de434fc3390171d729e331)) - by @
* ensure same @types/react version in repo ([#10663](https://github.com/react-navigation/react-navigation/issues/10663)) ([c9de2c1](https://github.com/react-navigation/react-navigation/commit/c9de2c1e8a990eb393fa9b9b44c339bfb12aed3c)), closes [#10655](https://github.com/react-navigation/react-navigation/issues/10655) - by @
* fix building link with useLinkProps ([ec813fb](https://github.com/react-navigation/react-navigation/commit/ec813fb426615e8d2de780322f366346ed71d761)) - by @
* fix custom tab bar example ([4a728e6](https://github.com/react-navigation/react-navigation/commit/4a728e6cb581cd5252e284cf08631ff8acd4d393)) - by @satya164
* fix deprecation warning for shadow styles on react-native-web ([#12253](https://github.com/react-navigation/react-navigation/issues/12253)) ([4d444f7](https://github.com/react-navigation/react-navigation/commit/4d444f77a446b622d75e6e19a3cf1c024d248a2d)), closes [#000](https://github.com/react-navigation/react-navigation/issues/000) [#000](https://github.com/react-navigation/react-navigation/issues/000) [#000](https://github.com/react-navigation/react-navigation/issues/000) - by @
* fix detecting animation enabled ([3107502](https://github.com/react-navigation/react-navigation/commit/31075027f09ecc26a4e413cb5746e1a07692c287)) - by @satya164
* fix drawer rtl on ios & android ([6fba631](https://github.com/react-navigation/react-navigation/commit/6fba631b588d83be0a731017adb46ce79ca9b2ec)) - by @
* fix drawer rtl on web ([06209b9](https://github.com/react-navigation/react-navigation/commit/06209b9f04171c18b51638593d3f0fd5028a97f8)) - by @
* fix drawer tab order on web for better accessibility ([#12616](https://github.com/react-navigation/react-navigation/issues/12616)) ([ac51096](https://github.com/react-navigation/react-navigation/commit/ac51096e40d879cd8d065d4d2fc6497ecbe552bc)) - by @
* fix error with type definitions. closes [#8511](https://github.com/react-navigation/react-navigation/issues/8511) ([2b55133](https://github.com/react-navigation/react-navigation/commit/2b55133461cc9b83949224a6860463a0e8ac12ea)) - by @
* fix false warning due to change in Object.assign in metro preset ([98d6938](https://github.com/react-navigation/react-navigation/commit/98d69381d406c9c6d87e9725771f47985a2e4391)), closes [#8584](https://github.com/react-navigation/react-navigation/issues/8584) - by @
* fix handling groups with linking config and types ([a847715](https://github.com/react-navigation/react-navigation/commit/a84771541f97cc207d0529ecffd5980da342096a)) - by @
* fix header title margin if there's no left button ([ee8bc91](https://github.com/react-navigation/react-navigation/commit/ee8bc911ddc6328d674af1b9e0f27bad31b11b74)) - by @
* fix headerTransparent not working outside stack navigator ([02ab54e](https://github.com/react-navigation/react-navigation/commit/02ab54e8a376ef39d4605786072fed7312b48e30)) - by @
* fix incomplete types for screen listeners ([5f0e2aa](https://github.com/react-navigation/react-navigation/commit/5f0e2aa8dfbb662a6ec8ce9fba54f89aedb8703f)), closes [#11293](https://github.com/react-navigation/react-navigation/issues/11293) - by @
* fix incorrect name for headerTransparent ([6f24a6d](https://github.com/react-navigation/react-navigation/commit/6f24a6d60f44ef532dcdabb1725f96b63503776f)) - by @
* fix incorrect value from useHeaderHeight for stack ([add9a17](https://github.com/react-navigation/react-navigation/commit/add9a17f0c91191c9347e59449d304f7f85239ab)) - by @
* fix incorrect warning for headerTransparent in native-stack ([a7180cf](https://github.com/react-navigation/react-navigation/commit/a7180cf033f14d46118e85faf7fef59cfb518bbf)), closes [#10502](https://github.com/react-navigation/react-navigation/issues/10502) - by @
* fix infering params when a screen is in a group ([5e9f001](https://github.com/react-navigation/react-navigation/commit/5e9f001e770637ce8f438da981b5d069aa7a4532)), closes [#11325](https://github.com/react-navigation/react-navigation/issues/11325) - by @
* fix integration tests ([f2cb389](https://github.com/react-navigation/react-navigation/commit/f2cb38952b98e5a072c5a9f56bc118394c624e9a)) - by @
* fix invisible text when header large title is enabled ([fb0100e](https://github.com/react-navigation/react-navigation/commit/fb0100ed529d6c1c56bd3ed4de244f33ef3936db)) - by @satya164
* fix issues with browser history ([#12553](https://github.com/react-navigation/react-navigation/issues/12553)) ([7d01b03](https://github.com/react-navigation/react-navigation/commit/7d01b032af05290492869cb15632857d8cb92cc6)) - by @
* fix modal animation not being set properly ([8985503](https://github.com/react-navigation/react-navigation/commit/8985503dbcec638e267975a1d7ee06d1f7f67080)) - by @
* fix navigation not working in strict mode ([11dbba9](https://github.com/react-navigation/react-navigation/commit/11dbba92ce6f91b3664ae3c856ab1ad67f333030)) - by @
* fix showing search bar in native tab bar ([2fef8d8](https://github.com/react-navigation/react-navigation/commit/2fef8d80899091f2442d1c059fccab713f709c23)) - by @satya164
* fix tab router in example app ([79a2b12](https://github.com/react-navigation/react-navigation/commit/79a2b12aeffdd7235ceadcdf46871837b52b6e29)) - by @
* fix transparent modal when another screen is pushed on top ([97efa7b](https://github.com/react-navigation/react-navigation/commit/97efa7b56859eccb6dbec4f3cdbe136525690ee8)), closes [#10298](https://github.com/react-navigation/react-navigation/issues/10298) - by @
* fix type error when passing unannotated navigation ref ([5d35bd9](https://github.com/react-navigation/react-navigation/commit/5d35bd9f363bb2351ea4cdbacc86fbfa121f661f)) - by @
* fix type error with listeners for static config ([54437e2](https://github.com/react-navigation/react-navigation/commit/54437e29aa81c34e2cb3ea1de45e182eac74cfb4)) - by @
* fix type inference for params. closes [#12071](https://github.com/react-navigation/react-navigation/issues/12071) ([3299b70](https://github.com/react-navigation/react-navigation/commit/3299b70682adbf55811369535cca1cdd0dc59860)) - by @
* fix type of setOptions and mark data passed to callbacks as Readonly ([6655c66](https://github.com/react-navigation/react-navigation/commit/6655c6624f0a66ceeac677ccdb34a9e79e83ab62)) - by @
* fix type signature for setParams ([#24](https://github.com/react-navigation/react-navigation/issues/24)) ([469800b](https://github.com/react-navigation/react-navigation/commit/469800be232f476f02a0f63f9994b18fd925d9c0)) - by @
* fix types for Link & Button components ([bc9d628](https://github.com/react-navigation/react-navigation/commit/bc9d628efab9ab9986dc38a0ba2868d0fbe64b49)) - by @
* focus a navigator when you navigate to a screen in it ([1cc7728](https://github.com/react-navigation/react-navigation/commit/1cc7728b7168db0a09175288c73d859cfe514a3b)) - by @
* handle params type for generic navigation ([a134fc5](https://github.com/react-navigation/react-navigation/commit/a134fc590c6a3417ee2f2c6d5d080ee7ec8d129d)) - by @satya164
* handle screens in dynamic config in useNavigation ([e0d7313](https://github.com/react-navigation/react-navigation/commit/e0d73132f79a6f811cb4187772ca232efb22dd9c)) - by @satya164
* hide header shadow for transparent header ([a3b2e29](https://github.com/react-navigation/react-navigation/commit/a3b2e29a0ce035cba2175829628417139844a687)) - by @
* import from /native instead of /core ([66d5f45](https://github.com/react-navigation/react-navigation/commit/66d5f455b4a09b76c8f06690c1b01e4797eba393)) - by @
* improve custom header in native stack & stack ([7e6b666](https://github.com/react-navigation/react-navigation/commit/7e6b6662342e63d241c1a2e8f57c56a3b5b0cef5)) - by @
* improve getting route type from param list ([ee6d389](https://github.com/react-navigation/react-navigation/commit/ee6d38982a1df33c2a7da17874d215e3dc621b64)) - by @satya164
* improve how navigate and other methods are typed ([#12093](https://github.com/react-navigation/react-navigation/issues/12093)) ([a528b9b](https://github.com/react-navigation/react-navigation/commit/a528b9b407dbaeaac0caae8edcb5b3c6840144fa)) - by @
* improve when back button is shown in nested native stacks ([#10761](https://github.com/react-navigation/react-navigation/issues/10761)) ([4cfc9ac](https://github.com/react-navigation/react-navigation/commit/4cfc9ac3583b858ebc89914fa73e8b96e9f6f01d)) - by @
* inactive screen visible for one frame ([#11315](https://github.com/react-navigation/react-navigation/issues/11315)) ([d8fe859](https://github.com/react-navigation/react-navigation/commit/d8fe859985a36128134a73374341fcbb38e58483)) - by @WoLewicki
* include parent type for basic navigation ([3877d1e](https://github.com/react-navigation/react-navigation/commit/3877d1eb521c6566fe03ec309d0591eb1c0e519c)) - by @satya164
* make native stack background transparent when using transparentModal ([cf6687b](https://github.com/react-navigation/react-navigation/commit/cf6687b08cd0cc125baa6291de907fa12c404f42)) - by @
* make rehydration keys stable ([98393b6](https://github.com/react-navigation/react-navigation/commit/98393b64d951ac000484e945a1221fdd21f12118)) - by @
* make sure disabling react-native-screens works ([95572bd](https://github.com/react-navigation/react-navigation/commit/95572bd5d410c70d75dceabd5fcfbcc493076100)) - by @
* make sure new state events are emitted when new navigators mount ([ddcd84c](https://github.com/react-navigation/react-navigation/commit/ddcd84c205f178342a2e9fcb7dc91c48b2ae5503)) - by @
* make sure route type is not any ([3d8ab9e](https://github.com/react-navigation/react-navigation/commit/3d8ab9ec1c414283c22b9c193812cfca46ce6967)) - by @satya164
* make sure the wildcard pattern catches nested unmatched routes ([72d2135](https://github.com/react-navigation/react-navigation/commit/72d2135ed84c632842fd7d99f5bdaa93faeae0ca)) - by @
* make transparent modal work with modal presentation ([338e008](https://github.com/react-navigation/react-navigation/commit/338e0086f90f2af195c70b9650be49b436a64546)) - by @
* merge params on navigate in example ([0167e79](https://github.com/react-navigation/react-navigation/commit/0167e794d7c64df1c4954c0c5766cee6bffef28c)) - by @
* only propagate navigate to children ([68ab592](https://github.com/react-navigation/react-navigation/commit/68ab592ac931e73456976c856bbb5eb1f6957d8b)) - by @
* preserve # in the URL if the screen hasn't changed ([#11876](https://github.com/react-navigation/react-navigation/issues/11876)) ([66cc899](https://github.com/react-navigation/react-navigation/commit/66cc899e2d9264903ed8800980711c619bb3b499)) - by @
* properly handle history if drawer is open by default ([c24dc92](https://github.com/react-navigation/react-navigation/commit/c24dc928fff5cf2f2c08316aa3acb13d707bce49)) - by @
* provide initial values for safe area to prevent blank screen ([#238](https://github.com/react-navigation/react-navigation/issues/238)) ([ee63e7c](https://github.com/react-navigation/react-navigation/commit/ee63e7c097c3ea0a66561958e18c05eb94aecc5b)) - by @
* relatively position float Header if !headerTransparent ([#8285](https://github.com/react-navigation/react-navigation/issues/8285)) ([9ef7119](https://github.com/react-navigation/react-navigation/commit/9ef71197890bb2170cb927bbb3bcf6f8b89713a5)) - by @
* remove global in favor of globalThis for better compatibility ([#11976](https://github.com/react-navigation/react-navigation/issues/11976)) ([f497491](https://github.com/react-navigation/react-navigation/commit/f4974919242e7531ddd16da7b6bbf5e9ecfddc4c)) - by @
* render fallback only if linking is enabled. closes [#8161](https://github.com/react-navigation/react-navigation/issues/8161) ([09cd33d](https://github.com/react-navigation/react-navigation/commit/09cd33df1ceac8c2798ba08cd9e6fb0ff8449b39)) - by @
* replace `pointerEvents` props with styles ([#12693](https://github.com/react-navigation/react-navigation/issues/12693)) ([987aed6](https://github.com/react-navigation/react-navigation/commit/987aed623ad7eaf120d3af76ca2e05b2a3c7f103)), closes [#12441](https://github.com/react-navigation/react-navigation/issues/12441) - by @hassankhan
* replace deprecated I18nManager.isRTL with 18nManager.getConstants().isRTL ([#10547](https://github.com/react-navigation/react-navigation/issues/10547)) ([cf2aea3](https://github.com/react-navigation/react-navigation/commit/cf2aea386ed494641008bf06184c77e15df3d8f4)) - by @
* return onPress instead of onClick for useLinkProps ([9b96e46](https://github.com/react-navigation/react-navigation/commit/9b96e46bab0966c0deb959c72ed7fcad73bd6e32)) - by @
* return proper state type for generic navigation if possible ([f93dd67](https://github.com/react-navigation/react-navigation/commit/f93dd676f2875a5e3ab8a8f48d3ff85858c68374)) - by @satya164
* rtl in native app example ([d189e1f](https://github.com/react-navigation/react-navigation/commit/d189e1f8fa1bafdb201195728607a35060ebfd1c)) - by @
* screens integration on Android ([#294](https://github.com/react-navigation/react-navigation/issues/294)) ([de5cc08](https://github.com/react-navigation/react-navigation/commit/de5cc08fcecb0f15019e874a1beda901db86c9d1)) - by @
* set header to translucent when using searchbar or large title ([8df0c47](https://github.com/react-navigation/react-navigation/commit/8df0c4714e3ea5762b2eb1ced4b24b44639d5530)) - by @
* set statusbar to translucent on Android ([b320b8d](https://github.com/react-navigation/react-navigation/commit/b320b8d0238ba1ac414bb0e8c203a51c77559439)) - by @
* show a missing icon symbol instead of empty area in bottom tab bar ([e017428](https://github.com/react-navigation/react-navigation/commit/e017428504d927bb0f0a35240196ff69c2a6af33)) - by @
* show error when beforeRemove is used to prevent action in naive stack ([61505bc](https://github.com/react-navigation/react-navigation/commit/61505bc7adae1bd5e9b48dcc98f31682c366335e)) - by @
* spread parent params to children in compat navigator ([bbfeb86](https://github.com/react-navigation/react-navigation/commit/bbfeb8668d7da25109e24590688edf610f2c7936)), closes [#6785](https://github.com/react-navigation/react-navigation/issues/6785) - by @
* strongly type the `component` prop on `RouteConfigComponent` ([#10519](https://github.com/react-navigation/react-navigation/issues/10519)) ([8850c51](https://github.com/react-navigation/react-navigation/commit/8850c51848ca081dc02365ef574d11f7f7b97dd3)) - by @
* TabBar horizontal padding for contentContainer ([#11408](https://github.com/react-navigation/react-navigation/issues/11408)) ([24c0392](https://github.com/react-navigation/react-navigation/commit/24c03924397a6e59aba9f6b74a9c5cb4b939d9e1)), closes [#8667](https://github.com/react-navigation/react-navigation/issues/8667) - by @
* tweak header styling ([2c2a20e](https://github.com/react-navigation/react-navigation/commit/2c2a20e3730cc394bd42d86aac24c38aac57f3ff)) - by @satya164
* update ci image for playwright ([afb6df5](https://github.com/react-navigation/react-navigation/commit/afb6df53035a9e9a060fa94ce2e04a533dae927c)) - by @
* update drawer and material tab bar to match latest md guidelines ([#11864](https://github.com/react-navigation/react-navigation/issues/11864)) ([8726597](https://github.com/react-navigation/react-navigation/commit/872659710dec1b097ec7c7b1dd59a6174e021b30)) - by @
* update screens for native stack ([698334b](https://github.com/react-navigation/react-navigation/commit/698334b5566475a9c1686bf94cd50f63dde6be2e)) - by @
* update URL on web when params change. fixes [#10046](https://github.com/react-navigation/react-navigation/issues/10046) ([6b01b21](https://github.com/react-navigation/react-navigation/commit/6b01b21f70a2ae402a8979e5834200ef8e8642bf)) - by @
* use measured header height when exposing it ([#11917](https://github.com/react-navigation/react-navigation/issues/11917)) ([d90ed76](https://github.com/react-navigation/react-navigation/commit/d90ed7665be74c570ed2a6a4da612230fcf6a01c)) - by @
* use safe area context in material bottom tabs ([2037779](https://github.com/react-navigation/react-navigation/commit/2037779c3ffe3610d1d25d3c782a78352990d587)) - by @
* wrap navigators in gesture handler root ([699d376](https://github.com/react-navigation/react-navigation/commit/699d3768a6ae965cb1d713ab3f35c1da3998e3e4)) - by @
* wrong setParams type if route does not have params ([#10512](https://github.com/react-navigation/react-navigation/issues/10512)) ([a3a998d](https://github.com/react-navigation/react-navigation/commit/a3a998da16cf62ed09df01705ee20f17c8b8f68d)) - by @

### chore

* drop material-bottom-tabs package ([83d4f86](https://github.com/react-navigation/react-navigation/commit/83d4f8682ce5e6342022844630dfaae84b14a98f)) - by @

### Code Refactoring

* drop layout props for tab view components ([aea05d2](https://github.com/react-navigation/react-navigation/commit/aea05d2ca9a1367d82d85a7ebc97c870cbe06592)) - by @satya164
* drop mode prop in favor of animationPresentation option ([554e440](https://github.com/react-navigation/react-navigation/commit/554e440fb4c5bbb3a70a951d6c3281a08ab23b66)) - by @
* drop react-native-flipper-plugin ([643b8e8](https://github.com/react-navigation/react-navigation/commit/643b8e83b7eeb119b0a339fd8866d790d3178f50)) - by @
* drop support for tabBarVisible option ([689e4c4](https://github.com/react-navigation/react-navigation/commit/689e4c4cf0be8297ecf323ed9bc5355de5568c21)) - by @
* get parent navigation by route name with getParent ([#12822](https://github.com/react-navigation/react-navigation/issues/12822)) ([2877968](https://github.com/react-navigation/react-navigation/commit/2877968680e14a8d4698c4762996fff6c086f793)) - by @satya164
* improve API for getDefaultHeaderHeight ([548a2dd](https://github.com/react-navigation/react-navigation/commit/548a2dd4c437f654f26c90225ee79cc816d368e2)) - by @satya164
* move drawerContentOptions to options ([eb65363](https://github.com/react-navigation/react-navigation/commit/eb653636c566c8b656608a39ab71d4407cfa3a7c)) - by @
* move headerMode to options ([50f50a6](https://github.com/react-navigation/react-navigation/commit/50f50a68f3323b896a8c3ab0a6da027d97739069)) - by @
* move tab-view to direct dependency of material-top-tabs ([2bd585b](https://github.com/react-navigation/react-navigation/commit/2bd585b8055995daaacc20a3304d0a4e9ec70f44)) - by @
* rename onChangeText to onChange for header ([3c08e52](https://github.com/react-navigation/react-navigation/commit/3c08e52598a951bdea8195f5e07c49ca79a7becf)) - by @satya164
* rename sceneContainerStyle to sceneStyle ([d1d0761](https://github.com/react-navigation/react-navigation/commit/d1d0761f0239caea1cc7b85d90de229f444f827d)) - by @
* rework how root types are specified ([7d63782](https://github.com/react-navigation/react-navigation/commit/7d63782b7ed90e5c1504325c51d1245e90817506)) - by @satya164
* simplify props for stack and drawer headers ([f21a630](https://github.com/react-navigation/react-navigation/commit/f21a630de94c9919fd09f34de319ba25a4b25a29)) - by @

### Features

* accept name argument for useNavigation ([#12826](https://github.com/react-navigation/react-navigation/issues/12826)) ([101e32d](https://github.com/react-navigation/react-navigation/commit/101e32d3ec02a0e9d4b2b74aeb2905156288883c)) - by @satya164
* accept name argument for useRoute ([#12820](https://github.com/react-navigation/react-navigation/issues/12820)) ([1afef60](https://github.com/react-navigation/react-navigation/commit/1afef6053d4686acf5e3dd94ad4f413ceab1952f)) - by @satya164
* accept overlayStyle instead of overlayColor in drawer ([d7c76d0](https://github.com/react-navigation/react-navigation/commit/d7c76d0fc530140a8df7cd18c48f99710ef09dd6)) - by @satya164
* accept route name in useNavigationState ([#12854](https://github.com/react-navigation/react-navigation/issues/12854)) ([5818777](https://github.com/react-navigation/react-navigation/commit/5818777bf5a4373bdb301b942ba2603195e62235)) - by @satya164
* add 'transparentModal' presentation to JS stack ([c3cfe75](https://github.com/react-navigation/react-navigation/commit/c3cfe75546d316ea0d6c1b40f3d95c0a67e6a9cf)) - by @
* add `animationTypeForReplace` option ([#297](https://github.com/react-navigation/react-navigation/issues/297)) ([f1e85b0](https://github.com/react-navigation/react-navigation/commit/f1e85b075f69bc9d4860df358f760ebd909f093c)) - by @
* add `screens` prop for nested configs ([#308](https://github.com/react-navigation/react-navigation/issues/308)) ([6990cc4](https://github.com/react-navigation/react-navigation/commit/6990cc4ddc9c5c53897b4ff4dd87f54e69855440)) - by @
* add `useLinkBuilder` hook to build links ([e49eea0](https://github.com/react-navigation/react-navigation/commit/e49eea00b529cc88945200801d3fee5633afdd97)) - by @
* add `useUnhandledLinking` for handling deep links behind auth etc. ([#11602](https://github.com/react-navigation/react-navigation/issues/11602)) ([688c43a](https://github.com/react-navigation/react-navigation/commit/688c43af4b27c90d1a99876d6daebbbf69820f56)), closes [#10939](https://github.com/react-navigation/react-navigation/issues/10939) - by @
* add a `beforeRemove` event ([9d321d0](https://github.com/react-navigation/react-navigation/commit/9d321d096862fa12191fdbdab73dcf4b83b420a1)) - by @
* add a `navigationKey` prop to Screen and Group ([f75ffac](https://github.com/react-navigation/react-navigation/commit/f75ffacac63baddaa0d6d6ac7bfd3ef6ec03df20)) - by @
* add a Background component ([727ae2d](https://github.com/react-navigation/react-navigation/commit/727ae2d647ba58382ab40d78773363d2292adb27)) - by @
* add a button element to elements package  ([#11669](https://github.com/react-navigation/react-navigation/issues/11669)) ([25a85c9](https://github.com/react-navigation/react-navigation/commit/25a85c90384ddfb6db946e791c01d8e033e04aa6)) - by @
* add a getComponent prop to lazily specify components ([74592a4](https://github.com/react-navigation/react-navigation/commit/74592a4f3854bceebb1ca0a218da5bce5843edc9)) - by @
* add a hook to update document title ([2d86d23](https://github.com/react-navigation/react-navigation/commit/2d86d2399e4394f040766b034fbe745d8f745898)) - by @
* add a layout prop for navigators ([#11614](https://github.com/react-navigation/react-navigation/issues/11614)) ([1f51190](https://github.com/react-navigation/react-navigation/commit/1f511904b9437d1451557147e72962859e97b1ae)) - by @
* add a logger devtool ([#12208](https://github.com/react-navigation/react-navigation/issues/12208)) ([8497f78](https://github.com/react-navigation/react-navigation/commit/8497f78858b6a8d8a6b397ccd441d46b0c8ed8c7)) - by @
* add a NavigatorScreenParams type. closes [#6931](https://github.com/react-navigation/react-navigation/issues/6931) ([c0c7a1f](https://github.com/react-navigation/react-navigation/commit/c0c7a1f013c7e0614283753ceaa9616b0c7560e4)) - by @
* add a new component to group multiple screens with common options ([12df3d7](https://github.com/react-navigation/react-navigation/commit/12df3d7700fd68768c92ec366ded3e30aabde461)) - by @
* add a persitor prop to persist and restore state ([#12842](https://github.com/react-navigation/react-navigation/issues/12842)) ([597a3c6](https://github.com/react-navigation/react-navigation/commit/597a3c66d4dde72da80b4674cfee9bd3c896c87c)) - by @satya164
* add a REPLACE_PARAMS action ([9739421](https://github.com/react-navigation/react-navigation/commit/97394212d88ccfc464db850b8a95d129befa5c80)) - by @
* add a setOptions method to set screen options ([5973985](https://github.com/react-navigation/react-navigation/commit/5973985587f147c0cee6a030f9ae63e76b1d8f98)) - by @
* add a slide animation for modals on Android ([4b639fb](https://github.com/react-navigation/react-navigation/commit/4b639fbacff9b6c509046b0b5d5effc2f4619096)) - by @
* add a tabBarBackground option to bottom tabs ([608d7c5](https://github.com/react-navigation/react-navigation/commit/608d7c5fd4e3f71b81401384282bf914aaf9d0ad)) - by @
* add a tabBarVariant option ([#12045](https://github.com/react-navigation/react-navigation/issues/12045)) ([9e43db5](https://github.com/react-navigation/react-navigation/commit/9e43db5e888489a283babfdbfe8cda77aba1b88d)) - by @
* add a useFocusEffect hook ([62218ea](https://github.com/react-navigation/react-navigation/commit/62218eaa793baad77740d3c3f3321a7730be6691)) - by @
* add a useLinkProps hook ([ef4776d](https://github.com/react-navigation/react-navigation/commit/ef4776d700bfd2adee14ba51de9b6fb3da2ccfdc)) - by @
* add a utility type to get navigation prop for a screen ([#12823](https://github.com/react-navigation/react-navigation/issues/12823)) ([52fdd2c](https://github.com/react-navigation/react-navigation/commit/52fdd2c655e7c5584d8e588b58b3eb6692922ad8)) - by @satya164
* add ability to render native buttons in header on iOS ([#12657](https://github.com/react-navigation/react-navigation/issues/12657)) ([118e27d](https://github.com/react-navigation/react-navigation/commit/118e27d17f7c878ae13c930e2ffd4088c1ccfede)) - by @johankasperi
* add ability to specify root param list ([d0bff2d](https://github.com/react-navigation/react-navigation/commit/d0bff2d7bd25ead73e47e69e4955373bdf17d64e)) - by @
* add action prop to Link ([7d51b9e](https://github.com/react-navigation/react-navigation/commit/7d51b9e3b672a3fca659791bbcb9c9fa3f912df3)) - by @
* add an animation option to customize animations ([f0b7e6f](https://github.com/react-navigation/react-navigation/commit/f0b7e6f3343b4bc61ebd695accd0965b4d5e34fd)) - by @
* add an ID prop to navigators ([5949831](https://github.com/react-navigation/react-navigation/commit/5949831f7a33b45ca10a1df92d5c3416d184959d)) - by @
* add an isFirstRouteInParent method ([7d1070a](https://github.com/react-navigation/react-navigation/commit/7d1070a402a8eec3e75557c3e56be3083c688bcf)) - by @
* add animation option for js stack ([#11854](https://github.com/react-navigation/react-navigation/issues/11854)) ([1843675](https://github.com/react-navigation/react-navigation/commit/18436751750ddb26671a07b04451ef16355f6792)) - by @
* add animation prop to bottom tab ([#11323](https://github.com/react-navigation/react-navigation/issues/11323)) ([8d2a6d8](https://github.com/react-navigation/react-navigation/commit/8d2a6d8ef642872d3d506dca483b7474471a040c)) - by @
* add API for unhandled linking ([#11672](https://github.com/react-navigation/react-navigation/issues/11672)) ([5758b26](https://github.com/react-navigation/react-navigation/commit/5758b2615e70ce4943b23ead0227507c63b11c7c)) - by @
* add backBehavior to TabRouter ([52777c6](https://github.com/react-navigation/react-navigation/commit/52777c6306c0f238590852dfdd373d90c32c4b00)) - by @
* add basic deep linking example ([752c126](https://github.com/react-navigation/react-navigation/commit/752c12615dc538951a5faea9632ecb79d6496d0d)) - by @
* add basic nesting example ([07fd3e4](https://github.com/react-navigation/react-navigation/commit/07fd3e4646cbb6a4be4fca8a1881f58526e5fa0d)) - by @
* add custom theme support ([#211](https://github.com/react-navigation/react-navigation/issues/211)) ([a83f6e0](https://github.com/react-navigation/react-navigation/commit/a83f6e0e251178f1176a996ae1659908360ef17a)) - by @
* add customAnimationOnGesture & fullScreenSwipeEnabled props to native-stack ([#10321](https://github.com/react-navigation/react-navigation/issues/10321)) ([e114cba](https://github.com/react-navigation/react-navigation/commit/e114cbaf67d2d70b074290b69312d6caa0fea608)) - by @
* add deeplinking to native example ([#309](https://github.com/react-navigation/react-navigation/issues/309)) ([b4178f0](https://github.com/react-navigation/react-navigation/commit/b4178f00a75d39e640b10d68c1a4a57affb69213)) - by @
* add devtools package ([#8436](https://github.com/react-navigation/react-navigation/issues/8436)) ([02c3e2c](https://github.com/react-navigation/react-navigation/commit/02c3e2c9693ae8c39d139188653af9b232876021)) - by @
* add direction prop to TabView ([#11322](https://github.com/react-navigation/react-navigation/issues/11322)) ([46735a3](https://github.com/react-navigation/react-navigation/commit/46735a38c46ee195da836dadcf58d6a4db7a381b)) - by @
* add gesture and transition events to drawer ([#11240](https://github.com/react-navigation/react-navigation/issues/11240)) ([50b94e4](https://github.com/react-navigation/react-navigation/commit/50b94e4f9518975b4fc7b46fe14d387bd9b17c7e)) - by @
* add getStateForRouteNamesChange to all navigators and mark it as unstable ([4edbb07](https://github.com/react-navigation/react-navigation/commit/4edbb071163742b60499178271fd3e3e92fb4002)) - by @
* add headerBackButtonDisplayMode for native stack ([#12089](https://github.com/react-navigation/react-navigation/issues/12089)) ([89ffa1b](https://github.com/react-navigation/react-navigation/commit/89ffa1baa1dc3ad8260361a3f84aa21d24c1643e)), closes [#11980](https://github.com/react-navigation/react-navigation/issues/11980) - by @
* add headerBackButtonDisplayMode for stack ([#12090](https://github.com/react-navigation/react-navigation/issues/12090)) ([35cd213](https://github.com/react-navigation/react-navigation/commit/35cd213d366a60afe9955cf10dffb83d9006ce73)) - by @
* add headerStatusBarHeight option to stack ([4022a4e](https://github.com/react-navigation/react-navigation/commit/4022a4e7069fbd978e5c14490c49ec6b03b30409)) - by @
* add helper and hook for container ref ([15caa56](https://github.com/react-navigation/react-navigation/commit/15caa56b615a4f4090d4f6637e03bc965b514454)) - by @
* add helper to get focused route name from nested state ([#8435](https://github.com/react-navigation/react-navigation/issues/8435)) ([6f2b9c6](https://github.com/react-navigation/react-navigation/commit/6f2b9c6dc21ffa4716d446dabc5ea0d4deabc9e2)) - by @
* add layout and screenLayout props for screens ([#11741](https://github.com/react-navigation/react-navigation/issues/11741)) ([2dc2178](https://github.com/react-navigation/react-navigation/commit/2dc217827a1caa615460563973d3d658be372b29)) - by @
* add Link component as useLinkTo hook for navigating to links ([1d6773c](https://github.com/react-navigation/react-navigation/commit/1d6773c9cbfde8747c4be1830013b8fb35f190c8)) - by @
* add more acttions ([7e05004](https://github.com/react-navigation/react-navigation/commit/7e050044da27c3e1800dfb2c23a7fb9813037663)) - by @
* add openByDefault option to drawer ([e9740c3](https://github.com/react-navigation/react-navigation/commit/e9740c38499d60ef123e54dc38ffe6c0f45cc553)) - by @
* add option to show a header in drawer navigator screens ([ea0adc4](https://github.com/react-navigation/react-navigation/commit/ea0adc4ba01accbbf38c382bbba9fb1307df9318)) - by @
* add option to show tabs on the side ([#11578](https://github.com/react-navigation/react-navigation/issues/11578)) ([cd15fda](https://github.com/react-navigation/react-navigation/commit/cd15fdafe7acc428826bd5106c7ba62c1b5153ca)) - by @
* add permanent drawer type ([#7818](https://github.com/react-navigation/react-navigation/issues/7818)) ([09fa393](https://github.com/react-navigation/react-navigation/commit/09fa3935ae93fe9c2c33e6705af96dbe84e26eb3)) - by @
* add preventDefault functionality in material bottom tabs ([db67b7d](https://github.com/react-navigation/react-navigation/commit/db67b7d7af346772c979132a6c387f637034a136)) - by @
* add retaining of the screen to the stack navigator ([#11765](https://github.com/react-navigation/react-navigation/issues/11765)) ([7fe82f7](https://github.com/react-navigation/react-navigation/commit/7fe82f7217d9d146e5a127bcac921f0c90e2059f)), closes [#11758](https://github.com/react-navigation/react-navigation/issues/11758) - by @
* add scroll adapter to tab view and expose renderAdapter prop ([3579022](https://github.com/react-navigation/react-navigation/commit/35790223f488e3eda728b18931b8b5d8da5db13b)) - by @satya164
* add scroll pager to tab view and expose pager prop ([a497c8a](https://github.com/react-navigation/react-navigation/commit/a497c8aa870a3963eae59305fbd3747e892e5306)) - by @satya164
* add search bar to native-stack on Android ([9b94f2c](https://github.com/react-navigation/react-navigation/commit/9b94f2c02b10b94e923317b258f4598457535e5a)) - by @
* add shifting animation to bottom-tabs and various fixes ([#11581](https://github.com/react-navigation/react-navigation/issues/11581)) ([6d93c2d](https://github.com/react-navigation/react-navigation/commit/6d93c2da661e1991f6e60f25abf137110a005509)) - by @
* add staticXScreen type to improve defining screens ([#12886](https://github.com/react-navigation/react-navigation/issues/12886)) ([7a5ebbd](https://github.com/react-navigation/react-navigation/commit/7a5ebbd91e7f8ad2ae3d810f45a2d27567dbae68)) - by @satya164
* add support for badges to bottom tab bar ([4d40daf](https://github.com/react-navigation/react-navigation/commit/4d40daf246c44d9fcc86d626f53fe421eb02d2ac)) - by @
* add support for bottom accessory to native tabs ([6384fad](https://github.com/react-navigation/react-navigation/commit/6384fadfd69b0b3f29ba5d7e7512fae7359f32f5)) - by @satya164
* add support for custom tab bar with native implementation ([c376e76](https://github.com/react-navigation/react-navigation/commit/c376e76121b5662cf97c994e3fbcf27cc23b9fe9)) - by @satya164
* add support for params ([6b83581](https://github.com/react-navigation/react-navigation/commit/6b8358175aedfb31738b7a0f6135d06b44ee3caf)) - by @
* add target argument to setParams ([#18](https://github.com/react-navigation/react-navigation/issues/18)) ([0c9618f](https://github.com/react-navigation/react-navigation/commit/0c9618f013a9ddbcd50d57b706294b0f4c7f170c)) - by @
* add transition events to BottomTabs ([#12207](https://github.com/react-navigation/react-navigation/issues/12207)) ([bc4e50c](https://github.com/react-navigation/react-navigation/commit/bc4e50cfb9fa78c39ed2871a5465c2cc97e73b31)) - by @
* add typed navigator for better typechecking ([c1e14de](https://github.com/react-navigation/react-navigation/commit/c1e14de5b7b0d9f9e6646288338b68df12e649f3)) - by @
* add unstable native bottom tabs integration ([#12791](https://github.com/react-navigation/react-navigation/issues/12791)) ([0cb67c7](https://github.com/react-navigation/react-navigation/commit/0cb67c7e57cfe1a83f21661de658253779506b45)) - by @osdnk
* add utility type to get params type for a route ([#12780](https://github.com/react-navigation/react-navigation/issues/12780)) ([4ab988f](https://github.com/react-navigation/react-navigation/commit/4ab988fbe89801fab4015dbfdc10b1e4cd1842ed)) - by @osdnk
* add wildcard patterns for paths ([0a58014](https://github.com/react-navigation/react-navigation/commit/0a580145cf708a5682deff8be9d5809d5fc311ae)), closes [#8019](https://github.com/react-navigation/react-navigation/issues/8019) - by @
* align header item types with react-native-screens ([#12895](https://github.com/react-navigation/react-navigation/issues/12895)) ([1f931d0](https://github.com/react-navigation/react-navigation/commit/1f931d0cf0d06d631e26f7ee0e6995f244cc1189)) - by @Ubax
* associate path with the route it opens when deep linking ([#9384](https://github.com/react-navigation/react-navigation/issues/9384)) ([cc8bb8c](https://github.com/react-navigation/react-navigation/commit/cc8bb8c92c3eaa1fb980bac5db451b8dbe6a5a43)), closes [#9102](https://github.com/react-navigation/react-navigation/issues/9102) - by @
* automatically enable linking if any config is specified ([c91d247](https://github.com/react-navigation/react-navigation/commit/c91d247e62d8b30d8f55abff784df81616e70580)) - by @
* automatically hide header in nested stacks ([ad5048d](https://github.com/react-navigation/react-navigation/commit/ad5048d01c3ba2632e57cd77460e005f2fc740d2)) - by @
* automatically infer types for navigation in options, listeners etc. ([#11883](https://github.com/react-navigation/react-navigation/issues/11883)) ([c54baf1](https://github.com/react-navigation/react-navigation/commit/c54baf14640e567be10cb8a5f68e5cbf0b35f120)) - by @
* automatically set headerMode if it's modal presentation style ([c9a683c](https://github.com/react-navigation/react-navigation/commit/c9a683c7d8931a3a3dfe5486fa9288998bec52ae)) - by @
* combine native and custom bottom tab implementations ([#12867](https://github.com/react-navigation/react-navigation/issues/12867)) ([aa38b39](https://github.com/react-navigation/react-navigation/commit/aa38b394c9d6070523f26d3e782872704a9d93b0)) - by @satya164
* don't show native header by default in native bottom tabs ([c49f40f](https://github.com/react-navigation/react-navigation/commit/c49f40fb5032395b62032f20d00b55f2958735b5)) - by @satya164
* emit appear and dismiss events for native stack ([c8e1d74](https://github.com/react-navigation/react-navigation/commit/c8e1d741a428878d8b80f60f1c9963dd69541560)) - by @
* expose animationEnabled in material top tabs ([c0130ff](https://github.com/react-navigation/react-navigation/commit/c0130ffe046f30241e26d95d05df235fcf6d70de)) - by @
* extract drawer to a separate package ([58b7cae](https://github.com/react-navigation/react-navigation/commit/58b7caeaad00eafbcda36561e75e538e0f02c4af)) - by @
* handle route names change ([66c7131](https://github.com/react-navigation/react-navigation/commit/66c71319cde9cd4d3db6c75b547a03420f3ade6c)) - by @
* implement route.history & PUSH_PARAMS ([#12751](https://github.com/react-navigation/react-navigation/issues/12751)) ([be3dee3](https://github.com/react-navigation/react-navigation/commit/be3dee3676cd797a33f7283a9d24b773484ed5d7)) - by @satya164
* implement search bar in elements header ([#12097](https://github.com/react-navigation/react-navigation/issues/12097)) ([78b1535](https://github.com/react-navigation/react-navigation/commit/78b1535e01de1b4a1dc462c0690d69d3d39ab964)) - by @
* implement tab-view new api ([#11548](https://github.com/react-navigation/react-navigation/issues/11548)) ([dca15c9](https://github.com/react-navigation/react-navigation/commit/dca15c9126f8751cfea43edc80c51d28de8f6fa6)) - by @
* implement usePreventRemove hook ([#10682](https://github.com/react-navigation/react-navigation/issues/10682)) ([501b9e6](https://github.com/react-navigation/react-navigation/commit/501b9e603cc558bce49a4b07342a6587929d6cde)) - by @
* improve API for icons in header buttons ([ea1c3a1](https://github.com/react-navigation/react-navigation/commit/ea1c3a17a6ecef80e8f62c19c5ced6e56838c08d)) - by @satya164
* improve types for options and support a function ([8473db5](https://github.com/react-navigation/react-navigation/commit/8473db5f8c4f9039134a610c42998bc78a43d671)) - by @
* infer params type based on linking and screen ([#12888](https://github.com/react-navigation/react-navigation/issues/12888)) ([84069bf](https://github.com/react-navigation/react-navigation/commit/84069bf11254ab60adc3e4490a96c87c9b1343f7)) - by @satya164
* initial implementation of a flipper plugin ([2cdb1f4](https://github.com/react-navigation/react-navigation/commit/2cdb1f43a9d253f1eaa9fb0b1cee364b167b0bf9)) - by @
* initialState should take priority over deep link ([bdf5e11](https://github.com/react-navigation/react-navigation/commit/bdf5e112c9dba9dbe2522765f6275f2c51436daf)) - by @
* integrate with history API on web ([998dc97](https://github.com/react-navigation/react-navigation/commit/998dc97a713cf5b1f5be0db4e39129ee29810182)) - by @
* let child navigators handle actions from parent ([21f7a9e](https://github.com/react-navigation/react-navigation/commit/21f7a9eedfbd1e5dfe633548df9a9ad3af1e6992)) - by @
* make actions work across navigators ([83c8d5a](https://github.com/react-navigation/react-navigation/commit/83c8d5a19d4f9fad599817784880eccd563a952d)) - by @
* make all screens after presentation: 'modal' as modal unless specified ([#11860](https://github.com/react-navigation/react-navigation/issues/11860)) ([f16216c](https://github.com/react-navigation/react-navigation/commit/f16216c65740c2795cdef6c2249edffa9e9416ae)) - by @
* make NAVIGATE and JUMP_TO to support key and name of the route ([#16](https://github.com/react-navigation/react-navigation/issues/16)) ([0150c60](https://github.com/react-navigation/react-navigation/commit/0150c600c476a7726c8463e74b12b36d6545419e)) - by @
* make NavigationContainerRef.getCurrentRoute type safe ([#11525](https://github.com/react-navigation/react-navigation/issues/11525)) ([9bedc0c](https://github.com/react-navigation/react-navigation/commit/9bedc0cc29287689881e43aa88de9ef9fe853109)) - by @
* move options and commonOptions to TabView for react-native-tab-view ([3643926](https://github.com/react-navigation/react-navigation/commit/36439266d9d29cc643e7159458999a1adfb101d0)) - by @
* move theming to core and pass theme to options ([#11707](https://github.com/react-navigation/react-navigation/issues/11707)) ([8e7ac4f](https://github.com/react-navigation/react-navigation/commit/8e7ac4f18545887b905f921df469dbf69d7951c7)) - by @
* **native-stack:** add support for header background image ([bc174a8](https://github.com/react-navigation/react-navigation/commit/bc174a8c545ce3baabc9904ddac2debf69e0febf)) - by @
* preload using activityState prop ([#12189](https://github.com/react-navigation/react-navigation/issues/12189)) ([496012c](https://github.com/react-navigation/react-navigation/commit/496012c32ae86af335160d569fb0d025cd092bd8)) - by @
* preloading for simple navigators - tabs, drawer ([#11709](https://github.com/react-navigation/react-navigation/issues/11709)) ([ad7c703](https://github.com/react-navigation/react-navigation/commit/ad7c703f1c0e66d77f0ab235e13fe43ca813ed1d)) - by @
* preloading for stack navigator ([#11733](https://github.com/react-navigation/react-navigation/issues/11733)) ([14fa6df](https://github.com/react-navigation/react-navigation/commit/14fa6dfa4484cf2784f0e5cd0d06252fdf8a4ba5)), closes [#11702](https://github.com/react-navigation/react-navigation/issues/11702) [#11727](https://github.com/react-navigation/react-navigation/issues/11727) - by @
* preserve params for backBehavior=fullHistory ([3f854bc](https://github.com/react-navigation/react-navigation/commit/3f854bc8f450672b7c24cb4c6fea1dce0682f6aa)) - by @
* remove UNSTABLE prefix from routeNamesChangeBehavior ([eda56ea](https://github.com/react-navigation/react-navigation/commit/eda56ea6840df32114d62ff9c77c066f240022a4)) - by @satya164
* respect key when reseting state ([d2c658e](https://github.com/react-navigation/react-navigation/commit/d2c658ed018cce67899a78d27dea1a192c6be7fa)) - by @
* restore unhandled state after route names change ([#12812](https://github.com/react-navigation/react-navigation/issues/12812)) ([52e8a45](https://github.com/react-navigation/react-navigation/commit/52e8a45d8e8b068a616f8a7df6357ad6198f0622)) - by @satya164
* rework header design to resemble latest iOS ([#12873](https://github.com/react-navigation/react-navigation/issues/12873)) ([260b604](https://github.com/react-navigation/react-navigation/commit/260b604ba4b96c35826b2a326a9137363b8de0fd)) - by @satya164
* rework linking configuration to be more strict ([#8502](https://github.com/react-navigation/react-navigation/issues/8502)) ([5ce7554](https://github.com/react-navigation/react-navigation/commit/5ce75544e1ddfa5d83581c421c68d698126ccd89)) - by @
* support ColorValue instead of string for colors in theme ([#12711](https://github.com/react-navigation/react-navigation/issues/12711)) ([cfe746b](https://github.com/react-navigation/react-navigation/commit/cfe746be6d671da7f4fe785d5bd6142fc8152e14)) - by @satya164
* support mixing regular and modal presentation in same stack ([af9f1db](https://github.com/react-navigation/react-navigation/commit/af9f1db6f6b2fecc83993e63630f86886cb49463)) - by @
* support navigate-like object in Link ([3cf4e3d](https://github.com/react-navigation/react-navigation/commit/3cf4e3d63ab76e0ed7542a459f53155e0803ec7a)) - by @
* support options ([ebf811c](https://github.com/react-navigation/react-navigation/commit/ebf811cc08b47fb0af6a86a2d50d2a59d4b85156)) - by @
* support statically confguring navigation tree ([#11144](https://github.com/react-navigation/react-navigation/issues/11144)) ([4cc322e](https://github.com/react-navigation/react-navigation/commit/4cc322e08b3d6fe089710c9c6869bbdc183c2bd6)) - by @
* support wildcard prefix for linking ([865dbbd](https://github.com/react-navigation/react-navigation/commit/865dbbdb1b20417e407da68cb6b091bc11c03593)) - by @satya164
* typecheck parse and stringify in linking for static config ([ad48163](https://github.com/react-navigation/react-navigation/commit/ad48163f331b3cb488af777d5b3e042c051b4bae)) - by @satya164
* update default tab view colors to match react navigation ([90897a9](https://github.com/react-navigation/react-navigation/commit/90897a9431899c603a1fa309b5339651de32cfb7)) - by @satya164
* update react-native-safe-area-context to 1.0.0 ([#8182](https://github.com/react-navigation/react-navigation/issues/8182)) ([2a6667f](https://github.com/react-navigation/react-navigation/commit/2a6667fe55eca9db436eb18fdde447a3a143bb7e)) - by @
* upgrade to latest react-native-tab-view using ViewPager ([75ac824](https://github.com/react-navigation/react-navigation/commit/75ac8249eb0694727f88e6b30ac7a23e54e81dd8)) - by @
* use modal presentation style for modals on iOS by default ([f1ad641](https://github.com/react-navigation/react-navigation/commit/f1ad641566b4d3b37be0453fc8d5acf18f2b8664)) - by @
* use the new SafeAreaListener to listen to frame changes ([d9e295e](https://github.com/react-navigation/react-navigation/commit/d9e295eef251393b5280d661957e7d2c31a36ae1)) - by @

### BREAKING CHANGES

* Users will need to update their code to use `onChange`.
* `useNavigation` no longer accepts a generic to override
the returned type since it's not type-safe. User can do `const
navigation = useNavigation() as SomeType` to make it explicit.

https://github.com/user-attachments/assets/bc3397bd-67b3-4341-b514-58fdaf33772a

**Test plan**

- [x] Add unit tests
- [x] Add type tests
* The types previously specified with `RootParamList`
using global augmentation will stop working.
* Navigators don't accept an ID anymore, and `getParent`
accepts only route names. Any code using navigator IDs needs to be
refactored.
* `useRoute` no longer accepts a generic to override the
returned type since it's not type-safe. User can do `const route =
useRoute() as SomeType` to make it explicit.

https://github.com/user-attachments/assets/512ab42e-af24-452e-8ef1-99276a3ba17c

NOTE: This doesn't check parent routes. It's being worked on in
https://github.com/react-navigation/react-navigation/pull/12790

**Test plan**

- Added unit tests and type tests
* it now accepts an object with 3 properties:
- `landscape`
- `modalPresentation`
- `topInset`
* for overlay color, it's now necessary to pass
overlayStyle={{ backgroundColor }}
* layout args are dropped to improve performance during window resize
if consumers need layout, it's recommended to measure directly
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
* This does the following changes:

- Remove the `sceneContainerStyle` prop from Bottom Tabs & Material Top Tabs
- Add a `sceneStyle` option to Bottom Tabs & Material Top Tabs
- Rename `sceneContainerStyle` option to `sceneStyle` for Drawer
* This removes the `headerBackTitleVisible` option, and
changes `headerTruncatedBackTitle` to `headerBackTruncatedTitle`.

Similarly, `headerLeft` now receives `displayMode` instead of
`labelVisible`, and `HeaderBackButton` accepts `displayMode` instead of
`labelVisible`
* This removes the `headerBackTitleVisible` option,

Adds corresponding functionality from
https://github.com/software-mansion/react-native-screens/pull/2123.
* react-native-tab-view now has a new API to address performance issues with current
implementation.

Co-authored-by: Michał Osadnik <micosa97@gmail.com>
Co-authored-by: Satyajit Sahoo <satyajit.happy@gmail.com>
* Previously the navigators tried to detect RTL automatically and adjust the UI. However this is problematic since we cannot detect RTL in all cases (e.g. on Web).

This adds an optional `direction` prop to `NavigationContainer` instead so that user can specify when React Navigation's UI needs to be adjusted for RTL. It defaults to the value from `I18nManager` on native platforms, however it needs to be explicitly passed for Web.
* This breaks `getFocusedRouteNameFromRoute` inside components as it requires a re-render to get the new value. However, it still works in `options` callback which is its intended use case.
* the navigator should be imported from 'react-native-paper/react-navigation' instead when it's available
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

https://github.com/react-native-community/discussions-and-proposals/discussions/546#discussioncomment-4178951
* This change will simplify installation of material-top-tabs, but that means user's version won't be used anymore. If users need to force specific version, they can use yarn's `resolutions` or npm's `overrides` feature.
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
