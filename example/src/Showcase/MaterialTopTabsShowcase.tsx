import {
  RobotoSlab_400Regular,
  RobotoSlab_500Medium,
  RobotoSlab_600SemiBold,
  RobotoSlab_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto-slab';
import { Text } from '@react-navigation/elements';
import {
  createMaterialTopTabNavigator,
  createMaterialTopTabScreen,
} from '@react-navigation/material-top-tabs';
import {
  ThemeProvider,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  type ImageSourcePropType,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import food01 from '../../assets/showcase/food/food-01.jpg';
import food02 from '../../assets/showcase/food/food-02.jpg';
import food03 from '../../assets/showcase/food/food-03.jpg';
import food04 from '../../assets/showcase/food/food-04.jpg';
import food05 from '../../assets/showcase/food/food-05.jpg';
import food06 from '../../assets/showcase/food/food-06.jpg';
import food07 from '../../assets/showcase/food/food-07.jpg';
import food08 from '../../assets/showcase/food/food-08.jpg';
import food09 from '../../assets/showcase/food/food-09.jpg';
import food10 from '../../assets/showcase/food/food-10.jpg';
import food11 from '../../assets/showcase/food/food-11.jpg';
import food12 from '../../assets/showcase/food/food-12.jpg';
import food13 from '../../assets/showcase/food/food-13.jpg';
import food14 from '../../assets/showcase/food/food-14.jpg';
import food15 from '../../assets/showcase/food/food-15.jpg';
import food16 from '../../assets/showcase/food/food-16.jpg';
import food17 from '../../assets/showcase/food/food-17.jpg';
import food18 from '../../assets/showcase/food/food-18.jpg';
import food19 from '../../assets/showcase/food/food-19.jpg';
import food20 from '../../assets/showcase/food/food-20.jpg';

const SPACING_XS = 4;
const SPACING_S = 8;
const SPACING_M = 12;
const SPACING_L = 16;
const SPACING_XL = 20;

const BORDER_RADIUS_S = 8;
const BORDER_RADIUS_M = 12;
const BORDER_RADIUS_L = 16;

type Recipe = {
  id: string;
  title: string;
  author: string;
  time: string;
  difficulty: string;
  servings: string;
  description: string;
  rating: number;
  tags: string[];
  image: ImageSourcePropType;
  category: string;
  saved?: boolean;
};

const RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Lemon Herb Risotto with Spring Peas',
    author: 'Maria Chen',
    time: '25 min',
    difficulty: 'Easy',
    servings: '4 servings',
    description:
      'A bright, creamy risotto that celebrates the best of spring produce. Fresh peas, lemon zest, and a handful of herbs make this effortless.',
    rating: 4.8,
    tags: ['Risotto', 'Spring', 'Italian', 'Vegetarian'],
    image: food01,
    category: 'trending',
    saved: true,
  },
  {
    id: '2',
    title: 'Açaí Berry Smoothie Bowl',
    author: 'James Rivera',
    time: '10 min',
    difficulty: 'Easy',
    servings: '2 servings',
    description:
      'Thick, creamy açaí blended with frozen banana and topped with fresh berries, granola, and a drizzle of honey.',
    rating: 4.6,
    tags: ['Smoothie', 'Healthy', 'Vegan'],
    image: food09,
    category: 'breakfast',
    saved: true,
  },
  {
    id: '3',
    title: 'Thai Green Curry with Jasmine Rice',
    author: 'Priya Sharma',
    time: '35 min',
    difficulty: 'Medium',
    servings: '4 servings',
    description:
      'Aromatic green curry packed with vegetables and tender chicken, served over fragrant jasmine rice.',
    rating: 4.7,
    tags: ['Thai', 'Curry', 'Spicy'],
    image: food02,
    category: 'lunch',
  },
  {
    id: '4',
    title: 'Classic Eggs Benedict',
    author: 'Sophie Laurent',
    time: '30 min',
    difficulty: 'Medium',
    servings: '2 servings',
    description:
      'Perfectly poached eggs on toasted English muffins with Canadian bacon and silky hollandaise sauce.',
    rating: 4.5,
    tags: ['Eggs', 'Brunch', 'Classic'],
    image: food15,
    category: 'breakfast',
  },
  {
    id: '5',
    title: 'Mediterranean Grain Bowl',
    author: 'Alex Petrov',
    time: '20 min',
    difficulty: 'Easy',
    servings: '2 servings',
    description:
      'A hearty bowl of farro, roasted vegetables, chickpeas, and a lemon-tahini dressing.',
    rating: 4.4,
    tags: ['Grain Bowl', 'Mediterranean', 'Healthy'],
    image: food04,
    category: 'lunch',
    saved: true,
  },
  {
    id: '6',
    title: 'Pan-Seared Salmon with Dill Sauce',
    author: 'Maria Chen',
    time: '25 min',
    difficulty: 'Medium',
    servings: '2 servings',
    description:
      'Crispy-skinned salmon fillets served with a creamy dill and caper sauce alongside roasted asparagus.',
    rating: 4.9,
    tags: ['Salmon', 'Seafood', 'Spring'],
    image: food05,
    category: 'dinner',
    saved: true,
  },
  {
    id: '7',
    title: 'Cacio e Pepe',
    author: 'Luca Romano',
    time: '20 min',
    difficulty: 'Medium',
    servings: '4 servings',
    description:
      'The classic Roman pasta with just three ingredients: pasta, Pecorino Romano, and black pepper.',
    rating: 4.7,
    tags: ['Pasta', 'Italian', 'Classic'],
    image: food06,
    category: 'dinner',
  },
  {
    id: '8',
    title: 'Lemon Tart with Meringue',
    author: 'Sophie Laurent',
    time: '45 min',
    difficulty: 'Hard',
    servings: '8 servings',
    description:
      'A buttery shortcrust tart filled with tangy lemon curd and topped with toasted Swiss meringue.',
    rating: 4.8,
    tags: ['Tart', 'French', 'Citrus'],
    image: food16,
    category: 'desserts',
  },
  {
    id: '9',
    title: 'Lavender Honey Latte',
    author: 'James Rivera',
    time: '5 min',
    difficulty: 'Easy',
    servings: '1 serving',
    description:
      'A floral and soothing latte made with espresso, steamed oat milk, and lavender-infused honey.',
    rating: 4.3,
    tags: ['Coffee', 'Floral', 'Spring'],
    image: food11,
    category: 'drinks',
    saved: true,
  },
  {
    id: '10',
    title: 'Spring Vegetable Frittata',
    author: 'Alex Petrov',
    time: '30 min',
    difficulty: 'Easy',
    servings: '6 servings',
    description:
      'A vibrant egg frittata loaded with asparagus, peas, fresh herbs, and crumbled goat cheese.',
    rating: 4.5,
    tags: ['Eggs', 'Spring', 'Vegetarian'],
    image: food10,
    category: 'seasonal',
  },
  {
    id: '11',
    title: 'Avocado Toast with Poached Egg',
    author: 'Priya Sharma',
    time: '15 min',
    difficulty: 'Easy',
    servings: '1 serving',
    description:
      'Crispy sourdough topped with smashed avocado, a perfectly poached egg, chili flakes, and microgreens.',
    rating: 4.6,
    tags: ['Avocado', 'Brunch', 'Quick'],
    image: food03,
    category: 'breakfast',
  },
  {
    id: '12',
    title: 'Grilled Herb Chicken Salad',
    author: 'Sophie Laurent',
    time: '25 min',
    difficulty: 'Easy',
    servings: '2 servings',
    description:
      'Juicy grilled chicken over mixed greens with cherry tomatoes, cucumbers, and a balsamic vinaigrette.',
    rating: 4.4,
    tags: ['Salad', 'Chicken', 'Light'],
    image: food14,
    category: 'lunch',
  },
  {
    id: '13',
    title: 'Slow-Roasted Short Ribs',
    author: 'Luca Romano',
    time: '3 hrs',
    difficulty: 'Hard',
    servings: '4 servings',
    description:
      'Fall-off-the-bone short ribs braised in red wine with root vegetables and fresh thyme.',
    rating: 4.9,
    tags: ['Beef', 'Braised', 'Comfort'],
    image: food13,
    category: 'dinner',
  },
  {
    id: '14',
    title: 'Chocolate Mousse Cups',
    author: 'Maria Chen',
    time: '20 min',
    difficulty: 'Easy',
    servings: '4 servings',
    description:
      'Silky dark chocolate mousse with a hint of espresso, topped with whipped cream and cocoa nibs.',
    rating: 4.7,
    tags: ['Chocolate', 'No-Bake', 'French'],
    image: food17,
    category: 'desserts',
  },
  {
    id: '15',
    title: 'Raspberry Rose Spritz',
    author: 'James Rivera',
    time: '5 min',
    difficulty: 'Easy',
    servings: '1 serving',
    description:
      'A refreshing sparkling cocktail with muddled raspberries, rose water, and prosecco.',
    rating: 4.5,
    tags: ['Cocktail', 'Spring', 'Refreshing'],
    image: food08,
    category: 'drinks',
  },
  {
    id: '16',
    title: 'Strawberry Pistachio Pavlova',
    author: 'Sophie Laurent',
    time: '1 hr',
    difficulty: 'Hard',
    servings: '6 servings',
    description:
      'Crisp meringue shell with a marshmallow center, piled with cream, strawberries, and crushed pistachios.',
    rating: 4.8,
    tags: ['Meringue', 'Spring', 'Elegant'],
    image: food07,
    category: 'desserts',
  },
  {
    id: '17',
    title: 'Rhubarb Ginger Compote with Yogurt',
    author: 'Alex Petrov',
    time: '25 min',
    difficulty: 'Easy',
    servings: '4 servings',
    description:
      'Tangy rhubarb and warm ginger stewed into a rosy compote, served over thick Greek yogurt.',
    rating: 4.3,
    tags: ['Rhubarb', 'Spring', 'Healthy'],
    image: food18,
    category: 'seasonal',
  },
  {
    id: '18',
    title: 'Pea & Mint Soup',
    author: 'Priya Sharma',
    time: '20 min',
    difficulty: 'Easy',
    servings: '4 servings',
    description:
      'A vibrant green soup made with fresh peas, mint, and a swirl of crème fraîche. Light and seasonal.',
    rating: 4.5,
    tags: ['Soup', 'Spring', 'Vegetarian'],
    image: food19,
    category: 'seasonal',
  },
  {
    id: '19',
    title: 'Banana Oat Pancakes',
    author: 'Luca Romano',
    time: '15 min',
    difficulty: 'Easy',
    servings: '2 servings',
    description:
      'Fluffy pancakes made with oats and ripe banana, topped with maple syrup and fresh blueberries.',
    rating: 4.4,
    tags: ['Pancakes', 'Quick', 'Healthy'],
    image: food12,
    category: 'breakfast',
  },
  {
    id: '20',
    title: 'Artichoke & Lemon Pasta',
    author: 'Maria Chen',
    time: '30 min',
    difficulty: 'Medium',
    servings: '4 servings',
    description:
      'Tender artichoke hearts tossed with pasta, lemon, garlic, and Parmesan in a light olive oil sauce.',
    rating: 4.6,
    tags: ['Pasta', 'Spring', 'Italian'],
    image: food20,
    category: 'seasonal',
  },
];

