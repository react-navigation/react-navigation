import {
  getHeaderTitle,
  Header,
  HeaderBackButton,
  HeaderBackContext,
  SafeAreaProviderCompat,
  Screen,
} from '@react-navigation/elements';
import type {
  ParamListBase,
  StackNavigationState,
} from '@react-navigation/native';
import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';

type Props = {
  state: StackNavigationState<ParamListBase>;
  // This is used for the native implementation of the stack.
  // eslint-disable-next-line react/no-unused-prop-types
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

const TRANSPARENT_PRESENTATIONS = [
  'transparentModal',
  'containedTransparentModal',
];

export default function NativeStackView({ state, descriptors }: Props) {
  const parentHeaderBack = React.useContext(HeaderBackContext);

  return (
    <SafeAreaProviderCompat>
      <View style={styles.container}>
        {state.routes.map((route, i) => {
          const isFocused = state.index === i;
          const previousKey = state.routes[i - 1]?.key;
          const nextKey = state.routes[i + 1]?.key;
          const previousDescriptor = previousKey
            ? descriptors[previousKey]
            : undefined;
          const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;
          const { options, navigation, render } = descriptors[route.key];

          const headerBack = previousDescriptor
            ? {
                title: getHeaderTitle(
                  previousDescriptor.options,
                  previousDescriptor.route.name
                ),
              }
            : parentHeaderBack;

          const canGoBack = headerBack !== undefined;

          const {
            header,
            headerShown,
            headerTintColor,
            headerBackImageSource,
            headerLeft,
            headerRight,
            headerTitle,
            headerTitleAlign,
            headerTitleStyle,
            headerStyle,
            headerShadowVisible,
            headerTransparent,
            headerBackground,
            headerBackTitle,
            presentation,
            contentStyle,
          } = options;

          const nextPresentation = nextDescriptor?.options.presentation;

          return (
            <Screen
              key={route.key}
              focused={isFocused}
              route={route}
              navigation={navigation}
              headerShown={headerShown}
              headerTransparent={headerTransparent}
              header={
                header !== undefined ? (
                  header({
                    back: headerBack,
                    options,
                    route,
                    navigation,
                  })
                ) : (
                  <Header
                    title={getHeaderTitle(options, route.name)}
                    headerTintColor={headerTintColor}
                    headerLeft={
                      typeof headerLeft === 'function'
                        ? ({ tintColor }) =>
                            headerLeft({
                              tintColor,
                              canGoBack,
                              label: headerBackTitle,
                            })
                        : headerLeft === undefined && canGoBack
                        ? ({ tintColor }) => (
                            <HeaderBackButton
                              tintColor={tintColor}
                              backImage={
                                headerBackImageSource !== undefined
                                  ? () => (
                                      <Image
                                        source={headerBackImageSource}
                                        style={[
                                          styles.backImage,
                                          { tintColor },
                                        ]}
                                      />
                                    )
                                  : undefined
                              }
                              onPress={navigation.goBack}
                              canGoBack={canGoBack}
                            />
                          )
                        : headerLeft
                    }
                    headerRight={
                      typeof headerRight === 'function'
                        ? ({ tintColor }) =>
                            headerRight({ tintColor, canGoBack })
                        : headerRight
                    }
                    headerTitle={
                      typeof headerTitle === 'function'
                        ? ({ children, tintColor }) =>
                            headerTitle({ children, tintColor })
                        : headerTitle
                    }
                    headerTitleAlign={headerTitleAlign}
                    headerTitleStyle={headerTitleStyle}
                    headerTransparent={headerTransparent}
                    headerShadowVisible={headerShadowVisible}
                    headerBackground={headerBackground}
                    headerStyle={headerStyle}
                  />
                )
              }
              style={[
                StyleSheet.absoluteFill,
                {
                  display:
                    isFocused ||
                    (nextPresentation != null &&
                      TRANSPARENT_PRESENTATIONS.includes(nextPresentation))
                      ? 'flex'
                      : 'none',
                },
                presentation != null &&
                TRANSPARENT_PRESENTATIONS.includes(presentation)
                  ? { backgroundColor: 'transparent' }
                  : null,
              ]}
            >
              <HeaderBackContext.Provider value={headerBack}>
                <View style={[styles.contentContainer, contentStyle]}>
                  {render()}
                </View>
              </HeaderBackContext.Provider>
            </Screen>
          );
        })}
      </View>
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  backImage: {
    height: 24,
    width: 24,
    margin: 3,
    resizeMode: 'contain',
  },
});
