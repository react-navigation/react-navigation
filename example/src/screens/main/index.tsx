import React from 'react';
import { SafeAreaView, Button } from 'react-native';
import type { MainScreenNavigationProp } from '../../app-navigation-types';

type Props = {
  navigation: MainScreenNavigationProp;
};

function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Button
        title="Go to Details without id"
        onPress={() => navigation.navigate('Detail')}
      />
      <Button
        title="Go to Details with id '789'"
        onPress={() => navigation.navigate('Detail', { id: '789' })}
      />
    </SafeAreaView>
  );
}

export default HomeScreen;
