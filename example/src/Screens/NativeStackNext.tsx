import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  getHeaderTitle,
  Header,
  HeaderButton,
  Text,
} from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';
import {
  useNavigation,
  useNavigationState,
  usePreventRemove,
  useRoute,
  useTheme,
} from '@react-navigation/native';
// eslint-disable-next-line no-restricted-imports
import {
  createNativeStackNavigator,
  createNativeStackScreen,
  type NativeStackHeaderToolbarMenuRef,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack/next';
import * as React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Article } from '../Shared/Article';
import { SegmentedPicker } from '../Shared/SegmentedPicker';
import { entries } from '../utilities';

const scrollEnabled = Platform.select({ web: true, default: false });

const onHeaderButtonPress = () => {
  Alert.alert('Header button pressed');
};

const ON_OFF = [
  { label: 'On', value: true },
  { label: 'Off', value: false },
];

const Option = <T extends string | number | boolean>({
  label,
  choices,
  value,
  onValueChange,
}: {
  label: string;
  choices: { label: string; value: T }[];
  value: T;
  onValueChange: (value: T) => void;
}) => (
  <View style={styles.option}>
    <Text style={styles.optionLabel}>{label}</Text>
    <SegmentedPicker
      choices={choices}
      value={value}
      onValueChange={onValueChange}
    />
  </View>
);

const DEMOS = [
  { name: 'NativeStackNextTitles', label: 'Titles & subtitles' },
  { name: 'NativeStackNextCustomHeader', label: 'Custom header' },
  { name: 'NativeStackNextHeaderAppearance', label: 'Header appearance' },
  { name: 'NativeStackNextHeaderButtons', label: 'Header buttons' },
  { name: 'NativeStackNextHeaderItems', label: 'Header items (iOS)' },
  { name: 'NativeStackNextAppBar', label: 'App bar (Android)' },
  { name: 'NativeStackNextToolbarMenu', label: 'Toolbar menu (Android)' },
  { name: 'NativeStackNextSheets', label: 'Form sheets' },
  { name: 'NativeStackNextPreventRemove', label: 'Prevent remove' },
  { name: 'NativeStackNextActivityStates', label: 'Activity states' },
  { name: 'NativeStackNextEvents', label: 'Transition events' },
] as const;

const HomeScreen = () => {
  const navigation = useNavigation('NativeStackNextHome');
  const [isReady, setIsReady] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  React.useEffect(() => {
    return navigation.addListener('blur', () => {
      clearTimeout(timerRef.current);
      setIsReady(false);
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {DEMOS.map(({ name, label }) => (
        <Button
          key={name}
          variant="filled"
          onPress={() => navigation.navigate(name)}
          style={styles.button}
        >
          {label}
        </Button>
      ))}
      <Button
        variant="filled"
        onPress={() => {
          timerRef.current = setTimeout(() => {
            setIsReady(true);
          }, 5000);

          navigation.preload('NativeStackNextPreloaded');
        }}
        style={styles.button}
      >
        Preload screen
      </Button>
      <Button
        variant={isReady ? 'filled' : 'tinted'}
        onPress={() => navigation.navigate('NativeStackNextPreloaded')}
        style={styles.button}
      >
        {isReady ? 'Open preloaded screen' : 'Open screen'}
      </Button>
    </ScrollView>
  );
};

const SUBTITLE_CHOICES = [
  { label: 'None', value: 'none' },
  { label: 'String', value: 'string' },
  { label: 'Custom', value: 'custom' },
];

const TitlesScreen = () => {
  const navigation = useNavigation('NativeStackNextTitles');
  const [customTitle, setCustomTitle] = React.useState(false);
  const [largeTitle, setLargeTitle] = React.useState(true);
  const [subtitle, setSubtitle] = React.useState('string');
  const [largeSubtitle, setLargeSubtitle] = React.useState('string');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: customTitle
        ? ({ children, tintColor }) => (
            <Text style={[styles.customTitle, { color: tintColor }]}>
              {`✦ ${children}`}
            </Text>
          )
        : undefined,
      headerLargeTitleEnabled: largeTitle,
      headerSubtitle:
        subtitle === 'custom'
          ? () => <Text style={styles.subtitleText}>Custom subtitle</Text>
          : subtitle === 'string'
            ? 'A string subtitle'
            : undefined,
      headerLargeSubtitle:
        largeSubtitle === 'custom'
          ? () => <Text style={styles.subtitleText}>Custom large subtitle</Text>
          : largeSubtitle === 'string'
            ? 'A large string subtitle'
            : undefined,
    });
  }, [navigation, customTitle, largeTitle, subtitle, largeSubtitle]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.controls}>
        <Text style={styles.note}>
          Large titles are only supported on iOS. Subtitles are only supported
          on iOS 26+.
        </Text>
        <Option
          label="Custom title element"
          choices={ON_OFF}
          value={customTitle}
          onValueChange={setCustomTitle}
        />
        <Option
          label="Large title"
          choices={ON_OFF}
          value={largeTitle}
          onValueChange={setLargeTitle}
        />
        <Option
          label="Subtitle"
          choices={SUBTITLE_CHOICES}
          value={subtitle}
          onValueChange={setSubtitle}
        />
        <Option
          label="Large subtitle"
          choices={SUBTITLE_CHOICES}
          value={largeSubtitle}
          onValueChange={setLargeSubtitle}
        />
      </View>
      <Article author={{ name: 'Gandalf' }} scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const CustomHeaderScreen = () => {
  const navigation = useNavigation('NativeStackNextCustomHeader');
  const [mode, setMode] = React.useState('custom');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: mode !== 'hidden',
      header:
        mode === 'custom'
          ? ({ options, route, back }) => (
              <Header
                {...options}
                back={back}
                title={getHeaderTitle(options, route.name)}
              />
            )
          : undefined,
    });
  }, [navigation, mode]);

  return (
    <View style={styles.content}>
      <Option
        label="Header"
        choices={[
          { label: 'Native', value: 'native' },
          { label: 'Custom', value: 'custom' },
          { label: 'Hidden', value: 'hidden' },
        ]}
        value={mode}
        onValueChange={setMode}
      />
      <Button
        variant="tinted"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </View>
  );
};

