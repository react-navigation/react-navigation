import type {
  getActionFromState,
  getStateFromPath,
} from '@react-navigation/core';
import { Input } from 'antd';
import { DetailSidebar, styled } from 'flipper';
import { theme } from 'flipper-plugin';
import * as React from 'react';

import { RouteMap } from './RouteMap';
import { Sidebar } from './Sidebar';
import type { StoreType } from './types';

type Props = StoreType & {
  active: boolean;
};

export function LinkingTester({ linking, active }: Props) {
  const [rawConfig, setRawConfig] = React.useState('');
  const [path, setPath] = React.useState('');

  const [state, setState] = React.useState<
    ReturnType<typeof getStateFromPath> | undefined
  >();

  const [action, setAction] = React.useState<
    ReturnType<typeof getActionFromState> | undefined
  >();

  const [error, setError] = React.useState<string | undefined>();

  React.useEffect(() => {
    (async () => {
      try {
        const state = await linking(
          'getStateFromPath',
          path.replace(/(^\w+:|^)\/\//, ''),
          rawConfig
        );

        const action = state
          ? await linking('getActionFromState', state, rawConfig)
          : undefined;

        setState(state);
        setAction(action);
        setError(undefined);
      } catch (e) {
        setState(undefined);
        setAction(undefined);
        setError(
          e?.message ||
            'Failed to parse the path. Make sure that the path matches the patterns specified in the config.'
        );
      }
    })();
  }, [linking, path, rawConfig]);

  return (
    <Container>
      <CodeInput
        type="text"
        value={path}
        placeholder="Type a path to display parsed screens, e.g. /users/@vergil"
        onChange={(e) => setPath(e.target.value)}
      />
      <Details>
        <Summary>Custom configuration (Advanced)</Summary>
        <CodeEditor
          rows={5}
          value={rawConfig}
          placeholder="Type a custom linking config (leave empty to use the config defined in the app)"
          onChange={(e) => setRawConfig(e.target.value)}
        />
      </Details>
      <Section>
        {state ? (
          <RouteMap routes={state.routes} />
        ) : error ? (
          <ErrorDescription>Error: {error}</ErrorDescription>
        ) : null}
        {active ? (
          <DetailSidebar>
            {action && <Sidebar action={action} state={state} />}
          </DetailSidebar>
        ) : null}
      </Section>
    </Container>
  );
}

const Container = styled.div({
  height: '100%',
  overflow: 'auto',
});

const Summary = styled.summary({
  margin: `0 ${theme.space.large}px`,
});

const Section = styled.div({
  margin: `${theme.space.large}px 0`,
});

const Details = styled.details({
  margin: `${theme.space.large}px 0`,
});

const CodeInput = styled(Input)({
  display: 'block',
  fontFamily: theme.monospace.fontFamily,
  fontSize: theme.monospace.fontSize,
  padding: theme.space.medium,
  margin: theme.space.large,
  width: `calc(100% - ${theme.space.large * 2}px)`,
});

const CodeEditor = styled(Input.TextArea)({
  display: 'block',
  fontFamily: theme.monospace.fontFamily,
  fontSize: theme.monospace.fontSize,
  padding: theme.space.medium,
  margin: theme.space.large,
  width: `calc(100% - ${theme.space.large * 2}px)`,
});

const ErrorDescription = styled.p({
  margin: theme.space.huge,
  color: theme.errorColor,
});
