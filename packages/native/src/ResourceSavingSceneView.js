import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SceneView } from '@react-navigation/core';

const FAR_FAR_AWAY = 3000; // this should be big enough to move the whole view out of its container

class ResourceSavingSceneView extends React.PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isFocused && !prevState.awake) {
      return { awake: true };
    } else {
      return null;
    }
  }

  constructor(props) {
    super();

    this.state = {
      awake: props.lazy ? props.isFocused : true,
    };
  }

  _mustAlwaysBeVisible = () => {
    return this.props.animationEnabled || this.props.swipeEnabled;
  };

  render() {
    const { awake } = this.state;
    const {
      isFocused,
      childNavigation,
      removeClippedSubviews,
      ...rest
    } = this.props;

    return (
      <View
        style={styles.container}
        collapsable={false}
        removeClippedSubviews={
          Platform.OS === 'android'
            ? removeClippedSubviews
            : !isFocused && removeClippedSubviews
        }
      >
        <View
          style={
            this._mustAlwaysBeVisible() || isFocused
              ? styles.innerAttached
              : styles.innerDetached
          }
        >
          {awake ? <SceneView {...rest} navigation={childNavigation} /> : null}
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

export default ResourceSavingSceneView;
