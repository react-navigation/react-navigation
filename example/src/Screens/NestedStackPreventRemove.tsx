import { Button } from '@react-navigation/elements';
import {
  CommonActions,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
} from '@react-navigation/stack';
import * as React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

const Step1Screen = () => {
  const navigation = useNavigation('Step1');

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Button variant="filled" onPress={() => navigation.push('Form')}>
        Push Form
      </Button>
    </ScrollView>
  );
};

const FormScreen = () => {
  const navigation = useNavigation('Form');
  const [text, setText] = React.useState('');
  const { colors } = useTheme();

  const hasUnsavedChanges = Boolean(text);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!hasUnsavedChanges) {
          return;
        }

        e.preventDefault();

        const message =
          'You have unsaved changes. Discard them and leave the screen?';

        if (Platform.OS === 'web') {
          if (confirm(message)) {
            navigation.dispatch(e.data.action);
          }
        } else {
          Alert.alert('Discard changes?', message, [
            { text: "Don't leave", style: 'cancel', onPress: () => {} },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]);
        }
      }),
    [hasUnsavedChanges, navigation]
  );

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      <TextInput
        autoFocus
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        value={text}
        placeholder="Type something…"
        onChangeText={setText}
      />
      <Button variant="filled" onPress={() => navigation.push('Step3')}>
        Push Step 3
      </Button>
    </ScrollView>
  );
};

const Step3Screen = () => {
  const navigation = useNavigation('Step3');

  const removeForm = () => {
    if (Platform.OS === 'web') {
      // Two entries back (not one) forces `useLinking`'s `resetRoot` instead of `goBack`
      window.history.go(-2);
      return;
    }

    // No browser history on native: reproduce the `resetRoot` shape directly (what deep links and
    // state restoration produce) — keep this nested stack's route key, pop it back to the first screen.
    const parent = navigation.getParent();
    const parentState = parent?.getState();

    if (!parent || !parentState) {
      return;
    }

    parent.dispatch(
      CommonActions.reset({
        ...parentState,
        routes: parentState.routes.map((route, index) => {
          const nested = route.state;

          if (index !== parentState.index || !nested) {
            return route;
          }

          return {
            ...route,
            state: { ...nested, index: 0, routes: nested.routes.slice(0, 1) },
          };
        }),
      })
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Button variant="tinted" color="tomato" onPress={removeForm}>
        Go back past Form
      </Button>
    </ScrollView>
  );
};

const NestedStackPreventRemoveNavigator = createStackNavigator({
  screens: {
    Step1: createStackScreen({
      screen: Step1Screen,
    }),
    Form: createStackScreen({
      screen: FormScreen,
      linking: { path: 'form' },
    }),
    Step3: createStackScreen({
      screen: Step3Screen,
      linking: { path: 'step3' },
    }),
  },
});

export const NestedStackPreventRemove = {
  screen: NestedStackPreventRemoveNavigator,
  title: 'Nested Stack - Prevent Remove',
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 12,
    padding: 12,
  },
  input: {
    padding: 12,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
});
