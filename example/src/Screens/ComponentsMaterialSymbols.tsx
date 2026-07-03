import { Text } from '@react-navigation/elements';
import { Color } from '@react-navigation/elements/internal';
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
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MATERIAL_SYMBOL_NAMES } from '../material-symbol-names';

type MaterialSymbolVariant = NonNullable<MaterialSymbolProps['variant']>;
type MaterialSymbolWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;
type MaterialSymbolSource = 'font' | 'image';

type Choice<T extends string | number | boolean> = {
  label: string;
  value: T;
};

// `MaterialSymbol.getImageSource` is only implemented on Android
const SUPPORTS_GET_IMAGE = Platform.OS === 'android';

const COLUMN_COUNT = 4;
const ICON_SIZE = 32;
const ICON_PADDING_VERTICAL = 8;
const ICON_NAME_MARGIN_TOP = 4;
const ICON_NAME_FONT_SIZE = 10;
const ROW_HEIGHT =
  ICON_SIZE +
  (ICON_PADDING_VERTICAL + ICON_NAME_MARGIN_TOP + ICON_NAME_FONT_SIZE) * 2;

const VARIANTS: Choice<MaterialSymbolVariant>[] = [
  { label: 'Outlined', value: 'outlined' },
  { label: 'Rounded', value: 'rounded' },
  { label: 'Sharp', value: 'sharp' },
];

const WEIGHTS: Choice<MaterialSymbolWeight>[] = [
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: '300', value: 300 },
  { label: '400', value: 400 },
  { label: '500', value: 500 },
  { label: '600', value: 600 },
  { label: '700', value: 700 },
];

const SOURCES: Choice<MaterialSymbolSource>[] = [
  { label: 'Font', value: 'font' },
  { label: 'Image', value: 'image' },
];

export function ComponentsMaterialSymbols(_: StaticScreenProps<{}>) {
  const navigation = useNavigation('ComponentsMaterialSymbols');
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = React.useState('');
  const [variant, setVariant] =
    React.useState<MaterialSymbolVariant>('outlined');
  const [weight, setWeight] = React.useState<MaterialSymbolWeight>(400);
  const [source, setSource] = React.useState<MaterialSymbolSource>('font');
  const [expanded, setExpanded] = React.useState(false);

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
    const search = query.trim().toLowerCase();
    const icons = search
      ? MATERIAL_SYMBOL_NAMES.filter((name) => name.includes(search))
      : MATERIAL_SYMBOL_NAMES;

    // FlatList has performance issues with `numColumns`
    // So we use a single-column list with rows containing multiple icons
    const result: MaterialSymbolProps['name'][][] = [];

    for (let i = 0; i < icons.length; i += COLUMN_COUNT) {
      result.push(icons.slice(i, i + COLUMN_COUNT));
    }

    return result;
  }, [query]);

  if (Platform.OS !== 'android' && Platform.OS !== 'web') {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          MaterialSymbol is only available on Android and Web
        </Text>
      </View>
    );
  }

  const image = source === 'image';

  return (
    <FlatList
      data={rows}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={
        <View style={{ backgroundColor: colors.card }}>
          <Pressable
            onPress={() => setExpanded((value) => !value)}
            style={styles.headerToggle}
          >
            <Text style={{ color: colors.text }}>Customization</Text>
            <MaterialSymbol
              name={expanded ? 'expand_less' : 'expand_more'}
              size={18}
              color={colors.text}
            />
          </Pressable>
          {expanded && (
            <View style={styles.pickerColumn}>
              <ControlGroup
                label="Variant"
                choices={VARIANTS}
                value={variant}
                onValueChange={setVariant}
              />
              <ControlGroup
                label="Weight"
                choices={WEIGHTS}
                value={weight}
                onValueChange={setWeight}
              />
              {SUPPORTS_GET_IMAGE && (
                <ControlGroup
                  label="Source"
                  choices={SOURCES}
                  value={source}
                  onValueChange={setSource}
                />
              )}
            </View>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <MaterialSymbolRow
          items={item}
          variant={variant}
          weight={weight}
          image={image}
        />
      )}
      keyExtractor={(item) => item.join(',')}
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
  weight,
  image,
}: {
  items: MaterialSymbolProps['name'][];
  variant: MaterialSymbolVariant;
  weight: MaterialSymbolWeight;
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
                weight,
                size: ICON_SIZE,
                color: colors.text,
              })}
            />
          ) : (
            <MaterialSymbol
              name={item}
              variant={variant}
              weight={weight}
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

function ControlGroup<T extends string | number | boolean>({
  label,
  choices,
  value,
  onValueChange,
}: {
  label: string;
  choices: Choice<T>[];
  value: T;
  onValueChange: (value: T) => void;
}) {
  const { colors, fonts } = useTheme();

  return (
    <View style={styles.controlGroup}>
      <Text style={[styles.controlLabel, { color: colors.text }]}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        {choices.map((option) => {
          const selected = option.value === value;

          return (
            <Pressable
              key={String(option.value)}
              onPress={() => onValueChange(option.value)}
              style={[
                styles.chip,
                { borderColor: colors.border },
                selected && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  fonts.medium,
                  styles.chipText,
                  {
                    color: selected
                      ? Color.foreground(colors.primary)
                      : colors.text,
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

ComponentsMaterialSymbols.title = 'Components - Material Symbols';
ComponentsMaterialSymbols.options = { headerShown: true };
ComponentsMaterialSymbols.linking = {};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pickerColumn: {
    gap: 12,
    paddingVertical: 8,
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlLabel: {
    width: 64,
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 16,
  },
  chipScroll: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chipText: {
    fontSize: 12,
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
