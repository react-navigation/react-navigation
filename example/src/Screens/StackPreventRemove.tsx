import { Button } from '@react-navigation/elements';
import {
  CommonActions,
  useNavigation,
  useRoute,
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
  View,
} from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Article } from '../Shared/Article';

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = () => {
  const route = useRoute('Article');
  const navigation = useNavigation('Article');

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

const InputScreen = () => {
  const navigation = useNavigation('Input');
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

        if (Platform.OS === 'web') {
          const discard = confirm(
            'You have unsaved changes. Discard them and leave the screen?'
          );

          if (discard) {
            navigation.dispatch(e.data.action);
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
                onPress: () => navigation.dispatch(e.data.action),
              },
            ]
          );
        }
      }),
    [hasUnsavedChanges, navigation]
  );

  return (
    <View style={styles.content}>
      <TextInput
        autoFocus
        style={[
          styles.input,
          { backgroundColor: colors?.card, color: colors?.text },
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

const StackPreventRemoveNavigator = createStackNavigator({
  screens: {
    Input: createStackScreen({
      screen: InputScreen,
    }),
    Article: createStackScreen({
      screen: ArticleScreen,
      linking: COMMON_LINKING_CONFIG.Article,
    }),
  },
});

export const StackPreventRemove = {
  screen: StackPreventRemoveNavigator,
  title: 'Stack - Prevent Remove',
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
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
});
