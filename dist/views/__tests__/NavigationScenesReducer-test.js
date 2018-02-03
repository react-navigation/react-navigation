var _ScenesReducer = require('../ScenesReducer');
var _ScenesReducer2 = _interopRequireDefault(_ScenesReducer);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function testTransition(states) {
  var routes = states.map(function(keys) {
    return {
      index: 0,
      routes: keys.map(function(key) {
        return { key: key, routeName: '' };
      }),
      isTransitioning: false,
    };
  });
  var scenes = [];
  var prevState = null;
  routes.forEach(function(nextState) {
    scenes = (0, _ScenesReducer2.default)(scenes, nextState, prevState);
    prevState = nextState;
  });
  return scenes;
}
describe('ScenesReducer', function() {
  it('gets initial scenes', function() {
    var scenes = testTransition([['1', '2']]);
    expect(scenes).toEqual([
      {
        index: 0,
        isActive: true,
        isStale: false,
        key: 'scene_1',
        route: { key: '1', routeName: '' },
      },
      {
        index: 1,
        isActive: false,
        isStale: false,
        key: 'scene_2',
        route: { key: '2', routeName: '' },
      },
    ]);
  });
  it('pushes new scenes', function() {
    var scenes = testTransition([['1', '2'], ['1', '2', '3']]);
    expect(scenes).toEqual([
      {
        index: 0,
        isActive: true,
        isStale: false,
        key: 'scene_1',
        route: { key: '1', routeName: '' },
      },
      {
        index: 1,
        isActive: false,
        isStale: false,
        key: 'scene_2',
        route: { key: '2', routeName: '' },
      },
      {
        index: 2,
        isActive: false,
        isStale: false,
        key: 'scene_3',
        route: { key: '3', routeName: '' },
      },
    ]);
  });
  it('gets active scene when index changes', function() {
    var state1 = {
      index: 0,
      routes: [{ key: '1', routeName: '' }, { key: '2', routeName: '' }],
      isTransitioning: false,
    };
    var state2 = {
      index: 1,
      routes: [{ key: '1', routeName: '' }, { key: '2', routeName: '' }],
      isTransitioning: false,
    };
    var scenes1 = (0, _ScenesReducer2.default)([], state1, null);
    var scenes2 = (0, _ScenesReducer2.default)(scenes1, state2, state1);
    var route = scenes2.find(function(scene) {
      return scene.isActive;
    }).route;
    expect(route).toEqual({ key: '2', routeName: '' });
  });
  it('gets same scenes', function() {
    var state1 = {
      index: 0,
      routes: [{ key: '1', routeName: '' }, { key: '2', routeName: '' }],
      isTransitioning: false,
    };
    var state2 = {
      index: 0,
      routes: [{ key: '1', routeName: '' }, { key: '2', routeName: '' }],
      isTransitioning: false,
    };
    var scenes1 = (0, _ScenesReducer2.default)([], state1, null);
    var scenes2 = (0, _ScenesReducer2.default)(scenes1, state2, state1);
    expect(scenes1).toBe(scenes2);
  });
  it('gets different scenes when keys are different', function() {
    var state1 = {
      index: 0,
      routes: [{ key: '1', routeName: '' }, { key: '2', routeName: '' }],
      isTransitioning: false,
    };
    var state2 = {
      index: 0,
      routes: [{ key: '2', routeName: '' }, { key: '1', routeName: '' }],
      isTransitioning: false,
    };
    var scenes1 = (0, _ScenesReducer2.default)([], state1, null);
    var scenes2 = (0, _ScenesReducer2.default)(scenes1, state2, state1);
    expect(scenes1).not.toBe(scenes2);
  });
  it('gets different scenes when routes are different', function() {
    var state1 = {
      index: 0,
      routes: [
        { key: '1', x: 1, routeName: '' },
        { key: '2', x: 2, routeName: '' },
      ],
      isTransitioning: false,
    };
    var state2 = {
      index: 0,
      routes: [
        { key: '1', x: 3, routeName: '' },
        { key: '2', x: 4, routeName: '' },
      ],
      isTransitioning: false,
    };
    var scenes1 = (0, _ScenesReducer2.default)([], state1, null);
    var scenes2 = (0, _ScenesReducer2.default)(scenes1, state2, state1);
    expect(scenes1).not.toBe(scenes2);
  });
  it('gets different scenes when state index changes', function() {
    var state1 = {
      index: 0,
      routes: [
        { key: '1', x: 1, routeName: '' },
        { key: '2', x: 2, routeName: '' },
      ],
      isTransitioning: false,
    };
    var state2 = {
      index: 1,
      routes: [
        { key: '1', x: 1, routeName: '' },
        { key: '2', x: 2, routeName: '' },
      ],
      isTransitioning: false,
    };
    var scenes1 = (0, _ScenesReducer2.default)([], state1, null);
    var scenes2 = (0, _ScenesReducer2.default)(scenes1, state2, state1);
    expect(scenes1).not.toBe(scenes2);
  });
  it('pops scenes', function() {
    var scenes = testTransition([['1', '2', '3'], ['1', '2']]);
    expect(scenes).toEqual([
      {
        index: 0,
        isActive: true,
        isStale: false,
        key: 'scene_1',
        route: { key: '1', routeName: '' },
      },
      {
        index: 1,
        isActive: false,
        isStale: false,
        key: 'scene_2',
        route: { key: '2', routeName: '' },
      },
      {
        index: 2,
        isActive: false,
        isStale: true,
        key: 'scene_3',
        route: { key: '3', routeName: '' },
      },
    ]);
  });
  it('replaces scenes', function() {
    var scenes = testTransition([['1', '2'], ['3']]);
    expect(scenes).toEqual([
      {
        index: 0,
        isActive: false,
        isStale: true,
        key: 'scene_1',
        route: { key: '1', routeName: '' },
      },
      {
        index: 0,
        isActive: true,
        isStale: false,
        key: 'scene_3',
        route: { key: '3', routeName: '' },
      },
      {
        index: 1,
        isActive: false,
        isStale: true,
        key: 'scene_2',
        route: { key: '2', routeName: '' },
      },
    ]);
  });
  it('revives scenes', function() {
    var scenes = testTransition([['1', '2'], ['3'], ['2']]);
    expect(scenes).toEqual([
      {
        index: 0,
        isActive: false,
        isStale: true,
        key: 'scene_1',
        route: { key: '1', routeName: '' },
      },
      {
        index: 0,
        isActive: true,
        isStale: false,
        key: 'scene_2',
        route: { key: '2', routeName: '' },
      },
      {
        index: 0,
        isActive: false,
        isStale: true,
        key: 'scene_3',
        route: { key: '3', routeName: '' },
      },
    ]);
  });
});
