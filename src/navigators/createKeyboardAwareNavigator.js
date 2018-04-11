import React from 'react';
import { TextInput } from 'react-native';

export default Navigator =>
  class KeyboardAwareNavigator extends React.Component {
    static router = Navigator.router;
    _previouslyFocusedTextInput = null;

    render() {
      return (
        <Navigator
          {...this.props}
          onGestureBegin={this._handleGestureBegin}
          onGestureCanceled={this._handleGestureCanceled}
          onGestureFinish={this._handleGestureFinish}
          onTransitionStart={this._handleTransitionStart}
        />
      );
    }

    _handleGestureBegin = () => {
      this._previouslyFocusedTextInput =
        TextInput.State.currentlyFocusedField();
      if (this._previouslyFocusedTextInput) {
        TextInput.State.blurTextInput(this._previouslyFocusedTextInput);
      }
    };

    _handleGestureCanceled = () => {
      if (this._previouslyFocusedTextInput) {
        TextInput.State.focusTextInput(this._previouslyFocusedTextInput);
      }
    };

    _handleGestureFinish = () => {
      this._previouslyFocusedTextInput = null;
    };

    _handleTransitionStart = () => {
      const currentField = TextInput.State.currentlyFocusedField();
      if (currentField) {
        TextInput.State.blurTextInput(currentField);
      }
    };
  };
