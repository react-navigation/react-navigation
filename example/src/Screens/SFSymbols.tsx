import { Text } from '@react-navigation/elements';
import {
  SFSymbol,
  type SFSymbolProps,
  type StaticScreenProps,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SF_SYMBOL_NAMES } from '../sf-symbol-names';

const COLUMN_COUNT = 4;
const ICON_SIZE = 32;
const ICON_PADDING_VERTICAL = 8;
const ICON_NAME_MARGIN_TOP = 4;
const ICON_NAME_FONT_SIZE = 10;
const ROW_HEIGHT =
  ICON_SIZE +
  (ICON_PADDING_VERTICAL + ICON_NAME_MARGIN_TOP + ICON_NAME_FONT_SIZE) * 2;

export function SFSymbols(_: StaticScreenProps<{}>) {
  const navigation = useNavigation('SFSymbols');
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search icons...',
        onChange: (event) => {
          const text = event.nativeEvent.text;

          setQuery(text);
        },
      },
    });
  }, [navigation]);

  const rows = React.useMemo(() => {
    const icons = query.trim()
      ? SF_SYMBOL_NAMES.filter((name) =>
          name.toLowerCase().includes(query.toLowerCase())
        )
      : SF_SYMBOL_NAMES;

    // FlatList has performance issues with `numColumns`
    // So we use a single-column list with rows containing multiple icons
    const result: SFSymbolProps['name'][][] = [];

    for (let i = 0; i < icons.length; i += COLUMN_COUNT) {
      result.push(icons.slice(i, i + COLUMN_COUNT));
    }

    return result;
  }, [query]);

  if (Platform.OS !== 'ios') {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          SFSymbol is only available on iOS
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={rows}
      renderItem={({ item }) => <SFSymbolRow items={item} />}
      keyExtractor={(item) => item[0]}
      contentContainerStyle={{
        backgroundColor: colors.background,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
      }}
      getItemLayout={(_, index) => ({
        length: ROW_HEIGHT,
        offset: ROW_HEIGHT * index,
        index,
      })}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
}

const SFSymbolRow = React.memo(function SFSymbolRow({
  items,
}: {
  items: SFSymbolProps['name'][];
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item} style={[styles.item, { borderColor: colors.border }]}>
          <SFSymbol name={item} size={ICON_SIZE} color={colors.text} />
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
});

SFSymbols.title = 'SF Symbols';
SFSymbols.options = { headerShown: true };
SFSymbols.linking = {};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: ICON_PADDING_VERTICAL,
    paddingTop:
      ICON_PADDING_VERTICAL + ICON_NAME_FONT_SIZE + ICON_NAME_MARGIN_TOP,
    minWidth: 80,
    borderWidth: StyleSheet.hairlineWidth,
  },
  name: {
    marginTop: ICON_NAME_MARGIN_TOP,
    fontSize: ICON_NAME_FONT_SIZE,
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: 70,
  },
});
