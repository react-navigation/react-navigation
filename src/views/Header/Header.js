/* @flow */

'no babel-plugin-flow-react-proptypes';

import * as React from 'react';

import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';

import HeaderTitle from './HeaderTitle';
import HeaderBackButton from './HeaderBackButton';
import HeaderStyleInterpolator from './HeaderStyleInterpolator';
import SafeAreaView from '../SafeAreaView';
import withOrientation from '../withOrientation';

import type {
  NavigationScene,
  NavigationStyleInterpolator,
  LayoutEvent,
  HeaderProps,
} from '../../TypeDefinition';

type SceneProps = {
  scene: NavigationScene,
  position: Animated.Value,
  progress: Animated.Value,
  style?: ViewPropTypes.style,
};

type SubViewRenderer<T> = (props: SceneProps) => ?React.Node;

type SubViewName = 'left' | 'title' | 'right';

type State = {
  widths: {
    [key: string]: number,
  },
};

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 56;

type Props = HeaderProps & { isLandscape: boolean };
class Header extends React.PureComponent<Props, State> {
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

  _navigateBack = () => {
    this.props.navigation.goBack(null);
  };

  _renderTitleComponent = (props: SceneProps): ?React.Node => {
    const details = this.props.getScreenDetails(props.scene);
    const headerTitle = details.options.headerTitle;
    if (headerTitle && typeof headerTitle !== 'string') {
      return headerTitle;
    }
    const titleString = this._getHeaderTitleString(props.scene);

    const titleStyle = details.options.headerTitleStyle;
    const color = details.options.headerTintColor;
    const allowFontScaling = details.options.headerTitleAllowFontScaling;

    // On iOS, width of left/right components depends on the calculated
    // size of the title.
    const onLayoutIOS =
      Platform.OS === 'ios'
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
        allowFontScaling={allowFontScaling == null ? true : allowFontScaling}
        style={[color ? { color } : null, titleStyle]}
      >
        {titleString}
      </HeaderTitle>
    );
  };

  _renderLeftComponent = (props: SceneProps): ?React.Node => {
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
        onPress={this._navigateBack}
        pressColorAndroid={options.headerPressColorAndroid}
        tintColor={options.headerTintColor}
        title={backButtonTitle}
        truncatedTitle={truncatedBackButtonTitle}
        titleStyle={options.headerBackTitleStyle}
        width={width}
      />
    );
  };

  _renderRightComponent = (props: SceneProps): ?React.Node => {
    const details = this.props.getScreenDetails(props.scene);
    const { headerRight } = details.options;
    return headerRight || null;
  };

  _renderLeft(props: SceneProps): ?React.Node {
    return this._renderSubView(
      props,
      'left',
      this._renderLeftComponent,
      HeaderStyleInterpolator.forLeft
    );
  }

  _renderTitle(props: SceneProps, options: *): ?React.Node {
    const style = {};

    if (Platform.OS === 'android') {
      if (!options.hasLeftComponent) {
        style.left = 0;
      }
      if (!options.hasRightComponent) {
        style.right = 0;
      }
    } else if (
      Platform.OS === 'ios' &&
      !options.hasLeftComponent &&
      !options.hasRightComponent
    ) {
      style.left = 0;
      style.right = 0;
    }

    return this._renderSubView(
      { ...props, style },
      'title',
      this._renderTitleComponent,
      HeaderStyleInterpolator.forCenter
    );
  }

  _renderRight(props: SceneProps): ?React.Node {
    return this._renderSubView(
      props,
      'right',
      this._renderRightComponent,
      HeaderStyleInterpolator.forRight
    );
  }

  _renderSubView<T>(
    props: SceneProps,
    name: SubViewName,
    renderer: SubViewRenderer<T>,
    styleInterpolator: NavigationStyleInterpolator
  ): ?React.Node {
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

  _renderHeader(props: SceneProps): React.Node {
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
      isLandscape,
      ...rest
    } = this.props;

    const { options } = this.props.getScreenDetails(scene);
    const headerStyle = options.headerStyle;
    const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
    const containerStyles = [
      {
        height: appBarHeight,
      },
      headerStyle,
    ];

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: 'always', bottom: 'never' }}
      >
        <Animated.View {...rest} style={containerStyles}>
          <View style={styles.appBar}>{appBar}</View>
        </Animated.View>
      </SafeAreaView>
    );
  }
}

let platformContainerStyles;
if (Platform.OS === 'ios') {
  platformContainerStyles = {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, .3)',
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Platform.OS === 'ios' ? '#F7F7F7' : '#FFF',
    ...platformContainerStyles,
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

export default withOrientation(Header);
