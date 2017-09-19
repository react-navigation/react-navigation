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

export const isLandscape = (): boolean => {
  return width > height;
};
