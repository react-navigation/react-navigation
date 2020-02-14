import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  StackRouter,
  SceneView,
  StackActions,
  createNavigator,
} from '@react-navigation/core';
import { createKeyboardAwareNavigator } from '@react-navigation/native';
import { HeaderBackButton } from 'react-navigation-stack';
import {
  ScreenStack,
  Screen,
  ScreenStackHeaderConfig,
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackHeaderCenterView,
} from 'react-native-screens';

function renderComponentOrThunk(componentOrThunk, props) {
  if (typeof componentOrThunk === 'function') {
    return componentOrThunk(props);
  }
  return componentOrThunk;
}

class StackView extends React.Component {
  _removeScene = route => {
    this.props.navigation.dispatch(StackActions.pop({ key: route.key }));
  };

  _onAppear = (route, descriptor) => {
    descriptor.options &&
      descriptor.options.onAppear &&
      descriptor.options.onAppear();
    this.props.navigation.dispatch(
      StackActions.completeTransition({
        toChildKey: route.key,
        key: this.props.navigation.state.key,
      })
    );
  };

  _onFinishTransitioning = () => {
    const { routes } = this.props.navigation.state;
    let lastRoute = routes && routes.length && routes[routes.length - 1];
    if (lastRoute) {
      this.props.navigation.dispatch(
        StackActions.completeTransition({
          toChildKey: lastRoute.key,
          key: this.props.navigation.state.key,
        })
      );
    }
  };

  _renderHeaderConfig = (index, route, descriptor) => {
    const { navigationConfig } = this.props;
    const { options } = descriptor;
    const { headerMode } = navigationConfig;

    const {
      title,
      headerStyle,
      headerTitleStyle,
      headerBackTitleStyle,
      headerBackTitle,
      headerBackTitleVisible,
      headerTintColor,
      largeTitle,
      headerLargeTitleStyle,
      translucent,
      hideShadow,
    } = options;

    const scene = {
      index,
      key: route.key,
      route,
      descriptor,
    };

    const headerOptions = {
      translucent: translucent === undefined ? false : translucent,
      title,
      titleFontFamily: headerTitleStyle && headerTitleStyle.fontFamily,
      titleColor: headerTintColor,
      titleFontSize: headerTitleStyle && headerTitleStyle.fontSize,
      backTitle: headerBackTitleVisible === false ? '' : headerBackTitle,
      backTitleFontFamily:
        headerBackTitleStyle && headerBackTitleStyle.fontFamily,
      backTitleFontSize: headerBackTitleStyle && headerBackTitleStyle.fontSize,
      color: headerTintColor,
      largeTitle,
      largeTitleFontFamily:
        headerLargeTitleStyle && headerLargeTitleStyle.fontFamily,
      largeTitleFontSize:
        headerLargeTitleStyle && headerLargeTitleStyle.fontSize,
      hideShadow,
    };

    const hasHeader = headerMode !== 'none' && options.header !== null;
    if (!hasHeader) {
      return <ScreenStackHeaderConfig {...headerOptions} hidden />;
    }

    if (headerStyle !== undefined) {
      headerOptions.backgroundColor = headerStyle.backgroundColor;
    }

    const children = [];

    if (options.backButtonImage) {
      children.push(
        <ScreenStackHeaderBackButtonImage
          key="backImage"
          source={options.backButtonImage}
        />
      );
    }

    if (options.headerLeft !== undefined) {
      children.push(
        <ScreenStackHeaderLeftView key="left">
          {renderComponentOrThunk(options.headerLeft, { scene })}
        </ScreenStackHeaderLeftView>
      );
    } else if (options.headerBackImage !== undefined) {
      const goBack = () => {
        // Go back on next tick because button ripple effect needs to happen on Android
        requestAnimationFrame(() => {
          descriptor.navigation.goBack(descriptor.key);
        });
      };

      children.push(
        <ScreenStackHeaderLeftView key="left">
          <HeaderBackButton
            onPress={goBack}
            pressColorAndroid={options.headerPressColorAndroid}
            tintColor={options.headerTintColor}
            backImage={options.headerBackImage}
            title={options.backButtonTitle}
            truncatedTitle={options.truncatedBackButtonTitle}
            backTitleVisible={this.props.backTitleVisible}
            titleStyle={options.headerBackTitleStyle}
            layoutPreset={this.props.layoutPreset}
            scene={scene}
          />
        </ScreenStackHeaderLeftView>
      );
    }

    if (options.headerTitle) {
      if (title === undefined && typeof options.headerTitle === 'string') {
        headerOptions.title = options.headerTitle;
      } else {
        children.push(
          <ScreenStackHeaderCenterView key="center">
            {renderComponentOrThunk(options.headerTitle, { scene })}
          </ScreenStackHeaderCenterView>
        );
      }
    }

    if (options.headerRight) {
      children.push(
        <ScreenStackHeaderRightView key="right">
          {renderComponentOrThunk(options.headerRight, { scene })}
        </ScreenStackHeaderRightView>
      );
    }

    if (children.length > 0) {
      headerOptions.children = children;
    }

    return <ScreenStackHeaderConfig {...headerOptions} />;
  };

  _renderScene = (index, route, descriptor) => {
    const { navigation, getComponent, options } = descriptor;
    const { mode, transparentCard } = this.props.navigationConfig;
    const SceneComponent = getComponent();

    let stackPresentation = 'push';
    if (mode === 'modal' || mode === 'containedModal') {
      stackPresentation = mode;
      if (transparentCard || options.cardTransparent) {
        stackPresentation =
          mode === 'containedModal'
            ? 'containedTransparentModal'
            : 'transparentModal';
      }
    }

    let stackAnimation = options.stackAnimation;
    if (options.animationEnabled === false) {
      stackAnimation = 'none';
    }

    const { screenProps } = this.props;
    return (
      <Screen
        key={`screen_${route.key}`}
        style={options.cardStyle}
        stackAnimation={stackAnimation}
        stackPresentation={stackPresentation}
        gestureEnabled={
          options.gestureEnabled === undefined ? true : options.gestureEnabled
        }
        onAppear={() => this._onAppear(route, descriptor)}
        onDismissed={() => this._removeScene(route)}>
        {this._renderHeaderConfig(index, route, descriptor)}
        <SceneView
          screenProps={screenProps}
          navigation={navigation}
          component={SceneComponent}
        />
      </Screen>
    );
  };

  render() {
    const { navigation, descriptors } = this.props;

    return (
      <ScreenStack
        style={styles.scenes}
        onFinishTransitioning={this._onFinishTransitioning}>
        {navigation.state.routes.map((route, i) =>
          this._renderScene(i, route, descriptors[route.key])
        )}
      </ScreenStack>
    );
  }
}

const styles = StyleSheet.create({
  scenes: { flex: 1 },
});

function createStackNavigator(routeConfigMap, stackConfig = {}) {
  const router = StackRouter(routeConfigMap, stackConfig);
  // Create a navigator with StackView as the view
  let Navigator = createNavigator(StackView, router, stackConfig);
  // if (!stackConfig.disableKeyboardHandling) {
  //   Navigator = createKeyboardAwareNavigator(Navigator, stackConfig);
  // }

  return Navigator;
}

export default createStackNavigator;
