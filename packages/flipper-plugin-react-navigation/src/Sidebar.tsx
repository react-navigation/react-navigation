import { Layout, ManagedDataInspector } from 'flipper';
import * as React from 'react';

import { Title4 } from './Typography';

export function Sidebar({
  action,
  state,
}: {
  action: object;
  state: object | undefined;
}) {
  return (
    <Layout.Container gap pad>
      <Title4>Action</Title4>
      <ManagedDataInspector data={action} expandRoot={false} />
      <Title4>State</Title4>
      <ManagedDataInspector data={state} expandRoot={false} />
    </Layout.Container>
  );
}
