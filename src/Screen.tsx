export type Props = {
  name: string;
  options?: object;
} & (
  | { component: React.ComponentType<any> }
  | { children: (props: any) => React.ReactNode });

export default function Screen(_: Props) {
  return null;
}
