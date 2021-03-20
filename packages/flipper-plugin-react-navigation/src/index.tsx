import * as React from 'react';
import { styled } from 'flipper';
import { theme } from 'flipper-plugin';
import { Tabs } from 'antd';
import { useStore } from './useStore';
import { Logs } from './Logs';
import { LinkingTester } from './LinkingTester';

const { TabPane } = Tabs;

export function Component() {
  const store = useStore();

  const [activeKey, setActiveKey] = React.useState('logs');

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      tabBarStyle={{ marginBottom: 0 }}
    >
      <TabsContent tab={<TabLabel>Logs</TabLabel>} key="logs">
        <Logs active={activeKey === 'logs'} {...store} />
      </TabsContent>
      <TabsContent tab={<TabLabel>Linking</TabLabel>} key="linking">
        <LinkingTester active={activeKey === 'linking'} {...store} />
      </TabsContent>
    </Tabs>
  );
}

const TabLabel = styled.span({
  padding: `0 ${theme.space.large}px`,
});

const TabsContent = styled(TabPane)({
  height: 'calc(100vh - 80px)',
});

export * from './plugin';
