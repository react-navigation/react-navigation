// Project: https://github.com/kmagiera/react-native-screens
// TypeScript Version: 2.8

declare module 'react-native-screens' {
  import { ComponentClass } from 'react';
  import {
    ViewProps,
    Animated,
    NativeSyntheticEvent,
    NativeTouchEvent,
    ImageProps,
  } from 'react-native';

  export function useScreens(shouldUseScreens?: boolean): void;
  export function enableScreens(shouldEnableScreens?: boolean): void;
  export function screensEnabled(): boolean;

  export type StackPresentationTypes = 'push' | 'modal' | 'transparentModal';
  export type StackAnimationTypes = 'default' | 'fade' | 'flip' | 'none';

  export interface ScreenProps extends ViewProps {
    active?: 0 | 1 | Animated.AnimatedInterpolation;
    onComponentRef?: (view: any) => void;
    children?: React.ReactNode;
    onAppear?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
    /**
     *@description A callback that gets called when the current screen is dismissed by hardware back (on Android) or dismiss gesture (swipe back or down). The callback takes no arguments.
     */
    onDismissed?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
    /**
     * @type "push" – the new screen will be pushed onto a stack which on iOS means that the default animation will be slide from the side, the animation on Android may vary depending on the OS version and theme.
     * @type "modal" – the new screen will be presented modally. In addition this allow for a nested stack to be rendered inside such screens
     * @type "transparentModal" – the new screen will be presented modally but in addition the second to last screen will remain attached to the stack container such that if the top screen is non opaque the content below can still be seen. If "modal" is used instead the below screen will get unmounted as soon as the transition ends.
     */
    stackPresentation: StackPresentationTypes;
    /**
     *@description Allows for the customization of how the given screen should appear/dissapear when pushed or popped at the top of the stack. The followin values are currently supported:
     *  @type "default" – uses a platform default animation
     *  @type "fade" – fades screen in or out
     *  @type "flip" – flips the screen, requires stackPresentation: "modal" (iOS only)
     *  @type "none" – the screen appears/dissapears without an animation
     */
    stackAnimation?: StackAnimationTypes;
    /**
     * @description When set to false the back swipe gesture will be disabled when the parent Screen is on top of the stack. The default value is true.
     */
    gestureEnabled?: boolean;
  }

  export type ScreenContainerProps = ViewProps;

  export interface ScreenStackProps extends ViewProps {
    transitioning?: number;
    progress?: number;
  }

  export interface ScreenStackHeaderConfigProps extends ViewProps {
    /**
     *@description String that representing screen title that will get rendered in the middle section of the header. On iOS the title is centered on the header while on Android it is aligned to the left and placed next to back button (if one is present).
     */
    title?: string;
    /**
     *@description When set to true the header will be hidden while the parent Screen is on the top of the stack. The default value is false.
     */
    hidden?: boolean;
    /**
     *@description Controls the color of items rendered on the header. This includes back icon, back text (iOS only) and title text. If you want the title to have different color use titleColor property.
     */
    color?: string;
    /**
     *@description Customize font family to be used for the title.
     */
    titleFontFamily?: string;
    /**
     *@description Customize the size of the font to be used for the title.
     */
    titleFontSize?: number;
    /**
     *@description Allows for setting text color of the title.
     */
    titleColor?: string;
    /**
     *@description Controlls the color of the navigation header.
     */
    backgroundColor?: string;
    /**
     * @description Boolean that allows for disabling drop shadow under navigation header. The default value is true.
     */
    hideShadow?: boolean;
    /**
     * @description If set to true the back button will not be rendered as a part of navigation header.
     */
    hideBackButton?: boolean;
    /**
     * @host (iOS only)
     * @description When set to true, it makes native navigation bar on iOS semi transparent with blur effect. It is a common way of presenting navigation bar introduced in iOS 11. The default value is false
     */
    translucent?: boolean;
    /**
     * @host (iOS only)
     * @description Allows for controlling the string to be rendered next to back button. By default iOS uses the title of the previous screen.
     */
    backTitle?: string;
    /**
     * @host (iOS only)
     * @description Allows for customizing font family to be used for back button title on iOS.
     */
    backTitleFontFamily?: string;
    /**
     * @host (iOS only)
     * @description Allows for customizing font size to be used for back button title on iOS.
     */
    backTitleFontSize?: number;
    /**
     * @host (iOS only)
     * @description When set to true it makes the title display using the large title effect.
     */
    largeTitle?: boolean;
    /**
     * @host (iOS only)
     * @description Customize font family to be used for the large title.
     */
    largeTitleFontFamily?: string;
    /**
     * @host (iOS only)
     * @description Customize the size of the font to be used for the large title.
     */
    largeTitleFontSize?: number;
    /**
     * Pass HeaderLeft, HeaderRight and HeaderTitle
     */
    children?: React.ReactNode;
  }

  export const Screen: ComponentClass<ScreenProps>;
  export const ScreenContainer: ComponentClass<ScreenContainerProps>;
  export const NativeScreen: ComponentClass<ScreenProps>;
  export const NativeScreenContainer: ComponentClass<ScreenContainerProps>;
  export const ScreenStack: ComponentClass<ScreenStackProps>;
  export const ScreenStackHeaderBackButtonImage: ComponentClass<ImageProps>;
  export const ScreenStackHeaderLeftView: ComponentClass<ViewProps>;
  export const ScreenStackHeaderRightView: ComponentClass<ViewProps>;
  export const ScreenStackHeaderConfig: ComponentClass<
    ScreenStackHeaderConfigProps
  >;
}
