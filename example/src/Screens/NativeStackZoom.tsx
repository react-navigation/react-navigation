/* eslint-disable import-x/no-commonjs */
import { Text } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
  ZoomSourceAnchor,
  ZoomSourceButton,
  ZoomTarget,
} from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

type ParamList = {
  ZoomSources: undefined;
  ImageDetail: { id: string };
  CardDetail: { id: string };
  ArticleDetail: { id: string };
};

const ITEMS = [
  {
    title: 'Mountain Lake',
    subtitle: 'Banff, Canada',
    description:
      'Calm turquoise water with mirrored peaks, best photographed just after sunrise when the light is soft.',
    image: require('../../assets/images/garrett-parker.jpg'),
  },
  {
    title: 'Amber Forest',
    subtitle: 'Central Europe',
    description:
      'Autumn forest with warm sunbeams between trunks, great for low-angle morning light.',
    image: require('../../assets/images/johannes-plenio.jpg'),
  },
  {
    title: 'Bamboo Grove',
    subtitle: 'Kyoto, Japan',
    description:
      'Tall bamboo corridors with soft green light, ideal for vertical framing and wide-angle lenses.',
    image: require('../../assets/images/jason-ortego.jpg'),
  },
  {
    title: 'Alpine Ridge',
    subtitle: 'High Alps',
    description: 'Snowy ridgelines and steep faces with dramatic clouds.',
    image: require('../../assets/images/simon-fitall.jpg'),
  },
  {
    title: 'Shore Sunset',
    subtitle: 'Tropical Coast',
    description: 'Magenta dusk skies over shoreline surf.',
    image: require('../../assets/images/yousef-espanioly.jpg'),
  },
  {
    title: 'Forest View',
    subtitle: 'Safari',
    description: 'Golden hour on the savanna with wildlife.',
    image: require('../../assets/images/geranimo.jpg'),
  },
  {
    title: 'Sandstone Canyon',
    subtitle: 'Arizona, USA',
    description:
      'Layered canyon walls and curved formations that glow when midday light reaches inside.',
    image: require('../../assets/images/ashim-d-silva.jpg'),
  },
  {
    title: 'Velvet Hills',
    subtitle: 'Grassland Highlands',
    description:
      'Rolling green ridges with repeating lines, excellent for wide-angle landscape framing.',
    image: require('../../assets/images/qingbao-meng.jpg'),
  },
  {
    title: 'Desert Canyon',
    subtitle: 'Arizona, USA',
    description:
      'The desert canyon is a geological wonder carved over millions of years. Its layered sandstone walls shift in color from deep orange to pale cream as sunlight moves through the narrow corridors. Best visited in spring when temperatures are mild and wildflowers bloom along the rim.',
    image: require('../../assets/images/ashim-d-silva.jpg'),
  },
] as const;

const FEATURED = [
  { id: 'Mountain Lake', screen: 'ImageDetail' as const },
  { id: 'Amber Forest', screen: 'CardDetail' as const },
  { id: 'Bamboo Grove', screen: 'ImageDetail' as const },
];

const STORIES = [
  { id: 'Alpine Ridge', screen: 'CardDetail' as const },
  { id: 'Shore Sunset', screen: 'ImageDetail' as const },
  { id: 'Forest View', screen: 'CardDetail' as const },
  { id: 'Sandstone Canyon', screen: 'ImageDetail' as const },
  { id: 'Velvet Hills', screen: 'CardDetail' as const },
];

const ARTICLES = [{ id: 'Desert Canyon', screen: 'ArticleDetail' as const }];

const findItem = (id: string) => ITEMS.find((i) => i.title === id) ?? ITEMS[0];

