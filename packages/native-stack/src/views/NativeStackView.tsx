import {
  getHeaderTitle,
  Header,
  HeaderBackButton,
  HeaderBackContext,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  SafeAreaProviderCompat,
  Screen,
} from '@react-navigation/elements/internal';
import {
  type ParamListBase,
  type StackNavigationState,
  useLinkBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import { Animated, Image, Platform, StyleSheet, View } from 'react-native';

import type {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';
import { AnimatedHeaderHeightContext } from '../utils/useAnimatedHeaderHeight';

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

const TRANSPARENT_PRESENTATIONS = [
  'transparentModal',
  'containedTransparentModal',
];

export function NativeStackView({ state, descriptors }: Props) {
  const parentHeaderBack = React.useContext(HeaderBackContext);
  const { buildHref } = useLinkBuilder();

  return (
    <SafeAreaProviderCompat>
      {state.routes.concat(state.preloadedRoutes).map((route, i) => {
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
              href: buildHref(
                previousDescriptor.route.name,
                previousDescriptor.route.params
              ),
            }
          : parentHeaderBack;

        const canGoBack = headerBack != null;

        const {
          header,
          headerShown,
          headerBackIcon,
          headerLeft,
          headerTransparent,
          headerBackTitle,
          presentation,
          contentStyle,
          ...rest
        } = options;

        const nextPresentation = nextDescriptor?.options.presentation;

        const isPreloaded = state.preloadedRoutes.some(
          (r) => r.key === route.key
        );

        const element = (
          <Screen
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
                  {...rest}
                  back={headerBack}
                  title={getHeaderTitle(options, route.name)}
                  headerLeft={
                    typeof headerLeft === 'function'
                      ? ({ label, ...rest }) =>
                          headerLeft({
                            ...rest,
                            label: headerBackTitle ?? label,
                          })
                      : headerLeft === undefined && canGoBack
                        ? ({ tintColor, label, ...rest }) => (
                            <HeaderBackButton
                              {...rest}
                              label={headerBackTitle ?? label}
                              tintColor={tintColor}
                              backImage={
                                headerBackIcon !== undefined
                                  ? () => (
                                      <Image
                                        source={headerBackIcon.source}
                                        resizeMode="contain"
                                        tintColor={tintColor}
                                        style={styles.backImage}
                                      />
                                    )
                                  : undefined
                              }
                              onPress={navigation.goBack}
                            />
                          )
                        : headerLeft
                  }
                  headerTransparent={headerTransparent}
                />
              )
            }
            style={[
              StyleSheet.absoluteFill,
              {
                display:
                  (isFocused ||
                    (nextPresentation != null &&
                      TRANSPARENT_PRESENTATIONS.includes(nextPresentation))) &&
                  !isPreloaded
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
              <AnimatedHeaderHeightProvider>
                <View style={[styles.contentContainer, contentStyle]}>
                  {render()}
                </View>
              </AnimatedHeaderHeightProvider>
            </HeaderBackContext.Provider>
          </Screen>
        );

        const isModal = presentation != null && presentation !== 'card';
        const isNextModal =
          nextPresentation != null && nextPresentation !== 'card';

        if (!isModal || Platform.OS !== 'web') {
          return <React.Fragment key={route.key}>{element}</React.Fragment>;
        }

        // Keep the dialog open if focused or if there's another modal on top
        const isDialogOpen = (isFocused || isNextModal) && !isPreloaded;

        return (
          <Dialog key={route.key} open={isDialogOpen}>
            {element}
          </Dialog>
        );
      })}
    </SafeAreaProviderCompat>
  );
}

const Dialog = ({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        margin: 0,
        padding: 0,
        border: 'none',
        background: 'transparent',
      }}
    >
      {children}
    </dialog>
  );
};

const AnimatedHeaderHeightProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const headerHeight = useHeaderHeight();
  const [animatedHeaderHeight] = React.useState(
    () => new Animated.Value(headerHeight)
  );

  React.useEffect(() => {
    animatedHeaderHeight.setValue(headerHeight);
  }, [animatedHeaderHeight, headerHeight]);

  return (
    <AnimatedHeaderHeightContext.Provider value={animatedHeaderHeight}>
      {children}
    </AnimatedHeaderHeightContext.Provider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  backImage: {
    height: 24,
    width: 24,
    margin: 3,
  },
});
