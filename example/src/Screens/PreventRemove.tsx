import * as React from 'react';
import {
  Alert,
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Button } from 'react-native-paper';
import {
  useTheme,
  CommonActions,
  ParamListBase,
  NavigationAction,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import Article from '../Shared/Article';

type PreventRemoveParams = {
  Article: { author: string };
  Input: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<PreventRemoveParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Input')}
          style={styles.button}
        >
          Push Input
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.popToTop()}
          style={styles.button}
        >
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
}: StackScreenProps<PreventRemoveParams, 'Input'>) => {
  const [text, setText] = React.useState('');
  const { colors } = useTheme();

  const hasUnsavedChanges = Boolean(text);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        const action: NavigationAction & { payload?: { confirmed?: boolean } } =
          e.data.action;

        if (!hasUnsavedChanges || action.payload?.confirmed) {
          return;
        }

        e.preventDefault();

        if (Platform.OS === 'web') {
          const discard = confirm(
            'You have unsaved changes. Discard them and leave the screen?'
          );

          if (discard) {
            navigation.dispatch(action);
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
                onPress: () => navigation.dispatch(action),
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
          { backgroundColor: colors.card, color: colors.text },
        ]}
        value={text}
        placeholder="Type something…"
        onChangeText={setText}
      />
      <Button
        mode="outlined"
        color="tomato"
        onPress={() =>
          navigation.dispatch({
            ...CommonActions.goBack(),
            payload: { confirmed: true },
          })
        }
        style={styles.button}
      >
        Discard and go back
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.push('Article', { author: text })}
        style={styles.button}
      >
        Push Article
      </Button>
    </View>
  );
};

const SimpleStack = createStackNavigator<PreventRemoveParams>();

type Props = StackScreenProps<ParamListBase>;

export default function SimpleStackScreen({ navigation }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SimpleStack.Navigator>
      <SimpleStack.Screen name="Input" component={InputScreen} />
      <SimpleStack.Screen name="Article" component={ArticleScreen} />
    </SimpleStack.Navigator>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  buttons: {
    flexDirection: 'row',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
