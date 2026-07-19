declare module '*.png';
declare module '*.jpg';

declare module '*.ttf' {
  const source: number;

  export = source;
}
