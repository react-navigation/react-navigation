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

import defaultBackImage from '../assets/back-icon.png';

class HeaderBackButton extends React.PureComponent {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
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
    const { backImage, backTitleVisible, tintColor } = this.props;
    let title = this._getTitleText();

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
          !!backTitleVisible && styles.iconWithTitle,
          !!tintColor && { tintColor },
        ],
        source: defaultBackImage,
      };
    }

    return <BackImage {...props} fadeDuration={0} />;
  }

  _getTitleText = () => {
    const { width, title, truncatedTitle } = this.props;

    let { initialTextWidth } = this.state;

    if (title === null) {
      return null;
    } else if (!title) {
      return truncatedTitle;
    } else if (initialTextWidth && width && initialTextWidth > width) {
      return truncatedTitle;
    } else {
      return title;
    }
  };

  _maybeRenderTitle() {
    const {
      allowFontScaling,
      backTitleVisible,
      titleStyle,
      tintColor,
    } = this.props;
    let backTitleText = this._getTitleText();

    if (!backTitleVisible || backTitleText === null) {
      return null;
    }

    return (
      <Text
        accessible={false}
        onLayout={this._onTextLayout}
        style={[styles.title, !!tintColor && { color: tintColor }, titleStyle]}
        numberOfLines={1}
        allowFontScaling={!!allowFontScaling}
      >
        {this._getTitleText()}
      </Text>
    );
  }

  render() {
    const { onPress, pressColorAndroid, title } = this.props;

    let button = (
      <TouchableItem
        accessible
        accessibilityRole="button"
        accessibilityComponentType="button"
        accessibilityLabel={title ? `${title}, back` : 'Go back'}
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColorAndroid}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          {this._renderBackImage()}
          {this._maybeRenderTitle()}
        </View>
      </TouchableItem>
    );

    if (Platform.OS === 'ios') {
      return button;
    } else {
      return <View style={styles.androidButtonWrapper}>{button}</View>;
    }
  }
}

const styles = StyleSheet.create({
  androidButtonWrapper: {
    margin: 13,
    backgroundColor: 'transparent',
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
          backgroundColor: 'transparent',
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
          margin: 3,
          resizeMode: 'contain',
          backgroundColor: 'transparent',
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
