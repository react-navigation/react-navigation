# Split View (react-native-screens)

iOS-only API wrapping `UISplitViewController`. Renders a multi-column layout on iPad; no-op on Android/web.

```ts
import { Split } from 'react-native-screens/experimental';
import type { SplitHostCommands } from 'react-native-screens/experimental';
```

## Concepts

Split View arranges content in columns that flow left-to-right:

```
| Primary | Supplementary | Secondary              | Inspector |
| sidebar | 2nd sidebar   | main content           | details   |
```

- **Primary** — outermost sidebar (e.g., mailbox list)
- **Supplementary** — second-level sidebar (e.g., message list). Only in triple-column layouts.
- **Secondary** — main content area. Gets the most space. Shown by default on compact devices.
- **Inspector** — trailing panel for contextual details (e.g., properties). iOS 26+ only. Inline when expanded, modal when collapsed.

The column count is determined by the number of `Split.Column` children:

- 2 children → double-column (`UISplitViewController.Style.doubleColumn`)
- 3 children → triple-column (`UISplitViewController.Style.tripleColumn`)

**Column count is immutable per instance.** Changing the number of children forces a full re-mount.

## Components

### `Split.Host`

Top-level container. Wraps a native `UISplitViewController`.

```tsx
<Split.Host ref={splitRef} preferredDisplayMode="oneBesideSecondary">
  <Split.Column>{/* primary */}</Split.Column>
  <Split.Column>{/* secondary */}</Split.Column>
</Split.Host>
```

### `Split.Column`

Represents one column. Children are assigned by order: 1st = primary, 2nd = supplementary (if 3 columns), last = secondary.

### `Split.Inspector`

A special column displayed on the trailing edge of secondary (iOS 26+). Rendered inline when expanded, as a modal when collapsed.

## API Reference

### `Split.Host` Props

#### Display

| Prop                     | Type                               | Default       | Description                                                                              |
| ------------------------ | ---------------------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `preferredDisplayMode`   | `SplitDisplayMode`                 | `'automatic'` | Suggested column visibility. The OS makes the final decision based on device/size class. |
| `preferredSplitBehavior` | `SplitBehavior`                    | `'automatic'` | How sidebars relate to the secondary column.                                             |
| `primaryEdge`            | `'leading' \| 'trailing'`          | `'leading'`   | Which side the primary sidebar appears on.                                               |
| `primaryBackgroundStyle` | `'default' \| 'none' \| 'sidebar'` | `'default'`   | Background style of primary column. iOS 26+ only.                                        |
| `presentsWithGesture`    | `boolean`                          | —             | Whether swipe gestures can change display mode.                                          |
| `orientation`            | `SplitHostOrientation`             | `'inherit'`   | Supported interface orientations.                                                        |

**`SplitDisplayMode`** values:

| Value                    | Description                                 |
| ------------------------ | ------------------------------------------- |
| `'automatic'`            | OS decides based on device and size class   |
| `'secondaryOnly'`        | Only secondary column visible               |
| `'oneBesideSecondary'`   | One sidebar beside secondary                |
| `'oneOverSecondary'`     | One sidebar overlaying secondary            |
| `'twoBesideSecondary'`   | Two sidebars beside secondary               |
| `'twoOverSecondary'`     | Two sidebars overlaying secondary           |
| `'twoDisplaceSecondary'` | Two sidebars displacing secondary offscreen |

**`SplitBehavior`** values:

| Value         | Description                                 |
| ------------- | ------------------------------------------- |
| `'automatic'` | OS decides                                  |
| `'tile'`      | Sidebars appear side-by-side with secondary |
| `'overlay'`   | Sidebars overlay secondary                  |
| `'displace'`  | Sidebars push secondary partially offscreen |

**Valid `preferredDisplayMode` + `preferredSplitBehavior` pairs:**

| Behavior    | Valid Display Modes                                           |
| ----------- | ------------------------------------------------------------- |
| `tile`      | `secondaryOnly`, `oneBesideSecondary`, `twoBesideSecondary`   |
| `overlay`   | `secondaryOnly`, `oneOverSecondary`, `twoOverSecondary`       |
| `displace`  | `secondaryOnly`, `oneBesideSecondary`, `twoDisplaceSecondary` |
| `automatic` | any (OS resolves)                                             |

Invalid pairs produce a console warning but don't crash.

#### UI Controls

| Prop                          | Type                                 | Default       | Description                               |
| ----------------------------- | ------------------------------------ | ------------- | ----------------------------------------- |
| `displayModeButtonVisibility` | `'always' \| 'automatic' \| 'never'` | `'automatic'` | System toggle button visibility.          |
| `showSecondaryToggleButton`   | `boolean`                            | —             | Button to toggle to/from `secondaryOnly`. |
| `showInspector`               | `boolean`                            | —             | Whether inspector is visible. iOS 26+.    |

#### Column Sizing

