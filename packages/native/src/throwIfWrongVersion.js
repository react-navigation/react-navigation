export default function () {
  throw new Error(
    'Looks like you are trying to use React Navigation 5 APIs, but have React Navigation 4 installed.\n\nMixing React Navigation 4 and 5 is not supported. See the documentation for installation instructions and usage guide for appropriate versions:\n\n- React Navigation 5: https://reactnavigation.org/docs/getting-started\n- React Navigation 4: https://reactnavigation.org/docs/4.x/getting-started'
  );
}
