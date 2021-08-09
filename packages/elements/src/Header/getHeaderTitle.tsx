import type { StackHeaderOptions } from '@react-navigation/stack/src/types';

export default function getHeaderTitle(
  options: { title?: string; headerTitle?: StackHeaderOptions['headerTitle'] },
  fallback: string
): string {
  return typeof options.headerTitle === 'string'
    ? options.headerTitle
    : options.title !== undefined
    ? options.title
    : fallback;
}
