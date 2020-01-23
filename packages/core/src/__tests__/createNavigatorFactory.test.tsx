import createNavigatorFactory from '../createNavigatorFactory';

it('throws descriptive error if an argument is passed', () => {
  const createDummyNavigator = createNavigatorFactory(() => null);

  expect(() => createDummyNavigator()).not.toThrowError();

  // @ts-ignore
  expect(() => createDummyNavigator({})).toThrowError(
    "Creating a navigator doesn't take an argument."
  );
});
