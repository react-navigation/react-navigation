/**
 * This Hooks is for add a listener for browser back/forward button.
 *
 * If user click on browser `back` button, the navigation goBack function have been running.
 *
 * If User click on browser `forward` button, the navigation navigate function have been running.
 * @param {object} param
 * @param {object} param.navigationRef
 */
export const useBrowserBackAndForwardListener = (): void => {};

/**
 * This function should be run when the navigation state change
 * @param {object} param0
 * @param {object} param0.state Navigation state
 */
export const syncStateWithHistory = (): void => {};

/**
 * if user have been navigate to a sub page from another site or insert manual url
 * like `www.site.com/dashboard/mail` This function give a state to open that page directly
 */
export const getInitialStateFromLocation = (): void => {};
