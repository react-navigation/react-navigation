import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  StackRouter,
  SceneView,
  StackActions,
  NavigationActions,
  createNavigator,
} from '@react-navigation/core';
import { createKeyboardAwareNavigator } from '@react-navigation/native';
import { HeaderBackButton } from 'react-navigation-stack';
import {
  ScreenStack,
  Screen,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackHeaderTitleView,
} from 'react-native-screens';

function renderComponentOrThunk(componentOrThunk, props) {
  if (typeof componentOrThunk === 'function') {
    return componentOrThunk(props);
  }
  return componentOrThunk;
}

class StackView extends React.Component {
  _removeScene = route => {
    const { navigation } = this.props;
    navigation.dispatch(
      NavigationActions.back({
        key: route.key,
        immediate: true,
      })
    );
    navigation.dispatch(StackActions.completeTransition());
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
      headerTintColor,
      gestureEnabled,
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
      backTitle: headerBackTitle,
      backTitleFontFamily:
        headerBackTitleStyle && headerBackTitleStyle.fontFamily,
      backTitleFontSize: headerBackTitleStyle && headerBackTitleStyle.fontSize,
      color: headerTintColor,
      gestureEnabled: gestureEnabled === undefined ? true : gestureEnabled,
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
          <ScreenStackHeaderTitleView key="title">
            {renderComponentOrThunk(options.headerTitle, { scene })}
          </ScreenStackHeaderTitleView>
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
    const { navigation, getComponent } = descriptor;
    const { mode, transparentCard } = this.props.navigationConfig;
    const SceneComponent = getComponent();

    let stackPresentation = 'push';
    if (mode === 'modal') {
      stackPresentation = transparentCard ? 'transparentModal' : 'modal';
    }

    const { screenProps } = this.props;
    return (
      <Screen
        key={`screen_${route.key}`}
        style={StyleSheet.absoluteFill}
        stackPresentation={stackPresentation}
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
      <ScreenStack style={styles.scenes}>
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
