import * as React from 'react';

type Props = {
  tintColor: string;
};

export default function BackButton({ tintColor }: Props) {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24">
      <path
        fill={tintColor}
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      />
    </svg>
  );
}
