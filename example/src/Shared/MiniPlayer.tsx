import { Ionicons } from '@expo/vector-icons';
import { Text } from '@react-navigation/elements';
import { Image, StyleSheet, View } from 'react-native';

import album10 from '../../assets/album-art/10.jpg';

export function MiniPlayer({ placement }: { placement: 'inline' | 'regular' }) {
  return (
    <View style={styles.miniPlayer}>
      <View style={styles.miniPlayerCoverContainer}>
        <Image source={album10} style={styles.miniPlayerCover} />
      </View>
      {placement === 'inline' ? (
        <View style={styles.miniPlayerButtons}>
          <Ionicons name="play-back" size={32} />
          <Ionicons name="play" size={32} />
          <Ionicons name="play-forward" size={32} />
        </View>
      ) : (
        <>
          <Text numberOfLines={1} style={styles.miniPlayerAlbumTitle}>
            Sgt Pepper's Lonely Hearts Club Band
          </Text>
          <View style={styles.miniPlayerButtons}>
            <Ionicons name="play" size={32} />
            <Ionicons name="play-forward" size={32} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginEnd: 16,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    margin: 12,
  },
  miniPlayer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  miniPlayerCoverContainer: {
    margin: 5,
  },
  miniPlayerCover: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: '50%',
  },
  miniPlayerAlbumTitle: {
    flexShrink: 1,
    alignSelf: 'center',
    marginStart: 10,
    fontWeight: 'bold',
  },
  miniPlayerButtons: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
});
