import * as CommonActions from '../CommonActions';

it('throws if NAVIGATE is called without key or name', () => {
  // @ts-ignore
  expect(() => CommonActions.navigate({})).toThrowError(
    'You need to specify name or key when calling navigate with an object as the argument.'
  );
});