const ZoomSourcesScreen = ({
  navigation,
}: NativeStackScreenProps<ParamList, 'ZoomSources'>) => {
  const { fonts } = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.list}
    >
      {FEATURED.map(({ id, screen }) => {
        const item = findItem(id);
        return (
          <ZoomSourceButton
            key={id}
            id={id}
            onPress={() => navigation.navigate(screen, { id })}
          >
            <Card>
              <ZoomSourceAnchor>
                <Image
                  source={item.image}
                  resizeMode="cover"
                  style={styles.image}
                />
              </ZoomSourceAnchor>
              <View style={styles.details}>
                <Text style={[styles.heading, fonts.heavy]}>{item.title}</Text>
                <Text style={styles.caption}>{item.subtitle}</Text>
              </View>
            </Card>
          </ZoomSourceButton>
        );
      })}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {STORIES.map(({ id, screen }) => {
          const item = findItem(id);
          return (
            <ZoomSourceButton
              key={id}
              id={id}
              onPress={() => navigation.navigate(screen, { id })}
              style={styles.story}
            >
              <ZoomSourceAnchor style={styles.circle}>
                <Image
                  source={item.image}
                  resizeMode="cover"
                  style={styles.fill}
                />
              </ZoomSourceAnchor>
              <Text style={[styles.caption, fonts.bold]}>{item.title}</Text>
            </ZoomSourceButton>
          );
        })}
      </ScrollView>

      {ARTICLES.map(({ id, screen }) => {
        const item = findItem(id);
        return (
          <ZoomSourceButton
            key={id}
            id={id}
            onPress={() => navigation.navigate(screen, { id })}
          >
            <Card>
              <ZoomSourceAnchor style={styles.details}>
                <Text style={[styles.heading, fonts.heavy]}>{item.title}</Text>
                <Text
                  style={[styles.caption, { lineHeight: 18 }]}
                  numberOfLines={3}
                >
                  {item.description}
                </Text>
              </ZoomSourceAnchor>
            </Card>
          </ZoomSourceButton>
        );
      })}
    </ScrollView>
  );
};

const ImageDetailScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ParamList, 'ImageDetail'>) => {
  const { fonts } = useTheme();
  const item = findItem(route.params.id);

  return (
    <Pressable onPress={navigation.goBack}>
      <ZoomTarget id={item.title}>
        <Image source={item.image} resizeMode="cover" style={styles.image} />
      </ZoomTarget>
      <View style={styles.details}>
        <Text style={[styles.heading, fonts.heavy]}>{item.title}</Text>
        <Text style={styles.caption}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </Pressable>
  );
};

const CardDetailScreen = ({
  route,
}: NativeStackScreenProps<ParamList, 'CardDetail'>) => {
  const { fonts } = useTheme();
  const item = findItem(route.params.id);

  return (
    <View style={styles.center}>
      <Card>
        <ZoomTarget id={item.title}>
          <Image source={item.image} resizeMode="cover" style={styles.image} />
        </ZoomTarget>
        <View style={styles.details}>
          <Text style={[styles.heading, fonts.heavy]}>{item.title}</Text>
          <Text style={styles.caption}>{item.subtitle}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </Card>
    </View>
  );
};

const ArticleDetailScreen = ({
  route,
}: NativeStackScreenProps<ParamList, 'ArticleDetail'>) => {
  const { fonts, colors } = useTheme();
  const item = findItem(route.params.id);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.card }}
    >
      <ZoomTarget id={item.title} style={styles.details}>
        <Text style={[styles.heading, fonts.heavy]}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </ZoomTarget>
      <Image
        source={item.image}
        resizeMode="cover"
        style={[styles.image, { marginTop: 16 }]}
      />
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator<ParamList>();

export function NativeStackZoom() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="ZoomSources"
        component={ZoomSourcesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImageDetail"
        component={ImageDetailScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="CardDetail"
        component={CardDetailScreen}
        options={{ title: 'Details' }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: 'Article' }}
      />
    </Stack.Navigator>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {children}
    </View>
  );
}

NativeStackZoom.title = 'Native Stack - Zoom Transition';
NativeStackZoom.linking = {};

const SPACING = 4;
const RADIUS_SM = SPACING * 3;

const styles = StyleSheet.create({
  list: {
    gap: SPACING * 4,
    paddingBottom: SPACING * 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    marginBottom: SPACING * 2,
  },
  caption: {
    fontSize: 13,
    opacity: 0.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: SPACING * 2,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  card: {
    marginHorizontal: SPACING * 4,
    borderRadius: RADIUS_SM,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: null,
    aspectRatio: 16 / 9,
  },
  row: {
    gap: SPACING * 4,
    paddingHorizontal: SPACING * 4,
    paddingVertical: SPACING,
  },
  story: {
    alignItems: 'center',
    gap: SPACING * 2,
  },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: RADIUS_SM,
    overflow: 'hidden',
  },
  details: {
    padding: SPACING * 4,
  },
});
