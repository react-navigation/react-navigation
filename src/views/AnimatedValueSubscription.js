/* @flow */

import { Animated } from 'react-native';

export default class AnimatedValueSubscription {
  _value: Animated.Value;
  _token: string;

  constructor(value: Animated.Value, callback: Function) {
    this._value = value;
    this._token = value.addListener(callback);
  }

  remove(): void {
    this._value.removeListener(this._token);
  }
}
