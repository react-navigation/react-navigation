import { CompassOutlined } from '@ant-design/icons';
import { DetailSidebar, styled, VirtualList } from 'flipper';
import { theme } from 'flipper-plugin';
import * as React from 'react';

import { Sidebar } from './Sidebar';
import type { StoreType } from './types';

type Props = StoreType & {
  active: boolean;
};

export function Logs({ active, logs, index, resetTo }: Props) {
  const [selectedID, setSelectedID] = React.useState<string | null>(null);

  const selectedItem = selectedID
    ? logs.find((log) => log.id === selectedID)
    : logs[logs.length - 1];

  return logs.length ? (
    <>
      <VirtualList
        data={logs}
        rowHeight={51}
        renderRow={({ id, action }, i) => (
          <Row
            key={id}
            selected={selectedItem?.id === id}
            faded={index != null ? index > -1 && i > index : false}
            onClick={() => {
              if (id === logs[logs.length - 1].id) {
                setSelectedID(null);
              } else {
                setSelectedID(id);
              }
            }}
          >
            {action.type}
            <JumpButton type="button" onClick={() => resetTo(id)}>
              Reset to this
            </JumpButton>
          </Row>
        )}
      />
      {active ? (
        <DetailSidebar>
          {selectedItem && (
            <Sidebar action={selectedItem.action} state={selectedItem.state} />
          )}
        </DetailSidebar>
      ) : null}
    </>
  ) : (
    <Center>
      <Faded>
        <EmptyIcon />
        <BlankslateText>Navigate in the app to see actions</BlankslateText>
      </Faded>
    </Center>
  );
}

const Row = styled.button<{ selected: boolean; faded: boolean }>((props) => ({
  'appearance': 'none',
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'space-between',
  'fontFamily': theme.monospace.fontFamily,
  'fontSize': theme.monospace.fontSize,
  'textAlign': 'left',
  'padding': `${theme.space.medium}px ${theme.space.large}px`,
  'color': props.selected ? '#fff' : '#000',
  'backgroundColor': props.selected ? theme.primaryColor : 'transparent',
  'opacity': props.faded ? 0.5 : 1,
  'border': 0,
  'boxShadow': `inset 0 -1px 0 0 ${theme.dividerColor}`,
  'width': '100%',
  'cursor': 'pointer',

  '&:hover': {
    backgroundColor: props.selected
      ? theme.primaryColor
      : 'rgba(0, 0, 0, 0.05)',
  },
}));

const JumpButton = styled.button({
  'appearance': 'none',
  'backgroundColor': 'rgba(0, 0, 0, 0.1)',
  'border': 0,
  'margin': 0,
  'padding': `${theme.space.tiny}px ${theme.space.medium}px`,
  'color': 'inherit',
  'cursor': 'pointer',
  'fontSize': theme.fontSize.small,
  'borderRadius': theme.borderRadius,

  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});

const Center = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

const Faded = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  opacity: 0.3,
});

const EmptyIcon = styled(CompassOutlined)({
  display: 'block',
  fontSize: 48,
  margin: theme.space.large,
  opacity: 0.8,
});

const BlankslateText = styled.h5({
  color: 'rgba(0, 0, 0, 0.85)',
  fontWeight: 600,
  fontSize: 16,
  lineHeight: 1.5,
});
