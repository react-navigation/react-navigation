/* @flow */

import React, { PropTypes } from 'react';

import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import ReactComponentWithPureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';

import HeaderTitle from './HeaderTitle';
import HeaderBackButton from './HeaderBackButton';
import HeaderStyleInterpolator from './HeaderStyleInterpolator';
import NavigationPropTypes from '../PropTypes';
import addNavigationHelpers from '../addNavigationHelpers';

import type {
  NavigationScene,
  NavigationRouter,
  NavigationRoute,
  NavigationAction,
  NavigationScreenProp,
  NavigationSceneRendererProps,
  NavigationStyleInterpolator,
} from '../TypeDefinition';

export type HeaderMode = 'float' | 'screen' | 'none';

type SubViewProps = NavigationSceneRendererProps & {
  onNavigateBack: ?() => void,
};

type Navigation = NavigationScreenProp<NavigationRoute, NavigationAction>;

type SubViewRenderer = (subViewProps: SubViewProps) => ?React.Element<*>;

type LayoutEvent = {
  nativeEvent: {
    layout: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
  };
};

type HeaderState = {
  widths: {
    [key: number]: number,
  },
};

export type HeaderProps = NavigationSceneRendererProps & {
  mode: HeaderMode,
  onNavigateBack: ?Function,
  renderLeftComponent: SubViewRenderer,
  renderRightComponent: SubViewRenderer,
  renderTitleComponent: SubViewRenderer,
  tintColor: ?string,
  router: NavigationRouter,
  style?: any,
};

type SubViewName = 'left' | 'title' | 'right';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

class Header extends React.Component<void, HeaderProps, HeaderState> {

  static HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;
  static Title = HeaderTitle;
  static BackButton = HeaderBackButton;

