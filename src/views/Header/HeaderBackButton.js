import React from 'react';
import {
  I18nManager,
  Image,
  Text,
  View,
  Platform,
  StyleSheet,
} from 'react-native';

import TouchableItem from '../TouchableItem';

class HeaderBackButton extends React.PureComponent {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'Back',
    // eslint-disable-next-line global-require
    buttonImage: require('../assets/back-icon.png'),
  };

  state = {};

  _onTextLayout = e => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  render() {
    const {
      buttonImage,
      onPress,
      pressColorAndroid,
      width,
      title,
      titleStyle,
      tintColor,
      truncatedTitle,
    } = this.props;

    const renderTruncated =
      this.state.initialTextWidth && width
        ? this.state.initialTextWidth > width
        : false;

    const backButtonTitle = renderTruncated ? truncatedTitle : title;

    return (
      <TouchableItem
        accessibilityComponentType="button"
        accessibilityLabel={backButtonTitle}
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColorAndroid}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          <Image
            style={[
              styles.icon,
              !!title && styles.iconWithTitle,
              !!tintColor && { tintColor },
            ]}
            source={buttonImage}
          />
          {Platform.OS === 'ios' &&
            typeof backButtonTitle === 'string' && (
              <Text
                onLayout={this._onTextLayout}
                style={[
                  styles.title,
                  !!tintColor && { color: tintColor },
                  titleStyle,
                ]}
                numberOfLines={1}
              >
                {backButtonTitle}
              </Text>
            )}
        </View>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 17,
    paddingRight: 10,
  },
  icon:
    Platform.OS === 'ios'
      ? {
          height: 21,
          width: 13,
          marginLeft: 10,
          marginRight: 22,
          marginVertical: 12,
          resizeMode: 'contain',
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        }
      : {
          height: 24,
          width: 24,
          margin: 16,
          resizeMode: 'contain',
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        },
  iconWithTitle:
    Platform.OS === 'ios'
      ? {
          marginRight: 5,
        }
      : {},
});

export default HeaderBackButton;
