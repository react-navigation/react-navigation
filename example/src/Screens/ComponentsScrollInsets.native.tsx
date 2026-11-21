import { Text } from '@react-navigation/elements';
import {
  type StaticScreenProps,
  UNSTABLE_OverlayInsetsProvider,
  UNSTABLE_ScrollInsets,
  useNavigation,
} from '@react-navigation/native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import * as React from 'react';
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const items = Array.from({ length: 80 }, (_, index) => String(index + 1));
const modes = [
  'ScrollView',
  'FlatList',
  'Horizontal',
  'Inverted',
  'FlashList',
  'Short content',
  'Keyboard',
] as const;

export function ComponentsScrollInsets(_: StaticScreenProps<{}>) {
  const [mode, setMode] = React.useState<(typeof modes)[number]>('ScrollView');
  const [padding, setPadding] = React.useState(6);
  const [large, setLarge] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [corners, setCorners] = React.useState(false);
  const [adaptation, setAdaptation] = React.useState<'vertical' | 'horizontal'>(
    'vertical'
  );
  const navigation = useNavigation();
  const [height, setHeight] = React.useState(0);
  const [generation, setGeneration] = React.useState(0);
  const list = React.useRef<FlashListRef<string>>(null);
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !corners });
  }, [corners, navigation]);

  const horizontal = mode === 'Horizontal';
  const insets = large
    ? { top: 96, bottom: 72, start: 48, end: 32 }
    : { top: 24, bottom: 16, start: 8, end: 12 };

  React.useLayoutEffect(() => {
    if (generation > 0) {
      const end = performance.now() + 350;
      // Keep JavaScript busy while the remounted native list receives its first insets.
      while (performance.now() < end) {
        continue;
      }
    }
  }, [generation]);

  const renderItem = ({ item }: { item: string }) => (
    <View
      key={item}
      style={[
        styles.row,
        horizontal && styles.column,
        generation % 2 === 1 && styles.remounted,
      ]}
    >
      <Text>Item {item}</Text>
    </View>
  );

  return (
    <View style={[styles.screen, corners && styles.window]}>
      <View style={styles.controls}>
        {modes.map((name) => (
          <Button key={name} title={name} onPress={() => setMode(name)} />
        ))}
        <Button
          title={`Padding ${padding}`}
          onPress={() => setPadding(padding === 6 ? 18 : 6)}
        />
        <Button
          title={large ? 'Small insets' : 'Large insets'}
          onPress={() => setLarge(!large)}
        />
        <Button
          title="Busy remount"
          onPress={() => {
            setLarge(!large);
            setGeneration(generation + 1);
          }}
        />
        <Button
          title={corners ? 'Inset viewport' : 'Window corners'}
          onPress={() => setCorners(!corners)}
        />
        {corners && (
          <Button
            title={adaptation}
            onPress={() =>
              setAdaptation(
                adaptation === 'vertical' ? 'horizontal' : 'vertical'
              )
            }
          />
        )}
        {mode === 'FlashList' && (
          <Button
            title="Jump to 40"
            onPress={() =>
              list.current?.scrollToIndex({ index: 39, animated: false })
            }
          />
        )}
      </View>
      <UNSTABLE_OverlayInsetsProvider
        style={styles.screen}
        insets={corners ? undefined : insets}
      >
        <UNSTABLE_ScrollInsets
          key={generation}
          cornerAdaptation={adaptation}
          types={
            mode === 'Keyboard'
              ? ['systemBars', 'displayCutout', 'custom', 'ime']
              : undefined
          }
        >
          {mode === 'Short content' ? (
            <View
              style={styles.screen}
              onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
            >
              <ScrollView
                alwaysBounceVertical={false}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{ padding }}
              >
                <View
                  style={[styles.row, { height: Math.max(48, height - 120) }]}
                >
                  <Text>Short content</Text>
                </View>
              </ScrollView>
            </View>
          ) : mode === 'Keyboard' ? (
            <ScrollView
              automaticallyAdjustKeyboardInsets
              contentContainerStyle={styles.inputContainer}
            >
              <TextInput
                accessibilityLabel="Message"
                placeholder="Message"
                style={styles.input}
              />
            </ScrollView>
          ) : mode === 'ScrollView' ? (
            <ScrollView contentContainerStyle={{ padding }}>
              {items.map((item) => renderItem({ item }))}
            </ScrollView>
          ) : mode === 'FlashList' ? (
            <FlashList
              ref={list}
              data={items}
              renderItem={renderItem}
              contentContainerStyle={{ padding }}
            />
          ) : (
            <FlatList
              key={mode}
              horizontal={horizontal}
              inverted={mode === 'Inverted'}
              data={items}
              renderItem={renderItem}
              contentContainerStyle={{ padding }}
              refreshing={refreshing}
              onRefresh={
                horizontal
                  ? undefined
                  : () => {
                      setRefreshing(true);
                      setTimeout(() => setRefreshing(false), 1000);
                    }
              }
            />
          )}
        </UNSTABLE_ScrollInsets>
      </UNSTABLE_OverlayInsetsProvider>
    </View>
  );
}

ComponentsScrollInsets.title = 'Components - Scroll Insets';
ComponentsScrollInsets.options = { headerShown: true };
ComponentsScrollInsets.linking = { path: 'scroll-insets' };

const styles = StyleSheet.create({
  screen: { flex: 1 },
  inputContainer: { flexGrow: 1, justifyContent: 'flex-end' },
  input: { backgroundColor: '#c6e5ff', padding: 12, minHeight: 48 },
  window: { flexDirection: 'column-reverse' },
  remounted: { backgroundColor: '#ffc89c' },
  controls: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  row: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#c6e5ff',
    borderBottomWidth: 1,
  },
  column: { width: 100, height: '100%' },
});
