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

const defaultBackImage = require('../assets/back-icon.png');

class HeaderBackButton extends React.PureComponent {
  static defaultProps = {
    tintColor: Platform.select({
      ios: '#037aff',
      android: '#000000',
    }),
    truncatedTitle: 'Back',
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

  _renderBackImage() {
    const { backImage, title, tintColor } = this.props;

    let BackImage;
    let props;

    if (React.isValidElement(backImage)) {
      return backImage;
    } else if (backImage) {
      BackImage = backImage;
      props = {
        tintColor,
        title,
      };
    } else {
      BackImage = Image;
      props = {
        style: [
          styles.icon,
          !!title && styles.iconWithTitle,
          !!tintColor && { tintColor },
        ],
        source: defaultBackImage,
      };
    }

    return <BackImage {...props} />;
  }

  render() {
    const {
      onPress,
      pressColorAndroid,
      width,
      title,
      titleStyle,
      tintColor,
      backImage,
      truncatedTitle,
    } = this.props;

    const renderTruncated =
      this.state.initialTextWidth && width
        ? this.state.initialTextWidth > width
        : false;

    const backButtonTitle = renderTruncated ? truncatedTitle : title;

    const pressColor = pressColorAndroid
      ? pressColorAndroid
      : `rgba(${tintColor}, .32)`;

    const BackButton = (
      <TouchableItem
        accessibilityComponentType="button"
        accessibilityLabel={backButtonTitle}
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColor}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          {this._renderBackImage()}
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

    if (Platform.OS === 'android' && !React.isValidElement(backImage)) {
      return <View style={styles.containerAndroid}>{BackButton}</View>;
    }
    return BackButton;
  }
}

const styles = StyleSheet.create({
  containerAndroid: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
          marginLeft: 9,
          marginRight: 22,
          marginVertical: 12,
          resizeMode: 'contain',
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        }
      : {
          height: 24,
          width: 24,
          margin: 2,
          resizeMode: 'contain',
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        },
  iconWithTitle:
    Platform.OS === 'ios'
      ? {
          marginRight: 6,
        }
      : {},
});

export default HeaderBackButton;
