var _NavigationActions = require('../NavigationActions');
var _NavigationActions2 = _interopRequireDefault(_NavigationActions);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
describe('actions', function() {
  var params = { foo: 'bar' };
  var navigateAction = _NavigationActions2.default.navigate({
    routeName: 'another',
  });
  it('exports back action and type', function() {
    expect(_NavigationActions2.default.back.toString()).toEqual(
      _NavigationActions2.default.BACK
    );
    expect(_NavigationActions2.default.back()).toEqual({
      type: _NavigationActions2.default.BACK,
    });
    expect(_NavigationActions2.default.back({ key: 'test' })).toEqual({
      type: _NavigationActions2.default.BACK,
      key: 'test',
    });
  });
  it('exports init action and type', function() {
    expect(_NavigationActions2.default.init.toString()).toEqual(
      _NavigationActions2.default.INIT
    );
    expect(_NavigationActions2.default.init()).toEqual({
      type: _NavigationActions2.default.INIT,
    });
    expect(_NavigationActions2.default.init({ params: params })).toEqual({
      type: _NavigationActions2.default.INIT,
      params: params,
    });
  });
  it('exports navigate action and type', function() {
    expect(_NavigationActions2.default.navigate.toString()).toEqual(
      _NavigationActions2.default.NAVIGATE
    );
    expect(_NavigationActions2.default.navigate({ routeName: 'test' })).toEqual(
      { type: _NavigationActions2.default.NAVIGATE, routeName: 'test' }
    );
    expect(
      _NavigationActions2.default.navigate({
        routeName: 'test',
        params: params,
        action: navigateAction,
      })
    ).toEqual({
      type: _NavigationActions2.default.NAVIGATE,
      routeName: 'test',
      params: params,
      action: {
        type: _NavigationActions2.default.NAVIGATE,
        routeName: 'another',
      },
    });
  });
  it('exports reset action and type', function() {
    expect(_NavigationActions2.default.reset.toString()).toEqual(
      _NavigationActions2.default.RESET
    );
    expect(
      _NavigationActions2.default.reset({ index: 0, actions: [] })
    ).toEqual({
      type: _NavigationActions2.default.RESET,
      index: 0,
      actions: [],
    });
    expect(
      _NavigationActions2.default.reset({
        index: 0,
        key: 'test',
        actions: [navigateAction],
      })
    ).toEqual({
      type: _NavigationActions2.default.RESET,
      index: 0,
      key: 'test',
      actions: [
        { type: _NavigationActions2.default.NAVIGATE, routeName: 'another' },
      ],
    });
  });
  it('exports setParams action and type', function() {
    expect(_NavigationActions2.default.setParams.toString()).toEqual(
      _NavigationActions2.default.SET_PARAMS
    );
    expect(
      _NavigationActions2.default.setParams({ key: 'test', params: params })
    ).toEqual({
      type: _NavigationActions2.default.SET_PARAMS,
      key: 'test',
      params: params,
    });
  });
  it('exports uri action and type', function() {
    expect(_NavigationActions2.default.uri.toString()).toEqual(
      _NavigationActions2.default.URI
    );
    expect(
      _NavigationActions2.default.uri({ uri: 'http://google.com' })
    ).toEqual({
      type: _NavigationActions2.default.URI,
      uri: 'http://google.com',
    });
  });
});
