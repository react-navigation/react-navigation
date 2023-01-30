import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Drawer, useDrawerProgress } from 'react-native-drawer-layout';
import { Button } from 'react-native-paper';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const RealDrawer = () => {
  const progress = useDrawerProgress() as SharedValue<number>;

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
    <View style={styles.realDrawerWrapper}>
      <Animated.View style={[styles.realDrawer, animatedStyle]} />
    </View>
  );
};

export default function TabViewStackScreen() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="front"
      renderDrawerContent={() => {
        return (
          <View style={styles.container}>
            <Button onPress={() => setOpen(false)}>Close drawer</Button>
          </View>
        );
      }}
    >
      <View style={styles.container}>
        <RealDrawer />
        <Button onPress={() => setOpen((prevOpen) => !prevOpen)}>
          {open ? 'Close' : 'Open'} drawer
        </Button>
      </View>
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  realDrawerWrapper: {
    width: 64,
    height: 72,
    marginBottom: 8,
    overflow: 'hidden',
  },
  realDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 8,
    bottom: 0,
    backgroundColor: '#ebdec1',
    borderColor: '#3e3a3a',
    borderWidth: 4,
    borderBottomWidth: 0,
    borderRadius: 2,
  },
});
