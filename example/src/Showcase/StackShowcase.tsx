import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Text } from '@react-navigation/elements';
import {
  type StaticScreenProps,
  ThemeProvider,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
  useCardAnimation,
} from '@react-navigation/stack';
import * as React from 'react';
import {
  Animated,
  Image,
  type ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import allosaurus from '../../assets/showcase/dinos/allosaurus.png';
import ankylosaurus from '../../assets/showcase/dinos/ankylosaurus.png';
import apatosaurus from '../../assets/showcase/dinos/apatosaurus.png';
import brachiosaurus from '../../assets/showcase/dinos/brachiosaurus.png';
import carnotaurus from '../../assets/showcase/dinos/carnotaurus.png';
import ceratosaurus from '../../assets/showcase/dinos/ceratosaurus.png';
import coelophysis from '../../assets/showcase/dinos/coelophysis.png';
import compsognathus from '../../assets/showcase/dinos/compsognathus.png';
import deinonychus from '../../assets/showcase/dinos/deinonychus.png';
import dilophosaurus from '../../assets/showcase/dinos/dilophosaurus.png';
import diplodocus from '../../assets/showcase/dinos/diplodocus.png';
import eoraptor from '../../assets/showcase/dinos/eoraptor.png';
import gallimimus from '../../assets/showcase/dinos/gallimimus.png';
import giganotosaurus from '../../assets/showcase/dinos/giganotosaurus.png';
import herrerasaurus from '../../assets/showcase/dinos/herrerasaurus.png';
import iguanodon from '../../assets/showcase/dinos/iguanodon.png';
import kentrosaurus from '../../assets/showcase/dinos/kentrosaurus.png';
import maiasaura from '../../assets/showcase/dinos/maiasaura.png';
import oviraptor from '../../assets/showcase/dinos/oviraptor.png';
import pachycephalosaurus from '../../assets/showcase/dinos/pachycephalosaurus.png';
import parasaurolophus from '../../assets/showcase/dinos/parasaurolophus.png';
import plateosaurus from '../../assets/showcase/dinos/plateosaurus.png';
import procompsognathus from '../../assets/showcase/dinos/procompsognathus.png';
import spinosaurus from '../../assets/showcase/dinos/spinosaurus.png';
import stegosaurus from '../../assets/showcase/dinos/stegosaurus.png';
import styracosaurus from '../../assets/showcase/dinos/styracosaurus.png';
import therizinosaurus from '../../assets/showcase/dinos/therizinosaurus.png';
import triceratops from '../../assets/showcase/dinos/triceratops.png';
import tyrannosaurusRex from '../../assets/showcase/dinos/tyrannosaurus-rex.png';
import velociraptor from '../../assets/showcase/dinos/velociraptor.png';

const SPACING_XS = 4;
const SPACING_S = 8;
const SPACING_M = 12;
const SPACING_L = 16;
const SPACING_XL = 20;
const SPACING_XXL = 28;

const BORDER_RADIUS_L = 16;
const BORDER_RADIUS_XL = 24;

const SECONDARY_OPACITY = 0.6;
const CLOSE_BUTTON_SIZE = 40;
const CARD_MIN_WIDTH = 160;

const DETAIL_BACK_TEST_ID = 'showcase-stack-detail-back';
const OPEN_IMAGE_VIEWER_TEST_ID = 'showcase-stack-open-image-viewer';
const CLOSE_IMAGE_VIEWER_TEST_ID = 'showcase-stack-close-image-viewer';

type Period = 'Triassic' | 'Jurassic' | 'Cretaceous';
type Diet = 'Herbivore' | 'Carnivore' | 'Omnivore';
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type Dino = {
  id: string;
  name: string;
  period: Period;
  diet: Diet;
  length: string;
  weight: string;
  description: string;
  image: ImageSourcePropType;
};

const PERIOD_COLORS: Record<Period, string> = {
  Triassic: '#D94032',
  Jurassic: '#1B9E6B',
  Cretaceous: '#2E86C1',
};

const DIET_ICONS: Record<Diet, IconName> = {
  Herbivore: 'leaf',
  Carnivore: 'food-drumstick',
  Omnivore: 'food-apple',
};

const DINOS: Dino[] = [
  {
    id: '1',
    name: 'Tyrannosaurus rex',
    period: 'Cretaceous',
    diet: 'Carnivore',
    length: '12 m',
    weight: '7,000 kg',
    description:
      'One of the largest land predators ever discovered, with bone-crushing jaws and powerful senses. It lived in western North America during the late Cretaceous.',
    image: tyrannosaurusRex,
  },
  {
    id: '2',
    name: 'Triceratops',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '9 m',
    weight: '10,000 kg',
    description:
      'An iconic three-horned dinosaur with a massive bony frill. One of the last non-avian dinosaurs, it lived alongside Tyrannosaurus in late Cretaceous North America.',
    image: triceratops,
  },
  {
    id: '3',
    name: 'Velociraptor',
    period: 'Cretaceous',
    diet: 'Carnivore',
    length: '1.8 m',
    weight: '7 kg',
    description:
      'A small dromaeosaur from late Cretaceous Mongolia. It likely had a feathered covering and was much smaller than its popular movie depiction.',
    image: velociraptor,
  },
  {
    id: '4',
    name: 'Stegosaurus',
    period: 'Jurassic',
    diet: 'Herbivore',
    length: '9 m',
    weight: '5,000 kg',
    description:
      'Recognizable by its double row of plates and spiked tail. Although it had a small brain for its body size, it was closer to the size of a plum than the old "walnut-sized brain" myth suggests.',
    image: stegosaurus,
  },
  {
    id: '5',
    name: 'Brachiosaurus',
    period: 'Jurassic',
    diet: 'Herbivore',
    length: '22 m',
    weight: '46,900 kg',
    description:
      'A towering sauropod with front legs longer than its hind legs, giving it a giraffe-like posture. Full-body reconstructions rely partly on its close relative Giraffatitan because no complete Brachiosaurus skeleton is known.',
    image: brachiosaurus,
  },
  {
    id: '6',
    name: 'Spinosaurus',
    period: 'Cretaceous',
    diet: 'Carnivore',
    length: '14 m',
    weight: '7,400 kg',
    description:
      'A huge spinosaurid with a distinctive sail on its back and a long, crocodile-like snout. Evidence suggests it spent much of its time in and around water and fed heavily on fish.',
    image: spinosaurus,
  },
  {
    id: '7',
    name: 'Ankylosaurus',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '8 m',
    weight: '8,000 kg',
    description:
      'A heavily armored dinosaur covered in bony plates and armed with a powerful tail club. It was one of the largest known ankylosaurs of the late Cretaceous.',
    image: ankylosaurus,
  },
  {
    id: '8',
    name: 'Allosaurus',
    period: 'Jurassic',
    diet: 'Carnivore',
    length: '9.7 m',
    weight: '2,700 kg',
    description:
      'A large late Jurassic predator with serrated teeth and short horns above its eyes. It was one of the top carnivores in the Morrison Formation ecosystems of North America.',
    image: allosaurus,
  },
  {
    id: '9',
    name: 'Parasaurolophus',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '9 m',
    weight: '5,000 kg',
    description:
      'A duck-billed dinosaur with a long hollow crest. The crest was likely used for display and may also have helped it produce resonant calls.',
    image: parasaurolophus,
  },
  {
    id: '10',
    name: 'Diplodocus',
    period: 'Jurassic',
    diet: 'Herbivore',
    length: '26 m',
    weight: '15,000 kg',
    description:
      'One of the longest dinosaurs known, with an extraordinarily long neck and whip-like tail. It lived in late Jurassic North America and likely used its neck to feed across a wide area without moving much.',
    image: diplodocus,
  },
  {
    id: '11',
    name: 'Carnotaurus',
    period: 'Cretaceous',
    diet: 'Carnivore',
    length: '8 m',
    weight: '1,500 kg',
    description:
      'A fast-running abelisaurid with distinctive horns above its eyes and extremely reduced arms. Skin impressions show that much of its body was covered in scales.',
    image: carnotaurus,
  },
  {
    id: '12',
    name: 'Pachycephalosaurus',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '3 m',
    weight: '450 kg',
    description:
      'Famous for its thick domed skull. Scientists still debate whether it used that dome in combat, display, or both.',
    image: pachycephalosaurus,
  },
  {
    id: '13',
    name: 'Dilophosaurus',
    period: 'Jurassic',
    diet: 'Carnivore',
    length: '7 m',
    weight: '400 kg',
    description:
      'An early Jurassic predator with twin crests on its skull. Contrary to its movie portrayal, there is no evidence that it had a neck frill or could spit venom.',
    image: dilophosaurus,
  },
  {
    id: '14',
    name: 'Iguanodon',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '10 m',
    weight: '4,000 kg',
    description:
      'One of the first dinosaurs ever identified scientifically. Its distinctive thumb spike was initially mistaken for a nose horn by early paleontologists.',
    image: iguanodon,
  },
  {
    id: '15',
    name: 'Compsognathus',
    period: 'Jurassic',
    diet: 'Carnivore',
    length: '0.7 m',
    weight: '3 kg',
    description:
      'A very small late Jurassic predator from what is now France and Germany. Fossils show that it preyed on small vertebrates.',
    image: compsognathus,
  },
  {
    id: '16',
    name: 'Therizinosaurus',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '10 m',
    weight: '5,000 kg',
    description:
      'A strange theropod known for enormous hand claws, likely the longest known hand claws of any land animal. Despite its theropod ancestry, it was a plant-eater.',
    image: therizinosaurus,
  },
  {
    id: '17',
    name: 'Gallimimus',
    period: 'Cretaceous',
    diet: 'Omnivore',
    length: '6 m',
    weight: '490 kg',
    description:
      'An ostrich-like dinosaur built for speed, possibly reaching 47-55 km/h. Its toothless beak suggests an omnivorous diet, and it likely had feathers.',
    image: gallimimus,
  },
  {
    id: '18',
    name: 'Coelophysis',
    period: 'Triassic',
    diet: 'Carnivore',
    length: '2 m',
    weight: '27 kg',
    description:
      'A lightly built late Triassic predator. Mass bonebeds at Ghost Ranch in New Mexico show that it was abundant in its environment.',
    image: coelophysis,
  },
  {
    id: '19',
    name: 'Plateosaurus',
    period: 'Triassic',
    diet: 'Herbivore',
    length: '7 m',
    weight: '4,000 kg',
    description:
      'One of the first large herbivorous dinosaurs, and an early relative of the giant sauropods. Fossils have been found across Europe in remarkable abundance.',
    image: plateosaurus,
  },
  {
    id: '20',
    name: 'Herrerasaurus',
    period: 'Triassic',
    diet: 'Carnivore',
    length: '3 m',
    weight: '350 kg',
    description:
      'One of the oldest known dinosaurs, from the Late Triassic of Argentina. It was a lightly built carnivore from the earliest phases of dinosaur evolution.',
    image: herrerasaurus,
  },
  {
    id: '21',
    name: 'Eoraptor',
    period: 'Triassic',
    diet: 'Carnivore',
    length: '1.7 m',
    weight: '10 kg',
    description:
      'A small early dinosaur from Late Triassic Argentina and among the oldest known dinosaur genera. It was lightly built and probably hunted small animals.',
    image: eoraptor,
  },
  {
    id: '22',
    name: 'Maiasaura',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '9 m',
    weight: '2,500 kg',
    description:
      'Its name means "good mother lizard," reflecting fossil nesting grounds with eggs, embryos, and juveniles. These finds are key evidence for parental care in some dinosaurs.',
    image: maiasaura,
  },
  {
    id: '23',
    name: 'Oviraptor',
    period: 'Cretaceous',
    diet: 'Omnivore',
    length: '2 m',
    weight: '20 kg',
    description:
      'Originally nicknamed the "egg thief," it was later found brooding its own nest. This feathered Mongolian dinosaur had a toothless, parrot-like beak.',
    image: oviraptor,
  },
  {
    id: '24',
    name: 'Deinonychus',
    period: 'Cretaceous',
    diet: 'Carnivore',
    length: '3.4 m',
    weight: '100 kg',
    description:
      'A sickle-clawed dromaeosaur whose discovery helped drive the dinosaur renaissance. It also strengthened the case that birds evolved from theropod dinosaurs.',
    image: deinonychus,
  },
  {
    id: '25',
    name: 'Apatosaurus',
    period: 'Jurassic',
    diet: 'Herbivore',
    length: '21 m',
    weight: '23,000 kg',
    description:
      'A massive diplodocid sauropod with a powerful, whip-like tail. Some fossils now assigned to Brontosaurus were once grouped with Apatosaurus, but they are currently treated as separate genera.',
    image: apatosaurus,
  },
  {
    id: '26',
    name: 'Ceratosaurus',
    period: 'Jurassic',
    diet: 'Carnivore',
    length: '7 m',
    weight: '980 kg',
    description:
      'A large Jurassic predator distinguished by a prominent nose horn and small bony armor running down its back. It lived alongside Allosaurus in North America and Portugal.',
    image: ceratosaurus,
  },
  {
    id: '27',
    name: 'Kentrosaurus',
    period: 'Jurassic',
    diet: 'Herbivore',
    length: '5 m',
    weight: '1,600 kg',
    description:
      'A stegosaur from Late Jurassic Tanzania with plates on the front of its body and long spikes farther back. It was a close relative of Stegosaurus.',
    image: kentrosaurus,
  },
  {
    id: '28',
    name: 'Giganotosaurus',
    period: 'Cretaceous',
    diet: 'Carnivore',
    length: '13 m',
    weight: '7,200 kg',
    description:
      'One of the largest known carnivorous dinosaurs, though its exact size is uncertain because no complete skeleton has been found. It lived in Patagonia during the late Cretaceous.',
    image: giganotosaurus,
  },
  {
    id: '29',
    name: 'Styracosaurus',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '5.5 m',
    weight: '2,700 kg',
    description:
      'A ceratopsian with a large nose horn and a spectacular array of long spikes projecting from its frill. Fossils found together suggest that it may have lived in groups.',
    image: styracosaurus,
  },
  {
    id: '30',
    name: 'Procompsognathus',
    period: 'Triassic',
    diet: 'Carnivore',
    length: '1 m',
    weight: '1 kg',
    description:
      'A small late Triassic theropod from Germany known from a single, badly crushed specimen. Because the fossil is incomplete, many details of its appearance remain uncertain.',
    image: procompsognathus,
  },
];

const PERIOD_DESCRIPTIONS: Record<Period, string> = {
  Triassic:
    'The Triassic marks the early rise of dinosaurs after the Permian extinction, with lightly built hunters and the first large plant-eaters.',
  Jurassic:
    'The Jurassic saw giant sauropods, plated herbivores, and powerful predators spread across warm, fern-filled landscapes.',
  Cretaceous:
    'The Cretaceous produced many of the best-known dinosaurs, from horned herbivores to apex predators, before the end-Cretaceous extinction.',
};

const PeriodBadge = ({ period }: { period: Period }) => {
  const { fonts } = useTheme();

  return (
    <View
      style={[styles.periodBadge, { backgroundColor: PERIOD_COLORS[period] }]}
    >
      <Text style={[styles.periodBadgeText, fonts.medium]}>{period}</Text>
    </View>
  );
};

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const { colors, fonts } = useTheme();

  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, fonts.bold, { color: colors.text }]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const DetailStat = ({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) => {
  const { colors, fonts } = useTheme();

  return (
    <View style={[styles.detailStat, { backgroundColor: colors.background }]}>
      <MaterialCommunityIcons name={icon} size={18} color={colors.primary} />
      <Text
        style={[
          styles.detailStatLabel,
          fonts.medium,
          { color: colors.text, opacity: SECONDARY_OPACITY },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[styles.detailStatValue, fonts.bold, { color: colors.text }]}
      >
        {value}
      </Text>
    </View>
  );
};

const CatalogHero = () => {
  const { colors, fonts } = useTheme();
  const featured = DINOS[9];

  return (
    <View style={[styles.heroCard, { backgroundColor: colors.card }]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: PERIOD_COLORS[featured.period], opacity: 0.16 },
        ]}
      />
      <Image
        source={featured.image}
        style={styles.fillImage}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.heroImageScrim]} />

      <View style={styles.heroHeaderRow}>
        <Text style={[styles.heroEyebrow, fonts.medium]}>Exhibit guide</Text>
        <PeriodBadge period={featured.period} />
      </View>

      <View style={styles.heroCopy}>
        <Text style={[styles.heroTitle, fonts.heavy]}>
          Dinosaurs of the Mesozoic
        </Text>
        <Text style={styles.heroDescription}>
          Browse iconic species by period and inspect each specimen like a
          museum field guide.
        </Text>
      </View>
    </View>
  );
};

