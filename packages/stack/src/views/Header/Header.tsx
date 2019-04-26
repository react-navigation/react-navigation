import * as React from 'react';

import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  View,
  I18nManager,
  MaskedViewIOS,
  ViewStyle,
  LayoutChangeEvent,
  StyleProp,
} from 'react-native';

import { withOrientation, SafeAreaView } from '@react-navigation/native';

import HeaderTitle from './HeaderTitle';
import HeaderBackButton from './HeaderBackButton';
import ModularHeaderBackButton from './ModularHeaderBackButton';
import HeaderStyleInterpolator from './HeaderStyleInterpolator';
import {
  Scene,
  HeaderLayoutPreset,
  SceneInterpolatorProps,
  HeaderProps,
} from '../../types';

type Props = HeaderProps & {
  leftLabelInterpolator: (props: SceneInterpolatorProps) => any;
  leftButtonInterpolator: (props: SceneInterpolatorProps) => any;
  titleFromLeftInterpolator: (props: SceneInterpolatorProps) => any;
  layoutInterpolator: (props: SceneInterpolatorProps) => any;
};

type SubviewProps = {
  position: Animated.AnimatedInterpolation;
  scene: Scene;
  style?: StyleProp<ViewStyle>;
};

type SubviewName = 'left' | 'right' | 'title' | 'background';

type State = {
  widths: { [key: string]: number };
};

const APPBAR_HEIGHT = Platform.select({
  ios: 44,
  android: 56,
  default: 64,
});
const STATUSBAR_HEIGHT = Platform.select({
  ios: 20,
  default: 0,
});

// These can be adjusted by using headerTitleContainerStyle on navigationOptions
const TITLE_OFFSET_CENTER_ALIGN = Platform.select({
  ios: 70,
  default: 56,
});

const TITLE_OFFSET_LEFT_ALIGN = Platform.select({
  ios: 20,
  android: 56,
  default: 64,
});

const getTitleOffsets = (
  layoutPreset: HeaderLayoutPreset,
  hasLeftComponent: boolean,
  hasRightComponent: boolean
): ViewStyle | undefined => {
  if (layoutPreset === 'left') {
    // Maybe at some point we should do something different if the back title is
    // explicitly enabled, for now people can control it manually

    let style = {
      left: TITLE_OFFSET_LEFT_ALIGN,
      right: TITLE_OFFSET_LEFT_ALIGN,
    };

    if (!hasLeftComponent) {
      style.left = Platform.OS === 'web' ? 16 : 0;
    }
    if (!hasRightComponent) {
      style.right = 0;
    }

    return style;
  } else if (layoutPreset === 'center') {
    let style = {
      left: TITLE_OFFSET_CENTER_ALIGN,
      right: TITLE_OFFSET_CENTER_ALIGN,
    };
    if (!hasLeftComponent && !hasRightComponent) {
      style.left = 0;
      style.right = 0;
    }

    return style;
  }

  return undefined;
};

const getAppBarHeight = (isLandscape: boolean) => {
  if (Platform.OS === 'ios') {
    // @ts-ignore
    if (isLandscape && !Platform.isPad) {
      return 32;
    } else {
      return 44;
    }
  } else if (Platform.OS === 'android') {
    return 56;
  } else {
    return 64;
  }
};

class Header extends React.PureComponent<Props, State> {
  static get HEIGHT() {
    return APPBAR_HEIGHT + STATUSBAR_HEIGHT;
  }

  static defaultProps = {
    layoutInterpolator: HeaderStyleInterpolator.forLayout,
    leftInterpolator: HeaderStyleInterpolator.forLeft,
    leftButtonInterpolator: HeaderStyleInterpolator.forLeftButton,
    leftLabelInterpolator: HeaderStyleInterpolator.forLeftLabel,
    titleFromLeftInterpolator: HeaderStyleInterpolator.forCenterFromLeft,
    titleInterpolator: HeaderStyleInterpolator.forCenter,
    rightInterpolator: HeaderStyleInterpolator.forRight,
    backgroundInterpolator: HeaderStyleInterpolator.forBackground,
  };

  state: State = {
    widths: {},
  };

  private getHeaderTitleString(scene: Scene) {
    const options = scene.descriptor.options;
    if (typeof options.headerTitle === 'string') {
      return options.headerTitle;
    }

    if (options.title && typeof options.title !== 'string' && __DEV__) {
      throw new Error(
        `Invalid title for route "${
          scene.route.routeName
        }" - title must be string or null, instead it was of type ${typeof options.title}`
      );
    }

    return options.title;
  }

