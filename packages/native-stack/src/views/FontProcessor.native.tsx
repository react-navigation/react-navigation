// @ts-ignore: No declaration available
import ReactNativeStyleAttributes from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export function processFonts(
  fontFamilies: (string | undefined)[]
): (string | undefined)[] {
  // @ts-ignore: React Native types are incorrect here and don't consider fontFamily a style value
  const fontFamilyProcessor = ReactNativeStyleAttributes.fontFamily?.process;
  if (typeof fontFamilyProcessor === 'function') {
    return fontFamilies.map(fontFamilyProcessor);
  }
  return fontFamilies;
}