const EmptyState = () => {
  const { colors, fonts } = useTheme();

  return (
    <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
      <MaterialCommunityIcons name="magnify" size={28} color={colors.primary} />
      <Text
        style={[styles.emptyStateTitle, fonts.bold, { color: colors.text }]}
      >
        No specimens found
      </Text>
      <Text
        style={[
          styles.emptyStateText,
          { color: colors.text, opacity: SECONDARY_OPACITY },
        ]}
      >
        Try another search term or switch to a different period.
      </Text>
    </View>
  );
};

const DinoCard = React.memo(
  ({ item, width }: { item: Dino; width?: number }) => {
    const { colors, fonts } = useTheme();
    const navigation = useNavigation('Catalog');

    return (
      <Pressable
        testID={`showcase-stack-dino-${item.id}`}
        style={[
          styles.card,
          width !== undefined && { width },
          { backgroundColor: colors.card },
        ]}
        onPress={() => navigation.navigate('DinoDetail', { id: item.id })}
      >
        <View style={styles.cardImage}>
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: PERIOD_COLORS[item.period], opacity: 0.16 },
            ]}
          />
          <Image
            source={item.image}
            style={styles.fillImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.cardBody}>
          <PeriodBadge period={item.period} />

          <Text style={[styles.cardName, fonts.bold]} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={[styles.cardMeta, fonts.medium]} numberOfLines={1}>
            {item.diet} · {item.length} · {item.weight}
          </Text>
        </View>
      </Pressable>
    );
  }
);

