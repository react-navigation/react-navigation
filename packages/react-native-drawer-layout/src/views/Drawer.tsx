import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import useLatestCallback from 'use-latest-callback';

import type { DrawerProps } from '../types';
import { DrawerProgressContext } from '../utils/DrawerProgressContext';
import { getDrawerWidthWeb } from '../utils/getDrawerWidth';
import {
  getResponsiveValueBranches,
  toCSSMediaQuery,
} from '../utils/responsiveValue';
import { useFakeSharedValue } from '../utils/useFakeSharedValue';
import { Overlay } from './Overlay';

type DrawerType = 'front' | 'back' | 'slide' | 'permanent';

const getDrawerTypeStyles = ({
  className,
  drawerType,
  drawerPosition,
  drawerWidth,
}: {
  className: string;
  drawerType: DrawerType;
  drawerPosition: 'left' | 'right';
  drawerWidth: string;
}): string => {
  if (drawerType === 'permanent') {
    return `
.${className}-drawer, .${className}-drawer.open {
  position: relative;
  z-index: 1;
  left: auto;
  right: auto;
  visibility: visible;
  transition: none;
  transform: none;
}
.${className}-content, .${className}-content.open {
  transition: none;
  transform: none;
}
.${className}-overlay {
  display: none;
}`;
  }

  const drawerOffset = `calc(${drawerWidth} * -1)`;

  // The drawer stays in place at open position when `drawerType` is `back`
  const drawerTranslateX =
    drawerPosition === 'left' ? 'translateX(100%)' : 'translateX(-100%)';

  // The screen content stays in place when `drawerType` is `front`
  const contentTranslateX =
    drawerType === 'front'
      ? 'translateX(0)'
      : `translateX(calc(${drawerWidth} * ${drawerPosition === 'left' ? 1 : -1}))`;

  return `
.${className}-drawer {
  position: absolute;
  z-index: ${drawerType === 'back' ? -1 : 1};
  left: ${drawerPosition === 'left' ? drawerOffset : 'auto'};
  right: ${drawerPosition === 'right' ? drawerOffset : 'auto'};
  visibility: hidden;
  transition: transform 0.3s, visibility 0.3s;
  transform: ${drawerType === 'back' ? drawerTranslateX : 'translateX(0)'};
}
.${className}-drawer.open {
  visibility: visible;
  transform: ${drawerTranslateX};
}
.${className}-content {
  transition: transform 0.3s;
  transform: translateX(0);
}
.${className}-content.open {
  transform: ${contentTranslateX};
}
.${className}-overlay {
  display: contents;
}`;
};

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
}: DrawerProps) {
  const flattenedDrawerStyle = StyleSheet.flatten(drawerStyle) || {};
  const drawerWidth = getDrawerWidthWeb({
    drawerStyle: flattenedDrawerStyle,
  });

  const id = React.useId();
  const className = `rnd-${id.replace(/[^a-zA-Z0-9-]/g, '')}`;

  // The type is resolved with CSS media queries so the layout updates
  // without JavaScript when the dimensions of the screen change.
  // Branches are written in reverse order so that with the CSS cascade,
  // the first matching query in the object takes precedence.
  const css = [
    `
.${className}-drawer {
  display: flex;
  flex-direction: column;
  top: 0;
  bottom: 0;
  width: ${drawerWidth};
  max-width: 100%;
}
.${className}-content {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-width: 0;
}`,
    ...getResponsiveValueBranches(drawerType)
      .reverse()
      .map(({ query, value }) => {
        const rules = getDrawerTypeStyles({
          className,
          drawerType: value,
          drawerPosition,
          drawerWidth,
        });

        return query != null
          ? `@media ${toCSSMediaQuery(query)} {${rules}\n}`
          : rules;
      }),
  ].join('\n');

  const progress = useFakeSharedValue(open ? 1 : 0);

  React.useEffect(() => {
    progress.set(open ? 1 : 0);
  }, [open, progress]);

  const drawerRef = React.useRef<HTMLDivElement>(null);

  const onTransitionStartLatest = useLatestCallback((e: TransitionEvent) => {
    if (e.target === e.currentTarget && e.propertyName === 'transform') {
      onTransitionStart?.(open === false);
    }
  });

  const onTransitionEndLatest = useLatestCallback((e: TransitionEvent) => {
    if (e.target === e.currentTarget && e.propertyName === 'transform') {
      onTransitionEnd?.(open === false);
    }
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

  const isRight = drawerPosition === 'right';

  const drawerElement = (
    <div
      key="drawer"
      ref={drawerRef}
      className={`${className}-drawer${open ? ' open' : ''}`}
    >
      <View style={[styles.drawer, drawerStyle]}>{renderDrawerContent()}</View>
    </div>
  );

  const mainContent = (
    <div key="content" className={`${className}-content${open ? ' open' : ''}`}>
      {children}
      <div className={`${className}-overlay`}>
        <Overlay
          open={open}
          progress={progress}
          onPress={() => onClose()}
          style={overlayStyle}
          accessibilityLabel={overlayAccessibilityLabel}
        />
      </div>
    </div>
  );

  return (
    <DrawerProgressContext.Provider value={progress}>
      <View style={[styles.container, style]}>
        <style>{css}</style>
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
    flex: 1,
    backgroundColor: 'white',
  },
});
