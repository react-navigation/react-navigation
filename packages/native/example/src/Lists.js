import React from 'react';
import { Button, TouchableOpacity, View, Text } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { createStackNavigator } from 'react-navigation-stack';
import { SectionList, FlatList } from '@react-navigation/native';

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse in lacus malesuada tellus bibendum fringilla. Integer suscipit suscipit erat, sed molestie eros. Nullam fermentum odio vel mauris pulvinar accumsan. Duis blandit id nulla ac euismod. Nunc nec convallis mauris. Proin sit amet malesuada orci. Aliquam blandit mattis nisi ut eleifend. Morbi blandit ante neque, eu tincidunt est interdum in. Mauris pellentesque euismod nulla. Mauris posuere egestas nulla, sit amet eleifend quam egestas at. Maecenas odio erat, auctor eu consectetur eu, vulputate nec arcu. Praesent in felis massa. Nunc fermentum, massa vitae ultricies dictum, est mi posuere eros, sit amet posuere mi ante ac nulla. Etiam odio libero, tempor sit amet sagittis sed, fermentum ac lorem. Donec dignissim fermentum velit, ac ultrices nulla tristique vel.
Suspendisse auctor elit vitae elementum auctor. Vestibulum gravida auctor facilisis. Vivamus rhoncus ornare magna, non pharetra diam porta ac. Aliquam et justo vitae neque congue dignissim. Etiam et dui euismod, cursus mauris in, aliquam nunc. Mauris elit nulla, rutrum non aliquam a, imperdiet a erat. Nullam molestie elit risus, in posuere dui maximus ut. Integer ac sapien molestie, vestibulum ligula ultricies, pellentesque nisl. Duis elementum, ante ac tincidunt cursus, odio leo lacinia purus, at posuere mauris diam suscipit lorem. In hac habitasse platea dictumst. Pellentesque sagittis nunc non ipsum porttitor pellentesque. Phasellus dapibus accumsan aliquam. Etiam feugiat vitae magna condimentum tincidunt.
Donec vitae sollicitudin felis, eget tempus odio. Nulla fringilla urna id tristique molestie. Sed sed tellus semper, pharetra tellus vel, egestas enim. Ut dictum erat vitae lectus vestibulum tincidunt nec et sapien. Integer faucibus felis et interdum condimentum. Praesent lacus tortor, euismod sed dui nec, elementum auctor lorem. Vestibulum at iaculis lorem. Suspendisse tempor efficitur blandit. Sed elementum libero ut metus lobortis, cursus molestie nisi laoreet. Cras porta metus vitae orci rutrum suscipit. In non massa in nunc interdum condimentum et ut urna. Praesent hendrerit mauris sed vestibulum condimentum. Mauris tincidunt orci at nibh maximus aliquet. Nulla tristique turpis quis sem ultrices, at aliquet dui varius. Nunc convallis massa ac libero posuere sagittis. Pellentesque euismod nunc blandit turpis placerat lacinia.
Donec eget mi a justo congue faucibus eu sed odio. Morbi condimentum, nulla non iaculis lobortis, mauris diam facilisis nisi, in tincidunt ex nulla bibendum ipsum. Nam interdum turpis eget leo convallis, lobortis sollicitudin elit posuere. Aliquam erat volutpat. Suspendisse in nibh interdum nibh porttitor accumsan. Nullam blandit, neque sed lacinia dapibus, nisl lacus egestas odio, sit amet molestie libero nibh ac massa. Quisque tempor placerat elit, non volutpat elit pellentesque quis. Etiam sit amet nisi at ex ornare commodo non vel tortor. Mauris ac dictum sem. Donec feugiat id augue at tempus. Nunc non aliquam odio, quis luctus augue. Maecenas vulputate urna aliquet ultricies tincidunt.`;

const DATA = LOREM.split('\n').map((line, i) => ({
  key: i.toString(),
  value: line,
}));

class LoremScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let currentListType = navigation.getParam('listType');
    let nextListType =
      currentListType === 'FlatList' ? 'SectionList' : 'FlatList';

    return {
      title: currentListType,
      headerRight: (
        <Button
          title={nextListType}
          onPress={() => navigation.setParams({ listType: nextListType })}
        />
      ),
    };
  };

  state = {
    refreshing: false,
  };

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.setState({ refreshing: false });
  };

  render() {
    if (this.props.navigation.getParam('listType') === 'FlatList') {
      return (
        <FlatList
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          renderItem={({ item }) => (
            <Text style={{ marginVertical: 7, marginHorizontal: 10 }}>
              {item.value}
            </Text>
          )}
          data={DATA}
          ref={view => {
            this.scrollView = view;
          }}
          style={{
            flex: 1,
            backgroundColor: '#fff',
          }}
        />
      );
    } else {
      return (
        <SectionList
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          renderItem={({ item }) => (
            <Text style={{ marginVertical: 7, marginHorizontal: 10 }}>
              {item.value}
            </Text>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View
              style={{
                backgroundColor: '#fff',
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>{title}</Text>
            </View>
          )}
          sections={[{ title: 'SectionList', data: DATA }]}
          ref={view => {
            this.scrollView = view;
          }}
          style={{
            flex: 1,
            backgroundColor: '#fff',
          }}
        />
      );
    }
  }
}

const SimpleStack = createStackNavigator({
  Lorem: {
    screen: LoremScreen,
    params: { listType: 'FlatList' },
  },
});

export default class StackWithRefocus extends React.Component {
  static router = SimpleStack.router;

  _emitRefocus = () => {
    this.props.navigation.emit('refocus', {});
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SimpleStack navigation={this.props.navigation} />
        <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
          <TouchableOpacity onPress={this._emitRefocus}>
            <MaterialIcons name="center-focus-strong" size={30} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
