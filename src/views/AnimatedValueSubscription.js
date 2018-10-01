export default class AnimatedValueSubscription {
  constructor(value, callback) {
    this._value = value;
    this._token = value.addListener(callback);
  }

  remove() {
    this._value.removeListener(this._token);
  }
}
