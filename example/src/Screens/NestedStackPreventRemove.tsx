import { Button } from '@react-navigation/elements';
import { useNavigation, useTheme } from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
} from '@react-navigation/stack';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, TextInput } from 'react-native';

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

        const discard = confirm(
          'You have unsaved changes. Discard them and leave the screen?'
        );

        if (discard) {
          navigation.dispatch(e.data.action);
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
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Button
        variant="tinted"
        color="tomato"
        onPress={() => {
          if (Platform.OS === 'web') {
            // Jump back past the dirty `Form` so it's removed by a nested-state `resetRoot`
            window.history.go(-2);
          }
        }}
      >
        Jump back 2 entries (browser)
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
