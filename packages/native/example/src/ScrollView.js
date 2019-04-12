import React from 'react';
import {
  Button,
  RefreshControl,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { createStackNavigator } from 'react-navigation-stack';
import { ScrollView } from '@react-navigation/native';

const LOREM_PAGE_ONE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse in lacus malesuada tellus bibendum fringilla. Integer suscipit suscipit erat, sed molestie eros. Nullam fermentum odio vel mauris pulvinar accumsan. Duis blandit id nulla ac euismod. Nunc nec convallis mauris. Proin sit amet malesuada orci. Aliquam blandit mattis nisi ut eleifend. Morbi blandit ante neque, eu tincidunt est interdum in. Mauris pellentesque euismod nulla. Mauris posuere egestas nulla, sit amet eleifend quam egestas at. Maecenas odio erat, auctor eu consectetur eu, vulputate nec arcu. Praesent in felis massa. Nunc fermentum, massa vitae ultricies dictum, est mi posuere eros, sit amet posuere mi ante ac nulla. Etiam odio libero, tempor sit amet sagittis sed, fermentum ac lorem. Donec dignissim fermentum velit, ac ultrices nulla tristique vel.
Suspendisse auctor elit vitae elementum auctor. Vestibulum gravida auctor facilisis. Vivamus rhoncus ornare magna, non pharetra diam porta ac. Aliquam et justo vitae neque congue dignissim. Etiam et dui euismod, cursus mauris in, aliquam nunc. Mauris elit nulla, rutrum non aliquam a, imperdiet a erat. Nullam molestie elit risus, in posuere dui maximus ut. Integer ac sapien molestie, vestibulum ligula ultricies, pellentesque nisl. Duis elementum, ante ac tincidunt cursus, odio leo lacinia purus, at posuere mauris diam suscipit lorem. In hac habitasse platea dictumst. Pellentesque sagittis nunc non ipsum porttitor pellentesque. Phasellus dapibus accumsan aliquam. Etiam feugiat vitae magna condimentum tincidunt.
Donec vitae sollicitudin felis, eget tempus odio. Nulla fringilla urna id tristique molestie. Sed sed tellus semper, pharetra tellus vel, egestas enim. Ut dictum erat vitae lectus vestibulum tincidunt nec et sapien. Integer faucibus felis et interdum condimentum. Praesent lacus tortor, euismod sed dui nec, elementum auctor lorem. Vestibulum at iaculis lorem. Suspendisse tempor efficitur blandit. Sed elementum libero ut metus lobortis, cursus molestie nisi laoreet. Cras porta metus vitae orci rutrum suscipit. In non massa in nunc interdum condimentum et ut urna. Praesent hendrerit mauris sed vestibulum condimentum. Mauris tincidunt orci at nibh maximus aliquet. Nulla tristique turpis quis sem ultrices, at aliquet dui varius. Nunc convallis massa ac libero posuere sagittis. Pellentesque euismod nunc blandit turpis placerat lacinia.
Donec eget mi a justo congue faucibus eu sed odio. Morbi condimentum, nulla non iaculis lobortis, mauris diam facilisis nisi, in tincidunt ex nulla bibendum ipsum. Nam interdum turpis eget leo convallis, lobortis sollicitudin elit posuere. Aliquam erat volutpat. Suspendisse in nibh interdum nibh porttitor accumsan. Nullam blandit, neque sed lacinia dapibus, nisl lacus egestas odio, sit amet molestie libero nibh ac massa. Quisque tempor placerat elit, non volutpat elit pellentesque quis. Etiam sit amet nisi at ex ornare commodo non vel tortor. Mauris ac dictum sem. Donec feugiat id augue at tempus. Nunc non aliquam odio, quis luctus augue. Maecenas vulputate urna aliquet ultricies tincidunt.`;

const LOREM_PAGE_TWO = `Fusce sapien massa, mollis a nulla vel, blandit hendrerit orci. Aliquam rhoncus metus eget est commodo, vitae ultricies nisl facilisis. Etiam eu tincidunt diam. Vivamus gravida, purus elementum tincidunt consequat, justo turpis placerat tortor, nec lobortis metus metus et ante. Morbi sed tempus est. Aliquam erat volutpat. Quisque lacinia dictum sapien tristique mollis. Nunc finibus lacus a magna malesuada hendrerit. Duis eget nisl vel velit tristique molestie. Sed sit amet mattis nisi. Nullam vitae libero lobortis, tincidunt mi vel, ultrices ex.
In at volutpat metus. Donec ullamcorper, turpis id fermentum ullamcorper, risus justo convallis nunc, eu accumsan magna urna ut tellus. Etiam erat erat, mattis sit amet quam vulputate, mollis consectetur tellus. Cras et ligula a nisi euismod rutrum. Maecenas efficitur ante ut sapien aliquet tincidunt. In semper, ante id fringilla volutpat, augue ligula semper diam, sed sagittis dui purus sit amet quam. Sed egestas justo eu risus maximus lacinia. Integer non purus ac nulla varius aliquet eget eu orci. Ut semper libero risus, in volutpat urna interdum ac. Duis a purus urna. Nulla non orci arcu. Suspendisse vel volutpat justo, vel dignissim risus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
Integer id cursus dui. Praesent feugiat interdum erat vitae suscipit. Suspendisse lobortis sem in velit tincidunt, id sagittis purus placerat. Vivamus tincidunt vulputate mi. Curabitur faucibus magna diam, ut commodo nulla bibendum in. Nulla tincidunt dui quis enim condimentum aliquet. Donec quis velit vel purus hendrerit laoreet.
Etiam sit amet justo ut libero efficitur suscipit quis a dui. Suspendisse sit amet felis a leo finibus fringilla. Nam et pretium sem, in tristique leo. Vivamus sit amet tortor est. Fusce blandit massa nec orci dictum, lacinia maximus ipsum imperdiet. Maecenas quis ante et dui tincidunt commodo sit amet ut velit. Pellentesque ultrices sit amet dui eu hendrerit. Nam ac justo justo. Pellentesque sed odio et quam vulputate pellentesque. Nunc eu arcu luctus, mattis mi condimentum, tempus lorem. Nunc justo est, venenatis in vestibulum in, rhoncus vel nunc. Phasellus tincidunt interdum ligula, vel dapibus lorem. Pellentesque molestie tempus metus, at consequat urna dapibus vitae. Mauris et libero ac augue suscipit pulvinar. Donec et imperdiet odio. Phasellus interdum enim eget venenatis varius.
Nulla eu eros mi. Sed non lobortis risus. Donec fermentum augue ut scelerisque semper. Suspendisse nunc leo, tempor non tincidunt id, pharetra sed neque. Donec ligula lorem, suscipit ultrices eleifend feugiat, convallis non lacus. Donec sagittis nulla varius, pretium nunc quis, ultricies risus. Donec lacinia nulla a turpis mollis, ac pharetra quam pharetra. Maecenas porttitor nibh quis nisl pellentesque varius. Mauris in enim nec elit venenatis egestas eget ut nulla. Nullam eget maximus neque. Cras vitae neque non risus imperdiet commodo ut eget dui. Integer nec ante eu odio vehicula ornare. Sed lacus sem, ultrices et ultricies laoreet, tempor vitae sapien.
Donec eget mi a justo congue faucibus eu sed odio. Morbi condimentum, nulla non iaculis lobortis, mauris diam facilisis nisi, in tincidunt ex nulla bibendum ipsum. Nam interdum turpis eget leo convallis, lobortis sollicitudin elit posuere. Aliquam erat volutpat. Suspendisse in nibh interdum nibh porttitor accumsan. Nullam blandit, neque sed lacinia dapibus, nisl lacus egestas odio, sit amet molestie libero nibh ac massa. Quisque tempor placerat elit, non volutpat elit pellentesque quis. Etiam sit amet nisi at ex ornare commodo non vel tortor. Mauris ac dictum sem. Donec feugiat id augue at tempus. Nunc non aliquam odio, quis luctus augue. Maecenas vulputate urna aliquet ultricies tincidunt.`;

class LoremScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Lorem Ipsum',
    headerRight: navigation.getParam('nextPage') ? (
      <Button
        title="Next"
        onPress={() => navigation.navigate(navigation.getParam('nextPage'))}
      />
    ) : null,
  });

  state = {
    refreshing: false,
  };

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.setState({ refreshing: false });
  };

  render() {
    return (
      <ScrollView
        ref={view => {
          this.scrollView = view;
        }}
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        {this.props.navigation
          .getParam('text')
          .split('\n')
          .map((p, i) => (
            <Text
              key={i}
              style={{ marginBottom: 10, marginTop: 8, marginHorizontal: 10 }}
            >
              {p}
            </Text>
          ))}
      </ScrollView>
    );
  }
}

const SimpleStack = createStackNavigator(
  {
    PageOne: {
      screen: LoremScreen,
      params: { text: LOREM_PAGE_ONE, nextPage: 'PageTwo' },
    },
    PageTwo: {
      screen: LoremScreen,
      params: { text: LOREM_PAGE_TWO },
    },
  },
  {
    initialRouteName: 'PageOne',
  }
);

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
