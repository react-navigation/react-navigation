import { Text } from '@react-navigation/elements';
import {
  MaterialSymbol,
  type MaterialSymbolProps,
  type StaticScreenProps,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MATERIAL_SYMBOL_NAMES } from '../material-symbol-names';
import { SegmentedPicker } from '../Shared/SegmentedPicker';

const COLUMN_COUNT = 4;
const ICON_SIZE = 32;
const ICON_PADDING_VERTICAL = 8;
const ICON_NAME_MARGIN_TOP = 4;
const ICON_NAME_FONT_SIZE = 10;
const ROW_HEIGHT =
  ICON_SIZE +
  (ICON_PADDING_VERTICAL + ICON_NAME_MARGIN_TOP + ICON_NAME_FONT_SIZE) * 2;

const VARIANTS = ['outlined', 'rounded', 'sharp'] as const;
type Variant = (typeof VARIANTS)[number];

export function MaterialSymbols(_: StaticScreenProps<{}>) {
  const navigation = useNavigation('MaterialSymbols');
  const { colors, fonts } = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = React.useState('');
  const [variant, setVariant] = React.useState<Variant>('outlined');
  const [image, setImage] = React.useState(false);

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
      ? MATERIAL_SYMBOL_NAMES.filter((name) =>
          name.toLowerCase().includes(query.toLowerCase())
        )
      : MATERIAL_SYMBOL_NAMES;

    // FlatList has performance issues with `numColumns`
    // So we use a single-column list with rows containing multiple icons
    const result: MaterialSymbolProps['name'][][] = [];

    for (let i = 0; i < icons.length; i += COLUMN_COUNT) {
      result.push(icons.slice(i, i + COLUMN_COUNT));
    }

    return result;
  }, [query]);

  if (Platform.OS !== 'android') {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          MaterialSymbol is only available on Android
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={rows}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <SegmentedPicker
            choices={VARIANTS.map((v) => ({
              label: v.charAt(0).toUpperCase() + v.slice(1),
              value: v,
            }))}
            value={variant}
            onValueChange={setVariant}
          />
          <View style={styles.switch}>
            <Text style={fonts.medium}>Image</Text>
            <Switch value={image} onValueChange={setImage} />
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <MaterialSymbolRow items={item} variant={variant} image={image} />
      )}
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

const MaterialSymbolRow = React.memo(function MaterialSymbolRow({
  items,
  variant,
  image,
}: {
  items: MaterialSymbolProps['name'][];
  variant: Variant;
  image: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item} style={[styles.item, { borderColor: colors.border }]}>
          {image ? (
            <Image
              source={MaterialSymbol.getImageSource({
                name: item,
                variant,
                size: ICON_SIZE,
                color: colors.text,
              })}
            />
          ) : (
            <MaterialSymbol
              name={item}
              variant={variant}
              size={ICON_SIZE}
              color={colors.text}
            />
          )}
          <Text
            style={[styles.iconName, { color: colors.text }]}
            numberOfLines={1}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
});

MaterialSymbols.title = 'Material Symbols';
MaterialSymbols.options = { headerShown: true };
MaterialSymbols.linking = {};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  iconName: {
    marginTop: ICON_NAME_MARGIN_TOP,
    fontSize: ICON_NAME_FONT_SIZE,
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: 70,
  },
});
