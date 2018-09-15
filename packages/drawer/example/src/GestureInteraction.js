import React from 'react';
import { Button, WebView, View } from 'react-native';
import { MapView } from 'expo';
import { withNavigation } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
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
    <NativeViewGestureHandler>
      <MapView style={{ flex: 1 }} />
    </NativeViewGestureHandler>
  </ContainerWithButtons>
);

MapScreen.navigationOptions = {
  title: 'MapView',
};

const WebViewScreen = () => (
  <ContainerWithButtons>
    <NativeViewGestureHandler>
      <WebView
        style={{ flex: 1 }}
        source={{ uri: 'https://news.google.com' }}
      />
    </NativeViewGestureHandler>
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
    edgeWidth: 100,
    minSwipeDistance: 1,
    contentOptions: {
      activeTintColor: '#e91e63',
    },
  }
);

export default DrawerExample;
