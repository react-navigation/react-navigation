import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, HeaderButton, Text } from '@react-navigation/elements';
import {
  type StaticScreenProps,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
  type NativeStackHeaderItem,
} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Alert,
  type DimensionValue,
  FlatList,
  Image,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import banff from '../../assets/places/banff.jpg';
import craterLake from '../../assets/places/crater-lake.jpg';
import grandCanyon from '../../assets/places/grand-canyon.jpg';
import lakeTahoe from '../../assets/places/lake-tahoe.jpg';
import redwood from '../../assets/places/redwood.jpg';
import yellowstone from '../../assets/places/yellowstone.jpg';
import yosemite from '../../assets/places/yosemite.jpg';
import zion from '../../assets/places/zion.jpg';

const SPACING_XS = 4;
const SPACING_S = 8;
const SPACING_SM = 10;
const SPACING_M = 12;
const SPACING_L = 20;

const BORDER_RADIUS_S = 8;
const BORDER_RADIUS_M = 12;
const SECONDARY_OPACITY = 0.6;
const RATING_COLOR = '#FF9500';

const THUMBNAIL_SIZE = 64;
const PIN_DOT_SIZE = 14;
const PIN_RING_SIZE = 32;

type Place = {
  id: string;
  name: string;
  category: string;
  address: string;
  description: string;
  rating: number;
  image: ImageSourcePropType;
};

const PLACES: Place[] = [
  {
    id: '1',
    name: 'Lake Tahoe',
    category: 'Lake',
    address: 'Sierra Nevada, CA/NV',
    description:
      'Crystal-clear alpine lake nestled in the Sierra Nevada mountains, offering pristine beaches, hiking trails, and breathtaking panoramic views.',
    rating: 4.8,
    image: lakeTahoe,
  },
  {
    id: '2',
    name: 'Yosemite Valley',
    category: 'National Park',
    address: 'Yosemite National Park, CA',
    description:
      'Glacier-carved valley famous for towering granite cliffs, waterfalls, giant sequoias, and sweeping meadows surrounded by ancient peaks.',
    rating: 4.9,
    image: yosemite,
  },
  {
    id: '3',
    name: 'Redwood Forest',
    category: 'Forest',
    address: 'Redwood National Park, CA',
    description:
      'Home to the tallest trees on Earth, these ancient coastal redwood groves create a cathedral-like canopy filtering soft light onto fern-covered trails.',
    rating: 4.7,
    image: redwood,
  },
  {
    id: '4',
    name: 'Grand Canyon',
    category: 'Canyon',
    address: 'Grand Canyon National Park, AZ',
    description:
      'A mile-deep gorge carved by the Colorado River over millions of years, revealing colorful layers of geological history across vast desert landscapes.',
    rating: 4.9,
    image: grandCanyon,
  },
  {
    id: '5',
    name: 'Yellowstone',
    category: 'National Park',
    address: 'Yellowstone National Park, WY',
    description:
      "The world's first national park, featuring dramatic geothermal features, hot springs, geysers, and abundant wildlife roaming vast open valleys.",
    rating: 4.8,
    image: yellowstone,
  },
  {
    id: '6',
    name: 'Zion Narrows',
    category: 'Canyon',
    address: 'Zion National Park, UT',
    description:
      'Towering sandstone cliffs in brilliant shades of red and orange rise above the Virgin River, creating one of the most stunning slot canyons.',
    rating: 4.7,
    image: zion,
  },
  {
    id: '7',
    name: 'Lake Louise',
    category: 'Lake',
    address: 'Banff National Park, AB',
    description:
      'Turquoise glacial lake surrounded by towering peaks and dense forest in the Canadian Rockies, known for its stunning reflections and alpine scenery.',
    rating: 4.8,
    image: banff,
  },
  {
    id: '8',
    name: 'Crater Lake',
    category: 'Lake',
    address: 'Crater Lake National Park, OR',
    description:
      'The deepest lake in the United States, formed in the caldera of an ancient volcano, renowned for its remarkably vivid blue color and Wizard Island.',
    rating: 4.6,
    image: craterLake,
  },
  {
    id: '9',
    name: 'Glacier National Park',
    category: 'National Park',
    address: 'Glacier National Park, MT',
    description:
      'Over a million acres of pristine wilderness with glacially carved peaks, alpine meadows, and the iconic Going-to-the-Sun Road winding through the Continental Divide.',
    rating: 4.8,
    image: banff,
  },
  {
    id: '10',
    name: 'Antelope Canyon',
    category: 'Canyon',
    address: 'Page, AZ',
    description:
      'A mesmerizing slot canyon formed by flash floods and erosion, where narrow sandstone walls swirl in brilliant shades of orange, red, and purple as light filters from above.',
    rating: 4.7,
    image: grandCanyon,
  },
  {
    id: '11',
    name: 'Big Sur',
    category: 'Coastline',
    address: 'Big Sur, CA',
    description:
      'A rugged stretch of California coastline where the Santa Lucia Mountains rise dramatically from the Pacific Ocean, offering breathtaking cliffs, redwood groves, and secluded beaches.',
    rating: 4.8,
    image: redwood,
  },
];

