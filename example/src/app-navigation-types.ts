import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type MainScreenParams = {};
type DetailScreenParams =
  | {
      id?: string;
    }
  | undefined;

export type AppStackParamsList = {
  Main: MainScreenParams;
  Detail: DetailScreenParams;
};

// Route Prop
export type MainScreenRouteProp = RouteProp<AppStackParamsList, 'Main'>;
export type DetailScreenRouteProp = RouteProp<AppStackParamsList, 'Detail'>;

// Navigation Props
export type MainScreenNavigationProp = StackNavigationProp<
  AppStackParamsList,
  'Main'
>;
export type DetailScreenNavigationProp = StackNavigationProp<
  AppStackParamsList,
  'Detail'
>;
