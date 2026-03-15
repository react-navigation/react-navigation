import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/space-grotesk';
import {
  createDrawerNavigator,
  createDrawerScreen,
  type DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { type Icon, PlatformPressable, Text } from '@react-navigation/elements';
import {
  StackActions,
  ThemeProvider,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import iconLandmark from '../../assets/icons/landmark.png';
import iconLayoutDashboard from '../../assets/icons/layout-dashboard.png';
import iconPieChart from '../../assets/icons/pie-chart.png';

const SPACING_XS = 4;
const SPACING_S = 8;
const SPACING_M = 12;
const SPACING_L = 16;
const SPACING_XL = 20;

const BORDER_RADIUS_M = 12;
const BORDER_RADIUS_L = 16;

const COLOR_POSITIVE = '#4CAF50';
const COLOR_NEGATIVE = '#EF5350';

type Transaction = {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
};

type BudgetCategory = {
  id: string;
  name: string;
  spent: number;
  limit: number;
  color: string;
};

type Account = {
  id: string;
  name: string;
  typeLabel: string;
  balance: number;
  lastFour: string;
  color: string;
};

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    merchant: 'Whole Foods Market',
    category: 'Groceries',
    amount: -87.34,
    date: 'Mar 15',
  },
  {
    id: '2',
    merchant: 'Monthly Salary',
    category: 'Income',
    amount: 4250.0,
    date: 'Mar 14',
  },
  {
    id: '3',
    merchant: 'Shell Gas Station',
    category: 'Transport',
    amount: -52.1,
    date: 'Mar 14',
  },
  {
    id: '4',
    merchant: 'Netflix',
    category: 'Entertainment',
    amount: -15.99,
    date: 'Mar 13',
  },
  {
    id: '5',
    merchant: 'Chipotle',
    category: 'Dining',
    amount: -12.85,
    date: 'Mar 13',
  },
  {
    id: '6',
    merchant: 'Amazon',
    category: 'Shopping',
    amount: -43.99,
    date: 'Mar 12',
  },
  {
    id: '7',
    merchant: 'Electric Company',
    category: 'Utilities',
    amount: -128.5,
    date: 'Mar 11',
  },
  {
    id: '8',
    merchant: 'Freelance Payment',
    category: 'Income',
    amount: 850.0,
    date: 'Mar 10',
  },
  {
    id: '9',
    merchant: "Trader Joe's",
    category: 'Groceries',
    amount: -64.22,
    date: 'Mar 10',
  },
  {
    id: '10',
    merchant: 'Uber',
    category: 'Transport',
    amount: -18.75,
    date: 'Mar 9',
  },
];

const DAILY_SPEND = [42, 128, 76, 15, 97, 64, 87];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const BUDGETS: BudgetCategory[] = [
  { id: '1', name: 'Groceries', spent: 312, limit: 400, color: '#1565C0' },
  { id: '2', name: 'Dining', spent: 185, limit: 200, color: '#F57F17' },
  { id: '3', name: 'Transport', spent: 224, limit: 150, color: '#6A1B9A' },
  { id: '4', name: 'Entertainment', spent: 65, limit: 100, color: '#00838F' },
  { id: '5', name: 'Shopping', spent: 143, limit: 250, color: '#D84315' },
  { id: '6', name: 'Utilities', spent: 128, limit: 200, color: '#2E7D32' },
];

const ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'Main Checking',
    typeLabel: 'Checking',
    balance: 4832.5,
    lastFour: '4291',
    color: '#1565C0',
  },
  {
    id: '2',
    name: 'Savings',
    typeLabel: 'Savings',
    balance: 12450.0,
    lastFour: '7803',
    color: '#2E7D32',
  },
  {
    id: '3',
    name: 'Travel Card',
    typeLabel: 'Credit Card',
    balance: -1243.67,
    lastFour: '5512',
    color: '#6A1B9A',
  },
];

const formatCurrency = (amount: number) => {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
};

const getCategoryColor = (category: string) => {
  const budget = BUDGETS.find((b) => b.name === category);
  return budget?.color ?? '#1565C0';
};

