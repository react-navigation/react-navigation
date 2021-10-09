/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stacktraceParser from 'stacktrace-parser';

import parseHermesStack, { HermesParsedStack } from './parseHermesStack';

interface StackFrame {
  methodName: string;
  file: string;
  lineNumber: number;
  column: number;
}

function convertHermesStack(stack: HermesParsedStack): StackFrame[] {
  const frames = [];
  for (const entry of stack.entries) {
    if (entry.type !== 'FRAME') {
      continue;
    }
    const { location, functionName } = entry;
    if (location.type === 'NATIVE') {
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

function parseErrorStack(errorStack?: string | StackFrame[]): StackFrame[] {
  if (!errorStack) {
    return [];
  }

  const parsedStack = Array.isArray(errorStack)
    ? errorStack
    : (global as any).HermesInternal
    ? convertHermesStack(parseHermesStack(errorStack))
    : stacktraceParser.parse(errorStack).map((frame) => ({
        ...frame,
        column: frame.column != null ? frame.column - 1 : null,
      }));

  return parsedStack as StackFrame[];
}

export default parseErrorStack;
