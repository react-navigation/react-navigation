import { Text } from '@react-navigation/elements';
import {
  SFSymbol,
  type SFSymbolProps,
  type StaticScreenProps,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { SplitHostCommands } from 'react-native-screens/experimental';
import { SafeAreaView, Split } from 'react-native-screens/experimental';

type SymbolName = SFSymbolProps['name'];

type FileNodeBase = {
  id: string;
  name: string;
};

type FolderNode = FileNodeBase & {
  type: 'folder';
  symbol?: SymbolName;
};

type FileNode = FolderNode | DocumentNode;

type DocumentNode = FileNodeBase & {
  type: 'file';
  symbol: SymbolName;
  kind: string;
  size: string;
  modified: string;
  availability: string;
  context: string;
};

type Place = {
  id: string;
  title: string;
  symbol: SymbolName;
  items: FileNode[];
};

const BORDER_WIDTH = StyleSheet.hairlineWidth;

const ACCENT = '#0A84FF';
const ACCENT_SOFT = '#0A84FF16';
const NEUTRAL_SOFT = '#8E8E9316';

const SPACE_XS = 4;
const SPACE_S = 8;
const SPACE_M = 12;
const SPACE_L = 16;
const SPACE_XL = 20;
const SPACE_2XL = 24;

const RADIUS_S = 12;
const RADIUS_L = 20;

const ICON_SIZE = 18;

const TEXT_SIZE_S = 13;
const TEXT_SIZE_M = 16;
const CONTROL_SIZE = 32;
const ROW_HEIGHT = 56;

const TEXT_LINE_HEIGHT = 20;

const SECONDARY_OPACITY = 0.62;
const FALLBACK_MAX_WIDTH = 320;

const folder = (
  id: string,
  name: string,
  symbol: SymbolName = 'folder.fill'
): FolderNode => ({
  id,
  name,
  type: 'folder',
  symbol,
});

const file = (
  id: string,
  name: string,
  symbol: SymbolName,
  kind: string,
  size: string,
  modified: string,
  availability: string,
  context: string
): DocumentNode => ({
  id,
  name,
  type: 'file',
  symbol,
  kind,
  size,
  modified,
  availability,
  context,
});

const PLACES: Place[] = [
  {
    id: 'recents',
    title: 'Recents',
    symbol: 'clock.arrow.circlepath',
    items: [
      folder('trip-plans', 'Trip Plans'),
      folder('receipts', 'Receipts'),
      file(
        'project-brief',
        'Project Brief.pdf',
        'doc.plaintext.fill',
        'PDF Document',
        '2.8 MB',
        'Today at 2:18 PM',
        'Available offline',
        'Downloaded from Mail'
      ),
      file(
        'boardwalk',
        'Boardwalk.heic',
        'photo.fill',
        'HEIC Image',
        '3.4 MB',
        'Yesterday at 8:51 PM',
        'In iCloud',
        'Captured on iPhone'
      ),
      file(
        'budget',
        'Budget.xlsx',
        'tablecells.fill',
        'Spreadsheet',
        '812 KB',
        'Monday at 10:25 AM',
        'In iCloud',
        'Updated in Excel'
      ),
    ],
  },
  {
    id: 'icloud-drive',
    title: 'iCloud Drive',
    symbol: 'icloud.fill',
    items: [
      folder('contracts', 'Contracts'),
      folder('design', 'Design'),
      folder('exports', 'Exports'),
      folder('invoices', 'Invoices'),
      folder('mockups', 'Mockups'),
      folder('research', 'Research'),
      folder('shared-assets', 'Shared Assets'),
      file(
        'accessibility-audit',
        'Accessibility Audit.pdf',
        'doc.text.fill',
        'PDF Document',
        '1.7 MB',
        'Today at 8:06 AM',
        'In iCloud',
        'Annotated in Preview'
      ),
      file(
        'asset-inventory',
        'Asset Inventory.csv',
        'tablecells.fill',
        'Spreadsheet',
        '624 KB',
        'Wednesday at 10:41 AM',
        'Available offline',
        'Edited in Numbers'
      ),
      file(
        'split-layout',
        'Split Layout.fig',
        'rectangle.split.3x1.fill',
        'Figma File',
        '5.6 MB',
        'Today at 1:02 PM',
        'In iCloud',
        'Received from Maya'
      ),
      file(
        'inspector-states',
        'Inspector States.sketch',
        'square.on.square.intersection.dashed',
        'Sketch File',
        '8.1 MB',
        'Yesterday at 11:27 AM',
        'In iCloud',
        'Last opened in Sketch'
      ),
      file(
        'brand-notes',
        'Brand Notes.txt',
        'note.text',
        'Plain Text',
        '18 KB',
        'Monday at 5:06 PM',
        'Available offline',
        'Created on Mac'
      ),
      file(
        'content-plan',
        'Content Plan.docx',
        'doc.richtext.fill',
        'Word Document',
        '318 KB',
        'Monday at 2:24 PM',
        'In iCloud',
        'Edited in Word'
      ),
      file(
        'weekend-plans',
        'Weekend Plans.txt',
        'note.text',
        'Plain Text',
        '22 KB',
        'Today at 9:32 AM',
        'Available offline',
        'Edited on iPhone'
      ),
      file(
        'launch-checklist',
        'Launch Checklist.pdf',
        'checklist',
        'PDF Checklist',
        '984 KB',
        'Yesterday at 5:21 PM',
        'In iCloud',
        'Signed in Markup'
      ),
      file(
        'roadmap',
        'Roadmap.key',
        'chart.bar.doc.horizontal.fill',
        'Keynote Presentation',
        '12.4 MB',
        'Tuesday at 9:54 AM',
        'In iCloud',
        'Updated in Keynote'
      ),
      file(
        'launch-image',
        'Launch Image.jpg',
        'photo.fill.on.rectangle.fill',
        'JPEG Image',
        '4.1 MB',
        'Tuesday at 3:18 PM',
        'In iCloud',
        'Edited in Photos'
      ),
      file(
        'prototype-capture',
        'Prototype Capture.mov',
        'film.stack.fill',
        'QuickTime Movie',
        '18.6 MB',
        'Thursday at 4:02 PM',
        'Streaming from iCloud',
        'Recorded on iPhone'
      ),
      file(
        'quarterly-report',
        'Quarterly Report.numbers',
        'tablecells.fill',
        'Numbers Spreadsheet',
        '2.2 MB',
        'Friday at 9:11 AM',
        'In iCloud',
        'Edited in Numbers'
      ),
      file(
        'ambient-loop',
        'Ambient Loop.mov',
        'film.stack.fill',
        'QuickTime Movie',
        '34.8 MB',
        'Thursday at 12:11 PM',
        'Streaming from iCloud',
        'Trimmed in Photos'
      ),
      file(
        'team-update',
        'Team Update.md',
        'doc.text.fill',
        'Markdown Document',
        '46 KB',
        'Today at 7:40 AM',
        'Available offline',
        'Last opened in TextEdit'
      ),
      file(
        'site-photos',
        'Site Photos.zip',
        'archivebox.fill',
        'ZIP Archive',
        '42.3 MB',
        'Tuesday at 7:48 PM',
        'In iCloud',
        'Exported from the field shoot'
      ),
      file(
        'sync-status',
        'Sync Status.json',
        'doc.plaintext.fill',
        'JSON Document',
        '14 KB',
        'Yesterday at 1:15 PM',
        'Available offline',
        'Saved from Shortcuts'
      ),
      file(
        'floor-plan',
        'Floor Plan.pdf',
        'building.2.crop.circle.fill',
        'PDF Document',
        '6.2 MB',
        'Friday at 1:32 PM',
        'In iCloud',
        'Exported from AutoCAD'
      ),
    ],
  },
  {
    id: 'on-my-ipad',
    title: 'On My iPad',
    symbol: 'ipad',
    items: [
      folder('downloads', 'Downloads'),
      folder('audio-notes', 'Audio Notes'),
      file(
        'manual',
        'Adapter Manual.pdf',
        'doc.text.fill',
        'PDF Document',
        '1.9 MB',
        'Yesterday at 9:19 AM',
        'Available offline',
        'Downloaded from Safari'
      ),
      file(
        'archive',
        'Archive.zip',
        'archivebox.fill',
        'ZIP Archive',
        '22.6 MB',
        'Saturday at 5:44 PM',
        'Stored locally',
        'Compressed on Mac'
      ),
      file(
        'draft-memo',
        'Draft Memo.m4a',
        'waveform',
        'Audio Recording',
        '14.2 MB',
        'Today at 8:22 AM',
        'Stored locally',
        'Recorded in Voice Memos'
      ),
      file(
        'meeting-trim',
        'Meeting Trim.wav',
        'waveform.path.badge.minus',
        'Audio Clip',
        '7.7 MB',
        'Tuesday at 4:48 PM',
        'Stored locally',
        'Trimmed in Voice Memos'
      ),
      file(
        'setup-checklist',
        'Setup Checklist.txt',
        'checklist',
        'Plain Text',
        '9 KB',
        'Monday at 7:55 AM',
        'Stored locally',
        'Created in Notes'
      ),
      file(
        'offline-map',
        'Offline Map.gpx',
        'map.fill',
        'GPX Route',
        '254 KB',
        'Sunday at 2:40 PM',
        'Stored locally',
        'Saved for travel day'
      ),
    ],
  },
  {
    id: 'shared',
    title: 'Shared',
    symbol: 'person.2.fill',
    items: [
      folder('shared-projects', 'Shared Projects'),
      file(
        'status-capture',
        'Status Capture.png',
        'photo.fill',
        'PNG Image',
        '2.2 MB',
        'Today at 11:08 AM',
        'Shared item',
        'Shared by Maya'
      ),
      file(
        'walkthrough',
        'Walkthrough.mov',
        'play.rectangle.fill',
        'QuickTime Movie',
        '28.1 MB',
        'Yesterday at 4:36 PM',
        'Shared item',
        'Shared by Leo'
      ),
      file(
        'meeting-notes',
        'Meeting Notes.pdf',
        'doc.text.fill',
        'PDF Document',
        '938 KB',
        'Friday at 6:14 PM',
        'Shared item',
        'Annotated by Ava'
      ),
      file(
        'copy-deck',
        'Copy Deck.docx',
        'doc.richtext.fill',
        'Word Document',
        '317 KB',
        'Thursday at 8:42 AM',
        'Shared item',
        'Shared by Nora'
      ),
      file(
        'release-notes',
        'Release Notes.md',
        'doc.plaintext.fill',
        'Markdown Document',
        '52 KB',
        'Wednesday at 3:09 PM',
        'Shared item',
        'Edited in iA Writer'
      ),
    ],
  },
];

const INSPECTOR_FIELDS = [
  { label: 'Name', key: 'name' },
  { label: 'Type', key: 'kind' },
  { label: 'Modified', key: 'modified' },
  { label: 'Size', key: 'size' },
  { label: 'Availability', key: 'availability' },
  { label: 'Details', key: 'context' },
] as const satisfies {
  label: string;
  key: keyof DocumentNode;
}[];

const compareFileNodes = (a: FileNode, b: FileNode) => {
  if (a.type !== b.type) {
    return a.type === 'folder' ? -1 : 1;
  }

  return a.name.localeCompare(b.name);
};

function PlacesSidebar({
  places,
  selectedPlaceId,
  onSelectPlace,
}: {
  places: Place[];
  selectedPlaceId: string;
  onSelectPlace: (placeId: string) => void;
}) {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.sidebarContent}
    >
      <View style={styles.sidebarList}>
        {places.map((place) => {
          const selected = place.id === selectedPlaceId;

          return (
            <Pressable
              key={place.id}
              accessibilityRole="button"
              onPress={() => onSelectPlace(place.id)}
              style={[styles.placeRow, selected && styles.selectedRow]}
            >
              <View style={styles.placeIcon}>
                <SFSymbol
                  name={place.symbol}
                  size={ICON_SIZE}
                  color={selected ? ACCENT : colors.text}
                />
              </View>
              <Text
                style={[
                  styles.placeTitle,
                  { color: selected ? ACCENT : colors.text },
                ]}
              >
                {place.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function SurfaceCard({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {children}
    </View>
  );
}

function BrowserItemRow({
  item,
  selected,
  separated,
  onPress,
}: {
  item: FileNode;
  selected: boolean;
  separated: boolean;
  onPress: (document: DocumentNode) => void;
}) {
  const { colors } = useTheme();
  const separatorStyle = separated
    ? {
        borderTopColor: colors.border,
        borderTopWidth: BORDER_WIDTH,
      }
    : null;
  const content = (
    <>
      <View
        style={[
          styles.browserIcon,
          {
            backgroundColor:
              item.type === 'folder' ? ACCENT_SOFT : NEUTRAL_SOFT,
          },
        ]}
      >
        <SFSymbol
          name={
            item.type === 'folder'
              ? (item.symbol ?? 'folder.fill')
              : item.symbol
          }
          size={ICON_SIZE}
          color={item.type === 'folder' ? ACCENT : colors.text}
        />
      </View>
      <View style={styles.browserText}>
        <Text style={[styles.browserName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text
          style={[styles.browserMeta, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.type === 'folder' ? 'Folder' : `${item.kind} • ${item.size}`}
        </Text>
      </View>
    </>
  );

  if (item.type === 'folder') {
    return <View style={[styles.browserRow, separatorStyle]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(item)}
      style={[
        styles.browserRow,
        separatorStyle,
        selected && styles.selectedRow,
      ]}
    >
      {content}
    </Pressable>
  );
}

function InspectorField({
  label,
  value,
  bordered = true,
}: {
  label: string;
  value: string;
  bordered?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.fieldRow,
        bordered && {
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

export function SplitViewFilesShowcase(_: StaticScreenProps<{}>) {
  const { colors } = useTheme();
  const splitRef = React.useRef<SplitHostCommands>(null);
  const [selectedPlaceId, setSelectedPlaceId] = React.useState(PLACES[0].id);
  const [selectedFile, setSelectedFile] = React.useState<DocumentNode | null>(
    null
  );

  const selectedPlace =
    PLACES.find((place) => place.id === selectedPlaceId) ?? PLACES[0];

  const items = [...selectedPlace.items].sort(compareFileNodes);

  const locationLabel =
    selectedFile == null
      ? null
      : [selectedPlace.title, selectedFile.name].join(' / ');

  const selectPlace = (placeId: string) => {
    setSelectedPlaceId(placeId);
    setSelectedFile(null);
    splitRef.current?.show('secondary');
  };

  const inspectFile = (document: DocumentNode) => {
    setSelectedFile((current) =>
      current?.id === document.id ? null : document
    );
  };

  if (Platform.OS !== 'ios') {
    return (
      <View style={styles.fallback}>
        <Text style={[styles.fallbackTitle, { color: colors.text }]}>
          Requires iOS split view support.
        </Text>
        <Text style={[styles.fallbackText, { color: colors.text }]}>
          Available on iOS only.
        </Text>
      </View>
    );
  }

  return (
    <Split.Host
      ref={splitRef}
      showInspector={selectedFile !== null}
      onInspectorHide={() => setSelectedFile(null)}
    >
      <Split.Column>
        <PlacesSidebar
          places={PLACES}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={selectPlace}
        />
      </Split.Column>
      <Split.Column>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.browserContent}
          style={{ backgroundColor: colors.background }}
        >
          <SafeAreaView edges={{ left: true, right: true }}>
            <SurfaceCard>
              {items.map((item, index) => {
                const selected =
                  item.type === 'file' && selectedFile?.id === item.id;

                return (
                  <BrowserItemRow
                    key={item.id}
                    item={item}
                    selected={selected}
                    separated={index > 0}
                    onPress={inspectFile}
                  />
                );
              })}
            </SurfaceCard>
          </SafeAreaView>
        </ScrollView>
      </Split.Column>
      <Split.Inspector>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.inspectorContent}
        >
          <SafeAreaView edges={{ left: true, right: true }}>
            {selectedFile ? (
              <SurfaceCard>
                <InspectorField
                  label="Location"
                  value={locationLabel ?? selectedPlace.title}
                  bordered={false}
                />
                {INSPECTOR_FIELDS.map((item) => (
                  <InspectorField
                    key={item.key}
                    label={item.label}
                    value={selectedFile[item.key]}
                  />
                ))}
              </SurfaceCard>
            ) : null}
          </SafeAreaView>
        </ScrollView>
      </Split.Inspector>
    </Split.Host>
  );
}

SplitViewFilesShowcase.title = 'Showcase - Split View Files';
SplitViewFilesShowcase.linking = undefined;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACE_2XL,
    gap: SPACE_S,
  },
  fallbackTitle: {
    fontSize: TEXT_SIZE_M,
    fontWeight: '600',
    textAlign: 'center',
  },
  fallbackText: {
    fontSize: TEXT_SIZE_M,
    lineHeight: TEXT_LINE_HEIGHT,
    opacity: SECONDARY_OPACITY,
    textAlign: 'center',
    maxWidth: FALLBACK_MAX_WIDTH,
  },
  sidebarContent: {
    paddingHorizontal: SPACE_L,
    paddingTop: SPACE_XL,
    paddingBottom: SPACE_2XL,
    gap: SPACE_M,
  },
  sidebarList: {
    gap: SPACE_XS,
  },
  placeRow: {
    minHeight: ROW_HEIGHT,
    borderRadius: RADIUS_L,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE_M,
    paddingHorizontal: SPACE_M,
    paddingVertical: SPACE_S,
  },
  placeIcon: {
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
    borderRadius: RADIUS_S,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_SOFT,
  },
  placeTitle: {
    flex: 1,
    fontSize: TEXT_SIZE_M,
    fontWeight: '600',
  },
  browserContent: {
    padding: SPACE_XL,
  },
  card: {
    borderWidth: BORDER_WIDTH,
    borderRadius: RADIUS_L,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  browserRow: {
    minHeight: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE_M,
    paddingHorizontal: SPACE_L,
    paddingVertical: SPACE_M,
  },
  selectedRow: {
    backgroundColor: ACCENT_SOFT,
  },
  browserIcon: {
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
    borderRadius: RADIUS_S,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  browserText: {
    flex: 1,
    gap: SPACE_XS,
  },
  browserName: {
    fontSize: TEXT_SIZE_M,
    fontWeight: '500',
  },
  browserMeta: {
    fontSize: TEXT_SIZE_S,
    opacity: SECONDARY_OPACITY,
  },
  inspectorContent: {
    padding: SPACE_XL,
  },
  fieldRow: {
    paddingHorizontal: SPACE_L,
    paddingVertical: SPACE_M,
    gap: SPACE_XS,
  },
  fieldLabel: {
    fontSize: TEXT_SIZE_S,
    fontWeight: '600',
    opacity: SECONDARY_OPACITY,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: TEXT_SIZE_M,
    lineHeight: TEXT_LINE_HEIGHT,
  },
});
