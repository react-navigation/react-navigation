/* @flow */
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isIphoneX = (): boolean => {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812)
  );
};

export const isLandscape = (d: ?object): boolean => {
  if (d) return d.window.width > d.window.height;
  return width > height;
};