type Road = {
  top?: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
  bottom?: DimensionValue;
  width?: DimensionValue;
  height?: DimensionValue;
  rotate: string;
};

const MAP_ROADS: Road[] = [
  { top: '20%', left: 0, right: 0, height: 2, rotate: '0deg' },
  { top: '45%', left: 0, right: 0, height: 2, rotate: '0deg' },
  { top: '70%', left: 0, right: 0, height: 2, rotate: '0deg' },
  { top: 0, bottom: 0, left: '25%', width: 2, rotate: '0deg' },
  { top: 0, bottom: 0, left: '60%', width: 2, rotate: '0deg' },
  { top: 0, bottom: 0, left: '85%', width: 2, rotate: '0deg' },
  { top: '10%', left: '5%', width: 200, height: 2, rotate: '35deg' },
  { top: '55%', left: '40%', width: 250, height: 2, rotate: '-20deg' },
];

type Landmark = {
  top: DimensionValue;
  left: DimensionValue;
  size: number;
};

const MAP_LANDMARKS: Landmark[] = [
  { top: '15%', left: '30%', size: 8 },
  { top: '25%', left: '70%', size: 6 },
  { top: '38%', left: '15%', size: 10 },
  { top: '52%', left: '50%', size: 7 },
  { top: '60%', left: '80%', size: 9 },
  { top: '75%', left: '35%', size: 6 },
  { top: '82%', left: '65%', size: 8 },
];

const DETAIL_INFO = [
  { label: 'Best Season', value: 'Spring - Fall' },
  { label: 'Difficulty', value: 'Moderate' },
  { label: 'Duration', value: '2-4 hours' },
];

const MapScreen = () => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation('Map');
  const place = PLACES[0];

  return (
    <View style={[styles.mapContainer, { backgroundColor: colors.card }]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.primary, opacity: 0.08 },
        ]}
      />
      {MAP_ROADS.map((road, i) => (
        <View
          key={`road-${String(i)}`}
          style={[
            styles.absolute,
            { backgroundColor: colors.border, opacity: 0.15 },
            {
              top: road.top,
              left: road.left,
              right: road.right,
              bottom: road.bottom,
              height: road.height,
              width: road.width,
            },
            road.rotate !== '0deg' && { transform: [{ rotate: road.rotate }] },
          ]}
        />
      ))}

      {MAP_LANDMARKS.map((lm, i) => (
        <View
          key={`lm-${String(i)}`}
          style={[
            styles.absolute,
            {
              top: lm.top,
              left: lm.left,
              width: lm.size,
              height: lm.size,
              borderRadius: lm.size / 2,
              backgroundColor: colors.text,
              opacity: 0.1,
            },
          ]}
        />
      ))}

      <Pressable
        style={styles.pinContainer}
        onPress={() =>
          navigation.navigate('LocationDetails', { placeId: place.id })
        }
      >
        <View style={[styles.pinDot, { backgroundColor: colors.primary }]} />
        <View style={[styles.pinRing, { borderColor: colors.primary }]} />
        <Text
          style={[
            styles.pinLabel,
            fonts.bold,
            { color: colors.text, backgroundColor: colors.card },
          ]}
          numberOfLines={1}
        >
          {place.name}
        </Text>
      </Pressable>
    </View>
  );
};

const PlaceItem = React.memo(({ item }: { item: Place }) => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation('Places');

  return (
    <Pressable style={styles.placeItem} onPress={() => navigation.goBack()}>
      <Image source={item.image} style={styles.placeImage} />

      <View style={styles.placeInfo}>
        <Text style={[styles.placeName, fonts.bold]} numberOfLines={1}>
          {item.name}
        </Text>

        <Text
          style={[styles.caption, fonts.medium, { color: colors.primary }]}
          numberOfLines={1}
        >
          {item.category}
        </Text>

        <Text
          style={[styles.caption, { opacity: SECONDARY_OPACITY }]}
          numberOfLines={1}
        >
          {item.address}
        </Text>
      </View>

      <Text style={[styles.placeRating, fonts.medium, { color: colors.text }]}>
        {'★ '}
        {item.rating}
      </Text>
    </Pressable>
  );
});

PlaceItem.displayName = 'PlaceItem';

const ItemSeparator = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.separator, { backgroundColor: colors.border }]} />
  );
};

