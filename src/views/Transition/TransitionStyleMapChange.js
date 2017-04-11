// @flow
import type { TransitionStyleMap } from '../../TypeDefinition';

type Subscriber = (styleMap: ?TransitionStyleMap) => void;

export default class TransitionStyleMapChange {
  _subscriptions: Array<*>;
  constructor() {
    this._subscriptions = [];
  }
  subscribe(f: Subscriber) {
    this._subscriptions.push(f);
  }
  unsubscribe(f: Subscriber) {
    const idx = this._subscriptions.indexOf(f);
    if (idx >= 0) this._subscriptions.splice(idx, 1);
  }
  dispatch(styleMap: ?TransitionStyleMap) {
    this._subscriptions.forEach(f => f(styleMap));
  }
}