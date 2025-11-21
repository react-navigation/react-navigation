import type {
  PagerViewAdapter as PagerViewAdapterType,
  PagerViewAdapterProps,
} from './PagerViewAdapter.native';

export type { PagerViewAdapterProps };

export const PagerViewAdapter: typeof PagerViewAdapterType = () => {
  throw new Error(
    `'PagerViewAdapter' is not supported on web. Use 'PanResponderAdapter' or 'ScrollViewAdapter' instead.`
  );
};
