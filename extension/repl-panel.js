var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';

var Example = function (_React$Component) {
  _inherits(Example, _React$Component);

  function Example() {
    _classCallCheck(this, Example);

    return _possibleConstructorReturn(this, (Example.__proto__ || Object.getPrototypeOf(Example)).apply(this, arguments));
  }

  _createClass(Example, [{
    key: 'onChange',
    value: function onChange(i, value, tab, ev) {
      console.log(arguments);
    }
  }, {
    key: 'onActive',
    value: function onActive(tab) {
      console.log(arguments);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        Tabs,
        { onChange: this.onChange, defaultSelectedIndex: 1 },
        React.createElement(
          Tab,
          { value: 'pane-1', label: 'Tab 1', onActive: this.onActive },
          'Pane-1'
        ),
        React.createElement(
          Tab,
          { value: 'pane-2', label: 'Tab 2' },
          'Pane-2'
        )
      );
    }
  }]);

  return Example;
}(React.Component);

ReactDOM.render(React.createElement(Example, null), document.getElementById('wrap'));