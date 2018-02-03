Object.defineProperty(exports, '__esModule', { value: true });
var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
var _jsxFileName = 'src/views/CardStack/PointerEventsContainer.js';
var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();
exports.default = create;
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _invariant = require('../../utils/invariant');
var _invariant2 = _interopRequireDefault(_invariant);
var _AnimatedValueSubscription = require('../AnimatedValueSubscription');
var _AnimatedValueSubscription2 = _interopRequireDefault(
  _AnimatedValueSubscription
);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}
var MIN_POSITION_OFFSET = 0.01;
function create(Component) {
  var Container = (function(_React$Component) {
    _inherits(Container, _React$Component);
    function Container(props, context) {
      _classCallCheck(this, Container);
      var _this = _possibleConstructorReturn(
        this,
        (Container.__proto__ || Object.getPrototypeOf(Container)).call(
          this,
          props,
          context
        )
      );
      _this._pointerEvents = _this._computePointerEvents();
      return _this;
    }
    _createClass(Container, [
      {
        key: 'componentWillMount',
        value: function componentWillMount() {
          this._onPositionChange = this._onPositionChange.bind(this);
          this._onComponentRef = this._onComponentRef.bind(this);
        },
      },
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this._bindPosition(this.props);
        },
      },
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this._positionListener && this._positionListener.remove();
        },
      },
      {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          this._bindPosition(nextProps);
        },
      },
      {
        key: 'render',
        value: function render() {
          this._pointerEvents = this._computePointerEvents();
          return _react2.default.createElement(
            Component,
            _extends({}, this.props, {
              pointerEvents: this._pointerEvents,
              onComponentRef: this._onComponentRef,
              __source: { fileName: _jsxFileName, lineNumber: 39 },
            })
          );
        },
      },
      {
        key: '_onComponentRef',
        value: function _onComponentRef(component) {
          this._component = component;
          if (component) {
            (0, _invariant2.default)(
              typeof component.setNativeProps === 'function',
              'component must implement method `setNativeProps`'
            );
          }
        },
      },
      {
        key: '_bindPosition',
        value: function _bindPosition(props) {
          this._positionListener && this._positionListener.remove();
          this._positionListener = new _AnimatedValueSubscription2.default(
            props.position,
            this._onPositionChange
          );
        },
      },
      {
        key: '_onPositionChange',
        value: function _onPositionChange() {
          if (this._component) {
            var pointerEvents = this._computePointerEvents();
            if (this._pointerEvents !== pointerEvents) {
              this._pointerEvents = pointerEvents;
              this._component.setNativeProps({ pointerEvents: pointerEvents });
            }
          }
        },
      },
      {
        key: '_computePointerEvents',
        value: function _computePointerEvents() {
          var _props = this.props,
            navigation = _props.navigation,
            position = _props.position,
            scene = _props.scene;
          if (scene.isStale || navigation.state.index !== scene.index) {
            return scene.index > navigation.state.index ? 'box-only' : 'none';
          }
          var offset = position.__getAnimatedValue() - navigation.state.index;
          if (Math.abs(offset) > MIN_POSITION_OFFSET) {
            return 'box-only';
          }
          return 'auto';
        },
      },
    ]);
    return Container;
  })(_react2.default.Component);
  return Container;
}
