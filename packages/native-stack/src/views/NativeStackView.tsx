import { SafeAreaProviderCompat } from '@react-navigation/elements';
import {
  ParamListBase,
  Route,
  StackActions,
  StackNavigationState,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  Screen,
  ScreenStack,
  StackPresentationTypes,
} from 'react-native-screens';
import warnOnce from 'warn-once';

import type {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
  NativeStackNavigationOptions,
} from '../types';
import DebugContainer from './DebugContainer';
import HeaderConfig from './HeaderConfig';

const isAndroid = Platform.OS === 'android';

const MaybeNestedStack = ({
  options,
  route,
  presentation,
  children,
}: {
  options: NativeStackNavigationOptions;
  route: Route<string>;
  presentation: Exclude<StackPresentationTypes, 'push'> | 'card';
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();
  const { headerShown = true, contentStyle } = options;

  const isHeaderInModal = isAndroid
    ? false
    : presentation !== 'card' && headerShown === true;

  const headerShownPreviousRef = React.useRef(headerShown);

  React.useEffect(() => {
    warnOnce(
      !isAndroid &&
        presentation !== 'card' &&
        headerShownPreviousRef.current !== headerShown,
      `Dynamically changing 'headerShown' in modals will result in remounting the screen and losing all local state. See options for the screen '${route.name}'.`
    );

    headerShownPreviousRef.current = headerShown;
  }, [headerShown, presentation, route.name]);

  const content = (
    <DebugContainer
      style={[
        styles.container,
        presentation !== 'transparentModal' &&
          presentation !== 'containedTransparentModal' && {
            backgroundColor: colors.background,
          },
        contentStyle,
      ]}
      stackPresentation={presentation === 'card' ? 'push' : presentation}
    >
      {children}
    </DebugContainer>
  );

  if (isHeaderInModal) {
    return (
      <ScreenStack style={styles.container}>
        <Screen enabled style={StyleSheet.absoluteFill}>
          <HeaderConfig {...options} route={route} />
          {content}
        </Screen>
      </ScreenStack>
    );
  }

  return content;
};

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

function NativeStackViewInner({ state, navigation, descriptors }: Props) {
  return (
    <ScreenStack style={styles.container}>
      {state.routes.map((route, index) => {
        const { options, render: renderScene } = descriptors[route.key];
        const {
          gestureEnabled,
          headerShown,
          animationTypeForReplace = 'pop',
          animation,
        } = options;

        let { presentation = 'card' } = options;

        if (index === 0) {
          // first screen should always be treated as `card`, it resolves problems with no header animation
          // for navigator with first screen as `modal` and the next as `card`
          presentation = 'card';
        }

        const isHeaderInPush = isAndroid
          ? headerShown
          : presentation === 'card' && headerShown !== false;

        return (
          <Screen
            key={route.key}
            enabled
            style={StyleSheet.absoluteFill}
            gestureEnabled={
              isAndroid
                ? // This prop enables handling of system back gestures on Android
                  // Since we handle them in JS side, we disable this
                  false
                : gestureEnabled
            }
            replaceAnimation={animationTypeForReplace}
            stackPresentation={presentation === 'card' ? 'push' : presentation}
            stackAnimation={animation}
            onWillAppear={() => {
              navigation.emit({
                type: 'transitionStart',
                data: { closing: false },
                target: route.key,
              });
            }}
            onWillDisappear={() => {
              navigation.emit({
                type: 'transitionStart',
                data: { closing: true },
                target: route.key,
              });
            }}
            onAppear={() => {
              navigation.emit({
                type: 'transitionEnd',
                data: { closing: false },
                target: route.key,
              });
            }}
            onDisappear={() => {
              navigation.emit({
                type: 'transitionEnd',
                data: { closing: true },
                target: route.key,
              });
            }}
            onDismissed={() => {
              navigation.dispatch({
                ...StackActions.pop(),
                source: route.key,
                target: state.key,
              });
            }}
          >
            <HeaderConfig
              {...options}
              route={route}
              headerShown={isHeaderInPush}
            />
            <MaybeNestedStack
              options={options}
              route={route}
              presentation={presentation}
            >
              {renderScene()}
            </MaybeNestedStack>
          </Screen>
        );
      })}
    </ScreenStack>
  );
}

export default function NativeStackView(props: Props) {
  return (
    <SafeAreaProviderCompat>
      <NativeStackViewInner {...props} />
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
