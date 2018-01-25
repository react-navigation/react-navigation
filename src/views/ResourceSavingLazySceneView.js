import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import SceneView from './SceneView';

const FAR_FAR_AWAY = 3000; // this should be big enough to move the whole view out of its container

export default class ResourceSavingLazySceneView extends React.PureComponent {
  state = {
    awake: false,
    visible: false,
  };

  componentWillMount() {
    this._actionListener = this.props.navigation.addListener(
      'action',
      this._onAction
    );
  }

  _onAction = payload => {
    // We do not care about transition complete events, they
    // won't actually change the state
    if (payload.action.type == 'Navigation/COMPLETE_TRANSITION') {
      return;
    }

    const { state } = payload;
    const { routes, index } = state;
    const key = this.props.childNavigation.state.key;

    if (routes[index].key === key) {
      console.log('show: ' + key);
      if (!this.state.visible) {
        let nextState = { visible: true };
        if (!this.state.awake) {
          nextState.awake = true;
        }
        this.setState(nextState);
      }
    } else {
      console.log('hide: ' + key);
      if (this.state.visible) {
        this.setState({ visible: false });
      }
    }
  };

  componentWillUnmount() {
    this._actionListener.remove();
  }

  render() {
    const { visible, awake } = this.state;
    const { childNavigation, navigation, ...rest } = this.props;

    return (
      <View
        style={styles.container}
        collapsable={false}
        removeClippedSubviews={!visible}
      >
        <View style={visible ? styles.innerAttached : styles.innerDetached}>
          {awake ? <SceneView {...rest} navigation={navigation} /> : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  innerAttached: {
    flex: 1,
  },
  innerDetached: {
    flex: 1,
    top: FAR_FAR_AWAY,
  },
});
