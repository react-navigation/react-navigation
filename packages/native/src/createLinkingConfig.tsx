import type {
  ParamListBase,
  ValidatePathConfig,
  ValidatePathConfigMap,
} from '@react-navigation/core';

import type { LinkingOptions } from './types';

type ValidateLinkingConfig<ParamList extends {}, Config> = Config extends {
  config: infer PathConfig;
}
  ? {
      config: ValidatePathConfig<undefined, PathConfig> &
        (PathConfig extends { screens: infer Screens }
          ? { screens: ValidatePathConfigMap<ParamList, Screens> }
          : unknown);
    }
  : unknown;

// TODO: handle params on screen at navigator level
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
