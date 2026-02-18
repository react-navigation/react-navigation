/* eslint-disable import-x/no-commonjs */
import { Button, Text } from '@react-navigation/elements';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
  ZoomSourceAnchor,
  ZoomSourceButton,
  ZoomTarget,
} from '@react-navigation/native-stack';
import {
  ImageBackground,
  type ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

type NativeStackZoomParamList = {
  Listings: undefined;
  ListingDetail: { listingId: string };
};

type Listing = {
  id: string;
  title: string;
  region: string;
  bestSeason: string;
  difficulty: string;
  tripLength: string;
  summary: string;
  image: ImageSourcePropType;
};

const LISTINGS: Listing[] = [
  {
    id: 'moraine-lake-sunrise',
    title: 'Moraine Lake Sunrise',
    region: 'Banff, Canada',
    bestSeason: 'June - September',
    difficulty: 'Easy',
    tripLength: '1-2 hours',
    summary:
      'Calm turquoise water with mirrored peaks, best photographed just after sunrise.',
    image: require('../../assets/images/garrett-parker.jpg'),
  },
  {
    id: 'alpine-ridge-traverse',
    title: 'Alpine Ridge Traverse',
    region: 'High Alps',
    bestSeason: 'December - March',
    difficulty: 'Hard',
    tripLength: '4-6 hours',
    summary:
      'Snowy ridgelines and steep faces with dramatic clouds, ideal for winter mountain shots.',
    image: require('../../assets/images/simon-fitall.jpg'),
  },
  {
    id: 'bamboo-canopy-walk',
    title: 'Bamboo Canopy Walk',
    region: 'Kyoto, Japan',
    bestSeason: 'March - May',
    difficulty: 'Easy',
    tripLength: '1 hour',
    summary:
      'Tall bamboo corridors with soft green light that works best in early morning.',
    image: require('../../assets/images/jason-ortego.jpg'),
  },
  {
    id: 'sandstone-canyon-curve',
    title: 'Sandstone Canyon Curve',
    region: 'Arizona, USA',
    bestSeason: 'April - October',
    difficulty: 'Moderate',
    tripLength: '2-3 hours',
    summary:
      'Layered canyon walls and curved formations that glow when midday light reaches inside.',
    image: require('../../assets/images/ashim-d-silva.jpg'),
  },
  {
    id: 'velvet-hills-panorama',
    title: 'Velvet Hills Panorama',
    region: 'Grassland Highlands',
    bestSeason: 'April - June',
    difficulty: 'Moderate',
    tripLength: '3-4 hours',
    summary:
      'Rolling green ridges with repeating lines, excellent for wide-angle landscape framing.',
    image: require('../../assets/images/qingbao-meng.jpg'),
  },
  {
    id: 'amber-forest-trail',
    title: 'Amber Forest Trail',
    region: 'Central Europe',
    bestSeason: 'September - November',
    difficulty: 'Easy',
    tripLength: '1-2 hours',
    summary:
      'Autumn forest with warm sunbeams between trunks, great for low-angle morning light.',
    image: require('../../assets/images/johannes-plenio.jpg'),
  },
  {
    id: 'violet-shore-sunset',
    title: 'Violet Shore Sunset',
    region: 'Tropical Coast',
    bestSeason: 'Year-round',
    difficulty: 'Easy',
    tripLength: '1 hour',
    summary:
      'Magenta dusk skies over shoreline surf, with the best color during blue hour.',
    image: require('../../assets/images/yousef-espanioly.jpg'),
  },
];

const ListingsScreen = ({
  navigation,
}: NativeStackScreenProps<NativeStackZoomParamList, 'Listings'>) => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.listContent}
    >
      {LISTINGS.map((listing) => (
        <ZoomSourceButton
          key={listing.id}
          id={listing.id}
          onPress={() =>
            navigation.navigate('ListingDetail', { listingId: listing.id })
          }
          style={styles.listItem}
        >
          <ZoomSourceAnchor style={styles.listCover}>
            <ImageBackground
              source={listing.image}
              resizeMode="cover"
              style={styles.listCoverImage}
              imageStyle={styles.coverImageStyle}
            >
              <View style={styles.coverOverlay} />
              <Text style={styles.listCoverLabel}>Explore</Text>
            </ImageBackground>
          </ZoomSourceAnchor>

          <Text style={styles.listTitle}>{listing.title}</Text>
          <Text style={styles.listMeta}>
            {listing.region} • {listing.difficulty} • {listing.tripLength}
          </Text>
          <Text style={styles.listPrice}>
            Best season: {listing.bestSeason}
          </Text>
        </ZoomSourceButton>
      ))}
    </ScrollView>
  );
};

const ListingDetailScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<NativeStackZoomParamList, 'ListingDetail'>) => {
  const listingIndex = LISTINGS.findIndex(
    (item) => item.id === route.params.listingId
  );
  const currentIndex = listingIndex >= 0 ? listingIndex : 0;
  const listing = LISTINGS[currentIndex];
  const nextListing = LISTINGS[(currentIndex + 1) % LISTINGS.length];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.detailContent}
    >
      <ZoomTarget id={listing.id} style={styles.detailCover}>
        <ImageBackground
          source={listing.image}
          resizeMode="cover"
          style={styles.detailCoverImage}
          imageStyle={styles.coverImageStyle}
        >
          <View style={styles.coverOverlay} />
          <Text style={styles.detailCoverBadge}>Featured Spot</Text>
          <Text style={styles.detailCoverTitle}>{listing.title}</Text>
          <Text style={styles.detailCoverMeta}>{listing.region}</Text>
        </ImageBackground>
      </ZoomTarget>

      <View style={styles.detailCard}>
        <Text style={styles.detailPrice}>
          Best season: {listing.bestSeason}
        </Text>
        <Text style={styles.detailSpecs}>
          {listing.difficulty} • {listing.tripLength}
        </Text>
        <Text style={styles.detailSummary}>{listing.summary}</Text>
      </View>

      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.goBack()}>
          Back to spots
        </Button>
        <Button
          variant="tinted"
          onPress={() =>
            navigation.replace('ListingDetail', {
              listingId: nextListing.id,
            })
          }
        >
          Next spot
        </Button>
      </View>
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator<NativeStackZoomParamList>();

export function NativeStackZoom() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Listings"
        component={ListingsScreen}
        options={{ title: 'Destinations' }}
      />
      <Stack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={{ title: 'Spot Details' }}
      />
    </Stack.Navigator>
  );
}

NativeStackZoom.title = 'Native Stack - Zoom Transition';
NativeStackZoom.linking = {};

const styles = StyleSheet.create({
  listContent: {
    padding: 10,
    gap: 10,
  },
  listItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  listCover: {
    borderRadius: 12,
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    backgroundColor: '#d1d5db',
  },
  listCoverImage: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  coverImageStyle: {
    borderRadius: 12,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  listCoverLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  listTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  listMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#4b5563',
  },
  listPrice: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  detailContent: {
    padding: 20,
    gap: 16,
  },
  detailCover: {
    borderRadius: 20,
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    backgroundColor: '#d1d5db',
  },
  detailCoverImage: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  detailCoverBadge: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  detailCoverTitle: {
    marginTop: 8,
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  detailCoverMeta: {
    marginTop: 6,
    color: '#ecfeff',
    fontSize: 14,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  detailPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  detailSpecs: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  detailSummary: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
  },
  buttons: {
    gap: 12,
    paddingBottom: 16,
  },
});