const HeaderAppearanceScreen = () => {
  const navigation = useNavigation('NativeStackNextHeaderAppearance');
  const [transparent, setTransparent] = React.useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: transparent,
    });
  }, [navigation, transparent]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.controls}>
        <Option
          label="Transparent header"
          choices={ON_OFF}
          value={transparent}
          onValueChange={setTransparent}
        />
      </View>
      <Article author={{ name: 'Babel fish' }} scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const HeaderButtonsScreen = () => {
  const navigation = useNavigation('NativeStackNextHeaderButtons');
  const [showLeft, setShowLeft] = React.useState(true);
  const [showRight, setShowRight] = React.useState(true);
  const [backVisible, setBackVisible] = React.useState(false);
  const [customBackLabel, setCustomBackLabel] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: backVisible,
      headerBackTitle: customBackLabel ? 'Start' : undefined,
      headerLeft: showLeft
        ? ({ tintColor, label }) => (
            <HeaderButton onPress={onHeaderButtonPress}>
              <MaterialCommunityIcons name="menu" size={24} color={tintColor} />
              {label != null ? (
                <Text style={{ color: tintColor }}>{label}</Text>
              ) : null}
            </HeaderButton>
          )
        : undefined,
      headerRight: showRight
        ? ({ tintColor }) => (
            <HeaderButton onPress={onHeaderButtonPress}>
              <MaterialCommunityIcons name="star" size={24} color={tintColor} />
            </HeaderButton>
          )
        : undefined,
    });
  }, [navigation, showLeft, showRight, backVisible, customBackLabel]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.controls}>
        <Option
          label="Left button"
          choices={ON_OFF}
          value={showLeft}
          onValueChange={setShowLeft}
        />
        <Option
          label="Right button"
          choices={ON_OFF}
          value={showRight}
          onValueChange={setShowRight}
        />
        <Option
          label="Back button alongside left button"
          choices={ON_OFF}
          value={backVisible}
          onValueChange={setBackVisible}
        />
        <Option
          label="Custom back label (shown in left button)"
          choices={ON_OFF}
          value={customBackLabel}
          onValueChange={setCustomBackLabel}
        />
        <Button variant="tinted" onPress={() => navigation.pop()}>
          Go back
        </Button>
      </View>
    </ScrollView>
  );
};

