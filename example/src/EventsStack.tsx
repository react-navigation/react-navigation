import React from 'react';
import { Button, ScrollView, View, Text } from 'react-native';
import {
  createStackNavigator,
  NavigationStackProp,
  NavigationStackScreenProps,
} from 'react-navigation-stack';

const getColorOfEvent = (evt: string) => {
  switch (evt) {
    case 'willFocus':
      return 'purple';
    case 'didFocus':
      return 'blue';
    case 'willBlur':
      return 'brown';
    default:
      return 'black';
  }
};
class FocusTag extends React.Component<NavigationStackScreenProps> {
  state = { mode: 'didBlur' };

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.setMode('willFocus');
    });

    this.props.navigation.addListener('willBlur', () => {
      this.setMode('willBlur');
    });

    this.props.navigation.addListener('didFocus', () => {
      this.setMode('didFocus');
    });

    this.props.navigation.addListener('didBlur', () => {
      this.setMode('didBlur');
    });
  }

  setMode = (mode: string) => {
    this.setState({ mode });
  };

  render() {
    const key = this.props.navigation.state.key;

    return (
      <View
        style={{
          padding: 20,
          backgroundColor: getColorOfEvent(this.state.mode),
        }}
      >
        <Text style={{ color: 'white' }}>
          {key} {String(this.state.mode)}
        </Text>
      </View>
    );
  }
}

class SampleScreen extends React.Component<NavigationStackScreenProps> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationStackProp;
  }) => ({
    title: 'Lorem Ipsum',
    headerRight: navigation.getParam('nextPage')
      ? () => (
          <Button
            title="Next"
            onPress={() => navigation.navigate(navigation.getParam('nextPage'))}
          />
        )
      : undefined,
  });

  componentDidMount() {
    this.props.navigation.addListener('refocus', () => {
      if (this.props.navigation.isFocused()) {
        this.scrollView.current?.scrollTo({ x: 0, y: 0 });
      }
    });
  }

  private scrollView = React.createRef<ScrollView>();

  render() {
    return (
      <ScrollView ref={this.scrollView} style={{ flex: 1 }}>
        <FocusTag {...this.props} />
        <Button
          title="Push"
          onPress={() => {
            this.props.navigation.push('PageTwo');
          }}
        />
        <Button
          title="Push and Pop Quickly"
          onPress={() => {
            const { push, goBack } = this.props.navigation;
            push('PageTwo');
            setTimeout(() => {
              goBack(null);
            }, 150);
          }}
        />
        <Button
          title="Back to Examples"
          onPress={() => {
            this.props.navigation.navigate('Index');
          }}
        />
      </ScrollView>
    );
  }
}

const SimpleStack = createStackNavigator(
  {
    PageOne: {
      screen: SampleScreen,
    },
    PageTwo: {
      screen: SampleScreen,
    },
  },
  {
    initialRouteName: 'PageOne',
  }
);

export default SimpleStack;
