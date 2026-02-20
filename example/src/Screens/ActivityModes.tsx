import { Button, Text, useHeaderHeight } from '@react-navigation/elements';
import { ScreenContent } from '@react-navigation/elements/internal';
import { useTheme } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <View
      style={[
        styles.clock,
        { borderColor: colors.border, backgroundColor: colors.card },
      ]}
    >
      <Text style={[styles.time, { color: colors.text }]}>{formattedTime}</Text>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: colors.text,
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

  const [active, setActive] = useState(true);
  const [visible, setVisible] = useState(true);

  return (
    <View style={[styles.container, { marginTop: -headerHeight }]}>
      <ScreenContent active={active} visible={visible} style={styles.content}>
        <Content />
      </ScreenContent>
      <View style={styles.buttons}>
        <Button
          variant={active ? 'filled' : 'tinted'}
          onPress={() => setActive((active) => !active)}
        >
          Active
        </Button>
        <Button
          variant={visible ? 'filled' : 'tinted'}
          onPress={() => setVisible((visible) => !visible)}
        >
          Visible
        </Button>
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
const DOT_SIZE = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 24,
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