const OverviewScreen = () => {
  const { colors, fonts } = useTheme();

  const totalBalance = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0);
  const income = TRANSACTIONS.filter((t) => t.amount > 0).reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const expenses = TRANSACTIONS.filter((t) => t.amount < 0).reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );
  const maxSpend = Math.max(...DAILY_SPEND);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.screenContent}
    >
      <View
        style={[
          styles.card,
          styles.cardLarge,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.label, { color: colors.text, opacity: 0.6 }]}>
          Total Balance
        </Text>

        <Text style={[styles.amountLarge, fonts.bold]}>
          {formatCurrency(totalBalance)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <View
          style={[
            styles.card,
            styles.summaryItem,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.label, { color: colors.text, opacity: 0.6 }]}>
            Income
          </Text>

          <Text
            style={[styles.amountMedium, fonts.bold, { color: COLOR_POSITIVE }]}
          >
            {formatCurrency(income)}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            styles.summaryItem,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.label, { color: colors.text, opacity: 0.6 }]}>
            Expenses
          </Text>

          <Text style={[styles.amountMedium, fonts.bold]}>
            {formatCurrency(expenses)}
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, fonts.bold]}>This Week</Text>

      <View
        style={[
          styles.card,
          styles.chartCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {DAILY_SPEND.map((spend, index) => (
          <View key={DAY_LABELS[index]} style={styles.barColumn}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: `${(spend / maxSpend) * 100}%`,
                    backgroundColor: colors.primary,
                    opacity: index === DAILY_SPEND.length - 1 ? 1 : 0.5,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.barLabel,
                fonts.medium,
                { color: colors.text, opacity: 0.6 },
              ]}
            >
              {DAY_LABELS[index]}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, fonts.bold]}>Recent Transactions</Text>

      {TRANSACTIONS.map((transaction, index) => (
        <React.Fragment key={transaction.id}>
          {index > 0 && (
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
          )}

          <View style={styles.transactionRow}>
            <View
              style={[
                styles.categoryDot,
                { backgroundColor: getCategoryColor(transaction.category) },
              ]}
            >
              <Text style={[styles.categoryDotText, fonts.bold]}>
                {transaction.category.charAt(0)}
              </Text>
            </View>

            <View style={styles.flexFill}>
              <Text style={[styles.bodyText, fonts.medium]}>
                {transaction.merchant}
              </Text>

              <Text
                style={[styles.caption, { color: colors.text, opacity: 0.6 }]}
              >
                {transaction.category} · {transaction.date}
              </Text>
            </View>

            <Text
              style={[
                styles.bodyText,
                fonts.bold,
                transaction.amount > 0 && { color: COLOR_POSITIVE },
              ]}
            >
              {formatCurrency(transaction.amount)}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

const BudgetsScreen = () => {
  const { colors, fonts } = useTheme();

  const totalSpent = BUDGETS.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = BUDGETS.reduce((sum, b) => sum + b.limit, 0);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.screenContent}
    >
      <View
        style={[
          styles.card,
          styles.cardLarge,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.label, { color: colors.text, opacity: 0.6 }]}>
          Monthly Budget
        </Text>

        <Text style={[styles.amountLarge, fonts.bold]}>
          {formatCurrency(totalSpent)}{' '}
          <Text style={{ opacity: 0.4 }}>/ {formatCurrency(totalLimit)}</Text>
        </Text>

        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.border, marginTop: SPACING_M },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min((totalSpent / totalLimit) * 100, 100)}%`,
                backgroundColor:
                  totalSpent > totalLimit ? COLOR_NEGATIVE : colors.primary,
              },
            ]}
          />
        </View>
      </View>

      {BUDGETS.map((budget) => {
        const ratio = budget.spent / budget.limit;
        const isOver = ratio > 1;

        return (
          <View
            key={budget.id}
            style={[
              styles.card,
              styles.budgetCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.rowBetween}>
              <View style={styles.row}>
                <View
                  style={[styles.colorDot, { backgroundColor: budget.color }]}
                />

                <Text style={[styles.bodyText, fonts.medium]}>
                  {budget.name}
                </Text>
              </View>

              <Text
                style={[
                  styles.caption,
                  fonts.medium,
                  isOver && { color: COLOR_NEGATIVE },
                ]}
              >
                {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
              </Text>
            </View>

            <View
              style={[styles.progressTrack, { backgroundColor: colors.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(ratio * 100, 100)}%`,
                    backgroundColor: isOver ? COLOR_NEGATIVE : budget.color,
                  },
                ]}
              />
            </View>

            {isOver && (
              <Text
                style={[
                  styles.caption,
                  fonts.medium,
                  { color: COLOR_NEGATIVE, marginTop: SPACING_XS },
                ]}
              >
                {formatCurrency(budget.spent - budget.limit)} over budget
              </Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const AccountsScreen = () => {
  const { colors, fonts } = useTheme();

  const totalBalance = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.screenContent}
    >
      {ACCOUNTS.map((account) => (
        <View
          key={account.id}
          style={[
            styles.card,
            styles.accountCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <View
                style={[styles.colorDot, { backgroundColor: account.color }]}
              />

              <Text style={[styles.bodyText, fonts.bold]}>{account.name}</Text>
            </View>

            <Text
              style={[
                styles.caption,
                fonts.medium,
                { color: colors.text, opacity: 0.6 },
              ]}
            >
              {account.typeLabel}
            </Text>
          </View>

          <Text
            style={[
              styles.amountMedium,
              fonts.bold,
              account.balance < 0 && { color: COLOR_NEGATIVE },
            ]}
          >
            {formatCurrency(account.balance)}
          </Text>

          <Text style={[styles.caption, { color: colors.text, opacity: 0.4 }]}>
            •••• {account.lastFour}
          </Text>
        </View>
      ))}

      <View
        style={[
          styles.card,
          styles.totalCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.label, { color: colors.text, opacity: 0.6 }]}>
          Net Worth
        </Text>

        <Text style={[styles.amountLarge, fonts.bold]}>
          {formatCurrency(totalBalance)}
        </Text>
      </View>
    </ScrollView>
  );
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { colors, fonts } = useTheme();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContentContainer}
    >
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, fonts.bold]}>AC</Text>
        </View>

        <Text style={[styles.bodyText, fonts.bold]}>Alex Chen</Text>

        <Text style={[styles.caption, { color: colors.text, opacity: 0.6 }]}>
          alex@ledger.app
        </Text>
      </View>

      <View
        style={[styles.drawerDivider, { backgroundColor: colors.border }]}
      />

      <DrawerItemList {...props} />

      <View
        style={[styles.drawerDivider, { backgroundColor: colors.border }]}
      />

      <View style={styles.drawerFooter}>
        <Text
          style={[
            styles.caption,
            fonts.medium,
            { color: colors.text, opacity: 0.4 },
          ]}
        >
          Ledger v1.0
        </Text>
      </View>

      <View style={styles.drawerSpacer} />

      <PlatformPressable
        onPress={() => props.navigation.dispatch(StackActions.pop())}
        style={styles.backButton}
      >
        <Text style={[styles.caption, fonts.medium, { color: colors.primary }]}>
          Back
        </Text>
      </PlatformPressable>
    </DrawerContentScrollView>
  );
};

const NavigatorLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const navigation = useNavigation('DrawerShowcase');

  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Ledger',
      headerBackButtonDisplayMode: 'minimal',
    });
  }, [navigation]);

  const customTheme = React.useMemo(
    () => ({
      ...theme,
      fonts: {
        regular: {
          fontFamily: 'SpaceGrotesk_400Regular',
          fontWeight: '400' as const,
        },
        medium: {
          fontFamily: 'SpaceGrotesk_500Medium',
          fontWeight: '400' as const,
        },
        bold: {
          fontFamily: 'SpaceGrotesk_600SemiBold',
          fontWeight: '400' as const,
        },
        heavy: {
          fontFamily: 'SpaceGrotesk_700Bold',
          fontWeight: '400' as const,
        },
      },
    }),
    [theme]
  );

  if (!fontsLoaded) {
    return null;
  }

  return <ThemeProvider value={customTheme}>{children}</ThemeProvider>;
};

export const DrawerShowcase = createDrawerNavigator({
  layout: ({ children }) => <NavigatorLayout>{children}</NavigatorLayout>,
  drawerContent: CustomDrawerContent,
  screenOptions: {
    drawerType: 'back',
  },
  screens: {
    Overview: createDrawerScreen({
      screen: OverviewScreen,
      options: {
        title: 'Overview',
        drawerIcon: Platform.select<Icon>({
          ios: { type: 'sfSymbol', name: 'square.grid.2x2' },
          android: { type: 'materialSymbol', name: 'dashboard' },
          default: { type: 'image', source: iconLayoutDashboard },
        }),
      },
    }),
    Budgets: createDrawerScreen({
      screen: BudgetsScreen,
      options: {
        title: 'Budgets',
        drawerIcon: Platform.select<Icon>({
          ios: { type: 'sfSymbol', name: 'chart.pie' },
          android: { type: 'materialSymbol', name: 'pie_chart' },
          default: { type: 'image', source: iconPieChart },
        }),
      },
    }),
    Accounts: createDrawerScreen({
      screen: AccountsScreen,
      options: {
        title: 'Accounts',
        drawerIcon: Platform.select<Icon>({
          ios: { type: 'sfSymbol', name: 'building.columns' },
          android: { type: 'materialSymbol', name: 'account_balance' },
          default: { type: 'image', source: iconLandmark },
        }),
      },
    }),
  },
});

