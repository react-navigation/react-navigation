import * as CommonActions from '../CommonActions';

it('throws if NAVIGATE is called without key or name', () => {
  // @ts-expect-error: we're explicitly using an invalid argument here
  expect(() => CommonActions.navigate({})).toThrowError(
    'You need to specify name or key when calling navigate with an object as the argument.'
  );
});
