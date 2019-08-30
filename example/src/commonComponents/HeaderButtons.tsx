import * as React from 'react';
import {
  HeaderButtons as DefaultHeaderButtons,
  Item,
} from 'react-navigation-header-buttons';

export class HeaderButtons extends React.PureComponent {
  static Item = Item;

  render() {
    return (
      <DefaultHeaderButtons
        // color={Platform.OS === 'ios' ? '#037aff' : 'black'}
        {...this.props}
      />
    );
  }
}