const styles = StyleSheet.create({
  screenContent: {
    padding: SPACING_XL,
    paddingBottom: SPACING_XL * 2,
  },

  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardLarge: {
    borderRadius: BORDER_RADIUS_L,
    borderCurve: 'continuous',
    padding: SPACING_XL,
    marginBottom: SPACING_L,
  },

  label: {
    fontSize: 14,
    marginBottom: SPACING_XS,
  },
  amountLarge: {
    fontSize: 28,
  },
  amountMedium: {
    fontSize: 20,
  },
  bodyText: {
    fontSize: 15,
  },
  caption: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: SPACING_M,
  },

  flexFill: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING_S,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING_S,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: SPACING_M,
    marginBottom: SPACING_XL,
  },
  summaryItem: {
    flex: 1,
    borderRadius: BORDER_RADIUS_M,
    borderCurve: 'continuous',
    padding: SPACING_L,
  },

  chartCard: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS_M,
    borderCurve: 'continuous',
    padding: SPACING_L,
    marginBottom: SPACING_XL,
    height: 160,
    alignItems: 'flex-end',
    gap: SPACING_S,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barTrack: {
    flex: 1,
    width: '60%',
    justifyContent: 'flex-end',
  },
  barFill: {
    borderRadius: SPACING_XS,
    borderCurve: 'continuous',
    minHeight: SPACING_XS,
  },
  barLabel: {
    fontSize: 11,
    marginTop: SPACING_S,
  },

  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING_M,
    gap: SPACING_M,
  },
  categoryDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryDotText: {
    color: '#fff',
    fontSize: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 40 + SPACING_M,
  },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    borderCurve: 'continuous',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    borderCurve: 'continuous',
  },

  budgetCard: {
    borderRadius: BORDER_RADIUS_M,
    borderCurve: 'continuous',
    padding: SPACING_L,
    marginBottom: SPACING_M,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderCurve: 'continuous',
  },

  accountCard: {
    borderRadius: BORDER_RADIUS_L,
    borderCurve: 'continuous',
    padding: SPACING_XL,
    marginBottom: SPACING_M,
  },

  totalCard: {
    borderRadius: BORDER_RADIUS_M,
    borderCurve: 'continuous',
    padding: SPACING_XL,
    marginTop: SPACING_S,
    alignItems: 'center',
  },

  profileSection: {
    paddingHorizontal: SPACING_L,
    paddingBottom: SPACING_L,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING_S,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
  },
  drawerDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: SPACING_L,
    marginVertical: SPACING_S,
  },
  drawerFooter: {
    paddingHorizontal: SPACING_L,
    paddingTop: SPACING_S,
  },
  drawerContentContainer: {
    flexGrow: 1,
  },
  drawerSpacer: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: SPACING_L,
    paddingBottom: SPACING_L,
  },
});
