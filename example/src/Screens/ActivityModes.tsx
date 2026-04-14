import {
  PlatformPressable,
  Text,
  useHeaderHeight,
} from '@react-navigation/elements';
import { ActivityView } from '@react-navigation/elements/internal';
import { useTheme } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { SegmentedPicker } from '../Shared/SegmentedPicker';

function Content() {
  const { colors } = useTheme();
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [dotAnim]);

  const [time, setTime] = useState(() => new Date());
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = new Date(
    time.getTime() + offset * 1000 * 60 * 60
  ).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <View
      style={[
        styles.clock,
        { borderColor: colors?.border, backgroundColor: colors?.card },
      ]}
    >
      <Text style={[styles.time, { color: colors?.text }]}>
        {formattedTime}
      </Text>
      <View style={styles.buttons}>
        <PlatformPressable onPress={() => setOffset((o) => --o)}>
          <Text style={styles.button}>↓</Text>
        </PlatformPressable>
        <PlatformPressable onPress={() => setOffset((o) => ++o)}>
          <Text style={styles.button}>↑</Text>
        </PlatformPressable>
      </View>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: colors?.text,
            transform: [
              {
                translateX: dotAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, CLOCK_SIZE - SPACING * 2 - DOT_SIZE],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

export function ActivityModes() {
  const headerHeight = useHeaderHeight();

  const [mode, setMode] =
    useState<React.ComponentProps<typeof ActivityView>['mode']>('normal');

  const [visible, setVisible] = useState(true);

  return (
    <View style={[styles.container, { marginTop: -headerHeight }]}>
      <ActivityView mode={mode} visible={visible} style={styles.content}>
        <Content />
      </ActivityView>
      <View style={styles.controls}>
        <SegmentedPicker
          choices={[
            { label: 'Normal', value: 'normal' },
            { label: 'Inert', value: 'inert' },
            { label: 'Paused', value: 'paused' },
          ]}
          value={mode}
          onValueChange={(value) => setMode(value)}
        />
        <SegmentedPicker
          choices={[
            { label: 'Visible', value: true },
            { label: 'Hidden', value: false },
          ]}
          value={visible}
          onValueChange={(value) => setVisible(value)}
        />
      </View>
    </View>
  );
}

ActivityModes.title = 'Activity Modes';
ActivityModes.linking = {};
ActivityModes.options = {
  headerShown: true,
};

const SPACING = 16;
const CLOCK_SIZE = 160;
const CLOCK_FONT_SIZE = 24;
const BUTTON_FONT_SIZE = 18;
const DOT_SIZE = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING,
  },
  buttons: {
    position: 'absolute',
    flexDirection: 'row',
    marginTop: CLOCK_FONT_SIZE + BUTTON_FONT_SIZE + SPACING,
  },
  button: {
    fontSize: BUTTON_FONT_SIZE,
    fontWeight: '600',
    opacity: 0.5,
    margin: SPACING / 2,
  },
  controls: {
    alignItems: 'center',
    gap: SPACING / 2,
  },
  content: {
    minHeight: CLOCK_SIZE,
    margin: SPACING,
  },
  clock: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  time: {
    fontSize: CLOCK_FONT_SIZE,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  dot: {
    position: 'absolute',
    bottom: SPACING,
    left: SPACING,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    opacity: 0.3,
  },
});
