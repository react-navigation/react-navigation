import { useNavigation, useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  BackHandler,
  type ColorValue,
  Image,
  type NativeEventSubscription,
  Platform,
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import clearIcon from '../assets/clear-icon.png';
import closeIcon from '../assets/close-icon.png';
import searchIcon from '../assets/search-icon.png';
import { Color } from '../Color';
import {
  AnimatedLiquidGlassContainerView,
  isLiquidGlassSupported,
} from '../LiquidGlassView';
import { PlatformPressable } from '../PlatformPressable';
import { Text } from '../Text';
import type { HeaderSearchBarOptions, HeaderSearchBarRef } from '../types';
import { HeaderBackButton } from './HeaderBackButton';
import { BUTTON_SIZE, HeaderButton } from './HeaderButton';
import { HeaderButtonBackground } from './HeaderButtonBackground';
import { HeaderIcon } from './HeaderIcon';

type Props = Omit<HeaderSearchBarOptions, 'ref'> & {
  visible: boolean;
  onClose: () => void;
  tintColor?: ColorValue;
  pressColor?: ColorValue;
  pressOpacity?: number;
  statusBarHeight: number;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

const INPUT_TYPE_TO_MODE = {
  text: 'text',
  number: 'numeric',
  phone: 'tel',
  email: 'email',
} as const;

const useNativeDriver = Platform.OS !== 'web';

function HeaderSearchBarInternal(
  {
    visible,
    inputType,
    autoFocus = true,
    autoCapitalize,
    placeholder = 'Search',
    enterKeyHint = 'search',
    cancelButtonText = 'Cancel',
    onChangeText,
    onClose,
    tintColor,
    pressColor,
    pressOpacity,
    statusBarHeight,
    style,
    ...rest
  }: Props,
  ref: React.ForwardedRef<HeaderSearchBarRef>
) {
  const navigation = useNavigation();
  const { dark, colors, fonts } = useTheme();
  const [value, setValue] = React.useState('');
  const [clearVisibleAnim] = React.useState(() => new Animated.Value(0));

  const clearVisibleValueRef = React.useRef(false);
  const inputRef = React.useRef<TextInput>(null);

  const hasText = value !== '';

  React.useEffect(() => {
    if (clearVisibleValueRef.current === hasText) {
      return;
    }

    Animated.timing(clearVisibleAnim, {
      toValue: hasText ? 1 : 0,
      duration: 100,
      useNativeDriver,
    }).start(({ finished }) => {
      if (finished) {
        clearVisibleValueRef.current = hasText;
      }
    });
  }, [clearVisibleAnim, hasText]);

  const clearText = React.useCallback(() => {
    inputRef.current?.clear();
    inputRef.current?.focus();
    setValue('');
  }, []);

  const onClear = React.useCallback(() => {
    clearText();
    // FIXME: figure out how to create a SyntheticEvent
    // @ts-expect-error: we don't have the native event here
    onChangeText?.({ nativeEvent: { text: '' } });
  }, [clearText, onChangeText]);

  const cancelSearch = React.useCallback(() => {
    // FIXME: figure out how to create a SyntheticEvent
    // @ts-expect-error: we don't have the native event here
    onChangeText?.({ nativeEvent: { text: '' } });
    onClose();
    setValue('');
  }, [onChangeText, onClose]);

  React.useEffect(() => {
    const unsubscribeBlur = navigation?.addListener('blur', cancelSearch);

    const onKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelSearch();
      }
    };

    let backHandlerSubscription: NativeEventSubscription | undefined;

    if (Platform.OS === 'web') {
      document?.body?.addEventListener?.('keyup', onKeyup);
    } else {
      backHandlerSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          cancelSearch();
          return true;
        }
      );
    }

    return () => {
      unsubscribeBlur();
      backHandlerSubscription?.remove();

      if (Platform.OS === 'web') {
        document?.body?.removeEventListener?.('keyup', onKeyup);
      }
    };
  }, [cancelSearch, navigation]);

  React.useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
      setText: (text: string) => {
        inputRef.current?.setNativeProps({ text });
        setValue(text);
      },
      clearText,
      cancelSearch,
    }),
    [cancelSearch, clearText]
  );

  const textColor = tintColor ?? colors.text;

  return (
    <AnimatedLiquidGlassContainerView
      spacing={SPACING}
      aria-live="polite"
      aria-hidden={!visible}
      style={[
        styles.container,
        Platform.OS === 'ios' && {
          gap: SPACING,
          margin: SPACING,
          marginTop: statusBarHeight ? statusBarHeight + SPACING : SPACING - 2,
        },
        style,
      ]}
    >
      {Platform.OS !== 'ios' ? (
        <HeaderBackButton
          accessibilityLabel={cancelButtonText}
          tintColor={tintColor ?? colors.text}
          pressColor={pressColor}
          pressOpacity={pressOpacity}
          onPress={cancelSearch}
          style={styles.backButton}
        />
      ) : null}
      <HeaderButtonBackground style={styles.searchbarContainer}>
        {Platform.OS === 'ios' ? (
          <HeaderIcon
            source={searchIcon}
            tintColor={textColor}
            style={styles.inputSearchIconIos}
          />
        ) : null}
        <TextInput
          {...rest}
          ref={inputRef}
          onChange={onChangeText}
          onChangeText={setValue}
          autoFocus={autoFocus}
          autoCapitalize={
            autoCapitalize === 'systemDefault' ? undefined : autoCapitalize
          }
          inputMode={INPUT_TYPE_TO_MODE[inputType ?? 'text']}
          enterKeyHint={enterKeyHint}
          placeholder={placeholder}
          placeholderTextColor={Color(textColor)?.alpha(0.5).string()}
          cursorColor={colors.primary}
          selectionHandleColor={colors.primary}
          selectionColor={Color(colors.primary)?.alpha(0.3).string()}
          style={[
            Platform.select({
              ios: isLiquidGlassSupported ? fonts.medium : fonts.regular,
              default: fonts.regular,
            }),
            styles.searchbar,
            Platform.OS === 'ios' &&
              !isLiquidGlassSupported && {
                backgroundColor: dark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)',
              },
            { color: textColor },
          ]}
        />
        {Platform.OS === 'ios' ? (
          <PlatformPressable
            accessibilityLabel="Clear"
            onPress={onClear}
            style={[
              {
                opacity: clearVisibleAnim,
                transform: [{ scale: clearVisibleAnim }],
              },
              styles.clearButtonIos,
            ]}
          >
            <Image
              source={clearIcon}
              resizeMode="contain"
              tintColor={textColor}
              style={styles.clearIconIos}
            />
          </PlatformPressable>
        ) : null}
      </HeaderButtonBackground>
      {Platform.OS !== 'ios' ? (
        <HeaderButton
          accessibilityLabel="Clear"
          onPress={onClear}
          style={[styles.closeButton, { opacity: clearVisibleAnim }]}
        >
          <HeaderIcon source={closeIcon} tintColor={textColor} />
        </HeaderButton>
      ) : null}
      {Platform.OS === 'ios' ? (
        isLiquidGlassSupported ? (
          <HeaderButtonBackground style={styles.closeButtonContainerIos}>
            <HeaderButton
              accessibilityLabel={cancelButtonText}
              onPress={cancelSearch}
            >
              <HeaderIcon source={closeIcon} tintColor={textColor} />
            </HeaderButton>
          </HeaderButtonBackground>
        ) : (
          <PlatformPressable
            accessibilityLabel={cancelButtonText}
            onPress={cancelSearch}
            style={styles.cancelButton}
          >
            <Text
              style={[
                fonts.regular,
                { color: tintColor ?? colors.primary },
                styles.cancelText,
              ]}
            >
              {cancelButtonText}
            </Text>
          </PlatformPressable>
        )
      ) : null}
    </AnimatedLiquidGlassContainerView>
  );
}

