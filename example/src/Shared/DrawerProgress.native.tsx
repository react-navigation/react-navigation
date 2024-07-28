import { StyleSheet, View } from 'react-native';
import { useDrawerProgress } from 'react-native-drawer-layout';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

export function DrawerProgress() {
  const progress = useDrawerProgress();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [56, 0]),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progress, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 72,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 8,
    bottom: 0,
    backgroundColor: '#ebdec1',
    borderColor: '#3e3a3a',
    borderWidth: 4,
    borderBottomWidth: 0,
    borderRadius: 2,
  },
});