const HeaderItemsScreen = () => {
  const navigation = useNavigation('NativeStackNextHeaderItems');
  const [lastAction, setLastAction] = React.useState('None');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      unstable_headerLeftItems: () => [
        {
          type: 'button',
          label: 'Info',
          onPress: () => setLastAction('Info'),
        },
      ],
      unstable_headerRightItems: () => [
        {
          type: 'button',
          label: 'Add',
          onPress: () => setLastAction('Add'),
        },
        { type: 'spacing', spacing: 8 },
        {
          type: 'menu',
          label: 'More',
          menu: {
            title: 'Options',
            items: [
              {
                type: 'action',
                label: 'Share',
                onPress: () => setLastAction('Share'),
              },
              {
                type: 'action',
                label: 'Starred',
                role: 'toggle',
                initialState: true,
                keepsMenuPresented: true,
                onPress: () => setLastAction('Starred'),
              },
              {
                type: 'submenu',
                label: 'Sort by',
                multiselectable: false,
                onSelectionChange: (ids) =>
                  setLastAction(`Sort by ${ids.join(', ')}`),
                items: [
                  {
                    type: 'action',
                    label: 'Name',
                    identifier: 'name',
                    role: 'toggle',
                    initialState: true,
                    onPress: () => setLastAction('Sort by name'),
                  },
                  {
                    type: 'action',
                    label: 'Date',
                    identifier: 'date',
                    role: 'toggle',
                    onPress: () => setLastAction('Sort by date'),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'custom',
          element: (
            <MaterialCommunityIcons name="heart" size={24} color="tomato" />
          ),
        },
      ],
    });
  }, [navigation]);

  return (
    <View style={styles.content}>
      {Platform.OS !== 'ios' ? (
        <Text style={styles.note}>Header items are only supported on iOS.</Text>
      ) : null}
      <Text style={styles.text}>Last action: {lastAction}</Text>
      <Button
        variant="tinted"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </View>
  );
};

const HEADER_TYPE_CHOICES = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

const AppBarScreen = () => {
  const navigation = useNavigation('NativeStackNextAppBar');
  const [type, setType] = React.useState('medium');
  const [background, setBackground] = React.useState('none');
  const [scroll, setScroll] = React.useState(true);
  const [enterAlways, setEnterAlways] = React.useState(false);
  const [exitUntilCollapsed, setExitUntilCollapsed] = React.useState(true);
  const [snap, setSnap] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerType: type === 'small' || type === 'large' ? type : 'medium',
      headerBackground:
        background === 'none'
          ? undefined
          : () => (
              <Image
                source={require('../../assets/misc/cpu.jpg')}
                resizeMode="cover"
                style={StyleSheet.absoluteFill}
              />
            ),
      headerBackgroundCollapseMode:
        background === 'parallax' ? 'parallax' : 'off',
      headerTintColor: background === 'none' ? undefined : 'white',
      headerScrollFlagScroll: scroll,
      headerScrollFlagEnterAlways: enterAlways,
      headerScrollFlagEnterAlwaysCollapsed: enterAlways,
      headerScrollFlagExitUntilCollapsed: exitUntilCollapsed,
      headerScrollFlagSnap: snap,
    });
  }, [
    navigation,
    type,
    background,
    scroll,
    enterAlways,
    exitUntilCollapsed,
    snap,
  ]);

  return (
    <ScrollView nestedScrollEnabled>
      <View style={styles.controls}>
        {Platform.OS !== 'android' ? (
          <Text style={styles.note}>
            The app bar options are only supported on Android.
          </Text>
        ) : null}
        <Option
          label="App bar type"
          choices={HEADER_TYPE_CHOICES}
          value={type}
          onValueChange={setType}
        />
        <Option
          label="Custom background"
          choices={[
            { label: 'None', value: 'none' },
            { label: 'Static', value: 'static' },
            { label: 'Parallax', value: 'parallax' },
          ]}
          value={background}
          onValueChange={setBackground}
        />
        <Option
          label="Scroll flag: scroll"
          choices={ON_OFF}
          value={scroll}
          onValueChange={setScroll}
        />
        <Option
          label="Scroll flag: enter always (collapsed)"
          choices={ON_OFF}
          value={enterAlways}
          onValueChange={setEnterAlways}
        />
        <Option
          label="Scroll flag: exit until collapsed"
          choices={ON_OFF}
          value={exitUntilCollapsed}
          onValueChange={setExitUntilCollapsed}
        />
        <Option
          label="Scroll flag: snap"
          choices={ON_OFF}
          value={snap}
          onValueChange={setSnap}
        />
      </View>
      <Article author={{ name: 'Marvin' }} scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const ToolbarMenuScreen = () => {
  const navigation = useNavigation('NativeStackNextToolbarMenu');
  const menuRef = React.useRef<NativeStackHeaderToolbarMenuRef>(null);
  const [lastAction, setLastAction] = React.useState('None');
  const [isSecretHidden, setIsSecretHidden] = React.useState(true);
  const [isShareDisabled, setIsShareDisabled] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackIcon: { type: 'materialSymbol', name: 'arrow_back' },
      headerBackButtonTintColorPressed: 'tomato',
      headerBackButtonTintColorFocused: 'orange',
      unstable_headerToolbarMenuGroupDividerEnabled: true,
      unstable_headerToolbarMenu: {
        ref: menuRef,
        groups: [
          {
            identifier: 'sort',
            singleSelection: true,
            onSelectionChange: (ids) =>
              setLastAction(`Sort by ${ids.join(', ')}`),
          },
        ],
        items: [
          {
            type: 'item',
            identifier: 'favorite',
            label: 'Favorite',
            tooltip: 'Add to favorites',
            showAsAction: 'always',
            icon: { type: 'materialSymbol', name: 'favorite' },
            iconTintColor: 'tomato',
            iconTintColorPressed: 'orange',
            onPress: () => setLastAction('Favorite'),
          },
          {
            type: 'item',
            identifier: 'share',
            label: 'Share',
            condensedLabel: 'Share…',
            showAsAction: 'ifRoom',
            icon: { type: 'materialSymbol', name: 'share' },
            onPress: () => setLastAction('Share'),
          },
          {
            type: 'item',
            identifier: 'sort-name',
            label: 'Sort by name',
            groupIdentifier: 'sort',
            role: 'toggle',
            initialState: true,
          },
          {
            type: 'item',
            identifier: 'sort-date',
            label: 'Sort by date',
            groupIdentifier: 'sort',
            role: 'toggle',
          },
          {
            type: 'item',
            identifier: 'secret',
            label: 'Secret action',
            hidden: true,
            onPress: () => setLastAction('Secret'),
          },
          {
            type: 'menu',
            identifier: 'more',
            label: 'More',
            menuLabel: 'More options',
            items: [
              {
                type: 'item',
                identifier: 'edit',
                label: 'Edit',
                icon: { type: 'materialSymbol', name: 'edit' },
                onPress: () => setLastAction('Edit'),
              },
              {
                type: 'item',
                identifier: 'delete',
                label: 'Delete',
                icon: { type: 'materialSymbol', name: 'delete' },
                onPress: () => setLastAction('Delete'),
              },
            ],
          },
        ],
      },
    });
  }, [navigation]);

  return (
    <View style={styles.content}>
      {Platform.OS !== 'android' ? (
        <Text style={styles.note}>
          The toolbar menu is only supported on Android.
        </Text>
      ) : null}
      <Text style={styles.text}>Last action: {lastAction}</Text>
      <Button
        variant="filled"
        onPress={() => {
          const hidden = !isSecretHidden;

          setIsSecretHidden(hidden);
          menuRef.current?.setOptions('secret', { hidden });
        }}
        style={styles.button}
      >
        {isSecretHidden ? 'Show secret action' : 'Hide secret action'}
      </Button>
      <Button
        variant="filled"
        onPress={() => {
          const disabled = !isShareDisabled;

          setIsShareDisabled(disabled);
          menuRef.current?.setOptions('share', { disabled });
        }}
        style={styles.button}
      >
        {isShareDisabled ? 'Enable share' : 'Disable share'}
      </Button>
    </View>
  );
};