const TRENDING_IDS = ['1', '3', '6'];

const getRecipesByCategory = (category: string) =>
  RECIPES.filter((r) => r.category === category);

const getSavedRecipes = () => RECIPES.filter((r) => r.saved);

const getTrendingRecipes = () =>
  RECIPES.filter((r) => TRENDING_IDS.includes(r.id));

const Badge = ({ count }: { count: number }) => {
  const { colors, fonts } = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: colors.notification }]}>
      <Text style={[styles.badgeText, fonts.medium]}>{count}</Text>
    </View>
  );
};

const RecipeCard = ({ item, width }: { item: Recipe; width?: number }) => {
  const { colors, fonts } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card },
        width != null && { width },
      ]}
    >
      <Image source={item.image} style={styles.cardImage} resizeMode="cover" />

      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, fonts.medium]} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={[styles.cardMeta, { color: colors.text, opacity: 0.5 }]}>
          {item.time} · {item.difficulty}
        </Text>
      </View>
    </View>
  );
};

const CardGrid = ({ items }: { items: Recipe[] }) => {
  const dimensions = useWindowDimensions();

  const availableWidth = dimensions.width - SPACING_XL * 2;
  const numColumns = Math.max(1, Math.floor(availableWidth / 160));
  const itemWidth =
    (availableWidth - (numColumns - 1) * SPACING_M) / numColumns;

  return (
    <View style={styles.gridContainer}>
      {items.map((item) => (
        <RecipeCard
          key={item.id}
          item={item}
          width={Platform.OS !== 'web' ? itemWidth : undefined}
        />
      ))}
    </View>
  );
};

