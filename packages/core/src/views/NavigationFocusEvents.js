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

    this._didFocusSubscription = navigation.addListener(
      'didFocus',
      this._handleDidFocus
    );

    this._didBlurSubscription = navigation.addListener(
      'didBlur',
      this._handleDidBlur
    );

    this._refocusSubscription = navigation.addListener(
      'refocus',
      this._handleRefocus
    );
  }

  componentWillUnmount() {
    this._actionSubscription?.remove();
    this._willFocusSubscription?.remove();
    this._willBlurSubscription?.remove();
    this._didFocusSubscription?.remove();
    this._didBlurSubscription?.remove();
    this._refocusSubscription?.remove();
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
   * @type {{ remove(): void } | undefined}
   */
  _didFocusSubscription;

  /**
   * @type {{ remove(): void } | undefined}
   */
  _didBlurSubscription;

  /**
   * @type {{ remove(): void } | undefined}
   */
  _refocusSubscription;

  /**
   * @type {string | undefined}
   */
  _lastWillBlurKey;

  /**
   * @type {string | undefined}
   */
  _lastWillFocusKey;

  /**
   * @type {string | undefined}
   */
  _lastDidBlurKey;

  /**
   * @type {string | undefined}
   */
  _lastDidFocusKey;

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
      this._emitWillFocus(current.key, payload);

      if (previous?.key) {
        this._emitWillBlur(previous.key, payload);
      }
    }

    if (
      lastState?.isTransitioning !== state.isTransitioning &&
      state.isTransitioning === false
    ) {
      if (this._lastWillBlurKey) {
        this._emitDidBlur(this._lastWillBlurKey, payload);
      }

      if (this._lastWillFocusKey) {
        this._emitDidFocus(this._lastWillFocusKey, payload);
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

    this._emitWillFocus(route.key, {
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

    this._emitWillBlur(route.key, {
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
  _handleDidFocus = ({ lastState, action, context, type }) => {
    const { navigation } = this.props;

    if (this._lastWillFocusKey) {
      const route = navigation.state.routes.find(
        (r) => r.key === this._lastWillFocusKey
      );

      if (route) {
        this._emitDidFocus(route.key, {
          context: `${route.key}:${action.type}_${context || 'Root'}`,
          state: route,
          lastState: lastState?.routes?.find((r) => r.key === route.key),
          action,
          type,
        });
      }
    }
  };

  /**
   * @param {ParentPayload} payload
   */
  _handleDidBlur = ({ lastState, action, context, type }) => {
    const { navigation } = this.props;

    if (this._lastWillBlurKey) {
      const route = navigation.state.routes.find(
        (r) => r.key === this._lastWillBlurKey
      );

      if (route) {
        this._emitDidBlur(route.key, {
          context: `${route.key}:${action.type}_${context || 'Root'}`,
          state: route,
          lastState: lastState?.routes?.find((r) => r.key === route.key),
          action,
          type,
        });
      }
    }
  };

  _handleRefocus = () => {
    const { onEvent, navigation } = this.props;
    const route = navigation.state.routes[navigation.state.index];

    onEvent(route.key, 'refocus');
  };

  /**
   * @param {string} target
   * @param {Payload} payload
   */
  _emitWillFocus = (target, payload) => {
    if (this._lastWillBlurKey === target) {
      this._lastWillBlurKey = undefined;
    }

    if (this._lastWillFocusKey === target) {
      return;
    }

    this._lastDidFocusKey = undefined;
    this._lastWillFocusKey = target;

    const { navigation, onEvent } = this.props;

    onEvent(target, 'willFocus', payload);

    if (
      typeof navigation.state.isTransitioning !== 'boolean' ||
      (navigation.state.isTransitioning !== true &&
        !navigation.dangerouslyGetParent())
    ) {
      this._emitDidFocus(target, payload);
    }
  };

  /**
   * @param {string} target
   * @param {Payload} payload
   */
  _emitWillBlur = (target, payload) => {
    if (this._lastWillFocusKey === target) {
      this._lastWillFocusKey = undefined;
    }

    if (this._lastWillBlurKey === target) {
      return;
    }

    this._lastDidBlurKey = undefined;
    this._lastWillBlurKey = target;

    const { navigation, onEvent } = this.props;

    onEvent(target, 'willBlur', payload);

    if (
      typeof navigation.state.isTransitioning !== 'boolean' ||
      (navigation.state.isTransitioning !== true &&
        !navigation.dangerouslyGetParent())
    ) {
      this._emitDidBlur(target, payload);
    }
  };

  /**
   * @param {string} target
   * @param {Payload} payload
   */
  _emitDidFocus = (target, payload) => {
    if (this._lastWillFocusKey !== target || this._lastDidFocusKey === target) {
      return;
    }

    this._lastDidFocusKey = target;

    const { onEvent } = this.props;

    onEvent(target, 'didFocus', payload);
  };

  /**
   * @param {string} target
   * @param {Payload} payload
   */
  _emitDidBlur = (target, payload) => {
    if (this._lastWillBlurKey !== target || this._lastDidBlurKey === target) {
      return;
    }

    this._lastDidBlurKey = target;

    const { onEvent } = this.props;

    onEvent(target, 'didBlur', payload);
  };

  render() {
    return null;
  }
}
