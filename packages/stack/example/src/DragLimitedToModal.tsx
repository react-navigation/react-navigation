import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

const HEIGHT = Dimensions.get('screen').height;

const { interpolate } = Animated;

const DragLimitedToModal: NavigationStackScreenComponent = () => (
  <View style={styles.modal}>
    <Text style={styles.text}>Adjusts to the size of text</Text>
  </View>
);

DragLimitedToModal.navigationOptions = {
  cardStyle: { backgroundColor: 'transparent' },
  gestureDirection: 'vertical',
  gestureResponseDistance: { vertical: HEIGHT },
  cardStyleInterpolator: ({ current }) => {
    const translateY = interpolate(current.progress, {
      inputRange: [0, 1],
      outputRange: [HEIGHT, 0],
    });

    return {
      cardStyle: {
        transform: [{ translateY }],
        flex: undefined,
      },
      containerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    };
  },
};

const styles = StyleSheet.create({
  modal: {
    padding: 30,
    borderRadius: 15,
    backgroundColor: '#000',
  },
  text: {
    fontSize: 18,
    color: '#fff',
  },
});

export default DragLimitedToModal;
