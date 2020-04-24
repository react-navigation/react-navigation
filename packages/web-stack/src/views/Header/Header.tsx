import * as React from 'react';
import { StackActions } from '@react-navigation/native';

import HeaderSegment from './HeaderSegment';
import HeaderTitle from './HeaderTitle';
import debounce from '../../utils/debounce';
import { WebStackHeaderProps, WebStackHeaderTitleProps } from '../../types';

export default React.memo(function Header({
  navigation,
  route,
  descriptor,
}: WebStackHeaderProps) {
  const { options } = descriptor;
  const title =
    typeof options.headerTitle !== 'function' &&
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : route.name;

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

  return (
    <HeaderSegment
      {...options}
      route={route}
      descriptor={descriptor}
      title={title}
      headerTitle={
        typeof options.headerTitle !== 'function'
          ? (props: WebStackHeaderTitleProps) => <HeaderTitle {...props} />
          : options.headerTitle
      }
      onGoBack={goBack}
    />
  );
});