const RecipeListItem = ({ item }: { item: Recipe }) => {
  const { colors, fonts } = useTheme();

  return (
    <View style={styles.imageListRow}>
      <Image
        source={item.image}
        style={styles.listItemImage}
        resizeMode="cover"
      />

      <View style={styles.flexFill}>
        <Text style={[styles.cardTitle, fonts.medium]} numberOfLines={1}>
          {item.title}
        </Text>

        <Text
          style={[
            styles.listItemAuthor,
            fonts.medium,
            { color: colors.text, opacity: 0.6 },
          ]}
        >
          {item.author}
        </Text>

        <Text style={[styles.cardMeta, { color: colors.text, opacity: 0.5 }]}>
          {item.time} · {item.difficulty}
        </Text>
      </View>
    </View>
  );
};

const RecipeList = ({ items }: { items: Recipe[] }) => {
  const { colors } = useTheme();

  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && (
            <View
              style={[styles.listDivider, { backgroundColor: colors.border }]}
            />
          )}

          <RecipeListItem item={item} />
        </React.Fragment>
      ))}
    </>
  );
};

const CategoryGridScreen = ({ category }: { category: string }) => {
  const recipes = getRecipesByCategory(category);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.screenContent}
    >
      <CardGrid items={recipes} />
    </ScrollView>
  );
};