const SHEET_PRESETS = {
  fitToContents: {
    label: 'Fit to contents',
    options: {
      sheetAllowedDetents: 'fitToContents',
    },
  },
  detents: {
    label: 'Detents with grabber',
    options: {
      sheetAllowedDetents: [0.3, 0.6, 0.95],
      sheetGrabberVisible: true,
    },
  },
  initialDetent: {
    label: 'Open at last detent',
    options: {
      sheetAllowedDetents: [0.3, 0.6, 0.95],
      sheetInitialDetentIndex: 'last',
      sheetGrabberVisible: true,
    },
  },
  undimmed: {
    label: 'Undimmed below sheet',
    options: {
      sheetAllowedDetents: [0.3, 0.6, 0.95],
      sheetLargestUndimmedDetentIndex: 1,
      sheetGrabberVisible: true,
    },
  },
  corners: {
    label: 'Square corners',
    options: {
      sheetAllowedDetents: 'fitToContents',
      sheetCornerRadius: 0,
    },
  },
  noExpand: {
    label: "Don't expand on scroll",
    options: {
      sheetAllowedDetents: [0.4],
      sheetExpandsWhenScrolledToEdge: false,
    },
  },
} satisfies Record<
  string,
  { label: string; options: NativeStackNavigationOptions }
