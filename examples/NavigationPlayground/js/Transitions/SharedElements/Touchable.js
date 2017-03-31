import React from 'react';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native';

const Touchable = props => {
  const Comp = (Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity);
  return <Comp {...props} />
}

export default Touchable;
