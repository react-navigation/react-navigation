import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, type Icon, Text } from '@react-navigation/elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
  useSuspenseQueries,
  useSuspenseQuery,
} from '@tanstack/react-query';
import * as React from 'react';
import { useEffect } from 'react';
import {
  type ImageSourcePropType,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import iconBookOpen from '../../assets/icons/book-open.png';
import iconPawPrint from '../../assets/icons/paw-print.png';
import iconSwords from '../../assets/icons/swords.png';
import brachiosaurus from '../../assets/showcase/dinos/brachiosaurus.png';
import spinosaurus from '../../assets/showcase/dinos/spinosaurus.png';
import stegosaurus from '../../assets/showcase/dinos/stegosaurus.png';
import triceratops from '../../assets/showcase/dinos/triceratops.png';
import tyrannosaurusRex from '../../assets/showcase/dinos/tyrannosaurus-rex.png';
import velociraptor from '../../assets/showcase/dinos/velociraptor.png';
import { ErrorBoundary } from '../Shared/ErrorBoundary';

const queryClient = new QueryClient();

let shouldFailNextLoad = false;

type Dino = {
  id: string;
  name: string;
  description: string;
  image: ImageSourcePropType;
};

const DINOS: Dino[] = [
  {
    id: '1',
    name: 'Tyrannosaurus rex',
    description:
      'One of the largest land predators ever discovered, with bone-crushing jaws and powerful senses. It lived in western North America during the late Cretaceous.',
    image: tyrannosaurusRex,
  },
  {
    id: '2',
    name: 'Triceratops',
    description:
      'An iconic three-horned dinosaur with a massive bony frill. One of the last non-avian dinosaurs, it lived alongside Tyrannosaurus in late Cretaceous North America.',
    image: triceratops,
  },
  {
    id: '3',
    name: 'Velociraptor',
    description:
      'A small dromaeosaur from late Cretaceous Mongolia. It likely had a feathered covering and was much smaller than its popular movie depiction.',
    image: velociraptor,
  },
  {
    id: '4',
    name: 'Stegosaurus',
    description:
      'Recognizable by its double row of plates and spiked tail. Although it had a small brain for its body size, it was closer to the size of a plum than the old "walnut-sized brain" myth suggests.',
    image: stegosaurus,
  },
  {
    id: '5',
    name: 'Brachiosaurus',
    description:
      'A towering sauropod with front legs longer than its hind legs, giving it a giraffe-like posture. Full-body reconstructions rely partly on its close relative Giraffatitan because no complete Brachiosaurus skeleton is known.',
    image: brachiosaurus,
  },
  {
    id: '6',
    name: 'Spinosaurus',
    description:
      'A huge spinosaurid with a distinctive sail on its back and a long, crocodile-like snout. Evidence suggests it spent much of its time in and around water and fed heavily on fish.',
    image: spinosaurus,
  },
];

const TEAM_DINO_IDS = ['1', '2', '3', '4'] as const;
const BATTLE_DINO_IDS = ['5', '6'] as const;

const dinoQuery = (id: string) =>
  queryOptions({
    queryKey: ['dino', id] as const,
    queryFn: () =>
      new Promise<Dino>((resolve, reject) => {
        setTimeout(
          () => {
            if (shouldFailNextLoad) {
              shouldFailNextLoad = false;
              reject(new Error('Failed to load dinosaur.'));
            } else {
              const match = DINOS.find((item) => item.id === id);

              if (match) {
                resolve(match);
              } else {
                reject(new Error('Dinosaur not found.'));
              }
            }
          },
          shouldFailNextLoad ? 50 : id === '1' ? 10 : id === '2' ? 50 : 8000
        );
      }),
  });

function DinoCatalogScreen() {
  const navigation = useNavigation('DinoCatalog');

  return (
    <View style={styles.content}>
      <View style={styles.buttons}>
        {DINOS.map((item) => (
          <Button
            key={item.id}
            onPress={() => {
              navigation.navigate('DinoDetail', { id: item.id });
            }}
            style={styles.button}
          >
            {item.name}
          </Button>
        ))}
        <Button
          onPress={() => {
            shouldFailNextLoad = true;
            queryClient.removeQueries({ queryKey: ['dino'] });
          }}
          style={styles.button}
        >
          Make next load fail
        </Button>
        <Button
          onPress={() => queryClient.removeQueries({ queryKey: ['dino'] })}
          style={styles.button}
        >
          Clear all cache
        </Button>
      </View>
    </View>
  );
}

function DinoDetailScreen() {
  const route = useRoute('DinoDetail');

  const { data } = useSuspenseQuery(dinoQuery(route.params.id));

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>{data.name}</Text>
      <Text style={styles.description}>{data.description}</Text>
    </View>
  );
}

