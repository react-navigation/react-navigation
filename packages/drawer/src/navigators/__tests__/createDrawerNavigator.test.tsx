import * as React from 'react';
import { View } from 'react-native';
import { render } from 'react-native-testing-library';
import { createAppContainer } from 'react-navigation';

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
  const rendered = render(<App />).toJSON();

  expect(rendered).toMatchInlineSnapshot(`
    <View
      collapsable={false}
      onGestureHandlerEvent={[Function]}
      onGestureHandlerStateChange={[Function]}
      onLayout={[Function]}
      style={
        Object {
          "flex": 1,
          "overflow": "hidden",
        }
      }
    >
      <View
        importantForAccessibility="yes"
        style={
          Object {
            "flex": 1,
            "transform": Array [
              Object {
                "translateX": 0,
              },
            ],
          }
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
        <View
          collapsable={false}
          onGestureHandlerEvent={[Function]}
          onGestureHandlerStateChange={[Function]}
          style={
            Object {
              "backgroundColor": "rgba(0, 0, 0, 0.5)",
              "bottom": 0,
              "left": 0,
              "opacity": undefined,
              "position": "absolute",
              "right": 0,
              "top": 0,
              "zIndex": undefined,
            }
          }
        />
      </View>
      <View
        accessibilityViewIsModal={false}
        onLayout={[Function]}
        removeClippedSubviews={false}
        style={
          Object {
            "backgroundColor": "#fff",
            "bottom": 0,
            "left": undefined,
            "maxWidth": "100%",
            "opacity": Object {},
            "position": "absolute",
            "top": 0,
            "transform": Array [
              Object {
                "translateX": undefined,
              },
            ],
            "width": 320,
            "zIndex": 0,
          }
        }
      >
        <View
          style={
            Array [
              Object {
                "flex": 1,
              },
              undefined,
            ]
          }
        >
          <RCTScrollView
            alwaysBounceVertical={false}
          >
            <View>
              <View
                onLayout={[Function]}
                pointerEvents="box-none"
                style={
                  Object {
                    "paddingBottom": 0,
                    "paddingLeft": 0,
                    "paddingRight": 0,
                    "paddingTop": 20,
                  }
                }
              >
                <View
                  style={
                    Array [
                      Object {
                        "paddingVertical": 4,
                      },
                      undefined,
                    ]
                  }
                >
                  <View
                    accessibilityLabel="Welcome anonymous"
                    accessible={true}
                    isTVSelectable={true}
                    onResponderGrant={[Function]}
                    onResponderMove={[Function]}
                    onResponderRelease={[Function]}
                    onResponderTerminate={[Function]}
                    onResponderTerminationRequest={[Function]}
                    onStartShouldSetResponder={[Function]}
                    style={
                      Object {
                        "opacity": 1,
                      }
                    }
                  >
                    <View
                      onLayout={[Function]}
                      pointerEvents="box-none"
                      style={
                        Object {
                          "alignItems": "center",
                          "backgroundColor": "rgba(0, 0, 0, .04)",
                          "flexDirection": "row",
                          "paddingBottom": 0,
                          "paddingLeft": 0,
                          "paddingRight": 0,
                          "paddingTop": 0,
                        }
                      }
                    >
                      <Text
                        style={
                          Array [
                            Object {
                              "fontWeight": "bold",
                              "margin": 16,
                            },
                            Object {
                              "color": "#2196f3",
                            },
                            undefined,
                            undefined,
                          ]
                        }
                      >
                        Welcome anonymous
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </RCTScrollView>
        </View>
      </View>
    </View>
  `);
});
