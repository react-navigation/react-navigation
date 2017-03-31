// @flow
import React, { Component } from 'react';
import {
  ListView,
  Image,
  View,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import faker from 'faker';
import _ from 'lodash';

import { Transition } from 'react-navigation';
import Touchable from './Touchable';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

const images = [
  require('./images/img1.jpg'),
  require('./images/img2.jpg'),
  require('./images/img3.jpg'),
  require('./images/img4.jpg'),
  require('./images/img5.jpg'),
  require('./images/img6.jpg'),
  require('./images/img7.jpg'),
  require('./images/img8.jpg'),
  require('./images/img9.jpg'),
  require('./images/img10.jpg'),
  require('./images/img11.jpg'),
  require('./images/img12.jpg'),
]

const photos = Array(50).fill(0).map(_ => ({
  url: faker.image.animals(500, 500, true),
  image: images[faker.random.number(images.length - 1)],
  title: faker.name.findName(),
  description: faker.lorem.paragraphs(10),
  comments: Array(20).fill(0).map(_ => (
    {
      author: faker.name.findName(),
      // avatar: avatars[faker.random.number(4)],
      comment: faker.lorem.sentence(),
      time: '12/21/2017',
    }
  ))
}));

const colCount = 3;

const { width: windowWidth } = Dimensions.get("window");
const margin = 2;
const photoWidth = (windowWidth - margin * colCount * 2) / colCount;

const photoRows = _.chunk(photos, colCount);

class PhotoGrid extends Component {
  static navigationOptions = {
    title: 'Photo Grid'
  }
  render() {
    return (
      <ListView
        dataSource={ds.cloneWithRows(photoRows)}
        renderRow={this.renderRow.bind(this)}
      />);
  }
  renderRow(photos) {
    return (
      <View style={styles.row}>
        {photos.map(this.renderCell.bind(this))}
      </View>
    )
  }
  renderCell(photo) {
    const onPhotoPressed = photo => this.props.navigation.navigate('PhotoDetail', { photo });
    return (
      <Touchable onPress={() => onPhotoPressed(photo)} key={photo.url}>
        <View style={styles.cell}>
          <Transition.Image id={`image-${photo.url}`}
            source={photo.image} style={styles.image} />
        </View>
      </Touchable>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    margin: 2,
  },
  image: {
    width: photoWidth,
    height: photoWidth,
  }
})

export default PhotoGrid;