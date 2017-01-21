/* @flow */

import React, { PureComponent } from 'react';
import TabBar from './TabBar';

export default class TabBarTop extends PureComponent<void, *, void> {
  componentWillMount() {
    console.warn('`TabBarTop` is removed. Use `TabBar` instead.');
  }

  render() {
    return <TabBar {...this.props} />;
  }
}
