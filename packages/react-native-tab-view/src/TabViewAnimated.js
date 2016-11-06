/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TabViewTransitioner from './TabViewTransitioner';
import TabViewPagerPan from './TabViewPagerPan';
import { NavigationStatePropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';
import type { TransitionerProps } from './TabViewTransitionerTypes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

type DefaultProps = {
  renderPager: (props: SceneRendererProps) => React.Element<*>;
}

type Props = TransitionerProps & {
  renderPager: (props: SceneRendererProps) => React.Element<*>;
  renderScene: (props: SceneRendererProps & Scene) => ?React.Element<*>;
  renderHeader?: (props: SceneRendererProps) => ?React.Element<*>;
  renderFooter?: (props: SceneRendererProps) => ?React.Element<*>;
  lazy?: boolean;
}

type State = {
  loaded: Array<number>;
}

export default class TabViewAnimated extends Component<DefaultProps, Props, State> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    renderPager: PropTypes.func.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    onChangePosition: PropTypes.func,
    shouldOptimizeUpdates: PropTypes.bool,
    lazy: PropTypes.bool,
  };

  static defaultProps = {
    renderPager: (props: SceneRendererProps) => {
      return <TabViewPagerPan {...props} />;
    },
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      loaded: [ this.props.navigationState.index ],
    };
  }

  state: State;

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.props.shouldOptimizeUpdates === false) {
      return true;
    } else {
      return shallowCompare(this, nextProps, nextState);
    }
  }

  _renderScene = (props: SceneRendererProps & Scene) => {
    const { renderScene, navigationState, lazy } = this.props;
    const { loaded } = this.state;
    if (lazy) {
      if (loaded.includes(navigationState.routes.indexOf(props.route))) {
        return renderScene(props);
      }
      return null;
    }
    return renderScene(props);
  };

  _renderItems = (props: SceneRendererProps) => {
    const { renderPager, renderHeader, renderFooter } = this.props;

    return (
      <View style={styles.container}>
        {renderHeader && renderHeader(props)}
        {renderPager({
          ...props,
          children: props.layout.measured ?
            props.navigationState.routes.map((route, index) => {
              return (
                <View key={route.key} style={{ width: props.layout.width }}>
                  {this._renderScene({
                    ...props,
                    route,
                    index,
                    focused: index === props.navigationState.index,
                  })}
                </View>
              );
            }) : null,
        })}
        {renderFooter && renderFooter(props)}
      </View>
    );
  };

  _handleChangePosition = (value: number) => {
    const { onChangePosition, navigationState, lazy } = this.props;
    if (onChangePosition) {
      onChangePosition(value);
    }
    const { loaded } = this.state;
    if (lazy) {
      let next = Math.ceil(value);
      if (next === navigationState.index) {
        next = Math.floor(value);
      }
      if (loaded.includes(next)) {
        return;
      }
      this.setState({
        loaded: [ ...loaded, next ],
      });
    }
  };

  render() {
    return (
      <TabViewTransitioner
        {...this.props}
        loaded={this.state.loaded}
        onChangePosition={this._handleChangePosition}
        render={this._renderItems}
      />
    );
  }
}
