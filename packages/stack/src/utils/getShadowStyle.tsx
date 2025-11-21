import { Platform } from 'react-native';

type ShadowConfig = {
  offset: {
    width: number;
    height: number;
  };
  radius: number;
  opacity: number;
};

export function getShadowStyle({ offset, radius, opacity }: ShadowConfig) {
  const result = Platform.select({
    web: {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px rgba(0, 0, 0, ${opacity})`,
    },
    default: {
      shadowOffset: offset,
      shadowRadius: radius,
      shadowColor: '#000',
      shadowOpacity: opacity,
    },
  });

  return result;
}
