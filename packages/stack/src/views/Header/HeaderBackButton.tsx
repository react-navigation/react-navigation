import * as React from 'react';
import {
  I18nManager,
  Image,
  View,
  Platform,
  StyleSheet,
  LayoutChangeEvent,
  MaskedViewIOS,
} from 'react-native';
import Animated from 'react-native-reanimated';
import TouchableItem from '../TouchableItem';
import { HeaderBackButtonProps } from '../../types';

type Props = HeaderBackButtonProps & {
  tintColor: string;
};

type State = {
  initialLabelWidth?: number;
};

class HeaderBackButton extends React.Component<Props, State> {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
      web: '#5f6368',
    }),
    labelVisible: Platform.OS === 'ios',
    truncatedLabel: 'Back',
  };

  state: State = {};

  private handleLabelLayout = (e: LayoutChangeEvent) => {
    const { onLabelLayout } = this.props;

    onLabelLayout && onLabelLayout(e);

    if (this.state.initialLabelWidth) {
      return;
    }

    this.setState({
      initialLabelWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  private renderBackImage() {
    const { backImage, labelVisible, tintColor } = this.props;

    let label = this.getLabelText();

    if (backImage) {
      return backImage({ tintColor, label });
    } else {
      return (
        <Image
          style={[
            styles.icon,
            !!labelVisible && styles.iconWithTitle,
            !!tintColor && { tintColor },
          ]}
          source={require('../assets/back-icon.png')}
          fadeDuration={0}
        />
      );
    }
  }

  private getLabelText = () => {
    const { titleLayout, screenLayout, label, truncatedLabel } = this.props;

    let { initialLabelWidth: initialLabelWidth } = this.state;

    if (!label) {
      return truncatedLabel;
    } else if (
      initialLabelWidth &&
      titleLayout &&
      screenLayout &&
      (screenLayout.width - titleLayout.width) / 2 < initialLabelWidth + 26
    ) {
      return truncatedLabel;
    } else {
      return label;
    }
  };

  private maybeRenderTitle() {
    const {
      allowFontScaling,
      labelVisible,
      backImage,
      labelStyle,
      tintColor,
      screenLayout,
    } = this.props;

    let leftLabelText = this.getLabelText();

    if (!labelVisible || leftLabelText === undefined) {
      return null;
    }

    const title = (
      <Animated.Text
        accessible={false}
        onLayout={this.handleLabelLayout}
        style={[
          styles.title,
          screenLayout ? { marginRight: screenLayout.width / 2 } : null,
          tintColor ? { color: tintColor } : null,
          labelStyle,
        ]}
        numberOfLines={1}
        allowFontScaling={!!allowFontScaling}
      >
        {this.getLabelText()}
      </Animated.Text>
    );

    if (backImage) {
      return title;
    }

    return (
      <MaskedViewIOS
        maskElement={
          <View style={styles.iconMaskContainer}>
            <Image
              source={require('../assets/back-icon-mask.png')}
              style={styles.iconMask}
            />
            <View style={styles.iconMaskFillerRect} />
          </View>
        }
      >
        {title}
      </MaskedViewIOS>
    );
  }

  private handlePress = () =>
    this.props.onPress && requestAnimationFrame(this.props.onPress);

  render() {
    const { pressColorAndroid, label, disabled } = this.props;

    return (
      <TouchableItem
        disabled={disabled}
        accessible
        accessibilityRole="button"
        accessibilityComponentType="button"
        accessibilityLabel={
          label && label !== 'Back' ? `${label}, back` : 'Go back'
        }
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={disabled ? undefined : this.handlePress}
        pressColor={pressColorAndroid}
        style={[styles.container, disabled && styles.disabled]}
        hitSlop={Platform.select({
          ios: undefined,
          default: { top: 8, right: 8, bottom: 8, left: 8 },
        })}
        borderless
      >
        <React.Fragment>
          {this.renderBackImage()}
          {this.maybeRenderTitle()}
        </React.Fragment>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: null,
      default: {
        marginVertical: 3,
        marginHorizontal: 11,
      },
    }),
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: 17,
    // Title and back title are a bit different width due to title being bold
    // Adjusting the letterSpacing makes them coincide better
    letterSpacing: 0.35,
  },
  icon: Platform.select({
    ios: {
      height: 21,
      width: 13,
      marginLeft: 8,
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
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  }),
  iconWithTitle:
    Platform.OS === 'ios'
      ? {
          marginRight: 6,
        }
      : {},
  iconMaskContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconMaskFillerRect: {
    flex: 1,
    backgroundColor: '#000',
  },
  iconMask: {
    height: 21,
    width: 13,
    marginLeft: -14.5,
    marginVertical: 12,
    alignSelf: 'center',
    resizeMode: 'contain',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});

export default HeaderBackButton;