  private getLastScene(scene: Scene) {
    return this.props.scenes.find(s => s.index === scene.index - 1);
  }

  private getBackButtonTitleString(scene: Scene) {
    const lastScene = this.getLastScene(scene);
    if (!lastScene) {
      return null;
    }
    const { headerBackTitle } = lastScene.descriptor.options;
    if (headerBackTitle || headerBackTitle === null) {
      return headerBackTitle;
    }
    return this.getHeaderTitleString(lastScene);
  }

  private getTruncatedBackButtonTitle(scene: Scene) {
    const lastScene = this.getLastScene(scene);
    if (!lastScene) {
      return null;
    }
    return lastScene.descriptor.options.headerTruncatedBackTitle;
  }

  private renderTitleComponent = (props: SubviewProps) => {
    const { layoutPreset } = this.props;
    const { options } = props.scene.descriptor;
    const headerTitle = options.headerTitle;
    if (React.isValidElement(headerTitle)) {
      return headerTitle;
    }
    const titleString = this.getHeaderTitleString(props.scene);

    const titleStyle = options.headerTitleStyle;
    const color = options.headerTintColor;
    const allowFontScaling = options.headerTitleAllowFontScaling;

    // When title is centered, the width of left/right components depends on the
    // calculated size of the title.
    const onLayout =
      layoutPreset === 'center'
        ? (e: LayoutChangeEvent) => {
            const { width } = e.nativeEvent.layout;

            this.setState(state => ({
              widths: {
                ...state.widths,
                [props.scene.key]: width,
              },
            }));
          }
        : undefined;

    const HeaderTitleComponent =
      headerTitle && typeof headerTitle !== 'string'
        ? headerTitle
        : HeaderTitle;
    return (
      <HeaderTitleComponent
        onLayout={onLayout}
        allowFontScaling={!!allowFontScaling}
        style={[
          color ? { color } : null,
          layoutPreset === 'center'
            ? // eslint-disable-next-line react-native/no-inline-styles
              { textAlign: 'center' }
            : // eslint-disable-next-line react-native/no-inline-styles
              { textAlign: 'left' },
          titleStyle,
        ]}
      >
        {titleString}
      </HeaderTitleComponent>
    );
  };

  private renderLeftComponent = (props: SubviewProps) => {
    const { options } = props.scene.descriptor;
    if (
      React.isValidElement(options.headerLeft) ||
      options.headerLeft === null
    ) {
      return options.headerLeft;
    }

    if (!options.headerLeft && props.scene.index === 0) {
      return;
    }

    const backButtonTitle = this.getBackButtonTitleString(props.scene);
    const truncatedBackButtonTitle = this.getTruncatedBackButtonTitle(
      props.scene
    );
    const width = this.state.widths[props.scene.key]
      ? (this.props.layout.initWidth - this.state.widths[props.scene.key]) / 2
      : undefined;
    const RenderedLeftComponent = options.headerLeft || HeaderBackButton;
    const goBack = () => {
      // Go back on next tick because button ripple effect needs to happen on Android
      requestAnimationFrame(() => {
        props.scene.descriptor.navigation.goBack(props.scene.descriptor.key);
      });
    };
    return (
      <RenderedLeftComponent
        onPress={goBack}
        pressColorAndroid={options.headerPressColorAndroid}
        tintColor={options.headerTintColor}
        backImage={options.headerBackImage}
        title={backButtonTitle}
        truncatedTitle={truncatedBackButtonTitle}
        backTitleVisible={this.props.backTitleVisible}
        allowFontScaling={options.headerBackAllowFontScaling}
        titleStyle={options.headerBackTitleStyle}
        layoutPreset={this.props.layoutPreset}
        width={width}
        scene={props.scene}
      />
    );
  };

