import { Text } from '@react-navigation/elements';
import {
  SFSymbol,
  type SFSymbolAnimationEffect,
  type SFSymbolMode,
  type SFSymbolProps,
  type SFSymbolScale,
  type SFSymbolWeight,
  type StaticScreenProps,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SF_SYMBOL_NAMES } from '../sf-symbol-names';
import { SegmentedPicker } from '../Shared/SegmentedPicker';

const COLUMN_COUNT = 4;
const ICON_SIZE = 32;
const ICON_PADDING_VERTICAL = 8;
const ICON_NAME_MARGIN_TOP = 4;
const ICON_NAME_FONT_SIZE = 10;
const ROW_HEIGHT =
  ICON_SIZE +
  (ICON_PADDING_VERTICAL + ICON_NAME_MARGIN_TOP + ICON_NAME_FONT_SIZE) * 2;

const WEIGHTS: { label: string; value: SFSymbolWeight }[] = [
  { label: 'Thin', value: 'thin' },
  { label: 'Light', value: 'light' },
  { label: 'Regular', value: 'regular' },
  { label: 'Bold', value: 'bold' },
];

const SCALES: { label: string; value: SFSymbolScale }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

const MODES: { label: string; value: SFSymbolMode }[] = [
  { label: 'Mono', value: 'monochrome' },
  { label: 'Hierarchy', value: 'hierarchical' },
  { label: 'Palette', value: 'palette' },
  { label: 'Multi', value: 'multicolor' },
];

const ANIMATIONS: { label: string; value: SFSymbolAnimationEffect | 'none' }[] =
  [
    { label: 'None', value: 'none' },
    { label: 'Bounce', value: 'bounce' },
    { label: 'Pulse', value: 'pulse' },
    { label: 'Wiggle', value: 'wiggle' },
  ];

export function SFSymbols(_: StaticScreenProps<{}>) {
  const navigation = useNavigation('SFSymbols');
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = React.useState('');
  const [weight, setWeight] = React.useState<SFSymbolWeight>('regular');
  const [scale, setScale] = React.useState<SFSymbolScale>('medium');
  const [mode, setMode] = React.useState<SFSymbolMode>('monochrome');
  const [animation, setAnimation] = React.useState<
    SFSymbolAnimationEffect | 'none'
  >('none');
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

  const symbolColors =
    mode === 'palette'
      ? {
          primary: colors.primary,
          secondary: colors.notification,
          tertiary: colors.text,
        }
      : undefined;

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
          <Pressable
            onPress={() => setExpanded((v) => !v)}
            style={styles.headerToggle}
          >
            <Text style={{ color: colors.text }}>Customization</Text>
            <SFSymbol
              name={expanded ? 'chevron.up' : 'chevron.down'}
              size={14}
              color={colors.text}
            />
          </Pressable>
          {expanded && (
            <View style={styles.pickerColumn}>
              <SegmentedPicker
                choices={WEIGHTS}
                value={weight}
                onValueChange={setWeight}
              />
              <SegmentedPicker
                choices={SCALES}
                value={scale}
                onValueChange={setScale}
              />
              <SegmentedPicker
                choices={MODES}
                value={mode}
                onValueChange={setMode}
              />
              <SegmentedPicker
                choices={ANIMATIONS}
                value={animation}
                onValueChange={setAnimation}
              />
            </View>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <SFSymbolRow
          items={item}
          weight={weight}
          scale={scale}
          mode={mode}
          colors={symbolColors}
          animation={animation === 'none' ? undefined : animation}
        />
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

const SFSymbolRow = React.memo(function SFSymbolRow({
  items,
  weight,
  scale,
  mode,
  colors: symbolColors,
  animation,
}: {
  items: SFSymbolProps['name'][];
  weight: SFSymbolWeight;
  scale: SFSymbolScale;
  mode: SFSymbolMode;
  colors?: SFSymbolProps['colors'];
  animation?: SFSymbolAnimationEffect;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item} style={[styles.item, { borderColor: colors.border }]}>
          <SFSymbol
            name={item}
            size={ICON_SIZE}
            weight={weight}
            scale={scale}
            mode={mode}
            colors={symbolColors}
            animation={animation}
          />
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
  header: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  pickerColumn: {
    gap: 8,
    marginTop: 8,
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
