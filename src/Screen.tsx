import { Options } from './types';

export type Props = {
  name: string;
  options?: Options;
} & (
  | { component: React.ComponentType<any> }
  | { children: (props: any) => React.ReactNode });

export default function Screen(_: Props) {
  return null;
}
