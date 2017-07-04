declare var __DEV__: boolean;

declare module 'react-native' {

  declare type Color = string | number;

  declare type Transform =
    { perspective: number | AnimatedInterpolation | AnimatedValue } |
    { scale: number | AnimatedInterpolation | AnimatedValue } |
    { scaleX: number | AnimatedInterpolation | AnimatedValue } |
    { scaleY: number | AnimatedInterpolation | AnimatedValue } |
    { translateX: number | AnimatedInterpolation | AnimatedValue } |
    { translateY: number | AnimatedInterpolation | AnimatedValue } |
    { rotate: string | AnimatedInterpolation | AnimatedValue } |
    { rotateX: string | AnimatedInterpolation | AnimatedValue } |
    { rotateY: string | AnimatedInterpolation | AnimatedValue } |
    { rotateZ: string | AnimatedInterpolation | AnimatedValue } |
    { skewX: string | AnimatedInterpolation | AnimatedValue } |
    { skewY: string | AnimatedInterpolation | AnimatedValue };

  declare type TransformPropTypes = {|
    transform?: Array<Transform>
  |};

  declare type LayoutPropTypes = {|
    /** `display` sets the display type of this component.
     *
     *  It works similarly to `display` in CSS, but only support 'flex' and 'none'.
     *  'flex' is the default.
     */
    display?: 'flex' | 'none',

    /** `width` sets the width of this component.
     *
     *  It works similarly to `width` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/width for more details.
     */
    width?: number | string,

    /** `height` sets the height of this component.
     *
     *  It works similarly to `height` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/height for more details.
     */
    height?: number | string,

    /** `top` is the number of logical pixels to offset the top edge of
     *  this component.
     *
     *  It works similarly to `top` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/top
     *  for more details of how `top` affects layout.
     */
    top?: number | string,

    /** `left` is the number of logical pixels to offset the left edge of
     *  this component.
     *
     *  It works similarly to `left` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/left
     *  for more details of how `left` affects layout.
     */
    left?: number | string,

    /** `right` is the number of logical pixels to offset the right edge of
     *  this component.
     *
     *  It works similarly to `right` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/right
     *  for more details of how `right` affects layout.
     */
    right?: number | string,

    /** `bottom` is the number of logical pixels to offset the bottom edge of
     *  this component.
     *
     *  It works similarly to `bottom` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/bottom
     *  for more details of how `bottom` affects layout.
     */
    bottom?: number | string,

    /** `minWidth` is the minimum width for this component, in logical pixels.
     *
     *  It works similarly to `min-width` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/min-width
     *  for more details.
     */
    minWidth?: number | string,

    /** `maxWidth` is the maximum width for this component, in logical pixels.
     *
     *  It works similarly to `max-width` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/max-width
     *  for more details.
     */
    maxWidth?: number | string,

    /** `minHeight` is the minimum height for this component, in logical pixels.
     *
     *  It works similarly to `min-height` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/min-height
     *  for more details.
     */
    minHeight?: number | string,

    /** `maxHeight` is the maximum height for this component, in logical pixels.
     *
     *  It works similarly to `max-height` in CSS, but in React Native you
     *  must use points or percentages. Ems and other units are not supported.
     *
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/max-height
     *  for more details.
     */
    maxHeight?: number | string,

    /** Setting `margin` has the same effect as setting each of
     *  `marginTop`, `marginLeft`, `marginBottom`, and `marginRight`.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/margin
     *  for more details.
     */
    margin?: number | string,

    /** Setting `marginVertical` has the same effect as setting both
     *  `marginTop` and `marginBottom`.
     */
    marginVertical?: number | string,

    /** Setting `marginHorizontal` has the same effect as setting
     *  both `marginLeft` and `marginRight`.
     */
    marginHorizontal?: number | string,

    /** `marginTop` works like `margin-top` in CSS.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top
     *  for more details.
     */
    marginTop?: number | string,

    /** `marginBottom` works like `margin-bottom` in CSS.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom
     *  for more details.
     */
    marginBottom?: number | string,

    /** `marginLeft` works like `margin-left` in CSS.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left
     *  for more details.
     */
    marginLeft?: number | string,

    /** `marginRight` works like `margin-right` in CSS.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right
     *  for more details.
     */
    marginRight?: number | string,

    /** Setting `padding` has the same effect as setting each of
     *  `paddingTop`, `paddingBottom`, `paddingLeft`, and `paddingRight`.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/padding
     *  for more details.
     */
    padding?: number | string,

    /** Setting `paddingVertical` is like setting both of
     *  `paddingTop` and `paddingBottom`.
     */
    paddingVertical?: number | string,

    /** Setting `paddingHorizontal` is like setting both of
     *  `paddingLeft` and `paddingRight`.
     */
    paddingHorizontal?: number | string,

    /** `paddingTop` works like `padding-top` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top
     * for more details.
     */
    paddingTop?: number | string,

    /** `paddingBottom` works like `padding-bottom` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom
     * for more details.
     */
    paddingBottom?: number | string,

    /** `paddingLeft` works like `padding-left` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left
     * for more details.
     */
    paddingLeft?: number | string,

    /** `paddingRight` works like `padding-right` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right
     * for more details.
     */
    paddingRight?: number | string,

    /** `borderWidth` works like `border-width` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/border-width
     * for more details.
     */
    borderWidth?: number,

    /** `borderTopWidth` works like `border-top-width` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width
     * for more details.
     */
    borderTopWidth?: number,

    /** `borderRightWidth` works like `border-right-width` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width
     * for more details.
     */
    borderRightWidth?: number,

    /** `borderBottomWidth` works like `border-bottom-width` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width
     * for more details.
     */
    borderBottomWidth?: number,

    /** `borderLeftWidth` works like `border-left-width` in CSS.
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width
     * for more details.
     */
    borderLeftWidth?: number,

    /** `position` in React Native is similar to regular CSS, but
     *  everything is set to `relative` by default, so `absolute`
     *  positioning is always just relative to the parent.
     *
     *  If you want to position a child using specific numbers of logical
     *  pixels relative to its parent, set the child to have `absolute`
     *  position.
     *
     *  If you want to position a child relative to something
     *  that is not its parent, just don't use styles for that. Use the
     *  component tree.
     *
     *  See https://github.com/facebook/yoga
     *  for more details on how `position` differs between React Native
     *  and CSS.
     */
    position?: 'absolute' | 'relative',

    /** `flexDirection` controls which directions children of a container go.
     *  `row` goes left to right, `column` goes top to bottom, and you may
     *  be able to guess what the other two do. It works like `flex-direction`
     *  in CSS, except the default is `column`.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction
     *  for more details.
     */
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse',

    /** `flexWrap` controls whether children can wrap around after they
     *  hit the end of a flex container.
     *  It works like `flex-wrap` in CSS (default: nowrap).
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap
     *  for more details.
     */
    flexWrap?: 'wrap' | 'nowrap',

    /** `justifyContent` aligns children in the main direction.
     *  For example, if children are flowing vertically, `justifyContent`
     *  controls how they align vertically.
     *  It works like `justify-content` in CSS (default: flex-start).
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
     *  for more details.
     */
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around',

    /** `alignItems` aligns children in the cross direction.
     *  For example, if children are flowing vertically, `alignItems`
     *  controls how they align horizontally.
     *  It works like `align-items` in CSS (default: stretch).
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
     *  for more details.
     */
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',

    /** `alignSelf` controls how a child aligns in the cross direction,
     *  overriding the `alignItems` of the parent. It works like `align-self`
     *  in CSS (default: auto).
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/align-self
     *  for more details.
     */
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',

    /** `alignContent` controls how rows align in the cross direction,
     *  overriding the `alignContent` of the parent.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/align-content
     *  for more details.
     */
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around',

    /** `overflow` controls how a children are measured and displayed.
     *  `overflow: hidden` causes views to be clipped while `overflow: scroll`
     *  causes views to be measured independently of their parents main axis.`
     *  It works like `overflow` in CSS (default: visible).
     *  See https://developer.mozilla.org/en/docs/Web/CSS/overflow
     *  for more details.
     */
    overflow?: 'visible' | 'hidden' | 'scroll',

    /** In React Native `flex` does not work the same way that it does in CSS.
     *  `flex` is a number rather than a string, and it works
     *  according to the `Yoga` library
     *  at https://github.com/facebook/yoga
     *
     *  When `flex` is a positive number, it makes the component flexible
     *  and it will be sized proportional to its flex value. So a
     *  component with `flex` set to 2 will take twice the space as a
     *  component with `flex` set to 1.
     *
     *  When `flex` is 0, the component is sized according to `width`
     *  and `height` and it is inflexible.
     *
     *  When `flex` is -1, the component is normally sized according
     *  `width` and `height`. However, if there's not enough space,
     *  the component will shrink to its `minWidth` and `minHeight`.
     *
     * flexGrow, flexShrink, and flexBasis work the same as in CSS.
     */
    flex?: number,
    flexGrow?: number,
    flexShrink?: number,
    flexBasis?: number | string,

    /**
     * Aspect ratio control the size of the undefined dimension of a node. Aspect ratio is a
     * non-standard property only available in react native and not CSS.
     *
     * - On a node with a set width/height aspect ratio control the size of the unset dimension
     * - On a node with a set flex basis aspect ratio controls the size of the node in the cross axis
     *   if unset
     * - On a node with a measure function aspect ratio works as though the measure function measures
     *   the flex basis
     * - On a node with flex grow/shrink aspect ratio controls the size of the node in the cross axis
     *   if unset
     * - Aspect ratio takes min/max dimensions into account
     */
    aspectRatio?: number,

    /** `zIndex` controls which components display on top of others.
     *  Normally, you don't use `zIndex`. Components render according to
     *  their order in the document tree, so later components draw over
     *  earlier ones. `zIndex` may be useful if you have animations or custom
     *  modal interfaces where you don't want this behavior.
     *
     *  It works like the CSS `z-index` property - components with a larger
     *  `zIndex` will render on top. Think of the z-direction like it's
     *  pointing from the phone into your eyeball.
     *  See https://developer.mozilla.org/en-US/docs/Web/CSS/z-index for
     *  more details.
     */
    zIndex?: number,

    /** `direction` specifies the directional flow of the user interface.
     *  The default is `inherit`, except for root node which will have
     *  value based on the current locale.
     *  See https://facebook.github.io/yoga/docs/rtl/
     *  for more details.
     *  @platform ios
     */
    direction?: 'inherit' | 'ltr' | 'rtl',
  |};

  declare type ShadowPropTypes = {|
    /**
     * Sets the drop shadow color
     * @platform ios
     */
    shadowColor?: Color,

    /**
     * Sets the drop shadow offset
     * @platform ios
     */
    shadowOffset?: {|
      width?: number,
      height?: number
    |},

    /**
     * Sets the drop shadow opacity (multiplied by the color's alpha component)
     * @platform ios
     */
    shadowOpacity?: number,

    /**
     * Sets the drop shadow blur radius
     * @platform ios
     */
    shadowRadius?: number,
  |};

  declare type ExtraViewStylePropTypes = {|
    backfaceVisibility?: 'visible' | 'hidden',
    backgroundColor?: Color,
    borderColor?: Color,
    borderTopColor?: Color,
    borderRightColor?: Color,
    borderBottomColor?: Color,
    borderLeftColor?: Color,
    borderRadius?: number,
    borderTopLeftRadius?: number,
    borderTopRightRadius?: number,
    borderBottomLeftRadius?: number,
    borderBottomRightRadius?: number,
    borderStyle?: 'solid' | 'dotted' | 'dashed',
    borderWidth?: number,
    borderTopWidth?: number,
    borderRightWidth?: number,
    borderBottomWidth?: number,
    borderLeftWidth?: number,
    opacity?: number,
    /**
     * (Android-only) Sets the elevation of a view, using Android's underlying
     * [elevation API](https://developer.android.com/training/material/shadows-clipping.html#Elevation).
     * This adds a drop shadow to the item and affects z-order for overlapping views.
     * Only supported on Android 5.0+, has no effect on earlier versions.
     * @platform android
     */
    elevation?: number,
  |};

  declare type FontVariant = 'small-caps' |
        'oldstyle-nums' |
        'lining-nums' |
        'tabular-nums' |
        'proportional-nums';

  declare type ExtraTextStylePropTypes = {|
    color?: Color,
    fontFamily?: string,
    fontSize?: number,
    fontStyle?: 'normal' | 'italic',
    /**
     * Specifies font weight. The values 'normal' and 'bold' are supported for
     * most fonts. Not all fonts have a variant for each of the numeric values,
     * in that case the closest one is chosen.
     */
    fontWeight?:
      'normal' | 'bold' |
      '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
    /**
     * @platform ios
     */
    fontVariant?: Array<FontVariant>,
    textShadowOffset?: {|
      width?: number,
      height?: number
    |},
    textShadowRadius?: number,
    textShadowColor?: Color,
    /**
     * @platform ios
     */
    letterSpacing?: number,
    lineHeight?: number,
    /**
     * Specifies text alignment. The value 'justify' is only supported on iOS and
     * fallbacks to `left` on Android.
     */
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify',
    /**
     * @platform android
     */
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center',
    /**
     * Set to `false` to remove extra font padding intended to make space for certain ascenders / descenders.
     * With some fonts, this padding can make text look slightly misaligned when centered vertically.
     * For best results also set `textAlignVertical` to `center`. Default is true.
     * @platform android
     */
    includeFontPadding?: boolean,
    textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through',
    /**
     * @platform ios
     */
    textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed',
    /**
     * @platform ios
     */
    textDecorationColor?: Color,
    /**
     * @platform ios
     */
    writingDirection?: 'auto' | 'ltr' | 'rtl',
  |};

