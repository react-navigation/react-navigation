import { _TESTING_ONLY_reset_container_count } from '@react-navigation/native/src/createAppContainer';

export default {
  resetInternalState: () => {
    _TESTING_ONLY_reset_container_count();
  },
};
