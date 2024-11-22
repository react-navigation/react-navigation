import * as React from 'react';

class FakeSharedValue {
  _listeners = new Map<number, (value: number) => void>();
  _value: number;

  constructor(value: number) {
    this._value = value;
  }

  addListener(id: number, listener: (value: number) => void) {
    this._listeners.set(id, listener);
  }

  removeListener(id: number) {
    this._listeners.delete(id);
  }

  modify(modifier?: (value: number) => number) {
    this.value = modifier !== undefined ? modifier(this.value) : this.value;
  }

  get() {
    return this.value;
  }

  set(value: number) {
    this.value = value;
  }

  set value(value: number) {
    this._value = value;

    for (const listener of this._listeners.values()) {
      listener(value);
    }
  }

  get value() {
    return this._value;
  }

  _isReanimatedSharedValue = true;
}

/**
 * Compatibility layer for `useDrawerProgress` with `react-native-reanimated`
 */
export function useFakeSharedValue(value: number): FakeSharedValue {
  const sharedValue = React.useRef<FakeSharedValue | null>(null);

  if (sharedValue.current === null) {
    sharedValue.current = new FakeSharedValue(value);
  }

  return sharedValue.current;
}
