let location = new URL('', 'http://example.com');

const listeners: Record<'popstate' | 'hashchange', (() => void)[]> = {
  popstate: [],
  hashchange: [],
};
let entries = [{ state: null, href: location.href }];
let index = 0;

let currentState: any = null;

const emit = (type: 'popstate' | 'hashchange') => {
  listeners[type].forEach((cb) => cb());
};

const history = {
  get state() {
    return currentState;
  },

  pushState(state: any, _: string, path: string) {
    location = new URL(path, location.origin);

    currentState = state;
    entries = entries.slice(0, index + 1);
    entries.push({ state, href: location.href });
    index = entries.length - 1;
  },

  replaceState(state: any, _: string, path: string) {
    location = new URL(path, location.origin);

    currentState = state;
    entries[index] = { state, href: location.href };
  },

  go(n: number) {
    setTimeout(() => {
      if (
        (n > 0 && n < entries.length - index) ||
        (n < 0 && Math.abs(n) <= index)
      ) {
        const previousHash = location.hash;

        index += n;
        const entry = entries[index];

        if (entry == null) {
          throw new Error(`Couldn't find a history entry at index ${index}.`);
        }

        location = new URL(entry.href);
        currentState = entry.state;
        emit('popstate');

        if (previousHash !== location.hash) {
          emit('hashchange');
        }
      }
    }, 0);
  },

  back() {
    this.go(-1);
  },

  forward() {
    this.go(1);
  },
};

const setHash = (hash: string) => {
  const next = new URL(location.href);

  next.hash = hash;

  if (next.href === location.href) {
    return;
  }

  location = next;

  entries = entries.slice(0, index + 1);
  entries.push({ state: currentState, href: location.href });
  index = entries.length - 1;

  setTimeout(() => emit('hashchange'), 0);
};

const addEventListener = (
  type: 'popstate' | 'hashchange',
  listener: () => void
) => {
  listeners[type].push(listener);
};

const removeEventListener = (
  type: 'popstate' | 'hashchange',
  listener: () => void
) => {
  listeners[type] = listeners[type].filter((cb) => cb !== listener);
};

export const window = {
  document: { title: '' },
  get location() {
    return location;
  },
  history,
  setHash,
  addEventListener,
  removeEventListener,
  get window() {
    return window;
  },
};
