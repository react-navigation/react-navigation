import * as React from 'react';
import useLatestCallback from 'use-latest-callback';

import type { DrawerProps } from '../types';
import { DrawerProgressContext } from '../utils/DrawerProgressContext';
import { getDrawerWidthWeb } from '../utils/getDrawerWidth';
import { useFakeSharedValue } from '../utils/useFakeSharedValue';
import { Overlay } from './Overlay';

export function Drawer({
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
}: DrawerProps<React.CSSProperties>) {
  const drawerWidth = getDrawerWidthWeb({
    drawerStyle: drawerStyle || {},
  });

  const progress = useFakeSharedValue(open ? 1 : 0);

  React.useEffect(() => {
    progress.set(open ? 1 : 0);
  }, [open, progress]);

  const drawerRef = React.useRef<HTMLDivElement>(null);

  const onTransitionStartLatest = useLatestCallback(() => {
    onTransitionStart?.(open === false);
  });

  const onTransitionEndLatest = useLatestCallback(() => {
    onTransitionEnd?.(open === false);
  });

  React.useEffect(() => {
    const element = drawerRef.current;

    element?.addEventListener('transitionstart', onTransitionStartLatest);
    element?.addEventListener('transitionend', onTransitionEndLatest);

    return () => {
      element?.removeEventListener('transitionstart', onTransitionStartLatest);
      element?.removeEventListener('transitionend', onTransitionEndLatest);
    };
  }, [onTransitionEndLatest, onTransitionStartLatest]);

  const isOpen = drawerType === 'permanent' ? true : open;
  const isRight = drawerPosition === 'right';

  const drawerTranslateX =
    // The drawer stays in place at open position when `drawerType` is `back`
    open || drawerType === 'back'
      ? drawerPosition === 'left'
        ? '100%'
        : '-100%'
      : 0;

  const drawerAnimatedStyle =
    drawerType !== 'permanent'
      ? {
          transition: 'transform 0.3s',
          transform: `translateX(${drawerTranslateX})`,
        }
      : null;

  const contentTranslateX = open
    ? // The screen content stays in place when `drawerType` is `front`
      drawerType === 'front'
      ? 0
      : `calc(${drawerWidth} * ${drawerPosition === 'left' ? 1 : -1})`
    : 0;

  const contentAnimatedStyle =
    drawerType !== 'permanent'
      ? {
          transition: 'transform 0.3s',
          transform: `translateX(${contentTranslateX})`,
        }
      : null;

  const drawerElement = (
    <div
      key="drawer"
      ref={drawerRef}
      style={{
        ...styles.drawer,
        position: drawerType === 'permanent' ? 'relative' : 'absolute',
        zIndex: drawerType === 'back' ? -1 : 1,
        width: drawerWidth,
        ...(drawerType !== 'permanent'
          ? drawerPosition === 'right'
            ? { right: `calc(${drawerWidth} * -1)` }
            : { left: `calc(${drawerWidth} * -1)` }
          : null),
        ...drawerAnimatedStyle,
        ...drawerStyle,
      }}
    >
      <Inert enabled={drawerType !== 'permanent' && !isOpen}>
        {renderDrawerContent()}
      </Inert>
    </div>
  );

  const mainContent = (
    <div key="content" style={{ ...styles.content, ...contentAnimatedStyle }}>
      <Inert enabled={drawerType !== 'permanent' && isOpen}>{children}</Inert>
      {drawerType !== 'permanent' ? (
        <Overlay
          open={open}
          progress={progress}
          onPress={() => onClose()}
          style={overlayStyle}
          accessibilityLabel={overlayAccessibilityLabel}
        />
      ) : null}
    </div>
  );

  return (
    <DrawerProgressContext.Provider value={progress}>
      <div style={{ ...styles.container, ...style }}>
        {!isRight && drawerElement}
        {mainContent}
        {isRight && drawerElement}
      </div>
    </DrawerProgressContext.Provider>
  );
}

function Inert({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      inert={enabled}
      aria-hidden={enabled}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 'auto',
      }}
    >
      {children}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
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
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
} satisfies Record<string, React.CSSProperties>;
