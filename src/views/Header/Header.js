import React from 'react';

import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  View,
  I18nManager,
  ViewPropTypes,
  MaskedViewIOS,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import HeaderTitle from './HeaderTitle';
import HeaderBackButton from './HeaderBackButton';
import ModularHeaderBackButton from './ModularHeaderBackButton';
import HeaderStyleInterpolator from './HeaderStyleInterpolator';
import withOrientation from '../withOrientation';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

// These can be adjusted by using headerTitleContainerStyle on navigationOptions
const TITLE_OFFSET_CENTER_ALIGN = Platform.OS === 'ios' ? 70 : 56;
const TITLE_OFFSET_LEFT_ALIGN = Platform.OS === 'ios' ? 20 : 56;

const getTitleOffsets = (
  layoutPreset,
  forceBackTitle,
  hasLeftComponent,
  hasRightComponent
) => {
  if (layoutPreset === 'left') {
    // Maybe at some point we should do something different if the back title is
    // explicitly enabled, for now people can control it manually

    let style = {
      left: TITLE_OFFSET_LEFT_ALIGN,
      right: TITLE_OFFSET_LEFT_ALIGN,
    };

    if (!hasLeftComponent) {
      style.left = 0;
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
};

const getAppBarHeight = isLandscape => {
  return Platform.OS === 'ios'
    ? isLandscape && !Platform.isPad
      ? 32
      : 44
    : 56;
};

class Header extends React.PureComponent {
  static defaultProps = {
    layoutInterpolator: HeaderStyleInterpolator.forLayout,
    leftInterpolator: HeaderStyleInterpolator.forLeft,
    leftButtonInterpolator: HeaderStyleInterpolator.forLeftButton,
    leftLabelInterpolator: HeaderStyleInterpolator.forLeftLabel,
    titleFromLeftInterpolator: HeaderStyleInterpolator.forCenterFromLeft,
    titleInterpolator: HeaderStyleInterpolator.forCenter,
    rightInterpolator: HeaderStyleInterpolator.forRight,
  };

  static get HEIGHT() {
    return APPBAR_HEIGHT + STATUSBAR_HEIGHT;
  }

  state = {
    widths: {},
  };

  _getHeaderTitleString(scene) {
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

  _getLastScene(scene) {
    return this.props.scenes.find(s => s.index === scene.index - 1);
  }

  _getBackButtonTitleString(scene) {
    const lastScene = this._getLastScene(scene);
    if (!lastScene) {
      return null;
    }
    const { headerBackTitle } = lastScene.descriptor.options;
    if (headerBackTitle || headerBackTitle === null) {
      return headerBackTitle;
    }
    return this._getHeaderTitleString(lastScene);
  }

  _getTruncatedBackButtonTitle(scene) {
    const lastScene = this._getLastScene(scene);
    if (!lastScene) {
      return null;
    }
    return lastScene.descriptor.options.headerTruncatedBackTitle;
  }

  _renderTitleComponent = props => {
    const { layoutPreset } = this.props;
    const { options } = props.scene.descriptor;
    const headerTitle = options.headerTitle;
    if (React.isValidElement(headerTitle)) {
      return headerTitle;
    }
    const titleString = this._getHeaderTitleString(props.scene);

    const titleStyle = options.headerTitleStyle;
    const color = options.headerTintColor;
    const allowFontScaling = options.headerTitleAllowFontScaling;

    // When title is centered, the width of left/right components depends on the
    // calculated size of the title.
    const onLayout =
      layoutPreset === 'center'
        ? e => {
            this.setState({
              widths: {
                ...this.state.widths,
                [props.scene.key]: e.nativeEvent.layout.width,
              },
            });
          }
        : undefined;

    const HeaderTitleComponent =
      headerTitle && typeof headerTitle !== 'string'
        ? headerTitle
        : HeaderTitle;
    return (
      <HeaderTitleComponent
        onLayout={onLayout}
        allowFontScaling={allowFontScaling == null ? true : allowFontScaling}
        style={[
          color ? { color } : null,
          layoutPreset === 'center'
            ? { textAlign: 'center' }
            : { textAlign: 'left' },
          titleStyle,
        ]}
      >
        {titleString}
      </HeaderTitleComponent>
    );
  };

  _renderLeftComponent = props => {
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

    const backButtonTitle = this._getBackButtonTitleString(props.scene);
    const truncatedBackButtonTitle = this._getTruncatedBackButtonTitle(
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
        titleStyle={options.headerBackTitleStyle}
        layoutPreset={this.props.layoutPreset}
        width={width}
      />
    );
  };

  _renderModularLeftComponent = (
    props,
    ButtonContainerComponent,
    LabelContainerComponent
  ) => {
    const { options, navigation } = props.scene.descriptor;
    const backButtonTitle = this._getBackButtonTitleString(props.scene);
    const truncatedBackButtonTitle = this._getTruncatedBackButtonTitle(
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
        pressColorAndroid={options.headerPressColorAndroid}
        tintColor={options.headerTintColor}
        backImage={options.headerBackImage}
        title={backButtonTitle}
        truncatedTitle={truncatedBackButtonTitle}
        titleStyle={options.headerBackTitleStyle}
        width={width}
      />
    );
  };

  _renderRightComponent = props => {
    const { headerRight } = props.scene.descriptor.options;
    return headerRight || null;
  };

  _renderLeft(props) {
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
      return this._renderSubView(
        { ...props, style },
        'left',
        this._renderLeftComponent,
        this.props.leftInterpolator
      );
    } else {
      return this._renderModularSubView(
        { ...props, style },
        'left',
        this._renderModularLeftComponent,
        this.props.leftLabelInterpolator,
        this.props.leftButtonInterpolator
      );
    }
  }

  _renderTitle(props, options) {
    const { layoutPreset, transitionPreset } = this.props;
    let style = [
      { justifyContent: layoutPreset === 'center' ? 'center' : 'flex-start' },
      getTitleOffsets(
        layoutPreset,
        false,
        options.hasLeftComponent,
        options.hasRightComponent
      ),
      options.headerTitleContainerStyle,
    ];

    return this._renderSubView(
      { ...props, style },
      'title',
      this._renderTitleComponent,
      transitionPreset === 'uikit'
        ? this.props.titleFromLeftInterpolator
        : this.props.titleInterpolator
    );
  }

  _renderRight(props) {
    const { options } = props.scene.descriptor;

    let { style } = props;
    if (options.headerRightContainerStyle) {
      style = [style, options.headerRightContainerStyle];
    }

    return this._renderSubView(
      { ...props, style },
      'right',
      this._renderRightComponent,
      this.props.rightInterpolator
    );
  }

  _renderModularSubView(
    props,
    name,
    renderer,
    labelStyleInterpolator,
    buttonStyleInterpolator
  ) {
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

    const ButtonContainer = ({ children }) => (
      <Animated.View
        style={[buttonStyleInterpolator({ ...this.props, ...props })]}
      >
        {children}
      </Animated.View>
    );

    const LabelContainer = ({ children }) => (
      <Animated.View
        style={[labelStyleInterpolator({ ...this.props, ...props })]}
      >
        {children}
      </Animated.View>
    );

    const subView = renderer(props, ButtonContainer, LabelContainer);

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
  }

  _renderSubView(props, name, renderer, styleInterpolator) {
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
  }

  _renderHeader(props) {
    const { options } = props.scene.descriptor;
    if (options.header === null) {
      return null;
    }
    const left = this._renderLeft(props);
    const right = this._renderRight(props);
    const title = this._renderTitle(props, {
      hasLeftComponent: !!left,
      hasRightComponent: !!right,
      headerTitleContainerStyle: options.headerTitleContainerStyle,
    });

    const { isLandscape, transitionPreset } = this.props;

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
  }

  render() {
    let appBar;
    const { mode, scene, isLandscape } = this.props;

    if (mode === 'float') {
      const scenesByIndex = {};
      this.props.scenes.forEach(scene => {
        scenesByIndex[scene.index] = scene;
      });
      const scenesProps = Object.values(scenesByIndex).map(scene => ({
        position: this.props.position,
        progress: this.props.progress,
        scene,
      }));
      appBar = scenesProps.map(this._renderHeader, this);
    } else {
      appBar = this._renderHeader({
        position: new Animated.Value(this.props.scene.index),
        progress: new Animated.Value(0),
        scene: this.props.scene,
      });
    }

    const { options } = scene.descriptor;
    const { headerStyle = {} } = options;
    const headerStyleObj = StyleSheet.flatten(headerStyle);
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
    const forceInset = headerForceInset || { top: 'always', bottom: 'never' };

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
          <View style={StyleSheet.absoluteFill}>
            {options.headerBackground}
          </View>
          <View style={styles.flexOne}>{appBar}</View>
        </SafeAreaView>
      </Animated.View>
    );
  }
}

function warnIfHeaderStyleDefined(value, styleProp) {
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

let platformContainerStyles;
if (Platform.OS === 'ios') {
  platformContainerStyles = {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#A7A7AA',
  };
} else {
  platformContainerStyles = {
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4,
  };
}

const DEFAULT_BACKGROUND_COLOR = Platform.OS === 'ios' ? '#F7F7F7' : '#FFF';

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
    marginLeft: -3,
  },
  iconMask: {
    // These are mostly the same as the icon in ModularHeaderBackButton
    height: 21,
    width: 12,
    marginLeft: 9,
    marginTop: -0.5, // resizes down to 20.5
    alignSelf: 'center',
    resizeMode: 'contain',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  title: {
    bottom: 0,
    top: 0,
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
  },
  left: {
    left: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
  },
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
