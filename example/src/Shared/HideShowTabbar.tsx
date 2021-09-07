import { useAnimatedTabbarVisible } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
const HideShowTabbar = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const navigation = useNavigation();
  const setTabbarVisible = useAnimatedTabbarVisible(navigation);
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => {
          setTabbarVisible(!visible);
          setVisible(!visible);
        }}
        style={styles.button}
      >
        {visible ? 'Hide' : 'Show'}
      </Button>
    </View>
  );
};

export default HideShowTabbar;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 8,
  },
});
