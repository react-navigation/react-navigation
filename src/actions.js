const namespacedAction = (action) => `navigation/${action}`

const BACK = namespacedAction('BACK')
const INIT = namespacedAction('INIT')
const NAVIGATE = namespacedAction('NAVIGATE')
const RESET = namespacedAction('RESET')
const SET_PARAMS = namespacedAction('SET_PARAMS')
const URI = namespacedAction('URI')

const createAction = (type) => (payload = {}) => ({
  type,
  ...payload
})

const back = createAction(BACK)
const init = createAction(INIT)
const navigate = createAction(NAVIGATE)
const reset = createAction(RESET)
const setParams = createAction(SET_PARAMS)
const uri = createAction(URI)

export default {
  // Action constants
  BACK,
  INIT,
  NAVIGATE,
  RESET,
  SET_PARAMS,
  URI,

  // Action creators
  back,
  init,
  navigate,
  reset,
  setParams,
  uri,
}
