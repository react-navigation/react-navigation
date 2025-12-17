import { useActionSheet } from '@expo/react-native-action-sheet';
import { Button } from '@react-navigation/elements';
import {
  type PathConfig,
  type StaticScreenProps,
  useLocale,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';

import { DrawerProgress } from '../Shared/DrawerProgress';

const DRAWER_TYPES = ['front', 'back', 'slide', 'permanent'] as const;

type Params =
  | {
      type: (typeof DRAWER_TYPES)[number];
      position: 'left' | 'right';
    }
  | undefined;

const linking = {
  path: 'drawer-view',
  parse: {
    type: (type: string) => {
      if (
        type === 'front' ||
        type === 'back' ||
        type === 'slide' ||
        type === 'permanent'
      ) {
        return type;
      }

      return 'front';
    },
    position: (position: string) => {
      if (position === 'left' || position === 'right') {
        return position;
      }

      return 'left';
    },
  },
} satisfies PathConfig<Params>;

export function DrawerView(_: StaticScreenProps<Params>) {
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useTheme();
  const { direction } = useLocale();

  const navigation = useNavigation('DrawerView');
  const route = useRoute('DrawerView');

  const { type: drawerType = 'front', position: drawerPosition = 'left' } =
    route.params ?? {};

  const [open, setOpen] = React.useState(false);

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      direction={direction}
      drawerType={drawerType}
      drawerPosition={drawerPosition}
      renderDrawerContent={() => {
        return (
          <View style={styles.container}>
            <Button color="tomato" onPress={() => setOpen(false)}>
              Close
            </Button>
          </View>
        );
      }}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <DrawerProgress />
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() => setOpen((prevOpen) => !prevOpen)}
          >
            {open ? 'Close' : 'Open'} drawer
          </Button>
          <Button
            onPress={() =>
              navigation.setParams({
                position: drawerPosition === 'left' ? 'right' : 'left',
              })
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
                    navigation.setParams({
                      type: DRAWER_TYPES[index],
                    });
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
DrawerView.linking = linking;
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
});
