import { styled } from 'flipper';
import { theme } from 'flipper-plugin';
import * as React from 'react';

import type { PartialRoute } from './types';

type Props = {
  routes: PartialRoute[];
  root?: boolean;
};

export function RouteMap({ routes, root = true }: Props) {
  return (
    <Container
      style={{
        ...(root
          ? { overflowX: 'auto', padding: `0 ${theme.space.small}px` }
          : null),
      }}
    >
      {routes.map((route, i) => (
        <Item key={route.name}>
          <div>
            <Name>
              {route.name}
              {root ? null : i === 0 ? <ConnectLeft /> : <ConnectUpLeft />}
            </Name>
            {route.params ? (
              <ParamsContainer>
                <Params>
                  <tbody>
                    {Object.entries(route.params).map(([key, value]) => (
                      <Row key={key}>
                        <Key>{key}</Key>
                        <Separator>:</Separator>
                        <Value>{JSON.stringify(value)}</Value>
                      </Row>
                    ))}
                  </tbody>
                </Params>
                <ConnectUp />
              </ParamsContainer>
            ) : null}
          </div>
          {route.state ? (
            <RouteMap routes={route.state.routes} root={false} />
          ) : null}
        </Item>
      ))}
    </Container>
  );
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Item = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
});

const Name = styled.div({
  minWidth: 120,
  backgroundColor: theme.primaryColor,
  color: 'white',
  fontSize: theme.fontSize.default,
  margin: theme.space.small,
  padding: `${theme.space.small}px ${theme.space.large}px`,
  borderRadius: theme.borderRadius,
  position: 'relative',
  textAlign: 'center',
});

const ParamsContainer = styled.div({
  position: 'relative',
});

const Params = styled.table({
  minWidth: 120,
  borderCollapse: 'separate',
  border: `1px solid ${theme.primaryColor}`,
  fontFamily: theme.monospace.fontFamily,
  fontSize: theme.monospace.fontSize,
  margin: `${theme.space.large}px ${theme.space.small}px`,
  padding: theme.space.small,
  borderRadius: theme.borderRadius,
  width: 'auto',
  overflow: 'visible',
});

const Row = styled.tr({
  border: 0,
  background: 'none',
});

const Key = styled.td({
  color: theme.textColorSecondary,
  border: 0,
  padding: '0 4px',
  textAlign: 'right',
});

const Value = styled.td({
  color: theme.primaryColor,
  padding: `0 ${theme.space.tiny}px`,
  border: 0,
});

const Separator = styled.td({
  color: 'inherit',
  opacity: 0.3,
  border: 0,
  padding: 0,
});

const ConnectLeft = styled.div({
  position: 'absolute',
  width: 16,
  height: 1,
  backgroundColor: theme.primaryColor,
  right: '100%',
  top: '50%',
});

const ConnectUpLeft = styled.div({
  position: 'absolute',
  width: 9,
  height: 53,
  border: `1px solid ${theme.primaryColor}`,
  borderRadius: `0 0 0 ${theme.borderRadius}`,
  borderRight: 0,
  borderTop: 0,
  right: '100%',
  bottom: '50%',
});

const ConnectUp = styled.div({
  position: 'absolute',
  width: 1,
  height: 16,
  backgroundColor: theme.primaryColor,
  right: '50%',
  bottom: '100%',
});
