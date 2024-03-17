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
  drawerPosition = 'left',
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

  const layout = customLayout ?? windowDimensions;
  const drawerWidth = getDrawerWidth({ layout, drawerStyle });

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

    if (element) {
      element.addEventListener('transitionstart', onTransitionStartLatest);
      element.addEventListener('transitionend', onTransitionEndLatest);
    }
  }, [onTransitionEndLatest, onTransitionStartLatest]);

  const isOpen = drawerType === 'permanent' ? true : open;
  const isRight = drawerPosition === 'right';

  const drawerAnimatedStyle =
    drawerType !== 'permanent'
      ? {
          transition: 'transform 0.3s',
          transform: [
            {
              // The drawer stays in place at open position when `drawerType` is `back`
              translateX:
                open || drawerType === 'back'
                  ? drawerPosition === 'left'
                    ? 0
                    : layout.width - drawerWidth
                  : drawerPosition === 'left'
                    ? -drawerWidth
                    : layout.width,
            },
          ],
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

  return (
    <View style={[styles.container, style]}>
      <DrawerProgressContext.Provider value={progress}>
        <View
          style={[
            styles.main,
            {
              flexDirection:
                drawerType === 'permanent' && !isRight ? 'row-reverse' : 'row',
            },
          ]}
        >
          <View style={[styles.content, contentAnimatedStyle]}>
            <View
              accessibilityElementsHidden={isOpen && drawerType !== 'permanent'}
              importantForAccessibility={
                isOpen && drawerType !== 'permanent'
                  ? 'no-hide-descendants'
                  : 'auto'
              }
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
          <View
            ref={drawerRef}
            style={[
              styles.drawer,
              {
                width: drawerWidth,
                position: drawerType === 'permanent' ? 'relative' : 'absolute',
                zIndex: drawerType === 'back' ? -1 : 0,
              },
              drawerAnimatedStyle,
              drawerStyle,
            ]}
          >
            {renderDrawerContent()}
          </View>
        </View>
      </DrawerProgressContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  main: {
    flex: 1,
  },
});
