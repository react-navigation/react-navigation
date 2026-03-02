export function getLabel(
  options: { label?: string | undefined; title?: string | undefined },
  fallback: string
): string {
  return options.label !== undefined
    ? options.label
    : options.title !== undefined
      ? options.title
      : fallback;
}
