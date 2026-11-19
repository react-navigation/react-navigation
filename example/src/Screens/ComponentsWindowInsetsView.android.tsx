import {
  HeaderButton,
  PlatformPressable,
  Text,
  useFrameSize,
} from '@react-navigation/elements';
import { Color } from '@react-navigation/elements/internal';
import {
  MaterialSymbol,
  type StaticScreenProps,
  UNSTABLE_WindowInsetsView,
  useLocale,
  useNavigation,
  useTheme,
  type WindowInsetsChangeEvent,
  type WindowInsetsType,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  type ImageSourcePropType,
  Keyboard,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  cubicBezier,
  useAnimatedStyle,
  useEvent,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const SIDEBAR_WIDTH = 300;
const ICON_BUTTON_SIZE = 40;
const TOP_BAR_PADDING = 8;

const EASING_STANDARD = cubicBezier(0.2, 0, 0, 1);

const SAFE_AREA_TYPES: WindowInsetsType[] = [
  'systemBars',
  'displayCutout',
  'custom',
];

const KEYBOARD_TYPES: WindowInsetsType[] = [...SAFE_AREA_TYPES, 'ime'];

const AnimatedWindowInsetsView = Animated.createAnimatedComponent(
  UNSTABLE_WindowInsetsView
);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

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

export function ComponentsWindowInsetsView(_: StaticScreenProps<{}>) {
  const navigation = useNavigation();
  const { colors, fonts, dark } = useTheme();
  const { direction } = useLocale();
  const insets = useSafeAreaInsets();
  const isWide = useFrameSize((frame) => frame.width >= 700);
  const heroHeight = useFrameSize((frame) => Math.min(300, frame.height * 0.4));

  const [dino, setDino] = React.useState(DINOS[0]);
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);

  // FIXME: We can measure the first insets before the animated event handler is attached
  // So we start with the safe area insets until we receive a measurement
  const bottomInset = useSharedValue(insets.bottom);

  const onInsetsChange = useEvent<
    NativeSyntheticEvent<WindowInsetsChangeEvent>
  >(
    (event) => {
      'worklet';

      bottomInset.set(event.insets.bottom);
    },
    ['onInsetsChange']
  );

  const composerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -bottomInset.get() }],
  }));

  const placeholderTextColor =
    Color(colors.text)?.alpha(0.7).string() ?? colors.text;

  const pressColor =
    Color(colors.text)?.alpha(0.1).string() ??
    (dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)');

  const margin = isWide ? 24 : 16;

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
          transitionTimingFunction: EASING_STANDARD,
          backgroundColor: colors.card,
        }}
      >
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.fill}>
          <UNSTABLE_WindowInsetsView
            types={SAFE_AREA_TYPES}
            edges={{ top: 'additive', start: 'additive', end: 'additive' }}
            style={styles.sidebarContent}
          >
            <HeaderButton
              accessibilityLabel="Go back"
              onPress={navigation.goBack}
              pressColor={pressColor}
              style={[styles.iconButton, styles.backButton]}
            >
              <MaterialSymbol name="arrow_back" color={colors.text} />
            </HeaderButton>
            {DINOS.map((item) => {
              const isSelected = item.name === dino.name;

              return (
                <View key={item.name} style={styles.itemContainer}>
                  <PlatformPressable
                    aria-selected={isSelected}
                    onPress={() => {
                      setDino(item);
                      Keyboard.dismiss();

                      if (!isWide) {
                        setIsSidebarVisible(false);
                      }
                    }}
                    pressColor={pressColor}
                    style={styles.item}
                  >
                    {isSelected && isWide ? (
                      <View
                        style={[
                          styles.itemHighlight,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                    ) : null}
                    <Image
                      source={item.image}
                      resizeMethod="resize"
                      resizeMode="contain"
                      style={styles.itemImage}
                    />
                    <View style={styles.fill}>
                      <Text
                        numberOfLines={1}
                        style={[styles.itemName, fonts.medium]}
                      >
                        {item.name}
                      </Text>
                      <Text numberOfLines={1} style={styles.secondary}>
                        {item.period}
                      </Text>
                    </View>
                  </PlatformPressable>
                </View>
              );
            })}
          </UNSTABLE_WindowInsetsView>
        </ScrollView>
        <UNSTABLE_WindowInsetsView
          types={KEYBOARD_TYPES}
          edges={{ bottom: 'additive', start: 'additive', end: 'additive' }}
          style={{ ...styles.sidebarInputArea, paddingBottom: margin }}
        >
          <TextInput
            disableFullscreenUI
            accessibilityLabel="Sidebar input"
            placeholder="Type here"
            placeholderTextColor={placeholderTextColor}
            style={[
              styles.input,
              {
                backgroundColor: pressColor,
                color: colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          />
        </UNSTABLE_WindowInsetsView>
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
          transitionTimingFunction: EASING_STANDARD,
        }}
      >
        <ScrollView key={dino.name}>
          <UNSTABLE_WindowInsetsView
            types={SAFE_AREA_TYPES}
            edges={{ top: 'additive', start: 'additive', end: 'additive' }}
            style={styles.hero}
          >
            <Image
              source={dino.image}
              resizeMethod="resize"
              resizeMode="contain"
              style={[styles.heroImage, { height: heroHeight }]}
            />
          </UNSTABLE_WindowInsetsView>
          <UNSTABLE_WindowInsetsView
            types={KEYBOARD_TYPES}
            edges={{ bottom: 'additive', start: 'additive', end: 'additive' }}
            style={{ ...styles.article, paddingHorizontal: margin }}
          >
            <Text role="heading" style={styles.title}>
              {dino.name}
            </Text>
            <Text style={[styles.secondary, styles.subtitle]}>
              {dino.period} · {dino.diet} · {dino.length}
            </Text>
            <Text style={styles.description}>{dino.description}</Text>
          </UNSTABLE_WindowInsetsView>
        </ScrollView>
        <View
          style={[
            styles.statusBar,
            { height: insets.top, backgroundColor: colors.background },
          ]}
        />
        <UNSTABLE_WindowInsetsView
          types={SAFE_AREA_TYPES}
          edges={{ top: 'additive', start: 'additive', end: 'additive' }}
          style={{ ...styles.topBar, paddingHorizontal: margin }}
        >
          <HeaderButton
            accessibilityLabel={
              isWide
                ? isSidebarVisible
                  ? 'Hide sidebar'
                  : 'Show sidebar'
                : 'Back to dinosaurs'
            }
            onPress={() => {
              Keyboard.dismiss();
              setIsSidebarVisible(!isSidebarVisible);
            }}
            pressColor={pressColor}
            style={[styles.iconButton, { backgroundColor: colors.card }]}
          >
            <MaterialSymbol
              name={isWide ? 'side_navigation' : 'arrow_back'}
              color={colors.text}
            />
          </HeaderButton>
        </UNSTABLE_WindowInsetsView>
        <AnimatedWindowInsetsView
          types={KEYBOARD_TYPES}
          edges={{ start: 'additive', end: 'additive' }}
          onInsetsChange={onInsetsChange}
          style={{
            ...styles.composerArea,
            paddingHorizontal: margin,
            paddingBottom: margin,
          }}
        >
          <AnimatedTextInput
            disableFullscreenUI
            accessibilityLabel="Detail input"
            placeholder="Type here"
            placeholderTextColor={placeholderTextColor}
            style={[
              styles.input,
              styles.composer,
              {
                backgroundColor: colors.card,
                color: colors.text,
                textAlign: isRTL ? 'right' : 'left',
              },
              composerStyle,
            ]}
          />
        </AnimatedWindowInsetsView>
      </Animated.View>
    </View>
  );
}

ComponentsWindowInsetsView.title = 'Components - Window Insets View';
ComponentsWindowInsetsView.linking = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  secondary: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    opacity: 0.7,
  },
  sidebarContent: {
    paddingHorizontal: 12,
    paddingTop: TOP_BAR_PADDING,
    paddingBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginStart: -8,
    marginBottom: 8,
  },
  itemContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 72,
    paddingVertical: 8,
    paddingStart: 8,
    paddingEnd: 24,
  },
  itemHighlight: {
    ...StyleSheet.absoluteFill,
    opacity: 0.12,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  sidebarInputArea: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  input: {
    height: 56,
    paddingHorizontal: 24,
    paddingVertical: 0,
    borderRadius: 28,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  hero: {
    alignItems: 'center',
    paddingTop: TOP_BAR_PADDING + ICON_BUTTON_SIZE,
  },
  heroImage: {
    width: '100%',
    maxWidth: 520,
  },
  article: {
    paddingTop: 24,
    paddingBottom: 96,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    marginTop: 16,
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    alignItems: 'flex-start',
    paddingTop: TOP_BAR_PADDING,
  },
  iconButton: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    minWidth: ICON_BUTTON_SIZE,
    minHeight: ICON_BUTTON_SIZE,
    borderRadius: ICON_BUTTON_SIZE / 2,
  },
  composerArea: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  composer: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
  },
});
