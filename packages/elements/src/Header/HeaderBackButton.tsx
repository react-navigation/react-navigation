import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  I18nManager,
  Image,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import MaskedView from '../MaskedView';
import PlatformPressable from '../PlatformPressable';
import type { HeaderBackButtonProps } from '../types';

export default function HeaderBackButton({
  disabled,
  allowFontScaling,
  backImage,
  label,
  labelStyle,
  labelVisible,
  onLabelLayout,
  onPress,
  pressColor,
  pressOpacity,
  screenLayout,
  tintColor: customTintColor,
  titleLayout,
  truncatedLabel = 'Back',
  accessibilityLabel = label && label !== 'Back' ? `${label}, back` : 'Go back',
  testID,
  style,
}: HeaderBackButtonProps) {
  const { colors } = useTheme();

  const [initialLabelWidth, setInitialLabelWidth] = React.useState<
    undefined | number
  >(undefined);

  const tintColor =
    customTintColor !== undefined
      ? customTintColor
      : Platform.select({
          ios: colors.primary,
          default: colors.text,
        });

  const handleLabelLayout = (e: LayoutChangeEvent) => {
    onLabelLayout?.(e);

    setInitialLabelWidth(e.nativeEvent.layout.x + e.nativeEvent.layout.width);
  };

  const shouldTruncateLabel = () => {
    return (
      !label ||
      (initialLabelWidth &&
        titleLayout &&
        screenLayout &&
        (screenLayout.width - titleLayout.width) / 2 < initialLabelWidth + 26)
    );
  };

  const renderBackImage = () => {
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

  const renderLabel = () => {
    const leftLabelText = shouldTruncateLabel() ? truncatedLabel : label;

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
            leftLabelText === label ? handleLabelLayout : undefined
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
  };

  const handlePress = () => onPress && requestAnimationFrame(onPress);

  return (
    <PlatformPressable
      disabled={disabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={disabled ? undefined : handlePress}
      pressColor={pressColor}
      pressOpacity={pressOpacity}
      android_ripple={{ borderless: true }}
      style={[styles.container, disabled && styles.disabled, style]}
      hitSlop={Platform.select({
        ios: undefined,
        default: { top: 16, right: 16, bottom: 16, left: 16 },
      })}
    >
      <React.Fragment>
        {renderBackImage()}
        {renderLabel()}
      </React.Fragment>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: StyleSheet.hairlineWidth, // Avoid collapsing when title is long
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
      transform: [{ scaleX: I18nManager.getConstants().isRTL ? -1 : 1 }],
    },
    default: {
      height: 24,
      width: 24,
      margin: 3,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.getConstants().isRTL ? -1 : 1 }],
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
    transform: [{ scaleX: I18nManager.getConstants().isRTL ? -1 : 1 }],
  },
});
