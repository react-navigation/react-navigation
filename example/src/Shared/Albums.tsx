/* eslint-disable import/no-commonjs */

import { useScrollToTop } from '@react-navigation/native';
import * as React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScaledSize,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';

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
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));

  React.useEffect(() => {
    const onDimensionsChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };

    Dimensions.addEventListener('change', onDimensionsChange);

    return () => Dimensions.removeEventListener('change', onDimensionsChange);
  }, []);

  const ref = React.useRef<ScrollView>(null);

  useScrollToTop(ref);

  const itemSize = dimensions.width / Math.floor(dimensions.width / 150);

  return (
    <ScrollView ref={ref} contentContainerStyle={styles.content} {...props}>
      {COVERS.map((source, i) => (
        <View
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          style={[
            styles.item,
            Platform.OS !== 'web' && {
              height: itemSize,
              width: itemSize,
            },
          ]}
        >
          <Image source={source} style={styles.photo} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    },
  }),
  photo: {
    flex: 1,
    resizeMode: 'cover',
    paddingTop: '100%',
  },
});
