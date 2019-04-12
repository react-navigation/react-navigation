import * as React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { createAppContainer } from '@react-navigation/native';

import createDrawerNavigator from '../createDrawerNavigator';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }: any) => ({
    title: `Welcome ${
      navigation.state.params ? navigation.state.params.user : 'anonymous'
    }`,
    gesturesEnabled: true,
  });

  render() {
    return <View style={{ flex: 1 }} />;
  }
}

it('renders successfully', () => {
  const MyDrawerNavigator = createDrawerNavigator({ Home: HomeScreen });
  const App = createAppContainer(MyDrawerNavigator);
  const rendered = renderer.create(<App />).toJSON();

  expect(rendered).toMatchInlineSnapshot(`
    <RCTView
      drawerBackgroundColor="white"
      drawerPosition="left"
      drawerType="front"
      drawerWidth={320}
      hideStatusBar={false}
      keyboardDismissMode="on-drag"
      onDrawerClose={[Function]}
      onDrawerOpen={[Function]}
      onDrawerStateChanged={[Function]}
      onGestureRef={[Function]}
      overlayColor="black"
      renderNavigationView={[Function]}
      statusBarAnimation="slide"
      useNativeAnimations={true}
    >
      <View
        style={
          Object {
            "flex": 1,
          }
        }
      >
        <View
          collapsable={false}
          pointerEvents="auto"
          removeClippedSubviews={false}
          style={
            Array [
              Object {
                "flex": 1,
                "overflow": "hidden",
              },
              Array [
                Object {
                  "bottom": 0,
                  "left": 0,
                  "position": "absolute",
                  "right": 0,
                  "top": 0,
                },
                Object {
                  "opacity": 1,
                },
              ],
            ]
          }
        >
          <View
            style={
              Object {
                "flex": 1,
              }
            }
          >
            <View
              style={
                Object {
                  "flex": 1,
                }
              }
            />
          </View>
        </View>
      </View>
    </RCTView>
  `);
});
