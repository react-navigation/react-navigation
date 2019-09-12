import * as React from 'react';
import {
  I18nManager,
  Image,
  View,
  Platform,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';
import MaskedView from '../MaskedView';
import TouchableItem from '../TouchableItem';
import { HeaderLeftButtonProps } from '../../types';

type Props = HeaderLeftButtonProps & {
  tintColor: string;
};

type State = {
  fullLabelWidth?: number;
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

    this.setState({
      fullLabelWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  private shouldTruncateLabel = () => {
    const { titleLayout, screenLayout, label } = this.props;
    const { fullLabelWidth: initialLabelWidth } = this.state;

    return (
      !label ||
      (initialLabelWidth &&
        titleLayout &&
        screenLayout &&
        (screenLayout.width - titleLayout.width) / 2 < initialLabelWidth + 26)
    );
  };

  private renderBackImage = () => {
    const { backImage, labelVisible, tintColor } = this.props;

    if (backImage) {
      return backImage({ tintColor });
    } else {
      return (
        <Image
          style={[
            styles.icon,
            Boolean(labelVisible) && styles.iconWithLabel,
            Boolean(tintColor) && { tintColor },
          ]}
          source={require('../assets/back-icon.png')}
          fadeDuration={0}
        />
      );
    }
  };

  private renderLabel() {
    const {
      label,
      truncatedLabel,
      allowFontScaling,
      labelVisible,
      backImage,
      labelStyle,
      tintColor,
      screenLayout,
    } = this.props;

    const leftLabelText = this.shouldTruncateLabel() ? truncatedLabel : label;

    if (!labelVisible || leftLabelText === undefined) {
      return null;
    }

    const labelElement = (
      <View
        style={
          screenLayout
            ? // We make the button extend till the middle of the screen
              // Otherwise it appears to cut off when translating
              [styles.labelWrapper, { minWidth: screenLayout.width / 2 - 27 }]
            : null
        }
      >
        <Animated.Text
          accessible={false}
          onLayout={
            // This measurement is used to determine if we should truncate the label when it doesn't fit
            // Only measure it when label is not truncated because we want the measurement of full label
            leftLabelText === label ? this.handleLabelLayout : undefined
          }
          style={[
            styles.label,
            tintColor ? { color: tintColor } : null,
            labelStyle,
          ]}
          numberOfLines={1}
          allowFontScaling={!!allowFontScaling}
        >
          {leftLabelText}
        </Animated.Text>
      </View>
    );

    if (backImage || Platform.OS !== 'ios') {
      // When a custom backimage is specified, we can't mask the label
      // Otherwise there might be weird effect due to our mask not being the same as the image
      return labelElement;
    }

    return (
      <MaskedView
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
        {labelElement}
      </MaskedView>
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
          {this.renderLabel()}
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
  label: {
    fontSize: 17,
    // Title and back label are a bit different width due to title being bold
    // Adjusting the letterSpacing makes them coincide better
    letterSpacing: 0.35,
  },
  labelWrapper: {
    // These styles will make sure that the label doesn't fill the available space
    // Otherwise it messes with the measurement of the label
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  iconWithLabel:
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
