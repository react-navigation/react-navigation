/* @flow */

import React from 'react';
import {
  I18nManager,
  Image,
  Text,
  View,
  Platform,
  StyleSheet,
} from 'react-native';

import type { LayoutEvent, TextStyleProp } from '../../TypeDefinition';

type Props = {
  title?: ?string,
  titleStyle?: ?TextStyleProp,
  tintColor?: ?string,
  truncatedTitle?: ?string,
  width?: ?number,
};

type DefaultProps = {
  tintColor: ?string,
  truncatedTitle: ?string,
};

type State = {
  initialTextWidth?: number,
};

class HeaderBackButton extends React.PureComponent<DefaultProps, Props, State> {
  static defaultProps = {
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'Back',
  };

  state = {};

  _onTextLayout = (e: LayoutEvent) => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  render() {
    const {
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

    // eslint-disable-next-line global-require
    const asset = require('../assets/back-icon.png');

    return (
      <View style={styles.container}>
        <Image
          style={[styles.icon, title && styles.iconWithTitle, { tintColor }]}
          source={asset}
        />
        {Platform.OS === 'ios' &&
          title &&
          <Text
            onLayout={this._onTextLayout}
            style={[styles.title, { color: tintColor }, titleStyle]}
            numberOfLines={1}
          >
            {backButtonTitle}
          </Text>}
      </View>
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
