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

import type {
  NavigationScene,
  NavigationRouter,
  NavigationSceneRendererProps,
  NavigationStyleInterpolator,
} from '../TypeDefinition';

export type HeaderMode = 'float' | 'screen' | 'none';

type SubViewProps = NavigationSceneRendererProps & {
  onNavigateBack: ?() => void,
};

type SubViewRenderer = (subViewProps: SubViewProps) => ?React.Element<*>;

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

class Header extends React.Component<*, HeaderProps, *> {

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

  props: HeaderProps;

  shouldComponentUpdate(nextProps: HeaderProps, nextState: any): boolean {
    return ReactComponentWithPureRenderMixin.shouldComponentUpdate.call(
      this,
      nextProps,
      nextState
    );
  }

  getHeaderTitle(props: SubViewProps): ?string {
    const header = this.props.router.getScreenConfig(props.navigation, 'header');
    if (header && header.title) {
      return header.title;
    }
    return this.props.router.getScreenConfig(props.navigation, 'title');
  }

  getHeaderTintColor(props: SubViewProps): ?string {
    const header = this.props.router.getScreenConfig(props.navigation, 'header');
    if (header && header.tintColor) {
      return header.tintColor;
    }
    return null;
  }

  renderTitleComponent = (props: SubViewProps) => {
    const color = this.getHeaderTintColor(props);
    const title = this.getHeaderTitle(props);

    return <HeaderTitle style={{ color }}>{title}</HeaderTitle>;
  };

  renderLeftComponent = (props: SubViewProps) => {
    const tintColor = this.getHeaderTintColor(props);
    if (props.scene.index === 0 || !props.onNavigateBack) {
      return null;
    }
    return (
      <HeaderBackButton
        onPress={props.onNavigateBack}
        tintColor={tintColor}
      />
    );
  };

  renderRightComponent = () => {
    return null;
  };

  _renderLeft(props: NavigationSceneRendererProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'left',
      this.props.renderLeftComponent,
      this.renderLeftComponent,
      HeaderStyleInterpolator.forLeft,
    );
  }

  _renderTitle(props: NavigationSceneRendererProps, options: *): ?React.Element<*> {
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
      this.props.renderTitleComponent,
      this.renderTitleComponent,
      HeaderStyleInterpolator.forCenter,
    );
  }

  _renderRight(props: NavigationSceneRendererProps): ?React.Element<*> {
    return this._renderSubView(
      props,
      'right',
      this.props.renderRightComponent,
      this.renderRightComponent,
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
    return (
      <Animated.View
        pointerEvents={pointerEvents}
        key={`${name}_${key}`}
        style={[
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

  render(): React.Element<*> {
    // eslint-disable-next-line no-unused-vars
    const { scenes, scene, style, position, navigation, progress, ...rest } = this.props;

    let leftComponents = null;
    let titleComponents = null;
    let rightComponents = null;

    if (this.props.mode === 'float') {
      const scenesProps = (scenes.map((scene: NavigationScene, index: number) => {
        const props = NavigationPropTypes.extractSceneRendererProps(this.props);
        props.scene = scene;
        props.index = index;
        return props;
      }): Array<NavigationSceneRendererProps>);
      leftComponents = scenesProps.map(this._renderLeft, this);
      rightComponents = scenesProps.map(this._renderRight, this);
      titleComponents = scenesProps.map((props: *, i: number) =>
        this._renderTitle(props, {
          hasLeftComponent: leftComponents && !!leftComponents[i],
          hasRightComponent: rightComponents && !!rightComponents[i],
        })
      );
    } else {
      const staticRendererProps = {
        ...this.props,
        position: new Animated.Value(scene.index),
        progress: new Animated.Value(0),
      };
      leftComponents = this._renderLeft(staticRendererProps);
      rightComponents = this._renderRight(staticRendererProps);
      titleComponents = this._renderTitle(staticRendererProps, {
        hasLeftComponent: !!leftComponents,
        hasRightComponent: !!rightComponents,
      });
    }

    return (
      <Animated.View {...rest} style={[styles.container, style]}>
        <View style={styles.appBar}>
          {leftComponents}
          {titleComponents}
          {rightComponents}
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
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    bottom: 0,
    left: 40,
    position: 'absolute',
    right: 40,
    top: 0,
  },
  left: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  right: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

module.exports = Header;
