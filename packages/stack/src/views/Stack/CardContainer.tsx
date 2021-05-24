import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Route, useTheme } from '@react-navigation/native';
import {
  HeaderShownContext,
  HeaderHeightContext,
  HeaderBackContext,
  getHeaderTitle,
} from '@react-navigation/elements';
import type { Props as HeaderContainerProps } from '../Header/HeaderContainer';
import Card from './Card';
import { forModalPresentationIOS } from '../../TransitionConfigs/CardStyleInterpolators';
import ModalPresentationContext from '../../utils/ModalPresentationContext';
import useKeyboardManager from '../../utils/useKeyboardManager';
import type { Layout, Scene } from '../../types';

type Props = {
  index: number;
  interpolationIndex: number;
  active: boolean;
  focused: boolean;
  closing: boolean;
  layout: Layout;
  gesture: Animated.Value;
  scene: Scene;
  headerDarkContent: boolean | undefined;
  safeAreaInsetTop: number;
  safeAreaInsetRight: number;
  safeAreaInsetBottom: number;
  safeAreaInsetLeft: number;
  getPreviousScene: (props: { route: Route<string> }) => Scene | undefined;
  getFocusedRoute: () => Route<string>;
  renderHeader: (props: HeaderContainerProps) => React.ReactNode;
  renderScene: (props: { route: Route<string> }) => React.ReactNode;
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

function CardContainer({
  index,
  active,
  closing,
  gesture,
  focused,
  getPreviousScene,
  getFocusedRoute,
  headerDarkContent,
  hasAbsoluteFloatHeader,
  headerHeight,
  onHeaderHeightChange,
  isParentHeaderShown,
  isNextScreenTransparent,
  detachCurrentScreen,
  interpolationIndex,
  layout,
  onCloseRoute,
  onOpenRoute,
  onGestureCancel,
  onGestureEnd,
  onGestureStart,
  onTransitionEnd,
  onTransitionStart,
  renderHeader,
  renderScene,
  safeAreaInsetBottom,
  safeAreaInsetLeft,
  safeAreaInsetRight,
  safeAreaInsetTop,
  scene,
}: Props) {
  const parentHeaderHeight = React.useContext(HeaderHeightContext);

  const {
    onPageChangeStart,
    onPageChangeCancel,
    onPageChangeConfirm,
  } = useKeyboardManager(
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
    animationEnabled,
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

  const isModalPresentation = cardStyleInterpolator === forModalPresentationIOS;
  const previousScene = getPreviousScene({ route: scene.descriptor.route });

  let backTitle: string | undefined;

  if (previousScene) {
    const { options, route } = previousScene.descriptor;

    backTitle = getHeaderTitle(options, route.name);
  }

  const headerBack = React.useMemo(
    () => (backTitle !== undefined ? { title: backTitle } : undefined),
    [backTitle]
  );

  return (
    <Card
      interpolationIndex={interpolationIndex}
      gestureDirection={gestureDirection}
      layout={layout}
      insets={insets}
      gesture={gesture}
      current={scene.progress.current}
      next={scene.progress.next}
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
      headerDarkContent={headerDarkContent}
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
            animationEnabled === false &&
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
        <View style={styles.scene}>
          <HeaderBackContext.Provider value={headerBack}>
            <HeaderShownContext.Provider
              value={isParentHeaderShown || headerShown !== false}
            >
              <HeaderHeightContext.Provider
                value={headerShown ? headerHeight : parentHeaderHeight}
              >
                {renderScene({ route: scene.descriptor.route })}
              </HeaderHeightContext.Provider>
            </HeaderShownContext.Provider>
          </HeaderBackContext.Provider>
        </View>
        {headerMode !== 'float' ? (
          <ModalPresentationContext.Provider
            value={isModalPresentation && interpolationIndex !== 0}
          >
            {renderHeader({
              mode: 'screen',
              layout,
              scenes: [previousScene, scene],
              getPreviousScene,
              getFocusedRoute,
              onContentHeightChange: onHeaderHeightChange,
            })}
          </ModalPresentationContext.Provider>
        ) : null}
      </View>
    </Card>
  );
}

export default React.memo(CardContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  scene: {
    flex: 1,
  },
});
