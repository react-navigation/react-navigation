import {
  HeaderButton,
  PlatformPressable,
  Text,
  useFrameSize,
} from '@react-navigation/elements';
import {
  SFSymbol,
  type StaticScreenProps,
  UNSTABLE_LayoutRegionView,
  useLocale,
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
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

import allosaurus from '../../assets/showcase/dinos/allosaurus.png';
import ankylosaurus from '../../assets/showcase/dinos/ankylosaurus.png';
import brachiosaurus from '../../assets/showcase/dinos/brachiosaurus.png';
import dilophosaurus from '../../assets/showcase/dinos/dilophosaurus.png';
import diplodocus from '../../assets/showcase/dinos/diplodocus.png';
import pachycephalosaurus from '../../assets/showcase/dinos/pachycephalosaurus.png';
import parasaurolophus from '../../assets/showcase/dinos/parasaurolophus.png';
import spinosaurus from '../../assets/showcase/dinos/spinosaurus.png';
import stegosaurus from '../../assets/showcase/dinos/stegosaurus.png';
import triceratops from '../../assets/showcase/dinos/triceratops.png';
import tyrannosaurusRex from '../../assets/showcase/dinos/tyrannosaurus-rex.png';
import velociraptor from '../../assets/showcase/dinos/velociraptor.png';

type Dino = {
  name: string;
  period: string;
  diet: string;
  length: string;
  description: string;
  image: ImageSourcePropType;
};

const BAR_HEIGHT = 44;
const SIDEBAR_WIDTH = 300;

const DINOS: [Dino, ...Dino[]] = [
  {
    name: 'Tyrannosaurus rex',
    period: 'Cretaceous',
    diet: 'Carnivore',
    length: '12 m',
    description:
      'One of the largest land predators ever, Tyrannosaurus rex lived in western North America at the very end of the Cretaceous, around 68 to 66 million years ago. Its skull was up to 1.5 m long, and its bite was among the strongest of any land animal, strong enough to crush bone. Its arms were tiny but muscular, and its large olfactory bulbs suggest a keen sense of smell. Sue, one of the most complete skeletons ever found, is on display at the Field Museum in Chicago.',
    image: tyrannosaurusRex,
  },
  {
    name: 'Triceratops',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '9 m',
    description:
      'Triceratops is known for the three horns on its face and the large bony frill at the back of its skull. It lived in North America at the end of the Cretaceous, alongside Tyrannosaurus, and bite marks on fossil bones show that the two met. A sharp beak and rows of shearing teeth let it feed on tough, low plants. It is one of the most common dinosaurs found in the Hell Creek Formation of Montana and the Dakotas.',
    image: triceratops,
  },
  {
    name: 'Velociraptor',
    period: 'Cretaceous',
    diet: 'Carnivore',
    length: '1.8 m',
    description:
      'Velociraptor was a small predator from Late Cretaceous Mongolia, about the size of a turkey and much smaller than its movie depiction. Quill knobs on its forearm bones show that it had feathers, although it could not fly. Each foot had a large, curved claw on the second toe that it held off the ground. A famous fossil known as the Fighting Dinosaurs preserves a Velociraptor locked in combat with a Protoceratops.',
    image: velociraptor,
  },
  {
    name: 'Stegosaurus',
    period: 'Jurassic',
    diet: 'Herbivore',
    length: '9 m',
    description:
      'Stegosaurus lived in western North America during the Late Jurassic, about 155 to 150 million years ago. It had two rows of tall plates along its back and four long spikes at the end of its tail. Its brain was small for its body size, but not as tiny as the popular walnut-sized myth suggests. A puncture wound in an Allosaurus tail bone matches the shape of a Stegosaurus spike, which suggests that it used its tail for defense.',
    image: stegosaurus,
  },
  {
    name: 'Brachiosaurus',
    period: 'Jurassic',
    diet: 'Herbivore',
    length: '22 m',
    description:
      'Brachiosaurus was a giant sauropod from the Late Jurassic of North America. Its front legs were longer than its hind legs, which gave it a sloping back and let it hold its neck high like a giraffe. It likely browsed on leaves high in the trees, out of reach of other plant eaters. No complete skeleton has been found, so reconstructions rely partly on its close African relative, Giraffatitan.',
    image: brachiosaurus,
  },
  {
    name: 'Spinosaurus',
    period: 'Cretaceous',
    diet: 'Carnivore',
    length: '14 m',
    description:
      'Spinosaurus lived in North Africa during the Cretaceous and may be the longest predatory dinosaur known. Long spines on its back held up a large sail. Its narrow snout and cone-shaped teeth resemble those of a crocodile and were suited to catching fish. The first fossils were destroyed in a bombing raid on Munich in 1944, and later finds suggest that it spent much of its time in water.',
    image: spinosaurus,
  },
  {
    name: 'Ankylosaurus',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '7 m',
    description:
      'Ankylosaurus was covered in bony plates called osteoderms, which formed armor across its back and head. A large club of fused bone at the end of its tail could swing at attackers. It lived in western North America at the end of the Cretaceous, alongside Tyrannosaurus and Triceratops. Despite its fame, only a few partial skeletons have been found.',
    image: ankylosaurus,
  },
  {
    name: 'Diplodocus',
    period: 'Jurassic',
    diet: 'Herbivore',
    length: '26 m',
    description:
      'Diplodocus was one of the longest dinosaurs, with a long neck balanced by an even longer, whip-like tail. It lived in western North America during the Late Jurassic. Peg-like teeth at the front of its jaws were suited to stripping leaves from branches. Casts of a skeleton nicknamed Dippy, paid for by Andrew Carnegie, stand in museums around the world.',
    image: diplodocus,
  },
  {
    name: 'Parasaurolophus',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '9.5 m',
    description:
      'Parasaurolophus was a duck-billed dinosaur with a long, hollow crest that curved back from its head. Air passages ran through the crest, which may have worked like a trumpet to make low, resonant calls. It lived in North America during the Late Cretaceous, about 76 to 73 million years ago. It could walk on two or four legs and grazed on low plants.',
    image: parasaurolophus,
  },
  {
    name: 'Allosaurus',
    period: 'Jurassic',
    diet: 'Carnivore',
    length: '9.7 m',
    description:
      'Allosaurus was the top predator of Late Jurassic North America, millions of years before Tyrannosaurus. It had a large skull with serrated teeth and short horns above its eyes. The remains of dozens of individuals were found at the Cleveland-Lloyd Quarry in Utah. It shared its habitat with Stegosaurus, Brachiosaurus and Diplodocus.',
    image: allosaurus,
  },
  {
    name: 'Pachycephalosaurus',
    period: 'Cretaceous',
    diet: 'Herbivore',
    length: '4.5 m',
    description:
      'Pachycephalosaurus had a dome of solid bone on top of its skull, up to 25 cm thick and ringed by bony knobs. It was long thought to use the dome in head-butting contests, but how it used the dome is still debated. It lived in western North America at the end of the Cretaceous. It is known mostly from skulls, so the rest of its body is reconstructed from its relatives.',
    image: pachycephalosaurus,
  },
  {
    name: 'Dilophosaurus',
    period: 'Jurassic',
    diet: 'Carnivore',
    length: '7 m',
    description:
      'Dilophosaurus was one of the earliest large predatory dinosaurs and lived in North America during the Early Jurassic, about 193 million years ago. It had a pair of thin, rounded crests on its skull, which may have been for display. Contrary to its movie portrayal, there is no evidence that it had a neck frill or could spit venom. It was also much larger than the film shows.',
    image: dilophosaurus,
  },
];

const isReadableContentSupported =
  Platform.OS === 'ios' && parseFloat(String(Platform.Version)) >= 26;

const isBarRegionSupported =
  Platform.OS === 'ios' && parseFloat(String(Platform.Version)) >= 27.1;

export function ComponentsLayoutRegionView(_: StaticScreenProps<{}>) {
  const navigation = useNavigation();
  const { colors, fonts } = useTheme();
  const { direction } = useLocale();
  const isWide = useFrameSize((frame) => frame.width >= 700);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(isWide);

  const dino = DINOS[selectedIndex] ?? DINOS[0];

  const buttonStyle = {
    backgroundColor: colors.card,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
  };

  const isRTL = direction === 'rtl';

  return (
    <View style={styles.container}>
      <Animated.View
        aria-hidden={!isSidebarVisible}
        style={{
          ...(isWide
            ? {
                width: SIDEBAR_WIDTH,
                marginStart: isSidebarVisible ? 0 : -SIDEBAR_WIDTH,
                transitionProperty: 'marginStart',
              }
            : {
                ...StyleSheet.absoluteFill,
                transform: [
                  {
                    translateX: isSidebarVisible
                      ? '0%'
                      : isRTL
                        ? '100%'
                        : '-100%',
                  },
                ],
                transitionProperty: 'transform',
              }),
          transitionDuration: 300,
          transitionTimingFunction: 'ease-in-out',
          backgroundColor: colors.card,
        }}
      >
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <UNSTABLE_LayoutRegionView
            region="margins"
            edges={{ start: 'maximum', end: 'maximum' }}
            style={styles.sidebarMargins}
          >
            <UNSTABLE_LayoutRegionView
              region="safeArea"
              cornerAdaptation="vertical"
              cornerAdaptationOnly
              edges={{ top: 'additive' }}
              style={styles.sidebarContent}
            >
              {DINOS.map((item, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <PlatformPressable
                    key={item.name}
                    aria-selected={isSelected}
                    onPress={() => {
                      setSelectedIndex(index);

                      if (!isWide) {
                        setIsSidebarVisible(false);
                      }
                    }}
                    pressOpacity={1}
                    style={styles.item}
                  >
                    {isSelected ? (
                      <View
                        style={[
                          styles.itemHighlight,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                    ) : null}
                    <Image
                      source={item.image}
                      resizeMode="contain"
                      style={styles.itemImage}
                    />
                    <View>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.itemName,
                          fonts.bold,
                          isSelected && { color: colors.primary },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={[styles.itemPeriod, styles.secondary]}>
                        {item.period}
                      </Text>
                    </View>
                  </PlatformPressable>
                );
              })}
            </UNSTABLE_LayoutRegionView>
          </UNSTABLE_LayoutRegionView>
        </ScrollView>
      </Animated.View>
      <Animated.View
        aria-hidden={!isWide && isSidebarVisible}
        style={{
          flex: 1,
          transform: [
            {
              translateX:
                !isWide && isSidebarVisible ? (isRTL ? '-100%' : '100%') : '0%',
            },
          ],
          transitionProperty: 'transform',
          transitionDuration: 300,
          transitionTimingFunction: 'ease-in-out',
        }}
      >
        <ScrollView key={selectedIndex} contentInsetAdjustmentBehavior="never">
          <UNSTABLE_LayoutRegionView
            {...(isBarRegionSupported
              ? { region: 'bar', onEdge: 'top', extent: BAR_HEIGHT }
              : { region: 'safeArea' })}
            edges={{ top: 'additive' }}
            style={styles.hero}
          >
            <Image
              source={dino.image}
              resizeMode="contain"
              style={styles.heroImage}
            />
          </UNSTABLE_LayoutRegionView>
          <UNSTABLE_LayoutRegionView
            region={isReadableContentSupported ? 'readableContent' : 'margins'}
            edges={{ bottom: 'additive', start: 'additive', end: 'additive' }}
            style={styles.article}
          >
            <Text role="heading" style={[styles.title, fonts.heavy]}>
              {dino.name}
            </Text>
            <Text style={[styles.subtitle, styles.secondary]}>
              {dino.period} · {dino.diet} · {dino.length}
            </Text>
            <Text style={styles.description}>{dino.description}</Text>
          </UNSTABLE_LayoutRegionView>
        </ScrollView>
        <UNSTABLE_LayoutRegionView
          {...(isBarRegionSupported
            ? { region: 'bar', onEdge: 'top', extent: BAR_HEIGHT }
            : { region: 'safeArea', cornerAdaptation: 'horizontal' })}
          edges={{ top: 'maximum', start: 'additive' }}
          style={styles.topBar}
        >
          <HeaderButton
            accessibilityLabel={
              isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'
            }
            onPress={() => setIsSidebarVisible(!isSidebarVisible)}
            style={buttonStyle}
          >
            <SFSymbol name="sidebar.left" size={17} color={colors.text} />
          </HeaderButton>
        </UNSTABLE_LayoutRegionView>
        <UNSTABLE_LayoutRegionView
          {...(isBarRegionSupported
            ? { region: 'bar', onEdge: 'end', extent: BAR_HEIGHT }
            : { region: 'safeArea' })}
          edges={{ top: 'maximum', end: 'maximum' }}
          style={styles.endBar}
        >
          <HeaderButton
            accessibilityLabel="Go back"
            onPress={navigation.goBack}
            style={buttonStyle}
          >
            <SFSymbol
              name="chevron.backward"
              size={21}
              color={colors.text}
              weight="semibold"
            />
          </HeaderButton>
        </UNSTABLE_LayoutRegionView>
      </Animated.View>
    </View>
  );
}

ComponentsLayoutRegionView.title = 'Components - Layout Region View';
ComponentsLayoutRegionView.linking = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  secondary: {
    opacity: 0.5,
  },
  sidebarMargins: {
    padding: 8,
  },
  sidebarContent: {
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemHighlight: {
    ...StyleSheet.absoluteFill,
    opacity: 0.12,
  },
  itemImage: {
    width: 56,
    height: 44,
  },
  itemName: {
    fontSize: 17,
  },
  itemPeriod: {
    fontSize: 13,
  },
  hero: {
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    maxWidth: 520,
    height: 300,
    marginTop: BAR_HEIGHT,
  },
  article: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 34,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  description: {
    fontSize: 17,
    lineHeight: 25,
    marginVertical: 20,
  },
  topBar: {
    position: 'absolute',
    paddingTop: isBarRegionSupported ? 0 : 16,
    paddingStart: 16,
  },
  endBar: {
    position: 'absolute',
    end: 0,
    paddingTop: isBarRegionSupported ? 0 : 16,
    paddingEnd: 16,
  },
});
