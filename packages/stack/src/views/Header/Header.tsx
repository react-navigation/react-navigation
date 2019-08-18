import * as React from 'react';
import { StackActions } from '@react-navigation/core';
import HeaderSegment from './HeaderSegment';
import { HeaderProps } from '../../types';

export default class Header extends React.PureComponent<HeaderProps> {
  render() {
    const {
      scene,
      previous,
      layout,
      navigation,
      styleInterpolator,
    } = this.props;
    const { options } = scene.descriptor;
    const title =
      options.headerTitle !== undefined ? options.headerTitle : options.title;

    let leftLabel;

    if (options.headerBackTitle !== undefined) {
      leftLabel = options.headerBackTitle;
    } else {
      if (previous) {
        const opts = previous.descriptor.options;
        leftLabel =
          opts.headerTitle !== undefined ? opts.headerTitle : opts.title;
      }
    }

    return (
      <HeaderSegment
        {...options}
        layout={layout}
        scene={scene}
        title={title}
        leftLabel={leftLabel}
        onGoBack={
          // TODO: use isFirstRouteInParent
          previous
            ? () =>
                navigation.dispatch(StackActions.pop({ key: scene.route.key }))
            : undefined
        }
        styleInterpolator={styleInterpolator}
      />
    );
  }
}
