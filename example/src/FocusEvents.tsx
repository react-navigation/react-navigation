import * as React from 'react';
import { Button, ScrollView, View, Text } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
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
    this._willFocusSub = this.props.navigation.addListener('willFocus', () => {
      this._handleEvent('willFocus');
    });

    this._willBlurSub = this.props.navigation.addListener('willBlur', () => {
      this._handleEvent('willBlur');
    });

    this._didFocusSub = this.props.navigation.addListener('didFocus', () => {
      this._handleEvent('didFocus');
    });

    this._didBlurSub = this.props.navigation.addListener('didBlur', () => {
      this._handleEvent('didBlur');
    });
  }

  componentWillUnmount() {
    this._willFocusSub?.remove();
    this._willBlurSub?.remove();
    this._didFocusSub?.remove();
    this._didBlurSub?.remove();
  }

  _willFocusSub: { remove: () => void } | undefined;
  _willBlurSub: { remove: () => void } | undefined;
  _didFocusSub: { remove: () => void } | undefined;
  _didBlurSub: { remove: () => void } | undefined;

  _handleEvent = (mode: string) => {
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

const Stack = createStackNavigator(
  {
    PageOne: SampleScreen,
    PageTwo: SampleScreen,
  },
  {
    initialRouteName: 'PageOne',
  }
);

const Tabs = createBottomTabNavigator({
  A: Stack,
  B: Stack,
});

export default Tabs;