| Prop            | Type                 | Description                   |
| --------------- | -------------------- | ----------------------------- |
| `columnMetrics` | `SplitColumnMetrics` | Width constraints per column. |

**`SplitColumnMetrics`** fields (all optional, in points; fractional values = percentage):

| Field                                                                                                               | Column        |
| ------------------------------------------------------------------------------------------------------------------- | ------------- |
| `minimumPrimaryColumnWidth`, `maximumPrimaryColumnWidth`, `preferredPrimaryColumnWidthOrFraction`                   | Primary       |
| `minimumSupplementaryColumnWidth`, `maximumSupplementaryColumnWidth`, `preferredSupplementaryColumnWidthOrFraction` | Supplementary |
| `minimumSecondaryColumnWidth` _, `preferredSecondaryColumnWidthOrFraction` _                                        | Secondary     |
| `minimumInspectorColumnWidth` _, `maximumInspectorColumnWidth` _, `preferredInspectorColumnWidthOrFraction` \*      | Inspector     |

\* iOS 26+ only

#### Collapse Behavior

| Prop                     | Type                                          | Default        | Description                                                                                 |
| ------------------------ | --------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------- |
| `topColumnForCollapsing` | `'primary' \| 'supplementary' \| 'secondary'` | system default | Which column is shown when the split collapses to single-column (e.g., portrait on iPhone). |

#### Events

| Prop                      | Payload                                   | Description                                                    |
| ------------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| `onCollapse`              | —                                         | Split collapsed to single column.                              |
| `onExpand`                | —                                         | Split expanded to multiple columns.                            |
| `onDisplayModeWillChange` | `{ currentDisplayMode, nextDisplayMode }` | Display mode is about to change (from native button or swipe). |
| `onInspectorHide`         | —                                         | Inspector was hidden/dismissed. iOS 26+.                       |

#### Imperative Commands

Via `ref`:

```ts
const splitRef = useRef<SplitHostCommands>(null);

splitRef.current?.show('primary');
splitRef.current?.show('supplementary');
splitRef.current?.show('secondary');
```

Programmatically navigates to a column. Useful for cross-column navigation (e.g., tapping an item in primary to reveal secondary on collapsed layouts).

### `Split.Column` / `Split.Inspector` Props

| Prop              | Description                                         |
| ----------------- | --------------------------------------------------- |
| `onWillAppear`    | Column transition is about to start (appearing).    |
| `onDidAppear`     | Column transition ended (appeared).                 |
| `onWillDisappear` | Column transition is about to start (disappearing). |
| `onDidDisappear`  | Column transition ended (disappeared).              |

## Usage Example

```tsx
import { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Split } from 'react-native-screens/experimental';
import type { SplitHostCommands } from 'react-native-screens/experimental';

function App() {
  const splitRef = useRef<SplitHostCommands>(null);

  return (
    <Split.Host
      ref={splitRef}
      preferredDisplayMode="twoBesideSecondary"
      preferredSplitBehavior="tile"
      topColumnForCollapsing="primary"
      presentsWithGesture
      displayModeButtonVisibility="automatic"
      columnMetrics={{
        minimumPrimaryColumnWidth: 200,
        maximumPrimaryColumnWidth: 350,
        preferredPrimaryColumnWidthOrFraction: 280,
        minimumSupplementaryColumnWidth: 200,
        maximumSupplementaryColumnWidth: 350,
        preferredSupplementaryColumnWidthOrFraction: 280,
      }}
      onCollapse={() => console.log('collapsed')}
      onExpand={() => console.log('expanded')}
    >
      <Split.Column>
        <View style={{ flex: 1, backgroundColor: '#e8f5e9' }}>
          <Text>Primary</Text>
          <Pressable onPress={() => splitRef.current?.show('secondary')}>
            <Text>Go to Secondary</Text>
          </Pressable>
        </View>
      </Split.Column>
      <Split.Column>
        <View style={{ flex: 1, backgroundColor: '#e3f2fd' }}>
          <Text>Supplementary</Text>
        </View>
      </Split.Column>
      <Split.Column>
        <View style={{ flex: 1, backgroundColor: '#fff3e0' }}>
          <Text>Secondary</Text>
        </View>
      </Split.Column>
    </Split.Host>
  );
}
```

## Things to Know

### Column count is fixed at mount time

`UISplitViewController` requires the column count at initialization. If you change the number of `Split.Column` children, the entire split view re-mounts (via a React `key` change internally). Avoid dynamically adding/removing columns.

### "Preferred" means suggested, not enforced

`preferredDisplayMode` and `preferredSplitBehavior` are hints to the OS. The actual layout depends on device type, size class, and multitasking state. On an iPhone, the split always collapses regardless of your preference.

### Display mode + split behavior must be compatible

Only certain pairs are valid (see the table above). Invalid combinations produce a console warning and may result in unexpected transitions. When in doubt, use `'automatic'` for either.

### Collapsed vs expanded

