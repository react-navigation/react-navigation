import ScenesReducer from '../ScenesReducer';
import { Scene, NavigationState, SceneDescriptor } from '../../types';

const MOCK_DESCRIPTOR: SceneDescriptor = {} as any;

/**
 * Simulate scenes transtion with changes of navigation states.
 */
function testTransition(states: string[][]) {
  let descriptors = states
    .reduce((acc, state) => acc.concat(state), [] as string[])
    .reduce(
      (acc, key) => {
        acc[key] = MOCK_DESCRIPTOR;
        return acc;
      },
      {} as { [key: string]: SceneDescriptor }
    );
  const routes = states.map((keys, i) => ({
    key: String(i),
    index: keys.length - 1,
    routes: keys.map(key => ({ key, routeName: '' })),
    isTransitioning: false,
  }));

  let scenes: Scene[] = [];
  let prevState: NavigationState | null = null;
  routes.forEach((nextState: NavigationState) => {
    scenes = ScenesReducer(scenes, nextState, prevState, descriptors);
    prevState = nextState;
  });

  return scenes;
}

describe('ScenesReducer', () => {
  it('gets initial scenes', () => {
    const scenes = testTransition([['1', '2']]);

    expect(scenes).toEqual([
      {
        index: 0,
        isActive: false,
        isStale: false,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_1',
        route: {
          key: '1',
          routeName: '',
        },
      },
      {
        index: 1,
        isActive: true,
        isStale: false,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_2',
        route: {
          key: '2',
          routeName: '',
        },
      },
    ]);
  });

  it('pushes new scenes', () => {
    // Transition from ['1', '2'] to ['1', '2', '3'].
    const scenes = testTransition([['1', '2'], ['1', '2', '3']]);

    expect(scenes).toEqual([
      {
        index: 0,
        isActive: false,
        isStale: false,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_1',
        route: {
          key: '1',
          routeName: '',
        },
      },
      {
        index: 1,
        isActive: false,
        isStale: false,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_2',
        route: {
          key: '2',
          routeName: '',
        },
      },
      {
        index: 2,
        isActive: true,
        isStale: false,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_3',
        route: {
          key: '3',
          routeName: '',
        },
      },
    ]);
  });

  it('gets active scene when index changes', () => {
    const state1 = {
      key: '0',
      index: 0,
      routes: [{ key: '1', routeName: '' }],
      isTransitioning: false,
    };

    const state2 = {
      key: '0',
      index: 1,
      routes: [{ key: '1', routeName: '' }, { key: '2', routeName: '' }],
      isTransitioning: false,
    };

    const scenes1 = ScenesReducer([], state1, null, {});
    const scenes2 = ScenesReducer(scenes1, state2, state1, {});
    const route = scenes2.find(scene => scene.isActive)!.route;
    expect(route).toEqual({ key: '2', routeName: '' });
  });

  it('gets same scenes', () => {
    const state1 = {
      key: '0',
      index: 1,
      routes: [{ key: '1', routeName: '' }, { key: '2', routeName: '' }],
      isTransitioning: false,
    };

    const state2 = {
      key: '0',
      index: 1,
      routes: [{ key: '1', routeName: '' }, { key: '2', routeName: '' }],
      isTransitioning: false,
    };

    const scenes1 = ScenesReducer([], state1, null, {});
    const scenes2 = ScenesReducer(scenes1, state2, state1, {});
    expect(scenes1).toBe(scenes2);
  });

  it('gets different scenes when keys are different', () => {
    const state1 = {
      key: '0',
      index: 1,
      routes: [{ key: '1', routeName: '' }, { key: '2', routeName: '' }],
      isTransitioning: false,
    };

    const state2 = {
      key: '0',
      index: 1,
      routes: [{ key: '2', routeName: '' }, { key: '1', routeName: '' }],
      isTransitioning: false,
    };

    const descriptors = { 1: {}, 2: {} } as any;

    const scenes1 = ScenesReducer([], state1, null, descriptors);
    const scenes2 = ScenesReducer(scenes1, state2, state1, descriptors);
    expect(scenes1).not.toBe(scenes2);
  });

  it('gets different scenes when routes are different', () => {
    const state1 = {
      key: '0',
      index: 1,
      routes: [
        { key: '1', x: 1, routeName: '' },
        { key: '2', x: 2, routeName: '' },
      ],
      isTransitioning: false,
    };

    const state2 = {
      key: '0',
      index: 1,
      routes: [
        { key: '1', x: 3, routeName: '' },
        { key: '2', x: 4, routeName: '' },
      ],
      isTransitioning: false,
    };

    const descriptors = { 1: MOCK_DESCRIPTOR, 2: MOCK_DESCRIPTOR };

    const scenes1 = ScenesReducer([], state1, null, descriptors);
    const scenes2 = ScenesReducer(scenes1, state2, state1, descriptors);
    expect(scenes1).not.toBe(scenes2);
  });

  // NOTE(brentvatne): this currently throws a warning about invalid StackRouter state,
  // which is correct because you can't have a state like state2 where the index is
  // anything except the last route in the array of routes.
  it('gets different scenes when state index changes', () => {
    const state1 = {
      key: '0',
      index: 1,
      routes: [
        { key: '1', x: 1, routeName: '' },
        { key: '2', x: 2, routeName: '' },
      ],
      isTransitioning: false,
    };

    const state2 = {
      key: '0',
      index: 0,
      routes: [
        { key: '1', x: 1, routeName: '' },
        { key: '2', x: 2, routeName: '' },
      ],
      isTransitioning: false,
    };

    const descriptors = { 1: MOCK_DESCRIPTOR, 2: MOCK_DESCRIPTOR };
    const scenes1 = ScenesReducer([], state1, null, descriptors);
    const scenes2 = ScenesReducer(scenes1, state2, state1, descriptors);
    expect(scenes1).not.toBe(scenes2);
  });

  it('pops scenes', () => {
    // Transition from ['1', '2', '3'] to ['1', '2'].
    const scenes = testTransition([['1', '2', '3'], ['1', '2']]);

    expect(scenes).toEqual([
      {
        index: 0,
        isActive: false,
        isStale: false,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_1',
        route: {
          key: '1',
          routeName: '',
        },
      },
      {
        index: 1,
        isActive: true,
        isStale: false,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_2',
        route: {
          key: '2',
          routeName: '',
        },
      },
      {
        index: 2,
        isActive: false,
        isStale: true,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_3',
        route: {
          key: '3',
          routeName: '',
        },
      },
    ]);
  });

  it('replaces scenes', () => {
    const scenes = testTransition([['1', '2'], ['3']]);

    expect(scenes).toEqual([
      {
        index: 0,
        isActive: false,
        isStale: true,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_1',
        route: {
          key: '1',
          routeName: '',
        },
      },
      {
        index: 0,
        isActive: true,
        isStale: false,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_3',
        route: {
          key: '3',
          routeName: '',
        },
      },
      {
        index: 1,
        isActive: false,
        isStale: true,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_2',
        route: {
          key: '2',
          routeName: '',
        },
      },
    ]);
  });

  it('revives scenes', () => {
    const scenes = testTransition([['1', '2'], ['3'], ['2']]);

    expect(scenes).toEqual([
      {
        index: 0,
        isActive: false,
        isStale: true,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_1',
        route: {
          key: '1',
          routeName: '',
        },
      },
      {
        index: 0,
        isActive: true,
        isStale: false,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_2',
        route: {
          key: '2',
          routeName: '',
        },
      },
      {
        index: 0,
        isActive: false,
        isStale: true,
        descriptor: MOCK_DESCRIPTOR,
        key: 'scene_3',
        route: {
          key: '3',
          routeName: '',
        },
      },
    ]);
  });
});
