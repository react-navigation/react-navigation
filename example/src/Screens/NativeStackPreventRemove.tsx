import { Button } from '@react-navigation/elements';
import { type PathConfigMap, usePreventRemove } from '@react-navigation/native';
import { CommonActions, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Article } from '../Shared/Article';

export type NativePreventRemoveParams = {
  Article: { author: string };
  Input: undefined;
};

const linking: PathConfigMap<NativePreventRemoveParams> = {
  Article: COMMON_LINKING_CONFIG.Article,
  Input: 'input',
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<NativePreventRemoveParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Input')}>
          Push Input
        </Button>
        <Button variant="tinted" onPress={() => navigation.popToTop()}>
          Pop to top
        </Button>
      </View>
      <Article
        author={{ name: route.params?.author ?? 'Unknown' }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const InputScreen = ({
  navigation,
}: NativeStackScreenProps<NativePreventRemoveParams, 'Input'>) => {
  const [text, setText] = React.useState('');
  const { colors } = useTheme();

  const hasUnsavedChanges = Boolean(text);

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    if (Platform.OS === 'web') {
      const discard = confirm(
        'You have unsaved changes. Discard them and leave the screen?'
      );
      if (discard) {
        navigation.dispatch(data.action);
      }
    } else {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Discard them and leave the screen?',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => {} },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(data.action),
          },
        ]
      );
    }
  });

  return (
    <View style={styles.content}>
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
      <Button
        variant="tinted"
        color="tomato"
        onPress={() =>
          navigation.dispatch({
            ...CommonActions.goBack(),
            payload: { confirmed: true },
          })
        }
      >
        Discard and go back
      </Button>
      <Button
        variant="tinted"
        onPress={() => navigation.push('Article', { author: text })}
      >
        Push Article
      </Button>
    </View>
  );
};

const Stack = createNativeStackNavigator<NativePreventRemoveParams>();

export function NativeStackPreventRemove() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Input"
        component={InputScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="Article" component={ArticleScreen} />
    </Stack.Navigator>
  );
}

NativeStackPreventRemove.title = 'Prevent removing screen in Native Stack';
NativeStackPreventRemove.linking = linking;

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
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
