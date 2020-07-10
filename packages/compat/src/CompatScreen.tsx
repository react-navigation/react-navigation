import * as React from 'react';
import ScreenPropsContext from './ScreenPropsContext';
import useCompatNavigation from './useCompatNavigation';

type Props = {
  getComponent: () => React.ComponentType<any>;
};

function CompatScreen({ getComponent }: Props) {
  const navigation = useCompatNavigation();
  const screenProps = React.useContext(ScreenPropsContext);
  const ScreenComponent = getComponent();

  return <ScreenComponent navigation={navigation} screenProps={screenProps} />;
}

export default React.memo(CompatScreen);
