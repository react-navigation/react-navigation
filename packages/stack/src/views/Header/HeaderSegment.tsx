import * as React from 'react';
import {
  Animated,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import {
  Header,
  HeaderBackButton,
  HeaderShownContext,
  HeaderTitle,
  getDefaultHeaderHeight,
} from '@react-navigation/elements';
import memoize from '../../utils/memoize';
import type {
  Layout,
  StackHeaderStyleInterpolator,
  SceneProgress,
  StackHeaderOptions,
} from '../../types';

type Props = StackHeaderOptions & {
  layout: Layout;
  title: string;
  insets: EdgeInsets;
  onGoBack?: () => void;
  progress: SceneProgress;
  styleInterpolator: StackHeaderStyleInterpolator;
};

export default function HeaderSegment(props: Props) {
  const isParentHeaderShown = React.useContext(HeaderShownContext);

  const [leftLabelLayout, setLeftLabelLayout] = React.useState<
    Layout | undefined
  >(undefined);

  const [titleLayout, setTitleLayout] = React.useState<Layout | undefined>(
    undefined
  );

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
    onGoBack,
    headerTitle: title,
    headerLeft: left,
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

  const defaultHeight = getDefaultHeaderHeight(layout, headerStatusBarHeight);

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
    ? left
    : onGoBack
    ? (props) => (
        <HeaderBackButton
          {...props}
          backImage={headerBackImage}
          accessibilityLabel={headerBackAccessibilityLabel}
          testID={headerBackTestID}
          allowFontScaling={headerBackAllowFontScaling}
          onPress={onGoBack}
          labelVisible={headerBackTitleVisible}
          label={headerBackTitle}
          truncatedLabel={headerTruncatedBackTitle}
          labelStyle={[leftLabelStyle, headerBackTitleStyle]}
          onLabelLayout={handleLeftLabelLayout}
          screenLayout={layout}
          titleLayout={titleLayout}
          canGoBack={Boolean(onGoBack)}
        />
      )
    : undefined;

  const headerTitle: StackHeaderOptions['headerTitle'] =
    typeof title !== 'function'
      ? (props) => <HeaderTitle {...props} onLayout={handleTitleLayout} />
      : title;

  return (
    <Header
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
