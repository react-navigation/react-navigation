import RootNavigator from '../navigators/root'

export default function navigation(state, action) {
    return RootNavigator.router.getStateForAction(action, state)
}
