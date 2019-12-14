import * as React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useScrollToTop, useTheme } from '@react-navigation/native';

type Item = { name: string; number: number };

const CONTACTS: Item[] = [
  { name: 'Marissa Castillo', number: 7766398169 },
  { name: 'Denzel Curry', number: 9394378449 },
  { name: 'Miles Ferguson', number: 8966872888 },
  { name: 'Desiree Webster', number: 6818656371 },
  { name: 'Samantha Young', number: 6538288534 },
  { name: 'Irene Hunter', number: 2932176249 },
  { name: 'Annie Ryan', number: 4718456627 },
  { name: 'Sasha Oliver', number: 9743195919 },
  { name: 'Jarrod Avila', number: 8339212305 },
  { name: 'Griffin Weaver', number: 6059349721 },
  { name: 'Emilee Moss', number: 7382905180 },
  { name: 'Angelique Oliver', number: 9689298436 },
  { name: 'Emanuel Little', number: 6673376805 },
  { name: 'Wayne Day', number: 6918839582 },
  { name: 'Lauren Reese', number: 4652613201 },
  { name: 'Kailey Ward', number: 2232609512 },
  { name: 'Gabrielle Newman', number: 2837997127 },
  { name: 'Luke Strickland', number: 8404732322 },
  { name: 'Payton Garza', number: 7916140875 },
  { name: 'Anna Moss', number: 3504954657 },
  { name: 'Kailey Vazquez', number: 3002136330 },
  { name: 'Jennifer Coleman', number: 5469629753 },
  { name: 'Cindy Casey', number: 8446175026 },
  { name: 'Dillon Doyle', number: 5614510703 },
  { name: 'Savannah Garcia', number: 5634775094 },
  { name: 'Kailey Hudson', number: 3289239675 },
  { name: 'Ariel Green', number: 2103492196 },
  { name: 'Weston Perez', number: 2984221823 },
  { name: 'Kari Juarez', number: 9502125065 },
  { name: 'Sara Sanders', number: 7696668206 },
  { name: 'Griffin Le', number: 3396937040 },
  { name: 'Fernando Valdez', number: 9124257306 },
  { name: 'Taylor Marshall', number: 9656072372 },
  { name: 'Elias Dunn', number: 9738536473 },
  { name: 'Diane Barrett', number: 6886824829 },
  { name: 'Samuel Freeman', number: 5523948094 },
  { name: 'Irene Garza', number: 2077694008 },
  { name: 'Devante Alvarez', number: 9897002645 },
  { name: 'Sydney Floyd', number: 6462897254 },
  { name: 'Toni Dixon', number: 3775448213 },
  { name: 'Anastasia Spencer', number: 4548212752 },
  { name: 'Reid Cortez', number: 6668056507 },
  { name: 'Ramon Duncan', number: 8889157751 },
  { name: 'Kenny Moreno', number: 5748219540 },
  { name: 'Shelby Craig', number: 9473708675 },
  { name: 'Jordyn Brewer', number: 7552277991 },
  { name: 'Tanya Walker', number: 4308189657 },
  { name: 'Nolan Figueroa', number: 9173443776 },
  { name: 'Sophia Gibbs', number: 6435942770 },
  { name: 'Vincent Sandoval', number: 2606111495 },
];

const ContactItem = React.memo(
  ({ item }: { item: { name: string; number: number } }) => {
    const { colors } = useTheme();

    return (
      <View style={[styles.item, { backgroundColor: colors.card }]}>
        <View style={styles.avatar}>
          <Text style={styles.letter}>
            {item.name.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.number, { color: colors.text, opacity: 0.5 }]}>
            {item.number}
          </Text>
        </View>
      </View>
    );
  }
);

const ItemSeparator = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.separator, { backgroundColor: colors.border }]} />
  );
};

export default function Contacts() {
  const ref = React.useRef<FlatList<Item>>(null);

  useScrollToTop(ref);

  const renderItem = ({ item }: { item: Item }) => <ContactItem item={item} />;

  return (
    <FlatList
      ref={ref}
      data={CONTACTS}
      keyExtractor={(_, i) => String(i)}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: 'white',
    fontWeight: 'bold',
  },
  details: {
    margin: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  number: {
    fontSize: 12,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
