import { Dimensions, Platform } from 'react-native';

let dimen = Dimensions.get('window');

export const isIphoneX = 
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812);