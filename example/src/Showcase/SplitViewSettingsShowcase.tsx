import { Text } from '@react-navigation/elements';
import {
  SFSymbol,
  type SFSymbolProps,
  type StaticScreenProps,
  useTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

type SettingsRow = {
  label: string;
  value: string;
  symbol: SymbolName;
};

type SettingsSection = {
  title: string;
  items: SettingsRow[];
};

type SettingsCategoryId =
  | 'general'
  | 'appearance'
  | 'notifications'
  | 'privacy'
  | 'accessibility';

type SettingsCategory = {
  id: SettingsCategoryId;
  title: string;
  symbol: SymbolName;
  actionTitle: string;
  overviewSections: SettingsSection[];
  detailSections: SettingsSection[];
};

const BORDER_WIDTH = StyleSheet.hairlineWidth;
const ACCENT = '#0A84FF';
const ACCENT_SOFT = '#0A84FF18';

const SPACE_XS = 4;
const SPACE_S = 8;
const SPACE_M = 12;
const SPACE_L = 16;
const SPACE_XL = 20;
const SPACE_2XL = 24;

const RADIUS_S = 12;
const RADIUS_L = 20;

const ICON_SIZE = 18;
const ICON_SIZE_SMALL = 14;

const TEXT_SIZE_S = 13;
const TEXT_SIZE_M = 16;
const CONTROL_SIZE = 32;
const ROW_HEIGHT = 56;

const TEXT_LINE_HEIGHT = 21;

const SECONDARY_OPACITY = 0.62;
const FALLBACK_MAX_WIDTH = 320;

const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    id: 'general',
    title: 'General',
    symbol: 'gearshape.fill',
    actionTitle: 'About',
    overviewSections: [
      {
        title: 'Essentials',
        items: [
          {
            label: 'Software Update',
            value: 'Automatic',
            symbol: 'arrow.triangle.2.circlepath',
          },
          {
            label: 'AirDrop',
            value: 'Contacts Only',
            symbol: 'dot.radiowaves.left.and.right',
          },
          {
            label: 'AirPlay & Continuity',
            value: 'Nearby',
            symbol: 'airplayvideo',
          },
        ],
      },
      {
        title: 'Device',
        items: [
          {
            label: 'Keyboard',
            value: 'Hardware',
            symbol: 'keyboard',
          },
          {
            label: 'Trackpad',
            value: 'Natural',
            symbol: 'cursorarrow.motionlines',
          },
          {
            label: 'Storage',
            value: '128 GB',
            symbol: 'internaldrive.fill',
          },
        ],
      },
      {
        title: 'Connectivity',
        items: [
          {
            label: 'VPN & Device Management',
            value: 'None',
            symbol: 'lock.shield',
          },
          {
            label: 'Dictionary',
            value: '2 Languages',
            symbol: 'book.closed.fill',
          },
          {
            label: 'Fonts',
            value: '7 Installed',
            symbol: 'textformat.abc',
          },
        ],
      },
      {
        title: 'Accessories',
        items: [
          {
            label: 'Game Controller',
            value: 'Paired',
            symbol: 'gamecontroller.fill',
          },
          {
            label: 'Apple Pencil',
            value: 'Connected',
            symbol: 'pencil.tip',
          },
          {
            label: 'Trackpad Gestures',
            value: 'Enabled',
            symbol: 'hand.draw.fill',
          },
        ],
      },
    ],
    detailSections: [
      {
        title: 'Connected Features',
        items: [
          {
            label: 'Handoff',
            value: 'On',
            symbol: 'rectangle.on.rectangle',
          },
          {
            label: 'Sidecar',
            value: 'Available',
            symbol: 'ipad.and.arrow.forward',
          },
          {
            label: 'Background App Refresh',
            value: 'Wi-Fi',
            symbol: 'clock.arrow.circlepath',
          },
        ],
      },
      {
        title: 'Preferences',
        items: [
          {
            label: 'Date & Time',
            value: 'Automatic',
            symbol: 'calendar.badge.clock',
          },
          {
            label: 'Language',
            value: 'English',
            symbol: 'globe',
          },
          {
            label: 'VPN',
            value: 'Not Connected',
            symbol: 'lock.shield',
          },
        ],
      },
      {
        title: 'Regional',
        items: [
          {
            label: 'Region',
            value: 'United States',
            symbol: 'globe.americas.fill',
          },
          {
            label: 'Calendar',
            value: 'Gregorian',
            symbol: 'calendar',
          },
          {
            label: 'Temperature Unit',
            value: 'Fahrenheit',
            symbol: 'thermometer.medium',
          },
        ],
      },
      {
        title: 'Device Options',
        items: [
          {
            label: 'Picture in Picture',
            value: 'On',
            symbol: 'play.rectangle.on.rectangle.fill',
          },
          {
            label: 'Multitasking & Gestures',
            value: 'On',
            symbol: 'square.grid.3x1.folder.fill.badge.plus',
          },
          {
            label: 'Date Separator',
            value: 'Slash',
            symbol: 'number',
          },
        ],
      },
    ],
  },
  {
    id: 'appearance',
    title: 'Appearance',
    symbol: 'paintpalette.fill',
    actionTitle: 'Display & Brightness',
    overviewSections: [
      {
        title: 'Interface',
        items: [
          {
            label: 'Theme',
            value: 'Light',
            symbol: 'sun.max.fill',
          },
          {
            label: 'Accent Color',
            value: 'Blue',
            symbol: 'paintbrush.pointed.fill',
          },
          {
            label: 'Wallpaper',
            value: 'Gradient',
            symbol: 'photo.artframe',
          },
        ],
      },
      {
        title: 'Reading',
        items: [
          {
            label: 'Text Size',
            value: 'Default',
            symbol: 'textformat.size',
          },
          {
            label: 'Bold Text',
            value: 'Off',
            symbol: 'bold',
          },
          {
            label: 'Reduce Transparency',
            value: 'Off',
            symbol: 'square.stack.3d.down.right',
          },
        ],
      },
      {
        title: 'Home Screen',
        items: [
          {
            label: 'App Icons',
            value: 'Large',
            symbol: 'square.grid.2x2',
          },
          {
            label: 'Widgets',
            value: 'Tinted',
            symbol: 'square.grid.2x2.fill',
          },
          {
            label: 'Dock',
            value: 'Visible',
            symbol: 'rectangle.bottomthird.inset.filled',
          },
        ],
      },
      {
        title: 'Lock Screen',
        items: [
          {
            label: 'Wallpaper Pair',
            value: 'City',
            symbol: 'photo.fill.on.rectangle.fill',
          },
          {
            label: 'Depth Effect',
            value: 'On',
            symbol: 'square.3.layers.3d.top.filled',
          },
          {
            label: 'Auto-Lock',
            value: '2 Minutes',
            symbol: 'lock.display',
          },
        ],
      },
    ],
    detailSections: [
      {
        title: 'Display Style',
        items: [
          {
            label: 'Automatic Appearance',
            value: 'Off',
            symbol: 'sparkles',
          },
          {
            label: 'True Tone',
            value: 'On',
            symbol: 'circle.lefthalf.filled',
          },
          {
            label: 'Night Shift',
            value: 'Sunset to Sunrise',
            symbol: 'moon.stars.fill',
          },
        ],
      },
      {
        title: 'Layout',
        items: [
          {
            label: 'App Icon Size',
            value: 'Standard',
            symbol: 'square.grid.2x2.fill',
          },
          {
            label: 'Display Zoom',
            value: 'More Space',
            symbol: 'plus.magnifyingglass',
          },
          {
            label: 'Contrast',
            value: 'Standard',
            symbol: 'dial.low.fill',
          },
        ],
      },
      {
        title: 'Brightness',
        items: [
          {
            label: 'Auto-Brightness',
            value: 'On',
            symbol: 'sun.max',
          },
          {
            label: 'Raise to Wake',
            value: 'On',
            symbol: 'hand.raised.fill',
          },
          {
            label: 'Always-On Display',
            value: 'Off',
            symbol: 'display',
          },
        ],
      },
      {
        title: 'Text',
        items: [
          {
            label: 'Larger Text',
            value: 'Off',
            symbol: 'textformat.size.larger',
          },
          {
            label: 'Button Shapes',
            value: 'Off',
            symbol: 'capsule',
          },
          {
            label: 'On/Off Labels',
            value: 'Off',
            symbol: 'switch.2',
          },
        ],
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    symbol: 'bell.badge.fill',
    actionTitle: 'Notification Delivery',
    overviewSections: [
      {
        title: 'Delivery',
        items: [
          {
            label: 'Scheduled Summary',
            value: '7:00 PM',
            symbol: 'list.bullet.rectangle.portrait',
          },
          {
            label: 'Time Sensitive',
            value: 'Allowed',
            symbol: 'exclamationmark.bubble.fill',
          },
          {
            label: 'Previews',
            value: 'When Unlocked',
            symbol: 'eye.fill',
          },
        ],
      },
      {
        title: 'Focus',
        items: [
          {
            label: 'Work Focus',
            value: 'Active',
            symbol: 'briefcase.fill',
          },
          {
            label: 'Personal Focus',
            value: 'Ready',
            symbol: 'person.crop.circle.fill',
          },
          {
            label: 'Badge Count',
            value: 'Enabled',
            symbol: 'app.badge.fill',
          },
        ],
      },
      {
        title: 'Sounds',
        items: [
          {
            label: 'Lock Sound',
            value: 'On',
            symbol: 'lock.fill',
          },
          {
            label: 'Keyboard Clicks',
            value: 'Off',
            symbol: 'keyboard.fill',
          },
          {
            label: 'Haptics',
            value: 'Always Play',
            symbol: 'waveform.path',
          },
        ],
      },
      {
        title: 'Apps',
        items: [
          {
            label: 'Messages',
            value: 'Enabled',
            symbol: 'message.fill',
          },
          {
            label: 'Mail',
            value: 'Scheduled',
            symbol: 'envelope.fill',
          },
          {
            label: 'Calendar',
            value: 'Time Sensitive',
            symbol: 'calendar.badge.exclamationmark',
          },
        ],
      },
    ],
    detailSections: [
      {
        title: 'Alert Style',
        items: [
          {
            label: 'Banners',
            value: 'Persistent',
            symbol: 'rectangle.topthird.inset.filled',
          },
          {
            label: 'Sounds',
            value: 'Reflection',
            symbol: 'speaker.wave.2.fill',
          },
          {
            label: 'Critical Alerts',
            value: 'Available',
            symbol: 'alarm.fill',
          },
        ],
      },
      {
        title: 'Filtering',
        items: [
          {
            label: 'Mute Unknown Senders',
            value: 'On',
            symbol: 'person.crop.circle.badge.xmark',
          },
          {
            label: 'Preview Grouping',
            value: 'By App',
            symbol: 'square.split.2x1.fill',
          },
          {
            label: 'Emergency Bypass',
            value: 'Favorites',
            symbol: 'star.circle.fill',
          },
        ],
      },
      {
        title: 'Grouping',
        items: [
          {
            label: 'Notification Center',
            value: 'Most Recent',
            symbol: 'clock.fill',
          },
          {
            label: 'Lock Screen',
            value: 'Count',
            symbol: 'rectangle.stack.fill',
          },
          {
            label: 'CarPlay',
            value: 'Mirror iPhone',
            symbol: 'car.fill',
          },
        ],
      },
      {
        title: 'Delivery Options',
        items: [
          {
            label: 'Announce Notifications',
            value: 'Headphones',
            symbol: 'airpodsmax',
          },
          {
            label: 'Show Previews',
            value: 'Always',
            symbol: 'text.bubble.fill',
          },
          {
            label: 'Screen Sharing',
            value: 'Hide Alerts',
            symbol: 'rectangle.on.rectangle',
          },
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    symbol: 'hand.raised.fill',
    actionTitle: 'App Privacy Report',
    overviewSections: [
      {
        title: 'Permissions',
        items: [
          {
            label: 'Location Services',
            value: 'While Using',
            symbol: 'location.fill',
          },
          {
            label: 'Contacts',
            value: 'Selected Apps',
            symbol: 'person.2.fill',
          },
          {
            label: 'Photos',
            value: 'Limited',
            symbol: 'photo.stack.fill',
          },
        ],
      },
      {
        title: 'Security',
        items: [
          {
            label: 'Passcode',
            value: 'Required',
            symbol: 'lock.fill',
          },
          {
            label: 'Face ID',
            value: 'Enabled',
            symbol: 'faceid',
          },
          {
            label: 'Safety Check',
            value: 'Up to Date',
            symbol: 'checkmark.shield.fill',
          },
        ],
      },
      {
        title: 'Sensors',
        items: [
          {
            label: 'Bluetooth',
            value: '6 Apps',
            symbol: 'dot.radiowaves.left.and.right',
          },
          {
            label: 'Local Network',
            value: '4 Apps',
            symbol: 'network',
          },
          {
            label: 'Motion & Fitness',
            value: '2 Apps',
            symbol: 'figure.run',
          },
        ],
      },
      {
        title: 'System Services',
        items: [
          {
            label: 'Analytics',
            value: 'Shared',
            symbol: 'chart.bar.xaxis',
          },
          {
            label: 'Significant Locations',
            value: 'On',
            symbol: 'map.fill',
          },
          {
            label: 'Device Check',
            value: 'Available',
            symbol: 'checkmark.seal.fill',
          },
        ],
      },
    ],
    detailSections: [
      {
        title: 'App Access',
        items: [
          {
            label: 'Microphone',
            value: '3 Apps',
            symbol: 'mic.fill',
          },
          {
            label: 'Camera',
            value: '2 Apps',
            symbol: 'camera.fill',
          },
          {
            label: 'Calendars',
            value: '1 App',
            symbol: 'calendar',
          },
        ],
      },
      {
        title: 'Protection',
        items: [
          {
            label: 'Lockdown Mode',
            value: 'Off',
            symbol: 'shield.lefthalf.filled.badge.checkmark',
          },
          {
            label: 'Tracking Requests',
            value: 'Denied',
            symbol: 'hand.raised.slash.fill',
          },
          {
            label: 'Security Recommendations',
            value: 'No Action Needed',
            symbol: 'key.fill',
          },
        ],
      },
      {
        title: 'Permissions History',
        items: [
          {
            label: 'Location Access',
            value: 'Last 7 Days',
            symbol: 'clock.arrow.circlepath',
          },
          {
            label: 'Camera Access',
            value: '2 Apps',
            symbol: 'camera.aperture',
          },
          {
            label: 'Microphone Access',
            value: '3 Apps',
            symbol: 'mic.circle.fill',
          },
        ],
      },
      {
        title: 'Privacy Controls',
        items: [
          {
            label: 'Mail Privacy Protection',
            value: 'On',
            symbol: 'envelope.badge.shield.half.filled',
          },
          {
            label: 'Private Relay',
            value: 'Subscribed',
            symbol: 'icloud.slash.fill',
          },
          {
            label: 'Hide My Email',
            value: 'Available',
            symbol: 'at.circle.fill',
          },
        ],
      },
    ],
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    symbol: 'figure.roll',
    actionTitle: 'Accessibility Shortcut',
    overviewSections: [
      {
        title: 'Vision',
        items: [
          {
            label: 'VoiceOver',
            value: 'Off',
            symbol: 'speaker.wave.3.fill',
          },
          {
            label: 'Display & Text Size',
            value: 'Configured',
            symbol: 'textformat',
          },
          {
            label: 'Motion',
            value: 'Standard',
            symbol: 'figure.walk.motion',
          },
        ],
      },
      {
        title: 'Interaction',
        items: [
          {
            label: 'Touch Accommodations',
            value: 'Off',
            symbol: 'hand.tap.fill',
          },
          {
            label: 'Spoken Content',
            value: 'On Demand',
            symbol: 'quote.bubble.fill',
          },
          {
            label: 'Keyboard Access',
            value: 'Ready',
            symbol: 'command',
          },
        ],
      },
      {
        title: 'Hearing',
        items: [
          {
            label: 'Headphone Accommodations',
            value: 'Off',
            symbol: 'earbuds',
          },
          {
            label: 'Sound Recognition',
            value: 'On',
            symbol: 'waveform.circle.fill',
          },
          {
            label: 'Subtitles & Captioning',
            value: 'Style 1',
            symbol: 'captions.bubble.fill',
          },
        ],
      },
      {
        title: 'General',
        items: [
          {
            label: 'Guided Access',
            value: 'Off',
            symbol: 'lock.square.fill',
          },
          {
            label: 'Per-App Settings',
            value: '2 Apps',
            symbol: 'app.badge.checkmark',
          },
          {
            label: 'Accessibility Shortcut',
            value: 'Configured',
            symbol: 'figure.wave',
          },
        ],
      },
    ],
    detailSections: [
      {
        title: 'Support Features',
        items: [
          {
            label: 'Reduce Motion',
            value: 'Off',
            symbol: 'tortoise.fill',
          },
          {
            label: 'Differentiate Without Color',
            value: 'Off',
            symbol: 'paintpalette',
          },
          {
            label: 'Sound Recognition',
            value: 'On',
            symbol: 'ear.fill',
          },
        ],
      },
      {
        title: 'Input',
        items: [
          {
            label: 'Switch Control',
            value: 'Off',
            symbol: 'switch.2',
          },
          {
            label: 'AssistiveTouch',
            value: 'Off',
            symbol: 'circle.grid.cross.fill',
          },
          {
            label: 'Live Speech',
            value: 'Available',
            symbol: 'waveform.badge.mic',
          },
        ],
      },
      {
        title: 'Audio',
        items: [
          {
            label: 'Mono Audio',
            value: 'Off',
            symbol: 'speaker.wave.2.fill',
          },
          {
            label: 'Background Sounds',
            value: 'Rain',
            symbol: 'cloud.rain.fill',
          },
          {
            label: 'Live Captions',
            value: 'On',
            symbol: 'captions.bubble',
          },
        ],
      },
      {
        title: 'Display',
        items: [
          {
            label: 'Smart Invert',
            value: 'Off',
            symbol: 'circle.righthalf.filled',
          },
          {
            label: 'Reduce White Point',
            value: 'Off',
            symbol: 'circle.hexagongrid.fill',
          },
          {
            label: 'Auto-Play Video Previews',
            value: 'On',
            symbol: 'play.tv.fill',
          },
        ],
      },
    ],
  },
];

type SettingsStackParamList = {
  Overview: undefined;
  GeneralDetails: undefined;
  AppearanceDetails: undefined;
  NotificationsDetails: undefined;
  PrivacyDetails: undefined;
  AccessibilityDetails: undefined;
};

const DETAILS_ROUTE_NAMES = {
  general: 'GeneralDetails',
  appearance: 'AppearanceDetails',
  notifications: 'NotificationsDetails',
  privacy: 'PrivacyDetails',
  accessibility: 'AccessibilityDetails',
} as const;

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function SettingsSidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: {
  categories: SettingsCategory[];
  selectedCategoryId: SettingsCategoryId;
  onSelectCategory: (categoryId: SettingsCategoryId) => void;
}) {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.sidebarContent}
    >
      <View style={styles.sidebarList}>
        {categories.map((category) => {
          const selected = category.id === selectedCategoryId;

          return (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              onPress={() => onSelectCategory(category.id)}
              style={[
                styles.sidebarItem,
                selected && { backgroundColor: ACCENT_SOFT },
              ]}
            >
              <View
                style={[
                  styles.sidebarIcon,
                  {
                    backgroundColor: selected ? ACCENT : ACCENT_SOFT,
                  },
                ]}
              >
                <SFSymbol
                  name={category.symbol}
                  size={ICON_SIZE}
                  color={selected ? '#FFFFFF' : ACCENT}
                />
              </View>
              <Text
                style={[
                  styles.sidebarTitle,
                  { color: selected ? ACCENT : colors.text },
                ]}
              >
                {category.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function SettingsOverviewScreen({
  category,
  onOpenDetails,
}: {
  category: SettingsCategory;
  onOpenDetails: () => void;
}) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.secondaryContent}>
        <SettingsActionCard category={category} onPress={onOpenDetails} />

        {category.overviewSections.map((section) => (
          <SettingsSectionCard
            key={section.title}
            title={section.title}
            items={section.items}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function SettingsActionCard({
  category,
  onPress,
}: {
  category: SettingsCategory;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <SettingsCard>
        <View style={styles.row}>
          <View style={styles.rowLeading}>
            <View
              style={[
                styles.rowIcon,
                styles.rowIconBackground,
                { backgroundColor: ACCENT_SOFT },
              ]}
            >
              <SFSymbol
                name={category.symbol}
                size={ICON_SIZE}
                color={ACCENT}
              />
            </View>
            <Text style={[styles.rowLabel, { color: colors.text }]}>
              {category.actionTitle}
            </Text>
          </View>
          <SFSymbol
            name="chevron.right"
            size={ICON_SIZE_SMALL}
            color={colors.text}
          />
        </View>
      </SettingsCard>
    </Pressable>
  );
}

function SettingsDetailsScreen({ category }: { category: SettingsCategory }) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.secondaryContent}>
        {category.detailSections.map((section) => (
          <SettingsSectionCard
            key={section.title}
            title={section.title}
            items={section.items}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
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

function SettingsSectionCard({
  title,
  items,
}: {
  title: string;
  items: SettingsRow[];
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.sectionBlock}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <SettingsCard>
        {items.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.row,
              index > 0 && {
                borderTopColor: colors.border,
                borderTopWidth: BORDER_WIDTH,
              },
            ]}
          >
            <View style={styles.rowLeading}>
              <View style={styles.rowIcon}>
                <SFSymbol name={item.symbol} size={ICON_SIZE} color={ACCENT} />
              </View>
              <Text style={[styles.rowLabel, { color: colors.text }]}>
                {item.label}
              </Text>
            </View>
            <Text style={[styles.rowValue, { color: colors.text }]}>
              {item.value}
            </Text>
          </View>
        ))}
      </SettingsCard>
    </View>
  );
}

export function SplitViewSettingsShowcase(_: StaticScreenProps<{}>) {
  const { colors } = useTheme();
  const splitRef = React.useRef<SplitHostCommands>(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(
    SETTINGS_CATEGORIES[0].id
  );

  const selectCategory = (categoryId: SettingsCategoryId) => {
    setSelectedCategoryId(categoryId);
    splitRef.current?.show('secondary');
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
    <Split.Host ref={splitRef}>
      <Split.Column>
        <SettingsSidebar
          categories={SETTINGS_CATEGORIES}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={selectCategory}
        />
      </Split.Column>
      <Split.Column>
        <SettingsStack.Navigator
          screenLayout={({ children }) => (
            <SafeAreaView edges={{ left: true, right: true }}>
              {children}
            </SafeAreaView>
          )}
          screenOptions={{
            headerBackButtonDisplayMode: 'minimal',
            headerTransparent: true,
            animationTypeForReplace: 'pop',
          }}
        >
          {SETTINGS_CATEGORIES.map((category) => {
            if (category.id !== selectedCategoryId) {
              return null;
            }

            return (
              <React.Fragment key={category.id}>
                <SettingsStack.Screen
                  name="Overview"
                  options={{ title: category.title }}
                >
                  {({ navigation }) => (
                    <SettingsOverviewScreen
                      category={category}
                      onOpenDetails={() =>
                        navigation.navigate(DETAILS_ROUTE_NAMES[category.id])
                      }
                    />
                  )}
                </SettingsStack.Screen>
                <SettingsStack.Screen
                  name={DETAILS_ROUTE_NAMES[category.id]}
                  options={{ title: category.actionTitle }}
                >
                  {() => <SettingsDetailsScreen category={category} />}
                </SettingsStack.Screen>
              </React.Fragment>
            );
          })}
        </SettingsStack.Navigator>
      </Split.Column>
    </Split.Host>
  );
}

SplitViewSettingsShowcase.title = 'Showcase - Split View Settings';
SplitViewSettingsShowcase.linking = undefined;

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
  sidebarItem: {
    minHeight: ROW_HEIGHT,
    borderRadius: RADIUS_L,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE_M,
    paddingHorizontal: SPACE_M,
    paddingVertical: SPACE_S,
  },
  sidebarIcon: {
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
    borderRadius: RADIUS_S,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarTitle: {
    flex: 1,
    fontSize: TEXT_SIZE_M,
    fontWeight: '600',
  },
  secondaryContent: {
    padding: SPACE_XL,
    gap: SPACE_XL,
  },
  sectionBlock: {
    gap: SPACE_S,
  },
  sectionTitle: {
    fontSize: TEXT_SIZE_S,
    fontWeight: '600',
    opacity: SECONDARY_OPACITY,
    textTransform: 'uppercase',
    paddingHorizontal: SPACE_XS,
  },
  card: {
    borderWidth: BORDER_WIDTH,
    borderRadius: RADIUS_L,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  row: {
    minHeight: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACE_M,
    paddingHorizontal: SPACE_L,
    paddingVertical: SPACE_M,
  },
  rowLeading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE_M,
  },
  rowIcon: {
    width: ICON_SIZE,
    alignItems: 'center',
  },
  rowIconBackground: {
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
    borderRadius: RADIUS_S,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: TEXT_SIZE_M,
  },
  rowValue: {
    fontSize: TEXT_SIZE_M,
    fontWeight: '500',
    opacity: SECONDARY_OPACITY,
  },
});
