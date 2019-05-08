import DefaultHeaderButtons from 'react-navigation-header-buttons';
import * as React from 'react';
import { Platform } from 'react-native';

export class HeaderButtons extends React.PureComponent {
  static Item = DefaultHeaderButtons.Item;

  render() {
    return (
      <DefaultHeaderButtons
        // color={Platform.OS === 'ios' ? '#037aff' : 'black'}
        {...this.props}
      />
    );
  }
}
