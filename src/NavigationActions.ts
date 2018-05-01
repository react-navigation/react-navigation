const BACK = 'Navigation/BACK';
const INIT = 'Navigation/INIT';
const NAVIGATE = 'Navigation/NAVIGATE';
const SET_PARAMS = 'Navigation/SET_PARAMS';

/**
 * Go back to previous screen and close current screen.
 */
const back = (
  payload: {
    /**
     * Currently has no effect. This is a placeholder for when StackNavigator
     * supports animated replace (it currently does not).
     */
    immediate?: boolean;
    /**
     * If set, navigation will go back from the given key.
     * If null, navigation will go back anywhere.
     */
    key?: string | null;
  } = {}
) => ({
  type: BACK,
  key: payload.key,
  immediate: payload.immediate,
});

/**
 * Used to initialize first state if state is undefined.
 */
const init = (
  payload: {
    params?: { [key: string]: string | number | boolean };
  } = {}
) => ({
  type: INIT,
  ...(payload.params ? { params: payload.params } : {}),
});

export interface INavigatePayload {
  /**
   * A destination routeName that has been registered somewhere
   * in the app's router.
   */
  routeName: string;
  /**
   * Params to merge into the destination route.
   */
  params?: { [key: string]: string | number | boolean };
  /**
   * (Advanced)
   * The sub-action to run in the child route; if the screen is a navigator.
   */
  action?: INavigatePayload;
  /**
   * The identifier for the route to navigate to.
   * Navigate back to this route if it already exists.
   */
  key?: string;
}

/**
 * Navigate to another route.
 * Updates the current state with the result of a Navigate action.
 */
const navigate = (
  payload: INavigatePayload
): { type: string } & INavigatePayload => ({
  type: NAVIGATE,
  routeName: payload.routeName,
  ...(payload.params ? { params: payload.params } : {}),
  ...(payload.action ? { action: payload.action } : {}),
  ...(payload.key ? { key: payload.key } : {}),
});

/**
 * Set params for given route.
 * When dispatching setParams, the router will produce a new state that has
 * changed the params of a particular route, as identified by the key.
 */
const setParams = (payload: {
  /**
   * New params to be merged into existing route params.
   */
  params: { [key: string]: string | number | boolean };
  /**
   * Route key that should get the new params.
   */
  key: string;
}) => ({
  type: SET_PARAMS,
  key: payload.key,
  params: payload.params,
});

export default {
  // Action constants
  BACK,
  INIT,
  NAVIGATE,
  SET_PARAMS,

  // Action creators
  back,
  init,
  navigate,
  setParams,
};
