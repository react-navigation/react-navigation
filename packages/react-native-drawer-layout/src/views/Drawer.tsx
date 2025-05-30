import * as React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import useLatestCallback from 'use-latest-callback';

import type { DrawerProps } from '../types';
import { DrawerProgressContext } from '../utils/DrawerProgressContext';
import { getDrawerWidth } from '../utils/getDrawerWidth';
import { useFakeSharedValue } from '../utils/useFakeSharedValue';
import { Overlay } from './Overlay';

export function Drawer({
  layout: customLayout,
  direction = 'ltr',
  drawerPosition = direction === 'rtl' ? 'right' : 'left',
  drawerStyle,
  drawerType = 'front',
  onClose,
  onTransitionStart,
  onTransitionEnd,
  open,
  overlayStyle,
  overlayAccessibilityLabel,
  renderDrawerContent,
  children,
  style,
}: DrawerProps) {
  const windowDimensions = useWindowDimensions();

  const drawerWidth = getDrawerWidth({
    layout: customLayout ?? windowDimensions,
    drawerStyle,
  });

  const progress = useFakeSharedValue(open ? 1 : 0);

  React.useEffect(() => {
    progress.value = open ? 1 : 0;
  }, [open, progress]);

  const drawerRef = React.useRef<View>(null);

  const onTransitionStartLatest = useLatestCallback(() => {
    onTransitionStart?.(open === false);
  });

  const onTransitionEndLatest = useLatestCallback(() => {
    onTransitionEnd?.(open === false);
  });

  React.useEffect(() => {
    const element = drawerRef.current as HTMLDivElement | null;

    element?.addEventListener('transitionstart', onTransitionStartLatest);
    element?.addEventListener('transitionend', onTransitionEndLatest);

    return () => {
      element?.removeEventListener('transitionstart', onTransitionStartLatest);
      element?.removeEventListener('transitionend', onTransitionEndLatest);
    };
  }, [onTransitionEndLatest, onTransitionStartLatest]);

  const isOpen = drawerType === 'permanent' ? true : open;
  const isRight = drawerPosition === 'right';

  const translateX =
    // The drawer stays in place at open position when `drawerType` is `back`
    open || drawerType === 'back'
      ? drawerPosition === 'left'
        ? drawerWidth
        : -drawerWidth
      : 0;

  const drawerAnimatedStyle =
    drawerType !== 'permanent'
      ? {
          transition: 'transform 0.3s',
          transform: [{ translateX }],
        }
      : null;

  const contentAnimatedStyle =
    drawerType !== 'permanent'
      ? {
          transition: 'transform 0.3s',
          transform: [
            {
              translateX: open
                ? // The screen content stays in place when `drawerType` is `front`
                  drawerType === 'front'
                  ? 0
                  : drawerWidth * (drawerPosition === 'left' ? 1 : -1)
                : 0,
            },
          ],
        }
      : null;

  const drawerElement = (
    <View
      key="drawer"
      ref={drawerRef}
      style={[
        styles.drawer,
        {
          width: drawerWidth,
          position: drawerType === 'permanent' ? 'relative' : 'absolute',
          zIndex: drawerType === 'back' ? -1 : 1,
        },
        drawerType !== 'permanent'
          ? // Position drawer off-screen by default in closed state
            // And add a translation only when drawer is open
            // So changing position in closed state won't trigger a visible transition
            drawerPosition === 'right'
            ? { right: -drawerWidth }
            : { left: -drawerWidth }
          : null,
        drawerAnimatedStyle,
        drawerStyle,
      ]}
    >
      {renderDrawerContent()}
    </View>
  );

  const mainContent = (
    <View key="content" style={[styles.content, contentAnimatedStyle]}>
      <View
        aria-hidden={isOpen && drawerType !== 'permanent'}
        style={styles.content}
      >
        {children}
      </View>
      {drawerType !== 'permanent' ? (
        <Overlay
          open={open}
          progress={progress}
          onPress={() => onClose()}
          style={overlayStyle}
          accessibilityLabel={overlayAccessibilityLabel}
        />
      ) : null}
    </View>
  );

  return (
    <DrawerProgressContext.Provider value={progress}>
      <View style={[styles.container, style]}>
        {!isRight && drawerElement}
        {mainContent}
        {isRight && drawerElement}
      </View>
    </DrawerProgressContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    top: 0,
    bottom: 0,
    maxWidth: '100%',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
});
