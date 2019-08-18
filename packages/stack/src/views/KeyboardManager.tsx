import * as React from 'react';
import { TextInput, Keyboard } from 'react-native';

type Props = {
  enabled: boolean;
  children: (props: {
    onPageChangeStart: () => void;
    onPageChangeConfirm: () => void;
    onPageChangeCancel: () => void;
  }) => React.ReactNode;
};

export default class KeyboardManager extends React.Component<Props> {
  // Numeric id of the previously focused text input
  // When a gesture didn't change the tab, we can restore the focused input with this
  private previouslyFocusedTextInput: number | null = null;

  private handlePageChangeStart = () => {
    if (!this.props.enabled) {
      return;
    }

    const input = TextInput.State.currentlyFocusedField();

    // When a page change begins, blur the currently focused input
    TextInput.State.blurTextInput(input);

    // Store the id of this input so we can refocus it if change was cancelled
    this.previouslyFocusedTextInput = input;
  };

  private handlePageChangeConfirm = () => {
    if (!this.props.enabled) {
      return;
    }

    Keyboard.dismiss();

    // Cleanup the ID on successful page change
    this.previouslyFocusedTextInput = null;
  };

  private handlePageChangeCancel = () => {
    if (!this.props.enabled) {
      return;
    }

    // The page didn't change, we should restore the focus of text input
    const input = this.previouslyFocusedTextInput;

    if (input) {
      TextInput.State.focusTextInput(input);
    }

    this.previouslyFocusedTextInput = null;
  };

  render() {
    return this.props.children({
      onPageChangeStart: this.handlePageChangeStart,
      onPageChangeConfirm: this.handlePageChangeConfirm,
      onPageChangeCancel: this.handlePageChangeCancel,
    });
  }
}
