import { Button, Text } from '@react-navigation/elements';
import type { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { StyleSheet, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

type FormSheetParams = {
  paragraphs?: number;
};

export type FormSheetConfig = {
  name: string;
  options: NativeStackNavigationOptions;
  params?: FormSheetParams;
};

const FORM_SHEETS: Record<string, FormSheetConfig> = {
  FormSheetViewFitToContents: {
    name: 'Fit To Contents',
    options: {
      sheetAllowedDetents: 'fitToContents',
    },
  },
  FormSheetViewHeightsArray: {
    name: 'Height Steps',
    options: {
      sheetAllowedDetents: [0.24, 0.41, 0.7],
    },
    params: {
      paragraphs: 3,
    },
  },
  FormSheetViewNoRoundedCorners: {
    name: 'No Rounded Corners',
    options: {
      sheetAllowedDetents: 'fitToContents',
      sheetCornerRadius: 0,
    },
  },
  FormSheetViewWithGrabber: {
    name: 'Grabber Visible',
    options: {
      sheetAllowedDetents: 'fitToContents',
      sheetGrabberVisible: true,
    },
  },
  FormSheetViewDimming: {
    name: 'Dimming',
    options: {
      sheetAllowedDetents: [0.24, 0.41, 0.7],
      sheetLargestUndimmedDetentIndex: 0,
    },
    params: {
      paragraphs: 3,
    },
  },
  FormSheetViewInitialDetent: {
    name: 'Initial Detent',
    options: {
      sheetAllowedDetents: [0.24, 0.41, 0.7],
      sheetInitialDetentIndex: 'last',
    },
    params: {
      paragraphs: 3,
    },
  },
  FormSheetViewScrollingExpand: {
    name: 'Lock Expanding With Scrolling',
    options: {
      sheetAllowedDetents: [0.41],
      sheetExpandsWhenScrolledToEdge: false,
    },
    params: {
      paragraphs: 10,
    },
  },
};

export type RouteParamList = {
  Main: undefined;
  FormSheet: FormSheetParams;
} & {
  [Key in keyof typeof FORM_SHEETS]: FormSheetParams;
};

type RouteProps<RouteName extends keyof RouteParamList> = {
  navigation: NativeStackNavigationProp<RouteParamList, RouteName>;
  route: RouteProp<RouteParamList, RouteName>;
};

const Stack = createNativeStackNavigator<RouteParamList>();

function Main({ navigation }: RouteProps<'Main'>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.buttons}>
        {Object.entries(FORM_SHEETS).map(([key, value]) => (
          <Button
            key={key}
            variant="filled"
            onPress={() =>
              navigation.navigate(
                key as keyof typeof FORM_SHEETS,
                value.params ?? {}
              )
            }
          >
            {value.name}
          </Button>
        ))}

        <Button variant="tinted" onPress={() => navigation.pop()}>
          Pop screen
        </Button>
      </View>
    </View>
  );
}

function FormSheetView<T extends keyof typeof FORM_SHEETS>({
  navigation,
  route,
}: RouteProps<T>) {
  const paragraph =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ' +
    'aliquam justo at dolor condimentum tincidunt. Proin velit nibh, ' +
    'efficitur non metus a, egestas semper nisi. Proin egestas neque ' +
    'sollicitudin magna semper, id ultrices urna egestas. Aliquam vitae ' +
    'libero vestibulum, ultrices mauris vel, facilisis turpis. Morbi ac ' +
    'volutpat ipsum.';

  const paragraphs =
    route.params?.paragraphs === undefined ? 1 : route.params.paragraphs;

  const textContent = Array(paragraphs).fill(paragraph).join('\n\n');

  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{
            paddingTop: 20,
            justifyContent: 'center',
            ...styles.buttons,
          }}
        >
          <Button onPress={() => navigation.goBack()} color="red">
            Close
          </Button>
        </View>

        <View style={{ paddingVertical: 10, paddingHorizontal: 20, flex: 1 }}>
          <Text>{textContent}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TextInput
            style={{
              marginVertical: 12,
              paddingVertical: 8,
              paddingHorizontal: 10,
              backgroundColor: 'lightgray',
              borderRadius: 24,
              width: '80%',
            }}
            placeholder="Trigger keyboard..."
          />
        </View>
      </ScrollView>
    </View>
  );
}

export function FormSheet() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={Main}
        options={{
          title: 'Form Sheet',
        }}
      />
      {Object.entries(FORM_SHEETS).map(([key, value]) => (
        <Stack.Screen
          key={key}
          name={key as keyof typeof FORM_SHEETS}
          component={FormSheetView}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            ...value.options,
          }}
        />
      ))}
    </Stack.Navigator>
  );
}

FormSheet.title = 'Form Sheet';
FormSheet.linking = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'column',
    gap: 12,
    padding: 12,
  },
});