  // propTypes for people who don't use Flow
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    onNavigateBack: PropTypes.func,
    renderLeftComponent: PropTypes.func,
    renderRightComponent: PropTypes.func,
    renderTitleComponent: PropTypes.func,
    router: PropTypes.object,
    style: PropTypes.any,
  };

  state = {
    widths: {},
  };

  props: HeaderProps;

  shouldComponentUpdate(nextProps: HeaderProps, nextState: any): boolean {
    return ReactComponentWithPureRenderMixin.shouldComponentUpdate.call(
      this,
      nextProps,
      nextState
    );
  }

  _getHeaderTitle(navigation: Navigation): ?string {
    const header = this.props.router.getScreenConfig(navigation, 'header');
    let title;
    if (header && header.title) {
      title = header.title;
    } else {
      title = this.props.router.getScreenConfig(navigation, 'title');
    }
    return typeof title === 'string' ? title : undefined;
  }

  _getHeaderTintColor(navigation: Navigation): ?string {
    const header = this.props.router.getScreenConfig(navigation, 'header');
    if (header && header.tintColor) {
      return header.tintColor;
    }
    return undefined;
  }

  _getHeaderTitleStyle(navigation: Navigation): ?object {
    const header = this.props.router.getScreenConfig(navigation, 'header');
    if (header && header.titleStyle) {
      return header.titleStyle;
    }
    return undefined;
  }

  _renderTitleComponent = (props: SubViewProps) => {
    const titleStyle = this._getHeaderTitleStyle(props.navigation);
    const color = this._getHeaderTintColor(props.navigation);
    const title = this._getHeaderTitle(props.navigation);
    return <HeaderTitle style={[color && { color }, titleStyle]}>{title}</HeaderTitle>;
  };

  _renderLeftComponent = (props: SubViewProps) => {
    if (props.scene.index === 0 || !props.onNavigateBack) {
      return null;
    }
    const tintColor = this._getHeaderTintColor(props.navigation);
    const previousNavigation = addNavigationHelpers({
      ...props.navigation,
      state: props.scenes[props.scene.index - 1].route,
    });
    const backButtonTitle = this._getHeaderTitle(previousNavigation);
    return (
      <HeaderBackButton
        onPress={props.onNavigateBack}
        tintColor={tintColor}
        title={backButtonTitle}
      />
    );
  };

  _renderRightComponent = () => {
    return null;
  };

  _renderLeft(props: NavigationSceneRendererProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'left',
      this.props.renderLeftComponent,
      this._renderLeftComponent,
      HeaderStyleInterpolator.forLeft,
    );
  }

  _renderTitle(props: NavigationSceneRendererProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'title',
      this.props.renderTitleComponent,
      this._renderTitleComponent,
      HeaderStyleInterpolator.forCenter,
    );
  }

  _renderRight(props: NavigationSceneRendererProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'right',
      this.props.renderRightComponent,
      this._renderRightComponent,
      HeaderStyleInterpolator.forRight,
    );
  }

  _renderSubView(
    props: NavigationSceneRendererProps,
    name: SubViewName,
    renderer: SubViewRenderer,
    defaultRenderer: SubViewRenderer,
    styleInterpolator: NavigationStyleInterpolator,
  ): ?React.Element<*> {
    const {
      scene,
      navigationState,
    } = props;
    const {
      index,
      isStale,
      key,
    } = scene;

    const offset = navigationState.index - index;

    if (Math.abs(offset) > 2) {
      // Scene is far away from the active scene. Hides it to avoid unnecessary
      // rendering.
      return null;
    }

    const subViewProps = {
      ...props,
      onNavigateBack: this.props.onNavigateBack,
    };

    let subView = renderer(subViewProps);
    if (subView === undefined) {
      subView = defaultRenderer(subViewProps);
    }

    if (subView === null) {
      return null;
    }

    const pointerEvents = offset !== 0 || isStale ? 'none' : 'box-none';

    // Only measure `title` component
    const onLayout = name === 'title'
      ? (e: LayoutEvent) => {
        this.setState({
          widths: {
            ...this.state.widths,
            [index]: e.nativeEvent.layout.width,
          },
        });
      }
      : undefined;

    const width = name === 'left' || name === 'right'
      ? this.state.widths[index]
      : undefined;

    return (
      <Animated.View
        pointerEvents={pointerEvents}
        onLayout={onLayout}
        key={`${name}_${key}`}
        style={[
          width && {
            width: (props.layout.initWidth - width) / 2,
          },
          styles.item,
          styles[name],
          props.style,
          styleInterpolator(props),
        ]}
      >
        {subView}
      </Animated.View>
    );
  }

  _renderHeader(props: NavigationSceneRendererProps): React.Element<*> {
    const left = this._renderLeft(props);
    const right = this._renderRight(props);
    const title = this._renderTitle(props);

    return (
      <View
        style={[StyleSheet.absoluteFill, styles.header]}
        key={`scene_${props.scene.key}`}
      >
        {left}
        {title}
        {right}
      </View>
    );
  }

  render(): React.Element<*> {
    let children;

    if (this.props.mode === 'float') {
      const scenesProps: Array<NavigationSceneRendererProps> = this.props.scenes
        .map((scene: NavigationScene, index: number) => ({
          ...NavigationPropTypes.extractSceneRendererProps(this.props),
          scene,
          index,
          navigation: addNavigationHelpers({
            ...this.props.navigation,
            state: scene.route,
          }),
        }));

      children = scenesProps.map(this._renderHeader, this);
    } else {
      children = this._renderHeader({
        ...this.props,
        position: new Animated.Value(this.props.scene.index),
        progress: new Animated.Value(0),
      });
    }

    // eslint-disable-next-line no-unused-vars
    const { scenes, scene, style, position, progress, ...rest } = this.props;

    return (
      <Animated.View {...rest} style={[styles.container, style]}>
        <View style={styles.appBar}>
          {children}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4,
  },
  appBar: {
    height: APPBAR_HEIGHT,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    justifyContent: 'flex-end',
  },
});

module.exports = Header;
