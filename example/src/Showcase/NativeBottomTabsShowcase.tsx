import { Ionicons } from '@expo/vector-icons';
import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import { type Icon, Text } from '@react-navigation/elements';
import { useNavigation, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  FlatList,
  Image,
  type ImageSourcePropType,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';

import iconCirclePlay from '../../assets/icons/circle-play.png';
import iconLibrary from '../../assets/icons/library.png';
import iconRadioTower from '../../assets/icons/radio-tower.png';
import iconSearch from '../../assets/icons/search.png';
import cover01 from '../../assets/showcase/music/cover-01.jpg';
import cover02 from '../../assets/showcase/music/cover-02.jpg';
import cover03 from '../../assets/showcase/music/cover-03.jpg';
import cover04 from '../../assets/showcase/music/cover-04.jpg';
import cover05 from '../../assets/showcase/music/cover-05.jpg';
import cover06 from '../../assets/showcase/music/cover-06.jpg';
import cover07 from '../../assets/showcase/music/cover-07.jpg';
import cover08 from '../../assets/showcase/music/cover-08.jpg';
import cover09 from '../../assets/showcase/music/cover-09.jpg';
import cover10 from '../../assets/showcase/music/cover-10.jpg';
import cover11 from '../../assets/showcase/music/cover-11.jpg';
import cover12 from '../../assets/showcase/music/cover-12.jpg';
import cover13 from '../../assets/showcase/music/cover-13.jpg';
import cover14 from '../../assets/showcase/music/cover-14.jpg';
import cover15 from '../../assets/showcase/music/cover-15.jpg';
import cover16 from '../../assets/showcase/music/cover-16.jpg';
import cover17 from '../../assets/showcase/music/cover-17.jpg';
import cover18 from '../../assets/showcase/music/cover-18.jpg';
import cover19 from '../../assets/showcase/music/cover-19.jpg';
import cover20 from '../../assets/showcase/music/cover-20.jpg';

type Album = {
  id: string;
  title: string;
  artist: string;
  cover: ImageSourcePropType;
};

const ALBUMS: Album[] = [
  { id: '1', title: 'Midnight Waves', artist: 'Luna Echo', cover: cover01 },
  { id: '2', title: 'Neon Dreams', artist: 'Pixel Drift', cover: cover02 },
  { id: '3', title: 'Quiet Hours', artist: 'Amber Field', cover: cover03 },
  { id: '4', title: 'Chrome Valley', artist: 'Silver Thread', cover: cover04 },
  { id: '5', title: 'Glass Garden', artist: 'Fern & Wire', cover: cover05 },
  { id: '6', title: 'Solar Flare', artist: 'Nova Pulse', cover: cover06 },
  { id: '7', title: 'Deep Current', artist: 'Undertow', cover: cover07 },
  { id: '8', title: 'Analog Sky', artist: 'Tape Head', cover: cover08 },
  { id: '9', title: 'Paper Moon', artist: 'Ivory Coast', cover: cover09 },
  { id: '10', title: 'Rust & Gold', artist: 'Forge Light', cover: cover10 },
  { id: '11', title: 'Pale Fire', artist: 'Luna Echo', cover: cover11 },
  { id: '12', title: 'Signal Lost', artist: 'Pixel Drift', cover: cover12 },
  { id: '13', title: 'Half Light', artist: 'Silver Thread', cover: cover13 },
  { id: '14', title: 'Warm Static', artist: 'Tape Head', cover: cover14 },
  { id: '15', title: 'Violet Hour', artist: 'Amber Field', cover: cover15 },
  { id: '16', title: 'Iron Bloom', artist: 'Forge Light', cover: cover16 },
  { id: '17', title: 'Soft Crash', artist: 'Nova Pulse', cover: cover17 },
  { id: '18', title: 'Low Tide', artist: 'Undertow', cover: cover18 },
  { id: '19', title: 'Ghost Freq', artist: 'Fern & Wire', cover: cover19 },
  { id: '20', title: 'Marble Arch', artist: 'Ivory Coast', cover: cover20 },
];

type Station = {
  id: string;
  name: string;
  genre: string;
  description: string;
  nowPlaying?: string;
  artist?: string;
};

const STATIONS: Station[] = [
  {
    id: '1',
    name: 'Velvet FM',
    genre: 'Indie',
    description: 'Indie hits and hidden gems',
    nowPlaying: 'Midnight Waves',
    artist: 'Luna Echo',
  },
  {
    id: '2',
    name: 'Neon Radio',
    genre: 'Electronic',
    description: 'Electronic beats all day',
  },
  {
    id: '3',
    name: 'Canyon Rock',
    genre: 'Rock',
    description: 'Classic and modern rock',
  },
  {
    id: '4',
    name: 'Drift Lounge',
    genre: 'Lo-fi',
    description: 'Chill beats to relax to',
  },
  {
    id: '5',
    name: 'Pulse Radio',
    genre: 'Pop',
    description: "Today's biggest hits",
  },
  {
    id: '6',
    name: 'Deep Current FM',
    genre: 'Jazz',
    description: 'Smooth jazz and soul',
  },
];

const GENRES = [
  { name: 'Indie', color: '#E8735A' },
  { name: 'Electronic', color: '#5B7FFF' },
  { name: 'Rock', color: '#8B5CF6' },
  { name: 'Lo-fi', color: '#10B981' },
  { name: 'Pop', color: '#F59E0B' },
  { name: 'Jazz', color: '#6366F1' },
  { name: 'Classical', color: '#EC4899' },
  { name: 'Hip-Hop', color: '#EF4444' },
];

const FOR_YOU_SECTIONS = [
  { title: 'New Releases', albums: ALBUMS.slice(10, 17) },
  { title: 'Recently Played', albums: ALBUMS.slice(0, 6) },
  { title: 'Made for You', albums: ALBUMS.slice(14, 20) },
];

const NOW_PLAYING = ALBUMS[0];

const SPACING_XS = 4;
const SPACING_S = 8;
const SPACING_M = 12;
const SPACING_L = 16;
const SPACING_XL = 20;

const BORDER_RADIUS = 8;
const BORDER_RADIUS_SM = 6;
const ON_AIR_DOT_SIZE = 8;
const HORIZONTAL_ITEM_SIZE = 140;
const SEARCH_RESULT_COVER_SIZE = 48;

const AlbumsScreen = () => {
  const { colors, fonts } = useTheme();
  const dimensions = useWindowDimensions();
  const availableWidth = dimensions.width - SPACING_M * 2;
  const numColumns = Math.max(1, Math.floor(availableWidth / 150));
  const itemSize = (availableWidth - (numColumns - 1) * SPACING_M) / numColumns;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.albumGridContent}
    >
      {ALBUMS.map((item) => (
        <View
          key={item.id}
          style={[
            styles.albumGridItem,
            Platform.OS !== 'web' && { width: itemSize },
          ]}
        >
          <Image
            source={item.cover}
            resizeMode="cover"
            style={styles.albumGridPhoto}
          />

          <View style={styles.albumInfo}>
            <Text style={[styles.albumTitle, fonts.bold]} numberOfLines={1}>
              {item.title}
            </Text>

            <Text
              style={[styles.artistText, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.artist}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const ForYouScreen = () => {
  const { colors, fonts } = useTheme();
  const featured = ALBUMS[2];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.forYouContent}
    >
      <View style={styles.featuredCard}>
        <Image source={featured.cover} style={styles.featuredImage} />

        <View style={styles.featuredOverlay}>
          <Text style={[styles.featuredLabel, fonts.medium]}>Featured</Text>

          <Text style={[styles.featuredTitle, fonts.heavy]}>
            {featured.title}
          </Text>

          <Text style={[styles.featuredArtist, fonts.medium]}>
            {featured.artist}
          </Text>
        </View>
      </View>

      {FOR_YOU_SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={[styles.sectionTitle, fonts.bold]}>{section.title}</Text>

          <FlatList
            horizontal
            data={section.albums}
            keyExtractor={(item) => `${section.title}-${item.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <View style={styles.horizontalItem}>
                <Image source={item.cover} style={styles.horizontalCover} />

                <Text
                  style={[styles.horizontalTitle, fonts.medium]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text
                  style={[styles.artistText, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {item.artist}
                </Text>
              </View>
            )}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const RadioScreen = () => {
  const { colors, fonts } = useTheme();

  return (
    <FlatList
      data={STATIONS}
      keyExtractor={(item) => item.id}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.stationList}
      ItemSeparatorComponent={() => (
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
      )}
      renderItem={({ item }) => (
        <View style={styles.stationRow}>
          <View style={styles.stationHeader}>
            <View style={styles.stationNameRow}>
              <View
                style={[
                  styles.onAirDot,
                  {
                    backgroundColor: item.nowPlaying
                      ? '#EF4444'
                      : 'transparent',
                  },
                ]}
              />

              <Text style={[styles.stationName, fonts.bold]}>{item.name}</Text>

              <View
                style={[styles.genreTag, { backgroundColor: colors.border }]}
              >
                <Text style={[styles.genreText, fonts.medium]}>
                  {item.genre}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.stationDetailText,
                { color: colors.text, opacity: item.nowPlaying ? 1 : 0.6 },
              ]}
              numberOfLines={1}
            >
              {item.nowPlaying
                ? `${item.nowPlaying} — ${item.artist}`
                : item.description}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const SearchScreenContent = () => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation('SearchHome');
  const [query, setQuery] = React.useState('');
  const dimensions = useWindowDimensions();

  const searchPadding = SPACING_L * 2;
  const genreColumns = Math.max(
    2,
    Math.floor((dimensions.width - searchPadding) / 170)
  );
  const genreCardWidth =
    (dimensions.width - searchPadding - (genreColumns - 1) * SPACING_M) /
    genreColumns;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Artists, songs, albums',
        onChange: (e: { nativeEvent: { text: string } }) => {
          setQuery(e.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  const filteredAlbums = React.useMemo(() => {
    if (!query) {
      return [];
    }

    const q = query.toLowerCase();

    return ALBUMS.filter(
      (a) =>
        a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.searchContent}
    >
      {query ? (
        filteredAlbums.length > 0 ? (
          <View
            style={[styles.searchResultsCard, { backgroundColor: colors.card }]}
          >
            {filteredAlbums.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <View
                    style={[
                      styles.searchResultSeparator,
                      { backgroundColor: colors.border },
                    ]}
                  />
                )}

                <View style={styles.searchResultRow}>
                  <Image source={item.cover} style={styles.searchResultCover} />

                  <View style={styles.searchResultInfo}>
                    <Text style={[styles.searchResultTitle, fonts.medium]}>
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.searchResultArtist,
                        { color: colors.text },
                      ]}
                    >
                      {item.artist}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
        ) : (
          <Text
            style={[styles.emptyText, { color: colors.text, opacity: 0.5 }]}
          >
            No results
          </Text>
        )
      ) : (
        <>
          <Text style={[styles.browseSectionTitle, fonts.bold]}>
            Browse Categories
          </Text>

          <View style={styles.genreGridContainer}>
            {GENRES.map((genre) => (
              <View
                key={genre.name}
                style={[
                  styles.genreCard,
                  styles.genreGridCard,
                  Platform.OS !== 'web' && { width: genreCardWidth },
                  { backgroundColor: genre.color },
                ]}
              >
                <Text style={[styles.genreCardText, fonts.bold]}>
                  {genre.name}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const SearchStack = createNativeStackNavigator({
  screens: {
    SearchHome: createNativeStackScreen({
      screen: SearchScreenContent,
      options: {
        title: 'Search',
        headerLargeTitleEnabled: true,
      },
    }),
  },
});

const NowPlayingBar = ({ placement }: { placement: 'inline' | 'regular' }) => {
  const { colors, fonts } = useTheme();

  return (
    <View style={styles.nowPlaying}>
      <View style={styles.nowPlayingCoverWrap}>
        <Image source={NOW_PLAYING.cover} style={styles.nowPlayingCover} />
      </View>

      {placement === 'regular' ? (
        <>
          <View style={styles.nowPlayingText}>
            <Text
              style={[
                styles.nowPlayingTitle,
                fonts.bold,
                { color: colors.text },
              ]}
              numberOfLines={1}
            >
              {NOW_PLAYING.title}
            </Text>

            <Text
              style={[styles.nowPlayingArtist, { color: colors.text }]}
              numberOfLines={1}
            >
              {NOW_PLAYING.artist}
            </Text>
          </View>

          <View style={styles.nowPlayingButtons}>
            <Ionicons name="play" size={28} color={colors.text} />
            <Ionicons name="play-forward" size={28} color={colors.text} />
          </View>
        </>
      ) : (
        <View style={styles.nowPlayingButtons}>
          <Ionicons name="play-back" size={28} color={colors.text} />
          <Ionicons name="play" size={28} color={colors.text} />
          <Ionicons name="play-forward" size={28} color={colors.text} />
        </View>
      )}
    </View>
  );
};

const NativeBottomTabsShowcaseNavigator = createBottomTabNavigator({
  implementation: 'native',
  screenLayout: ({ children }) =>
    Platform.OS === 'android' ? (
      <SafeAreaView edges={{ top: true, bottom: true }}>
        {children}
      </SafeAreaView>
    ) : (
      children
    ),
  screenOptions: {
    bottomAccessory: ({ placement }) => <NowPlayingBar placement={placement} />,
  },
  screens: {
    Albums: createBottomTabScreen({
      screen: AlbumsScreen,
      options: {
        title: 'Albums',
        tabBarIcon: Platform.select<Icon>({
          ios: { type: 'sfSymbol', name: 'rectangle.stack' },
          android: { type: 'materialSymbol', name: 'library_music' },
          default: { type: 'image', source: iconLibrary },
        }),
        tabBarMinimizeBehavior: 'onScrollDown',
      },
    }),

    ForYou: createBottomTabScreen({
      screen: ForYouScreen,
      options: {
        title: 'For You',
        tabBarIcon: Platform.select<Icon>({
          ios: { type: 'sfSymbol', name: 'play.circle' },
          android: { type: 'materialSymbol', name: 'play_circle' },
          default: { type: 'image', source: iconCirclePlay },
        }),
        tabBarBadge: 3,
      },
    }),

    Radio: createBottomTabScreen({
      screen: RadioScreen,
      options: {
        title: 'Radio',
        tabBarIcon: Platform.select<Icon>({
          ios: { type: 'sfSymbol', name: 'dot.radiowaves.left.and.right' },
          android: { type: 'materialSymbol', name: 'cell_tower' },
          default: { type: 'image', source: iconRadioTower },
        }),
        tabBarMinimizeBehavior: 'onScrollDown',
      },
    }),

    Search: createBottomTabScreen({
      screen: SearchStack,
      layout: ({ children }) => children,
      options: {
        tabBarSystemItem: 'search',
        tabBarIcon: Platform.select<Icon>({
          ios: { type: 'sfSymbol', name: 'magnifyingglass' },
          android: { type: 'materialSymbol', name: 'search' },
          default: { type: 'image', source: iconSearch },
        }),
        popToTopOnBlur: true,
      },
    }),
  },
});

export const NativeBottomTabsShowcase = {
  screen: NativeBottomTabsShowcaseNavigator,
  title: 'Showcase - Native Bottom Tabs',
};

const styles = StyleSheet.create({
  ...Platform.select({
    web: {
      albumGridContent: {
        display: 'grid' as any,
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: SPACING_M,
        padding: SPACING_M,
      },
      albumGridItem: {
        width: '100%',
      },
      albumGridPhoto: {
        flex: 1,
        paddingTop: '100%',
        height: 'auto',
        width: 'auto',
        borderRadius: BORDER_RADIUS,
        borderCurve: 'continuous',
      },
      genreGridContainer: {
        display: 'grid' as any,
        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
        gap: SPACING_M,
      },
      genreGridCard: {
        width: '100%',
      },
    },
    default: {
      albumGridContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SPACING_M,
        gap: SPACING_M,
      },
      albumGridItem: {},
      albumGridPhoto: {
        height: null,
        width: null,
        aspectRatio: 1,
        borderRadius: BORDER_RADIUS,
        borderCurve: 'continuous',
      },
      genreGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING_M,
      },
      genreGridCard: {},
    },
  }),

  albumInfo: {
    padding: SPACING_S,
  },
  albumTitle: {
    fontSize: 13,
  },
  artistText: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.6,
  },

  forYouContent: {
    paddingBottom: SPACING_XL,
  },
  featuredCard: {
    margin: SPACING_M,
    maxWidth: 500,
    borderRadius: BORDER_RADIUS,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  featuredImage: {
    width: null,
    height: null,
    aspectRatio: 16 / 9,
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING_L,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  featuredLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 22,
    color: '#fff',
    marginTop: SPACING_XS,
  },
  featuredArtist: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  section: {
    marginTop: SPACING_XL,
  },
  sectionTitle: {
    fontSize: 20,
    marginHorizontal: SPACING_M,
    marginBottom: SPACING_M,
  },
  horizontalList: {
    paddingHorizontal: SPACING_M,
    gap: SPACING_M,
  },
  horizontalItem: {
    width: HORIZONTAL_ITEM_SIZE,
  },
  horizontalCover: {
    width: HORIZONTAL_ITEM_SIZE,
    height: HORIZONTAL_ITEM_SIZE,
    borderRadius: BORDER_RADIUS,
    borderCurve: 'continuous',
  },
  horizontalTitle: {
    fontSize: 13,
    marginTop: SPACING_S,
  },

  stationList: {
    paddingVertical: SPACING_S,
  },
  stationRow: {
    paddingHorizontal: SPACING_L,
    paddingVertical: SPACING_M,
  },
  stationHeader: {
    gap: SPACING_XS,
  },
  stationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING_S,
  },
  onAirDot: {
    width: ON_AIR_DOT_SIZE,
    height: ON_AIR_DOT_SIZE,
    borderRadius: ON_AIR_DOT_SIZE / 2,
    borderCurve: 'continuous',
  },
  stationName: {
    fontSize: 17,
  },
  genreTag: {
    paddingHorizontal: SPACING_S,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS_SM,
    borderCurve: 'continuous',
  },
  genreText: {
    fontSize: 12,
  },
  stationDetailText: {
    fontSize: 14,
    marginLeft: ON_AIR_DOT_SIZE + SPACING_S,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: SPACING_L,
  },

  searchContent: {
    padding: SPACING_L,
  },
  searchResultsCard: {
    borderRadius: BORDER_RADIUS,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  searchResultSeparator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: SEARCH_RESULT_COVER_SIZE + SPACING_M * 2,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING_M,
    paddingVertical: SPACING_S,
  },
  searchResultCover: {
    width: SEARCH_RESULT_COVER_SIZE,
    height: SEARCH_RESULT_COVER_SIZE,
    borderRadius: BORDER_RADIUS_SM,
    borderCurve: 'continuous',
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: SPACING_M,
  },
  searchResultTitle: {
    fontSize: 15,
  },
  searchResultArtist: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: SPACING_XL * 2,
  },
  browseSectionTitle: {
    fontSize: 20,
    marginBottom: SPACING_M,
  },
  genreCard: {
    aspectRatio: 16 / 9,
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING_M,
    paddingBottom: SPACING_M,
    borderRadius: BORDER_RADIUS,
    borderCurve: 'continuous',
  },
  genreCardText: {
    fontSize: 16,
    color: '#fff',
  },

  nowPlaying: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING_S,
  },
  nowPlayingCoverWrap: {
    margin: 5,
  },
  nowPlayingCover: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: 999,
    borderCurve: 'continuous',
  },
  nowPlayingText: {
    flex: 1,
    marginLeft: SPACING_S,
  },
  nowPlayingTitle: {
    fontSize: 14,
  },
  nowPlayingArtist: {
    fontSize: 12,
    marginTop: 1,
    opacity: 0.6,
  },
  nowPlayingButtons: {
    flexDirection: 'row',
    gap: SPACING_M,
    marginHorizontal: SPACING_M,
  },
});
