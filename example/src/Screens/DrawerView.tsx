import { useActionSheet } from '@expo/react-native-action-sheet';
import { Button } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Drawer, useDrawerProgress } from 'react-native-drawer-layout';
import Animated, {
  interpolate,
  type SharedValue,
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

const DRAWER_TYPES = ['front', 'back', 'slide'] as const;

export function DrawerView() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useTheme();

  const [open, setOpen] = React.useState(false);
  const [drawerType, setDrawerType] =
    React.useState<(typeof DRAWER_TYPES)[number]>('front');
  const [drawerPosition, setDrawerPosition] = React.useState<'left' | 'right'>(
    'left'
  );

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType={drawerType}
      drawerPosition={drawerPosition}
      renderDrawerContent={() => {
        return (
          <View style={styles.container}>
            <Button color="tomato" onPress={() => setOpen(false)}>
              Close drawer
            </Button>
          </View>
        );
      }}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <RealDrawer />
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() => setOpen((prevOpen) => !prevOpen)}
          >
            {open ? 'Close' : 'Open'} drawer
          </Button>
          <Button
            onPress={() =>
              setDrawerPosition((prevPosition) =>
                prevPosition === 'left' ? 'right' : 'left'
              )
            }
          >
            Change position ({drawerPosition})
          </Button>
          <Button
            onPress={() =>
              showActionSheetWithOptions(
                {
                  options: DRAWER_TYPES.map((option) => {
                    if (option === drawerType) {
                      return `${option} (current)`;
                    }

                    return option;
                  }),
                },
                (index) => {
                  if (index != null) {
                    setDrawerType(DRAWER_TYPES[index]);
                  }
                }
              )
            }
          >
            Change type ({drawerType})
          </Button>
        </View>
      </View>
    </Drawer>
  );
}

DrawerView.title = 'Drawer Layout';
DrawerView.linking = {};
DrawerView.options = {
  headerShown: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  buttons: {
    gap: 8,
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
