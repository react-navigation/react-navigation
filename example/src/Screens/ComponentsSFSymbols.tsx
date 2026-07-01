import { Text } from '@react-navigation/elements';
import { Color } from '@react-navigation/elements/internal';
import {
  SFSymbol,
  type SFSymbolProps,
  type StaticScreenProps,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SF_SYMBOL_NAMES } from '../sf-symbol-names';

type SFSymbolWeight = NonNullable<SFSymbolProps['weight']>;
type SFSymbolScale = NonNullable<SFSymbolProps['scale']>;
type SFSymbolRenderingMode = NonNullable<SFSymbolProps['renderingMode']>;
type SFSymbolEffectName = Extract<NonNullable<SFSymbolProps['effect']>, string>;
type SFSymbolEffect = SFSymbolProps['effect'];
type SFSymbolEffectConfig = Exclude<NonNullable<SFSymbolEffect>, string>;
type SFSymbolEffectRepeat = SFSymbolEffectConfig['repeat'];
type SFSymbolContentTransition = SFSymbolProps['contentTransition'];
type SFSymbolVariableValueMode = NonNullable<
  SFSymbolProps['variableValueMode']
>;
type SFSymbolColorRenderingMode = NonNullable<
  SFSymbolProps['colorRenderingMode']
>;
type SFSymbolVariableValue = 0 | 0.25 | 0.5 | 0.75 | 1;
type SFSymbolEffectRepeatMode =
  | 'default'
  | 'continuous'
  | 'nonRepeating'
  | 'periodic';
type SFSymbolEffectScope = 'byLayer' | 'wholeSymbol' | 'individually';
type SFSymbolEffectDirection =
  | 'none'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'forward'
  | 'backward'
  | 'clockwise'
  | 'counterClockwise';
type SFSymbolEffectSpeed = 0.5 | 1 | 2;
type SFSymbolBreatheVariant = 'plain' | 'pulse';
type SFSymbolInactiveLayers = 'none' | 'hide' | 'dim';
type SFSymbolDrawDirection = 'default' | 'reversed' | 'nonReversed';
type SFSymbolContentTransitionName = Extract<
  NonNullable<SFSymbolContentTransition>,
  string
>;
type SFSymbolContentTransitionVariant = 'downUp' | 'upUp' | 'offUp';
type SFSymbolContentTransitionScope = 'byLayer' | 'wholeSymbol';

type Choice<T extends string | number | boolean> = {
  label: string;
  value: T;
};

const COLUMN_COUNT = 4;
const ICON_SIZE = 32;
const ICON_PADDING_VERTICAL = 8;
const ICON_NAME_MARGIN_TOP = 4;
const ICON_NAME_FONT_SIZE = 10;
const ROW_HEIGHT =
  ICON_SIZE +
  (ICON_PADDING_VERTICAL + ICON_NAME_MARGIN_TOP + ICON_NAME_FONT_SIZE) * 2;

const WEIGHTS: Choice<SFSymbolWeight>[] = [
  { label: 'Thin', value: 'thin' },
  { label: 'Light', value: 'light' },
  { label: 'Regular', value: 'regular' },
  { label: 'Bold', value: 'bold' },
];

