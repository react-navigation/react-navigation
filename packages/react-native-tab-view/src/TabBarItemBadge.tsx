import {
  Animated,
  type StyleProp,
  StyleSheet,
  type TextStyle,
} from 'react-native';

import {
  TAB_BAR_BADGE_BACKGROUND_COLOR,
  TAB_BAR_BADGE_TEXT_COLOR,
} from './constants';

type Props = {
  children: string | number;
  style?: StyleProp<TextStyle> | undefined;
  allowFontScaling?: boolean | undefined;
};

export function TabBarItemBadge({ children, style, allowFontScaling }: Props) {
  return (
    <Animated.Text
      numberOfLines={1}
      allowFontScaling={allowFontScaling}
      style={[styles.badge, style]}
    >
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: TAB_BAR_BADGE_BACKGROUND_COLOR,
    color: TAB_BAR_BADGE_TEXT_COLOR,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