const TrendingScreen = () => {
  const { colors, fonts } = useTheme();
  const trending = getTrendingRecipes();
  const featured = trending[0]!;
  const editorPicks = RECIPES.slice(0, 2);
  const quickEasy = RECIPES.filter(
    (r) => r.difficulty === 'Easy' && !editorPicks.includes(r)
  ).slice(0, 4);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.screenContent}
    >
      <Text style={styles.displayTitle}>{featured.title}</Text>

      <View style={styles.metaRow}>
        <Text
          style={[styles.smallText, fonts.medium, { color: colors.primary }]}
        >
          {featured.author}
        </Text>
        <Text style={[styles.smallText, { color: colors.text, opacity: 0.5 }]}>
          {' · '}
          {featured.time}
          {' · '}
          {featured.difficulty}
          {' · '}
          {featured.servings}
        </Text>
      </View>

      <View
        style={[styles.accentDivider, { backgroundColor: colors.border }]}
      />

      <Text style={styles.bodyText}>{featured.description}</Text>

      <Text
        style={[
          styles.headlineText,
          { marginTop: SPACING_XL, marginBottom: SPACING_M },
        ]}
      >
        Editor's Picks
      </Text>

      <CardGrid items={editorPicks} />

      <Text
        style={[
          styles.headlineText,
          { marginTop: SPACING_XL, marginBottom: SPACING_S },
        ]}
      >
        Quick & Easy
      </Text>

      <RecipeList items={quickEasy} />
    </ScrollView>
  );
};

