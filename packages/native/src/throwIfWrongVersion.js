export default function () {
  throw new Error(
    "Looks like you have React Navigation 4 installed, but are trying to use React Navigation 5 APIs. Mixing React Navigation 4 and 5 are not supported. Make sure you install 5.x version of the '@react-navigation/native' package. See https://reactnavigation.org/docs/getting-started for installation instructions for React Navigation 5."
  );
}
