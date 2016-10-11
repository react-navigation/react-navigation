/* @flow */

import React, { Component, PropTypes } from 'react';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

type Props = SceneRendererProps & Scene & {
  renderScene: (scene: Scene) => ?React.Element<any>;
  style?: any;
}

let warned = false;

export default class TabViewPage extends Component<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    renderScene: PropTypes.func.isRequired,
    style: PropTypes.any,
  };

  componentWillMount() {
    if (warned) {
      return;
    }

    console.warn('`<TabViewPage />` is deprecated. Pass the `renderScene` prop to `<TabViewAnimated />` instead.');
    warned = true;
  }

  render() {
    const { renderScene, ...rest } = this.props;
    return renderScene(rest);
  }
}
