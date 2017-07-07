/* @flow */

export const Linking = {
  addEventListener: (type: string, handler: Function) => {},
  removeEventListener: (type: string, handler: Function) => {},
  getInitialURL: () => Promise.reject('Unsupported platform'),
};

type BackPressEventName = $Enum<{
  backPress: string,
}>;
export const BackAndroid = {
  addEventListener: (eventName: BackPressEventName, handler: Function) => {},
};
