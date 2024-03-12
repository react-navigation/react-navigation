import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Drawer, useDrawerProgress } from 'react-native-drawer-layout';
import { Button, Text } from 'react-native-paper';
import Animated, {
  interpolate,
  // @ts-expect-error the type definitions are incomplete
  isConfigured,
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

export default function DrawerView() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useTheme();

  const [open, setOpen] = React.useState(false);
  const [legacy, setLegacy] = React.useState(isConfigured?.() ? false : true);
  const [drawerType, setDrawerType] =
    React.useState<(typeof DRAWER_TYPES)[number]>('front');
  const [drawerPosition, setDrawerPosition] = React.useState<'left' | 'right'>(
    'left'
  );

  return (
    <Drawer
      useLegacyImplementation={legacy}
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
        {!legacy && <RealDrawer />}
        <View style={styles.buttons}>
          <Button
            mode="contained"
            onPress={() => setOpen((prevOpen) => !prevOpen)}
          >
            {open ? 'Close' : 'Open'} drawer
          </Button>
          <Button
            mode="outlined"
            onPress={() =>
              setDrawerPosition((prevPosition) =>
                prevPosition === 'left' ? 'right' : 'left'
              )
            }
          >
            Change position ({drawerPosition})
          </Button>
          <Button
            mode="outlined"
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
          {isConfigured?.() ? (
            <Button
              mode="outlined"
              onPress={() => setLegacy((prevLegacy) => !prevLegacy)}
            >
              Change Reanimated ({legacy ? 1 : 2})
            </Button>
          ) : (
            <Text>Using Reanimated 1</Text>
          )}
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
    alignItems: 'center',
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