  private renderModularLeftComponent = (
    props: SubviewProps,
    ButtonContainerComponent: React.ComponentProps<
      typeof ModularHeaderBackButton
    >['ButtonContainerComponent'],
    LabelContainerComponent: React.ComponentProps<
      typeof ModularHeaderBackButton
    >['LabelContainerComponent']
  ) => {
    const { options, navigation } = props.scene.descriptor;
    const backButtonTitle = this.getBackButtonTitleString(props.scene);
    const truncatedBackButtonTitle = this.getTruncatedBackButtonTitle(
      props.scene
    );
    const width = this.state.widths[props.scene.key]
      ? (this.props.layout.initWidth - this.state.widths[props.scene.key]) / 2
      : undefined;

    const goBack = () => {
      // Go back on next tick because button ripple effect needs to happen on Android
      requestAnimationFrame(() => {
        navigation.goBack(props.scene.descriptor.key);
      });
    };

    return (
      <ModularHeaderBackButton
        onPress={goBack}
        ButtonContainerComponent={ButtonContainerComponent}
        LabelContainerComponent={LabelContainerComponent}
        backTitleVisible={this.props.backTitleVisible}
        pressColorAndroid={options.headerPressColorAndroid}
        tintColor={options.headerTintColor}
        backImage={options.headerBackImage}
        title={backButtonTitle}
        truncatedTitle={truncatedBackButtonTitle}
        titleStyle={options.headerBackTitleStyle}
        layoutPreset={this.props.layoutPreset}
        width={width}
        scene={props.scene}
      />
    );
  };

  private renderRightComponent = (props: SubviewProps) => {
    const { headerRight } = props.scene.descriptor.options;
    return headerRight || null;
  };

  private renderLeft = (props: SubviewProps) => {
    const { options } = props.scene.descriptor;

    const { transitionPreset } = this.props;

    let { style } = props;
    if (options.headerLeftContainerStyle) {
      style = [style, options.headerLeftContainerStyle];
    }

    // On Android, or if we have a custom header left, or if we have a custom back image, we
    // do not use the modular header (which is the one that imitates UINavigationController)
    if (
      transitionPreset !== 'uikit' ||
      options.headerBackImage ||
      options.headerLeft ||
      options.headerLeft === null
    ) {
      return this.renderSubView(
        { ...props, style },
        'left',
        this.renderLeftComponent,
        this.props.leftInterpolator
      );
    } else {
      return this.renderModularSubView(
        { ...props, style },
        'left',
        this.renderModularLeftComponent,
        this.props.leftLabelInterpolator,
        this.props.leftButtonInterpolator
      );
    }
  };

  private renderTitle = (
    props: SubviewProps,
    options: {
      hasLeftComponent: boolean;
      hasRightComponent: boolean;
      headerTitleContainerStyle: StyleProp<ViewStyle>;
    }
  ) => {
    const { layoutPreset, transitionPreset } = this.props;
    let style: StyleProp<ViewStyle> = [
      { justifyContent: layoutPreset === 'center' ? 'center' : 'flex-start' },
      getTitleOffsets(
        layoutPreset,
        options.hasLeftComponent,
        options.hasRightComponent
      ),
      options.headerTitleContainerStyle,
    ];

    return this.renderSubView(
      { ...props, style },
      'title',
      this.renderTitleComponent,
      transitionPreset === 'uikit'
        ? this.props.titleFromLeftInterpolator
        : this.props.titleInterpolator
    );
  };

  private renderRight = (props: SubviewProps) => {
    const { options } = props.scene.descriptor;

    let { style } = props;
    if (options.headerRightContainerStyle) {
      style = [style, options.headerRightContainerStyle];
    }

    return this.renderSubView(
      { ...props, style },
      'right',
      this.renderRightComponent,
      this.props.rightInterpolator
    );
  };

  private renderBackground = (props: SubviewProps) => {
    const {
      index,
      descriptor: { options },
    } = props.scene;

    const offset = this.props.navigation.state.index - index;

    if (Math.abs(offset) > 2) {
      // Scene is far away from the active scene. Hides it to avoid unnecessary
      // rendering.
      return null;
    }

    return this.renderSubView(
      { ...props, style: StyleSheet.absoluteFill },
      'background',
      () => options.headerBackground,
      this.props.backgroundInterpolator
    );
  };

