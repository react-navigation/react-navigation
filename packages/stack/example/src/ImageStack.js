import * as React from 'react';
import { Dimensions, Button, Image, View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FlatList, BorderlessButton } from 'react-native-gesture-handler';

class ListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Image list',
    headerBackTitle: 'Back',
    headerLeft: (
      <Button title="Back" onPress={() => navigation.navigate('Home')} />
    ),
  });

  state = {
    items: Array.apply(null, Array(60)).map((v, i) => {
      return {
        id: i,
        src: `https://source.unsplash.com/random/400x${400 + i}`,
      };
    }),
  };

  render() {
    return (
      <FlatList
        data={this.state.items}
        renderItem={({ item }) => (
          <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
            <BorderlessButton
              onPress={() =>
                this.props.navigation.navigate('Details', {
                  id: item.id,
                  src: item.src,
                })
              }
            >
              <Image style={{ height: 100 }} source={{ uri: item.src }} />
            </BorderlessButton>
          </View>
        )}
        numColumns={3}
        keyExtractor={(item, index) => index}
        style={{ flex: 1, backgroundColor: '#fff' }}
      />
    );
  }
}

class DetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Random image from Unsplash',
  };

  render() {
    let id = this.props.navigation.getParam('id', 0);

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        <Image
          source={{
            uri: `https://source.unsplash.com/random/1080x${1920 + id}`,
          }}
          style={{ width: Dimensions.get('window').width, height: 400 }}
          resizeMode="cover"
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}

export default createStackNavigator(
  {
    List: ListScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'List',
  }
);