>;

type SheetPreset = keyof typeof SHEET_PRESETS;

const SheetsScreen = () => {
  const navigation = useNavigation('NativeStackNextSheets');

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {Platform.OS !== 'android' && Platform.OS !== 'ios' ? (
        <Text style={styles.note}>
          Form sheets are only supported on Android and iOS.
        </Text>
      ) : null}
      {entries(SHEET_PRESETS).map(([preset, { label }]) => (
        <Button
          key={preset}
          variant="filled"
          onPress={() =>
            navigation.navigate('NativeStackNextSheet', { preset })
          }
          style={styles.button}
        >
          {label}
        </Button>
      ))}
    </ScrollView>
  );
};

const SheetScreen = ({ route }: StaticScreenProps<{ preset: SheetPreset }>) => {
  const navigation = useNavigation('NativeStackNextSheet');
  const { colors } = useTheme();
  const [detentIndex, setDetentIndex] = React.useState<number>();
  const [preventClose, setPreventClose] = React.useState(false);

  React.useEffect(() => {
    return navigation.addListener('sheetDetentChange', (e) => {
      setDetentIndex(e.data.index);
    });
  }, [navigation]);

  usePreventRemove(preventClose, ({ data }) => {
    Alert.alert('Close sheet?', 'Closing this sheet is currently prevented.', [
      { text: 'Keep open', style: 'cancel' },
      {
        text: 'Close',
        style: 'destructive',
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  return (
    <ScrollView contentContainerStyle={styles.sheetContent}>
      <Text style={[styles.sheetTitle, { color: colors.text }]}>
        {SHEET_PRESETS[route.params.preset].label}
      </Text>
      <Text style={[styles.text, { color: colors.text }]}>
        Current detent: {detentIndex ?? 'initial'}
      </Text>
      <Option
        label="Prevent close"
        choices={ON_OFF}
        value={preventClose}
        onValueChange={setPreventClose}
      />
      <Text style={[styles.note, { color: colors.text }]}>
        Render a nested navigator in this screen to push routes inside the
        sheet.
      </Text>
      <Button
        variant="filled"
        onPress={() =>
          navigation.replace('NativeStackNextSheet', {
            preset:
              route.params.preset === 'detents' ? 'fitToContents' : 'detents',
          })
        }
        style={styles.button}
      >
        Replace with another sheet
      </Button>
      <Button
        variant="tinted"
        color="tomato"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Close
      </Button>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquam
        justo at dolor condimentum tincidunt. Proin velit nibh, efficitur non
        metus a, egestas semper nisi. Proin egestas neque sollicitudin magna
        semper, id ultrices urna egestas. Aliquam vitae libero vestibulum,
        ultrices mauris vel, facilisis turpis. Morbi ac volutpat ipsum.
      </Text>
    </ScrollView>
  );
};

const PreventRemoveScreen = () => {
  const navigation = useNavigation('NativeStackNextPreventRemove');
  const { colors } = useTheme();
  const [text, setText] = React.useState('');

  const hasUnsavedChanges = Boolean(text);

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    if (Platform.OS === 'web') {
      const discard = confirm(
        'You have unsaved changes. Discard them and leave the screen?'
      );

      if (discard) {
        navigation.dispatch(data.action);
      }
    } else {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Discard them and leave the screen?',
        [
          { text: "Don't leave", style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(data.action),
          },
        ]
      );
    }
  });

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <Text style={styles.text}>
        Type something, then try to go back with the back button or gesture.
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        value={text}
        placeholder="Type something…"
        onChangeText={setText}
      />
      <Button
        variant="tinted"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </ScrollView>
  );
};

const ActivityStatesScreen = () => {
  const navigation = useNavigation('NativeStackNextActivityStates');
  const [behavior, setBehavior] = React.useState('pause');
  const [mountedAt] = React.useState(() => new Date());
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);

    return () => clearInterval(interval);
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      inactiveBehavior:
        behavior === 'unmount' || behavior === 'none' ? behavior : 'pause',
    });
  }, [navigation, behavior]);

  return (
    <View style={styles.content}>
      <Text style={styles.note}>
        Push the detail screen and come back. With 'unmount', this screen is
        unmounted while inactive, so the counter resets.
      </Text>
      <Text style={styles.text}>
        Mounted at {mountedAt.toLocaleTimeString()}
      </Text>
      <Text style={styles.text}>Seconds since mount: {seconds}</Text>
      <Option
        label="Inactive behavior"
        choices={[
          { label: 'Pause', value: 'pause' },
          { label: 'Unmount', value: 'unmount' },
          { label: 'None', value: 'none' },
        ]}
        value={behavior}
        onValueChange={setBehavior}
      />
      <Button
        variant="filled"
        onPress={() => navigation.push('NativeStackNextDetail')}
        style={styles.button}
      >
        Push detail
      </Button>
    </View>
  );
};

