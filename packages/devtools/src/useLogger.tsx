import type { NavigationContainerRef } from '@react-navigation/core';
import * as React from 'react';

import { useDevToolsBase } from './useDevToolsBase';

export function useLogger(
  ref: React.RefObject<NavigationContainerRef<any> | null>
) {
  const actionColor = '#C2185B';
  const keyColor = '#43A047';
  const valueColor = '#1E88E5';

  useDevToolsBase(ref, (result) => {
    const log = [[`${result.type} `, 'color: gray; font-weight: lighter']];

    if (result.type === 'action') {
      log.push([
        `${result.action.type} `,
        `color: ${actionColor}; font-weight: bold`,
      ]);

      const payload = result.action.payload;

      if (payload && Object.keys(payload).length > 0) {
        log.push(
          ['{ ', 'color: gray; font-weight: lighter'],
          ...Object.entries(payload)
            .map(([key, value], i, self) => {
              const pair = [
                [key, `color: ${keyColor}; font-weight: normal`],
                [': ', 'color: gray; font-weight: lighter'],
                [
                  JSON.stringify(value),
                  `color: ${valueColor}; font-weight: normal`,
                ],
              ];

              if (i < self.length - 1) {
                pair.push([', ', 'color: gray; font-weight: lighter']);
              }

              return pair;
            })
            .flat(1),
          [' } ', 'color: gray; font-weight: lighter']
        );
      }
    }

    const params = log.reduce(
      (acc, [text, style]) => {
        acc[0] += `%c${text}`;
        acc.push(style);

        return acc;
      },
      ['']
    );

    console.groupCollapsed(...params);

    Object.entries(result).forEach(([key, value]) => {
      if (key === 'stack') {
        if (typeof value === 'string') {
          console.log(
            `%cstack`,
            `color: ${actionColor}; font-weight: bold`,
            `\n${value
              .split('\n')
              .map((line) => line.trim())
              .join('\n')}`
          );
        }
      } else if (key !== 'type') {
        console.log(
          `%c${key}`,
          `color: ${actionColor}; font-weight: bold`,
          value
        );
      }
    });

    console.groupEnd();
  });
}
