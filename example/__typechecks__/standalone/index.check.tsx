import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createMaterialTopTabNavigator,
  createMaterialTopTabScreen,
} from '@react-navigation/material-top-tabs';
import {
  createStaticNavigation,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
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
    Inbox: createNativeStackScreen({
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

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}

type RootStackType = typeof RootStack;

export const ProductListScreen = () => {
  const navigation = useNavigation('ProductList');

  expectTypeOf(navigation.getState().type).toEqualTypeOf<'stack'>();

  navigation.push('ProductDetails', { productId: 1 });
  navigation.push('ProductReviews', { productId: 1, page: 2 });

  // @ts-expect-error - DealDetails is in a different navigator.
  navigation.push('DealDetails', { dealId: 1 });

  const detailsRoute = useRoute('ProductDetails');

  expectTypeOf(detailsRoute.params.productId).toEqualTypeOf<number>();

  const checkoutRoute = useRoute('Checkout');

  expectTypeOf(checkoutRoute.params.cartId).toEqualTypeOf<string>();

  const type = useNavigationState('ProductList', (state) => state.type);

  expectTypeOf(type).toEqualTypeOf<'stack'>();

  return null;
};