const DetailScreen = () => {
  const navigation = useNavigation('NativeStackNextDetail');

  return (
    <View style={styles.content}>
      <Button
        variant="tinted"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </View>
  );
};

const EventsScreen = () => {
  const navigation = useNavigation('NativeStackNextEvents');
  const [log, setLog] = React.useState<string[]>([]);
  const eventCount = React.useRef(0);

  React.useEffect(() => {
    const append = (entry: string) => {
      eventCount.current += 1;
      setLog((log) => [...log.slice(-7), `${eventCount.current}. ${entry}`]);
    };

    const unsubscribers = [
      navigation.addListener('transitionStart', (e) => {
        append(`transitionStart · closing: ${e.data.closing}`);
      }),
      navigation.addListener('transitionEnd', (e) => {
        append(`transitionEnd · closing: ${e.data.closing}`);
      }),
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [navigation]);

  return (
    <View style={styles.content}>
      <Text style={styles.note}>
        Transition events received by this screen:
      </Text>
      {log.map((entry) => (
        <Text key={entry} style={styles.logEntry}>
          {entry}
        </Text>
      ))}
      <Button
        variant="filled"
        onPress={() => navigation.push('NativeStackNextEvents')}
        style={styles.button}
      >
        Push another copy
      </Button>
      <Button
        variant="tinted"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </View>
  );
};

const PreloadedScreen = () => {
  const navigation = useNavigation('NativeStackNextPreloaded');
  const route = useRoute('NativeStackNextPreloaded');

  const [isPreloaded] = React.useState(
    useNavigationState('NativeStackNextPreloaded', (state) => {
      const index = state.routes.findIndex((r) => r.key === route.key);

      return (
        index > state.index && !state.retainedRouteKeys.includes(route.key)
      );
    })
  );

  const isRetained = useNavigationState('NativeStackNextPreloaded', (state) =>
    state.retainedRouteKeys.includes(route.key)
  );

  const [loadingCountdown, setLoadingCountdown] = React.useState(3);

  React.useEffect(() => {
    if (loadingCountdown === 0) {
      return;
    }

    const timer = setTimeout(
      () => setLoadingCountdown(loadingCountdown - 1),
      1000
    );

    return () => clearTimeout(timer);
  }, [loadingCountdown]);

  return (
    <View style={styles.content}>
      <Text style={[styles.text, styles.countdown]}>
        {loadingCountdown > 0 && loadingCountdown}
      </Text>
      <Text style={styles.text}>
        {loadingCountdown === 0 ? 'Loaded!' : 'Loading...'}
      </Text>
      <Text style={styles.text}>{isPreloaded ? 'Preloaded' : 'Fresh'}</Text>
      <Text style={styles.text}>
        {isRetained ? 'Retained' : 'Not retained'}
      </Text>
      <Button
        variant="filled"
        onPress={() => navigation.retain(isRetained ? false : true)}
        style={styles.button}
      >
        {isRetained ? 'Unretain' : 'Retain'}
      </Button>
      <Button
        variant="tinted"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </View>
  );
};

const NativeStackNextNavigator = createNativeStackNavigator({
  screens: {
    NativeStackNextHome: createNativeStackScreen({
      screen: HomeScreen,
      options: {
        title: 'Next stack',
      },
      linking: '',
    }),
    NativeStackNextTitles: createNativeStackScreen({
      screen: TitlesScreen,
      options: {
        title: 'Titles',
      },
      linking: 'titles',
    }),
    NativeStackNextCustomHeader: createNativeStackScreen({
      screen: CustomHeaderScreen,
      options: {
        title: 'Custom header',
      },
      linking: 'custom-header',
    }),
    NativeStackNextHeaderAppearance: createNativeStackScreen({
      screen: HeaderAppearanceScreen,
      options: {
        title: 'Header appearance',
        headerTintColor: 'white',
        headerBackground: () => (
          <Image
            source={require('../../assets/misc/cpu.jpg')}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
        ),
        contentStyle: {
          backgroundColor: 'rgba(255, 99, 71, 0.08)',
        },
      },
      linking: 'header-appearance',
    }),
    NativeStackNextHeaderButtons: createNativeStackScreen({
      screen: HeaderButtonsScreen,
      options: {
        title: 'Header buttons',
        headerTintColor: 'mediumseagreen',
      },
      linking: 'header-buttons',
    }),
    NativeStackNextHeaderItems: createNativeStackScreen({
      screen: HeaderItemsScreen,
      options: {
        title: 'Header items',
      },
      linking: 'header-items',
    }),
    NativeStackNextAppBar: createNativeStackScreen({
      screen: AppBarScreen,
      options: {
        title: 'App bar',
      },
      linking: 'app-bar',
    }),
    NativeStackNextToolbarMenu: createNativeStackScreen({
      screen: ToolbarMenuScreen,
      options: {
        title: 'Toolbar menu',
      },
      linking: 'toolbar-menu',
    }),
    NativeStackNextSheets: createNativeStackScreen({
      screen: SheetsScreen,
      options: {
        title: 'Form sheets',
      },
      linking: 'sheets',
    }),
    NativeStackNextSheet: createNativeStackScreen({
      screen: SheetScreen,
      options: ({ route }) => ({
        presentation: 'formSheet',
        headerShown: false,
        ...SHEET_PRESETS[route.params.preset].options,
      }),
    }),
    NativeStackNextPreventRemove: createNativeStackScreen({
      screen: PreventRemoveScreen,
      options: {
        title: 'Prevent remove',
      },
      linking: 'prevent-remove',
    }),
    NativeStackNextActivityStates: createNativeStackScreen({
      screen: ActivityStatesScreen,
      options: {
        title: 'Activity states',
      },
      linking: 'activity-states',
    }),
    NativeStackNextDetail: createNativeStackScreen({
      screen: DetailScreen,
      options: {
        title: 'Detail',
      },
      linking: 'detail',
    }),
    NativeStackNextEvents: createNativeStackScreen({
      screen: EventsScreen,
      options: {
        title: 'Transition events',
      },
      linking: 'events',
    }),
    NativeStackNextPreloaded: createNativeStackScreen({
      screen: PreloadedScreen,
      options: {
        title: 'Preloaded screen',
      },
      linking: 'preloaded',
    }),
  },
});

export const NativeStackNext = {
  screen: NativeStackNextNavigator,
  title: 'Native Stack - Next',
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  button: {
    margin: 8,
  },
  controls: {
    gap: 12,
    padding: 16,
    alignItems: 'center',
  },
  option: {
    gap: 4,
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 13,
    opacity: 0.6,
  },
  note: {
    textAlign: 'center',
    opacity: 0.6,
    margin: 8,
  },
  text: {
    textAlign: 'center',
    margin: 8,
  },
  countdown: {
    fontSize: 24,
    minHeight: 32,
  },
  customTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  subtitleText: {
    fontSize: 12,
    opacity: 0.6,
  },
  logEntry: {
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    marginVertical: 2,
    opacity: 0.8,
  },
  input: {
    padding: 12,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    margin: 8,
  },
  paragraph: {
    margin: 8,
  },
  sheetContent: {
    padding: 16,
    paddingTop: 24,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    margin: 8,
  },
});
