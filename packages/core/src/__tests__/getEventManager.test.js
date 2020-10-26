import getEventManager from '../getEventManager';

const TARGET = 'target';

it('calls listeners to emitted event', () => {
  const eventManager = getEventManager(TARGET);
  const callback = jest.fn();
  eventManager.addListener('didFocus', callback);

  eventManager.emit('didFocus');

  expect(callback).toHaveBeenCalledTimes(1);
});

it('does not call listeners connected to a different event', () => {
  const eventManager = getEventManager(TARGET);
  const callback = jest.fn();
  eventManager.addListener('didFocus', callback);

  eventManager.emit('didBlur');

  expect(callback).not.toHaveBeenCalled();
});

it('does not call removed listeners', () => {
  const eventManager = getEventManager(TARGET);
  const callback = jest.fn();
  const { remove } = eventManager.addListener('didFocus', callback);

  eventManager.emit('didFocus');
  expect(callback).toHaveBeenCalled();

  remove();

  eventManager.emit('didFocus');
  expect(callback).toHaveBeenCalledTimes(1);
});

it('calls the listeners with the given payload', () => {
  const eventManager = getEventManager(TARGET);
  const callback = jest.fn();
  eventManager.addListener('didFocus', callback);

  const payload = { foo: 0 };
  eventManager.emit('didFocus', payload);

  expect(callback).toHaveBeenCalledWith(payload);
});
