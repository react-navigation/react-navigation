import { Easing } from 'react-native';

/**
 * Exact piecewise path for Android's fast-out-extra-slow-in easing.
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/interpolator/fast_out_extra_slow_in.xml
 */
const FAST_OUT_EXTRA_SLOW_IN_INITIAL = Easing.bezier(0.3, 0, 0.8, 0.15);
const FAST_OUT_EXTRA_SLOW_IN_FINAL = Easing.bezier(0.05, 0.7, 0.1, 1);

export const FAST_OUT_EXTRA_SLOW_IN = (t: number) => {
  const breakpoint = 1 / 6;

  if (t < breakpoint) {
    return 0.4 * FAST_OUT_EXTRA_SLOW_IN_INITIAL(t / breakpoint);
  }

  return (
    0.4 +
    0.6 * FAST_OUT_EXTRA_SLOW_IN_FINAL((t - breakpoint) / (1 - breakpoint))
  );
};

/**
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/core/res/res/interpolator/fast_out_slow_in.xml
 */
export const FAST_OUT_SLOW_IN = Easing.bezier(0.4, 0, 0.2, 1);

/**
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/core/res/res/interpolator/linear_out_slow_in.xml
 */
export const LINEAR_OUT_SLOW_IN = Easing.bezier(0, 0, 0.2, 1);

/**
 * See https://android.googlesource.com/platform/frameworks/base/+/android-9.0.0_r47/core/res/res/interpolator/activity_close_dim.xml
 */
export const ACTIVITY_CLOSE_DIM = Easing.bezier(0.33, 0, 1, 1);

export const decelerate = (power: number, t: number) => 1 - (1 - t) ** power;

export const accelerate = (power: number, t: number) => t ** power;

export const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Creates interpolation ranges for a property that follows its own timeline.
 *
 * @param options - Options for the property timeline.
 * @param options.duration - Total transition duration in milliseconds.
 * @param options.easing - Easing used by the transition.
 * @param options.closing - Whether the transition is closing.
 * @param options.stops - Times in milliseconds to include in the ranges.
 * @param options.output - Returns the property value at a time in milliseconds.
 */
export function timeline({
  duration,
  easing,
  closing = false,
  stops = [],
  output,
}: {
  duration: number;
  easing: (value: number) => number;
  closing?: boolean;
  stops?: number[];
  output: (time: number) => number;
}) {
  const times = [
    ...new Set([
      ...Array.from(
        { length: Math.floor(duration / 10) + 1 },
        (_, index) => index * 10
      ),
      ...stops,
      duration,
    ]),
  ].sort((a, b) => a - b);

  const points = times
    .map((time) => ({
      input: closing ? 1 - easing(time / duration) : easing(time / duration),
      output: output(time),
    }))
    .sort((a, b) => a.input - b.input);

  return {
    inputRange: points.map(({ input }) => input),
    outputRange: points.map(({ output }) => output),
    extrapolate: 'clamp' as const,
  };
}
