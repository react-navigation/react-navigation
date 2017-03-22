/* @flow */

import {
  PanResponder,
} from 'react-native';

import invariant from 'fbjs/lib/invariant';

import type {
  NavigationPanHandlers,
} from '../TypeDefinition';

const EmptyPanHandlers = {
  onMoveShouldSetPanResponder: null,
  onPanResponderGrant: null,
  onPanResponderMove: null,
  onPanResponderRelease: null,
  onPanResponderTerminate: null,
  onPanResponderTerminationRequest: null,
};

/**
 * Abstract class that defines the common interface of PanResponder that handles
 * the gesture actions.
 */
export default class AbstractPanResponder {

  panHandlers: NavigationPanHandlers;

  constructor() {
    const config = {};
    Object.keys(EmptyPanHandlers).forEach((name: string) => {
      const fn: any = (this: any)[name];

      invariant(
        typeof fn === 'function',
        'subclass of `NavigationAbstractPanResponder` must implement method %s',
        name
      );

      config[name] = fn.bind(this);
    }, this);

    this.panHandlers = PanResponder.create(config).panHandlers;
  }
}