const SCALES: Choice<SFSymbolScale>[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

const MODES: Choice<SFSymbolRenderingMode>[] = [
  { label: 'Mono', value: 'monochrome' },
  { label: 'Hierarchy', value: 'hierarchical' },
  { label: 'Palette', value: 'palette' },
  { label: 'Multi', value: 'multicolor' },
];

const VARIABLE_VALUES: Choice<SFSymbolVariableValue>[] = [
  { label: '0', value: 0 },
  { label: '.25', value: 0.25 },
  { label: '.5', value: 0.5 },
  { label: '.75', value: 0.75 },
  { label: '1', value: 1 },
];

const VARIABLE_VALUE_MODES: Choice<SFSymbolVariableValueMode>[] = [
  { label: 'Auto', value: 'automatic' },
  { label: 'Color', value: 'color' },
  { label: 'Draw', value: 'draw' },
];

const COLOR_RENDERING_MODES: Choice<SFSymbolColorRenderingMode>[] = [
  { label: 'Auto', value: 'automatic' },
  { label: 'Flat', value: 'flat' },
  { label: 'Gradient', value: 'gradient' },
];

const EFFECTS: Choice<SFSymbolEffectName | 'none'>[] = [
  { label: 'None', value: 'none' },
  { label: 'Bounce', value: 'bounce' },
  { label: 'Pulse', value: 'pulse' },
  { label: 'Appear', value: 'appear' },
  { label: 'Disappear', value: 'disappear' },
  { label: 'Variable', value: 'variableColor' },
  { label: 'Scale', value: 'scale' },
  { label: 'Breathe', value: 'breathe' },
  { label: 'Wiggle', value: 'wiggle' },
  { label: 'Rotate', value: 'rotate' },
  { label: 'Draw on', value: 'drawOn' },
  { label: 'Draw off', value: 'drawOff' },
];

const EFFECT_REPEATS: Choice<SFSymbolEffectRepeatMode>[] = [
  { label: 'Default', value: 'default' },
  { label: 'Continuous', value: 'continuous' },
  { label: 'Once', value: 'nonRepeating' },
  { label: 'Periodic', value: 'periodic' },
];

const EFFECT_SCOPES: Choice<SFSymbolEffectScope>[] = [
  { label: 'Layers', value: 'byLayer' },
  { label: 'Whole', value: 'wholeSymbol' },
  { label: 'Each', value: 'individually' },
];

const EFFECT_DIRECTIONS: Choice<SFSymbolEffectDirection>[] = [
  { label: 'None', value: 'none' },
  { label: 'Up', value: 'up' },
  { label: 'Down', value: 'down' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Forward', value: 'forward' },
  { label: 'Back', value: 'backward' },
  { label: 'CW', value: 'clockwise' },
  { label: 'CCW', value: 'counterClockwise' },
];

const EFFECT_SPEEDS: Choice<SFSymbolEffectSpeed>[] = [
  { label: '.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '2x', value: 2 },
];

const BREATHE_VARIANTS: Choice<SFSymbolBreatheVariant>[] = [
  { label: 'Plain', value: 'plain' },
  { label: 'Pulse', value: 'pulse' },
];

const INACTIVE_LAYERS: Choice<SFSymbolInactiveLayers>[] = [
  { label: 'Default', value: 'none' },
  { label: 'Hide', value: 'hide' },
  { label: 'Dim', value: 'dim' },
];

const DRAW_DIRECTIONS: Choice<SFSymbolDrawDirection>[] = [
  { label: 'Default', value: 'default' },
  { label: 'Forward', value: 'nonReversed' },
  { label: 'Reverse', value: 'reversed' },
];

const CONTENT_TRANSITIONS: Choice<SFSymbolContentTransitionName | 'none'>[] = [
  { label: 'None', value: 'none' },
  { label: 'Auto', value: 'automatic' },
  { label: 'Replace', value: 'replace' },
];

const CONTENT_TRANSITION_VARIANTS: Choice<SFSymbolContentTransitionVariant>[] =
  [
    { label: 'Down/up', value: 'downUp' },
    { label: 'Up/up', value: 'upUp' },
    { label: 'Off/up', value: 'offUp' },
  ];

const CONTENT_TRANSITION_SCOPES: Choice<SFSymbolContentTransitionScope>[] = [
  { label: 'Layers', value: 'byLayer' },
  { label: 'Whole', value: 'wholeSymbol' },
];

const MAGIC_MODES: Choice<boolean>[] = [
  { label: 'Replace', value: false },
  { label: 'Magic', value: true },
];

const PREVIEW_SYMBOLS: [SFSymbolProps['name'], ...SFSymbolProps['name'][]] = [
  'bell',
  'bell.badge',
  'wifi',
  'wifi.slash',
  'heart',
  'heart.fill',
];

function getEffectRepeat(mode: SFSymbolEffectRepeatMode): SFSymbolEffectRepeat {
  switch (mode) {
    case 'continuous':
      return 'continuous';
    case 'nonRepeating':
      return 'nonRepeating';
    case 'periodic':
      return { count: 3, delay: 0.5 };
    default:
      return undefined;
  }
}

function getVerticalDirection(direction: SFSymbolEffectDirection) {
  return direction === 'up' || direction === 'down' ? direction : undefined;
}

function getRotateDirection(direction: SFSymbolEffectDirection) {
  return direction === 'clockwise' || direction === 'counterClockwise'
    ? direction
    : undefined;
}

function getWiggleDirection(direction: SFSymbolEffectDirection) {
  return direction === 'none' ? undefined : direction;
}

function getPreviewSymbol(index: number) {
  return PREVIEW_SYMBOLS[index % PREVIEW_SYMBOLS.length] ?? PREVIEW_SYMBOLS[0];
}

export function ComponentsSFSymbols(_: StaticScreenProps<{}>) {
  const navigation = useNavigation('ComponentsSFSymbols');
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = React.useState('');
  const [weight, setWeight] = React.useState<SFSymbolWeight>('regular');
  const [scale, setScale] = React.useState<SFSymbolScale>('medium');
  const [renderingMode, setRenderingMode] =
    React.useState<SFSymbolRenderingMode>('monochrome');
  const [variableValue, setVariableValue] =
    React.useState<SFSymbolVariableValue>(1);
  const [variableValueMode, setVariableValueMode] =
    React.useState<SFSymbolVariableValueMode>('automatic');
  const [colorRenderingMode, setColorRenderingMode] =
    React.useState<SFSymbolColorRenderingMode>('automatic');
  const [effect, setEffect] = React.useState<SFSymbolEffectName | 'none'>(
    'none'
  );
  const [effectRepeat, setEffectRepeat] =
    React.useState<SFSymbolEffectRepeatMode>('default');
  const [effectScope, setEffectScope] =
    React.useState<SFSymbolEffectScope>('byLayer');
  const [effectDirection, setEffectDirection] =
    React.useState<SFSymbolEffectDirection>('none');
  const [effectSpeed, setEffectSpeed] = React.useState<SFSymbolEffectSpeed>(1);
  const [breatheVariant, setBreatheVariant] =
    React.useState<SFSymbolBreatheVariant>('plain');
  const [inactiveLayers, setInactiveLayers] =
    React.useState<SFSymbolInactiveLayers>('none');
  const [drawDirection, setDrawDirection] =
    React.useState<SFSymbolDrawDirection>('default');
  const [contentTransition, setContentTransition] = React.useState<
    SFSymbolContentTransitionName | 'none'
  >('none');
  const [contentTransitionVariant, setContentTransitionVariant] =
    React.useState<SFSymbolContentTransitionVariant>('downUp');
  const [contentTransitionScope, setContentTransitionScope] =
    React.useState<SFSymbolContentTransitionScope>('byLayer');
  const [contentTransitionMagic, setContentTransitionMagic] =
    React.useState(false);
  const [previewIndex, setPreviewIndex] = React.useState(0);
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
      ? SF_SYMBOL_NAMES.filter((name) => name.toLowerCase().includes(search))
      : SF_SYMBOL_NAMES;

    // FlatList has performance issues with `numColumns`
    // So we use a single-column list with rows containing multiple icons
    const result: SFSymbolProps['name'][][] = [];

    for (let i = 0; i < icons.length; i += COLUMN_COUNT) {
      result.push(icons.slice(i, i + COLUMN_COUNT));
    }

    return result;
  }, [query]);

  const symbolColors = React.useMemo(
    () =>
      renderingMode === 'palette' || renderingMode === 'hierarchical'
        ? {
            primary: colors.primary,
            secondary: colors.notification,
            tertiary: colors.text,
          }
        : undefined,
    [renderingMode, colors.primary, colors.notification, colors.text]
  );

  const selectedEffect = React.useMemo<SFSymbolEffect>(() => {
    if (effect === 'none') {
      return undefined;
    }

    const repeat = getEffectRepeat(effectRepeat);
    const scopedScope = effectScope === 'wholeSymbol' ? effectScope : 'byLayer';
    const base = {
      speed: effectSpeed,
      repeat,
    };

    switch (effect) {
      case 'bounce':
      case 'appear':
      case 'disappear':
      case 'scale':
        return {
          ...base,
          type: effect,
          scope: scopedScope,
          direction: getVerticalDirection(effectDirection),
        };

      case 'pulse':
        return {
          ...base,
          type: 'pulse',
          scope: scopedScope,
        };

      case 'breathe':
        return {
          ...base,
          type: 'breathe',
          scope: scopedScope,
          variant: breatheVariant,
        };

      case 'wiggle':
        return {
          ...base,
          type: 'wiggle',
          scope: scopedScope,
          direction: getWiggleDirection(effectDirection),
        };

      case 'rotate':
        return {
          ...base,
          type: 'rotate',
          scope: scopedScope,
          direction: getRotateDirection(effectDirection),
        };

      case 'drawOn':
        return {
          ...base,
          type: 'drawOn',
          scope: effectScope,
        };

      case 'drawOff':
        return {
          ...base,
          type: 'drawOff',
          scope: effectScope,
          drawDirection:
            drawDirection === 'default' ? undefined : drawDirection,
        };

      case 'variableColor':
        return {
          ...base,
          type: 'variableColor',
          cumulative: true,
          inactiveLayers:
            inactiveLayers === 'none' ? undefined : inactiveLayers,
        };
    }
  }, [
    breatheVariant,
    drawDirection,
    effect,
    effectDirection,
    effectRepeat,
    effectScope,
    effectSpeed,
    inactiveLayers,
  ]);

  const selectedContentTransition =
    React.useMemo<SFSymbolContentTransition>(() => {
      switch (contentTransition) {
        case 'automatic':
          return {
            type: 'automatic',
            speed: effectSpeed,
          };

        case 'replace':
          return {
            type: 'replace',
            speed: effectSpeed,
            variant: contentTransitionVariant,
            scope: contentTransitionScope,
            magic: contentTransitionMagic,
          };

        default:
          return undefined;
      }
    }, [
      contentTransition,
      contentTransitionMagic,
      contentTransitionScope,
      contentTransitionVariant,
      effectSpeed,
    ]);

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
        <View style={{ backgroundColor: colors.card }}>
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
              <Section title="Appearance">
                <ControlGroup
                  label="Weight"
                  choices={WEIGHTS}
                  value={weight}
                  onValueChange={setWeight}
                />
                <ControlGroup
                  label="Scale"
                  choices={SCALES}
                  value={scale}
                  onValueChange={setScale}
                />
                <ControlGroup
                  label="Rendering"
                  choices={MODES}
                  value={renderingMode}
                  onValueChange={setRenderingMode}
                />
                <ControlGroup
                  label="Color"
                  choices={COLOR_RENDERING_MODES}
                  value={colorRenderingMode}
                  onValueChange={setColorRenderingMode}
                />
                <ControlGroup
                  label="Variable value"
                  choices={VARIABLE_VALUES}
                  value={variableValue}
                  onValueChange={setVariableValue}
                />
                <ControlGroup
                  label="Variable mode"
                  choices={VARIABLE_VALUE_MODES}
                  value={variableValueMode}
                  onValueChange={setVariableValueMode}
                />
              </Section>
              <Section title="Effect">
                <ControlGroup
                  label="Type"
                  choices={EFFECTS}
                  value={effect}
                  onValueChange={setEffect}
                />
                {effect !== 'none' && (
                  <>
                    <ControlGroup
                      label="Repeat"
                      choices={EFFECT_REPEATS}
                      value={effectRepeat}
                      onValueChange={setEffectRepeat}
                    />
                    <ControlGroup
                      label="Scope"
                      choices={EFFECT_SCOPES}
                      value={effectScope}
                      onValueChange={setEffectScope}
                    />
                    <ControlGroup
                      label="Direction"
                      choices={EFFECT_DIRECTIONS}
                      value={effectDirection}
                      onValueChange={setEffectDirection}
                    />
                    <ControlGroup
                      label="Speed"
                      choices={EFFECT_SPEEDS}
                      value={effectSpeed}
                      onValueChange={setEffectSpeed}
                    />
                    {effect === 'breathe' && (
                      <ControlGroup
                        label="Variant"
                        choices={BREATHE_VARIANTS}
                        value={breatheVariant}
                        onValueChange={setBreatheVariant}
                      />
                    )}
                    {effect === 'variableColor' && (
                      <ControlGroup
                        label="Inactive layers"
                        choices={INACTIVE_LAYERS}
                        value={inactiveLayers}
                        onValueChange={setInactiveLayers}
                      />
                    )}
                    {effect === 'drawOff' && (
                      <ControlGroup
                        label="Draw direction"
                        choices={DRAW_DIRECTIONS}
                        value={drawDirection}
                        onValueChange={setDrawDirection}
                      />
                    )}
                  </>
                )}
              </Section>
              <Section title="Transition">
                <ControlGroup
                  label="Type"
                  choices={CONTENT_TRANSITIONS}
                  value={contentTransition}
                  onValueChange={setContentTransition}
                />
                {contentTransition === 'replace' && (
                  <>
                    <ControlGroup
                      label="Variant"
                      choices={CONTENT_TRANSITION_VARIANTS}
                      value={contentTransitionVariant}
                      onValueChange={setContentTransitionVariant}
                    />
                    <ControlGroup
                      label="Scope"
                      choices={CONTENT_TRANSITION_SCOPES}
                      value={contentTransitionScope}
                      onValueChange={setContentTransitionScope}
                    />
                    <ControlGroup
                      label="Magic"
                      choices={MAGIC_MODES}
                      value={contentTransitionMagic}
                      onValueChange={setContentTransitionMagic}
                    />
                  </>
                )}
              </Section>
            </View>
          )}
          <SFSymbolPreview
            name={getPreviewSymbol(previewIndex)}
            nextName={getPreviewSymbol(previewIndex + 1)}
            weight={weight}
            scale={scale}
            renderingMode={renderingMode}
            colors={symbolColors}
            variableValue={variableValue}
            variableValueMode={variableValueMode}
            colorRenderingMode={colorRenderingMode}
            effect={selectedEffect}
            contentTransition={selectedContentTransition}
            onPress={() =>
              setPreviewIndex((index) => (index + 1) % PREVIEW_SYMBOLS.length)
            }
          />
        </View>
      }
      renderItem={({ item }) => (
        <SFSymbolRow
          items={item}
          weight={weight}
          scale={scale}
          renderingMode={renderingMode}
          colors={symbolColors}
          variableValue={variableValue}
          variableValueMode={variableValueMode}
          colorRenderingMode={colorRenderingMode}
          effect={selectedEffect}
          contentTransition={selectedContentTransition}
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

const SFSymbolRow = React.memo(function SFSymbolRow({
  items,
  weight,
  scale,
  renderingMode,
  colors: symbolColors,
  variableValue,
  variableValueMode,
  colorRenderingMode,
  effect,
  contentTransition,
}: {
  items: SFSymbolProps['name'][];
  weight: SFSymbolWeight;
  scale: SFSymbolScale;
  renderingMode: SFSymbolRenderingMode;
  colors?: SFSymbolProps['colors'];
  variableValue: SFSymbolVariableValue;
  variableValueMode: SFSymbolVariableValueMode;
  colorRenderingMode: SFSymbolColorRenderingMode;
  effect: SFSymbolEffect;
  contentTransition: SFSymbolContentTransition;
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
            renderingMode={renderingMode}
            colors={symbolColors}
            variableValue={variableValue}
            variableValueMode={variableValueMode}
            colorRenderingMode={colorRenderingMode}
            effect={effect}
            contentTransition={contentTransition}
          />
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
});

function SFSymbolPreview({
  name,
  nextName,
  weight,
  scale,
  renderingMode,
  colors,
  variableValue,
  variableValueMode,
  colorRenderingMode,
  effect,
  contentTransition,
  onPress,
}: {
  name: SFSymbolProps['name'];
  nextName: SFSymbolProps['name'];
  weight: SFSymbolWeight;
  scale: SFSymbolScale;
  renderingMode: SFSymbolRenderingMode;
  colors?: SFSymbolProps['colors'];
  variableValue: SFSymbolVariableValue;
  variableValueMode: SFSymbolVariableValueMode;
  colorRenderingMode: SFSymbolColorRenderingMode;
  effect: SFSymbolEffect;
  contentTransition: SFSymbolContentTransition;
  onPress: () => void;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.preview, { borderTopColor: themeColors.border }]}
    >
      <View style={styles.previewIcon}>
        <SFSymbol
          name={name}
          size={48}
          weight={weight}
          scale={scale}
          renderingMode={renderingMode}
          colors={colors}
          variableValue={variableValue}
          variableValueMode={variableValueMode}
          colorRenderingMode={colorRenderingMode}
          effect={effect}
          contentTransition={contentTransition}
        />
      </View>
      <View style={styles.previewText}>
        <Text style={{ color: themeColors.text }} numberOfLines={1}>
          {name}
        </Text>
        <Text
          style={[styles.previewNext, { color: themeColors.text }]}
          numberOfLines={1}
        >
          {nextName}
        </Text>
      </View>
      <SFSymbol name="arrow.triangle.2.circlepath" size={18} />
    </Pressable>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

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
                {
                  borderColor: colors.border,
                },
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

ComponentsSFSymbols.title = 'Components - SF Symbols';
ComponentsSFSymbols.options = { headerShown: true };
ComponentsSFSymbols.linking = {};

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
    gap: 20,
    paddingVertical: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.5,
    paddingHorizontal: 16,
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlLabel: {
    width: 84,
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
  preview: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  previewIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    flex: 1,
    minWidth: 0,
  },
  previewNext: {
    fontSize: 12,
    opacity: 0.6,
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
