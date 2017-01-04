/* @flow */

import React, { PureComponent, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TabBar from './TabBar';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  tablabel: {
    backgroundColor: 'transparent',
    color: 'white',
    margin: 8,
  },
  indicator: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2,
  },
});

type DefaultProps = {
  getLabelText: (scene: Scene) => ?string;
}

type IndicatorProps = SceneRendererProps & {
  width: Animated.Valye;
}

type Props = SceneRendererProps & {
  getLabelText: (scene: Scene) => ?string;
  renderLabel?: (scene: Scene) => React.Element<*>;
  renderIndicator?: (props: IndicatorProps) => ?React.Element<*>;
  indicatorStyle?: any;
  labelStyle?: any;
}

export default class TabBarTop extends PureComponent<DefaultProps, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    getLabelText: PropTypes.func,
    renderLabel: PropTypes.func,
    indicatorStyle: View.propTypes.style,
    labelStyle: Text.propTypes.style,
  };

  static defaultProps = {
    getLabelText: ({ route }) => route.title ? route.title.toUpperCase() : null,
  };

  _renderLabel = (scene: Scene) => {
    const label = this.props.getLabelText(scene);
    if (typeof label !== 'string') {
      return null;
    }
    return <Text style={[ styles.tablabel, this.props.labelStyle ]}>{label}</Text>;
  };

  _renderIndicator = (props: IndicatorProps) => {
    const { width, position } = props;
    const translateX = Animated.multiply(position, width);
    return (
      <Animated.View
        style={[ styles.indicator, { width, transform: [ { translateX } ] }, this.props.indicatorStyle ]}
      />
    );
  };

  render() {
    const {
      renderLabel,
      renderIndicator,
      ...rest
    } = this.props;
    return (
      <TabBar
        {...rest}
        renderLabel={typeof renderLabel === 'undefined' ? this._renderLabel : renderLabel}
        renderIndicator={typeof renderIndicator === 'undefined' ? this._renderIndicator : renderIndicator}
      />
    );
  }
}
