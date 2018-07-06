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

const defaultRightImage = require('../assets/more-icon.png');

class HeaderRightButton extends React.PureComponent {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'more',
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

  _renderRightImage() {
    const { rightImage, title, tintColor } = this.props;

    let RightImage;
    let props;

    if (React.isValidElement(rightImage)) {
      return rightImage;
    } else if (typeof rightImage ==='function') {
      RightImage = rightImage;
      props = {
        tintColor,
        title,
      };
    } else {
      let sourceImage = undefined,
        sourceFunc = undefined,
        moreProps = undefined
      if (rightImage && (typeof rightImage === 'object') && rightImage.source) {
        if (React.isValidElement(rightImage.source)) {
          return rightImage.source;
        } else if (typeof rightImage.source === 'function') {
          sourceFunc = rightImage.source;
          moreProps = { tintColor, title };
        } else sourceImage = rightImage.source
      }
      RightImage = sourceFunc || Image;
      props = {
        style: [
          styles.icon,
          !sourceFunc && styles.iconResizeMode,
          !!title && styles.iconWithTitle,
          !sourceFunc && !!tintColor && { tintColor },
        ],
        source: sourceImage || defaultRightImage,
        ...moreProps,
      };
    }

    return <RightImage {...props} />;
  }

  render() {
    const {
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

    const rightButtonTitle = renderTruncated ? truncatedTitle : title;

    return (
      <TouchableItem
        accessibilityComponentType="button"
        accessibilityLabel={rightButtonTitle}
        accessibilityTraits="button"
        testID="header-right"
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColorAndroid}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          {Platform.OS === 'ios' &&
            typeof rightButtonTitle === 'string' && (
              <Text
                onLayout={this._onTextLayout}
                style={[
                  styles.title,
                  !!tintColor && { color: tintColor },
                  titleStyle,
                ]}
                numberOfLines={1}
              >
                {rightButtonTitle}
              </Text>
            )}
          {this._renderRightImage()}
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
    paddingLeft: 10,
  },
  icon:
    Platform.OS === 'ios'
      ? {
          height: 21,
          width: 13,
          marginLeft: 22,
          marginRight: 9,
          marginVertical: 12,
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        }
      : {
          height: 24,
          width: 24,
          margin: 16,
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        },
  iconResizeMode: {
    resizeMode: 'contain',
  },
  iconWithTitle:
    Platform.OS === 'ios'
      ? {
          marginLeft: 6,
        }
      : {},
});

export default HeaderRightButton;
