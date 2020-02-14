import * as React from 'react';
import { Animated, View, StyleSheet, ScrollView } from 'react-native';
import { Button, Paragraph, Appbar } from 'react-native-paper';
import { RouteProp, ParamListBase, useTheme } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import Article from '../Shared/Article';

type SimpleStackParams = {
  Article: { author: string };
  Dialog: undefined;
  BottomSheet: undefined;
};

type SimpleStackNavigation = StackNavigationProp<SimpleStackParams>;

const ArticleScreen = ({
  navigation,
  route,
}: {
  navigation: SimpleStackNavigation;
  route: RouteProp<SimpleStackParams, 'Article'>;
}) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Dialog')}
          style={styles.button}
        >
          Show Dialog
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.push('BottomSheet')}
          style={styles.button}
        >
          Show Sheet
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <Article author={{ name: route.params.author }} scrollEnabled={false} />
    </ScrollView>
  );
};

const DialogScreen = ({
  navigation,
}: {
  navigation: SimpleStackNavigation;
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.dialogContainer}>
      <View style={[styles.dialog, { backgroundColor: colors.card }]}>
        <Paragraph>
          Mise en place is a French term that literally means “put in place.” It
          also refers to a way cooks in professional kitchens and restaurants
          set up their work stations—first by gathering all ingredients for a
          recipes, partially preparing them (like measuring out and chopping),
          and setting them all near each other. Setting up mise en place before
          cooking is another top tip for home cooks, as it seriously helps with
          organization. It’ll pretty much guarantee you never forget to add an
          ingredient and save you time from running back and forth from the
          pantry ten times.
        </Paragraph>
        <Button style={styles.close} compact onPress={navigation.goBack}>
          Okay
        </Button>
      </View>
    </View>
  );
};

const BottomSheetScreen = ({
  navigation,
}: {
  navigation: SimpleStackNavigation;
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.bottomSheetContainer} pointerEvents="box-none">
      <Appbar.Header style={styles.bottomSheetHeader}>
        <Appbar.Content title="Mise en place" subtitle="French term" />
      </Appbar.Header>

      <View style={[styles.bottomSheet, { backgroundColor: colors.card }]}>
        <Paragraph>
          Mise en place is a French term that literally means “put in place.” It
          also refers to a way cooks in professional kitchens and restaurants
          set up their work stations—first by gathering all ingredients for a
          recipes, partially preparing them (like measuring out and chopping),
          and setting them all near each other. Setting up mise en place before
          cooking is another top tip for home cooks, as it seriously helps with
          organization. It’ll pretty much guarantee you never forget to add an
          ingredient and save you time from running back and forth from the
          pantry ten times.
        </Paragraph>
        <Button style={styles.close} compact onPress={navigation.goBack}>
          Okay
        </Button>
      </View>
    </View>
  );
};

const SimpleStack = createStackNavigator<SimpleStackParams>();

type Props = Partial<React.ComponentProps<typeof SimpleStack.Navigator>> & {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function SimpleStackScreen({ navigation, ...rest }: Props) {
  navigation.setOptions({
    headerShown: false,
  });

  return (
    <SimpleStack.Navigator mode="modal" {...rest}>
      <SimpleStack.Screen
        name="Article"
        component={ArticleScreen}
        initialParams={{ author: 'Gandalf' }}
      />
      <SimpleStack.Screen
        name="Dialog"
        component={DialogScreen}
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
              transform: [
                {
                  scale: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp',
              }),
            },
          }),
        }}
      />
      <SimpleStack.Screen
        name="BottomSheet"
        component={BottomSheetScreen}
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: false,
          cardStyleInterpolator: ({
            current,
            inverted,
            layouts: { screen },
          }) => {
            const translateY = Animated.multiply(
              current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [screen.height, 0],
                extrapolate: 'clamp',
              }),
              inverted
            );

            return {
              cardStyle: {
                transform: [{ translateY }],
              },
            };
          },
        }}
      />
    </SimpleStack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    padding: 8,
  },
  button: {
    margin: 4,
  },
  dialogContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    padding: 16,
    width: '90%',
    maxWidth: 400,
    borderRadius: 3,
  },
  bottomSheetContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottomSheetHeader: {
    width: '100%',
    height: 64,
  },
  bottomSheet: {
    padding: 16,
    width: '100%',
    maxWidth: 400,
    margin: 0,
  },
  close: {
    alignSelf: 'flex-end',
  },
});
