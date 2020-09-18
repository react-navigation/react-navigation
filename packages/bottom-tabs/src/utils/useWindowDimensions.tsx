import * as React from 'react';
import { ScaledSize, Dimensions } from 'react-native';

// This is similar to the new useWindowDimensions hook in react-native
// However, we have a custom implementation to support older RN versions
export default function useWindowDimensions() {
  const [dimensions, setDimensions] = React.useState(() => {
    // `height` and `width` maybe undefined during SSR, so we initialize them
    const { height = 0, width = 0 } = Dimensions.get('window');

    return { height, width };
  });

  React.useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize }) => {
      const { width, height } = window;

      setDimensions((d) => {
        if (width === d.width && height === d.height) {
          return d;
        }

        return { width, height };
      });
    };

    // We might have missed an update before the listener was added
    // So make sure to update the dimensions
    onChange({ window: Dimensions.get('window') });

    Dimensions.addEventListener('change', onChange);

    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  return dimensions;
}
