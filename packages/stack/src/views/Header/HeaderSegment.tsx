import {
  getDefaultHeaderHeight,
  Header,
  HeaderBackButton,
  HeaderBackButtonProps,
  HeaderShownContext,
  HeaderTitle,
} from '@react-navigation/elements';
import * as React from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

import type {
  Layout,
  SceneProgress,
  StackHeaderOptions,
  StackHeaderStyleInterpolator,
} from '../../types';
import memoize from '../../utils/memoize';

type Props = StackHeaderOptions & {
  layout: Layout;
  title: string;
  insets: EdgeInsets;
  modal: boolean;
  onGoBack?: () => void;
  progress: SceneProgress;
  styleInterpolator: StackHeaderStyleInterpolator;
};

export default function HeaderSegment(props: Props) {
  const isParentHeaderShown = React.useContext(HeaderShownContext);

  const [leftLabelLayout, setLeftLabelLayout] =
    React.useState<Layout | undefined>(undefined);

  const [titleLayout, setTitleLayout] =
    React.useState<Layout | undefined>(undefined);

  const handleTitleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    setTitleLayout((titleLayout) => {
      if (
        titleLayout &&
        height === titleLayout.height &&
        width === titleLayout.width
      ) {
        return titleLayout;
      }

      return { height, width };
    });
  };

  const handleLeftLabelLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    if (
      leftLabelLayout &&
      height === leftLabelLayout.height &&
      width === leftLabelLayout.width
    ) {
      return;
    }

    setLeftLabelLayout({ height, width });
  };

  const getInterpolatedStyle = memoize(
    (
      styleInterpolator: StackHeaderStyleInterpolator,
      layout: Layout,
      current: Animated.AnimatedInterpolation,
      next: Animated.AnimatedInterpolation | undefined,
      titleLayout: Layout | undefined,
      leftLabelLayout: Layout | undefined,
      headerHeight: number
    ) =>
      styleInterpolator({
        current: { progress: current },
        next: next && { progress: next },
        layouts: {
          header: {
            height: headerHeight,
            width: layout.width,
          },
          screen: layout,
          title: titleLayout,
          leftLabel: leftLabelLayout,
        },
      })
  );

  const {
    progress,
    insets,
    layout,
    modal,
    onGoBack,
    headerTitle: title,
    headerLeft: left = onGoBack
      ? (props: HeaderBackButtonProps) => <HeaderBackButton {...props} />
      : undefined,
    headerBackImage,
    headerBackTitle,
    headerBackTitleVisible,
    headerTruncatedBackTitle,
    headerBackAccessibilityLabel,
    headerBackTestID,
    headerBackAllowFontScaling,
    headerBackTitleStyle,
    headerTitleContainerStyle,
    headerLeftContainerStyle,
    headerRightContainerStyle,
    headerBackgroundContainerStyle,
    headerStyle: customHeaderStyle,
    headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top,
    styleInterpolator,
    ...rest
  } = props;

  const defaultHeight = getDefaultHeaderHeight(
    layout,
    modal,
    headerStatusBarHeight
  );

  const { height = defaultHeight } = StyleSheet.flatten(
    customHeaderStyle || {}
  ) as ViewStyle;

  const {
    titleStyle,
    leftButtonStyle,
    leftLabelStyle,
    rightButtonStyle,
    backgroundStyle,
  } = getInterpolatedStyle(
    styleInterpolator,
    layout,
    progress.current,
    progress.next,
    titleLayout,
    headerBackTitle ? leftLabelLayout : undefined,
    typeof height === 'number' ? height : defaultHeight
  );

  const headerLeft: StackHeaderOptions['headerLeft'] = left
    ? (props) =>
        left({
          ...props,
          backImage: headerBackImage,
          accessibilityLabel: headerBackAccessibilityLabel,
          testID: headerBackTestID,
          allowFontScaling: headerBackAllowFontScaling,
          onPress: onGoBack,
          labelVisible: headerBackTitleVisible,
          label: headerBackTitle,
          truncatedLabel: headerTruncatedBackTitle,
          labelStyle: [leftLabelStyle, headerBackTitleStyle],
          onLabelLayout: handleLeftLabelLayout,
          screenLayout: layout,
          titleLayout,
          canGoBack: Boolean(onGoBack),
        })
    : undefined;

  const headerTitle: StackHeaderOptions['headerTitle'] =
    typeof title !== 'function'
      ? (props) => <HeaderTitle {...props} onLayout={handleTitleLayout} />
      : (props) => title({ ...props, onLayout: handleTitleLayout });

  return (
    <Header
      modal={modal}
      layout={layout}
      headerTitle={headerTitle}
      headerLeft={headerLeft}
      headerTitleContainerStyle={[titleStyle, headerTitleContainerStyle]}
      headerLeftContainerStyle={[leftButtonStyle, headerLeftContainerStyle]}
      headerRightContainerStyle={[rightButtonStyle, headerRightContainerStyle]}
      headerBackgroundContainerStyle={[
        backgroundStyle,
        headerBackgroundContainerStyle,
      ]}
      headerStyle={customHeaderStyle}
      headerStatusBarHeight={headerStatusBarHeight}
      {...rest}
    />
  );
}
