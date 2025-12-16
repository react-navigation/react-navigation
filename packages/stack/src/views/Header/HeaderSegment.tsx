import {
  getDefaultHeaderHeight,
  Header,
  HeaderBackButton,
  type HeaderBackButtonProps,
  HeaderTitle,
  useFrameSize,
} from '@react-navigation/elements';
import { useLocale } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

import type {
  SceneProgress,
  StackHeaderOptions,
  StackHeaderStyleInterpolator,
} from '../../types';

type Props = Omit<StackHeaderOptions, 'headerStatusBarHeight'> & {
  headerStatusBarHeight: number;
  title: string;
  modal: boolean;
  onGoBack?: () => void;
  backHref?: string;
  progress: SceneProgress;
  styleInterpolator: StackHeaderStyleInterpolator;
};

export function HeaderSegment(props: Props) {
  const { direction } = useLocale();
  const layout = useFrameSize((frame) => frame, true);

  const {
    progress,
    modal,
    onGoBack,
    backHref,
    headerTitle: title,
    headerLeft: left = onGoBack
      ? (props: HeaderBackButtonProps) => <HeaderBackButton {...props} />
      : undefined,
    headerRight: right,
    headerBackImage,
    headerBackTitle,
    headerBackButtonDisplayMode,
    headerBackTruncatedTitle,
    headerBackAccessibilityLabel,
    headerBackTestID,
    headerBackAllowFontScaling,
    headerBackTitleStyle,
    headerTitleContainerStyle,
    headerLeftContainerStyle,
    headerRightContainerStyle,
    headerBackgroundContainerStyle,
    headerStyle: customHeaderStyle,
    headerStatusBarHeight,
    styleInterpolator,
    ...rest
  } = props;

  const defaultHeight = getDefaultHeaderHeight({
    landscape: layout.width > layout.height,
    modalPresentation: modal,
    topInset: headerStatusBarHeight,
  });

  const { height = defaultHeight } = StyleSheet.flatten(
    customHeaderStyle || {}
  ) as ViewStyle;

  const headerHeight = typeof height === 'number' ? height : defaultHeight;

  const { titleStyle, leftButtonStyle, rightButtonStyle, backgroundStyle } =
    React.useMemo(
      () =>
        styleInterpolator({
          current: { progress: progress.current },
          next: progress.next && { progress: progress.next },
          direction,
          layouts: {
            header: {
              height: headerHeight,
              width: layout.width,
            },
            screen: layout,
          },
        }),
      [styleInterpolator, progress, direction, headerHeight, layout]
    );

  const headerLeft: StackHeaderOptions['headerLeft'] = left
    ? (props) =>
        left({
          ...props,
          href: backHref,
          backImage: headerBackImage,
          accessibilityLabel: headerBackAccessibilityLabel,
          testID: headerBackTestID,
          allowFontScaling: headerBackAllowFontScaling,
          onPress: onGoBack,
          label: headerBackTitle,
          truncatedLabel: headerBackTruncatedTitle,
          labelStyle: headerBackTitleStyle,
          canGoBack: Boolean(onGoBack),
        })
    : undefined;

  const headerRight: StackHeaderOptions['headerRight'] = right
    ? (props) =>
        right({
          ...props,
          canGoBack: Boolean(onGoBack),
        })
    : undefined;

  const headerTitle: StackHeaderOptions['headerTitle'] =
    typeof title !== 'function' ? (props) => <HeaderTitle {...props} /> : title;

  return (
    <Header
      modal={modal}
      headerTitle={headerTitle}
      headerLeft={headerLeft}
      headerRight={headerRight}
      headerTitleContainerStyle={[titleStyle, headerTitleContainerStyle]}
      headerLeftContainerStyle={[leftButtonStyle, headerLeftContainerStyle]}
      headerRightContainerStyle={[rightButtonStyle, headerRightContainerStyle]}
      headerBackButtonDisplayMode={headerBackButtonDisplayMode}
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
