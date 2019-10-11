import debounce from 'debounce';
import React from 'react';
import { Animated, View } from 'react-native';

let _shouldEnableScreens = true;

export function enableScreens(shouldEnableScreens = true) {
  if (shouldEnableScreens) {
    console.warn(
      'react-native-screens is not fully supported on this platform yet.'
    );
  }
  _shouldEnableScreens = shouldEnableScreens;
}

export function screensEnabled() {
  return _shouldEnableScreens;
}

function isAnimatedValue(value) {
  return value && value.__getValue && value.addListener;
}

function isPropTruthy(prop) {
  let activeValue = prop;
  if (isAnimatedValue(prop)) {
    activeValue = prop.__getValue();
  }

  return !!activeValue;
}

export class Screen extends React.Component {
  static defaultProps = {
    active: true,
  };

  listenerId = null;

  constructor(props) {
    super(props);

    this._onAnimatedValueUpdated = debounce(this._onAnimatedValueUpdated, 10);
    this._addListener(props.active);
  }

  componentWillUnmount() {
    this._removeListener(this.props.active);
  }

  _addListener = possibleListener => {
    if (this.listenerId)
      throw new Error(
        'Screen: Attempting to observe an animated value while another value is already observed.'
      );
    if (isAnimatedValue(possibleListener)) {
      this.listenerId = possibleListener.addListener(
        this._onAnimatedValueUpdated
      );
    }
  };

  _removeListener = possibleListener => {
    if (isAnimatedValue(possibleListener)) {
      possibleListener.removeListener(this.listenerId);
      this.listenerId = null;
    }
  };

  shouldComponentUpdate({ active: nextActive }) {
    const { active } = this.props;
    if (nextActive !== active) {
      this._removeListener(active);
      this._addListener(nextActive);
      this._updateDisplay(isPropTruthy(nextActive));
      return false;
    }
    return true;
  }

  _onAnimatedValueUpdated = ({ value }) => {
    this._updateDisplay(!!value);
  };

  _updateDisplay = isActive => {
    if (isActive === undefined) {
      isActive = isPropTruthy(this.props.active);
    }
    const display = isActive ? 'flex' : 'none';
    this.setNativeProps({ style: { display } });
  };

  setNativeProps = nativeProps => {
    if (this._view) {
      this._view.setNativeProps(nativeProps);
    }
  };

  _setRef = view => {
    this._view = view;
    this._updateDisplay();
  };

  render() {
    return <Animated.View {...this.props} ref={this._setRef} />;
  }
}

export const ScreenContainer = View;

export const NativeScreen = View;

export const NativeScreenContainer = View;
