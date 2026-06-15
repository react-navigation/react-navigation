import {
  type BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createMaterialTopTabNavigator,
  type MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import {
  type NavigatorScreenParams,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { expectTypeOf } from 'expect-type';

type FeaturedStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: number };
  ProductReviews: { productId: number; page: number };
  ProductGallery: { productId: number; index: number };
};

const FeaturedStack = createNativeStackNavigator<FeaturedStackParamList>();

type OnSaleStackParamList = {
  DealsList: undefined;
  DealDetails: { dealId: number };
  FlashSale: { saleId: string };
};

const OnSaleStack = createNativeStackNavigator<OnSaleStackParamList>();

type NewArrivalsStackParamList = {
  NewArrivalsList: undefined;
  NewArrivalDetails: { itemId: number };
};

const NewArrivalsStack =
  createNativeStackNavigator<NewArrivalsStackParamList>();

type CategoryTabParamList = {
  Featured: NavigatorScreenParams<FeaturedStackParamList>;
  OnSale: NavigatorScreenParams<OnSaleStackParamList>;
  NewArrivals: NavigatorScreenParams<NewArrivalsStackParamList>;
};

const CategoryTabs = createMaterialTopTabNavigator<
  CategoryTabParamList,
  {
    Featured: typeof FeaturedStack;
    OnSale: typeof OnSaleStack;
    NewArrivals: typeof NewArrivalsStack;
  }
>();

type SearchStackParamList = {
  SearchHome: undefined;
  SearchResults: { query: string; sort: 'price' | 'rating' };
};

const SearchStack = createNativeStackNavigator<SearchStackParamList>();

// Tabs whose screens are added at runtime, keyed by a category id.
// The id is branded so the keys stay distinct from plain `string`.
// A plain `string` key would widen every route name in the app to `string`.
type CategorySlug = string & { readonly __brand: 'CategorySlug' };

type BrandTabParamList = Record<CategorySlug, undefined>;

const BrandTabs = createMaterialTopTabNavigator<BrandTabParamList>();

type ShopStackParamList = {
  Categories: NavigatorScreenParams<typeof CategoryTabs>;
  Search: NavigatorScreenParams<SearchStackParamList>;
  Brands: NavigatorScreenParams<typeof BrandTabs>;
  Cart: undefined;
  Checkout: { cartId: string };
  PromoCode: { code: string };
};

const ShopStack = createNativeStackNavigator<ShopStackParamList>();

type OrderArchiveParamList = {
  ArchivedOrders: undefined;
  ArchivedOrderDetails: { orderId: string };
};

type OrderSupportStackParamList = {
  OrderSupportHome: undefined;
  OrderSupportTicket: { ticketId: string };
};

const OrderSupportStack =
  createNativeStackNavigator<OrderSupportStackParamList>();

type OrdersStackParamList = {
  OrderList: undefined;
  OrderDetails: { orderId: string };
  TrackShipment: { orderId: string; carrier: string };
  OrderArchive: NavigatorScreenParams<OrderArchiveParamList>;
  OrderSupport: NavigatorScreenParams<typeof OrderSupportStack>;
};

const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();

type InboxStackParamList = {
  InboxHome: undefined;
  MessageThread: { threadId: string };
};

const InboxStack = createNativeStackNavigator<InboxStackParamList>();

type MainTabParamList = {
  Shop: NavigatorScreenParams<typeof ShopStack>;
  Orders: NavigatorScreenParams<OrdersStackParamList>;
  Inbox: NavigatorScreenParams<InboxStackParamList>;
  Account: { userId: string };
};

const MainTabs = createBottomTabNavigator<MainTabParamList>();

