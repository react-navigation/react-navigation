import App from './js/App';
export default App;

// import React, { Component } from 'react';
// import { Button, Text, View } from 'react-native';
// import { StackNavigator, withNavigation } from 'react-navigation'; // Version can be specified in package.json

// export default class App extends Component {
//   render() {
//     // this works as expected
//     // return <RootNav />;

//     return <Nav /> // -- this results in no navigation prop
//   }
// }

// class BButton extends React.Component {
//   render() {
//     return <Button onPress={this._handlePress} title="Go to B" />;
//   }

//   _handlePress = () => {
//     if (this.props.navigation) {
//       this.props.navigation.navigate('B');
//     } else {
//       alert('No navigation prop!');
//     }
//   };
// }

// const BButtonWithNavigation = withNavigation(BButton);

// class A extends React.Component {
//   static navigationOptions = {
//     headerRight: <BButtonWithNavigation />,
//   };

//   render() {
//     return <View><Text>A</Text></View>;
//   }
// }

// class B extends React.Component {
//   render() {
//     return <View><Text>B</Text></View>;
//   }
// }

// const Nav = StackNavigator({
//   A: { screen: A },
//   B: { screen: B },
// });

// const RootNav = StackNavigator(
//   {
//     Home: { screen: Nav },
//   },
//   {
//     headerMode: 'none',
//   }
// );
