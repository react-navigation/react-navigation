import * as React from 'react';
import {
  I18nManager,
  Image,
  Text,
  View,
  Platform,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';

import TouchableItem from '../TouchableItem';

import defaultBackImage from '../assets/back-icon.png';
import BackButtonWeb from './BackButtonWeb';
import { HeaderBackbuttonProps } from '../../types';

type State = {
  initialTextWidth?: number;
};

class HeaderBackButton extends React.PureComponent<
  HeaderBackbuttonProps,
  State
> {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
      web: '#5f6368',
    }),
    truncatedTitle: 'Back',
    backImage: Platform.select({
      web: BackButtonWeb,
    }),
  };

  state: State = {};

  private handleTextLayout = (e: LayoutChangeEvent) => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  private renderBackImage() {
    const { backImage, backTitleVisible, tintColor } = this.props;

    let title = this.getTitleText();

    if (React.isValidElement(backImage)) {
      return backImage;
    } else if (backImage) {
      const BackImage = backImage;

      return <BackImage tintColor={tintColor} title={title} />;
    } else {
      return (
        <Image
          style={[
            styles.icon,
            !!backTitleVisible && styles.iconWithTitle,
            !!tintColor && { tintColor },
          ]}
          source={defaultBackImage}
          fadeDuration={0}
        />
      );
    }
  }

  private getTitleText = () => {
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

  private maybeRenderTitle() {
    const {
      allowFontScaling,
      backTitleVisible,
      titleStyle,
      tintColor,
    } = this.props;
    let backTitleText = this.getTitleText();

    if (!backTitleVisible || backTitleText === null) {
      return null;
    }

    return (
      <Text
        accessible={false}
        onLayout={this.handleTextLayout}
        style={[styles.title, !!tintColor && { color: tintColor }, titleStyle]}
        numberOfLines={1}
        allowFontScaling={!!allowFontScaling}
      >
        {this.getTitleText()}
      </Text>
    );
  }

  render() {
    const { onPress, pressColorAndroid, title, disabled } = this.props;

    let button = (
      <TouchableItem
        disabled={disabled}
        accessible
        accessibilityRole="button"
        accessibilityComponentType="button"
        accessibilityLabel={title ? `${title}, back` : 'Go back'}
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={disabled ? undefined : onPress}
        pressColor={pressColorAndroid}
        style={[styles.container, disabled && styles.disabled]}
        borderless
      >
        <View style={styles.container}>
          {this.renderBackImage()}
          {this.maybeRenderTitle()}
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
  disabled: {
    opacity: 0.5,
  },
  androidButtonWrapper: {
    margin: 13,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        marginLeft: 21,
      },
      default: {},
    }),
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
  icon: Platform.select({
    ios: {
      backgroundColor: 'transparent',
      height: 21,
      width: 13,
      marginLeft: 9,
      marginRight: 22,
      marginVertical: 12,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
    default: {
      height: 24,
      width: 24,
      margin: 3,
      resizeMode: 'contain',
      backgroundColor: 'transparent',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  }),
  iconWithTitle:
    Platform.OS === 'ios'
      ? {
          marginRight: 6,
        }
      : {},
});

export default HeaderBackButton;