DinoCard.displayName = 'DinoCard';

const DinoGrid = ({ items }: { items: Dino[] }) => {
  const dimensions = useWindowDimensions();

  const availableWidth = dimensions.width - SPACING_L * 2;
  const numColumns = Math.max(1, Math.floor(availableWidth / CARD_MIN_WIDTH));
  const itemWidth =
    (availableWidth - (numColumns - 1) * SPACING_M) / numColumns;
  const cardWidth = Platform.OS === 'web' ? undefined : itemWidth;

  return (
    <View style={styles.gridContainer}>
      {items.map((item) => (
        <DinoCard key={item.id} item={item} width={cardWidth} />
      ))}
    </View>
  );
};

const CatalogScreen = () => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation('Catalog');
  const [query, setQuery] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search dinosaurs',
        onChange: (e: { nativeEvent: { text: string } }) => {
          setQuery(e.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  const filtered = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return DINOS;
    }

    return DINOS.filter(
      (dino) =>
        dino.name.toLowerCase().includes(normalizedQuery) ||
        dino.period.toLowerCase().includes(normalizedQuery) ||
        dino.diet.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  const resultsLabel =
    filtered.length === 1
      ? '1 specimen shown'
      : `${filtered.length} specimens shown`;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.catalogContent, { paddingTop: SPACING_M }]}
    >
      <CatalogHero />

      <View style={styles.catalogSectionHeader}>
        <Text
          style={[
            styles.catalogSectionTitle,
            fonts.bold,
            { color: colors.text },
          ]}
        >
          Specimens
        </Text>
        <Text
          style={[
            styles.catalogSectionMeta,
            { color: colors.text, opacity: SECONDARY_OPACITY },
          ]}
        >
          {resultsLabel}
        </Text>
      </View>

      {filtered.length > 0 ? <DinoGrid items={filtered} /> : <EmptyState />}
    </ScrollView>
  );
};