The split view collapses to a single column on compact-width devices (iPhone, iPad in slide-over, narrow multitasking). Use `topColumnForCollapsing` to control which column is shown. Use `onCollapse`/`onExpand` to react to transitions. Use `show()` to programmatically navigate between columns when collapsed.

### Inspector is iOS 26+ only

`Split.Inspector`, `showInspector`, `onInspectorHide`, and inspector column metrics all require iOS 26+. On older versions they are silently ignored.

### Fabric only

The Split View API uses React Native's codegen system and only works with the new architecture (Fabric). There is no Paper/legacy support.

### Platform behavior

- **iPad** — full multi-column layout.
- **iPhone** — always collapses to single column with navigation-style transitions between columns.
- **Android/Web** — no-op. The web stub logs a warning. Use a drawer with `drawerType: 'permanent'` for a cross-platform alternative.

## Practical Examples

### Mail app (triple-column)

Accounts → inbox → email body.

```tsx
<Split.Host
  preferredDisplayMode="twoBesideSecondary"
  preferredSplitBehavior="tile"
  topColumnForCollapsing="secondary"
  columnMetrics={{
    preferredPrimaryColumnWidthOrFraction: 0.2,
    preferredSupplementaryColumnWidthOrFraction: 0.3,
  }}
>
  <Split.Column>
    <AccountList onSelect={(id) => setAccount(id)} />
  </Split.Column>
  <Split.Column>
    <MessageList accountId={account} onSelect={(id) => setMessage(id)} />
  </Split.Column>
  <Split.Column>
    <MessageDetail messageId={message} />
  </Split.Column>
</Split.Host>
```

### Notes app (double-column with inspector)

Sidebar → note editor, with a metadata inspector panel.

```tsx
const [showInspector, setShowInspector] = useState(false);

<Split.Host
  preferredDisplayMode="oneBesideSecondary"
  preferredSplitBehavior="tile"
  topColumnForCollapsing="primary"
  showInspector={showInspector}
  onInspectorHide={() => setShowInspector(false)}
>
  <Split.Column>
    <NoteList onSelect={(id) => setNoteId(id)} />
  </Split.Column>
  <Split.Column>
    <NoteEditor
      noteId={noteId}
      onToggleInspector={() => setShowInspector((v) => !v)}
    />
  </Split.Column>
  <Split.Inspector>
    <NoteMetadata noteId={noteId} />
  </Split.Inspector>
</Split.Host>;
```

### Settings app (double-column, sidebar on trailing edge)

Content on the left, settings categories on the right.

```tsx
<Split.Host
  preferredDisplayMode="oneBesideSecondary"
  preferredSplitBehavior="overlay"
  primaryEdge="trailing"
  displayModeButtonVisibility="always"
  presentsWithGesture
>
  <Split.Column>
    <SettingsCategories onSelect={setCategory} />
  </Split.Column>
  <Split.Column>
    <SettingsDetail category={category} />
  </Split.Column>
</Split.Host>
```

### Files app (triple-column with width constraints)

Fixed-width sidebars with flexible main content area.

```tsx
<Split.Host
  preferredDisplayMode="twoBesideSecondary"
  preferredSplitBehavior="displace"
  topColumnForCollapsing="primary"
  primaryBackgroundStyle="sidebar"
  columnMetrics={{
    minimumPrimaryColumnWidth: 180,
    maximumPrimaryColumnWidth: 280,
    preferredPrimaryColumnWidthOrFraction: 220,
    minimumSupplementaryColumnWidth: 220,
    maximumSupplementaryColumnWidth: 360,
    preferredSupplementaryColumnWidthOrFraction: 300,
  }}
>
  <Split.Column>
    <LocationList />
  </Split.Column>
  <Split.Column>
    <FolderBrowser />
  </Split.Column>
  <Split.Column>
    <FilePreview />
  </Split.Column>
</Split.Host>
```

### Responding to collapse for adaptive UI

```tsx
const [isCollapsed, setIsCollapsed] = useState(false);

<Split.Host
  preferredDisplayMode="oneBesideSecondary"
  preferredSplitBehavior="tile"
  onCollapse={() => setIsCollapsed(true)}
  onExpand={() => setIsCollapsed(false)}
>
  <Split.Column>
    <Sidebar showBackButton={isCollapsed} />
  </Split.Column>
  <Split.Column>
    <Content />
  </Split.Column>
</Split.Host>;
```

### Imperative column navigation

Useful when tapping an item in the sidebar should show the detail column on collapsed layouts.

```tsx
const splitRef = useRef<SplitHostCommands>(null);

<Split.Host ref={splitRef} topColumnForCollapsing="primary">
  <Split.Column>
    <ItemList
      onSelect={(item) => {
        setSelected(item);
        splitRef.current?.show('secondary');
      }}
    />
  </Split.Column>
  <Split.Column>
    <ItemDetail item={selected} />
  </Split.Column>
</Split.Host>;
```
