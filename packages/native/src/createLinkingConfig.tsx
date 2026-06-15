import type {
  ParamListBase,
  ValidateLinkingPathConfig,
} from '@react-navigation/core';

import type { LinkingOptions } from './types';

type ValidateLinkingConfig<ParamList extends {}, Config> = Config extends {
  config: infer PathConfig;
}
  ? { config: ValidateLinkingPathConfig<ParamList, PathConfig> }
  : unknown;

export function createLinkingConfig<
  ParamList extends {} = ParamListBase,
  const Config extends LinkingOptions<NoInfer<ParamList>> = LinkingOptions<
    NoInfer<ParamList>
  >,
>(
  config: Config & ValidateLinkingConfig<ParamList, Config>
): LinkingOptions<ParamList> & Config {
  return config;
}
