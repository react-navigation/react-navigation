import { Text } from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfig,
  type StaticScreenProps,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type { SplitHostCommands } from 'react-native-screens/experimental';
import { Split } from 'react-native-screens/experimental';

type SplitViewParamList = {
  SplitViewMain: undefined;
};

const linking = {
  screens: {
    SplitViewMain: '',
  },
} satisfies PathConfig<NavigatorScreenParams<SplitViewParamList>>;

function Column({
  title,
  color,
  splitRef,
}: {
  title: string;
  color: string;
  splitRef: React.RefObject<SplitHostCommands | null>;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.column, { backgroundColor: color }]}>
      <Text style={[styles.columnTitle, { color: colors.text }]}>{title}</Text>

      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => splitRef.current?.show('primary')}
        >
          <Text style={styles.buttonText}>Show Primary</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => splitRef.current?.show('supplementary')}
        >
          <Text style={styles.buttonText}>Show Supplementary</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => splitRef.current?.show('secondary')}
        >
          <Text style={styles.buttonText}>Show Secondary</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SplitViewContent() {
  const splitRef = React.useRef<SplitHostCommands>(null);
  const { colors } = useTheme();

  if (Platform.OS !== 'ios') {
    return (
      <View style={[styles.column, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, opacity: 0.5 }}>
          SplitView is only supported on iOS (iPad).
        </Text>
      </View>
    );
  }

  return (
    <Split.Host
      ref={splitRef}
      preferredDisplayMode="twoBesideSecondary"
      preferredSplitBehavior="tile"
      topColumnForCollapsing="primary"
      presentsWithGesture
      primaryEdge="leading"
      primaryBackgroundStyle="sidebar"
      displayModeButtonVisibility="always"
      showSecondaryToggleButton
      showInspector
      orientation="all"
      columnMetrics={{
        minimumPrimaryColumnWidth: 200,
        maximumPrimaryColumnWidth: 350,
        preferredPrimaryColumnWidthOrFraction: 280,
        minimumSupplementaryColumnWidth: 200,
        maximumSupplementaryColumnWidth: 350,
        preferredSupplementaryColumnWidthOrFraction: 280,
      }}
      onCollapse={() => {
        console.log('[SplitView] Collapsed to single column');
      }}
      onExpand={() => {
        console.log('[SplitView] Expanded to multiple columns');
      }}
      onDisplayModeWillChange={(e) => {
        console.log(
          `[SplitView] Display mode: ${e.nativeEvent.currentDisplayMode} → ${e.nativeEvent.nextDisplayMode}`
        );
      }}
      onInspectorHide={() => {
        console.log('[SplitView] Inspector hidden');
      }}
    >
      <Split.Column
        onWillAppear={() => console.log('[Primary] will appear')}
        onDidAppear={() => console.log('[Primary] did appear')}
        onWillDisappear={() => console.log('[Primary] will disappear')}
        onDidDisappear={() => console.log('[Primary] did disappear')}
      >
        <Column title="Primary" color="#e8f5e9" splitRef={splitRef} />
      </Split.Column>
      <Split.Column
        onWillAppear={() => console.log('[Supplementary] will appear')}
        onDidAppear={() => console.log('[Supplementary] did appear')}
        onWillDisappear={() => console.log('[Supplementary] will disappear')}
        onDidDisappear={() => console.log('[Supplementary] did disappear')}
      >
        <Column title="Supplementary" color="#e3f2fd" splitRef={splitRef} />
      </Split.Column>
      <Split.Column
        onWillAppear={() => console.log('[Secondary] will appear')}
        onDidAppear={() => console.log('[Secondary] did appear')}
        onWillDisappear={() => console.log('[Secondary] will disappear')}
        onDidDisappear={() => console.log('[Secondary] did disappear')}
      >
        <Column title="Secondary" color="#fff3e0" splitRef={splitRef} />
      </Split.Column>
      <Split.Inspector
        onWillAppear={() => console.log('[Inspector] will appear')}
        onDidAppear={() => console.log('[Inspector] did appear')}
        onWillDisappear={() => console.log('[Inspector] will disappear')}
        onDidDisappear={() => console.log('[Inspector] did disappear')}
      >
        <View style={[styles.column, { backgroundColor: '#fce4ec' }]}>
          <Text style={[styles.columnTitle, { color: colors.text }]}>
            Inspector
          </Text>
        </View>
      </Split.Inspector>
    </Split.Host>
  );
}

export function NativeStackSplitView(
  _: StaticScreenProps<NavigatorScreenParams<SplitViewParamList>>
) {
  return <SplitViewContent />;
}

NativeStackSplitView.title = 'Native Stack - Split View';
NativeStackSplitView.linking = linking;

const styles = StyleSheet.create({
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  columnTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  buttons: {
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
