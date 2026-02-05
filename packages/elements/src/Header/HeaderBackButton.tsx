import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  type ColorValue,
  Platform,
  type StyleProp,
  StyleSheet,
  // eslint-disable-next-line no-restricted-imports
  type Text,
  type TextStyle,
  View,
} from 'react-native';

import backIconImage from '../assets/back-icon.png';
import { isLiquidGlassSupported } from '../LiquidGlassView';
import type {
  HeaderBackButtonDisplayMode,
  HeaderBackButtonProps,
  HeaderIcon as HeaderIconType,
} from '../types';
import { BUTTON_SIZE, HeaderButton } from './HeaderButton';
import { HeaderIcon } from './HeaderIcon';

export function HeaderBackButton({
  disabled,
  allowFontScaling,
  backIcon,
  label,
  labelStyle,
  displayMode = 'minimal',
  onPress,
  pressColor,
  pressOpacity,
  tintColor,
  truncatedLabel = 'Back',
  accessibilityLabel = label && label !== 'Back' ? `${label}, back` : 'Go back',
  testID,
  style,
  href,
}: HeaderBackButtonProps) {
  const [measuredMinimal, setMeasuredMinimal] = React.useReducer(
    () => true,
    false
  );

  const { colors } = useTheme();

  const isMinimal = displayMode === 'minimal' || measuredMinimal;

  const renderBackImage = () => {
    const color = tintColor ?? colors.text;

    if (typeof backIcon === 'function') {
      return backIcon({ tintColor: color });
    }

    const icon =
      backIcon ??
      Platform.select<HeaderIconType>({
        ios: {
          type: 'sfSymbol',
          name: 'chevron.left',
        },
        android: {
          type: 'materialSymbol',
          name: 'arrow_back',
        },
        default: {
          type: 'image',
          source: backIconImage,
        },
      });

    return <HeaderIcon icon={icon} color={color} style={styles.icon} />;
  };

  const handlePress = () => {
    if (onPress) {
      requestAnimationFrame(() => onPress());
    }
  };

  return (
    <HeaderButton
      disabled={disabled}
      href={href}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={handlePress}
      pressColor={pressColor}
      pressOpacity={pressOpacity}
      style={[styles.container, isMinimal && styles.containerMinimal, style]}
    >
      <React.Fragment>
        {renderBackImage()}
        {!isMinimal ? (
          <HeaderBackLabel
            allowFontScaling={allowFontScaling}
            displayMode={displayMode}
            label={label}
            labelStyle={labelStyle}
            tintColor={tintColor}
            truncatedLabel={truncatedLabel}
            onMeasureMinimal={setMeasuredMinimal}
          />
        ) : null}
      </React.Fragment>
    </HeaderButton>
  );
}

