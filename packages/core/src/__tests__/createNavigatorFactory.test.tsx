import createNavigatorFactory from '../createNavigatorFactory';

it('throws descriptive error if an argument is passed', () => {
  const createDummyNavigator = createNavigatorFactory(() => null);

  expect(() => createDummyNavigator()).not.toThrowError();

  // @ts-expect-error: we're explicitly passing invalid argument
  expect(() => createDummyNavigator({})).toThrowError(
    "Creating a navigator doesn't take an argument."
  );
});
