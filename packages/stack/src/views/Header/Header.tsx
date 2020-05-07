import * as React from 'react';
import { StackActions } from '@react-navigation/native';

import HeaderSegment from './HeaderSegment';
import HeaderTitle from './HeaderTitle';
import debounce from '../../utils/debounce';
import { StackHeaderProps, StackHeaderTitleProps } from '../../types';

export default React.memo(function Header(props: StackHeaderProps) {
  const {
    scene,
    previous,
    layout,
    insets,
    navigation,
    styleInterpolator,
  } = props;
  const { options } = scene.descriptor;
  const title =
    typeof options.headerTitle !== 'function' &&
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  let leftLabel;

  // The label for the left back button shows the title of the previous screen
  // If a custom label is specified, we use it, otherwise use previous screen's title
  if (options.headerBackTitle !== undefined) {
    leftLabel = options.headerBackTitle;
  } else if (previous) {
    const o = previous.descriptor.options;

    leftLabel =
      typeof o.headerTitle !== 'function' && o.headerTitle !== undefined
        ? o.headerTitle
        : o.title !== undefined
        ? o.title
        : previous.route.name;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const goBack = React.useCallback(
    debounce(() => {
      if (navigation.isFocused() && navigation.canGoBack()) {
        navigation.dispatch({
          ...StackActions.pop(),
          source: scene.route.key,
        });
      }
    }, 50),
    [navigation, scene.route.key]
  );

  return (
    <HeaderSegment
      {...options}
      insets={insets}
      layout={layout}
      scene={scene}
      title={title}
      leftLabel={leftLabel}
      headerTitle={
        typeof options.headerTitle !== 'function'
          ? (props: StackHeaderTitleProps) => <HeaderTitle {...props} />
          : options.headerTitle
      }
      onGoBack={previous ? goBack : undefined}
      styleInterpolator={styleInterpolator}
    />
  );
});
