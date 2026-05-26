import * as React from 'react';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  // eslint-disable-next-line no-restricted-imports
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStandardNavigator } from 'standard-navigation';

export type MyStackOptions = {
  title?: string;
  rightButtonTitle?: string;
};

export type MyStackEventMap = {
  rightButtonPress: {
    data: { count: number };
    canPreventDefault: true;
  };
};

export type MyStackNavigatorProps = {
  preloadedCount: number;
  style?: StyleProp<ViewStyle>;
};

export const MyStackNavigator = createStandardNavigator<
  MyStackOptions,
  MyStackEventMap,
  MyStackNavigatorProps
>(({ state, descriptors, actions, emitter, preloadedCount, style }) => {
  const insets = useSafeAreaInsets();
  const countRef = React.useRef(0);

  return (
    <View style={[styles.container, style]}>
      {state.routes.map((route) => {
        const isFocused = route.key === state.routes[state.index]?.key;
        const descriptor = descriptors[route.key];

        return (
          <View
            key={route.key}
            style={[styles.screen, { display: isFocused ? 'flex' : 'none' }]}
          >
            <View style={[{ height: insets.top }, styles.inset]} />
            <View style={styles.header}>
              {state.index > 0 ? (
                <Pressable onPress={() => actions.back()} style={styles.button}>
                  <Text style={styles.label}>👈</Text>
                </Pressable>
              ) : null}
              <Text style={styles.title}>
                {descriptor?.options.title ?? route.name}
              </Text>
              <View style={styles.right}>
                {preloadedCount > 0 ? <Text>⌛ ({preloadedCount})</Text> : null}
                {descriptor?.options.rightButtonTitle ? (
                  <Pressable
                    onPress={() => {
                      emitter.emit({
                        type: 'rightButtonPress',
                        data: { count: ++countRef.current },
                        canPreventDefault: true,
                      });
                    }}
                    style={styles.button}
                  >
                    <Text style={styles.label}>
                      {descriptor.options.rightButtonTitle}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
            {descriptor?.render()}
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  button: {
    padding: 12,
  },
  inset: {
    backgroundColor: 'tomato',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 12,
    backgroundColor: 'tomato',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginHorizontal: 12,
  },
  label: {
    fontSize: 20,
    color: 'white',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
