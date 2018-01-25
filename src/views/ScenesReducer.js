import invariant from '../utils/invariant';
import shallowEqual from '../utils/shallowEqual';

const SCENE_KEY_PREFIX = 'scene_';

/**
 * Helper function to compare route keys (e.g. "9", "11").
 */
function compareKey(one, two) {
  const delta = one.length - two.length;
  if (delta > 0) {
    return 1;
  }
  if (delta < 0) {
    return -1;
  }
  return one > two ? 1 : -1;
}

/**
 * Helper function to sort scenes based on their index and view key.
 */
function compareScenes(one, two) {
  if (one.index > two.index) {
    return 1;
  }
  if (one.index < two.index) {
    return -1;
  }

  return compareKey(one.key, two.key);
}

/**
 * Whether two routes are the same.
 */
function areScenesShallowEqual(one, two) {
  return (
    one.key === two.key &&
    one.index === two.index &&
    one.isStale === two.isStale &&
    one.isActive === two.isActive &&
    areRoutesShallowEqual(one.route, two.route)
  );
}

/**
 * Whether two routes are the same.
 */
function areRoutesShallowEqual(one, two) {
  if (!one || !two) {
    return one === two;
  }

  if (one.key !== two.key) {
    return false;
  }

  return shallowEqual(one, two);
}

export default function ScenesReducer(scenes, nextState, prevState) {
  if (prevState === nextState) {
    return scenes;
  }

  const prevScenes = new Map();
  const freshScenes = new Map();
  const staleScenes = new Map();

  // Populate stale scenes from previous scenes marked as stale.
  scenes.forEach(scene => {
    const { key } = scene;
    if (scene.isStale) {
      staleScenes.set(key, scene);
    }
    prevScenes.set(key, scene);
  });

  const nextKeys = new Set();
  nextState.routes.forEach((route, index) => {
    const key = SCENE_KEY_PREFIX + route.key;
    const scene = {
      index,
      isActive: false,
      isStale: false,
      key,
      route,
    };
    invariant(
      !nextKeys.has(key),
      `navigation.state.routes[${index}].key "${key}" conflicts with ` +
        'another route!'
    );
    nextKeys.add(key);

    if (staleScenes.has(key)) {
      // A previously `stale` scene is now part of the nextState, so we
      // revive it by removing it from the stale scene map.
      staleScenes.delete(key);
    }
    freshScenes.set(key, scene);
  });

  if (prevState) {
    // Look at the previous routes and classify any removed scenes as `stale`.
    prevState.routes.forEach((route, index) => {
      const key = SCENE_KEY_PREFIX + route.key;
      if (freshScenes.has(key)) {
        return;
      }
      staleScenes.set(key, {
        index,
        isActive: false,
        isStale: true,
        key,
        route,
      });
    });
  }

  const nextScenes = [];

  const mergeScene = nextScene => {
    const { key } = nextScene;
    const prevScene = prevScenes.has(key) ? prevScenes.get(key) : null;
    if (prevScene && areScenesShallowEqual(prevScene, nextScene)) {
      // Reuse `prevScene` as `scene` so view can avoid unnecessary re-render.
      // This assumes that the scene's navigation state is immutable.
      nextScenes.push(prevScene);
    } else {
      nextScenes.push(nextScene);
    }
  };

  staleScenes.forEach(mergeScene);
  freshScenes.forEach(mergeScene);

  nextScenes.sort(compareScenes);

  let activeScenesCount = 0;
  nextScenes.forEach((scene, ii) => {
    const isActive = !scene.isStale && scene.index === nextState.index;
    if (isActive !== scene.isActive) {
      nextScenes[ii] = {
        ...scene,
        isActive,
      };
    }
    if (isActive) {
      activeScenesCount++;
    }
  });

  invariant(
    activeScenesCount === 1,
    'there should always be only one scene active, not %s.',
    activeScenesCount
  );

  if (nextScenes.length !== scenes.length) {
    return nextScenes;
  }

  if (
    nextScenes.some(
      (scene, index) => !areScenesShallowEqual(scenes[index], scene)
    )
  ) {
    return nextScenes;
  }

  // scenes haven't changed.
  return scenes;
}
