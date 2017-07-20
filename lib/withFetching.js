'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (getForFetching, resourceUrl, resourceInitialState) {
  var configure = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { query: null, refetch: false, changeQuery: false };

  var keys = Object.keys(resourceInitialState);
  var resourceName = keys[0];
  return function (BaseComponent) {
    var factory = (0, _react.createFactory)(BaseComponent);
    return function (_Component) {
      _inherits(_class2, _Component);

      function _class2(props) {
        _classCallCheck(this, _class2);

        var _this = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, props));

        _this.fetchResource = function (_) {
          // console.log('withResource fetchResource ', resourceUrl, resourceInitialState, configure);
          getForFetching(resourceUrl, _this.state.query).then(function (res) {
            return _this.setState(_defineProperty({}, resourceName, res.data));
          });
        };

        _this.refetch = function (queryObj) {
          if (queryObj) _this.changeQuery(queryObj, function (_) {
            return _this.fetchResource();
          });else _this.fetchResource();
        };

        _this.changeQuery = function (queryObj) {
          var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          var queryState = Object.assign({}, _this.state.query, queryObj);
          _this.setState({ query: queryState }, callback);
        };

        var refetchPropName = configure.refetch;
        var refetchProp = refetchPropName ? _defineProperty({}, refetchPropName, _this.refetch) : {};
        var changeQueryPropName = configure.changeQuery;
        var changeQueryProp = changeQueryPropName ? _defineProperty({}, changeQueryPropName, _this.changeQuery) : {};
        var query = typeof configure.query === 'function' ? configure.query(props) : configure.query;
        _this.state = Object.assign({}, _extends({}, resourceInitialState), { query: query }, _extends({}, refetchProp), _extends({}, changeQueryProp));
        return _this;
      }

      _createClass(_class2, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          // console.log('withResource componentWillReceiveProps ', nextProps, this.props);
          if (this.props.location && this.props.location.key !== nextProps.location.key) {
            this.fetchResource();
          }
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.fetchResource();
        }
      }, {
        key: 'render',
        value: function render() {
          return factory(_extends({}, this.props, this.state));
        }
      }]);

      return _class2;
    }(_react.Component);
  };
};

var _react = require('react');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }