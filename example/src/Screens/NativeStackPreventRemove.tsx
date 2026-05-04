import { Button } from '@react-navigation/elements';
import {
  CommonActions,
  useNavigation,
  usePreventRemove,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
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

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = () => {
  const route = useRoute('Article');
  const navigation = useNavigation('Article');

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
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

const InputScreen = () => {
  const navigation = useNavigation('Input');
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
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
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
    </ScrollView>
  );
};

const NativeStackPreventRemoveNavigator = createNativeStackNavigator({
  screens: {
    Input: createNativeStackScreen({
      screen: InputScreen,
      options: {
        presentation: 'modal',
      },
    }),
    Article: createNativeStackScreen({
      screen: ArticleScreen,
      linking: COMMON_LINKING_CONFIG.Article,
    }),
  },
});

export const NativeStackPreventRemove = {
  screen: NativeStackPreventRemoveNavigator,
  title: 'Native Stack - Prevent Remove',
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
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