const BreakfastScreen = () => {
  const recipes = getRecipesByCategory('breakfast');
  const morning = recipes.slice(0, 2);
  const quick = recipes.slice(2);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.screenContent}
    >
      <Text style={[styles.headlineText, { marginBottom: SPACING_M }]}>
        Morning Favorites
      </Text>

      <CardGrid items={morning} />

      <Text
        style={[
          styles.headlineText,
          { marginTop: SPACING_XL, marginBottom: SPACING_S },
        ]}
      >
        5-Minute Ideas
      </Text>

      <RecipeList items={quick} />
    </ScrollView>
  );
};

const FeaturedCategoryScreen = ({
  category,
  sectionTitle,
}: {
  category: string;
  sectionTitle: string;
}) => {
  const { fonts } = useTheme();
  const recipes = getRecipesByCategory(category);
  const featured = recipes[0]!;
  const rest = recipes.slice(1);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.featuredImageContainer}>
        <Image
          source={featured.image}
          style={styles.featuredImage}
          resizeMode="cover"
        />

        <View style={styles.featuredImageOverlay}>
          <Text style={[styles.featuredImageTitle, fonts.medium]}>
            {featured.title}
          </Text>

          <Text style={[styles.featuredImageMeta, fonts.medium]}>
            {featured.time} · {featured.difficulty}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.headlineText,
          { marginTop: SPACING_XL, marginBottom: SPACING_M },
        ]}
      >
        {sectionTitle}
      </Text>

      <CardGrid items={rest} />
    </ScrollView>
  );
};

const LunchScreen = () => (
  <FeaturedCategoryScreen category="lunch" sectionTitle="Light & Fresh" />
);

const DinnerScreen = () => (
  <FeaturedCategoryScreen category="dinner" sectionTitle="Crowd Pleasers" />
);

const DessertsScreen = () => <CategoryGridScreen category="desserts" />;

const DrinksScreen = () => <CategoryGridScreen category="drinks" />;

const SavedScreen = () => {
  const saved = getSavedRecipes();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.screenContent}
    >
      <RecipeList items={saved} />
    </ScrollView>
  );
};

const SeasonalScreen = () => {
  const { colors } = useTheme();
  const recipes = getRecipesByCategory('seasonal');

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.screenContent}
    >
      <Text style={styles.displayTitle}>What's in Season</Text>

      <Text style={styles.bodyText}>
        Spring brings a bounty of tender greens, sweet peas, and the first
        asparagus of the year. These recipes make the most of what's fresh right
        now.
      </Text>

      <View
        style={[styles.accentDivider, { backgroundColor: colors.border }]}
      />

      <RecipeList items={recipes} />
    </ScrollView>
  );
};

const NavigatorLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const navigation = useNavigation('MaterialTopTabsShowcase');

  const [fontsLoaded] = useFonts({
    RobotoSlab_400Regular,
    RobotoSlab_500Medium,
    RobotoSlab_600SemiBold,
    RobotoSlab_700Bold,
  });

  const customTheme = React.useMemo(
    () => ({
      ...theme,
      fonts: {
        regular: {
          fontFamily: 'RobotoSlab_400Regular',
          fontWeight: '400' as const,
        },
        medium: {
          fontFamily: 'RobotoSlab_500Medium',
          fontWeight: '400' as const,
        },
        bold: {
          fontFamily: 'RobotoSlab_600SemiBold',
          fontWeight: '400' as const,
        },
        heavy: {
          fontFamily: 'RobotoSlab_700Bold',
          fontWeight: '400' as const,
        },
      },
    }),
    [theme]
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Recipes',
      headerTitleStyle: { fontFamily: 'RobotoSlab_500Medium' },
      headerBackButtonDisplayMode: 'minimal',
      headerStyle:
        Platform.OS === 'ios' && !theme.dark
          ? { backgroundColor: 'white' }
          : undefined,
      headerShadowVisible: false,
    });
  }, [navigation, theme.dark]);

  if (!fontsLoaded) {
    return null;
  }

  return <ThemeProvider value={customTheme}>{children}</ThemeProvider>;
};

