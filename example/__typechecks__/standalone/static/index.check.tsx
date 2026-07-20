import {
  type BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createMaterialTopTabNavigator,
  createMaterialTopTabScreen,
  type MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import {
  CommonActions,
  createNavigationContainerRef,
  createStaticNavigation,
  DrawerActions,
  StackActions,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { expectTypeOf } from 'expect-type';

const Empty = () => null;

const FeaturedStack = createNativeStackNavigator({
  screens: {
    ProductList: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'products' },
    }),
    ProductDetails: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'products/:productId', parse: { productId: Number } },
    }),
    ProductReviews: createNativeStackScreen({
      screen: Empty,
      linking: {
        path: 'products/:productId/reviews/:page',
        parse: { productId: Number, page: Number },
      },
    }),
    ProductGallery: createNativeStackScreen({
      screen: Empty,
      linking: {
        path: 'products/:productId/gallery/:index',
        parse: { productId: Number, index: Number },
      },
    }),
  },
});

const OnSaleStack = createNativeStackNavigator({
  screens: {
    DealsList: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'deals' },
    }),
    DealDetails: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'deals/:dealId', parse: { dealId: Number } },
    }),
    FlashSale: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'flash/:saleId', parse: { saleId: String } },
    }),
  },
});

const NewArrivalsStack = createNativeStackNavigator({
  screens: {
    NewArrivalsList: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'new' },
    }),
    NewArrivalDetails: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'new/:itemId', parse: { itemId: Number } },
    }),
  },
});

const CategoryTabs = createMaterialTopTabNavigator({
  screens: {
    Featured: createMaterialTopTabScreen({ screen: FeaturedStack }),
    OnSale: createMaterialTopTabScreen({ screen: OnSaleStack }),
    NewArrivals: createMaterialTopTabScreen({ screen: NewArrivalsStack }),
  },
});

const SearchStack = createNativeStackNavigator({
  screens: {
    SearchHome: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'search' },
    }),
    SearchResults: createNativeStackScreen({
      screen: Empty,
      linking: {
        path: 'search/:query/:sort',
        parse: {
          query: String,
          sort: (value: string) => value as 'price' | 'rating',
        },
      },
    }),
  },
});

// Tabs whose screens are added at runtime, keyed by a category id.
// The id is branded so the keys stay distinct from plain `string`.
// A plain `string` key would widen every route name in the app to `string`.
type CategorySlug = string & { readonly __brand: 'CategorySlug' };

const BrandTabs = createMaterialTopTabNavigator({
  screens: {} as Record<
    CategorySlug,
    ReturnType<typeof createMaterialTopTabScreen>
  >,
});

const ShopStack = createNativeStackNavigator({
  screens: {
    Categories: createNativeStackScreen({ screen: CategoryTabs }),
    Search: createNativeStackScreen({ screen: SearchStack }),
    Brands: createNativeStackScreen({ screen: BrandTabs }),
    Cart: createNativeStackScreen({ screen: Empty, linking: { path: 'cart' } }),
    Checkout: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'checkout/:cartId', parse: { cartId: String } },
    }),
    PromoCode: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'promo/:code', parse: { code: String } },
    }),
  },
});

const OrdersStack = createNativeStackNavigator({
  screens: {
    OrderList: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'orders' },
    }),
    OrderDetails: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'orders/:orderId', parse: { orderId: String } },
    }),
    TrackShipment: createNativeStackScreen({
      screen: Empty,
      linking: {
        path: 'orders/:orderId/track/:carrier',
        parse: { orderId: String, carrier: String },
      },
    }),
  },
});

const InboxStack = createNativeStackNavigator({
  screens: {
    InboxHome: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'inbox' },
    }),
    MessageThread: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'inbox/:threadId', parse: { threadId: String } },
    }),
  },
});

const MainTabs = createBottomTabNavigator({
  screens: {
    Shop: { screen: ShopStack },
    Orders: { screen: OrdersStack },
    Inbox: { screen: InboxStack },
    Account: {
      screen: Empty,
      linking: { path: 'account/:userId', parse: { userId: String } },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Main: createNativeStackScreen({
      screen: MainTabs,
      options: { headerShown: false },
    }),
    SignIn: createNativeStackScreen({
      screen: Empty,
      linking: { path: 'sign-in/:redirectTo', parse: { redirectTo: String } },
    }),
  },
  groups: {
    Modal: {
      screens: {
        Paywall: createNativeStackScreen({
          screen: Empty,
          linking: {
            path: 'paywall/:plan',
            parse: { plan: (value: string) => value as 'monthly' | 'yearly' },
          },
        }),
        EditProfile: createNativeStackScreen({
          screen: Empty,
          linking: { path: 'edit-profile/:userId', parse: { userId: String } },
        }),
      },
    },
  },
});

createStaticNavigation(RootStack);

declare module '@react-navigation/native' {
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

/**
 * A root container ref derives its dispatchable actions from the augmented
 * navigation tree. This tree has stack and tab navigators but no drawer, so
 * stack/common/tab actions are accepted while drawer actions and unknown
 * action types are rejected.
 */
const containerRef = createNavigationContainerRef();

containerRef.dispatch(CommonActions.navigate('ProductList'));
containerRef.dispatch(StackActions.push('ProductList'));

// @ts-expect-error - drawer actions are rejected: the app has no drawer navigator
containerRef.dispatch(DrawerActions.openDrawer());

// @ts-expect-error - unknown route names are rejected
containerRef.dispatch(CommonActions.navigate('Unknown'));

// @ts-expect-error - unknown action types are rejected
containerRef.dispatch({ type: 'BOGUS', payload: {} });
