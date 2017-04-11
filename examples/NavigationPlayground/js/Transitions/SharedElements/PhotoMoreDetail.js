// @flow
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  Easing,
  TouchableNativeFeedback,
} from 'react-native';

import { Transition } from 'react-navigation';

const { width: windowWidth } = Dimensions.get("window");

const PhotoMoreDetail = (props) => {
  const { photo: { url, title, description, image } } = props.navigation.state.params;
  return (
    <View>
      <ScrollView>
        <View>
          <View style={styles.container}>
            <Transition.SharedElement.Text id={`title-${url}`} style={[styles.text, styles.title]}>{title}</Transition.SharedElement.Text>
            <Transition.SharedElement.Image id={`image-${url}`} source={image} style={styles.image} />
          </View>
          <Text style={[styles.text]}>{description}</Text>
        </View>
      </ScrollView>
    </View>
  )
};

PhotoMoreDetail.navigationOptions = {
  title: 'Photo More Detail',
}

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 160,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  text: {
    margin: 15,
  },
  container: {
    flexDirection: 'row',
  }
})

export default PhotoMoreDetail;