const MaterialTopTabsShowcaseNavigator = createMaterialTopTabNavigator({
  layout: ({ children }) => <NavigatorLayout>{children}</NavigatorLayout>,
  screenOptions: ({ theme }) => ({
    tabBarScrollEnabled: true,
    tabBarItemStyle: { width: 'auto' },
    tabBarGap: SPACING_XS,
    tabBarIndicatorStyle: {
      marginHorizontal: SPACING_XL,
    },
    tabBarLabelStyle: {
      fontSize: 14,
      letterSpacing: 0.1,
      textTransform: 'none',
    },
    tabBarStyle:
      Platform.OS === 'ios' && !theme.dark
        ? { backgroundColor: 'white' }
        : undefined,
    lazy: true,
    lazyPreloadDistance: 1,
  }),
  screens: {
    Trending: createMaterialTopTabScreen({
      screen: TrendingScreen,
    }),
    Breakfast: createMaterialTopTabScreen({
      screen: BreakfastScreen,
      options: { tabBarBadge: () => <Badge count={3} /> },
    }),
    Lunch: createMaterialTopTabScreen({
      screen: LunchScreen,
    }),
    Dinner: createMaterialTopTabScreen({
      screen: DinnerScreen,
    }),
    Desserts: createMaterialTopTabScreen({
      screen: DessertsScreen,
    }),
    Drinks: createMaterialTopTabScreen({
      screen: DrinksScreen,
    }),
    Saved: createMaterialTopTabScreen({
      screen: SavedScreen,
    }),
    Seasonal: createMaterialTopTabScreen({
      screen: SeasonalScreen,
    }),
  },
});

export const MaterialTopTabsShowcase = {
  screen: MaterialTopTabsShowcaseNavigator,
  title: 'Showcase - Material Top Tabs',
};

const styles = StyleSheet.create({
  screenContent: {
    padding: SPACING_XL,
    paddingBottom: SPACING_XL * 2,
  },

  displayTitle: {
    fontSize: 32,
    marginBottom: SPACING_S,
  },
  headlineText: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 16,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  cardMeta: {
    fontSize: 12,
    marginTop: SPACING_XS,
  },

  smallText: {
    fontSize: 14,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  accentDivider: {
    height: SPACING_XS,
    borderRadius: SPACING_XS / 2,
    borderCurve: 'continuous',
    marginVertical: SPACING_L,
  },

  cardImage: {
    width: '100%',
    height: 'auto',
    aspectRatio: 4 / 3,
  },
  cardBody: {
    padding: SPACING_M,
  },
  flexFill: {
    flex: 1,
  },

  card: {
    borderRadius: BORDER_RADIUS_M,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },

  listDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 64 + SPACING_M,
  },

  ...Platform.select({
    web: {
      gridContainer: {
        display: 'grid' as any,
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: SPACING_M,
      },
    },
    default: {
      gridContainer: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        gap: SPACING_M,
      },
    },
  }),

  featuredImageContainer: {
    maxWidth: 500,
    borderRadius: BORDER_RADIUS_L,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 'auto',
    aspectRatio: 16 / 9,
  },
  featuredImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING_L,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  featuredImageTitle: {
    fontSize: 20,
    color: '#fff',
  },
  featuredImageMeta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING_XS,
  },

  imageListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING_M,
    gap: SPACING_M,
  },

  listItemImage: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS_S,
    borderCurve: 'continuous',
  },
  listItemAuthor: {
    fontSize: 12,
    marginTop: SPACING_XS,
  },

  badge: {
    top: SPACING_S,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING_XS,
  },
  badgeText: {
    fontSize: 11,
    color: '#fff',
  },
});
