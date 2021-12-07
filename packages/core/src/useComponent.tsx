import * as React from 'react';

export default function useComponent<
  T extends React.ComponentType<any>,
  P extends {}
>(Component: T, props: P) {
  const propsRef = React.useRef<P | null>(props);

  // Normally refs shouldn't be mutated in render
  // But we return a component which will be rendered
  // So it's just for immediate consumption
  propsRef.current = props;

  React.useEffect(() => {
    propsRef.current = null;
  });

  return React.useRef((rest: Omit<React.ComponentProps<T>, keyof P>) => {
    const props = propsRef.current;

    if (props === null) {
      throw new Error(
        'The returned component must be rendered in the same render phase as the hook.'
      );
    }

    // @ts-expect-error: the props should be fine here
    return <Component {...props} {...rest} />;
  }).current;
}
