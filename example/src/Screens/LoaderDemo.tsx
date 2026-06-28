import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text } from '@react-navigation/elements';
import type { StaticParamList } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { useSuspenseQuery } from '@tanstack/react-query';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { queryClient } from '../queryClient';
import { ErrorBoundary } from '../Shared/ErrorBoundary';

let shouldFailNextLoad = false;

type Pokemon = {
  id: number;
  name: string;
  category: string;
  height: string;
  weight: string;
  types: string[];
  description: string;
};

const pokemon = [
  {
    id: 1,
    name: 'Bulbasaur',
    category: 'Seed Pokemon',
    height: '0.7 m',
    weight: '6.9 kg',
    types: ['Grass', 'Poison'],
    description:
      'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokemon.',
  },
  {
    id: 4,
    name: 'Charmander',
    category: 'Lizard Pokemon',
    height: '0.6 m',
    weight: '8.5 kg',
    types: ['Fire'],
    description:
      'The flame on its tail shows the strength of its life-force. If it is weak, the flame also burns weakly.',
  },
  {
    id: 7,
    name: 'Squirtle',
    category: 'Tiny Turtle Pokemon',
    height: '0.5 m',
    weight: '9.0 kg',
    types: ['Water'],
    description:
      'After birth, its back swells and hardens into a shell. It sprays a potent foam from its mouth.',
  },
] satisfies Pokemon[];

const pokemonQuery = (id: number) => ({
  queryKey: ['pokemon', id] as const,
  queryFn: () =>
    new Promise<Pokemon>((resolve, reject) => {
      setTimeout(
        () => {
          if (shouldFailNextLoad) {
            shouldFailNextLoad = false;
            reject(new Error('The Pokemon storage system is offline.'));
          } else {
            const match = pokemon.find((item) => item.id === id);

            if (match) {
              resolve(match);
            } else {
              reject(new Error('Pokemon not found.'));
            }
          }
        },
        id === 4 ? 1000 : 250
      );
    }),
});

function PokedexScreen() {
  const navigation = useNavigation('Pokedex');

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>Kanto Pokedex</Text>
      <Text style={styles.description}>Choose a Pokemon to inspect.</Text>
      <View style={styles.buttons}>
        {pokemon.map((item) => (
          <Button
            key={item.id}
            variant="filled"
            onPress={() => {
              React.startTransition(() => {
                navigation.navigate('Detail', { id: item.id });
              });
            }}
            style={styles.button}
          >
            {item.name}
          </Button>
        ))}
        <Button
          onPress={() => {
            shouldFailNextLoad = true;
            queryClient.removeQueries({ queryKey: ['pokemon'] });
          }}
          style={styles.button}
        >
          Make next load fail
        </Button>
        <Button
          onPress={() => queryClient.removeQueries({ queryKey: ['pokemon'] })}
          style={styles.button}
        >
          Clear cache
        </Button>
      </View>
    </View>
  );
}

function DetailScreen() {
  const route = useRoute('Detail');
  const { data } = useSuspenseQuery(pokemonQuery(route.params.id));

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>{data.name}</Text>
      <Text style={styles.description}>{data.category}</Text>
      <View style={styles.stats}>
        <Text>Type: {data.types.join(' / ')}</Text>
        <Text>Height: {data.height}</Text>
        <Text>Weight: {data.weight}</Text>
      </View>
      <Text style={styles.description}>{data.description}</Text>
    </View>
  );
}

function LoadingFallback() {
  return (
    <View style={styles.content}>
      <Text style={styles.description}>Loading Pokemon...</Text>
    </View>
  );
}

function TeamScreen() {
  return (
    <View style={styles.content}>
      <Text style={styles.heading}>Current Team</Text>
      <Text style={styles.description}>
        Bulbasaur, Charmander, and Squirtle are ready for the next gym battle.
      </Text>
    </View>
  );
}

const LoaderTabs = createBottomTabNavigator({
  screens: {
    LoaderHome: {
      screen: PokedexScreen,
      options: {
        title: 'Pokedex',
      },
    },
    Team: {
      screen: TeamScreen,
      options: {
        title: 'Team',
      },
    },
  },
});

const LoaderStack = createNativeStackNavigator({
  screenLayout: ({ children, route }) => (
    <ErrorBoundary
      onReset={() => {
        if (
          route.name === 'Detail' &&
          route.params != null &&
          'id' in route.params &&
          typeof route.params.id === 'number'
        ) {
          shouldFailNextLoad = false;
          queryClient.refetchQueries({
            queryKey: pokemonQuery(route.params.id).queryKey,
          });
        }
      }}
    >
      <React.Suspense fallback={<LoadingFallback />}>{children}</React.Suspense>
    </ErrorBoundary>
  ),
  screens: {
    Pokedex: {
      screen: LoaderTabs,
    },
    Detail: createNativeStackScreen({
      screen: DetailScreen,
      linking: {
        path: 'pokemon/:id',
        parse: {
          id: Number,
        },
      },
      UNSTABLE_loader: ({ params }) => {
        return queryClient
          .ensureQueryData(pokemonQuery(params.id))
          .then(() => undefined);
      },
    }),
  },
});

export type LoaderDemoParamList = StaticParamList<typeof LoaderStack>;

export const LoaderDemo = {
  screen: LoaderStack,
  title: 'Misc - Loader Demo',
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
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
  stats: {
    gap: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
});
