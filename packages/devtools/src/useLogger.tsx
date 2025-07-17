import type { NavigationContainerRef } from '@react-navigation/core';
import * as React from 'react';

import { useDevToolsBase } from './useDevToolsBase';

export function useLogger(
  ref: React.RefObject<NavigationContainerRef<any> | null>
) {
  useDevToolsBase(ref, (result) => {
    const log = [[`${result.type} `, 'color: gray; font-weight: lighter']];

    switch (result.type) {
      case 'action': {
        log.push([
          `${result.action.type} `,
          `color: ${actionColor}; font-weight: bold`,
        ]);

        const payload = result.action.payload;

        if (payload && Object.keys(payload).length > 0) {
          log.push(...colorize(payload));
        }
        break;
      }
      case 'event': {
        log.push([
          `${result.name} `,
          `color: ${actionColor}; font-weight: bold`,
        ]);

        if (result.data) {
          log.push(...colorize(result.data));
        }

        break;
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

function colorize(payload: unknown): string[][] {
  if (typeof payload !== 'object' || payload === null) {
    return [
      [JSON.stringify(payload), `color: ${valueColor}; font-weight: normal`],
    ];
  }

  return [
    ['{ ', 'color: gray; font-weight: lighter'],
    ...Object.entries(payload)
      .map(([key, value], i, self) => {
        const pair = [
          [key, `color: ${keyColor}; font-weight: normal`],
          [': ', 'color: gray; font-weight: lighter'],
          ...colorize(value),
        ];

        if (i < self.length - 1) {
          pair.push([', ', 'color: gray; font-weight: lighter']);
        }

        return pair;
      })
      .flat(1),
    [' } ', 'color: gray; font-weight: lighter'],
  ];
}

const actionColor = '#C2185B';
const keyColor = '#43A047';
const valueColor = '#1E88E5';
