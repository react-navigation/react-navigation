import React from 'react';
import { Button, WebView, View } from 'react-native';
import { MapView } from 'expo';
import { withNavigation } from 'react-navigation';
import {
  createDrawerNavigator,
  DrawerGestureContext,
} from 'react-navigation-drawer';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

@withNavigation
class ContainerWithButtons extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.children}
        <View
          style={{
            position: 'absolute',
            paddingBottom: 30,
            bottom: 0,
            paddingTop: 10,
            paddingHorizontal: 10,
            left: 0,
            flexDirection: 'row',
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            justifyContent: 'space-between',
          }}
        >
          <Button
            title="Open drawer"
            onPress={() => this.props.navigation.openDrawer()}
          />
          <Button
            title="Go back"
            onPress={() => this.props.navigation.navigate('Home')}
          />
        </View>
      </View>
    );
  }
}

const MapScreen = () => (
  <ContainerWithButtons>
    <DrawerGestureContext>
      {ref => (
        <NativeViewGestureHandler waitFor={ref}>
          <MapView style={{ flex: 1 }} />
        </NativeViewGestureHandler>
      )}
    </DrawerGestureContext>
  </ContainerWithButtons>
);

MapScreen.navigationOptions = {
  title: 'MapView',
};

const WebViewScreen = () => (
  <ContainerWithButtons>
    <DrawerGestureContext>
      {ref => (
        <NativeViewGestureHandler waitFor={ref}>
          <WebView
            style={{ flex: 1 }}
            source={{ uri: 'https://news.google.com' }}
          />
        </NativeViewGestureHandler>
      )}
    </DrawerGestureContext>
  </ContainerWithButtons>
);

WebViewScreen.navigationOptions = {
  title: 'WebView',
};

const DrawerExample = createDrawerNavigator(
  {
    Map: MapScreen,
    Web: WebViewScreen,
  },
  {
    edgeWidth: 70,
    minSwipeDistance: 3,
    contentOptions: {
      activeTintColor: '#e91e63',
    },
  }
);

export default DrawerExample;