function DinoTeamScreen() {
  const data = useSuspenseQueries({
    queries: TEAM_DINO_IDS.map(dinoQuery),
  });

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>Current Team</Text>
      <Text style={styles.description}>
        {data.map((item) => item.data.name).join(', ')}
      </Text>
      <Button
        onPress={() => {
          TEAM_DINO_IDS.forEach((id) => {
            queryClient.removeQueries({ queryKey: dinoQuery(id).queryKey });
          });
        }}
        style={styles.button}
      >
        Clear screen&apos;s cache
      </Button>
    </View>
  );
}

function DinoBattleScreen() {
  const data = useSuspenseQueries({
    queries: BATTLE_DINO_IDS.map(dinoQuery),
  });

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>Battle</Text>
      <Text style={styles.description}>
        {data.map((item) => item.data.name).join(' vs ')}
      </Text>
      <Button
        onPress={() => {
          BATTLE_DINO_IDS.forEach((id) => {
            queryClient.removeQueries({ queryKey: dinoQuery(id).queryKey });
          });
        }}
        style={styles.button}
      >
        Clear screen&apos;s cache
      </Button>
    </View>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <React.Suspense
        fallback={
          <View style={styles.content}>
            <Text style={styles.description}>Loading…</Text>
          </View>
        }
      >
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}

function Provider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const LoaderTabs = createBottomTabNavigator({
  screenOptions: {
    lazy: true,
  },
  screens: {
    DinoList: {
      screen: DinoCatalogScreen,
      options: {
        title: 'Catalog',
        tabBarIcon: Platform.select<Icon>({
          ios: { type: 'sfSymbol', name: 'book' },
          android: { type: 'materialSymbol', name: 'menu_book' },
          default: { type: 'image', source: iconBookOpen },
        }),
      },
    },
    DinoTeam: {
      screen: DinoTeamScreen,
      options: {
        title: 'Team',
        tabBarIcon: Platform.select<Icon>({
          ios: { type: 'sfSymbol', name: 'pawprint' },
          android: { type: 'materialSymbol', name: 'pets' },
          default: { type: 'image', source: iconPawPrint },
        }),
      },
      UNSTABLE_loader: async () => {
        await Promise.all(
          TEAM_DINO_IDS.map((id) => queryClient.ensureQueryData(dinoQuery(id)))
        );
      },
    },
    DinoBattle: {
      screen: DinoBattleScreen,
      layout: ({ children }) => <Layout>{children}</Layout>,
      options: {
        title: 'Battle',
        tabBarIcon: Platform.select<Icon>({
          ios: { type: 'sfSymbol', name: 'flame' },
          android: { type: 'materialSymbol', name: 'swords' },
          default: { type: 'image', source: iconSwords },
        }),
      },
      UNSTABLE_loader: async () => {
        await Promise.all(
          BATTLE_DINO_IDS.map((id) =>
            queryClient.ensureQueryData(dinoQuery(id))
          )
        );
      },
    },
  },
});

const LoaderStack = createNativeStackNavigator({
  layout: ({ children }) => <Provider>{children}</Provider>,
  screenLayout: ({ children }) => <Layout>{children}</Layout>,
  screens: {
    DinoCatalog: {
      screen: LoaderTabs,
      options: {
        title: 'Dinos',
      },
    },
    DinoDetail: createNativeStackScreen({
      screen: DinoDetailScreen,
      linking: {
        path: 'dino/:id',
      },
      options: {
        title: '',
        headerTransparent: true,
      },
      UNSTABLE_loader: async ({ params }) => {
        await queryClient.ensureQueryData(dinoQuery(params.id));
      },
    }),
  },
});

export const Loaders = {
  screen: LoaderStack,
  title: 'Misc - Loaders',
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  buttons: {
    gap: 12,
    alignItems: 'center',
  },
  button: {
    minWidth: 220,
  },
});
