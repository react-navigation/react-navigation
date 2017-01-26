
import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Story = ({navigation}) => (
  <View style={styles.container}>
    <ScrollView>
      <Text style={styles.welcome}>
        React Screen. Story ID: {JSON.stringify(navigation.state)}
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Profile', {id: '9876'});
        }}>
        <Text style={styles.link}>Navigate to native profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Settings');
        }}>
        <Text style={styles.link}>Navigate to react settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('RandomLink');
        }}>
        <Text style={styles.link}>Navigate to unimpemented page</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop: 80,
  },
  link: {
    textAlign: 'center',
    color: '#0A5FFF',
    fontSize: 16,
    marginVertical: 10,
  },
});

module.exports = Story;