type RootStackParamList = {
  Main: NavigatorScreenParams<typeof MainTabs>;
  SignIn: { redirectTo: string };
  Paywall: { plan: 'monthly' | 'yearly' };
  EditProfile: { userId: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// The navigators are rendered at runtime; this keeps a value reference to each
// since they're otherwise only referenced as types in the nesting maps above.
export const navigators = {
  FeaturedStack,
  OnSaleStack,
  NewArrivalsStack,
  CategoryTabs,
  SearchStack,
  BrandTabs,
  ShopStack,
  OrderSupportStack,
  OrdersStack,
  InboxStack,
  MainTabs,
  RootStack,
};

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}

type RootStackType = typeof RootStack;

export const ProductListScreen = () => {
  const navigation = useNavigation('ProductList');

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

  expectTypeOf(navigation.getState().routeNames).toEqualTypeOf<
    ('ProductList' | 'ProductDetails' | 'ProductReviews' | 'ProductGallery')[]
  >();

  // Navigate within the same navigator
  navigation.push('ProductDetails', { productId: 1 });
  navigation.push('ProductReviews', { productId: 1, page: 2 });
  navigation.push('ProductGallery', { productId: 1, index: 0 });

  // @ts-expect-error - productId is required.
  navigation.push('ProductDetails');

  // @ts-expect-error - productId must be a number.
  navigation.push('ProductDetails', { productId: '1' });

  // @ts-expect-error - DealDetails is in a sibling navigator, not reachable by name.
  navigation.push('DealDetails', { dealId: 1 });

  // Navigate to routes in ancestor navigators via the composite
  navigation.navigate('Checkout', { cartId: 'c1' });
  navigation.navigate('Account', { userId: 'u1' });
  navigation.navigate('SignIn', { redirectTo: '/home' });

  // Navigate into a sibling navigator through the nested params
  navigation.navigate('Main', {
    screen: 'Shop',
    params: { screen: 'Search', params: { screen: 'SearchHome' } },
  });

  expectTypeOf(navigation.setParams).parameter(0).toEqualTypeOf<undefined>();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<NativeStackNavigationOptions>>();

  expectTypeOf(navigation.getParent)
    .parameter(0)
    .toEqualTypeOf<
      'ProductList' | 'Featured' | 'Categories' | 'Shop' | 'Main' | undefined
    >();

  return null;
};

/**
 * Material top tabs nested four navigators deep.
 */
export const FeaturedTabScreen = () => {
  const navigation = useNavigation('Featured');

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();

  expectTypeOf(navigation.jumpTo).toBeFunction();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<MaterialTopTabNavigationOptions>>();

  return null;
};

/**
 * Native stack nested three navigators deep, navigating through leaves.
 */
export const CartScreen = () => {
  const navigation = useNavigation('Cart');

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

  navigation.push('Checkout', { cartId: 'c1' });
  navigation.push('PromoCode', { code: 'SALE' });

  // @ts-expect-error - cartId is required.
  navigation.push('Checkout');

  expectTypeOf(navigation.setParams).parameter(0).toEqualTypeOf<undefined>();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<NativeStackNavigationOptions>>();

  return null;
};

/**
 * Plain param-list nested routes expose generic navigation, parent navigation,
 * and concrete navigator props when a child is declared with `typeof Navigator`.
 */
export const ParamListOnlyNestedScreen = () => {
  /**
   * ParamList > ParamList
   */
  {
    const navigation = useNavigation('ArchivedOrderDetails');

    navigation.navigate('ArchivedOrders');
    navigation.navigate('ArchivedOrderDetails', {
      orderId: 'archived-order-1',
    });

    navigation.navigate('OrderDetails', { orderId: 'order-1' });
    navigation.navigate('Account', { userId: 'u1' });
    navigation.navigate('SignIn', { redirectTo: '/orders' });

    // @ts-expect-error - orderId is required.
    navigation.navigate('ArchivedOrderDetails');

    // @ts-expect-error - param-list-only nested routes don't know the navigator type.
    navigation.push('ArchivedOrderDetails', {
      orderId: 'archived-order-1',
    });

    expectTypeOf(navigation.setOptions)
      .parameter(0)
      .toEqualTypeOf<Partial<{}>>();

    // @ts-expect-error - param-list-only nested routes don't know the navigator event map.
    navigation.addListener('gestureCancel', () => {});

    expectTypeOf(navigation.getState().type).toEqualTypeOf<string>();
  }

  /**
   * Navigator > ParamList
   */
  {
    const navigation = useNavigation('SearchResults');

    navigation.navigate('SearchResults', {
      query: 'shoes',
      sort: 'price',
    });

    navigation.navigate('Cart');
    navigation.navigate('Checkout', { cartId: 'c1' });
    navigation.navigate('Account', { userId: 'u1' });
    navigation.navigate('SignIn', { redirectTo: '/search' });

    navigation.navigate('SearchResults', {
      query: 'shoes',
      // @ts-expect-error - sort must be a valid option.
      sort: 'newest',
    });

    // @ts-expect-error - param-list-only nested routes don't know the navigator type.
    navigation.push('SearchResults', {
      query: 'shoes',
      sort: 'price',
    });

    expectTypeOf(navigation.setOptions)
      .parameter(0)
      .toEqualTypeOf<Partial<{}>>();

    // @ts-expect-error - param-list-only nested routes don't know the navigator event map.
    navigation.addListener('gestureCancel', () => {});

    expectTypeOf(navigation.getState().type).toEqualTypeOf<string>();
  }

  /**
   * Navigator > ParamList
   */
  {
    const navigation = useNavigation('TrackShipment');

    navigation.navigate('TrackShipment', {
      orderId: 'order-1',
      carrier: 'ups',
    });

    navigation.navigate('OrderList');
    navigation.navigate('OrderDetails', { orderId: 'order-1' });
    navigation.navigate('Account', { userId: 'u1' });
    navigation.navigate('SignIn', { redirectTo: '/orders' });

    // @ts-expect-error - carrier is required.
    navigation.navigate('TrackShipment', { orderId: 'order-1' });

    // @ts-expect-error - param-list-only nested routes don't know the navigator type.
    navigation.push('OrderDetails', { orderId: 'order-1' });

    expectTypeOf(navigation.setOptions)
      .parameter(0)
      .toEqualTypeOf<Partial<{}>>();

    // @ts-expect-error - param-list-only nested routes don't know the navigator event map.
    navigation.addListener('gestureCancel', () => {});

    expectTypeOf(navigation.getState().type).toEqualTypeOf<string>();
  }

  /**
   * Navigator > ParamList
   */
  {
    const navigation = useNavigation('MessageThread');

    navigation.navigate('MessageThread', { threadId: 'thread-1' });
    navigation.navigate('Account', { userId: 'u1' });
    navigation.navigate('SignIn', { redirectTo: '/inbox' });

    // @ts-expect-error - threadId is required.
    navigation.navigate('MessageThread');

    // @ts-expect-error - param-list-only nested routes don't know the navigator type.
    navigation.push('MessageThread', { threadId: 'thread-1' });

    expectTypeOf(navigation.setOptions)
      .parameter(0)
      .toEqualTypeOf<Partial<{}>>();

    // @ts-expect-error - param-list-only nested routes don't know the navigator event map.
    navigation.addListener('gestureCancel', () => {});

    expectTypeOf(navigation.getState().type).toEqualTypeOf<string>();
  }

  /**
   * ParamList > Navigator
   */
  {
    const navigation = useNavigation('OrderSupportTicket');

    expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

    navigation.push('OrderSupportHome');
    navigation.push('OrderSupportTicket', { ticketId: 'ticket-1' });

    navigation.navigate('OrderDetails', { orderId: 'order-1' });
    navigation.navigate('Account', { userId: 'u1' });
    navigation.navigate('SignIn', { redirectTo: '/support' });

    // @ts-expect-error - ticketId is required.
    navigation.push('OrderSupportTicket');

    expectTypeOf(navigation.setOptions)
      .parameter(0)
      .toEqualTypeOf<Partial<NativeStackNavigationOptions>>();

    navigation.addListener('gestureCancel', (e) => {
      expectTypeOf(e.data).toEqualTypeOf<undefined>();
    });

    navigation.addListener('sheetDetentChange', (e) => {
      expectTypeOf(e.data).toEqualTypeOf<
        Readonly<{ index: number; stable: boolean }>
      >();
    });

    // @ts-expect-error - native stack doesn't emit tabPress.
    navigation.addListener('tabPress', () => {});
  }

  return null;
};

/**
 * Bottom tabs nested one navigator deep.
 */
export const AccountScreen = () => {
  const navigation = useNavigation('Account');

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'tab'>();

  expectTypeOf(navigation.jumpTo)
    .parameter(0)
    .toEqualTypeOf<'Shop' | 'Orders' | 'Inbox' | 'Account'>();

  expectTypeOf(navigation.setParams)
    .parameter(0)
    .toEqualTypeOf<Partial<{ userId: string }>>();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<BottomTabNavigationOptions>>();

  return null;
};

/**
 * Root navigator.
 */
export const SignInScreen = () => {
  const navigation = useNavigation('SignIn');

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

  navigation.navigate('SignIn', { redirectTo: '/home' });
  navigation.navigate('Paywall', { plan: 'monthly' });
  navigation.navigate('EditProfile', { userId: 'u1' });

  // @ts-expect-error - plan must be a valid option.
  navigation.navigate('Paywall', { plan: 'weekly' });

  expectTypeOf(navigation.setParams)
    .parameter(0)
    .toEqualTypeOf<Partial<{ redirectTo: string }>>();

  expectTypeOf(navigation.setOptions)
    .parameter(0)
    .toEqualTypeOf<Partial<NativeStackNavigationOptions>>();

  return null;
};

/**
 * `useRoute` recovers params for routes at every nesting level.
 */
export const RouteParamsChecks = () => {
  expectTypeOf(useRoute('ProductList').params).toEqualTypeOf<undefined>();

  expectTypeOf(useRoute('ProductDetails').params).toEqualTypeOf<
    Readonly<{ productId: number }>
  >();

  expectTypeOf(useRoute('SearchResults').params).toEqualTypeOf<
    Readonly<{ query: string; sort: 'price' | 'rating' }>
  >();

  expectTypeOf(useRoute('Checkout').params).toEqualTypeOf<
    Readonly<{ cartId: string }>
  >();

  expectTypeOf(useRoute('TrackShipment').params).toEqualTypeOf<
    Readonly<{ orderId: string; carrier: string }>
  >();

  expectTypeOf(useRoute('ArchivedOrderDetails').params).toEqualTypeOf<
    Readonly<{ orderId: string }>
  >();

  expectTypeOf(useRoute('OrderSupportTicket').params).toEqualTypeOf<
    Readonly<{ ticketId: string }>
  >();

  expectTypeOf(useRoute('Account').params).toEqualTypeOf<
    Readonly<{ userId: string }>
  >();

  expectTypeOf(useRoute('SignIn').params).toEqualTypeOf<
    Readonly<{ redirectTo: string }>
  >();

  // @ts-expect-error - not a route in the app.
  useRoute('Invalid');

  return null;
};

/**
 * `useNavigationState` resolves state for routes at every nesting level.
 */
export const NavigationStateChecks = () => {
  expectTypeOf(
    useNavigationState('ProductList', (state) => state.type)
  ).toEqualTypeOf<'stack'>();

  expectTypeOf(
    useNavigationState('Featured', (state) => state.type)
  ).toEqualTypeOf<'tab'>();

  expectTypeOf(
    useNavigationState('Account', (state) => state.type)
  ).toEqualTypeOf<'tab'>();

  expectTypeOf(
    useNavigationState('SignIn', (state) => state.index)
  ).toEqualTypeOf<number>();

  expectTypeOf(
    useNavigationState('ProductList', (state) => state.routeNames)
  ).toEqualTypeOf<
    ('ProductList' | 'ProductDetails' | 'ProductReviews' | 'ProductGallery')[]
  >();

  // @ts-expect-error - not a route in the app.
  useNavigationState('Invalid', (state) => state.index);

  return null;
};

export const InvalidRouteCheck = () => {
  // @ts-expect-error - not a route in the app.
  useNavigation('Invalid');

  return null;
};
