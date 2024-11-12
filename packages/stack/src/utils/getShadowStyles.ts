import Color from 'color';
import { Platform } from 'react-native';

type ShadowConfig = {
  offset?: {
    width: number;
    height: number;
  };
  radius?: number;
  opacity?: number;
  color?: string;
};

export function getShadowStyles(config: ShadowConfig = {}) {
  const result = Platform.select({
    web: {
      ...(config.offset && {
        boxShadow: `${config.offset.width}px ${config.offset.height}px ${
          config.radius ?? 5
        }px ${
          config.color
            ? Color(config.color)
                .alpha(config.opacity ?? 0.3)
                .toString()
            : Color('#000')
                .alpha(config.opacity ?? 0.3)
                .toString()
        }`,
      }),
    },
    default: {
      ...(config.offset && { shadowOffset: config.offset }),
      ...(config.radius !== undefined && { shadowRadius: config.radius }),
      ...(config.color !== undefined && { shadowColor: config.color }),
      ...(config.opacity !== undefined && { shadowOpacity: config.opacity }),
    },
  });

  return result;
}

export const shadowDirections = {
  base: () =>
    getShadowStyles({
      offset: { width: 0, height: 0 },
      radius: 5,
      opacity: 0.3,
      color: '#000',
    }),
  horizontal: () =>
    getShadowStyles({
      offset: { width: -1, height: 1 },
    }),
  vertical: () =>
    getShadowStyles({
      offset: { width: 1, height: -1 },
    }),
};
