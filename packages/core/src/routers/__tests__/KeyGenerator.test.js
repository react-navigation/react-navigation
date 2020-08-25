import { _TESTING_ONLY_normalize_keys, generateKey } from '../KeyGenerator';

it('should generate a new string key when called', () => {
  _TESTING_ONLY_normalize_keys();

  expect(generateKey()).toBe('id-0');
  expect(generateKey()).toBe('id-1');
});

it('should generate unique string keys without being normalized', () => {
  expect(generateKey()).not.toBe(generateKey());
});
