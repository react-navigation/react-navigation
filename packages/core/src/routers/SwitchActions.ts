export const JUMP_TO = 'Navigation/JUMP_TO';

export const jumpTo = (payload: {
  routeName: string;
  key: string;
  params?: object;
}) => ({
  type: JUMP_TO,
  preserveFocus: true,
  ...payload,
});