const SPACING = Platform.OS === 'ios' ? 10 : 8;
const IOS_18_TOP_OFFSET = -4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  inputSearchIconIos: {
    position: 'absolute',
    opacity: 0.5,
    top: isLiquidGlassSupported ? 5 : IOS_18_TOP_OFFSET,
    left: 5,
    height: 18,
    width: 18,
  },
  backButton: {
    alignSelf: 'center',
    marginLeft: 2,
  },
  closeButton: {
    position: 'absolute',
    opacity: 0.5,
    right: SPACING,
    height: '100%',
  },
  closeButtonContainerIos: {
    alignSelf: 'center',
  },
  clearButtonIos: {
    position: 'absolute',
    right: 5,
    top: isLiquidGlassSupported ? 0 : -9,
    bottom: 0,
    justifyContent: 'center',
    padding: 8,
  },
  clearIconIos: {
    height: 16,
    width: 16,
    opacity: 0.5,
  },
  cancelButton: {
    alignSelf: 'center',
  },
  cancelText: {
    fontSize: 17,
    marginRight: SPACING / 2,
  },
  searchbarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    ...Platform.select<ViewStyle>({
      ios: isLiquidGlassSupported
        ? {}
        : {
            minHeight: 36,
          },
      default: {
        borderRadius: 0,
      },
    }),
  },
  searchbar: {
    backgroundColor: 'transparent',
    ...Platform.select<TextStyle>({
      ios: {
        flex: 1,
        fontSize: 17,
        paddingHorizontal: SPACING + 30,
        ...(!isLiquidGlassSupported
          ? {
              marginTop: IOS_18_TOP_OFFSET,
              marginBottom: 5,
              borderRadius: SPACING,
              borderCurve: 'continuous',
            }
          : null),
      },
      default: {
        flex: 1,
        fontSize: 18,
        paddingLeft: SPACING,
        paddingRight: BUTTON_SIZE + SPACING,
      },
    }),
  },
});

export const HeaderSearchBar = React.forwardRef(HeaderSearchBarInternal);
