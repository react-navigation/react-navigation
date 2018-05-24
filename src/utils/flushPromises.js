// see https://github.com/facebook/jest/issues/2157#issuecomment-279171856
export default function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}