const PlacesScreen = () => {
  const navigation = useNavigation('Places');
  const [query, setQuery] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search places',
        onChange: (e: { nativeEvent: { text: string } }) => {
          setQuery(e.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  const data = React.useMemo(() => {
    if (!query) {
      return PLACES;
    }

    const q = query.toLowerCase();

    return PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentInsetAdjustmentBehavior="automatic"
      renderItem={({ item }) => <PlaceItem item={item} />}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

const LocationDetailsScreen = ({
  route,
}: StaticScreenProps<{ placeId: string }>) => {
  const { colors, fonts } = useTheme();
  const place = PLACES.find((p) => p.id === route.params.placeId) ?? PLACES[0];

  return (
    <ScrollView
      style={{ backgroundColor: colors.card }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.detailsContent}
    >
      <View style={styles.detailsHeader}>
        <Text style={[styles.detailsName, fonts.heavy]}>{place.name}</Text>

        <View style={[styles.categoryPill, { backgroundColor: colors.border }]}>
          <Text style={[styles.caption, fonts.bold, { color: colors.primary }]}>
            {place.category}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRating}>
        <Text style={[styles.placeName, { color: RATING_COLOR }]}>
          {'★'.repeat(Math.round(place.rating))}
          {'☆'.repeat(5 - Math.round(place.rating))}
        </Text>
        <Text style={[styles.ratingText, { opacity: SECONDARY_OPACITY }]}>
          {place.rating} rating
        </Text>
      </View>

      <Text style={[styles.detailsText, { opacity: SECONDARY_OPACITY }]}>
        {place.address}
      </Text>

      <Image source={place.image} style={styles.detailsImage} />

      <Text style={styles.bodyText}>{place.description}</Text>

      <View style={styles.detailsInfoGrid}>
        {DETAIL_INFO.map((info) => (
          <View
            key={info.label}
            style={[
              styles.detailsInfoItem,
              { backgroundColor: colors.background },
            ]}
          >
            <Text
              style={[
                styles.detailsInfoLabel,
                fonts.medium,
                { opacity: SECONDARY_OPACITY },
              ]}
            >
              {info.label}
            </Text>
            <Text style={[styles.detailsText, fonts.bold]}>{info.value}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.detailsSection, { borderColor: colors.border }]}>
        <Text style={[styles.detailsSectionTitle, fonts.bold]}>About</Text>
        <Text style={[styles.bodyText, { opacity: 0.8 }]}>
          This location is managed by the National Park Service. Visitors are
          encouraged to follow Leave No Trace principles and stay on designated
          trails. Check current conditions before your visit as seasonal
          closures may apply.
        </Text>
      </View>

      <View style={styles.detailsButtons}>
        <Button
          variant="tinted"
          onPress={() => Alert.alert('Directions', `Navigate to ${place.name}`)}
        >
          Get Directions
        </Button>
      </View>
    </ScrollView>
  );
};

const NativeStackShowcaseNavigator = createNativeStackNavigator({
  screenOptions: {
    headerBackButtonDisplayMode: 'minimal',
  },
  screens: {
    Map: createNativeStackScreen({
      screen: MapScreen,
      options: ({ navigation }) => {
        const leftItems: NativeStackHeaderItem[] = [
          {
            type: 'button',
            label: 'Search',
            icon: { type: 'sfSymbol', name: 'chevron.backward' },
            onPress: () => navigation.goBack(),
          },
          {
            type: 'button',
            label: 'Location',
            icon: { type: 'sfSymbol', name: 'location' },
            onPress: () =>
              Alert.alert('Location', 'Centering on your location'),
          },
        ];

        const rightItems: NativeStackHeaderItem[] = [
          {
            type: 'button',
            label: 'Bookmark',
            icon: { type: 'sfSymbol', name: 'bookmark' },
            onPress: () => Alert.alert('Bookmark', 'Location bookmarked'),
          },
          {
            type: 'button',
            label: 'Places',
            icon: { type: 'sfSymbol', name: 'list.bullet' },
            onPress: () => navigation.navigate('Places'),
          },
          {
            type: 'menu',
            label: 'More',
            icon: { type: 'sfSymbol', name: 'ellipsis.circle' },
            menu: {
              title: 'Options',
              items: [
                {
                  type: 'action',
                  label: 'Share',
                  icon: {
                    type: 'sfSymbol',
                    name: 'square.and.arrow.up',
                  },
                  onPress: () => Alert.alert('Share', 'Sharing location'),
                },
                {
                  type: 'action',
                  label: 'Get Directions',
                  icon: {
                    type: 'sfSymbol',
                    name: 'arrow.triangle.turn.up.right.diamond',
                  },
                  onPress: () =>
                    Alert.alert('Directions', 'Opening directions'),
                },
                {
                  type: 'submenu',
                  label: 'Map Style',
                  icon: { type: 'sfSymbol', name: 'map' },
                  items: [
                    {
                      type: 'action',
                      label: 'Standard',
                      state: 'on',
                      onPress: () => Alert.alert('Map Style', 'Standard'),
                    },
                    {
                      type: 'action',
                      label: 'Satellite',
                      onPress: () => Alert.alert('Map Style', 'Satellite'),
                    },
                    {
                      type: 'action',
                      label: 'Hybrid',
                      onPress: () => Alert.alert('Map Style', 'Hybrid'),
                    },
                  ],
                },
                {
                  type: 'action',
                  label: 'Report Issue',
                  icon: {
                    type: 'sfSymbol',
                    name: 'exclamationmark.bubble',
                  },
                  destructive: true,
                  onPress: () => Alert.alert('Report', 'Report submitted'),
                },
              ],
            },
          },
        ];

        return {
          title: '',
          headerTransparent: true,
          headerLeft: ({ tintColor }) => (
            <HeaderButton
              onPress={() =>
                Alert.alert('Location', 'Centering on your location')
              }
            >
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={24}
                color={tintColor}
              />
            </HeaderButton>
          ),
          headerRight: ({ tintColor }) => (
            <HeaderButton onPress={() => navigation.navigate('Places')}>
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={24}
                color={tintColor}
              />
            </HeaderButton>
          ),
          unstable_headerLeftItems: () => leftItems,
          unstable_headerRightItems: () => rightItems,
        };
      },
    }),

    Places: createNativeStackScreen({
      screen: PlacesScreen,
      options: {
        title: 'Places',
        headerLargeTitleEnabled: true,
        headerLargeTitleShadowVisible: false,
      },
    }),

    LocationDetails: createNativeStackScreen({
      screen: LocationDetailsScreen,
      options: {
        title: 'Details',
        headerShown: false,
        presentation: 'formSheet',
        sheetAllowedDetents: [0.3, 0.65, 1],
        sheetInitialDetentIndex: 0,
        sheetGrabberVisible: true,
        sheetLargestUndimmedDetentIndex: 1,
      },
    }),
  },
});

export const NativeStackShowcase = {
  screen: NativeStackShowcaseNavigator,
  title: 'Showcase - Native Stack',
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  absolute: {
    position: 'absolute',
  },
  pinContainer: {
    position: 'absolute',
    top: '40%',
    left: '48%',
    alignItems: 'center',
  },
  pinDot: {
    width: PIN_DOT_SIZE,
    height: PIN_DOT_SIZE,
    borderRadius: PIN_DOT_SIZE / 2,
    borderCurve: 'continuous',
  },
  pinRing: {
    position: 'absolute',
    width: PIN_RING_SIZE,
    height: PIN_RING_SIZE,
    borderRadius: PIN_RING_SIZE / 2,
    borderCurve: 'continuous',
    borderWidth: 2,
    top: -(PIN_RING_SIZE - PIN_DOT_SIZE) / 2,
    opacity: 0.3,
  },
  pinLabel: {
    marginTop: 6,
    fontSize: 13,
    paddingHorizontal: SPACING_S,
    paddingVertical: SPACING_XS,
    borderRadius: BORDER_RADIUS_S,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING_M,
  },
  placeImage: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: BORDER_RADIUS_M,
    borderCurve: 'continuous',
  },
  placeInfo: {
    flex: 1,
    marginLeft: SPACING_M,
    gap: 2,
  },
  placeName: {
    fontSize: 16,
  },
  caption: {
    fontSize: 13,
  },
  placeRating: {
    fontSize: 14,
    marginLeft: SPACING_S,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: THUMBNAIL_SIZE + SPACING_M * 2,
  },
  detailsContent: {
    paddingTop: 28,
    paddingHorizontal: SPACING_L,
    paddingBottom: SPACING_L,
    gap: SPACING_M,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING_SM,
  },
  detailsName: {
    fontSize: 22,
    flexShrink: 1,
  },
  categoryPill: {
    paddingHorizontal: SPACING_SM,
    paddingVertical: SPACING_XS,
    borderRadius: BORDER_RADIUS_M,
    borderCurve: 'continuous',
  },
  detailsRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING_S,
  },
  ratingText: {
    fontSize: 14,
  },
  detailsText: {
    fontSize: 15,
  },
  detailsImage: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS_M,
    borderCurve: 'continuous',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  detailsInfoGrid: {
    flexDirection: 'row',
    gap: SPACING_SM,
  },
  detailsInfoItem: {
    flex: 1,
    padding: SPACING_M,
    borderRadius: BORDER_RADIUS_M,
    borderCurve: 'continuous',
    gap: SPACING_XS,
  },
  detailsInfoLabel: {
    fontSize: 12,
  },
  detailsSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: SPACING_M,
  },
  detailsSectionTitle: {
    fontSize: 17,
    marginBottom: 6,
  },
  detailsButtons: {
    gap: SPACING_S,
    paddingTop: SPACING_XS,
  },
});
