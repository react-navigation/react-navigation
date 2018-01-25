/*       */

import * as React from 'react';

import { Animated } from 'react-native';

/**
 * Navigation State + Action
 */

/**
 * NavigationState is a tree of routes for a single navigator, where each child
 * route may either be a NavigationScreenRoute or a NavigationRouterRoute.
 * NavigationScreenRoute represents a leaf screen, while the
 * NavigationRouterRoute represents the state of a child navigator.
 *
 * NOTE: NavigationState is a state tree local to a single navigator and
 * its child navigators (via the routes field).
 * If we're in navigator nested deep inside the app, the state will only be the
 * state for that navigator.
 * The state for the root navigator of our app represents the whole navigation
 * state for the whole app.
 */

/**
 * Router
 */

/**
 * Header
 */

/**
 * Stack Navigator
 */

/**
 * Tab Navigator
 */

/**
 * Drawer
 */

/**
 * Navigator Prop
 */

/**
 * Navigation container
 */

/**
 * Gestures, Animations, and Interpolators
 */

// The scene renderer props are nearly identical to the props used for rendering
// a transition. The exception is that the passed scene is not the active scene
// but is instead the scene that the renderer should render content for.

/**
 * Describes a visual transition from one screen to another.
 */
