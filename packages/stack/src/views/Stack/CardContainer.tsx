import {
  getHeaderTitle,
  HeaderBackContext,
  HeaderHeightContext,
  HeaderShownContext,
} from '@react-navigation/elements';
import {
  type Route,
  useLinkBuilder,
  useLocale,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import type { Layout, Scene } from '../../types';
import { ModalPresentationContext } from '../../utils/ModalPresentationContext';
import { useKeyboardManager } from '../../utils/useKeyboardManager';
import type { Props as HeaderContainerProps } from '../Header/HeaderContainer';
import { Card } from './Card';

type Props = {
  interpolationIndex: number;
  index: number;
  active: boolean;
  focused: boolean;
  opening: boolean;
  closing: boolean;
  modal: boolean;
  layout: Layout;
  gesture: Animated.Value;
  preloaded: boolean;
  scene: Scene;
  safeAreaInsetTop: number;
  safeAreaInsetRight: number;
  safeAreaInsetBottom: number;
  safeAreaInsetLeft: number;
  getPreviousScene: (props: { route: Route<string> }) => Scene | undefined;
  getFocusedRoute: () => Route<string>;
  renderHeader: (props: HeaderContainerProps) => React.ReactNode;
  onOpenRoute: (props: { route: Route<string> }) => void;
  onCloseRoute: (props: { route: Route<string> }) => void;
  onTransitionStart: (
    props: { route: Route<string> },
    closing: boolean
  ) => void;
  onTransitionEnd: (props: { route: Route<string> }, closing: boolean) => void;
  onGestureStart: (props: { route: Route<string> }) => void;
  onGestureEnd: (props: { route: Route<string> }) => void;
  onGestureCancel: (props: { route: Route<string> }) => void;
  hasAbsoluteFloatHeader: boolean;
  headerHeight: number;
  onHeaderHeightChange: (props: {
    route: Route<string>;
    height: number;
  }) => void;
  isParentHeaderShown: boolean;
  isNextScreenTransparent: boolean;
  detachCurrentScreen: boolean;
};

const EPSILON = 0.1;

function CardContainerInner({
  interpolationIndex,
  index,
  active,
  opening,
  closing,
  gesture,
  focused,
  modal,
  getPreviousScene,
  getFocusedRoute,
  hasAbsoluteFloatHeader,
  headerHeight,
  onHeaderHeightChange,
  isParentHeaderShown,
  isNextScreenTransparent,
  detachCurrentScreen,
  layout,
  onCloseRoute,
  onOpenRoute,
  onGestureCancel,
  onGestureEnd,
  onGestureStart,
  onTransitionEnd,
  onTransitionStart,
  preloaded,
  renderHeader,
  safeAreaInsetBottom,
  safeAreaInsetLeft,
  safeAreaInsetRight,
  safeAreaInsetTop,
  scene,
}: Props) {
  const { direction } = useLocale();

  const parentHeaderHeight = React.useContext(HeaderHeightContext);

  const { onPageChangeStart, onPageChangeCancel, onPageChangeConfirm } =
    useKeyboardManager(
      React.useCallback(() => {
        const { options, navigation } = scene.descriptor;

        return (
          navigation.isFocused() && options.keyboardHandlingEnabled !== false
        );
      }, [scene.descriptor])
    );

  const handleOpen = () => {
    const { route } = scene.descriptor;

    onTransitionEnd({ route }, false);
    onOpenRoute({ route });
  };

  const handleClose = () => {
    const { route } = scene.descriptor;

    onTransitionEnd({ route }, true);
    onCloseRoute({ route });
  };

  const handleGestureBegin = () => {
    const { route } = scene.descriptor;

    onPageChangeStart();
    onGestureStart({ route });
  };

  const handleGestureCanceled = () => {
    const { route } = scene.descriptor;

    onPageChangeCancel();
    onGestureCancel({ route });
  };

  const handleGestureEnd = () => {
    const { route } = scene.descriptor;

    onGestureEnd({ route });
  };

  const handleTransition = ({
    closing,
    gesture,
  }: {
    closing: boolean;
    gesture: boolean;
  }) => {
    const { route } = scene.descriptor;

    if (!gesture) {
      onPageChangeConfirm?.(true);
    } else if (active && closing) {
      onPageChangeConfirm?.(false);
    } else {
      onPageChangeCancel?.();
    }

    onTransitionStart?.({ route }, closing);
  };

  const insets = {
    top: safeAreaInsetTop,
    right: safeAreaInsetRight,
    bottom: safeAreaInsetBottom,
    left: safeAreaInsetLeft,
  };

  const { colors } = useTheme();

  const [pointerEvents, setPointerEvents] = React.useState<'box-none' | 'none'>(
    'box-none'
  );

  React.useEffect(() => {
    const listener = scene.progress.next?.addListener?.(
      ({ value }: { value: number }) => {
        setPointerEvents(value <= EPSILON ? 'box-none' : 'none');
      }
    );

    return () => {
      if (listener) {
        scene.progress.next?.removeListener?.(listener);
      }
    };
  }, [pointerEvents, scene.progress.next]);

  const {
    presentation,
    animation,
    cardOverlay,
    cardOverlayEnabled,
    cardShadowEnabled,
    cardStyle,
    cardStyleInterpolator,
    gestureDirection,
    gestureEnabled,
    gestureResponseDistance,
    gestureVelocityImpact,
    headerMode,
    headerShown,
    transitionSpec,
  } = scene.descriptor.options;

  const { buildHref } = useLinkBuilder();
  const previousScene = getPreviousScene({ route: scene.descriptor.route });

  let backTitle: string | undefined;
  let href: string | undefined;

  if (previousScene) {
    const { options, route } = previousScene.descriptor;

    backTitle = getHeaderTitle(options, route.name);
    href = buildHref(route.name, route.params);
  }

  const canGoBack = previousScene != null;
  const headerBack = React.useMemo(() => {
    if (canGoBack) {
      return {
        href,
        title: backTitle,
      };
    }

    return undefined;
  }, [canGoBack, backTitle, href]);

  return (
    <Card
      interpolationIndex={interpolationIndex}
      gestureDirection={gestureDirection}
      layout={layout}
      insets={insets}
      direction={direction}
      gesture={gesture}
      current={scene.progress.current}
      next={scene.progress.next}
      opening={opening}
      closing={closing}
      onOpen={handleOpen}
      onClose={handleClose}
      overlay={cardOverlay}
      overlayEnabled={cardOverlayEnabled}
      shadowEnabled={cardShadowEnabled}
      onTransition={handleTransition}
      onGestureBegin={handleGestureBegin}
      onGestureCanceled={handleGestureCanceled}
      onGestureEnd={handleGestureEnd}
      gestureEnabled={index === 0 ? false : gestureEnabled}
      gestureResponseDistance={gestureResponseDistance}
      gestureVelocityImpact={gestureVelocityImpact}
      transitionSpec={transitionSpec}
      styleInterpolator={cardStyleInterpolator}
      accessibilityElementsHidden={!focused}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
      pointerEvents={active ? 'box-none' : pointerEvents}
      pageOverflowEnabled={headerMode !== 'float' && presentation !== 'modal'}
      preloaded={preloaded}
      containerStyle={
        hasAbsoluteFloatHeader && headerMode !== 'screen'
          ? { marginTop: headerHeight }
          : null
      }
      contentStyle={[
        {
          backgroundColor:
            presentation === 'transparentModal'
              ? 'transparent'
              : colors.background,
        },
        cardStyle,
      ]}
      style={[
        {
          // This is necessary to avoid unfocused larger pages increasing scroll area
          // The issue can be seen on the web when a smaller screen is pushed over a larger one
          overflow: active ? undefined : 'hidden',
          display:
            // Hide unfocused screens when animation isn't enabled
            // This is also necessary for a11y on web
            animation === 'none' &&
            isNextScreenTransparent === false &&
            detachCurrentScreen !== false &&
            !focused
              ? 'none'
              : 'flex',
        },
        StyleSheet.absoluteFill,
      ]}
    >
      <View style={styles.container}>
        <ModalPresentationContext.Provider value={modal}>
          {headerMode !== 'float'
            ? renderHeader({
                mode: 'screen',
                layout,
                scenes: [previousScene, scene],
                getPreviousScene,
                getFocusedRoute,
                onContentHeightChange: onHeaderHeightChange,
                style: styles.header,
              })
            : null}
          <View style={styles.scene}>
            <HeaderBackContext.Provider value={headerBack}>
              <HeaderShownContext.Provider
                value={isParentHeaderShown || headerShown !== false}
              >
                <HeaderHeightContext.Provider
                  value={
                    headerShown !== false
                      ? headerHeight
                      : parentHeaderHeight ?? 0
                  }
                >
                  {scene.descriptor.render()}
                </HeaderHeightContext.Provider>
              </HeaderShownContext.Provider>
            </HeaderBackContext.Provider>
          </View>
        </ModalPresentationContext.Provider>
      </View>
    </Card>
  );
}

export const CardContainer = React.memo(CardContainerInner);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    zIndex: 1,
  },
  scene: {
    flex: 1,
  },
});
