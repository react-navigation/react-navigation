import * as React from 'react';
import type {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import ScreenPropsContext from './ScreenPropsContext';
import useCompatNavigation from './useCompatNavigation';

type Props<ParamList extends ParamListBase> = {
  navigation: NavigationProp<ParamList>;
  route: RouteProp<ParamList, string>;
  component: React.ComponentType<any>;
};

function ScreenComponent<ParamList extends ParamListBase>(
  props: Props<ParamList>
) {
  const navigation = useCompatNavigation();
  const screenProps = React.useContext(ScreenPropsContext);

  return <props.component navigation={navigation} screenProps={screenProps} />;
}

export default React.memo(ScreenComponent);
