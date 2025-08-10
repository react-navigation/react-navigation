/**
 * Copied from expo-blur
 * https://github.com/expo/expo/blob/d9cec38a1db4dcf3306a1814651386a99b9aaa73/packages/expo-blur/src/getBackgroundColor.ts
 */

export type BlurEffectType =
  | 'extraLight'
  | 'light'
  | 'dark'
  | 'regular'
  | 'prominent'
  | 'systemUltraThinMaterial'
  | 'systemThinMaterial'
  | 'systemMaterial'
  | 'systemThickMaterial'
  | 'systemChromeMaterial'
  | 'systemUltraThinMaterialLight'
  | 'systemThinMaterialLight'
  | 'systemMaterialLight'
  | 'systemThickMaterialLight'
  | 'systemChromeMaterialLight'
  | 'systemUltraThinMaterialDark'
  | 'systemThinMaterialDark'
  | 'systemMaterialDark'
  | 'systemThickMaterialDark'
  | 'systemChromeMaterialDark';

export function getBlurBackgroundColor(type: BlurEffectType): string {
  const multiplier = 0.5;

  switch (type) {
    // From Apple iOS 14 Sketch Kit - https://developer.apple.com/design/resources/
    case 'dark':
    case 'systemMaterialDark':
      return `rgba(25,25,25,${multiplier * 0.78})`;
    case 'light':
    case 'extraLight':
    case 'systemMaterialLight':
    case 'systemUltraThinMaterialLight':
    case 'systemThickMaterialLight':
      return `rgba(249,249,249,${multiplier * 0.78})`;
    case 'prominent':
    case 'systemMaterial':
      return `rgba(255,255,255,${multiplier * 0.3})`;
    case 'regular':
      return `rgba(179,179,179,${multiplier * 0.82})`;
    case 'systemThinMaterial':
      return `rgba(199,199,199,${multiplier * 0.97})`;
    case 'systemChromeMaterial':
      return `rgba(255,255,255,${multiplier * 0.75})`;
    case 'systemChromeMaterialLight':
      return `rgba(255,255,255,${multiplier * 0.97})`;
    case 'systemUltraThinMaterial':
      return `rgba(191,191,191,${multiplier * 0.44})`;
    case 'systemThickMaterial':
      return `rgba(191,191,191,${multiplier * 0.44})`;
    case 'systemThickMaterialDark':
      return `rgba(37,37,37,${multiplier * 0.9})`;
    case 'systemThinMaterialDark':
      return `rgba(37,37,37,${multiplier * 0.7})`;
    case 'systemUltraThinMaterialDark':
      return `rgba(37,37,37,${multiplier * 0.55})`;
    case 'systemChromeMaterialDark':
      return `rgba(0,0,0,${multiplier * 0.75})`;
    case 'systemThinMaterialLight':
      return `rgba(199,199,199,${multiplier * 0.78})`;
  }
}
