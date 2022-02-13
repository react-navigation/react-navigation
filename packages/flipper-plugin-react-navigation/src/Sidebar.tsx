import { DataInspector, Layout, styled, theme } from 'flipper-plugin';
import * as React from 'react';

import { Title4 } from './Typography';

export function Sidebar({
  action,
  state,
  stack,
}: {
  action: object;
  state: object | undefined;
  stack: string | undefined;
}) {
  return (
    <Layout.Container gap pad>
      {stack ? (
        <>
          <Title4>Stack</Title4>
          <Code>
            {stack.split('\n').map((line, index) => {
              const match = line.match(/^(.+)@(.+):(\d+):(\d+)$/);

              if (match) {
                const [, methodName, file, lineNumber, column] = match;

                if (file.includes('/node_modules/@react-navigation')) {
                  return null;
                }

                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={index}>
                    {methodName.split('.').map((part, i, self) => {
                      if (i === self.length - 1 && i !== 0) {
                        return <Method>{part}</Method>;
                      }

                      if (self.length !== 1) {
                        return (
                          <>
                            {part}
                            <Separator>.</Separator>
                          </>
                        );
                      }

                      return part;
                    })}{' '}
                    <Separator>(</Separator>
                    <StringToken>{file.split('/').pop()}</StringToken>
                    <Separator>:</Separator>
                    <NumberToken>{lineNumber}</NumberToken>:
                    <NumberToken>{column}</NumberToken>
                    <Separator>)</Separator>
                  </div>
                );
              }

              return (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index}>{line}</div>
              );
            })}
          </Code>
        </>
      ) : null}
      <Title4>Action</Title4>
      <DataInspector data={action} expandRoot={false} />
      <Title4>State</Title4>
      <DataInspector data={state} expandRoot={false} />
    </Layout.Container>
  );
}

const Code = styled.div({
  fontSize: 11,
  fontFamily: theme.monospace.fontFamily,
  margin: '7.5px 0px',
});

const StringToken = styled.span({
  color: 'rgb(224, 76, 96)',
});

const NumberToken = styled.span({
  color: 'rgb(77, 187, 166)',
});

const Method = styled.span({
  color: 'rgb(123, 100, 192)',
});

const Separator = styled.span({
  color: '#555',
});
