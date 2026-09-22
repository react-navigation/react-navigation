import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Button, Text, useHeaderHeight } from '@react-navigation/elements';
import {
  type StaticScreenProps,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  createStackScreen,
  HeaderStyleInterpolators,
  TransitionPresets,
} from '@react-navigation/stack';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Divider } from '../Shared/Divider';
import { ListGroupItem } from '../Shared/ListGroupItem';
import { ListItem } from '../Shared/LIstItem';

const CARD_ANIMATION_NAMES = [
  'forHorizontalIOS',
  'forVerticalIOS',
  'forModalPresentationIOS',
  'forFadeFromBottomAndroid',
  'forRevealFromBottomAndroid',
  'forScaleFromCenterAndroid',
  'forFadeFromRightAndroid',
  'forBottomSheetAndroid',
  'forDialogAndroid',
  'forFadeFromCenter',
  'forCrossDissolveIOS',
  'forFlipIOS',
  'forNoAnimation',
] satisfies readonly (keyof typeof CardStyleInterpolators)[];

const HEADER_ANIMATION_NAMES = [
  'forUIKit',
  'forFade',
  'forSlideLeft',
  'forSlideRight',
  'forSlideUp',
  'forNoAnimation',
] satisfies readonly (keyof typeof HeaderStyleInterpolators)[];

const TRANSITION_PRESET_NAMES = [
  'SlideFromRightIOS',
  'ModalSlideFromBottomIOS',
  'ModalPresentationIOS',
  'FadeFromBottomAndroid',
  'DialogAndroid',
  'RevealFromBottomAndroid',
  'ScaleFromCenterAndroid',
  'FadeFromRightAndroid',
  'BottomSheetAndroid',
  'ModalFadeTransition',
  'ModalFlipIOS',
  'CrossDissolveIOS',
  'DefaultTransition',
  'ModalTransition',
  'SlideFromLeftIOS',
] satisfies readonly (keyof typeof TransitionPresets)[];

type CardAnimationName = (typeof CARD_ANIMATION_NAMES)[number];
type HeaderAnimationName = (typeof HEADER_ANIMATION_NAMES)[number];
type TransitionPresetName = (typeof TRANSITION_PRESET_NAMES)[number];

type AnimationParams =
  | { transitionPreset: TransitionPresetName }
  | {
      cardAnimation: CardAnimationName;
      headerAnimation: HeaderAnimationName;
    };

function AnimationsScreen() {
  const navigation = useNavigation('StackAnimationList');

  const { colors } = useTheme();

  const [cardAnimation, setCardAnimation] =
    React.useState<CardAnimationName>('forHorizontalIOS');
  const [headerAnimation, setHeaderAnimation] =
    React.useState<HeaderAnimationName>('forUIKit');
  const [transitionPreset, setTransitionPreset] =
    React.useState<TransitionPresetName>();

  return (
    <ScrollView>
      <Button
        variant="filled"
        onPress={() => {
          if (transitionPreset !== undefined) {
            navigation.navigate('StackAnimationPreview', {
              transitionPreset,
            });
          } else {
            navigation.navigate('StackAnimationPreview', {
              cardAnimation,
              headerAnimation,
            });
          }
        }}
        style={styles.button}
      >
        Preview animation
      </Button>
      <ListGroupItem title="Transition presets">
        {TRANSITION_PRESET_NAMES.map((name) => (
          <React.Fragment key={name}>
            <ListItem title={name} onPress={() => setTransitionPreset(name)}>
              {transitionPreset === name ? (
                <MaterialDesignIcons
                  name="check"
                  color={colors.primary}
                  size={24}
                />
              ) : null}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </ListGroupItem>
      <ListGroupItem title="Card style interpolators">
        {CARD_ANIMATION_NAMES.map((name) => (
          <React.Fragment key={name}>
            <ListItem
              title={name}
              onPress={() => {
                setTransitionPreset(undefined);
                setCardAnimation(name);
              }}
            >
              {transitionPreset === undefined && cardAnimation === name ? (
                <MaterialDesignIcons
                  name="check"
                  color={colors.primary}
                  size={24}
                />
              ) : null}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </ListGroupItem>
      <ListGroupItem title="Header style interpolators">
        {HEADER_ANIMATION_NAMES.map((name) => (
          <React.Fragment key={name}>
            <ListItem
              title={name}
              onPress={() => {
                setTransitionPreset(undefined);
                setHeaderAnimation(name);
              }}
            >
              {transitionPreset === undefined && headerAnimation === name ? (
                <MaterialDesignIcons
                  name="check"
                  color={colors.primary}
                  size={24}
                />
              ) : null}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </ListGroupItem>
    </ScrollView>
  );
}

function AnimationScreen({ route }: StaticScreenProps<AnimationParams>) {
  const navigation = useNavigation('StackAnimationPreview');

  const headerHeight = useHeaderHeight();

  return (
    <View style={styles.content}>
      {'transitionPreset' in route.params ? (
        <>
          <Text style={styles.description}>Preset</Text>
          <Text style={styles.name}>{route.params.transitionPreset}</Text>
        </>
      ) : (
        <>
          <Text style={styles.description}>Card</Text>
          <Text style={styles.name}>{route.params.cardAnimation}</Text>
          <Text style={[styles.description, styles.headerDescription]}>
            Header
          </Text>
          <Text style={styles.name}>{route.params.headerAnimation}</Text>
        </>
      )}
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.push('StackAnimationPreview', route.params)}
        >
          Push again
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <View style={{ height: headerHeight }} />
    </View>
  );
}

const StackAnimationsNavigator = createStackNavigator({
  screenOptions: {
    animation: 'default',
    gestureEnabled: true,
  },
  screens: {
    StackAnimationList: createStackScreen({
      screen: AnimationsScreen,
      options: { title: 'Animations' },
    }),
    StackAnimationPreview: createStackScreen({
      screen: AnimationScreen,
      options: ({ route }) =>
        'transitionPreset' in route.params
          ? {
              ...TransitionPresets[route.params.transitionPreset],
              title: 'Animation',
            }
          : {
              title: 'Animation',
              cardStyleInterpolator:
                CardStyleInterpolators[route.params.cardAnimation],
              headerStyleInterpolator:
                HeaderStyleInterpolators[route.params.headerAnimation],
            },
    }),
  },
});

export const StackAnimations = {
  screen: StackAnimationsNavigator,
  title: 'Stack - Animations',
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  description: {
    fontSize: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerDescription: {
    marginTop: 12,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  button: {
    marginHorizontal: 16,
    marginTop: 16,
  },
});
