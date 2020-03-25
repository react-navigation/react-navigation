// @ts-check

import * as React from 'react';

/**
 * @typedef {object} State
 * @prop {number} index
 * @prop {({ key: string } & (State | {}))[]} routes
 * @prop {boolean} [isTransitioning]
 *
 * @typedef {object} ParentPayload
 * @prop {string} type
 * @prop {object} action
 * @prop {State} state
 * @prop {State | {key: string, routes?: undefined, index?: undefined, isTransitioning?: undefined} | undefined | null} lastState
 * @prop {string} [context]
 *
 * @typedef {object} Payload
 * @prop {string} type
 * @prop {object} action
 * @prop {State | {key: string}} state
 * @prop {State | {key: string} | undefined | null} lastState
 * @prop {string} [context]
 *
 * @typedef {object} Props
 * @prop {object} navigation
 * @prop {Function} navigation.addListener
 * @prop {Function} navigation.removeListener
 * @prop {() => boolean} navigation.isFocused
 * @prop {() => object | undefined} navigation.dangerouslyGetParent
 * @prop {State} navigation.state
 * @prop {(target: string, type: string, data: any) => void} onEvent
 *
 * @extends {React.Component<Props>}
 */
export default class NavigationEventManager extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;

    this._actionSubscription = navigation.addListener(
      'action',
      this._handleAction
    );

    this._willFocusSubscription = navigation.addListener(
      'willFocus',
      this._handleWillFocus
    );

    this._willBlurSubscription = navigation.addListener(
      'willBlur',
      this._handleWillBlur
    );
  }

  componentWillUnmount() {
    this._actionSubscription?.remove();
    this._willFocusSubscription?.remove();
    this._willBlurSubscription?.remove();
  }

  /**
   * @type {{ remove(): void } | undefined}
   */
  _actionSubscription;

  /**
   * @type {{ remove(): void } | undefined}
   */
  _willFocusSubscription;

  /**
   * @type {{ remove(): void } | undefined}
   */
  _willBlurSubscription;

  /**
   * @type {string | undefined}
   */
  _lastWillBlurKey;

  /**
   * @type {string | undefined}
   */
  _lastWillFocusKey;

  /**
   * The 'action' event will fire when navigation state changes.
   * Detect if the focused route changed here and emit appropriate events.
   *
   * @param {ParentPayload} payload
   */
  _handleAction = ({ state, lastState, action, type, context }) => {
    const { navigation, onEvent } = this.props;

    // We should only emit events when the navigator is focused
    // When navigator is not focused, screens inside shouldn't receive focused status either
    if (!navigation.isFocused()) {
      return;
    }

    const previous = lastState
      ? lastState.routes?.[lastState.index]
      : undefined;
    const current = state.routes[state.index];

    const payload = {
      context: `${current.key}:${action.type}_${context || 'Root'}`,
      state: current,
      lastState: previous,
      action,
      type,
    };

    if (previous?.key !== current.key) {
      this._emitFocus(current.key, payload);

      if (previous?.key) {
        this._emitBlur(previous.key, payload);
      }
    }

    if (
      lastState?.isTransitioning !== state.isTransitioning &&
      state.isTransitioning === false
    ) {
      if (this._lastWillBlurKey) {
        onEvent(this._lastWillBlurKey, 'didBlur', payload);
      }

      if (this._lastWillFocusKey) {
        onEvent(this._lastWillFocusKey, 'didFocus', payload);
      }
    }

    onEvent(current.key, 'action', payload);
  };

  /**
   * @param {ParentPayload} payload
   */
  _handleWillFocus = ({ lastState, action, context, type }) => {
    const { navigation } = this.props;
    const route = navigation.state.routes[navigation.state.index];

    this._emitFocus(route.key, {
      context: `${route.key}:${action.type}_${context || 'Root'}`,
      state: route,
      lastState: lastState?.routes?.find((r) => r.key === route.key),
      action,
      type,
    });
  };

  /**
   * @param {ParentPayload} payload
   */
  _handleWillBlur = ({ lastState, action, context, type }) => {
    const { navigation } = this.props;
    const route = navigation.state.routes[navigation.state.index];

    this._emitBlur(route.key, {
      context: `${route.key}:${action.type}_${context || 'Root'}`,
      state: route,
      lastState: lastState?.routes?.find((r) => r.key === route.key),
      action,
      type,
    });
  };

  /**
   * @param {string} target
   * @param {Payload} payload
   */
  _emitFocus = (target, payload) => {
    if (this._lastWillBlurKey === target) {
      this._lastWillBlurKey = undefined;
    }

    if (this._lastWillFocusKey === target) {
      return;
    }

    this._lastWillFocusKey = target;

    const { navigation, onEvent } = this.props;

    onEvent(target, 'willFocus', payload);

    if (typeof navigation.state.isTransitioning !== 'boolean') {
      onEvent(target, 'didFocus', payload);
    }
  };

  /**
   * @param {string} target
   * @param {Payload} payload
   */
  _emitBlur = (target, payload) => {
    if (this._lastWillFocusKey === target) {
      this._lastWillFocusKey = undefined;
    }

    if (this._lastWillBlurKey === target) {
      return;
    }

    this._lastWillBlurKey = target;

    const { navigation, onEvent } = this.props;

    onEvent(target, 'willBlur', payload);

    if (typeof navigation.state.isTransitioning !== 'boolean') {
      onEvent(target, 'didBlur', payload);
    }
  };

  render() {
    return null;
  }
}
