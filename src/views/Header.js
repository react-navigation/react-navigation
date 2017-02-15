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
  NavigationState,
  NavigationAction,
  NavigationScreenProp,
  NavigationSceneRendererProps,
  NavigationStyleInterpolator,
  Style,
} from '../TypeDefinition';

export type HeaderMode = 'float' | 'screen' | 'none';

type SubViewProps = NavigationSceneRendererProps & {
  onNavigateBack?: () => void,
};

type Navigation = NavigationScreenProp<NavigationState, NavigationAction>;

type SubViewRenderer = (subViewProps: SubViewProps) => ?React.Element<*>;

export type HeaderProps = NavigationSceneRendererProps & {
  mode: HeaderMode,
  onNavigateBack?: () => void,
  renderLeftComponent: SubViewRenderer,
  renderRightComponent: SubViewRenderer,
  renderTitleComponent: SubViewRenderer,
  tintColor?: string,
  router: NavigationRouter,
};

type SubViewName = 'left' | 'title' | 'right';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

class Header extends React.Component<void, HeaderProps, void> {

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

  _getHeaderTitleStyle(navigation: Navigation): Style {
    const header = this.props.router.getScreenConfig(navigation, 'header');
    if (header && header.titleStyle) {
      return header.titleStyle;
    }
    return undefined;
  }

  _renderTitleComponent = (props: SubViewProps): React.Element<HeaderTitle> => {
    const titleStyle = this._getHeaderTitleStyle(props.navigation);
    const color = this._getHeaderTintColor(props.navigation);
    const title = this._getHeaderTitle(props.navigation);
    return <HeaderTitle style={[color ? { color } : null, titleStyle]}>{title}</HeaderTitle>;
  };

  _renderLeftComponent = (props: SubViewProps): ?React.Element<HeaderBackButton> => {
    if (props.scene.index === 0 || !props.onNavigateBack) {
      return null;
    }
    const tintColor = this._getHeaderTintColor(props.navigation);
    // @todo(grabobu):
    // We have implemented support for back button label (which works 100% fine),
    // but when title is too long, it will overlap the <HeaderTitle />.
    // We had to revert the PR implementing that because of Android issues,
    // I will land it this week and re-enable that for next release.
    //
    // const previousNavigation = addNavigationHelpers({
    //   ...props.navigation,
    //   state: props.scenes[props.scene.index - 1].route,
    // });
    // const backButtonTitle = this._getHeaderTitle(previousNavigation);
    return (
      <HeaderBackButton
        onPress={props.onNavigateBack}
        tintColor={tintColor}
      />
    );
  };

  _renderRightComponent = () => null;

  _renderLeft = (props: NavigationSceneRendererProps): ?React.Element<*> => this._renderSubView(
      props,
      'left',
      this.props.renderLeftComponent,
      this._renderLeftComponent,
      HeaderStyleInterpolator.forLeft,
    );

  _renderTitle = (props: NavigationSceneRendererProps, options: *): ?React.Element<*> => {
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
      this._renderTitleComponent,
      HeaderStyleInterpolator.forCenter,
    );
  }

  _renderRight = (props: NavigationSceneRendererProps): ?React.Element<*> => this._renderSubView(
      props,
      'right',
      this.props.renderRightComponent,
      this._renderRightComponent,
      HeaderStyleInterpolator.forRight,
    );

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
          styleInterpolator(props),
        ]}
      >
        {subView}
      </Animated.View>
    );
  }

  render(): React.Element<*> {
    // eslint-disable-next-line no-unused-vars
    const { scenes, scene, style, position, progress, ...rest } = this.props;

    let children = null;

    if (this.props.mode === 'float') {
      // eslint-disable-next-line no-shadow
      const scenesProps = (scenes.map((scene: NavigationScene, index: number) => {
        const props = NavigationPropTypes.extractSceneRendererProps(this.props);
        props.scene = scene;
        props.index = index;
        props.navigation = addNavigationHelpers({
          ...this.props.navigation,
          state: scene.route,
        });
        return props;
      }): Array<NavigationSceneRendererProps>);
      const leftComponents = scenesProps.map(this._renderLeft, this);
      const rightComponents = scenesProps.map(this._renderRight, this);
      const titleComponents = scenesProps.map((props: *, i: number) =>
        this._renderTitle(props, {
          hasLeftComponent: leftComponents && !!leftComponents[i],
          hasRightComponent: rightComponents && !!rightComponents[i],
        })
      );

      children = [
        titleComponents,
        leftComponents,
        rightComponents
      ];
    } else {
      const staticRendererProps = {
        ...this.props,
        position: new Animated.Value(scene.index),
        progress: new Animated.Value(0),
      };
      const leftComponent = this._renderLeft(staticRendererProps);
      const rightComponent = this._renderRight(staticRendererProps);
      const titleComponent = this._renderTitle(staticRendererProps, {
        hasLeftComponent: !!leftComponent,
        hasRightComponent: !!rightComponent,
      });

      children = [
        titleComponent,
        leftComponent,
        rightComponent
      ];
    }

    return (
      <Animated.View {...rest} style={[styles.container, style]}>
        <View style={styles.appBar}>{children}</View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    height: STATUSBAR_HEIGHT + APPBAR_HEIGHT,
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
    flex: 1
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
