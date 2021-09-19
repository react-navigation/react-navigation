import {
  getHeaderTitle,
  Header,
  HeaderBackButton,
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

export default function NativeStackView({ state, descriptors }: Props) {
  return (
    <SafeAreaProviderCompat>
      <View style={styles.container}>
        {state.routes.map((route, i) => {
          const isFocused = state.index === i;
          const canGoBack = i !== 0;
          const previousKey = state.routes[i - 1]?.key;
          const previousDescriptor = previousKey
            ? descriptors[previousKey]
            : undefined;
          const { options, navigation, render } = descriptors[route.key];

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
            contentStyle,
            headerBackTitle,
          } = options;

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
                    back: previousDescriptor
                      ? {
                          title: getHeaderTitle(
                            previousDescriptor.options,
                            previousDescriptor.route.name
                          ),
                        }
                      : undefined,
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
                        ? ({ tintColor }) => headerRight({ tintColor })
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
                    headerStyle={[
                      headerTransparent
                        ? {
                            position: 'absolute',
                            backgroundColor: 'transparent',
                          }
                        : null,
                      headerStyle,
                      headerShadowVisible === false
                        ? { shadowOpacity: 0, borderBottomWidth: 0 }
                        : null,
                    ]}
                  />
                )
              }
              style={[
                StyleSheet.absoluteFill,
                { display: isFocused ? 'flex' : 'none' },
              ]}
            >
              <View style={[styles.contentContainer, contentStyle]}>
                {render()}
              </View>
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
