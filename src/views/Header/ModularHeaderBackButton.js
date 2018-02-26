import React from 'react';
import { I18nManager, Image, Text, View, StyleSheet } from 'react-native';

import TouchableItem from '../TouchableItem';

class ModularHeaderBackButton extends React.PureComponent {
  static defaultProps = {
    tintColor: '#037aff',
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

    let backButtonTitle = renderTruncated ? truncatedTitle : title;

    // TODO: When we've sorted out measuring in the header, let's revisit this.
    // This is clearly a bad workaround.
    if (backButtonTitle && backButtonTitle.length > 8) {
      backButtonTitle = truncatedTitle;
    }

    const { ButtonContainerComponent, LabelContainerComponent } = this.props;

    return (
      <TouchableItem
        accessibilityComponentType="button"
        accessibilityLabel={backButtonTitle}
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={onPress}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          <ButtonContainerComponent>
            <Image
              style={[
                styles.icon,
                !!title && styles.iconWithTitle,
                !!tintColor && { tintColor },
              ]}
              source={buttonImage}
            />
          </ButtonContainerComponent>
          {typeof backButtonTitle === 'string' && (
            <LabelContainerComponent>
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
            </LabelContainerComponent>
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
  icon: {
    height: 21,
    width: 12,
    marginLeft: 9,
    marginRight: 22,
    marginVertical: 12,
    resizeMode: 'contain',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  iconWithTitle: {
    marginRight: 3,
  },
});

export default ModularHeaderBackButton;
