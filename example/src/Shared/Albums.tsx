/* eslint-disable import/no-commonjs */

import * as React from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ScrollViewProps,
  Dimensions,
  Platform,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

const COVERS = [
  require('../../assets/album-art-01.jpg'),
  require('../../assets/album-art-02.jpg'),
  require('../../assets/album-art-03.jpg'),
  require('../../assets/album-art-04.jpg'),
  require('../../assets/album-art-05.jpg'),
  require('../../assets/album-art-06.jpg'),
  require('../../assets/album-art-07.jpg'),
  require('../../assets/album-art-08.jpg'),
  require('../../assets/album-art-09.jpg'),
  require('../../assets/album-art-10.jpg'),
  require('../../assets/album-art-11.jpg'),
  require('../../assets/album-art-12.jpg'),
  require('../../assets/album-art-13.jpg'),
  require('../../assets/album-art-14.jpg'),
  require('../../assets/album-art-15.jpg'),
  require('../../assets/album-art-16.jpg'),
  require('../../assets/album-art-17.jpg'),
  require('../../assets/album-art-18.jpg'),
  require('../../assets/album-art-19.jpg'),
  require('../../assets/album-art-20.jpg'),
  require('../../assets/album-art-21.jpg'),
  require('../../assets/album-art-22.jpg'),
  require('../../assets/album-art-23.jpg'),
  require('../../assets/album-art-24.jpg'),
];

export default function Albums(props: Partial<ScrollViewProps>) {
  const ref = React.useRef<ScrollView>(null);

  useScrollToTop(ref);

  return (
    <ScrollView ref={ref} contentContainerStyle={styles.content} {...props}>
      {COVERS.map((source, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={i} style={styles.item}>
          <Image source={source} style={styles.photo} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ...Platform.select({
    web: {
      content: {
        display: 'grid' as 'none',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      },
      item: {
        width: '100%',
      },
    },
    default: {
      content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      item: {
        height: Dimensions.get('window').width / 2,
        width: '50%',
      },
    },
  }),
  photo: {
    flex: 1,
    resizeMode: 'cover',
    paddingTop: '100%',
  },
});
