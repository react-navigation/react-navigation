import { NavigationProp } from '../types';

type TestParamList = {
  MyRoute: undefined;
  AnotherRoute: { something: string };
  MyWay: { something: number } | undefined;
};

type TestNavigation = NavigationProp<TestParamList>;

it('navigates in a type safe way', () => {
  expect.assertions(1);

  const { navigate } = ({ navigate: jest.fn() } as any) as TestNavigation;

  // MyRoute doesn't take any param, it accepts both
  navigate('MyRoute');
  // and
  navigate('MyRoute', undefined);
  // but raises an error for:
  // @ts-ignore (TODO: switch to @ts-expect-error once we switch to TS 3.9)
  navigate('MyRoute', { someParam: 'test ' });

  // AnotherRoute takes params, it only accepts the following
  navigate('AnotherRoute', { something: 'something' });
  // and raises a compile time error if one of the route param is missing or incorrect:
  // @ts-ignore (TODO: switch to @ts-expect-error once we switch to TS 3.9)
  navigate('AnotherRoute', { anotherParam: 'something' });
  // This will also raise an error:
  // @ts-ignore (TODO: switch to @ts-expect-error once we switch to TS 3.9)
  navigate('AnotherRoute');

  // MyWay params are optional, it accepts both
  navigate('MyWay', { something: 3 });
  // and
  navigate('MyWay');
  // but errors with:
  // @ts-ignore (TODO: switch to @ts-expect-error once we switch to TS 3.9)
  navigate('MyWay', {});

  expect(navigate).toHaveBeenCalledTimes(9);
});
