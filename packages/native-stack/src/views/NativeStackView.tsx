import {
  getHeaderTitle,
  Header,
  HeaderBackButton,
  HeaderBackContext,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  ActivityView,
  SafeAreaProviderCompat,
  Screen,
} from '@react-navigation/elements/internal';
import {
  type NavigationRoute,
  type ParamListBase,
  type StackNavigationState,
  useLinkBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';
import type { SheetCommands } from 'react-native-screens';

import type {
  NativeStackDescriptor,
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';
import { getModalRouteKeys } from '../utils/getModalRoutesKeys';
import { AnimatedHeaderHeightContext } from '../utils/useAnimatedHeaderHeight';
import { FormSheetContext } from '../utils/useFormSheet';

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
  const parentHeaderBack = React.use(HeaderBackContext);
  const { buildHref } = useLinkBuilder();

  const activeRoutes = state.routes.slice(0, state.index + 1);
  const modalRouteKeys = getModalRouteKeys(activeRoutes, descriptors);

  const [savedNestedStateRouteKeys, setSavedNestedStateRouteKeys] =
    React.useState<string[]>([]);

  // Nested navigators clean up `route.state` when the screen is paused with `Activity`
  // So we remember routes which had state until they are removed
  const nestedStateRouteKeys = state.routes
    .filter(
      (route) =>
        route.state != null || savedNestedStateRouteKeys.includes(route.key)
    )
    .map((route) => route.key);

  if (
    nestedStateRouteKeys.some((key) => !savedNestedStateRouteKeys.includes(key))
  ) {
    setSavedNestedStateRouteKeys(nestedStateRouteKeys);
  }

  return (
    <SafeAreaProviderCompat>
      {state.routes.map((route, i) => {
        const isFocused = state.index === i;
        const previousKey = activeRoutes[i - 1]?.key;
        const nextKey = activeRoutes[i + 1]?.key;
        const previousDescriptor = previousKey
          ? descriptors[previousKey]
          : undefined;
        const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;
        const descriptor = descriptors[route.key];

        if (descriptor == null) {
          throw new Error(
            `Couldn't find a descriptor for route '${route.key}'.`
          );
        }

        const { inactiveBehavior = 'pause' } = descriptor.options;

        const nextPresentation = nextDescriptor?.options.presentation;

        const isNextScreenTransparent =
          nextPresentation != null &&
          TRANSPARENT_PRESENTATIONS.includes(nextPresentation);

        const isInactive = i > state.index;

        const isBeforeLast = i === activeRoutes.length - 2;

        const isNextScreenModal = nextKey
          ? modalRouteKeys.includes(nextKey)
          : false;

        const activityMode =
          // Render focused screens normally
          isFocused
            ? 'normal'
            : // Unpause preloaded and retained screens so updates are visible
              // This lets effects on those screens run
              inactiveBehavior === 'none' ||
                isInactive ||
                isNextScreenTransparent
              ? 'inert'
              : inactiveBehavior === 'unmount' &&
                  !isNextScreenModal &&
                  !isBeforeLast &&
                  !nestedStateRouteKeys.includes(route.key)
                ? 'unmounted'
                : 'paused';

        if (activityMode === 'unmounted') {
          return null;
        }

        return (
          <SceneView
            key={route.key}
            route={route}
            descriptor={descriptor}
            previousDescriptor={previousDescriptor}
            parentHeaderBack={parentHeaderBack}
            buildHref={buildHref}
            focused={isFocused}
            activityMode={activityMode}
            visible={isFocused || isNextScreenTransparent}
          />
        );
      })}
    </SafeAreaProviderCompat>
  );
}

type SceneViewProps = {
  route: NavigationRoute<ParamListBase, string>;
  descriptor: NativeStackDescriptor;
  previousDescriptor: NativeStackDescriptor | undefined;
  parentHeaderBack: React.ContextType<typeof HeaderBackContext>;
  buildHref: ReturnType<typeof useLinkBuilder>['buildHref'];
  focused: boolean;
  activityMode: 'normal' | 'inert' | 'paused';
  visible: boolean;
};

const SceneView = React.memo(function SceneView({
  route,
  descriptor,
  previousDescriptor,
  parentHeaderBack,
  buildHref,
  focused,
  activityMode,
  visible,
}: SceneViewProps) {
  const { options, navigation, render } = descriptor;

  // Sheets aren't supported on web, so the ref is never attached
  // But we still provide it so that `useFormSheet` works in shared code
  const parentSheetRef = React.use(FormSheetContext);
  const sheetRef = React.useRef<SheetCommands>(null);

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

  const content = (
    <Screen
      key={route.key}
      focused={focused}
      route={route}
      navigation={navigation}
      headerShown={headerShown}
      headerTransparent={headerTransparent}
      pageOverflowEnabled={presentation == null || presentation === 'card'}
      contentStyle={contentStyle}
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
                        icon={headerBackIcon}
                        onPress={navigation.goBack}
                      />
                    )
                  : headerLeft
            }
            headerTransparent={headerTransparent}
          />
        )
      }
      style={{
        ...(presentation != null &&
        TRANSPARENT_PRESENTATIONS.includes(presentation)
          ? { backgroundColor: 'transparent' }
          : null),
      }}
    >
      <HeaderBackContext.Provider value={headerBack}>
        <FormSheetContext.Provider value={parentSheetRef ?? sheetRef}>
          <AnimatedHeaderHeightProvider>
            {render()}
          </AnimatedHeaderHeightProvider>
        </FormSheetContext.Provider>
      </HeaderBackContext.Provider>
    </Screen>
  );

  return (
    <ActivityView
      mode={activityMode}
      visible={visible}
      style={StyleSheet.absoluteFill}
    >
      {content}
    </ActivityView>
  );
});

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
