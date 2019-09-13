import * as React from 'react';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/core';
import ScreenPropsContext from './ScreenPropsContext';
import createCompatNavigationProp from './createCompatNavigationProp';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase, string>;
  component: React.ComponentType<any>;
};

function ScreenComponent(props: Props) {
  const navigation = React.useMemo(
    () => createCompatNavigationProp(props.navigation, props.route),
    [props.navigation, props.route]
  );

  const screenProps = React.useContext(ScreenPropsContext);

  return <props.component navigation={navigation} screenProps={screenProps} />;
}

export default React.memo(ScreenComponent);