  declare type ImageResizeModeEnum = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
    repeat: 'repeat',
  };

  declare type ExtraImageStylePropTypes = {|
    resizeMode?: $Keys<ImageResizeModeEnum>,
    backfaceVisibility?: 'visible' | 'hidden',
    backgroundColor?: Color,
    borderColor?: Color,
    borderWidth?: number,
    borderRadius?: number,
    overflow?: 'visible' | 'hidden',

    /**
     * Changes the color of all the non-transparent pixels to the tintColor.
     */
    tintColor?: Color,
    opacity?: number,
    /**
     * When the image has rounded corners, specifying an overlayColor will
     * cause the remaining space in the corners to be filled with a solid color.
     * This is useful in cases which are not supported by the Android
     * implementation of rounded corners:
     *   - Certain resize modes, such as 'contain'
     *   - Animated GIFs
     *
     * A typical way to use this prop is with images displayed on a solid
     * background and setting the `overlayColor` to the same color
     * as the background.
     *
     * For details of how this works under the hood, see
     * http://frescolib.org/docs/rounded-corners-and-circles.html
     *
     * @platform android
    */
    overlayColor?: string,

    // Android-Specific styles
    borderTopLeftRadius?: number,
    borderTopRightRadius?: number,
    borderBottomLeftRadius?: number,
    borderBottomRightRadius?: number,
  |};


  declare type ViewStylePropTypes = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraViewStylePropTypes,
  |};

  declare type TextStylePropTypes = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraViewStylePropTypes,
    ...ExtraTextStylePropTypes,
  |};

  declare type ImageStylePropTypes = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...TransformPropTypes,
    ...ExtraImageStylePropTypes,
  |};

  declare type StylePropTypes = {|
    ...LayoutPropTypes,
    ...ShadowPropTypes,
    ...$Exact<TransformPropTypes>,
    ...ExtraImageStylePropTypes,
    ...ExtraTextStylePropTypes,
    ...ExtraViewStylePropTypes,
  |}

  declare type StyleId = number;

  declare export type StyleDefinition = {[key: string]: StylePropTypes};
  declare type StyleRuleSet<S: StyleDefinition> = {[key: $Keys<S>]: StyleId};
  declare type StyleProp<T, V> = false | null | void | T | V | Array<StyleProp<T, V>>;

  declare export var StyleSheet: {|
    hairlineWidth: number,
    absoluteFill: StyleId,
    absoluteFillObject: Object,
    flatten: (style: StyleProp<StylePropTypes, StyleId>) => StylePropTypes,
    create<S: StyleDefinition>(styles: S): StyleRuleSet<S>,
    setStyleAttributePreprocessor(property: string, process: (nextProp: mixed) => mixed): void,
  |};

  declare type EdgeInsetsProp = {
    top: number,
    left: number,
    bottom: number,
    right: number,
  };

  declare type AccessibilityTrait =
    'none' |
    'button' |
    'link' |
    'header' |
    'search' |
    'image' |
    'selected' |
    'plays' |
    'key' |
    'text' |
    'summary' |
    'disabled' |
    'frequentUpdates' |
    'startsMedia' |
    'adjustable' |
    'allowsDirectInteraction' |
    'pageTurn';

  declare type AccessibilityComponentType =
    'none' |
    'button' |
    'radiobutton_checked' |
    'radiobutton_unchecked';

  declare type MeasureOnSuccessCallback = (
    x: number,
    y: number,
    width: number,
    height: number,
    pageX: number,
    pageY: number,
  ) => void;

  declare type MeasureInWindowOnSuccessCallback = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;

  declare type MeasureLayoutOnSuccessCallback = (
    left: number,
    top: number,
    width: number,
    height: number,
  ) => void;

  declare type NativeMethodsMixinType = {
    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: Object): void,
  };

  declare type ViewDefaultProps = {
  };
  
  declare type RCTViewAttributes = {
    accessible?: boolean,
    accessibilityLabel?: React$PropType$Primitive<any>,
    accessibilityComponentType?: AccessibilityComponentType,
    accessibilityLiveRegion?: 'none' | 'polite' | 'assertive',
    importantForAccessibility?: 'auto'| 'yes'| 'no'| 'no-hide-descendants',
    accessibilityTraits?: AccessibilityTrait | Array<AccessibilityTrait>,
    accessibilityViewIsModal?: boolean,
    onAccessibilityTap?: Function,
    onMagicTap?: Function,
    testID?: string,
    nativeID?: string,
    pointerEvents?: 'box-none'| 'none'| 'box-only'| 'auto',
    removeClippedSubviews?: boolean,
    renderToHardwareTextureAndroid?: boolean,
    shouldRasterizeIOS?: boolean,
    collapsable?: boolean,
    needsOffscreenAlphaCompositing?: boolean,
    hitSlop?: EdgeInsetsProp,
    /**
     * Invoked on mount and layout changes with
     *
     *   `{nativeEvent: {layout: {x, y, width, height}}}`
     */
    onLayout?: Function,
  }

  declare export type ViewProps = {
    ...$Exact<RCTViewAttributes>,
    onResponderGrant?: Function,
    onResponderMove?: Function,
    onResponderReject?: Function,
    onResponderRelease?: Function,
    onResponderTerminate?: Function,
    onResponderTerminationRequest?: Function,
    onStartShouldSetResponder?: Function,
    onStartShouldSetResponderCapture?: Function,
    onMoveShouldSetResponder?: Function,
    onMoveShouldSetResponderCapture?: Function,
    style?: StyleProp<ViewStylePropTypes, StyleId>,    
    children?: React$Element<*>,
  };

  declare class BaseView<D, P, S> extends React$Component<D, P, S> {
    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: P): void,
  }
  
  declare export class View extends BaseView<ViewDefaultProps, ViewProps, void> {}
  
  declare export type AnimatedViewStylePropTypes = {
    ...$Exact<ViewStylePropTypes>,
    ...({ [key: $Keys<ViewStylePropTypes>]: AnimatedValue | AnimatedInterpolation })
  };
  
  declare type AnimatedViewProps = {
    ...$Exact<ViewProps>,
    style: StyleProp<AnimatedViewStylePropTypes, StyleId>,
  }
  
  declare class AnimatedView extends BaseView<ViewDefaultProps, AnimatedViewProps, void> {}

  declare type TextDefaultProps = {
    accessible: true,
    allowFontScaling: true,
    ellipsizeMode: 'tail',
    disabled: false,
  };

  declare export type TextProps = {
    ...$Exact<RCTViewAttributes>,
    /**
     * When `numberOfLines` is set, this prop defines how text will be truncated.
     * `numberOfLines` must be set in conjunction with this prop.
     *
     * This can be one of the following values:
     *
     * - `head` - The line is displayed so that the end fits in the container and the missing text
     * at the beginning of the line is indicated by an ellipsis glyph. e.g., "...wxyz"
     * - `middle` - The line is displayed so that the beginning and end fit in the container and the
     * missing text in the middle is indicated by an ellipsis glyph. "ab...yz"
     * - `tail` - The line is displayed so that the beginning fits in the container and the
     * missing text at the end of the line is indicated by an ellipsis glyph. e.g., "abcd..."
     * - `clip` - Lines are not drawn past the edge of the text container.
     *
     * The default is `tail`.
     *
     * > `clip` is working only for iOS
     */
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
    /**
     * Used to truncate the text with an ellipsis after computing the text
     * layout, including line wrapping, such that the total number of lines
     * does not exceed this number.
     *
     * This prop is commonly used with `ellipsizeMode`.
     */
    numberOfLines?: number,
    /**
     * Set text break strategy on Android API Level 23+, possible values are `simple`, `highQuality`, `balanced`
     * The default value is `highQuality`.
     * @platform android
     */
    textBreakStrategy?: 'simple' | 'highQuality' | 'balanced',
    /**
     * This function is called on press.
     *
     * e.g., `onPress={() => console.log('1st')}`
     */
    onPress?: Function,
    /**
     * This function is called on long press.
     *
     * e.g., `onLongPress={this.increaseSize}>`
     */
    onLongPress?: Function,
    /**
     * When the scroll view is disabled, this defines how far your touch may
     * move off of the button, before deactivating the button. Once deactivated,
     * try moving it back and you'll see that the button is once again
     * reactivated! Move it back and forth several times while the scroll view
     * is disabled. Ensure you pass in a constant to reduce memory allocations.
     */
    pressRetentionOffset?: EdgeInsetsProp,
    /**
     * Lets the user select text, to use the native copy and paste functionality.
     */
    selectable?: boolean,
    /**
     * The highlight color of the text.
     * @platform android
     */
    selectionColor?: Color,
    /**
     * When `true`, no visual change is made when text is pressed down. By
     * default, a gray oval highlights the text on press down.
     * @platform ios
     */
    suppressHighlighting?: boolean,
    /**
     * Used to locate this view in end-to-end tests.
     */
    testID?: string,
    /**
     * Used to locate this view from native code.
     * @platform android
     */
    nativeID?: string,
    /**
     * Specifies whether fonts should scale to respect Text Size accessibility settings. The
     * default is `true`.
     */
    allowFontScaling?: boolean,
    /**
     * When set to `true`, indicates that the view is an accessibility element. The default value
     * for a `Text` element is `true`.
     *
     * See the
     * [Accessibility guide](docs/accessibility.html#accessible-ios-android)
     * for more information.
     */
    accessible?: boolean,
    /**
     * Specifies whether font should be scaled down automatically to fit given style constraints.
     * @platform ios
     */
    adjustsFontSizeToFit?: boolean,
    /**
     * Specifies smallest possible scale a font can reach when adjustsFontSizeToFit is enabled. (values 0.01-1.0).
     * @platform ios
     */
    minimumFontScale?: number,
    /**
     * Specifies the disabled state of the text view for testing purposes
     * @platform android
     */
    disabled?: boolean,
    style?: StyleProp<TextStylePropTypes, StyleId>,
    children?: React$Element<*>,
  };

  declare class BaseText<D, P, S> extends React$Component<D, P, S> {    
    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: P): void,
  }
  
  declare export class Text extends BaseText<TextDefaultProps, TextProps, void> {}
  
  declare type AnimatedTextStylePropTypes = {
    ...$Exact<TextStylePropTypes>,
    ...({ [key: $Keys<TextStylePropTypes>]: AnimatedValue | AnimatedInterpolation })
  };
  
  declare type AnimatedTextProps = {
    ...$Exact<TextProps>,
    style: StyleProp<AnimatedTextStylePropTypes, StyleId>,
  };
  
  declare class AnimatedText extends BaseText<TextDefaultProps, AnimatedTextProps, void> {}

  declare type ImageUriSourcePropType = {
    uri: string,
    width?: number,
    height?: number,
    scale?: number,
    /**
     * `bundle` is the iOS asset bundle which the image is included in. This
     * will default to [NSBundle mainBundle] if not set.
     * @platform ios
     */
    bundle?: string,
    /**
     * `method` is the HTTP Method to use. Defaults to GET if not specified.
     */
    method?: string,
    /**
     * `headers` is an object representing the HTTP headers to send along with the
     * request for a remote image.
     */
    headers?: { [key: string]: string },
    /**
     * `body` is the HTTP body to send with the request. This must be a valid
     * UTF-8 string, and will be sent exactly as specified, with no
     * additional encoding (e.g. URL-escaping or base64) applied.
     */
    body?: string,
    /**
     * `cache` determines how the requests handles potentially cached
     * responses.
     *
     * - `default`: Use the native platforms default strategy. `useProtocolCachePolicy` on iOS.
     *
     * - `reload`: The data for the URL will be loaded from the originating source.
     * No existing cache data should be used to satisfy a URL load request.
     *
     * - `force-cache`: The existing cached data will be used to satisfy the request,
     * regardless of its age or expiration date. If there is no existing data in the cache
     * corresponding the request, the data is loaded from the originating source.
     *
     * - `only-if-cached`: The existing cache data will be used to satisfy a request, regardless of
     * its age or expiration date. If there is no existing data in the cache corresponding
     * to a URL load request, no attempt is made to load the data from the originating source,
     * and the load is considered to have failed.
     *
     * @platform ios
     */
    cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached',
  };

  declare type ImageSourcePropType = ImageUriSourcePropType | number | Array<ImageUriSourcePropType>;

  declare type ImageProps = {
    /**
     * > `ImageResizeMode` is an `Enum` for different image resizing modes, set via the
     * > `resizeMode` style property on `Image` components. The values are `contain`, `cover`,
     * > `stretch`, `center`, `repeat`.
     */
    style?: StyleProp<ImageStylePropTypes, StyleId>,
    /**
     * The image source (either a remote URL or a local file resource).
     *
     * This prop can also contain several remote URLs, specified together with
     * their width and height and potentially with scale/other URI arguments.
     * The native side will then choose the best `uri` to display based on the
     * measured size of the image container. A `cache` property can be added to
     * control how networked request interacts with the local cache.
     *
     * The currently supported formats are `png`, `jpg`, `jpeg`, `bmp`, `gif`,
     * `webp` (Android only), `psd` (iOS only).
     */
    source?: ImageSourcePropType,
    /**
     * A static image to display while loading the image source.
     *
     * - `uri` - a string representing the resource identifier for the image, which
     * should be either a local file path or the name of a static image resource
     * (which should be wrapped in the `require('./path/to/image.png')` function).
     * - `width`, `height` - can be specified if known at build time, in which case
     * these will be used to set the default `<Image/>` component dimensions.
     * - `scale` - used to indicate the scale factor of the image. Defaults to 1.0 if
     * unspecified, meaning that one image pixel equates to one display point / DIP.
     * - `number` - Opaque type returned by something like `require('./image.jpg')`.
     *
     * @platform ios
     */
    defaultSource?: ImageSourcePropType,
    /**
     * When true, indicates the image is an accessibility element.
     * @platform ios
     */
    accessible?: boolean,
    /**
     * The text that's read by the screen reader when the user interacts with
     * the image.
     * @platform ios
     */
    accessibilityLabel?: React$PropType$Primitive<any>,
    /**
     * blurRadius: the blur radius of the blur filter added to the image
     */
    blurRadius?: number,
    /**
     * When the image is resized, the corners of the size specified
     * by `capInsets` will stay a fixed size, but the center content and borders
     * of the image will be stretched.  This is useful for creating resizable
     * rounded buttons, shadows, and other resizable assets.  More info in the
     * [official Apple documentation](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/index.html#//apple_ref/occ/instm/UIImage/resizableImageWithCapInsets).
     *
     * @platform ios
     */
    capInsets?: EdgeInsetsPropType,
    /**
     * The mechanism that should be used to resize the image when the image's dimensions
     * differ from the image view's dimensions. Defaults to `auto`.
     *
     * - `auto`: Use heuristics to pick between `resize` and `scale`.
     *
     * - `resize`: A software operation which changes the encoded image in memory before it
     * gets decoded. This should be used instead of `scale` when the image is much larger
     * than the view.
     *
     * - `scale`: The image gets drawn downscaled or upscaled. Compared to `resize`, `scale` is
     * faster (usually hardware accelerated) and produces higher quality images. This
     * should be used if the image is smaller than the view. It should also be used if the
     * image is slightly bigger than the view.
     *
     * More details about `resize` and `scale` can be found at http://frescolib.org/docs/resizing-rotating.html.
     *
     * @platform android
     */
    resizeMethod?: 'auto' | 'resize' | 'scale',
    /**
     * Determines how to resize the image when the frame doesn't match the raw
     * image dimensions.
     *
     * - `cover`: Scale the image uniformly (maintain the image's aspect ratio)
     * so that both dimensions (width and height) of the image will be equal
     * to or larger than the corresponding dimension of the view (minus padding).
     *
     * - `contain`: Scale the image uniformly (maintain the image's aspect ratio)
     * so that both dimensions (width and height) of the image will be equal to
     * or less than the corresponding dimension of the view (minus padding).
     *
     * - `stretch`: Scale width and height independently, This may change the
     * aspect ratio of the src.
     *
     * - `repeat`: Repeat the image to cover the frame of the view. The
     * image will keep it's size and aspect ratio. (iOS only)
     */
    resizeMode?: $Keys<ImageResizeModeEnum>,
    /**
     * A unique identifier for this element to be used in UI Automation
     * testing scripts.
     */
    testID?: string,
    /**
     * Invoked on mount and layout changes with
     * `{nativeEvent: {layout: {x, y, width, height}}}`.
     */
    onLayout?: Function,
    /**
     * Invoked on load start.
     *
     * e.g., `onLoadStart={(e) => this.setState({loading: true})}`
     */
    onLoadStart?: Function,
    /**
     * Invoked on download progress with `{nativeEvent: {loaded, total}}`.
     * @platform ios
     */
    onProgress?: Function,
    /**
     * Invoked on load error with `{nativeEvent: {error}}`.
     */
    onError?: Function,
    /**
     * Invoked when a partial load of the image is complete. The definition of
     * what constitutes a "partial load" is loader specific though this is meant
     * for progressive JPEG loads.
     * @platform ios
     */
    onPartialLoad?: Function,
    /**
     * Invoked when load completes successfully.
     */
    onLoad?: Function,
    /**
     * Invoked when load either succeeds or fails.
     */
    onLoadEnd?: Function,
    children?: React$Element<*>,
  }

  declare type ResolvedAssetSource = {
    __packager_asset: boolean,
    width: ?number,
    height: ?number,
    uri: string,
    scale: number,
  };

  declare class BaseImage<D, P, S> extends React$Component<D, P, S> {
    static resizeMode: ImageResizeModeEnum,
    /**
     * Retrieve the width and height (in pixels) of an image prior to displaying it.
     * This method can fail if the image cannot be found, or fails to download.
     *
     * In order to retrieve the image dimensions, the image may first need to be
     * loaded or downloaded, after which it will be cached. This means that in
     * principle you could use this method to preload images, however it is not
     * optimized for that purpose, and may in future be implemented in a way that
     * does not fully load/download the image data. A proper, supported way to
     * preload images will be provided as a separate API.
     *
     * Does not work for static image resources.
     *
     * @param uri The location of the image.
     * @param success The function that will be called if the image was successfully found and width
     * and height retrieved.
     * @param failure The function that will be called if there was an error, such as failing to
     * to retrieve the image.
     *
     * @returns void
     *
     * @platform ios
     */
    static getSize(
      uri: string,
      success: (width: number, height: number) => void,
      failure?: (error: any) => void,
    ): void,

    /**
     * Prefetches a remote image for later use by downloading it to the disk
     * cache
     *
     * @param url The remote location of the image.
     *
     * @return The prefetched image.
     */
    static prefetch(url: string): Promise<string>,

    /**
     * Resolves an asset reference into an object which has the properties `uri`, `width`,
     * and `height`. The input may either be a number (opaque type returned by
     * require('./foo.png')) or an `ImageSource` like { uri: '<http location || file path>' }
     */
    static resolveAssetSource(source: ImageSourcePropType): ?ResolvedAssetSource,

    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: P): void,
  }
  
  declare export class Image extends BaseImage<void, ImageProps, void> {}
  
  declare type AnimatedImageStylePropTypes = {
    ...$Exact<ImageStylePropTypes>,
    ...({ [key: $Keys<ImageStylePropTypes>]: AnimatedValue | AnimatedInterpolation })
  };
  
  declare type AnimatedImageProps = {
    ...$Exact<ImageProps>,
    style: StyleProp<AnimatedImageStylePropTypes, StyleId>,
  };
  
  declare class AnimatedImage extends BaseView<void, AnimatedImageProps, void> {}


  declare type ScrollViewProps = {
    ...$Exact<ViewProps>,
    /**
     * Controls whether iOS should automatically adjust the content inset
     * for scroll views that are placed behind a navigation bar or
     * tab bar/ toolbar. The default value is true.
     * @platform ios
     */
    automaticallyAdjustContentInsets?: boolean,
    /**
     * The amount by which the scroll view content is inset from the edges
     * of the scroll view. Defaults to `{top: 0, left: 0, bottom: 0, right: 0}`.
     * @platform ios
     */
    contentInset?: EdgeInsetsPropType,
    /**
     * Used to manually set the starting scroll offset.
     * The default value is `{x: 0, y: 0}`.
     * @platform ios
     */
    contentOffset?: PointPropType,
    /**
     * When true, the scroll view bounces when it reaches the end of the
     * content if the content is larger then the scroll view along the axis of
     * the scroll direction. When false, it disables all bouncing even if
     * the `alwaysBounce*` props are true. The default value is true.
     * @platform ios
     */
    bounces?: boolean,
    /**
     * When true, gestures can drive zoom past min/max and the zoom will animate
     * to the min/max value at gesture end, otherwise the zoom will not exceed
     * the limits.
     * @platform ios
     */
    bouncesZoom?: boolean,
    /**
     * When true, the scroll view bounces horizontally when it reaches the end
     * even if the content is smaller than the scroll view itself. The default
     * value is true when `horizontal={true}` and false otherwise.
     * @platform ios
     */
    alwaysBounceHorizontal?: boolean,
    /**
     * When true, the scroll view bounces vertically when it reaches the end
     * even if the content is smaller than the scroll view itself. The default
     * value is false when `horizontal={true}` and true otherwise.
     * @platform ios
     */
    alwaysBounceVertical?: boolean,
    /**
     * When true, the scroll view automatically centers the content when the
     * content is smaller than the scroll view bounds; when the content is
     * larger than the scroll view, this property has no effect. The default
     * value is false.
     * @platform ios
     */
    centerContent?: boolean,
    /**
     * These styles will be applied to the scroll view content container which
     * wraps all of the child views. Example:
     *
     * ```
     * return (
     *   <ScrollView contentContainerStyle={styles.contentContainer}>
     *   </ScrollView>
     * );
     * ...
     * const styles = StyleSheet.create({
     *   contentContainer: {
     *     paddingVertical: 20
     *   }
     * });
     * ```
     */
    contentContainerStyle?: StyleProp<ViewStylePropTypes, StyleId>,
    /**
     * A floating-point number that determines how quickly the scroll view
     * decelerates after the user lifts their finger. You may also use string
     * shortcuts `"normal"` and `"fast"` which match the underlying iOS settings
     * for `UIScrollViewDecelerationRateNormal` and
     * `UIScrollViewDecelerationRateFast` respectively.
     *
     *   - `'normal'`: 0.998 (the default)
     *   - `'fast'`: 0.99
     *
     * @platform ios
     */
    decelerationRate?: 'fast' | 'normal'  | number,
    /**
     * When true, the scroll view's children are arranged horizontally in a row
     * instead of vertically in a column. The default value is false.
     */
    horizontal?: boolean,
    /**
     * The style of the scroll indicators.
     *
     *   - `'default'` (the default), same as `black`.
     *   - `'black'`, scroll indicator is black. This style is good against a light background.
     *   - `'white'`, scroll indicator is white. This style is good against a dark background.
     *
     * @platform ios
     */
    indicatorStyle?: 'default' | 'black' | 'white',
    /**
     * When true, the ScrollView will try to lock to only vertical or horizontal
     * scrolling while dragging.  The default value is false.
     * @platform ios
     */
    directionalLockEnabled?: boolean,
    /**
     * When false, once tracking starts, won't try to drag if the touch moves.
     * The default value is true.
     * @platform ios
     */
    canCancelContentTouches?: boolean,
    /**
     * Determines whether the keyboard gets dismissed in response to a drag.
     *
     *   - `'none'` (the default), drags do not dismiss the keyboard.
     *   - `'on-drag'`, the keyboard is dismissed when a drag begins.
     *   - `'interactive'`, the keyboard is dismissed interactively with the drag and moves in
     *     synchrony with the touch; dragging upwards cancels the dismissal.
     *     On android this is not supported and it will have the same behavior as 'none'.
     */
    keyboardDismissMode?: 'none' | 'interactive' | 'on-drag',
    /**
     * Determines when the keyboard should stay visible after a tap.
     *
     *   - `'never'` (the default), tapping outside of the focused text input when the keyboard
     *     is up dismisses the keyboard. When this happens, children won't receive the tap.
     *   - `'always'`, the keyboard will not dismiss automatically, and the scroll view will not
     *     catch taps, but children of the scroll view can catch taps.
     *   - `'handled'`, the keyboard will not dismiss automatically when the tap was handled by
     *     a children, (or captured by an ancestor).
     *   - `false`, deprecated, use 'never' instead
     *   - `true`, deprecated, use 'always' instead
     */
    keyboardShouldPersistTaps?: 'always' | 'never' | 'handled' | false | true,
    /**
     * The maximum allowed zoom scale. The default value is 1.0.
     * @platform ios
     */
    maximumZoomScale?: number,
    /**
     * The minimum allowed zoom scale. The default value is 1.0.
     * @platform ios
     */
    minimumZoomScale?: number,
    /**
     * Fires at most once per frame during scrolling. The frequency of the
     * events can be controlled using the `scrollEventThrottle` prop.
     */
    onScroll?: Function,
    /**
     * Called when a scrolling animation ends.
     * @platform ios
     */
    onScrollAnimationEnd?: Function,
    /**
     * Called when scrollable content view of the ScrollView changes.
     *
     * Handler function is passed the content width and content height as parameters:
     * `(contentWidth, contentHeight)`
     *
     * It's implemented using onLayout handler attached to the content container
     * which this ScrollView renders.
     */
    onContentSizeChange?: Function,
    /**
     * When true, the scroll view stops on multiples of the scroll view's size
     * when scrolling. This can be used for horizontal pagination. The default
     * value is false.
     */
    pagingEnabled?: boolean,
    /**
     * When false, the view cannot be scrolled via touch interaction.
     * The default value is true.
     *
     * Note that the view can be always be scrolled by calling `scrollTo`.
     */
    scrollEnabled?: boolean,
    /**
     * This controls how often the scroll event will be fired while scrolling
     * (as a time interval in ms). A lower number yields better accuracy for code
     * that is tracking the scroll position, but can lead to scroll performance
     * problems due to the volume of information being send over the bridge.
     * You will not notice a difference between values set between 1-16 as the
     * JS run loop is synced to the screen refresh rate. If you do not need precise
     * scroll position tracking, set this value higher to limit the information
     * being sent across the bridge. The default value is zero, which results in
     * the scroll event being sent only once each time the view is scrolled.
     * @platform ios
     */
    scrollEventThrottle?: number,
    /**
     * The amount by which the scroll view indicators are inset from the edges
     * of the scroll view. This should normally be set to the same value as
     * the `contentInset`. Defaults to `{0, 0, 0, 0}`.
     * @platform ios
     */
    scrollIndicatorInsets?: EdgeInsetsPropType,
    /**
     * When true, the scroll view scrolls to top when the status bar is tapped.
     * The default value is true.
     * @platform ios
     */
    scrollsToTop?: boolean,
    /**
     * When true, shows a horizontal scroll indicator.
     * The default value is true.
     */
    showsHorizontalScrollIndicator?: boolean,
    /**
     * When true, shows a vertical scroll indicator.
     * The default value is true.
     */
    showsVerticalScrollIndicator?: boolean,
    /**
     * An array of child indices determining which children get docked to the
     * top of the screen when scrolling. For example, passing
     * `stickyHeaderIndices={[0]}` will cause the first child to be fixed to the
     * top of the scroll view. This property is not supported in conjunction
     * with `horizontal={true}`.
     */
    stickyHeaderIndices?: Array<number>,
    /**
     * When set, causes the scroll view to stop at multiples of the value of
     * `snapToInterval`. This can be used for paginating through children
     * that have lengths smaller than the scroll view. Used in combination
     * with `snapToAlignment`.
     * @platform ios
     */
    snapToInterval?: number,
    /**
     * When `snapToInterval` is set, `snapToAlignment` will define the relationship
     * of the snapping to the scroll view.
     *
     *   - `'start'` (the default) will align the snap at the left (horizontal) or top (vertical)
     *   - `'center'` will align the snap in the center
     *   - `'end'` will align the snap at the right (horizontal) or bottom (vertical)
     *
     * @platform ios
     */
    snapToAlignment?: 'start' | 'center' | 'end',
    /**
     * Experimental: When true, offscreen child views (whose `overflow` value is
     * `hidden`) are removed from their native backing superview when offscreen.
     * This can improve scrolling performance on long lists. The default value is
     * true.
     */
    removeClippedSubviews?: boolean,
    /**
     * The current scale of the scroll view content. The default value is 1.0.
     * @platform ios
     */
    zoomScale?: number,

    /**
     * A RefreshControl component, used to provide pull-to-refresh
     * functionality for the ScrollView. Only works for vertical ScrollViews
     * (`horizontal` prop must be `false`).
     *
     * See [RefreshControl](docs/refreshcontrol.html).
     */
    refreshControl?: React$Element<*>,

    /**
     * Sometimes a scrollview takes up more space than its content fills. When this is
     * the case, this prop will fill the rest of the scrollview with a color to avoid setting
     * a background and creating unnecessary overdraw. This is an advanced optimization
     * that is not needed in the general case.
     * @platform android
     */
    endFillColor?: Color,

    /**
     * Tag used to log scroll performance on this scroll view. Will force
     * momentum events to be turned on (see sendMomentumEvents). This doesn't do
     * anything out of the box and you need to implement a custom native
     * FpsListener for it to be useful.
     * @platform android
     */
    scrollPerfTag?: string,

    /**
     * Used to override default value of overScroll mode.
     *
     * Possible values:
     *
     *  - `'auto'` - Default value, allow a user to over-scroll
     *    this view only if the content is large enough to meaningfully scroll.
     *  - `'always'` - Always allow a user to over-scroll this view.
     *  - `'never'` - Never allow a user to over-scroll this view.
     *
     * @platform android
     */
    overScrollMode?: 'auto' | 'always' | 'never',
  }

  declare export class BaseScrollView<D, P, S> extends React$Component<D, P, S> {
    // TODO(lmr): ScrollResponder.Mixin?
    setNativeProps(props: P): void,

    /**
     * Returns a reference to the underlying scroll responder, which supports
     * operations like `scrollTo`. All ScrollView-like components should
     * implement this method so that they can be composed while providing access
     * to the underlying scroll responder's methods.
     */
    getScrollResponder(): ScrollView,

    getScrollableNode(): any,

    getInnerViewNode(): any,

    /**
     * Scrolls to a given x, y offset, either immediately or with a smooth animation.
     *
     * Example:
     *
     * `scrollTo({x: 0, y: 0, animated: true})`
     *
     * Note: The weird function signature is due to the fact that, for historical reasons,
     * the function also accepts separate arguments as an alternative to the options object.
     * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
     */
    scrollTo(
      y?: number | { x?: number, y?: number, animated?: boolean },
      x?: number,
      animated?: boolean
    ): void,

    /**
     * If this is a vertical ScrollView scrolls to the bottom.
     * If this is a horizontal ScrollView scrolls to the right.
     *
     * Use `scrollToEnd({animated: true})` for smooth animated scrolling,
     * `scrollToEnd({animated: false})` for immediate scrolling.
     * If no options are passed, `animated` defaults to true.
     */
    scrollToEnd(
      options?: { animated?: boolean },
    ): void,
  }
  
  declare export class ScrollView extends BaseScrollView<void, ScrollViewProps, void> {}
  
  declare type AnimatedScrollViewStyleProps = {
    ...$Exact<ViewStylePropTypes>,
    ...({ [key: $Keys<ViewStylePropTypes>]: AnimatedValue | AnimatedInterpolation })
  };
  
  declare type AnimatedScrollViewProps = {
    ...$Exact<ScrollViewProps>,
    style: StyleProp<AnimatedScrollViewStyleProps, StyleId>,
  };
  
  declare class AnimatedScrollView extends BaseView<void, AnimatedScrollViewProps, void> {}
  
  declare export var Platform: {|
    OS: 'ios' | 'android',
    Version: number,
    isPad: boolean,
    isTesting: boolean,
    isTVOS: boolean,
    select<T>(obj: { [key: string]: T }): T,
  |}

  declare type Dimension = {
    width: number,
    height: number,
    scale: number,
    fontScale: number,
  };

  declare type DimensionName = 'window' | 'screen';

  declare export var Dimensions: {|
    set(dims: { [key: DimensionName]: Dimension }): void,
    get(dim: DimensionName): Dimensions,
    addEventListener(
      type: string,
      handler: Function
    ): void,
    removeEventListener(
      type: string,
      handler: Function
    ): void,
  |}

  declare export var PixelRatio: {|
    /**
     * Returns the device pixel density. Some examples:
     *
     *   - PixelRatio.get() === 1
     *     - mdpi Android devices (160 dpi)
     *   - PixelRatio.get() === 1.5
     *     - hdpi Android devices (240 dpi)
     *   - PixelRatio.get() === 2
     *     - iPhone 4, 4S
     *     - iPhone 5, 5c, 5s
     *     - iPhone 6
     *     - xhdpi Android devices (320 dpi)
     *   - PixelRatio.get() === 3
     *     - iPhone 6 plus
     *     - xxhdpi Android devices (480 dpi)
     *   - PixelRatio.get() === 3.5
     *     - Nexus 6
     */
    get(): number,

    /**
     * Returns the scaling factor for font sizes. This is the ratio that is used to calculate the
     * absolute font size, so any elements that heavily depend on that should use this to do
     * calculations.
     *
     * If a font scale is not set, this returns the device pixel ratio.
     *
     * Currently this is only implemented on Android and reflects the user preference set in
     * Settings > Display > Font size, on iOS it will always return the default pixel ratio.
     * @platform android
     */
    getFontScale(): number,

    /**
     * Converts a layout size (dp) to pixel size (px).
     *
     * Guaranteed to return an integer number.
     */
    getPixelSizeForLayoutSize(layoutSize: number): number,

    /**
     * Rounds a layout size (dp) to the nearest layout size that corresponds to
     * an integer number of pixels. For example, on a device with a PixelRatio
     * of 3, `PixelRatio.roundToNearestPixel(8.4) = 8.33`, which corresponds to
     * exactly (8.33 * 3) = 25 pixels.
     */
    roundToNearestPixel(layoutSize: number): number,

    // No-op for iOS, but used on the web. Should not be documented.
    startDetecting(): void,
  |};

  declare type LayoutAnimationTypesEnum = {
    spring: 'spring',
    linear: 'linear',
    easeInEaseOut: 'easeInEaseOut',
    easeIn: 'easeIn',
    easeOut: 'easeOut',
    keyboard: 'keyboard',
  };

  declare type LayoutAnimationPropertiesEnum = {
    opacity: 'opacity',
    scaleXY: 'scaleXY',
  };

  declare type Anim = {
    duration?: number,
    delay?: number,
    springDamping?: number,
    initialVelocity?: number,
    type?: $Keys<LayoutAnimationTypesEnum>,
    property?: $Keys<LayoutAnimationPropertiesEnum>,
  };

  declare type LayoutAnimationConfig = {
    duration: number,
    create?: Anim,
    update?: Anim,
    delete?: Anim,
  };

  declare export var LayoutAnimation: {
    /**
     * Schedules an animation to happen on the next layout.
     *
     * @param config Specifies animation properties:
     *
     *   - `duration` in milliseconds
     *   - `create`, config for animating in new views (see `Anim` type)
     *   - `update`, config for animating views that have been updated
     * (see `Anim` type)
     *
     * @param onAnimationDidEnd Called when the animation finished.
     * Only supported on iOS.
     * @param onError Called on error. Only supported on iOS.
     */
    configureNext(config: LayoutAnimationConfig, onAnimationDidEnd?: Function): void,
    /**
     * Helper for creating a config for `configureNext`.
     */
    create(duration: number, type, creationProp): LayoutAnimationConfig,
    Types: LayoutAnimationTypesEnum,
    Properties: LayoutAnimationPropertiesEnum,
    Presets: {
      easeInEaseOut: LayoutAnimationConfig,
      linear: LayoutAnimationConfig,
      spring: LayoutAnimationConfig,
    },
    easeInEaseOut(onAnimationDidEnd?: Function): void,
    linear(onAnimationDidEnd?: Function): void,
    spring(onAnimationDidEnd?: Function): void,
  };

  declare type Event = Object;
  declare type Selection = {
    start: number,
    end?: number,
  };

  declare type DataDetector =
    'phoneNumber' |
    'link' |
    'address' |
    'calendarEvent' |
    'none' |
    'all';

  declare type TextInputState = {|
    /**
     * Returns the ID of the currently focused text field, if one exists
     * If no text field is focused it returns null
     */
    currentlyFocusedField(): ?number,

    /**
     * @param {number} TextInputID id of the text field to focus
     * Focuses the specified text field
     * noop if the text field was already focused
     */
    focusTextInput(textFieldID: ?number): void,

    /**
     * @param {number} textFieldID id of the text field to focus
     * Unfocuses the specified text field
     * noop if it wasn't focused
     */
    blurTextInput(textFieldID: ?number): void,
  |};

  declare type EventSubscription = {
    eventType: string;
    key: number;
    subscriber: EventSubscriptionVendor;
    remove(): void,
  }

  declare type EventSubscriptionVendor = {
    addSubscription(eventType: string, subscription: EventSubscription): EventSubscription,
    removeAllSubscriptions(eventType: ?string): void,
    removeSubscription(subscription: EventSubscription): void,
    getSubscriptionsForType(eventType: string): ?[EventSubscription],
  }

  declare type EmitterSubscription<T: string> = {
    emitter: EventEmitter<T>;
    listener: Function;
    context: ?Object;
    remove(): void,
  }

  declare type EventEmitter<T: string> = {
    emit(eventType: T, ...args: any[]): void,
    addListener(eventType: T, listener: Function, context: ?Object): EmitterSubscription<T>,
    once(eventType: T, listener: Function, context: ?Object): EmitterSubscription<T>,
    removeAllListeners(): void,
    removeCurrentListener(): void,
    removeSubscription(subscription: EmitterSubscription<T>): void,
    listeners(eventType: T): [EmitterSubscription<T>],
    removeListener(eventType: T, listener: Function): void,
  }

  declare type EventHolderToken<T: string> = { eventType: T, index: number };

  declare type EventHolder<T: string> = {
    holdEvent(eventType: T, ...args: any[]): EventHolderToken<T>,
    emitToListener(eventType: ?T, listener: Function, context: ?Object): void,
    releaseCurrentEvent(): void,
    releaseEvent(token: EventHolderToken<T>): void,
    releaseEventType(eventType: T): void,
  }

  declare type EventEmitterWithHolding<T: string> = {
    addListener(eventType: T, listener: Function, context: ?Object): EmitterSubscription<T>,
    once(eventType: T, listener: Function, context: ?Object): EmitterSubscription<T>,
    removeAllListeners(eventType: T): void,
    removeCurrentListener(): void,
    listeners(eventType: T): [EmitterSubscription<T>],
    emit(eventType: T, ...args: any[]): void,

    addRetroactiveListener(eventType: T, listener: Function, context: ?Object): EmitterSubscription<T>,
    emitAndHold(eventType: T, ...args: any[]): void,
    releaseCurrentEvent(): void,
    releaseHeldEventType(eventType: T): void,
  }

  declare type DocumentSelectionState = {|
    ...EventEmitterWithHolding<'blur' | 'focus' | 'update'>,
    update(anchor, focus): void,
    constrainLength(maxLength: number): void,
    focus(): void,
    blur(): void,
    hasFocus(): void,
    isCollapsed(): boolean,
    isBackward(): boolean,
    getAnchorOffset(): ?number,
    getFocusOffset(): ?number,
    getStartOffset(): ?number,
    getEndOffset(): ?number,
    overlaps(start: number, end: number): boolean,
  |}

  declare type TextInputProps = {
    ...ViewProps,
    /**
     * Can tell `TextInput` to automatically capitalize certain characters.
     *
     * - `characters`: all characters.
     * - `words`: first letter of each word.
     * - `sentences`: first letter of each sentence (*default*).
     * - `none`: don't auto capitalize anything.
     */
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
    /**
     * If `false`, disables auto-correct. The default value is `true`.
     */
    autoCorrect?: boolean,
    /**
     * If `false`, disables spell-check style (i.e. red underlines).
     * The default value is inherited from `autoCorrect`.
     * @platform ios
     */
    spellCheck?: boolean,
    /**
     * If `true`, focuses the input on `componentDidMount`.
     * The default value is `false`.
     */
    autoFocus?: boolean,
    /**
     * If `false`, text is not editable. The default value is `true`.
     */
    editable?: boolean,
    /**
     * Determines which keyboard to open, e.g.`numeric`.
     *
     * The following values work across platforms:
     *
     * - `default`
     * - `numeric`
     * - `email-address`
     * - `phone-pad`
     */
    keyboardType?:
      // Cross-platform
      'default' |
      'email-address' |
      'numeric' |
      'phone-pad' |
      // iOS-only
      'ascii-capable' |
      'numbers-and-punctuation' |
      'url' |
      'number-pad' |
      'name-phone-pad' |
      'decimal-pad' |
      'twitter' |
      'web-search',
    /**
     * Determines the color of the keyboard.
     * @platform ios
     */
    keyboardAppearance?: 'default' | 'light' | 'dark',
    /**
     * Determines how the return key should look. On Android you can also use
     * `returnKeyLabel`.
     *
     * *Cross platform*
     *
     * The following values work across platforms:
     *
     * - `done`
     * - `go`
     * - `next`
     * - `search`
     * - `send`
     *
     * *Android Only*
     *
     * The following values work on Android only:
     *
     * - `none`
     * - `previous`
     *
     * *iOS Only*
     *
     * The following values work on iOS only:
     *
     * - `default`
     * - `emergency-call`
     * - `google`
     * - `join`
     * - `route`
     * - `yahoo`
     */
    returnKeyType?:
      // Cross-platform
      'done'|
      'go'|
      'next'|
      'search'|
      'send'|
      // Android-only
      'none'|
      'previous'|
      // iOS-only
      'default'|
      'emergency-call'|
      'google'|
      'join'|
      'route'|
      'yahoo',
    /**
     * Sets the return key to the label. Use it instead of `returnKeyType`.
     * @platform android
     */
    returnKeyLabel?: string,
    /**
     * Limits the maximum number of characters that can be entered. Use this
     * instead of implementing the logic in JS to avoid flicker.
     */
    maxLength?: number,
    /**
     * Sets the number of lines for a `TextInput`. Use it with multiline set to
     * `true` to be able to fill the lines.
     * @platform android
     */
    numberOfLines?: number,
    /**
     * When `false`, if there is a small amount of space available around a text input
     * (e.g. landscape orientation on a phone), the OS may choose to have the user edit
     * the text inside of a full screen text input mode. When `true`, this feature is
     * disabled and users will always edit the text directly inside of the text input.
     * Defaults to `false`.
     * @platform android
     */
    disableFullscreenUI?: boolean,
    /**
     * If `true`, the keyboard disables the return key when there is no text and
     * automatically enables it when there is text. The default value is `false`.
     * @platform ios
     */
    enablesReturnKeyAutomatically?: boolean,
    /**
     * If `true`, the text input can be multiple lines.
     * The default value is `false`.
     */
    multiline?: boolean,
    /**
     * Set text break strategy on Android API Level 23+, possible values are `simple`, `highQuality`, `balanced`
     * The default value is `simple`.
     * @platform android
     */
    textBreakStrategy?: 'simple' | 'highQuality' | 'balanced',
    /**
     * Callback that is called when the text input is blurred.
     */
    onBlur?: Function,
    /**
     * Callback that is called when the text input is focused.
     */
    onFocus?: Function,
    /**
     * Callback that is called when the text input's text changes.
     */
    onChange?: Function,
    /**
     * Callback that is called when the text input's text changes.
     * Changed text is passed as an argument to the callback handler.
     */
    onChangeText?: Function,
    /**
     * Callback that is called when the text input's content size changes.
     * This will be called with
     * `{ nativeEvent: { contentSize: { width, height } } }`.
     *
     * Only called for multiline text inputs.
     */
    onContentSizeChange?: Function,
    /**
     * Callback that is called when text input ends.
     */
    onEndEditing?: Function,
    /**
     * Callback that is called when the text input selection is changed.
     * This will be called with
     * `{ nativeEvent: { selection: { start, end } } }`.
     */
    onSelectionChange?: Function,
    /**
     * Callback that is called when the text input's submit button is pressed.
     * Invalid if `multiline={true}` is specified.
     */
    onSubmitEditing?: Function,
    /**
     * Callback that is called when a key is pressed.
     * This will be called with `{ nativeEvent: { key: keyValue } }`
     * where `keyValue` is `'Enter'` or `'Backspace'` for respective keys and
     * the typed-in character otherwise including `' '` for space.
     * Fires before `onChange` callbacks.
     * @platform ios
     */
    onKeyPress?: Function,
    /**
     * Invoked on mount and layout changes with `{x, y, width, height}`.
     */
    onLayout?: Function,
    /**
     * Invoked on content scroll with `{ nativeEvent: { contentOffset: { x, y } } }`.
     * May also contain other properties from ScrollEvent but on Android contentSize
     * is not provided for performance reasons.
     */
    onScroll?: Function,
    /**
     * The string that will be rendered before text input has been entered.
     */
    placeholder?: Function,
    /**
     * The text color of the placeholder string.
     */
    placeholderTextColor?: Color,
    /**
     * If `true`, the text input obscures the text entered so that sensitive text
     * like passwords stay secure. The default value is `false`.
     */
    secureTextEntry?: boolean,
    /**
     * The highlight and cursor color of the text input.
     */
    selectionColor?: Color,
    /**
     * An instance of `DocumentSelectionState`, this is some state that is responsible for
     * maintaining selection information for a document.
     *
     * Some functionality that can be performed with this instance is:
     *
     * - `blur()`
     * - `focus()`
     * - `update()`
     *
     * > You can reference `DocumentSelectionState` in
     * > [`vendor/document/selection/DocumentSelectionState.js`](https://github.com/facebook/react-native/blob/master/Libraries/vendor/document/selection/DocumentSelectionState.js)
     *
     * @platform ios
     */
    selectionState?: DocumentSelectionState,
    /**
     * The start and end of the text input's selection. Set start and end to
     * the same value to position the cursor.
     */
    selection?: {
      start: number,
      end?: number,
    },
    /**
     * The value to show for the text input. `TextInput` is a controlled
     * component, which means the native value will be forced to match this
     * value prop if provided. For most uses, this works great, but in some
     * cases this may cause flickering - one common cause is preventing edits
     * by keeping value the same. In addition to simply setting the same value,
     * either set `editable={false}`, or set/update `maxLength` to prevent
     * unwanted edits without flicker.
     */
    value?: string,
    /**
     * Provides an initial value that will change when the user starts typing.
     * Useful for simple use-cases where you do not want to deal with listening
     * to events and updating the value prop to keep the controlled state in sync.
     */
    defaultValue?: string,
    /**
     * When the clear button should appear on the right side of the text view.
     * @platform ios
     */
    clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always',
    /**
     * If `true`, clears the text field automatically when editing begins.
     * @platform ios
     */
    clearTextOnFocus?: boolean,
    /**
     * If `true`, all text will automatically be selected on focus.
     */
    selectTextOnFocus?: boolean,
    /**
     * If `true`, the text field will blur when submitted.
     * The default value is true for single-line fields and false for
     * multiline fields. Note that for multiline fields, setting `blurOnSubmit`
     * to `true` means that pressing return will blur the field and trigger the
     * `onSubmitEditing` event instead of inserting a newline into the field.
     */
    blurOnSubmit?: boolean,
    /**
     * Note that not all Text styles are supported,
     * see [Issue#7070](https://github.com/facebook/react-native/issues/7070)
     * for more detail.
     *
     * [StyleDefinition](docs/style.html)
     */
    style?: StyleProp<TextStylePropTypes, StyleId>,
    /**
     * The color of the `TextInput` underline.
     * @platform android
     */
    underlineColorAndroid?: Color,

    /**
     * If defined, the provided image resource will be rendered on the left.
     * @platform android
     */
    inlineImageLeft?: string,

    /**
     * Padding between the inline image, if any, and the text input itself.
     * @platform android
     */
    inlineImagePadding?: number,

    /**
     * Determines the types of data converted to clickable URLs in the text input.
     * Only valid if `multiline={true}` and `editable={false}`.
     * By default no data types are detected.
     *
     * You can provide one type or an array of many types.
     *
     * Possible values for `dataDetectorTypes` are:
     *
     * - `'phoneNumber'`
     * - `'link'`
     * - `'address'`
     * - `'calendarEvent'`
     * - `'none'`
     * - `'all'`
     *
     * @platform ios
     */
    dataDetectorTypes: DataDetector | Array<DataDetector>,
    /**
     * If `true`, caret is hidden. The default value is `false`.
     */
    caretHidden?: boolean,
  };

  declare export class TextInput extends React$Component<void, TextInputProps, void> {
    static State: TextInputState,

    isFocused(): boolean,
    clear(): void,
    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: TextInputProps): void,
  }

  declare type AlertType = $Enum<{
    'default': string,
    'plain-text': string,
    'secure-text': string,
    'login-password': string,
  }>;

  declare type AlertButtonStyle = $Enum<{
    'default': string,
    'cancel': string,
    'destructive': string,
  }>;

  /**
   * Array or buttons
   * @typedef {Array} ButtonsArray
   * @property {string=} text Button label
   * @property {Function=} onPress Callback function when button pressed
   * @property {AlertButtonStyle=} style Button style
   */
  declare type ButtonsArray = Array<{
    /**
     * Button label
     */
    text?: string,
    /**
     * Callback function when button pressed
     */
    onPress?: ?Function,
    /**
     * Button style
     */
    style?: AlertButtonStyle,
  }>;

  declare type AlertButtons = Array<{
    text?: string,
    onPress?: ?Function,
    style?: AlertButtonStyle,
  }>;

  declare type AlertOptions = {
    cancelable?: ?boolean,
    onDismiss?: ?Function,
  };

  declare export var Alert: {|
    alert(
      title: ?string,
      message?: ?string,
      buttons?: AlertButtons,
      options?: AlertOptions,
      type?: AlertType,
    ): void,
  |};

  declare export var Linking: {|
    ...$Exact<EventEmitter<string>>,
    addEventListener(type: string, handler: Function): void,
    removeEventListener(type: string, handler: Function ): void,

    /**
     * Try to open the given `url` with any of the installed apps.
     *
     * You can use other URLs, like a location (e.g. "geo:37.484847,-122.148386" on Android
     * or "http://maps.apple.com/?ll=37.484847,-122.148386" on iOS), a contact,
     * or any other URL that can be opened with the installed apps.
     *
     * The method returns a `Promise` object. If the user confirms the open dialog or the
     * url automatically opens, the promise is resolved.  If the user cancels the open dialog
     * or there are no registered applications for the url, the promise is rejected.
     *
     * NOTE: This method will fail if the system doesn't know how to open the specified URL.
     * If you're passing in a non-http(s) URL, it's best to check {@code canOpenURL} first.
     *
     * NOTE: For web URLs, the protocol ("http://", "https://") must be set accordingly!
     */
    openURL(url: string): Promise<any>,

    /**
     * Determine whether or not an installed app can handle a given URL.
     *
     * NOTE: For web URLs, the protocol ("http://", "https://") must be set accordingly!
     *
     * NOTE: As of iOS 9, your app needs to provide the `LSApplicationQueriesSchemes` key
     * inside `Info.plist` or canOpenURL will always return false.
     *
     * @param URL the URL to open
     */
    canOpenURL(url: string): Promise<boolean>,

    /**
     * If the app launch was triggered by an app link,
     * it will give the link url, otherwise it will give `null`
     *
     * NOTE: To support deep linking on Android, refer http://developer.android.com/training/app-indexing/deep-linking.html#handling-intents
     */
    getInitialURL(): Promise<?string>,
  |};

  declare export var processColor: Color => number;

  declare type KeyboardEventName =
    | 'keyboardWillShow'
    | 'keyboardDidShow'
    | 'keyboardWillHide'
    | 'keyboardDidHide'
    | 'keyboardWillChangeFrame'
    | 'keyboardDidChangeFrame';

  declare type KeyboardEventData = {
    endCoordinates: {
      width: number,
      height: number,
      screenX: number,
      screenY: number,
    },
  };

  declare type KeyboardEventListener = (e: KeyboardEventData) => void;

  declare export var Keyboard: {|
    ...$Exact<EventEmitter<KeyboardEventName>>,
    dismiss(): void,
  |};

  declare export var AsyncStorage: {|
    /**
     * Fetches an item for a `key` and invokes a callback upon completion.
     * Returns a `Promise` object.
     * @param key Key of the item to fetch.
     * @param callback Function that will be called with a result if found or
     *    any error.
     * @returns A `Promise` object.
     */
    getItem(
      key: string,
      callback?: ?(error: ?Error, result: ?string) => void
    ): Promise,

    /**
     * Sets the value for a `key` and invokes a callback upon completion.
     * Returns a `Promise` object.
     * @param key Key of the item to set.
     * @param value Value to set for the `key`.
     * @param callback Function that will be called with any error.
     * @returns A `Promise` object.
     */
    setItem(
      key: string,
      value: string,
      callback?: ?(error: ?Error) => void
    ): Promise,

    /**
     * Removes an item for a `key` and invokes a callback upon completion.
     * Returns a `Promise` object.
     * @param key Key of the item to remove.
     * @param callback Function that will be called with any error.
     * @returns A `Promise` object.
     */
    removeItem(
      key: string,
      callback?: ?(error: ?Error) => void
    ): Promise,

    /**
     * Merges an existing `key` value with an input value, assuming both values
     * are stringified JSON. Returns a `Promise` object.
     *
     * **NOTE:** This is not supported by all native implementations.
     *
     * @param key Key of the item to modify.
     * @param value New value to merge for the `key`.
     * @param callback Function that will be called with any error.
     * @returns A `Promise` object.
     *
     * @example <caption>Example</caption>
     * let UID123_object = {
     *  name: 'Chris',
     *  age: 30,
     *  traits: {hair: 'brown', eyes: 'brown'},
     * };
     * // You only need to define what will be added or updated
     * let UID123_delta = {
     *  age: 31,
     *  traits: {eyes: 'blue', shoe_size: 10}
     * };
     *
     * AsyncStorage.setItem('UID123', JSON.stringify(UID123_object), () => {
     *   AsyncStorage.mergeItem('UID123', JSON.stringify(UID123_delta), () => {
     *     AsyncStorage.getItem('UID123', (err, result) => {
     *       console.log(result);
     *     });
     *   });
     * });
     *
     * // Console log result:
     * // => {'name':'Chris','age':31,'traits':
     * //    {'shoe_size':10,'hair':'brown','eyes':'blue'}}
     */
    mergeItem(
      key: string,
      value: string,
      callback?: ?(error: ?Error) => void
    ): Promise,

    /**
     * Erases *all* `AsyncStorage` for all clients, libraries, etc.  You probably
     * don't want to call this; use `removeItem` or `multiRemove` to clear only
     * your app's keys. Returns a `Promise` object.
     * @param callback Function that will be called with any error.
     * @returns A `Promise` object.
     */
    clear(callback?: ?(error: ?Error) => void): Promise,

    /**
     * Gets *all* keys known to your app; for all callers, libraries, etc.
     * Returns a `Promise` object.
     * @param callback Function that will be called the keys found and any error.
     * @returns A `Promise` object.
     *
     * Example: see the `multiGet` example.
     */
    getAllKeys(callback?: ?(error: ?Error, keys: ?Array<string>) => void): Promise,

    /**
     * The following batched functions are useful for executing a lot of
     * operations at once, allowing for native optimizations and provide the
     * convenience of a single callback after all operations are complete.
     *
     * These functions return arrays of errors, potentially one for every key.
     * For key-specific errors, the Error object will have a key property to
     * indicate which key caused the error.
     */

    /** Flushes any pending requests using a single batch call to get the data. */
    flushGetRequests(): void,

    /**
     * This allows you to batch the fetching of items given an array of `key`
     * inputs. Your callback will be invoked with an array of corresponding
     * key-value pairs found:
     *
     * ```
     * multiGet(['k1', 'k2'], cb) -> cb([['k1', 'val1'], ['k2', 'val2']])
     * ```
     *
     * The method returns a `Promise` object.
     *
     * @param keys Array of key for the items to get.
     * @param callback Function that will be called with a key-value array of
     *     the results, plus an array of any key-specific errors found.
     * @returns A `Promise` object.
     *
     * @example <caption>Example</caption>
     *
     * AsyncStorage.getAllKeys((err, keys) => {
     *   AsyncStorage.multiGet(keys, (err, stores) => {
     *    stores.map((result, i, store) => {
     *      // get at each store's key/value so you can work with it
     *      let key = store[i][0];
     *      let value = store[i][1];
     *     });
     *   });
     * });
     */
    multiGet(
      keys: Array<string>,
      callback?: ?(errors: ?Array<Error>, result: ?Array<Array<string>>) => void
    ): Promise,

    /**
     * Use this as a batch operation for storing multiple key-value pairs. When
     * the operation completes you'll get a single callback with any errors:
     *
     * ```
     * multiSet([['k1', 'val1'], ['k2', 'val2']], cb);
     * ```
     *
     * The method returns a `Promise` object.
     *
     * @param keyValuePairs Array of key-value array for the items to set.
     * @param callback Function that will be called with an array of any
     *    key-specific errors found.
     * @returns A `Promise` object.
     * Example: see the `multiMerge` example.
     */
    multiSet(
      keyValuePairs: Array<Array<string>>,
      callback?: ?(errors: ?Array<Error>) => void
    ): Promise,

    /**
     * Call this to batch the deletion of all keys in the `keys` array. Returns
     * a `Promise` object.
     *
     * @param keys Array of key for the items to delete.
     * @param callback Function that will be called an array of any key-specific
     *    errors found.
     * @returns A `Promise` object.
     *
     * @example <caption>Example</caption>
     * let keys = ['k1', 'k2'];
     * AsyncStorage.multiRemove(keys, (err) => {
     *   // keys k1 & k2 removed, if they existed
     *   // do most stuff after removal (if you want)
     * });
     */
    multiRemove(
      keys: Array<string>,
      callback?: ?(errors: ?Array<Error>) => void
    ): Promise,

    /**
     * Batch operation to merge in existing and new values for a given set of
     * keys. This assumes that the values are stringified JSON. Returns a
     * `Promise` object.
     *
     * **NOTE**: This is not supported by all native implementations.
     *
     * @param keyValuePairs Array of key-value array for the items to merge.
     * @param callback Function that will be called with an array of any
     *    key-specific errors found.
     * @returns A `Promise` object.
     *
     * @example <caption>Example</caption>
     * // first user, initial values
     * let UID234_object = {
     *  name: 'Chris',
     *  age: 30,
     *  traits: {hair: 'brown', eyes: 'brown'},
     * };
     *
     * // first user, delta values
     * let UID234_delta = {
     *  age: 31,
     *  traits: {eyes: 'blue', shoe_size: 10},
     * };
     *
     * // second user, initial values
     * let UID345_object = {
     *  name: 'Marge',
     *  age: 25,
     *  traits: {hair: 'blonde', eyes: 'blue'},
     * };
     *
     * // second user, delta values
     * let UID345_delta = {
     *  age: 26,
     *  traits: {eyes: 'green', shoe_size: 6},
     * };
     *
     * let multi_set_pairs   = [['UID234', JSON.stringify(UID234_object)], ['UID345', JSON.stringify(UID345_object)]]
     * let multi_merge_pairs = [['UID234', JSON.stringify(UID234_delta)], ['UID345', JSON.stringify(UID345_delta)]]
     *
     * AsyncStorage.multiSet(multi_set_pairs, (err) => {
     *   AsyncStorage.multiMerge(multi_merge_pairs, (err) => {
     *     AsyncStorage.multiGet(['UID234','UID345'], (err, stores) => {
     *       stores.map( (result, i, store) => {
     *         let key = store[i][0];
     *         let val = store[i][1];
     *         console.log(key, val);
     *       });
     *     });
     *   });
     * });
     *
     * // Console log results:
     * // => UID234 {"name":"Chris","age":31,"traits":{"shoe_size":10,"hair":"brown","eyes":"blue"}}
     * // => UID345 {"name":"Marge","age":26,"traits":{"shoe_size":6,"hair":"blonde","eyes":"green"}}
     */
    multiMerge(
      keyValuePairs: Array<Array<string>>,
      callback?: ?(errors: ?Array<Error>) => void
    ): Promise,
  |};

  declare type InteractionManagerEvents = {
    interactionStart: 'interactionStart',
    interactionComplete: 'interactionComplete',
  };

  declare export var InteractionManager: {|
    Events: InteractionManagerEvents,

    /**
     * Schedule a function to run after all interactions have completed. Returns a cancellable
     * "promise".
     */
    runAfterInteractions(task: ?Task): {then: Function, done: Function, cancel: Function},

    /**
     * Notify manager that an interaction has started.
     */
    createInteractionHandle(): Handle,

    /**
     * Notify manager that an interaction has completed.
     */
    clearInteractionHandle(handle: Handle): void,

    addListener(
      eventType: $Keys<InteractionManagerEvents>,
      listener: Function,
      context: ?Object
    ): EmitterSubscription<$Keys<InteractionManagerEvents>>,

    /**
     * A positive number will use setTimeout to schedule any tasks after the
     * eventLoopRunningTime hits the deadline value, otherwise all tasks will be
     * executed in one setImmediate batch (default).
     */
    setDeadline(deadline: number): void,
  |};

  declare type EasingFunction = (t?: number) => number;
  declare type EasingFunctionGenerator = (s: number) => EasingFunction;

  declare export var Easing: {|
    step0: (n: number) => EasingFunction,
    step1: (n: number) => EasingFunction,
    linear: EasingFunction,
    ease: EasingFunction,
    quad: EasingFunction,
    cubic: EasingFunction,

    /**
     * A power function. Position is equal to the Nth power of elapsed time.
     *
     * n = 4: http://easings.net/#easeInQuart
     * n = 5: http://easings.net/#easeInQuint
     */
    poly: EasingFunctionGenerator,

    /**
     * A sinusoidal function.
     *
     * http://easings.net/#easeInSine
     */
    sin: EasingFunction,

    /**
     * A circular function.
     *
     * http://easings.net/#easeInCirc
     */
    circle: EasingFunction,

    /**
     * An exponential function.
     *
     * http://easings.net/#easeInExpo
     */
    exp: EasingFunction,

    /**
     * A simple elastic interaction, similar to a spring oscillating back and
     * forth.
     *
     * Default bounciness is 1, which overshoots a little bit once. 0 bounciness
     * doesn't overshoot at all, and bounciness of N > 1 will overshoot about N
     * times.
     *
     * http://easings.net/#easeInElastic
     *
     * Wolfram Plots:
     *
     * - http://tiny.cc/elastic_b_1 (bounciness = 1, default)
     * - http://tiny.cc/elastic_b_3 (bounciness = 3)
     */
    elastic(bounciness?: number): EasingFunction,

    /**
     * Use with `Animated.parallel()` to create a simple effect where the object
     * animates back slightly as the animation starts.
     *
     * Wolfram Plot:
     *
     * - http://tiny.cc/back_default (s = 1.70158, default)
     */
    back(s: number): EasingFunction,

    /**
     * Provides a simple bouncing effect.
     *
     * http://easings.net/#easeInBounce
     */
    bounce: EasingFunction,

    /**
     * Provides a cubic bezier curve, equivalent to CSS Transitions'
     * `transition-timing-function`.
     *
     * A useful tool to visualize cubic bezier curves can be found at
     * http://cubic-bezier.com/
     */
    bezier(
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ): EasingFunction,

    /**
     * Runs an easing function forwards.
     */
    in(easing: EasingFunction): EasingFunction,

    /**
     * Runs an easing function backwards.
     */
    out(easing: EasingFunction): EasingFunction,

    /**
     * Makes any easing function symmetrical. The easing function will run
     * forwards for half of the duration, then backwards for the rest of the
     * duration.
     */
    inOut(easing: EasingFunction): EasingFunction,
  |};

  declare type ExtrapolateType = 'extend' | 'identity' | 'clamp';
  declare type InterpolationConfigType = {
    inputRange: Array<number>,
    outputRange: (Array<number> | Array<string>),
    easing?: ((input: number) => number),
    extrapolate?: ExtrapolateType,
    extrapolateLeft?: ExtrapolateType,
    extrapolateRight?: ExtrapolateType,
  };
  declare type EndResult = {finished: bool};
  declare type EndCallback = (result: EndResult) => void;
  declare type AnimationConfig = {
    isInteraction?: bool,
    useNativeDriver?: bool,
    onComplete?: ?EndCallback,
    iterations?: number,
  };

  declare class Interpolation {
    static create(config: InterpolationConfigType): (input: number) => number | string,
  }

  declare class BaseAnimated {

  }

  declare class Animation {
    start(
      fromValue: number,
      onUpdate: (value: number) => void,
      onEnd: ?EndCallback,
      previousAnimation: ?Animation,
      animatedValue: AnimatedValue
    ): void,
    onUpdate(): void,
    stop(): void,
  }

  declare class AnimatedWithChildren extends BaseAnimated {}

  declare class TimingAnimation extends Animation {}

  declare type DecayAnimationConfig = AnimationConfig & {
    velocity: number | {x: number, y: number},
    deceleration?: number,
  };

  declare type DecayAnimationConfigSingle = AnimationConfig & {
    velocity: number,
    deceleration?: number,
  };

  declare type SpringAnimationConfig = AnimationConfig & {
    toValue: number | AnimatedValue | {x: number, y: number} | AnimatedValueXY,
    overshootClamping?: bool,
    restDisplacementThreshold?: number,
    restSpeedThreshold?: number,
    velocity?: number | {x: number, y: number},
    bounciness?: number,
    speed?: number,
    tension?: number,
    friction?: number,
  };

  declare type SpringAnimationConfigSingle = AnimationConfig & {
    toValue: number | AnimatedValue,
    overshootClamping?: bool,
    restDisplacementThreshold?: number,
    restSpeedThreshold?: number,
    velocity?: number,
    bounciness?: number,
    speed?: number,
    tension?: number,
    friction?: number,
  };

  declare class DecayAnimation extends Animation {}
  declare class SpringAnimation extends Animation {}

  declare type ValueListenerCallback = (state: {value: number}) => void;

  declare class AnimatedValue extends AnimatedWithChildren {
    __isNative: boolean,
    __getValue: () => number,
    __getAnimatedValue: () => number,
    
    _listeners: { [key: string]: mixed },
    
    constructor(value: number): void,
    /**
     * Directly set the value.  This will stop any animations running on the value
     * and update all the bound properties.
     */
    setValue(value: number): void,

    /**
     * Sets an offset that is applied on top of whatever value is set, whether via
     * `setValue`, an animation, or `Animated.event`.  Useful for compensating
     * things like the start of a pan gesture.
     */
    setOffset(offset: number): void,

    /**
     * Merges the offset value into the base value and resets the offset to zero.
     * The final output of the value is unchanged.
     */
    flattenOffset(): void,

    /**
     * Sets the offset value to the base value, and resets the base value to zero.
     * The final output of the value is unchanged.
     */
    extractOffset(): void,

    /**
     * Adds an asynchronous listener to the value so you can observe updates from
     * animations.  This is useful because there is no way to
     * synchronously read the value because it might be driven natively.
     */
    addListener(callback: ValueListenerCallback): string,

    removeListener(id: string): void,

    removeAllListeners(): void,

    /**
     * Stops any running animation or tracking.  `callback` is invoked with the
     * final value after stopping the animation, which is useful for updating
     * state to match the animation position with layout.
     */
    stopAnimation(callback?: ?(value: number) => void): void,

    /**
     * Stops any animation and resets the value to its original
     */
    resetAnimation(callback?: ?(value: number) => void): void,

    /**
     * Interpolates the value before updating the property, e.g. mapping 0-1 to
     * 0-10.
     */
    interpolate(config: InterpolationConfigType): AnimatedInterpolation,

    /**
     * Typically only used internally, but could be used by a custom Animation
     * class.
     */
    animate(animation: Animation, callback: ?EndCallback): void,

    /**
     * Typically only used internally.
     */
    stopTracking(): void,

    /**
     * Typically only used internally.
     */
    track(tracking: BaseAnimated): void,
  }

  declare type ValueXYListenerCallback = (value: {x: number, y: number}) => void;

  declare class AnimatedValueXY extends AnimatedWithChildren {
    x: AnimatedValue;
    y: AnimatedValue;
    constructor(valueIn?: ?{x: number | AnimatedValue, y: number | AnimatedValue}): void,

    setValue(value: {x: number, y: number}): void,

    setOffset(offset: {x: number, y: number}): void,

    flattenOffset(): void,

    extractOffset(): void,

    resetAnimation(callback?: (value: {x: number, y: number}) => void): void,

    stopAnimation(callback?: (value: {x: number, y: number}) => void): void,

    addListener(callback: ValueXYListenerCallback): string,

    removeListener(id: string): void,

    removeAllListeners(): void,

    /**
     * Converts `{x, y}` into `{left, top}` for use in style, e.g.
     *
     *```javascript
     *  style={this.state.anim.getLayout()}
     *```
     */
    getLayout(): {[key: string]: AnimatedValue},

    /**
     * Converts `{x, y}` into a useable translation transform, e.g.
     *
     *```javascript
     *  style={{
     *    transform: this.state.anim.getTranslateTransform()
     *  }}
     *```
     */
    getTranslateTransform(): Array<{[key: string]: AnimatedValue}>,
  }

  declare class AnimatedInterpolation extends AnimatedWithChildren {
    constructor(parent: BaseAnimated, config: InterpolationConfigType): void,
    interpolate(config: InterpolationConfigType): AnimatedInterpolation,
  }

  declare class AnimatedAddition extends AnimatedWithChildren {
    constructor(a: BaseAnimated | number, b: BaseAnimated | number): void,
    interpolate(config: InterpolationConfigType): AnimatedInterpolation,
  }

  declare class AnimatedDivision extends AnimatedWithChildren {
    constructor(a: BaseAnimated | number, b: BaseAnimated | number): void,
    interpolate(config: InterpolationConfigType): AnimatedInterpolation,
  }

  declare class AnimatedMultiplication extends AnimatedWithChildren {
    constructor(a: BaseAnimated | number, b: BaseAnimated | number): void,
    interpolate(config: InterpolationConfigType): AnimatedInterpolation,
  }

  declare class AnimatedModulo extends AnimatedWithChildren {
    constructor(a: BaseAnimated | number, moduluis: number): void,
    interpolate(config: InterpolationConfigType): AnimatedInterpolation,
  }

  declare class AnimatedDiffClamp extends AnimatedWithChildren {
    constructor(a: BaseAnimated, min: number, max: number): void,
    interpolate(config: InterpolationConfigType): AnimatedInterpolation,
  }

  declare class AnimatedTransform extends AnimatedWithChildren {
    constructor(transforms: Array<Object>): void,
  }

  declare class AnimatedStyle extends AnimatedWithChildren {
    constructor(style: any): void,
  }

  declare class AnimatedProps extends AnimatedWithChildren {
    constructor(
      props: Object,
      callback: () => void,
    ): void,
    update(): void,
    setNativeView(animatedView: any): void,
  }

  declare class AnimatedComponent extends React$Component<*,*,*> {
    getNode(): any,
  }

  declare class AnimatedTracking extends BaseAnimated {
    constructor(
      value: AnimatedValue,
      parent: BaseAnimated,
      animationClass: any,
      animationConfig: Object,
      callback?: ?EndCallback,
    ): void,
    update(): void,
  }

  declare type CompositeAnimation = {
    start: (callback?: ?EndCallback) => void,
    stop: () => void,
    reset: () => void,
  };

  declare type ParallelConfig = {
    stopTogether?: bool, // If one is stopped, stop all.  default: true
  }

  declare type LoopAnimationConfig = { iterations: number };

  declare type Mapping = {[key: string]: Mapping} | AnimatedValue;
  declare type EventConfig = {
    listener?: ?Function,
    useNativeDriver?: bool,
  };

  declare class AnimatedEvent {

  }

  declare export var Animated: {|
    /**
     * Standard value class for driving animations.  Typically initialized with
     * `new Animated.Value(0);`
     *
     * See also [`AnimatedValue`](docs/animated.html#animatedvalue).
     */
    Value: Class<AnimatedValue>,
    /**
     * 2D value class for driving 2D animations, such as pan gestures.
     *
     * See also [`AnimatedValueXY`](docs/animated.html#animatedvaluexy).
     */
    ValueXY: Class<AnimatedValueXY>,
    /**
     * exported to use the Interpolation type in flow
     *
     * See also [`AnimatedInterpolation`](docs/animated.html#animatedinterpolation).
     */
    Interpolation: Class<AnimatedInterpolation>,

    /**
     * Animates a value from an initial velocity to zero based on a decay
     * coefficient.
     *
     * Config is an object that may have the following options:
     *
     *   - `velocity`: Initial velocity.  Required.
     *   - `deceleration`: Rate of decay.  Default 0.997.
     *   - `useNativeDriver`: Uses the native driver when true. Default false.
     */
    decay(value: AnimatedValue | AnimatedValueXY, config: DecayAnimationConfig): CompositeAnimation,
    /**
     * Animates a value along a timed easing curve. The
     * [`Easing`](docs/easing.html) module has tons of predefined curves, or you
     * can use your own function.
     *
     * Config is an object that may have the following options:
     *
     *   - `duration`: Length of animation (milliseconds).  Default 500.
     *   - `easing`: Easing function to define curve.
     *     Default is `Easing.inOut(Easing.ease)`.
     *   - `delay`: Start the animation after delay (milliseconds).  Default 0.
     *   - `useNativeDriver`: Uses the native driver when true. Default false.
     */
    timing(value: AnimatedValue | AnimatedValueXY, config: TimingAnimationConfig): CompositeAnimation,
    /**
     * Spring animation based on Rebound and
     * [Origami](https://facebook.github.io/origami/).  Tracks velocity state to
     * create fluid motions as the `toValue` updates, and can be chained together.
     *
     * Config is an object that may have the following options. Note that you can
     * only define bounciness/speed or tension/friction but not both:
     *
     *   - `friction`: Controls "bounciness"/overshoot.  Default 7.
     *   - `tension`: Controls speed.  Default 40.
     *   - `speed`: Controls speed of the animation. Default 12.
     *   - `bounciness`: Controls bounciness. Default 8.
     *   - `useNativeDriver`: Uses the native driver when true. Default false.
     */
    spring(value: AnimatedValue | AnimatedValueXY, config: SpringAnimationConfig): CompositeAnimation,

    /**
     * Creates a new Animated value composed from two Animated values added
     * together.
     */
    add(a: BaseAnimated | number, b: BaseAnimated | number): AnimatedAddition,

    /**
     * Creates a new Animated value composed by dividing the first Animated value
     * by the second Animated value.
     */
    divide(a: BaseAnimated | number, b: BaseAnimated | number): AnimatedDivision,

    /**
     * Creates a new Animated value composed from two Animated values multiplied
     * together.
     */
    multiply(a: BaseAnimated | number, b: BaseAnimated | number): AnimatedMultiplication,

    /**
     * Creates a new Animated value that is the (non-negative) modulo of the
     * provided Animated value
     */
    modulo(a: BaseAnimated, modulus: number): AnimatedModulo,

    /**
     * Create a new Animated value that is limited between 2 values. It uses the
     * difference between the last value so even if the value is far from the bounds
     * it will start changing when the value starts getting closer again.
     * (`value = clamp(value + diff, min, max)`).
     *
     * This is useful with scroll events, for example, to show the navbar when
     * scrolling up and to hide it when scrolling down.
     */
    diffClamp(a: BaseAnimated, min: number, max: number): AnimatedDiffClamp,

    /**
     * Starts an animation after the given delay.
     */
    delay(time: number): CompositeAnimation,
    /**
     * Starts an array of animations in order, waiting for each to complete
     * before starting the next.  If the current running animation is stopped, no
     * following animations will be started.
     */
    sequence(animations: Array<CompositeAnimation>): CompositeAnimation,
    /**
     * Starts an array of animations all at the same time.  By default, if one
     * of the animations is stopped, they will all be stopped.  You can override
     * this with the `stopTogether` flag.
     */
    parallel(animations: Array<CompositeAnimation>, config?: ?ParallelConfig): CompositeAnimation,
    /**
     * Array of animations may run in parallel (overlap), but are started in
     * sequence with successive delays.  Nice for doing trailing effects.
     */
    stagger(time: number, animations: Array<CompositeAnimation>): CompositeAnimation,
    /**
     * Loops a given animation continuously, so that each time it reaches the
     * end, it resets and begins again from the start. Can specify number of
     * times to loop using the key 'iterations' in the config. Will loop without
     * blocking the UI thread if the child animation is set to 'useNativeDriver'.
     */
    loop(animation: CompositeAnimation, config?: LoopAnimationConfig): CompositeAnimation,

    /**
     * Takes an array of mappings and extracts values from each arg accordingly,
     * then calls `setValue` on the mapped outputs.  e.g.
     *
     *```javascript
     *  onScroll={Animated.event(
     *    [{nativeEvent: {contentOffset: {x: this._scrollX}}}]
     *    {listener},          // Optional async listener
     *  )
     *  ...
     *  onPanResponderMove: Animated.event([
     *    null,                // raw event arg ignored
     *    {dx: this._panX},    // gestureState arg
     *  ]),
     *```
     *
     * Config is an object that may have the following options:
     *
     *   - `listener`: Optional async listener.
     *   - `useNativeDriver`: Uses the native driver when true. Default false.
     */
    event(argMapping: Array<?Mapping>, config?: EventConfig): any,

    /**
     * Make any React component Animatable.  Used to create `Animated.View`, etc.
     */
    createAnimatedComponent(Component: React$Component<*>): AnimatedComponent,

    /**
     * Imperative API to attach an animated value to an event on a view. Prefer using
     * `Animated.event` with `useNativeDrive: true` if possible.
     */
    attachNativeEvent(viewRef: any, eventName: string, argMapping: Array<?Mapping>): void,

    /**
     * Advanced imperative API for snooping on animated events that are passed in through props. Use
     * values directly where possible.
     */
    forkEvent(event: ?AnimatedEvent | ?Function, listener: Function): AnimatedEvent | Function,
    unforkEvent(event: ?AnimatedEvent | ?Function, listener: Function): void ,
    
    Text: Class<AnimatedText>,
    View: Class<AnimatedView>,
    Image: Class<AnimatedImage>,
    ScrollView: Class<AnimatedScrollView>,
  |};

  declare export function findNodeHandle(componentOrHandle: any): ?number;

  declare type TouchableWithoutFeedbackProps = {
    accessible?: boolean,
    accessibilityComponentType?: AccessibilityComponentType,
    accessibilityTraits?: AccessibilityTrait | Array<AccessibilityTrait>,
    /**
     * If true, disable all interactions for this component.
     */
    disabled?: boolean,
    /**
     * Called when the touch is released, but not if cancelled (e.g. by a scroll
     * that steals the responder lock).
     */
    onPress?: Function,
    onPressIn?: Function,
    onPressOut?: Function,
    /**
     * Invoked on mount and layout changes with
     *
     *   `{nativeEvent: {layout: {x, y, width, height}}}`
     */
    onLayout?: Function,

    onLongPress?: Function,

    /**
     * Delay in ms, from the start of the touch, before onPressIn is called.
     */
    delayPressIn?: number,
    /**
     * Delay in ms, from the release of the touch, before onPressOut is called.
     */
    delayPressOut?: number,
    /**
     * Delay in ms, from onPressIn, before onLongPress is called.
     */
    delayLongPress?: number,
    /**
     * When the scroll view is disabled, this defines how far your touch may
     * move off of the button, before deactivating the button. Once deactivated,
     * try moving it back and you'll see that the button is once again
     * reactivated! Move it back and forth several times while the scroll view
     * is disabled. Ensure you pass in a constant to reduce memory allocations.
     */
    pressRetentionOffset?: EdgeInsetsProp,
    /**
     * This defines how far your touch can start away from the button. This is
     * added to `pressRetentionOffset` when moving off of the button.
     * ** NOTE **
     * The touch area never extends past the parent view bounds and the Z-index
     * of sibling views always takes precedence if a touch hits two overlapping
     * views.
     */
    hitSlop?: EdgeInsetsProp,
  };

  declare export class TouchableWithoutFeedback extends React$Component<void, TouchableWithoutFeedbackProps, void> {
    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: TouchableWithoutFeedbackProps): void,
  }

  declare type TouchableOpacityProps = {
    ...TouchableWithoutFeedbackProps,
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active. Defaults to 0.2.
     */
    activeOpacity?: number,
    focusedOpacity?: number,
    /**
     * Apple TV parallax effects
     */
    tvParallaxProperties?: Object,
  };

  declare type TouchableOpacityDefaultProps = {
    activeOpacity: number,
    focusedOpacity: number,
  };

  declare export class TouchableOpacity extends React$Component<TouchableOpacityDefaultProps, TouchableOpacityProps, void> {
    static defaultProps: {
      activeOpacity: 0.2,
      focusedOpacity: 0.7,
    };
    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: TouchableOpacityProps): void,
  }

  declare type TouchableHighlightProps = {
    ...TouchableWithoutFeedbackProps,
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active.
     */
    activeOpacity?: number,
    /**
     * The color of the underlay that will show through when the touch is
     * active.
     */
    underlayColor?: Color,
    style?: StyleProp<ViewStylePropTypes, StyleId>,
    /**
     * Called immediately after the underlay is shown
     */
    onShowUnderlay?: Function,
    /**
     * Called immediately after the underlay is hidden
     */
    onHideUnderlay?: Function,
    /**
     * *(Apple TV only)* TV preferred focus (see documentation for the View component).
     *
     * @platform ios
     */
    hasTVPreferredFocus?: boolean,
    /**
     * *(Apple TV only)* Object with properties to control Apple TV parallax effects.
     *
     * enabled: If true, parallax effects are enabled.  Defaults to true.
     * shiftDistanceX: Defaults to 2.0.
     * shiftDistanceY: Defaults to 2.0.
     * tiltAngle: Defaults to 0.05.
     * magnification: Defaults to 1.0.
     *
     * @platform ios
     */
    tvParallaxProperties?: Object,
  };

  declare export class TouchableHighlight extends React$Component<typeof TouchableHighlight.defaultProps, TouchableHighlightProps, void> {
    static defaultProps: {
      activeOpacity: 0.85,
      underlayColor: 'black',
    };
    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: TouchableHighlightProps): void,
  }

  declare type TouchableNativeFeedbackProps = {
    ...TouchableWithoutFeedbackProps,
    /**
     * Determines the type of background drawable that's going to be used to
     * display feedback. It takes an object with `type` property and extra data
     * depending on the `type`. It's recommended to use one of the static
     * methods to generate that dictionary.
     */
    background: {
      type: 'RippleAndroid',
      color: number,
      borderless: boolean,
    } | {
      type: 'ThemeAttrAndroid',
      attribute: string,
    },

    /**
     * Set to true to add the ripple effect to the foreground of the view, instead of the
     * background. This is useful if one of your child views has a background of its own, or you're
     * e.g. displaying images, and you don't want the ripple to be covered by them.
     *
     * Check TouchableNativeFeedback.canUseNativeForeground() first, as this is only available on
     * Android 6.0 and above. If you try to use this on older versions you will get a warning and
     * fallback to background.
     */
    useForeground?: boolean,
  };
  
  declare type TouchableNativeFeedbackDefaultProps = {
    activeOpacity: number,
    underlayColor: string,
  };

  declare export class TouchableNativeFeedback extends React$Component<TouchableNativeFeedbackDefaultProps, TouchableNativeFeedbackProps, void> {
    static defaultProps: {
      activeOpacity: 0.85,
      underlayColor: 'black',
    };
    /**
     * Creates an object that represents android theme's default background for
     * selectable elements (?android:attr/selectableItemBackground).
     */
    static SelectableBackground(): {
      type: 'ThemeAttrAndroid',
      attribute: 'selectableItemBackground'
    },
    /**
     * Creates an object that represent android theme's default background for borderless
     * selectable elements (?android:attr/selectableItemBackgroundBorderless).
     * Available on android API level 21+.
     */
    static SelectableBackgroundBorderless(): {
      type: 'ThemeAttrAndroid',
      attribute: 'selectableItemBackgroundBorderless',
    },
    /**
     * Creates an object that represents ripple drawable with specified color (as a
     * string). If property `borderless` evaluates to true the ripple will
     * render outside of the view bounds (see native actionbar buttons as an
     * example of that behavior). This background type is available on Android
     * API level 21+.
     *
     * @param color The ripple color
     * @param borderless If the ripple can render outside it's bounds
     */
    static Ripple(color: string, borderless: boolean): {
      type: 'RippleAndroid',
      color: number,
      borderless: boolean,
    },
    static canUseNativeForeground(): boolean,
    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: TouchableNativeFeedbackProps): void,
  }


  declare class ListViewDataSource {
    /**
     * You can provide custom extraction and `hasChanged` functions for section
     * headers and rows.  If absent, data will be extracted with the
     * `defaultGetRowData` and `defaultGetSectionHeaderData` functions.
     *
     * The default extractor expects data of one of the following forms:
     *
     *      { sectionID_1: { rowID_1: <rowData1>, ... }, ... }
     *
     *    or
     *
     *      { sectionID_1: [ <rowData1>, <rowData2>, ... ], ... }
     *
     *    or
     *
     *      [ [ <rowData1>, <rowData2>, ... ], ... ]
     *
     * The constructor takes in a params argument that can contain any of the
     * following:
     *
     * - getRowData(dataBlob, sectionID, rowID);
     * - getSectionHeaderData(dataBlob, sectionID);
     * - rowHasChanged(prevRowData, nextRowData);
     * - sectionHeaderHasChanged(prevSectionData, nextSectionData);
     */
    constructor(params: ParamType): void,

    /**
     * Clones this `ListViewDataSource` with the specified `dataBlob` and
     * `rowIdentities`. The `dataBlob` is just an arbitrary blob of data. At
     * construction an extractor to get the interesting information was defined
     * (or the default was used).
     *
     * The `rowIdentities` is a 2D array of identifiers for rows.
     * ie. [['a1', 'a2'], ['b1', 'b2', 'b3'], ...].  If not provided, it's
     * assumed that the keys of the section data are the row identities.
     *
     * Note: This function does NOT clone the data in this data source. It simply
     * passes the functions defined at construction to a new data source with
     * the data specified. If you wish to maintain the existing data you must
     * handle merging of old and new data separately and then pass that into
     * this function as the `dataBlob`.
     */
    cloneWithRows(
        dataBlob: $ReadOnlyArray<any> | {+[key: string]: any},
        rowIdentities: ?$ReadOnlyArray<string>
    ): ListViewDataSource,

    /**
     * This performs the same function as the `cloneWithRows` function but here
     * you also specify what your `sectionIdentities` are. If you don't care
     * about sections you should safely be able to use `cloneWithRows`.
     *
     * `sectionIdentities` is an array of identifiers for  sections.
     * ie. ['s1', 's2', ...].  If not provided, it's assumed that the
     * keys of dataBlob are the section identities.
     *
     * Note: this returns a new object!
     */
    cloneWithRowsAndSections(
        dataBlob: any,
        sectionIdentities: ?Array<string>,
        rowIdentities: ?Array<Array<string>>
    ): ListViewDataSource,

    getRowCount(): number,

    getRowAndSectionCount(): number,

    /**
     * Returns if the row is dirtied and needs to be rerendered
     */
    rowShouldUpdate(sectionIndex: number, rowIndex: number): boolean,

    /**
     * Gets the data required to render the row.
     */
    getRowData(sectionIndex: number, rowIndex: number): any,

    /**
     * Gets the rowID at index provided if the dataSource arrays were flattened,
     * or null of out of range indexes.
     */
    getRowIDForFlatIndex(index: number): ?string,

    /**
     * Gets the sectionID at index provided if the dataSource arrays were flattened,
     * or null for out of range indexes.
     */
    getSectionIDForFlatIndex(index: number): ?string,

    /**
     * Returns an array containing the number of rows in each section
     */
    getSectionLengths(): Array<number>,

    /**
     * Returns if the section header is dirtied and needs to be rerendered
     */
    sectionHeaderShouldUpdate(sectionIndex: number): boolean,

    /**
     * Gets the data required to render the section header
     */
    getSectionHeaderData(sectionIndex: number): any,
  }



  declare type ListViewProps = {
    ...ScrollViewProps,
    /**
     * An instance of [ListView.DataSource](docs/listviewdatasource.html) to use
     */
    dataSource: ListViewDataSource,
    /**
     * (sectionID, rowID, adjacentRowHighlighted) => renderable
     *
     * If provided, a renderable component to be rendered as the separator
     * below each row but not the last row if there is a section header below.
     * Take a sectionID and rowID of the row above and whether its adjacent row
     * is highlighted.
     */
    renderSeparator?: Function,
    /**
     * (rowData, sectionID, rowID, highlightRow) => renderable
     *
     * Takes a data entry from the data source and its ids and should return
     * a renderable component to be rendered as the row. By default the data
     * is exactly what was put into the data source, but it's also possible to
     * provide custom extractors. ListView can be notified when a row is
     * being highlighted by calling `highlightRow(sectionID, rowID)`. This
     * sets a boolean value of adjacentRowHighlighted in renderSeparator, allowing you
     * to control the separators above and below the highlighted row. The highlighted
     * state of a row can be reset by calling highlightRow(null).
     */
    renderRow: Function,
    /**
     * How many rows to render on initial component mount. Use this to make
     * it so that the first screen worth of data appears at one time instead of
     * over the course of multiple frames.
     */
    initialListSize?: number,
    /**
     * Called when all rows have been rendered and the list has been scrolled
     * to within onEndReachedThreshold of the bottom. The native scroll
     * event is provided.
     */
    onEndReached?: Function,
    /**
     * Threshold in pixels (virtual, not physical) for calling onEndReached.
     */
    onEndReachedThreshold?: number,
    /**
     * Number of rows to render per event loop. Note: if your 'rows' are actually
     * cells, i.e. they don't span the full width of your view (as in the
     * ListViewGridLayoutExample), you should set the pageSize to be a multiple
     * of the number of cells per row, otherwise you're likely to see gaps at
     * the edge of the ListView as new pages are loaded.
     */
    pageSize?: number,
    /**
     * () => renderable
     *
     * The header and footer are always rendered (if these props are provided)
     * on every render pass. If they are expensive to re-render, wrap them
     * in StaticContainer or other mechanism as appropriate. Footer is always
     * at the bottom of the list, and header at the top, on every render pass.
     */
    renderFooter?: Function,
    renderHeader?: Function,
    /**
     * (sectionData, sectionID) => renderable
     *
     * If provided, a header is rendered for this section.
     */
    renderSectionHeader?: Function,
    /**
     * (props) => renderable
     *
     * A function that returns the scrollable component in which the list rows
     * are rendered. Defaults to returning a ScrollView with the given props.
     */
    renderScrollComponent?: Function,
    /**
     * How early to start rendering rows before they come on screen, in
     * pixels.
     */
    scrollRenderAheadDistance?: number,
    /**
     * (visibleRows, changedRows) => void
     *
     * Called when the set of visible rows changes. `visibleRows` maps
     * { sectionID: { rowID: true }} for all the visible rows, and
     * `changedRows` maps { sectionID: { rowID: true | false }} for the rows
     * that have changed their visibility, with true indicating visible, and
     * false indicating the view has moved out of view.
     */
    onChangeVisibleRows?: Function,
    /**
     * A performance optimization for improving scroll perf of
     * large lists, used in conjunction with overflow: 'hidden' on the row
     * containers. This is enabled by default.
     */
    removeClippedSubviews?: boolean,
    /**
     * Makes the sections headers sticky. The sticky behavior means that it
     * will scroll with the content at the top of the section until it reaches
     * the top of the screen, at which point it will stick to the top until it
     * is pushed off the screen by the next section header. This property is
     * not supported in conjunction with `horizontal={true}`. Only enabled by
     * default on iOS because of typical platform standards.
     */
    stickySectionHeadersEnabled?: boolean,
    /**
     * An array of child indices determining which children get docked to the
     * top of the screen when scrolling. For example, passing
     * `stickyHeaderIndices={[0]}` will cause the first child to be fixed to the
     * top of the scroll view. This property is not supported in conjunction
     * with `horizontal={true}`.
     */
    stickyHeaderIndices?: Array<number>,
    /**
     * Flag indicating whether empty section headers should be rendered. In the future release
     * empty section headers will be rendered by default, and the flag will be deprecated.
     * If empty sections are not desired to be rendered their indices should be excluded from sectionID object.
     */
    enableEmptySections?: boolean,
  };

  declare export class ListView extends React$Component<void, ListViewProps, void> {
    static DataSource: Class<ListViewDataSource>,
    /**
     * Provides a handle to the underlying scroll responder.
     * Note that `this._scrollComponent` might not be a `ScrollView`, so we
     * need to check that it responds to `getScrollResponder` before calling it.
     */
    getScrollResponder(): any, // TODO(lmr): ScrollResponder
    getScrollableNode(): any,

    /**
     * Scrolls to a given x, y offset, either immediately or with a smooth animation.
     *
     * See `ScrollView#scrollTo`.
     */
    scrollTo(...args: Array<mixed>): void,

    /**
     * If this is a vertical ListView scrolls to the bottom.
     * If this is a horizontal ListView scrolls to the right.
     *
     * Use `scrollToEnd({animated: true})` for smooth animated scrolling,
     * `scrollToEnd({animated: false})` for immediate scrolling.
     * If no options are passed, `animated` defaults to true.
     *
     * See `ScrollView#scrollToEnd`.
     */
    scrollToEnd(options?: ?{ animated?: ?boolean }): void,

    setNativeProps(props: Object): void,
  }

  declare type VirtualizedListItem = any;

  declare type renderItemType = (info: any) => ?React.Element<any>;

  declare type RequiredVirtualizedListProps = {
    renderItem: renderItemType,
    /**
     * The default accessor functions assume this is an Array<{key: string}> but you can override
     * getItem, getItemCount, and keyExtractor to handle any type of index-based data.
     */
    data?: any,
    /**
     * A generic accessor for extracting an item from any sort of data blob.
     */
    getItem: (data: any, index: number) => ?VirtualizedListItem,
    /**
     * Determines how many items are in the data blob.
     */
    getItemCount: (data: any) => number,
  };

  declare type OptionalVirtualizedListProps = {
    /**
     * `debug` will turn on extra logging and visual overlays to aid with debugging both usage and
     * implementation, but with a significant perf hit.
     */
    debug?: ?boolean,
    /**
     * DEPRECATED: Virtualization provides significant performance and memory optimizations, but fully
     * unmounts react instances that are outside of the render window. You should only need to disable
     * this for debugging purposes.
     */
    disableVirtualization: boolean,
    /**
     * A marker property for telling the list to re-render (since it implements `PureComponent`). If
     * any of your `renderItem`, Header, Footer, etc. functions depend on anything outside of the
     * `data` prop, stick it here and treat it immutably.
     */
    extraData?: any,
    getItemLayout?: (data: any, index: number) =>
      {length: number, offset: number, index: number}, // e.g. height, y
    horizontal?: ?boolean,
    /**
     * How many items to render in the initial batch. This should be enough to fill the screen but not
     * much more. Note these items will never be unmounted as part of the windowed rendering in order
     * to improve perceived performance of scroll-to-top actions.
     */
    initialNumToRender: number,
    /**
     * Instead of starting at the top with the first item, start at `initialScrollIndex`. This
     * disables the "scroll to top" optimization that keeps the first `initialNumToRender` items
     * always rendered and immediately renders the items starting at this initial index. Requires
     * `getItemLayout` to be implemented.
     */
    initialScrollIndex?: ?number,
    keyExtractor: (item: VirtualizedListItem, index: number) => string,
    /**
     * Rendered when the list is empty. Can be a React Component Class, a render function, or
     * a rendered element.
     */
    ListEmptyComponent?: ?(React$Class<any> | React$Element<any>),
    /**
     * Rendered at the bottom of all the items. Can be a React Component Class, a render function, or
     * a rendered element.
     */
    ListFooterComponent?: ?(React$Class<any> | React$Element<any>),
    /**
     * Rendered at the top of all the items. Can be a React Component Class, a render function, or
     * a rendered element.
     */
    ListHeaderComponent?: ?(React$Class<any> | React$Element<any>),
    /**
     * The maximum number of items to render in each incremental render batch. The more rendered at
     * once, the better the fill rate, but responsiveness my suffer because rendering content may
     * interfere with responding to button taps or other interactions.
     */
    maxToRenderPerBatch: number,
    onEndReached?: ?(info: {distanceFromEnd: number}) => void,
    onEndReachedThreshold?: ?number, // units of visible length
    onLayout?: ?Function,
    /**
     * If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make
     * sure to also set the `refreshing` prop correctly.
     */
    onRefresh?: ?Function,
    /**
     * Called when the viewability of rows changes, as defined by the
     * `viewabilityConfig` prop.
     */
    onViewableItemsChanged?: ?(info: {
      viewableItems: Array<ViewToken>,
      changed: Array<ViewToken>,
    }) => void,
    /**
     * Set this true while waiting for new data from a refresh.
     */
    refreshing?: ?boolean,
    /**
     * Note: may have bugs (missing content) in some circumstances - use at your own risk.
     *
     * This may improve scroll performance for large lists.
     */
    removeClippedSubviews?: boolean,
    /**
     * Render a custom scroll component, e.g. with a differently styled `RefreshControl`.
     */
    renderScrollComponent: (props: Object) => React$Element<any>,
    /**
     * Amount of time between low-pri item render batches, e.g. for rendering items quite a ways off
     * screen. Similar fill rate/responsiveness tradeoff as `maxToRenderPerBatch`.
     */
    updateCellsBatchingPeriod: number,
    viewabilityConfig?: ViewabilityConfig,
    /**
     * Determines the maximum number of items rendered outside of the visible area, in units of
     * visible lengths. So if your list fills the screen, then `windowSize={21}` (the default) will
     * render the visible screen area plus up to 10 screens above and 10 below the viewport. Reducing
     * this number will reduce memory consumption and may improve performance, but will increase the
     * chance that fast scrolling may reveal momentary blank areas of unrendered content.
     */
    windowSize: number,
  };

  declare type VirtualizedListProps = {
    ...RequiredVirtualizedListProps,
    ...OptionalVirtualizedListProps,
  };


  declare class VirtualizedList extends React.PureComponent<OptionalVirtualizedListProps, VirtualizedListProps, void> {
    scrollToEnd(params?: ?{animated?: ?boolean}): void,

    // scrollToIndex may be janky without getItemLayout prop
    scrollToIndex(params: {
      animated?: ?boolean, index: number, viewOffset?: number, viewPosition?: number
    }): void,

    // scrollToItem may be janky without getItemLayout prop. Required linear scan through items -
    // use scrollToIndex instead if possible.
    scrollToItem(params: {animated?: ?boolean, item: Item, viewPosition?: number}): void,

    scrollToOffset(params: {animated?: ?boolean, offset: number}): void,

    recordInteraction(): void,

    /**
     * Provides a handle to the underlying scroll responder.
     * Note that `this._scrollRef` might not be a `ScrollView`, so we
     * need to check that it responds to `getScrollResponder` before calling it.
     */
    getScrollResponder(): any,

    getScrollableNode(): any,
  }



  declare type RequiredFlatListProps<ItemT> = {
    /**
     * Takes an item from `data` and renders it into the list. Example usage:
     *
     *     <FlatList
     *       ItemSeparatorComponent={Platform.OS !== 'android' && ({highlighted}) => (
     *         <View style={[style.separator, highlighted && {marginLeft: 0}]} />
     *       )}
     *       data={[{title: 'Title Text', key: 'item1'}]}
     *       renderItem={({item, separators}) => (
     *         <TouchableHighlight
     *           onPress={() => this._onPress(item)}
     *           onShowUnderlay={separators.highlight}
     *           onHideUnderlay={separators.unhighlight}>
     *           <View style={{backgroundColor: 'white'}}>
     *             <Text>{item.title}}</Text>
     *           </View>
     *         </TouchableHighlight>
     *       )}
     *     />
     *
     * Provides additional metadata like `index` if you need it, as well as a more generic
     * `separators.updateProps` function which let's you set whatever props you want to change the
     * rendering of either the leading separator or trailing separator in case the more common
     * `highlight` and `unhighlight` (which set the `highlighted: boolean` prop) are insufficient for
     * your use-case.
     */
    renderItem: (info: {
      item: ItemT,
      index: number,
      separators: {
        highlight: () => void,
        unhighlight: () => void,
        updateProps: (select: 'leading' | 'trailing', newProps: Object) => void,
      },
    }) => ?React.Element<any>,
    /**
     * For simplicity, data is just a plain array. If you want to use something else, like an
     * immutable list, use the underlying `VirtualizedList` directly.
     */
    data: ?$ReadOnlyArray<ItemT>,
  };
  declare type OptionalFlatListProps<ItemT> = {
    /**
     * Rendered in between each item, but not at the top or bottom. By default, `highlighted` and
     * `leadingItem` props are provided. `renderItem` provides `separators.highlight`/`unhighlight`
     * which will update the `highlighted` prop, but you can also add custom props with
     * `separators.updateProps`.
     */
    ItemSeparatorComponent?: ?ReactClass<any>,
    /**
     * Rendered when the list is empty. Can be a React Component Class, a render function, or
     * a rendered element.
     */
    ListEmptyComponent?: ?(ReactClass<any> | React.Element<any>),
    /**
     * Rendered at the bottom of all the items. Can be a React Component Class, a render function, or
     * a rendered element.
     */
    ListFooterComponent?: ?(ReactClass<any> | React.Element<any>),
    /**
     * Rendered at the top of all the items. Can be a React Component Class, a render function, or
     * a rendered element.
     */
    ListHeaderComponent?: ?(ReactClass<any> | React.Element<any>),
    /**
     * Optional custom style for multi-item rows generated when numColumns > 1.
     */
    columnWrapperStyle?: StyleObj,
    /**
     * A marker property for telling the list to re-render (since it implements `PureComponent`). If
     * any of your `renderItem`, Header, Footer, etc. functions depend on anything outside of the
     * `data` prop, stick it here and treat it immutably.
     */
    extraData?: any,
    /**
     * `getItemLayout` is an optional optimizations that let us skip measurement of dynamic content if
     * you know the height of items a priori. `getItemLayout` is the most efficient, and is easy to
     * use if you have fixed height items, for example:
     *
     *     getItemLayout={(data, index) => (
     *       {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
     *     )}
     *
     * Remember to include separator length (height or width) in your offset calculation if you
     * specify `ItemSeparatorComponent`.
     */
    getItemLayout?: (data: ?Array<ItemT>, index: number) =>
      {length: number, offset: number, index: number},
    /**
     * If true, renders items next to each other horizontally instead of stacked vertically.
     */
    horizontal?: ?boolean,
    /**
     * How many items to render in the initial batch. This should be enough to fill the screen but not
     * much more. Note these items will never be unmounted as part of the windowed rendering in order
     * to improve perceived performance of scroll-to-top actions.
     */
    initialNumToRender: number,
    /**
     * Instead of starting at the top with the first item, start at `initialScrollIndex`. This
     * disables the "scroll to top" optimization that keeps the first `initialNumToRender` items
     * always rendered and immediately renders the items starting at this initial index. Requires
     * `getItemLayout` to be implemented.
     */
    initialScrollIndex?: ?number,
    /**
     * Used to extract a unique key for a given item at the specified index. Key is used for caching
     * and as the react key to track item re-ordering. The default extractor checks `item.key`, then
     * falls back to using the index, like React does.
     */
    keyExtractor: (item: ItemT, index: number) => string,
    /**
     * Multiple columns can only be rendered with `horizontal={false}` and will zig-zag like a
     * `flexWrap` layout. Items should all be the same height - masonry layouts are not supported.
     */
    numColumns: number,
    /**
     * Called once when the scroll position gets within `onEndReachedThreshold` of the rendered
     * content.
     */
    onEndReached?: ?(info: {distanceFromEnd: number}) => void,
    /**
     * How far from the end (in units of visible length of the list) the bottom edge of the
     * list must be from the end of the content to trigger the `onEndReached` callback.
     * Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
     * within half the visible length of the list.
     */
    onEndReachedThreshold?: ?number,
    /**
     * If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make
     * sure to also set the `refreshing` prop correctly.
     */
    onRefresh?: ?() => void,
    /**
     * Called when the viewability of rows changes, as defined by the `viewabilityConfig` prop.
     */
    onViewableItemsChanged?: ?(info: {
      viewableItems: Array<ViewToken>,
      changed: Array<ViewToken>,
    }) => void,
    legacyImplementation?: ?boolean,
    /**
     * Set this true while waiting for new data from a refresh.
     */
    refreshing?: ?boolean,
    /**
     * Note: may have bugs (missing content) in some circumstances - use at your own risk.
     *
     * This may improve scroll performance for large lists.
     */
    removeClippedSubviews?: boolean,
    /**
     * See `ViewabilityHelper` for flow type and further documentation.
     */
    viewabilityConfig?: ViewabilityConfig,
  };

  declare type FlatListProps<ItemT> = {
    ...RequiredProps<ItemT>,
    ...OptionalProps<ItemT>,
    ...VirtualizedListProps,
  };

  declare export class FlatList<ItemT> extends React$Component<void, FlatListProps<ItemT>, void> {
    /**
     * Scrolls to the end of the content. May be janky without `getItemLayout` prop.
     */
    scrollToEnd(params?: ?{animated?: ?boolean}): void,

    /**
     * Scrolls to the item at a the specified index such that it is positioned in the viewable area
     * such that `viewPosition` 0 places it at the top, 1 at the bottom, and 0.5 centered in the
     * middle. `viewOffset` is a fixed number of pixels to offset the final target position.
     *
     * Note: cannot scroll to locations outside the render window without specifying the
     * `getItemLayout` prop.
     */
    scrollToIndex(params: {
      animated?: ?boolean, index: number, viewOffset?: number, viewPosition?: number,
    }): void,

    /**
     * Requires linear scan through data - use `scrollToIndex` instead if possible.
     *
     * Note: cannot scroll to locations outside the render window without specifying the
     * `getItemLayout` prop.
     */
    scrollToItem(params: {animated?: ?boolean, item: ItemT, viewPosition?: number}): void,

    /**
     * Scroll to a specific content pixel offset, like a normal `ScrollView`.
     */
    scrollToOffset(params: {animated?: ?boolean, offset: number}): void,

    /**
     * Tells the list an interaction has occured, which should trigger viewability calculations, e.g.
     * if `waitForInteractions` is true and the user has not scrolled. This is typically called by
     * taps on items or by navigation actions.
     */
    recordInteraction(): void,

    /**
     * Provides a handle to the underlying scroll responder.
     */
    getScrollResponder(): any,

    getScrollableNode(): any,
  }

  declare export var AppState: {|
    ...$Exact<EventEmitter<string>>,
    currentState: ?string,
    isAvailable: boolean,
    /**
     * Add a handler to AppState changes by listening to the `change` event type
     * and providing the handler
     *
     * TODO: now that AppState is a subclass of NativeEventEmitter, we could deprecate
     * `addEventListener` and `removeEventListener` and just use `addListener` and
     * `listener.remove()` directly. That will be a breaking change though, as both
     * the method and event names are different (addListener events are currently
     * required to be globally unique).
     */
    addEventListener(type: string, handler: Function): void,

    /**
     * Remove a handler by passing the `change` event type and the handler
     */
    removeEventListener(type: string, handler: Function): void,
  |}

  declare export var DeviceEventEmitter: {|
    ...$Exact<EventEmitter<string>>,
  |}

  declare export var NativeEventEmitter: {|
    ...$Exact<EventEmitter<string>>,
  |}

  declare export var UIManager: {|
    focus(reactTag: number): void,
    blur(reactTag: number): void,
    dispatchViewManagerCommand(
      reactTag: number,
      commandID,
      commandArgs
    ): void,
    measure(
      reactTag: number,
      callback: MeasureOnSuccessCallback,
    ): void,
    measureLayout(
      reactTag: number,
      relativeTo: number,
      errorCallback: () => void,
      callback: MeasureLayoutOnSuccessCallback,
    ): void,
    measureLayoutRelativeToParent(
      reactTag: number,
      errorCallback: () => void,
      callback: MeasureLayoutOnSuccessCallback
    ): void,
    measureViewsInRect(
      rect: {
        x: number,
        y: number,
        width: number,
        height: number,
      },
      parentView: number,
      errorCallback: () => void,
      callback: MeasureLayoutOnSuccessCallback
    ): void,
  |}

  declare export var Clipboard: {|
    /**
     * Get content of string type, this method returns a `Promise`, so you can use following code to get clipboard content
     * ```javascript
     * async _getContent() {
     *   var content = await Clipboard.getString();
     * }
     * ```
     */
    getString(): Promise<string>,
    /**
     * Set content of string type. You can use following code to set clipboard content
     * ```javascript
     * _setContent() {
     *   Clipboard.setString('hello world');
     * }
     * ```
     * @param the content to be stored in the clipboard.
     */
    setString(content: string): void,
  |}

  declare export var NetInfo: {|
    /**
     * Invokes the listener whenever network status changes.
     * The listener receives one of the connectivity types listed above.
     */
    addEventListener(
      eventName: ChangeEventName,
      handler: Function
    ): {remove: () => void},

    /**
     * Removes the listener for network status changes.
     */
    removeEventListener(
      eventName: ChangeEventName,
      handler: Function
    ): void,

    /**
     * Returns a promise that resolves with one of the connectivity types listed
     * above.
     */
    fetch(): Promise<any>,

    /**
     * An object with the same methods as above but the listener receives a
     * boolean which represents the internet connectivity.
     * Use this if you are only interested with whether the device has internet
     * connectivity.
     */
    isConnected: {
      addEventListener(
        eventName: ChangeEventName,
        handler: Function
      ): {remove: () => void},

      removeEventListener(
        eventName: ChangeEventName,
        handler: Function
      ): void,

      fetch(): Promise<any>,
    },

    isConnectionExpensive(): Promise<boolean>,
  |}

  declare type ComponentInterface = React$Class<any> | {
    name?: string,
    displayName?: string,
    propTypes: Object,
  };

  declare export function requireNativeComponent(
    viewName: string,
    componentInterface?: ?ComponentInterface,
    extraConfig?: ?{nativeOnly?: Object},
  ): ReactClass<any> | string;


  declare type Task = (taskData: any) => Promise<void>;
  declare type TaskProvider = () => Task;
  declare type ComponentProvider = () => React$Class<any>;
  declare type ComponentProviderInstrumentationHook =
    (component: ComponentProvider) => React$Class<any>;
  declare type AppConfig = {
    appKey: string,
    component?: ComponentProvider,
    run?: Function,
    section?: boolean,
  };
  declare type Runnable = {
    component?: ComponentProvider,
    run: Function,
  };
  declare type Runnables = {
    [appKey: string]: Runnable,
  };
  declare type Registry = {
    sections: Array<string>,
    runnables: Runnables,
  };

  declare export var AppRegistry: {|
    registerConfig(config: Array<AppConfig>): void,

    registerComponent(
      appKey: string,
      componentProvider: ComponentProvider,
      section?: boolean,
    ): string,

    registerRunnable(appKey: string, run: Function): string,

    registerSection(appKey: string, component: ComponentProvider): void,

    getAppKeys(): Array<string>,

    getSectionKeys(): Array<string>,

    getSections(): Runnables,

    getRunnable(appKey: string): ?Runnable,

    getRegistry(): Registry,

    setComponentProviderInstrumentationHook(hook: ComponentProviderInstrumentationHook): void,

    runApplication(appKey: string, appParameters: any): void,

    unmountApplicationComponentAtRootTag(rootTag: number): void,

    /**
     * Register a headless task. A headless task is a bit of code that runs without a UI.
     * @param taskKey the key associated with this task
     * @param task    a promise returning function that takes some data passed from the native side as
     *                the only argument; when the promise is resolved or rejected the native side is
     *                notified of this event and it may decide to destroy the JS context.
     */
    registerHeadlessTask(taskKey: string, task: TaskProvider): void,

    /**
     * Only called from native code. Starts a headless task.
     *
     * @param taskId the native id for this task instance to keep track of its execution
     * @param taskKey the key for the task to start
     * @param data the data to pass to the task
     */
    startHeadlessTask(taskId: number, taskKey: string, data: any): void,
  |}

  declare type ShareContent = { title?: string, message: string } | { title?: string, url: string };
  declare type ShareOptions = { dialogTitle?: string, excludeActivityTypes?: Array<string>, tintColor?: string };

  declare export var Share: {|
    /**
     * Open a dialog to share text content.
     *
     * In iOS, Returns a Promise which will be invoked an object containing `action`, `activityType`.
     * If the user dismissed the dialog, the Promise will still be resolved with action being `Share.dismissedAction`
     * and all the other keys being undefined.
     *
     * In Android, Returns a Promise which always be resolved with action being `Share.sharedAction`.
     *
     * ### Content
     *
     *  - `message` - a message to share
     *  - `title` - title of the message
     *
     * #### iOS
     *
     *  - `url` - an URL to share
     *
     * At least one of URL and message is required.
     *
     * ### Options
     *
     * #### iOS
     *
     * - `excludedActivityTypes`
     * - `tintColor`
     *
     * #### Android
     *
     * - `dialogTitle`
     *
     */
    share(content: ShareContent, options: ShareOptions): Promise<Object>,

    /**
     * The content was successfully shared.
     */
    sharedAction: 'sharedAction',

    /**
     * The dialog has been dismissed.
     * @platform ios
     */
    dismissedAction: 'dismissedAction'
  |}

  declare type ActivityIndicatorProps = {
    ...ViewProps,
    /**
     * Whether to show the indicator (true, the default) or hide it (false).
     */
    animating?: boolean,
    /**
     * The foreground color of the spinner (default is gray).
     */
    color?: Color,
    /**
     * Size of the indicator (default is 'small').
     * Passing a number to the size prop is only supported on Android.
     */
    size?: 'small' | 'large' | number,
    /**
     * Whether the indicator should hide when not animating (true by default).
     *
     * @platform ios
     */
    hidesWhenStopped?: boolean,
  }

  declare export class ActivityIndicator extends React$Component<void, ActivityIndicatorProps, void> {
    blur(): void,
    focus(): void,
    measure(callback: MeasureOnSuccessCallback): void,
    measureInWindow(callback: MeasureInWindowOnSuccessCallback): void,
    measureLayout(
      relativeToNativeNode: number,
      onSuccess: MeasureLayoutOnSuccessCallback,
      onFail: () => void,
    ): void,
    setNativeProps(nativeProps: Object): void,
  }

  declare type StatusBarStyle = $Enum<{
    /**
     * Default status bar style (dark for iOS, light for Android)
     */
    'default': string,
    /**
     * Dark background, white texts and icons
     */
    'light-content': string,
    /**
     * Light background, dark texts and icons
     */
    'dark-content': string,
  }>;

  /**
   * Status bar animation
   */
  declare type StatusBarAnimation = $Enum<{
    /**
     * No animation
     */
    'none': string,
    /**
     * Fade animation
     */
    'fade': string,
    /**
     * Slide animation
     */
    'slide': string,
  }>;

  declare type StatusBarProps = {
    hidden?: boolean,
    animated?: boolean,
    backgroundColor?: Color,
    translucent?: boolean,
    barStyle?: StatusBarStyle,
    networkActivityIndicatorVisible?: boolean,
    showHideTransition?: 'fade' | 'slide',
  }

  declare export class StatusBar extends React$Component<void, StatusBarProps, void> {
    static currentHeight: number,

    // Provide an imperative API as static functions of the component.
    // See the corresponding prop for more detail.

    /**
     * Show or hide the status bar
     * @param hidden Hide the status bar.
     * @param animation Optional animation when
     *    changing the status bar hidden property.
     */
    static setHidden(hidden: boolean, animation?: StatusBarAnimation): void,

    /**
     * Set the status bar style
     * @param style Status bar style to set
     * @param animated Animate the style change.
     */
    static setBarStyle(style: StatusBarStyle, animated?: boolean): void,

    /**
     * Control the visibility of the network activity indicator
     * @param visible Show the indicator.
     */
    static setNetworkActivityIndicatorVisible(visible: boolean): void,

    /**
     * Set the background color for the status bar
     * @param color Background color.
     * @param animated Animate the style change.
     */
    static setBackgroundColor(color: string, animated?: boolean): void,

    /**
     * Control the translucency of the status bar
     * @param translucent Set as translucent.
     */
    static setTranslucent(translucent: boolean): void,

  }

  // declare export var View: any;
  // declare export var StyleSheet: any;
  // declare export var Text: any;
  // declare export var Platform: any;
  // declare export var TouchableOpacity: any;
  // declare export var Image: any;
  // declare export var Dimensions: any;
  // declare export var ScrollView: any;
  // declare export var Animated: any; // yes
  // declare export var Alert: any; // yes
  // declare export var TouchableHighlight: any;
  // declare export var ActivityIndicator: any;
  // declare export var TouchableWithoutFeedback: any;
  // declare export var TextInput: any; // yes
  // declare export var PixelRatio: any; // yes
  // declare export var ListView: any; // yes
  // declare export var StatusBar: any;
  // declare export var Linking: any; // yes
  // declare export var Keyboard: any; // yes
  // declare export var LayoutAnimation: any; // yes
  // declare export var AsyncStorage: any; // yes
  // declare export var InteractionManager: any; // yes
  // declare export var Easing: any; // yes
  // declare export var TouchableNativeFeedback: any;
  declare export var Button: any;
  declare export var NativeModules: any;
  declare export var Modal: any;
  declare export var ColorPropType: any;
  // declare export var AppState: any; // yes
  declare export var RefreshControl: any;
  declare export var KeyboardAvoidingView: any;
  declare export var Picker: any;
  declare export var ActionSheetIOS: any;
  declare export var Navigator: any;
  declare export var WebView: any;
  // declare export var FlatList: any; // yes
  // declare export var findNodeHandle: any; // yes
  declare export var Switch: any;
  // declare export var UIManager: any; // yes
  // declare export var Clipboard: any; // yes
  declare export var PanResponder: any; // yes
  // declare export var NetInfo: any; // yes
  declare export var BackAndroid: any;
  // declare export var Share: any; // yes
  declare export var NavigationExperimental: any;
  declare export var CameraRoll: any;
  declare export var Vibration: any;
  declare export var PermissionsAndroid: any;
  declare export var Slider: any;
  declare export var AlertIOS: any;
  // declare export var AppRegistry: any; // yes
  declare export var PushNotificationIOS: any;
  declare export var RenderingPerf: any;
  declare export var Perf: any;
  declare export var ToastAndroid: any;
  declare export var RecyclerViewBackedScrollView: any;
  declare export var SectionList: any;
  declare export var DatePickerIOS: any;
  declare export var ART: any;
  // declare export var requireNativeComponent: any; // yes
  // declare export var DeviceEventEmitter: any; // yes
  declare export var BackHandler: any;
  // declare export var NativeEventEmitter: any; // yes
  declare export var Touchable: any;
  declare export var ProgressViewIOS: any;
  declare export var I18nManager: any;
  declare export var SwipeableListView: any;
  // declare export var processColor: any;
  declare export var VibrationIOS: any;
  declare export var DatePickerAndroid: any;
  declare export var TimePickerAndroid: any;
}
