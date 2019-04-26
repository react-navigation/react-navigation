import * as React from 'react';
import {
  ActivityIndicator,
  Button,
  InteractionManager,
  WebView,
  View,
} from 'react-native';
import { MapView } from 'expo';
import {
  createStackNavigator,
  StackGestureContext,
} from 'react-navigation-stack';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

const IndexScreen = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Button title="Go to MapView" onPress={() => navigation.navigate('Map')} />
    <Button title="Go to WebView" onPress={() => navigation.navigate('Web')} />
    <Button
      title="Return to other examples"
      onPress={() => navigation.navigate('Home')}
    />
  </View>
);

IndexScreen.navigationOptions = {
  title: 'Gesture Interactions',
};

class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionComplete: true });
    });

    this.state = {
      interactionComplete: false,
    };
  }

  render() {
    if (!this.state.interactionComplete) {
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <StackGestureContext.Consumer>
        {ref => (
          <NativeViewGestureHandler waitFor={ref}>
            <MapView style={{ flex: 1 }} />
          </NativeViewGestureHandler>
        )}
      </StackGestureContext.Consumer>
    );
  }
}

MapScreen.navigationOptions = {
  title: 'MapView',
};

const WebViewScreen = () => (
  <StackGestureContext.Consumer>
    {ref => (
      <NativeViewGestureHandler waitFor={ref}>
        <WebView
          style={{ flex: 1 }}
          source={{ uri: 'https://news.google.com' }}
        />
      </NativeViewGestureHandler>
    )}
  </StackGestureContext.Consumer>
);

WebViewScreen.navigationOptions = {
  title: 'WebView',
};

export default createStackNavigator({
  Index: IndexScreen,
  Map: MapScreen,
  Web: WebViewScreen,
});
