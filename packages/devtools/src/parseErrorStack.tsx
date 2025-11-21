/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stacktraceParser from 'stacktrace-parser';

import { type HermesParsedStack, parseHermesStack } from './parseHermesStack';

export type StackFrame = {
  lineNumber: number | null;
  column: number | null;
  file: string | null;
  methodName: string;
};

function convertHermesStack(stack: HermesParsedStack): StackFrame[] {
  const frames: StackFrame[] = [];
  for (const entry of stack.entries) {
    if (entry.type !== 'FRAME') {
      continue;
    }
    const { location, functionName } = entry;
    if (location.type === 'NATIVE' || location.type === 'INTERNAL_BYTECODE') {
      continue;
    }
    frames.push({
      methodName: functionName,
      file: location.sourceUrl,
      lineNumber: location.line1Based,
      column:
        location.type === 'SOURCE'
          ? location.column1Based - 1
          : location.virtualOffset0Based,
    });
  }
  return frames;
}

export function parseErrorStack(errorStack?: string): StackFrame[] {
  if (!errorStack) {
    return [];
  }

  const parsedStack = Array.isArray(errorStack)
    ? errorStack
    : (globalThis as any).HermesInternal
      ? convertHermesStack(parseHermesStack(errorStack))
      : stacktraceParser.parse(errorStack).map(
          (frame): StackFrame => ({
            ...frame,
            column: frame.column != null ? frame.column - 1 : null,
          })
        );

  return parsedStack;
}
