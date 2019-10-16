import * as React from 'react';
import { StackActions } from 'react-navigation';
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
      typeof options.headerTitle !== 'function' &&
      options.headerTitle !== undefined
        ? options.headerTitle
        : options.title !== undefined
        ? options.title
        : scene.route.routeName;

    let leftLabel;

    // The label for the left back button shows the title of the previous screen
    // If a custom label is specified, we use it, otherwise use previous screen's title
    if (options.headerBackTitle !== undefined) {
      leftLabel = options.headerBackTitle;
    } else if (previous) {
      const o = previous.descriptor.options;

      leftLabel =
        typeof o.headerTitle !== 'function' && typeof o.headerTitle === 'string'
          ? o.headerTitle
          : o.title !== undefined
          ? o.title
          : previous.route.routeName;
    }

    return (
      <HeaderSegment
        {...options}
        layout={layout}
        scene={scene}
        title={title}
        leftLabel={leftLabel}
        onGoBack={
          previous
            ? () =>
                // @ts-ignore
                navigation.dispatch(StackActions.pop({ key: scene.route.key }))
            : undefined
        }
        styleInterpolator={styleInterpolator}
      />
    );
  }
}
