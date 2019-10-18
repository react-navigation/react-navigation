import * as React from 'react';
import { StackActions } from '@react-navigation/routers';

import HeaderSegment from './HeaderSegment';
import { StackHeaderProps, StackHeaderTitleProps } from '../../types';
import HeaderTitle from './HeaderTitle';

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
      onGoBack={
        previous
          ? () =>
              navigation.dispatch({
                ...StackActions.pop(),
                source: scene.route.key,
              })
          : undefined
      }
      styleInterpolator={styleInterpolator}
    />
  );
});
