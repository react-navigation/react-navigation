import { Button, Text } from '@react-navigation/elements';
import { CommonActions } from '@react-navigation/routers';
import { StyleSheet, View } from 'react-native';

export function NativeBottomTabs() {
  return (
    <View style={styles.container}>
      <Text>Not supported on this platform</Text>
      <Button action={CommonActions.goBack()}>Go back</Button>
    </View>
  );
}

NativeBottomTabs.title = 'Native Bottom Tabs';
NativeBottomTabs.linking = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
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