  private renderModularSubView = (
    props: SubviewProps,
    name: SubviewName,
    renderer: (
      props: SubviewProps,
      ButtonContainerComponent: React.ComponentProps<
        typeof ModularHeaderBackButton
      >['ButtonContainerComponent'],
      LabelContainerComponent: React.ComponentProps<
        typeof ModularHeaderBackButton
      >['LabelContainerComponent']
    ) => React.ReactNode,
    labelStyleInterpolator: (props: SceneInterpolatorProps) => any,
    buttonStyleInterpolator: (props: SceneInterpolatorProps) => any
  ) => {
    const { scene } = props;
    const { index, isStale, key } = scene;

    // Never render a modular back button on the first screen in a stack.
    if (index === 0) {
      return;
    }

    const offset = this.props.navigation.state.index - index;

    if (Math.abs(offset) > 2) {
      // Scene is far away from the active scene. Hides it to avoid unnecessary
      // rendering.
      return null;
    }

    const ButtonContainer = ({ children }: { children: React.ReactNode }) => (
      <Animated.View
        style={[buttonStyleInterpolator({ ...this.props, ...props })]}
      >
        {children}
      </Animated.View>
    );

    const LabelContainer = ({ children }: { children: React.ReactNode }) => (
      <Animated.View
        style={[labelStyleInterpolator({ ...this.props, ...props })]}
      >
        {children}
      </Animated.View>
    );

    const subView = renderer(
      props,
      ButtonContainer as any,
      LabelContainer as any
    );

    if (subView === null) {
      return subView;
    }

    const pointerEvents = offset !== 0 || isStale ? 'none' : 'box-none';

    return (
      <View
        key={`${name}_${key}`}
        pointerEvents={pointerEvents}
        style={[styles.item, styles[name], props.style]}
      >
        {subView}
      </View>
    );
  };

  private renderSubView = (
    props: SubviewProps,
    name: SubviewName,
    renderer: (props: SubviewProps) => React.ReactNode,
    styleInterpolator: (props: SceneInterpolatorProps) => any
  ) => {
    const { scene } = props;
    const { index, isStale, key } = scene;

    const offset = this.props.navigation.state.index - index;

    if (Math.abs(offset) > 2) {
      // Scene is far away from the active scene. Hides it to avoid unnecessary
      // rendering.
      return null;
    }

    const subView = renderer(props);

    if (subView == null) {
      return null;
    }

    const pointerEvents = offset !== 0 || isStale ? 'none' : 'box-none';

    return (
      <Animated.View
        pointerEvents={pointerEvents}
        key={`${name}_${key}`}
        style={[
          styles.item,
          styles[name],
          props.style,
          styleInterpolator({
            ...this.props,
            ...props,
          }),
        ]}
      >
        {subView}
      </Animated.View>
    );
  };

  private renderHeader = (props: SubviewProps) => {
    const { options } = props.scene.descriptor;
    if (options.header === null) {
      return null;
    }
    const left = this.renderLeft(props);
    const right = this.renderRight(props);
    const title = this.renderTitle(props, {
      hasLeftComponent: !!left,
      hasRightComponent: !!right,
      headerTitleContainerStyle: options.headerTitleContainerStyle,
    });

    const { transitionPreset } = this.props;

    const wrapperProps = {
      style: styles.header,
      key: `scene_${props.scene.key}`,
    };

    if (
      options.headerLeft ||
      options.headerBackImage ||
      Platform.OS !== 'ios' ||
      transitionPreset !== 'uikit'
    ) {
      return (
        <View {...wrapperProps}>
          {title}
          {left}
          {right}
        </View>
      );
    } else {
      return (
        <MaskedViewIOS
          {...wrapperProps}
          maskElement={
            <View style={styles.iconMaskContainer}>
              <Image
                source={require('../assets/back-icon-mask.png')}
                style={styles.iconMask}
              />
              <View style={styles.iconMaskFillerRect} />
            </View>
          }
        >
          {title}
          {left}
          {right}
        </MaskedViewIOS>
      );
    }
  };

