import type { SpawnOptions, SpawnSyncReturns } from 'child_process';
import spawn from 'cross-spawn';

/**
 * An exec function that preserve colors
 */
export const exec = (
  cmd: string,
  options?: SpawnOptions
): SpawnSyncReturns<any> => {
  const args = cmd.split(' ');
  return spawn.sync(args[0], args.slice(1), {
    ...options,
    stdio: 'inherit',
    shell: true,
  });
};
