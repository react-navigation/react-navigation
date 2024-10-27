import type { NavigationContainerRef } from '@react-navigation/core';
import * as React from 'react';

import { useDevToolsBase } from './useDevToolsBase';

export function useLogger(ref: React.RefObject<NavigationContainerRef<any>>) {
  useDevToolsBase(ref, (result) => {
    const log = [[`${result.type} `, 'color: gray; font-weight: lighter']];

    if (result.type === 'action') {
      log.push([`${result.action.type} `, 'color: black; font-weight: bold']);

      const payload = result.action.payload;

      if (payload && Object.keys(payload).length > 0) {
        log.push(
          ['{ ', 'color: gray; font-weight: lighter'],
          ...Object.entries(payload)
            .map(([key, value], i, self) => {
              const pair = [
                [key, 'color: green; font-weight: normal'],
                [': ', 'color: gray; font-weight: lighter'],
                [JSON.stringify(value), 'color: blue; font-weight: normal'],
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
            'color: black; font-weight: bold',
            `\n${value
              .split('\n')
              .map((line) => line.trim())
              .join('\n')}`
          );
        }
      } else if (key !== 'type') {
        console.log(`%c${key}`, 'color: black; font-weight: bold', value);
      }
    });

    console.groupEnd();
  });
}