  render() {
    let appBar;
    let background;
    const { mode, scene, isLandscape } = this.props;

    if (mode === 'float') {
      const scenesByIndex: { [key: string]: Scene } = {};
      this.props.scenes.forEach(scene => {
        scenesByIndex[scene.index] = scene;
      });
      const scenesProps = Object.values(scenesByIndex).map(scene => ({
        position: this.props.position,
        scene,
      }));
      appBar = scenesProps.map(props => this.renderHeader(props));
      background = scenesProps.map(props => this.renderBackground(props));
    } else {
      const headerProps = {
        position: new Animated.Value(this.props.scene.index),
        scene: this.props.scene,
      };

      appBar = this.renderHeader(headerProps);
      background = this.renderBackground(headerProps);
    }

    const { options } = scene.descriptor;
    const { headerStyle = {} } = options;
    const headerStyleObj = StyleSheet.flatten(headerStyle) as ViewStyle;
    const appBarHeight = getAppBarHeight(isLandscape);

    const {
      alignItems,
      justifyContent,
      flex,
      flexDirection,
      flexGrow,
      flexShrink,
      flexBasis,
      flexWrap,
      position,
      padding,
      paddingHorizontal,
      paddingRight,
      paddingLeft,
      // paddingVertical,
      // paddingTop,
      // paddingBottom,
      top,
      right,
      bottom,
      left,
      ...safeHeaderStyle
    } = headerStyleObj;

    if (__DEV__) {
      warnIfHeaderStyleDefined(alignItems, 'alignItems');
      warnIfHeaderStyleDefined(justifyContent, 'justifyContent');
      warnIfHeaderStyleDefined(flex, 'flex');
      warnIfHeaderStyleDefined(flexDirection, 'flexDirection');
      warnIfHeaderStyleDefined(flexGrow, 'flexGrow');
      warnIfHeaderStyleDefined(flexShrink, 'flexShrink');
      warnIfHeaderStyleDefined(flexBasis, 'flexBasis');
      warnIfHeaderStyleDefined(flexWrap, 'flexWrap');
      warnIfHeaderStyleDefined(padding, 'padding');
      warnIfHeaderStyleDefined(position, 'position');
      warnIfHeaderStyleDefined(paddingHorizontal, 'paddingHorizontal');
      warnIfHeaderStyleDefined(paddingRight, 'paddingRight');
      warnIfHeaderStyleDefined(paddingLeft, 'paddingLeft');
      // warnIfHeaderStyleDefined(paddingVertical, 'paddingVertical');
      // warnIfHeaderStyleDefined(paddingTop, 'paddingTop');
      // warnIfHeaderStyleDefined(paddingBottom, 'paddingBottom');
      warnIfHeaderStyleDefined(top, 'top');
      warnIfHeaderStyleDefined(right, 'right');
      warnIfHeaderStyleDefined(bottom, 'bottom');
      warnIfHeaderStyleDefined(left, 'left');
    }

    // TODO: warn if any unsafe styles are provided
    const containerStyles = [
      options.headerTransparent
        ? styles.transparentContainer
        : styles.container,
      { height: appBarHeight },
      safeHeaderStyle,
    ];

    const { headerForceInset } = options;
    const forceInset = headerForceInset || {
      top: 'always',
      bottom: 'never',
      horizontal: 'always',
    };

    return (
      <Animated.View
        style={[
          this.props.layoutInterpolator(this.props),
          Platform.OS === 'ios' && !options.headerTransparent
            ? {
                backgroundColor:
                  safeHeaderStyle.backgroundColor || DEFAULT_BACKGROUND_COLOR,
              }
            : null,
        ]}
      >
        <SafeAreaView forceInset={forceInset} style={containerStyles}>
          {background}
          <View style={styles.flexOne}>{appBar}</View>
        </SafeAreaView>
      </Animated.View>
    );
  }
}

function warnIfHeaderStyleDefined(value: any, styleProp: string) {
  if (styleProp === 'position' && value === 'absolute') {
    console.warn(
      "position: 'absolute' is not supported on headerStyle. If you would like to render content under the header, use the headerTransparent navigationOption."
    );
  } else if (value !== undefined) {
    console.warn(
      `${styleProp} was given a value of ${value}, this has no effect on headerStyle.`
    );
  }
}

const platformContainerStyles = Platform.select({
  android: {
    elevation: 4,
  },
  ios: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#A7A7AA',
  },
  default: {
    // https://github.com/necolas/react-native-web/issues/44
    // Material Design
    boxShadow: `0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)`,
  },
});

const DEFAULT_BACKGROUND_COLOR = '#FFF';

const styles = StyleSheet.create({
  container: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    ...platformContainerStyles,
  },
  transparentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    ...platformContainerStyles,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    elevation: 0,
  },
  header: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  item: {
    backgroundColor: 'transparent',
  },
  iconMaskContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconMaskFillerRect: {
    flex: 1,
    backgroundColor: '#d8d8d8',
    marginLeft: -5,
  },
  iconMask: {
    // These are mostly the same as the icon in ModularHeaderBackButton
    height: 23,
    width: 14.5,
    marginLeft: 8.5,
    marginTop: -2.5,
    alignSelf: 'center',
    resizeMode: 'contain',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  // eslint-disable-next-line react-native/no-unused-styles
  background: {},
  // eslint-disable-next-line react-native/no-unused-styles
  title: {
    bottom: 0,
    top: 0,
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  left: {
    left: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  right: {
    right: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexOne: {
    flex: 1,
  },
});

export default withOrientation(Header);
