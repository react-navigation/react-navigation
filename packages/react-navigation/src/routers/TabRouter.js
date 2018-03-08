import SwitchRouter from './SwitchRouter';
import withDefaultValue from '../utils/withDefaultValue';

export default (routeConfigs, config = {}) => {
  config = { ...config };
  config = withDefaultValue(config, 'resetOnBlur', false);
  config = withDefaultValue(config, 'backBehavior', 'initialRoute');

  const switchRouter = SwitchRouter(routeConfigs, config);
  return switchRouter;
};
