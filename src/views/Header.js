/* @flow */

'no babel-plugin-flow-react-proptypes';

import React from 'react';

import { Animated, Platform, StyleSheet, View } from 'react-native';

import HeaderTitle from './HeaderTitle';
import HeaderBackButton from './HeaderBackButton';
import HeaderStyleInterpolator from './HeaderStyleInterpolator';

import type {
  NavigationScene,
  NavigationStyleInterpolator,
  LayoutEvent,
  HeaderProps,
} from '../TypeDefinition';

type SceneProps = {
  scene: NavigationScene,
  position: Animated.Value,
  progress: Animated.Value,
};

type SubViewRenderer = (props: SceneProps) => ?React.Element<any>;

type SubViewName = 'left' | 'title' | 'right';

type HeaderState = {
  widths: {
    [key: string]: number,
  },
};

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 40;

class Header extends React.PureComponent<void, HeaderProps, HeaderState> {
  static HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;

  state = {
    widths: {},
  };

  _getHeaderTitleString(scene: NavigationScene): ?string {
    const sceneOptions = this.props.getScreenDetails(scene).options;
    if (typeof sceneOptions.headerTitle === 'string') {
      return sceneOptions.headerTitle;
    }
    return sceneOptions.title;
  }

  _getLastScene(scene: NavigationScene): ?NavigationScene {
    return this.props.scenes.find((s: *) => s.index === scene.index - 1);
  }

  _getBackButtonTitleString(scene: NavigationScene): ?string {
    const lastScene = this._getLastScene(scene);
    if (!lastScene) {
      return null;
    }
    const { headerBackTitle } = this.props.getScreenDetails(lastScene).options;
    if (headerBackTitle || headerBackTitle === null) {
      return headerBackTitle;
    }
    return this._getHeaderTitleString(lastScene);
  }

  _getTruncatedBackButtonTitle(scene: NavigationScene): ?string {
    const lastScene = this._getLastScene(scene);
    if (!lastScene) {
      return null;
    }
    return this.props.getScreenDetails(lastScene).options
      .headerTruncatedBackTitle;
  }

  _renderTitleComponent = (props: SceneProps) => {
    const details = this.props.getScreenDetails(props.scene);
    const headerTitle = details.options.headerTitle;
    if (headerTitle && typeof headerTitle !== 'string') {
      return headerTitle;
    }
    const titleString = this._getHeaderTitleString(props.scene);

    const titleStyle = details.options.headerTitleStyle;
    const color = details.options.headerTintColor;

    // On iOS, width of left/right components depends on the calculated
    // size of the title.
    const onLayoutIOS = Platform.OS === 'ios'
      ? (e: LayoutEvent) => {
          this.setState({
            widths: {
              ...this.state.widths,
              [props.scene.key]: e.nativeEvent.layout.width,
            },
          });
        }
      : undefined;

    return (
      <HeaderTitle
        onLayout={onLayoutIOS}
        style={[color ? { color } : null, titleStyle]}
      >
        {titleString}
      </HeaderTitle>
    );
  };

  _renderLeftComponent = (props: SceneProps) => {
    const options = this.props.getScreenDetails(props.scene).options;
    if (typeof options.headerLeft !== 'undefined') {
      return options.headerLeft;
    }
    if (props.scene.index === 0) {
      return null;
    }
    const backButtonTitle = this._getBackButtonTitleString(props.scene);
    const truncatedBackButtonTitle = this._getTruncatedBackButtonTitle(
      props.scene
    );
    const width = this.state.widths[props.scene.key]
      ? (this.props.layout.initWidth - this.state.widths[props.scene.key]) / 2
      : undefined;
    return (
      <HeaderBackButton
        onPress={() => {
          this.props.navigation.goBack(null);
        }}
        pressColorAndroid={options.headerPressColorAndroid}
        tintColor={options.headerTintColor}
        title={backButtonTitle}
        truncatedTitle={truncatedBackButtonTitle}
        titleStyle={options.headerBackTitleStyle}
        width={width}
      />
    );
  };

  _renderRightComponent = (props: SceneProps) => {
    const details = this.props.getScreenDetails(props.scene);
    const { headerRight } = details.options;
    return headerRight || null;
  };

  _renderLeft(props: SceneProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'left',
      this._renderLeftComponent,
      HeaderStyleInterpolator.forLeft
    );
  }

  _renderTitle(props: SceneProps, options: *): ?React.Element<*> {
    const style = {};

    if (Platform.OS === 'android') {
      if (!options.hasLeftComponent) {
        style.left = 0;
      }
      if (!options.hasRightComponent) {
        style.right = 0;
      }
    }

    return this._renderSubView(
      { ...props, style },
      'title',
      this._renderTitleComponent,
      HeaderStyleInterpolator.forCenter
    );
  }

  _renderRight(props: SceneProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'right',
      this._renderRightComponent,
      HeaderStyleInterpolator.forRight
    );
  }

  _renderSubView(
    props: SceneProps,
    name: SubViewName,
    renderer: SubViewRenderer,
    styleInterpolator: NavigationStyleInterpolator
  ): ?React.Element<*> {
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
            // todo: determine if we really need to splat all this.props
            ...this.props,
            ...props,
          }),
        ]}
      >
        {subView}
      </Animated.View>
    );
  }

  _renderHeader(props: SceneProps): React.Element<*> {
    const left = this._renderLeft(props);
    const right = this._renderRight(props);
    const title = this._renderTitle(props, {
      hasLeftComponent: !!left,
      hasRightComponent: !!right,
    });

    return (
      <View
        style={[StyleSheet.absoluteFill, styles.header]}
        key={`scene_${props.scene.key}`}
      >
        {title}
        {left}
        {right}
      </View>
    );
  }

  render() {
    let appBar;

    if (this.props.mode === 'float') {
      const scenesProps: Array<
        SceneProps
      > = this.props.scenes.map((scene: NavigationScene) => ({
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

    // eslint-disable-next-line no-unused-vars
    const {
      scenes,
      scene,
      position,
      screenProps,
      progress,
      style,
      ...rest
    } = this.props;

    const { options } = this.props.getScreenDetails(scene, screenProps);
    const headerStyle = options.headerStyle;

    return (
      <Animated.View {...rest} style={[styles.container, headerStyle, style]}>
        <View style={styles.appBar}>
          {appBar}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    height: STATUSBAR_HEIGHT + APPBAR_HEIGHT,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4,
  },
  appBar: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    bottom: 0,
    left: TITLE_OFFSET,
    right: TITLE_OFFSET,
    top: 0,
    position: 'absolute',
    alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start',
  },
  left: {
    left: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
  },
  right: {
    right: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
  },
});

export default Header;
