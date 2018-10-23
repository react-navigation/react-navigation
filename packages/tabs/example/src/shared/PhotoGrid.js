import * as React from 'react';
import { View, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { withNavigation } from '@react-navigation/core';

@withNavigation
class NavigationAwareScrollView extends React.Component {
  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this._isFocused = true;
    });

    this.props.navigation.addListener('willBlur', () => {
      this._isFocused = false;
    });

    this.props.navigation.addListener('refocus', () => {
      if (this._isFocused) {
        this._component.scrollTo({ x: 0, y: 0 });
      }
    });
  }

  setNativeProps(props) {
    this._component.setNativeProps(props);
  }

  _setComponentRef(c) {
    this._component = c;
  }

  getNode() {
    return this._component;
  }

  render() {
    return (
      <ScrollView
        {...this.props}
        ref={view => {
          this._component = view;
        }}
      />
    );
  }
}

export default function PhotoGrid({ id }) {
  const PHOTOS = Array.from({ length: 24 }).map(
    (_, i) => `https://unsplash.it/300/300/?random&__id=${id}${i}`
  );

  return (
    <NavigationAwareScrollView contentContainerStyle={styles.content}>
      {PHOTOS.map(uri => (
        <View key={uri} style={styles.item}>
          <Image source={{ uri }} style={styles.photo} />
        </View>
      ))}
    </NavigationAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
  },
  item: {
    height: Dimensions.get('window').width / 2,
    width: '50%',
    padding: 4,
  },
  photo: {
    flex: 1,
    resizeMode: 'cover',
  },
});
