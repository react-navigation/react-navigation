import * as React from 'react';
import { StackActions, useNavigationState } from '@react-navigation/native';
import { getHeaderTitle, HeaderShownContext } from '@react-navigation/elements';

import HeaderSegment from './HeaderSegment';
import ModalPresentationContext from '../../utils/ModalPresentationContext';
import debounce from '../../utils/debounce';
import type { StackHeaderProps } from '../../types';

export default React.memo(function Header({
  back,
  layout,
  insets,
  progress,
  options,
  route,
  navigation,
  styleInterpolator,
}: StackHeaderProps) {
  let previousTitle;

  // The label for the left back button shows the title of the previous screen
  // If a custom label is specified, we use it, otherwise use previous screen's title
  if (options.headerBackTitle !== undefined) {
    previousTitle = options.headerBackTitle;
  } else if (back) {
    previousTitle = back.title;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const goBack = React.useCallback(
    debounce(() => {
      if (navigation.isFocused() && navigation.canGoBack()) {
        navigation.dispatch({
          ...StackActions.pop(),
          source: route.key,
        });
      }
    }, 50),
    [navigation, route.key]
  );

  const isModal = React.useContext(ModalPresentationContext);
  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const isFirstRouteInParent = useNavigationState(
    (state) => state.routes[0].key === route.key
  );

  const statusBarHeight =
    (isModal && !isFirstRouteInParent) || isParentHeaderShown ? 0 : insets.top;

  return (
    <HeaderSegment
      {...options}
      title={getHeaderTitle(options, route.name)}
      progress={progress}
      insets={insets}
      layout={layout}
      headerBackTitle={
        options.headerBackTitle !== undefined
          ? options.headerBackTitle
          : previousTitle
      }
      headerStatusBarHeight={statusBarHeight}
      onGoBack={back ? goBack : undefined}
      styleInterpolator={styleInterpolator}
    />
  );
});