function HeaderBackLabel({
  allowFontScaling,
  displayMode,
  label,
  labelStyle,
  tintColor,
  truncatedLabel,
  onMeasureMinimal,
}: {
  allowFontScaling?: boolean;
  displayMode: HeaderBackButtonDisplayMode;
  label: string | undefined;
  labelStyle?: Animated.WithAnimatedValue<StyleProp<TextStyle>>;
  tintColor?: ColorValue;
  truncatedLabel: string | undefined;
  onMeasureMinimal: () => void;
}) {
  const { fonts } = useTheme();

  const [wrapperWidth, setWrapperWidth] = React.useState<number | null>(null);
  const [labelWidth, setLabelWidth] = React.useState<number | null>(null);
  const [truncatedLabelWidth, setTruncatedLabelWidth] = React.useState<
    number | null
  >(null);

  const wrapperRef = React.useRef<View | null>(null);
  const labelRef = React.useRef<Text | null>(null);
  const truncatedLabelRef = React.useRef<Text | null>(null);

  React.useLayoutEffect(() => {
    wrapperRef.current?.measure((_x, _y, width) => {
      setWrapperWidth(width);
    });

    labelRef.current?.measure((_x, _y, width) => {
      setLabelWidth(width);
    });

    truncatedLabelRef.current?.measure((_x, _y, width) => {
      setTruncatedLabelWidth(width);
    });
  }, []);

  const availableSpace = wrapperWidth;

  const potentialLabelText = displayMode === 'default' ? label : truncatedLabel;
  const hasMeasured =
    availableSpace !== null && labelWidth !== null && truncatedLabel
      ? truncatedLabelWidth !== null
      : true;

  const finalLabelText =
    availableSpace && labelWidth
      ? availableSpace >= labelWidth
        ? potentialLabelText
        : truncatedLabelWidth
          ? availableSpace >= truncatedLabelWidth
            ? truncatedLabel
            : null
          : null
      : potentialLabelText;

  const isMinimal = hasMeasured && finalLabelText === null;

  React.useLayoutEffect(() => {
    if (isMinimal) {
      onMeasureMinimal();
    }
  }, [isMinimal, onMeasureMinimal]);

  const commonStyle: Animated.WithAnimatedValue<StyleProp<TextStyle>> = [
    fonts.regular,
    styles.label,
    labelStyle,
  ];

  const hiddenStyle: Animated.WithAnimatedValue<StyleProp<TextStyle>> = [
    commonStyle,
    {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0,
    },
  ];

  return (
    <View
      ref={wrapperRef}
      onLayout={(e) => {
        setWrapperWidth(e.nativeEvent.layout.width);
      }}
      style={styles.labelWrapper}
    >
      {label && displayMode === 'default' ? (
        <Animated.Text
          ref={labelRef}
          onLayout={(e) => setLabelWidth(e.nativeEvent.layout.width)}
          aria-hidden={true}
          style={hiddenStyle}
          numberOfLines={1}
          allowFontScaling={allowFontScaling}
        >
          {label}
        </Animated.Text>
      ) : null}
      {truncatedLabel ? (
        <Animated.Text
          ref={truncatedLabelRef}
          onLayout={(e) => setTruncatedLabelWidth(e.nativeEvent.layout.width)}
          aria-hidden={true}
          style={hiddenStyle}
          numberOfLines={1}
          allowFontScaling={allowFontScaling}
        >
          {truncatedLabel}
        </Animated.Text>
      ) : null}
      {finalLabelText ? (
        <Animated.Text
          accessible={false}
          style={[tintColor ? { color: tintColor } : null, commonStyle]}
          numberOfLines={1}
          allowFontScaling={allowFontScaling}
        >
          {finalLabelText}
        </Animated.Text>
      ) : null}
    </View>
  );
}

// iOS uses a smaller chevron, Android uses a larger arrow
const ICON_WIDTH = Platform.OS === 'ios' ? 13 : 24;
const ICON_SPACING_START = isLiquidGlassSupported
  ? 15 // Standard distance of chevron from left edge in liquid glass
  : 2; // Otherwise icon is aligned to the start of the button

// Standard distance between chevron and label
const ICON_LABEL_SPACING = 9;

const LABEL_FONT_SIZE = 17;
const LABEL_LETTER_SPACING = 0.35;

const styles = StyleSheet.create({
  container: {
    borderRadius: BUTTON_SIZE / 2,
    flexShrink: 1,
    paddingHorizontal: 0,
    minWidth: StyleSheet.hairlineWidth, // Avoid collapsing when title is long,
  },
  containerMinimal: {
    minWidth: BUTTON_SIZE,
    minHeight: BUTTON_SIZE,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: Platform.OS === 'ios' ? 'flex-start' : 'center',
  },
  label: {
    fontSize: LABEL_FONT_SIZE,
    letterSpacing: LABEL_LETTER_SPACING,
  },
  labelWrapper: {
    // Make sure that the label doesn't fill the available space
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginStart: ICON_LABEL_SPACING,
  },
  icon: {
    width: ICON_WIDTH,
    marginStart: ICON_SPACING_START,
    marginEnd: 0,
  },
});
