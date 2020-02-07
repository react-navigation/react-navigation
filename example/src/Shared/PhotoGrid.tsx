import * as React from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ScrollViewProperties,
} from 'react-native';
import {
  withNavigation,
  NavigationScreenProp,
  NavigationRoute,
  NavigationEventSubscription,
} from 'react-navigation';

class NavigationAwareScrollViewBase extends React.Component<{
  navigation: NavigationScreenProp<NavigationRoute>;
  contentContainerStyle: StyleProp<ViewStyle>;
}> {
  componentDidMount() {
    this.subscription = this.props.navigation.addListener('refocus', () => {
      if (this.props.navigation.isFocused()) {
        this.root.current && this.root.current.scrollTo({ x: 0, y: 0 });
      }
    });
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove();
  }

  setNativeProps(props: ScrollViewProperties) {
    // @ts-ignore
    this.root.current.setNativeProps(props);
  }

  getNode() {
    return this.root.current;
  }

  private subscription: NavigationEventSubscription | undefined;

  private root = React.createRef<ScrollView>();

  render() {
    return <ScrollView {...this.props} ref={this.root} />;
  }
}

const NavigationAwareScrollView = withNavigation(NavigationAwareScrollViewBase);

export default function PhotoGrid({ id }: { id: string }) {
  const PHOTOS = Array.from({ length: 24 }).map(
    (_, i) => `https://unsplash.it/300/300/?random&__id=${id}${i}`
  );

  return (
    <NavigationAwareScrollView contentContainerStyle={styles.content}>
      {PHOTOS.map(uri => (
        <View key={uri} style={styles.item}>
          <Image source={{ uri }} style={styles.photo} />
        </View>
      ))}
    </NavigationAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
  },
  item: {
    height: Dimensions.get('window').width / 2,
    width: '50%',
    padding: 4,
  },
  photo: {
    flex: 1,
    resizeMode: 'cover',
  },
});
