import * as React from 'react';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/core';
import ScreenPropsContext from './ScreenPropsContext';
import createCompatNavigationProp from './createCompatNavigationProp';

type Props<ParamList extends ParamListBase> = {
  navigation: NavigationProp<ParamList>;
  route: RouteProp<ParamList, string>;
  component: React.ComponentType<any>;
};

function ScreenComponent<ParamList extends ParamListBase>(
  props: Props<ParamList>
) {
  const navigation = React.useMemo(
    () =>
      createCompatNavigationProp(props.navigation as any, props.route as any),
    [props.navigation, props.route]
  );

  const screenProps = React.useContext(ScreenPropsContext);

  return <props.component navigation={navigation} screenProps={screenProps} />;
}

export default React.memo(ScreenComponent);
