import type {
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';

import type {
  BottomTabDescriptorMap,
  BottomTabNavigationConfig,
  BottomTabNavigationHelpers,
} from '../types';
import { BottomTabViewCustom } from './BottomTabViewCustom';
import { BottomTabViewNative } from './BottomTabViewNative';

type Props = BottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: BottomTabNavigationHelpers;
  descriptors: BottomTabDescriptorMap;
};

export function BottomTabView(props: Props) {
  if (props.implementation === 'custom') {
    return <BottomTabViewCustom {...props} />;
  }

  return <BottomTabViewNative {...props} />;
}