const DinoDetailScreen = ({ route }: StaticScreenProps<{ id: string }>) => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation('DinoDetail');
  const dino =
    DINOS.find((candidate) => candidate.id === route.params.id) ?? DINOS[0];
  const detailStats: { icon: IconName; label: string; value: string }[] = [
    { icon: DIET_ICONS[dino.diet], label: 'Diet', value: dino.diet },
    { icon: 'ruler', label: 'Length', value: dino.length },
    { icon: 'weight', label: 'Weight', value: dino.weight },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.detailContent}
    >
      <Pressable
        testID={OPEN_IMAGE_VIEWER_TEST_ID}
        style={[styles.detailHero, { backgroundColor: colors.background }]}
        onPress={() => navigation.navigate('ImageViewer', { id: dino.id })}
      >
        <Image
          source={dino.image}
          style={styles.fillImage}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.detailBody}>
        <View style={styles.detailIntro}>
          <PeriodBadge period={dino.period} />
          <Text style={[styles.detailName, fonts.heavy]}>{dino.name}</Text>
        </View>

        <SectionCard title="Quick facts">
          <View style={styles.detailStatsGrid}>
            {detailStats.map((stat) => (
              <DetailStat
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </View>
        </SectionCard>

        <SectionCard title="Field notes">
          <Text style={[styles.bodyText, { color: colors.text }]}>
            {dino.description}
          </Text>
        </SectionCard>

        <SectionCard title={`${dino.period} period`}>
          <Text
            style={[
              styles.bodyText,
              { color: colors.text, opacity: SECONDARY_OPACITY },
            ]}
          >
            {PERIOD_DESCRIPTIONS[dino.period]}
          </Text>
        </SectionCard>
      </View>
    </ScrollView>
  );
};

const ImageViewerScreen = ({ route }: StaticScreenProps<{ id: string }>) => {
  const { colors, dark, fonts } = useTheme();
  const navigation = useNavigation('ImageViewer');
  const insets = useSafeAreaInsets();
  const dino =
    DINOS.find((candidate) => candidate.id === route.params.id) ?? DINOS[0];
  const { current } = useCardAnimation();

  return (
    <View style={styles.viewerContainer}>
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: dark
              ? 'rgba(0, 0, 0, 0.94)'
              : 'rgba(12, 16, 20, 0.92)',
          },
        ]}
        onPress={navigation.goBack}
      />

      <Animated.View
        style={[
          styles.viewerContent,
          {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                scale: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1],
                  extrapolate: 'clamp',
                }),
              },
              {
                translateY: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={[styles.viewerImageWrapper, { backgroundColor: colors.card }]}
        >
          <Image
            source={dino.image}
            style={styles.viewerImage}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.viewerCaption, { backgroundColor: colors.card }]}>
          <PeriodBadge period={dino.period} />
          <Text
            style={[styles.viewerTitle, fonts.heavy, { color: colors.text }]}
          >
            {dino.name}
          </Text>
          <Text
            style={[
              styles.viewerMeta,
              { color: colors.text, opacity: SECONDARY_OPACITY },
            ]}
          >
            {dino.diet} · {dino.length} · {dino.weight}
          </Text>
        </View>
      </Animated.View>

      <Pressable
        testID={CLOSE_IMAGE_VIEWER_TEST_ID}
        style={[styles.viewerClose, { top: insets.top + SPACING_S }]}
        onPress={navigation.goBack}
      >
        <MaterialCommunityIcons name="close" size={24} color="#fff" />
      </Pressable>
    </View>
  );
};

const NavigatorLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const customTheme = React.useMemo(
    () => ({
      ...theme,
      fonts: {
        regular: {
          fontFamily: 'Nunito_400Regular',
          fontWeight: '400' as const,
        },
        medium: {
          fontFamily: 'Nunito_500Medium',
          fontWeight: '400' as const,
        },
        bold: {
          fontFamily: 'Outfit_600SemiBold',
          fontWeight: '400' as const,
        },
        heavy: {
          fontFamily: 'Outfit_700Bold',
          fontWeight: '400' as const,
        },
      },
    }),
    [theme]
  );

  if (!fontsLoaded) {
    return null;
  }

  return <ThemeProvider value={customTheme}>{children}</ThemeProvider>;
};

const StackShowcaseNavigator = createStackNavigator({
  layout: ({ children }) => <NavigatorLayout>{children}</NavigatorLayout>,
  screenOptions: {
    headerBackButtonDisplayMode: 'minimal',
  },
  screens: {
    Catalog: createStackScreen({
      screen: CatalogScreen,
      options: {
        title: 'Dino Catalog',
      },
    }),

    DinoDetail: createStackScreen({
      screen: DinoDetailScreen,
      options: ({ theme }) => ({
        title: '',
        headerBackTestID: DETAIL_BACK_TEST_ID,
        headerStyle: { backgroundColor: theme.colors.background },
        headerShadowVisible: false,
        presentation: 'modal',
      }),
    }),

    ImageViewer: createStackScreen({
      screen: ImageViewerScreen,
      options: {
        headerShown: false,
        presentation: 'transparentModal',
        animation: 'default',
        cardOverlayEnabled: true,
      },
    }),
  },
});

