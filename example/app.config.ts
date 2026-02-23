import { execSync } from 'node:child_process';

import type { ExpoConfig } from '@expo/config-types';

const DEFAULT_METRO_PORT = 8081;
const BRANCH_PORT_RANGE = 2000;
const MAX_SUFFIX_LENGTH = 24;

export default function withBranchConfig({
  config,
}: {
  config: ExpoConfig;
}): ExpoConfig {
  const branch = git('symbolic-ref --short HEAD');
  const defaultBranch = git('symbolic-ref refs/remotes/origin/HEAD')?.replace(
    'refs/remotes/origin/',
    ''
  );

  const suffix =
    branch && branch !== defaultBranch ? createSuffix(branch) : undefined;
  const metroPort = branch
    ? DEFAULT_METRO_PORT + 1 + (hash(branch) % BRANCH_PORT_RANGE)
    : DEFAULT_METRO_PORT;

  const nextConfig: ExpoConfig = {
    ...config,
    extra: {
      ...config.extra,
      metroPort,
    },
  };

  if (!suffix) {
    return nextConfig;
  }

  return {
    ...nextConfig,
    scheme: `${nextConfig.scheme}+${suffix}`,
    ios: {
      ...nextConfig.ios,
      bundleIdentifier: `${nextConfig.ios?.bundleIdentifier}.${suffix}`,
    },
    android: {
      ...nextConfig.android,
      package: `${nextConfig.android?.package}.${suffix}`,
    },
  };
}

function createSuffix(branch: string) {
  const leaf = branch.split('/').filter(Boolean).pop() ?? branch;
  const suffix = `${leaf.toLowerCase().replace(/[^a-z0-9]/g, '')}${hash(branch)
    .toString(36)
    .slice(-4)
    .padStart(4, '0')}`.slice(0, MAX_SUFFIX_LENGTH);

  return /^[a-z]/.test(suffix)
    ? suffix
    : `b${suffix}`.slice(0, MAX_SUFFIX_LENGTH);
}

function hash(value: string) {
  let hashValue = 0;

  for (const character of value) {
    hashValue = (hashValue * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hashValue;
}

function git(command: string) {
  try {
    const output = execSync(`git ${command}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return output.trim() || undefined;
  } catch {
    return undefined;
  }
}
