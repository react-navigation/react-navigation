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
  ListView,
} from 'react-native';

import { Transition } from 'react-navigation';

import Touchable from './Touchable';

const { width: windowWidth } = Dimensions.get("window");

const PhotoDetail = (props) => {
  const { photo } = props.navigation.state.params;
  const { url, title, description, image, comments } = photo;
  const openMoreDetails = photo => props.navigation.navigate('PhotoMoreDetail', { photo });
  const renderHeader = () => (
    <View>
      <Transition.Image id={`image-${url}`} source={image} style={styles.image} />
      <View style={styles.titleContainer} onLayout={this._onLayout}>
        <Text style={[styles.text, styles.title]}>{title}</Text>
      </View>
      <Text style={[styles.text]}>{description}</Text>
    </View>
  );
  return (
    <View>
      <ListView dataSource={dsComments.cloneWithRows(comments)}
        renderRow={renderComment}
        renderHeader={renderHeader}
      />
    </View>
  )
};

PhotoDetail.navigationOptions = {
  title: 'Photo Detail'
}

const renderComment = ({ author, comment, avatar, time }) => (
  <View style={commentStyles.container}>
    <View style={commentStyles.textContainer}>
      <View style={commentStyles.authorContainer}>
        <Text>{author}</Text>
        <Text>{time}</Text>
      </View>
      <Text style={commentStyles.text}>{comment}</Text>
    </View>
  </View>
);

const dsComments = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});


const styles = StyleSheet.create({
  image: {
    width: windowWidth,
    height: windowWidth / 2,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  text: {
    margin: 15,
  }
});

const commentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
    height: 72,
  },
  textContainer: {
    flex: 1,
  },
  text: {
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default PhotoDetail;