export const StackShowcase = {
  screen: StackShowcaseNavigator,
  title: 'Showcase - Stack',
};

const styles = StyleSheet.create({
  catalogContent: {
    padding: SPACING_L,
    paddingBottom: SPACING_XXL * 2,
    gap: SPACING_L,
  },
  heroCard: {
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS_XL,
    borderCurve: 'continuous',
    overflow: 'hidden',
    maxWidth: 500,
  },
  heroImageScrim: {
    backgroundColor: '#000',
    opacity: 0.42,
  },
  heroHeaderRow: {
    position: 'absolute',
    top: SPACING_L,
    left: SPACING_L,
    right: SPACING_L,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING_S,
  },
  heroEyebrow: {
    fontSize: 13,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  heroCopy: {
    position: 'absolute',
    left: SPACING_L,
    right: SPACING_L,
    bottom: SPACING_XL,
    gap: SPACING_S,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 34,
    color: '#fff',
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: '80%',
    color: '#fff',
  },
  catalogSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: SPACING_S,
  },
  catalogSectionTitle: {
    fontSize: 18,
  },
  catalogSectionMeta: {
    fontSize: 13,
  },
  ...Platform.select({
    web: {
      gridContainer: {
        display: 'grid' as any,
        gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_MIN_WIDTH}px, 1fr))`,
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

  card: {
    borderRadius: BORDER_RADIUS_L,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  cardImage: {
    aspectRatio: 1,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  fillImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
  },
  cardBody: {
    padding: SPACING_M,
    gap: SPACING_S,
  },
  cardName: {
    fontSize: 16,
    lineHeight: 20,
  },
  cardMeta: {
    fontSize: 12,
    opacity: SECONDARY_OPACITY,
  },
  periodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING_XS,
    paddingHorizontal: SPACING_S,
    paddingVertical: SPACING_XS,
    borderRadius: BORDER_RADIUS_L,
    borderCurve: 'continuous',
  },
  periodBadgeText: {
    fontSize: 12,
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    gap: SPACING_S,
    padding: SPACING_XXL,
    borderRadius: BORDER_RADIUS_XL,
    borderCurve: 'continuous',
  },
  emptyStateTitle: {
    fontSize: 18,
  },
  emptyStateText: {
    maxWidth: 280,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  detailContent: {
    paddingBottom: SPACING_XXL * 2,
  },
  detailHero: {
    maxWidth: 600,
    aspectRatio: 1,
    padding: SPACING_L,
  },
  detailBody: {
    paddingTop: SPACING_L,
    paddingHorizontal: SPACING_L,
    gap: SPACING_L,
  },
  detailIntro: {
    alignItems: 'flex-start',
    gap: SPACING_S,
  },
  sectionCard: {
    borderRadius: BORDER_RADIUS_XL,
    borderCurve: 'continuous',
    padding: SPACING_L,
    gap: SPACING_L,
  },
  sectionTitle: {
    fontSize: 18,
  },
  detailName: {
    fontSize: 32,
    lineHeight: 36,
  },
  detailStatsGrid: {
    flexDirection: 'row',
    gap: SPACING_S,
  },
  detailStat: {
    flex: 1,
    borderRadius: BORDER_RADIUS_L,
    borderCurve: 'continuous',
    padding: SPACING_M,
    gap: SPACING_XS,
  },
  detailStatLabel: {
    fontSize: 12,
  },
  detailStatValue: {
    fontSize: 15,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
  },

  viewerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING_L,
  },
  viewerContent: {
    alignItems: 'center',
    gap: SPACING_M,
  },
  viewerImageWrapper: {
    width: '90%',
    maxWidth: 720,
    borderRadius: BORDER_RADIUS_XL,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  viewerImage: {
    width: '100%',
    height: null,
    aspectRatio: 1,
  },
  viewerCaption: {
    width: '90%',
    maxWidth: 720,
    borderRadius: BORDER_RADIUS_L,
    borderCurve: 'continuous',
    padding: SPACING_L,
    gap: SPACING_XS,
  },
  viewerTitle: {
    fontSize: 24,
    lineHeight: 28,
  },
  viewerMeta: {
    fontSize: 14,
    lineHeight: 20,
  },
  viewerClose: {
    position: 'absolute',
    right: SPACING_XL,
    width: CLOSE_BUTTON_SIZE,
    height: CLOSE_BUTTON_SIZE,
    borderRadius: CLOSE_BUTTON_SIZE / 2,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
