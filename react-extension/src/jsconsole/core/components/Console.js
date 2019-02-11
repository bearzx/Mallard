import React, { Component } from 'react';
import Line from './Line';
import { Chrome } from '../../../LibWrappers';
import run from '../lib/run';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

let guid = 0;
const getNext = () => guid++;

function AssertError(message) {
  this.name = 'Assertion fail';
  this.message = message;
  this.stack = new Error().stack;
}

AssertError.prototype = new Error();

function interpolate(...args) {
  let [string, ...rest] = args;
  let html = false;

  if (typeof string === 'string' && string.includes('%') && rest.length) {
    string = string.replace(
      /(%[scdif]|%(\d*)\.(\d*)[dif])/g,
      (all, key, width = '', dp) => {
        // NOTE: not supporting Object type

        if (key === '%s') {
          // string
          return rest.shift();
        }

        if (key === '%c') {
          html = true;
          return `</span><span style="${rest.shift()}">`;
        }

        const value = rest.shift();
        let res = null;

        if (key.substr(-1) === 'f') {
          if (isNaN(parseInt(dp, 10))) {
            res = value;
          } else {
            res = value.toFixed(dp);
          }
        } else {
          res = parseInt(value, 10);
        }

        if (width === '') {
          return res;
        }

        return res.toString().padStart(width, ' ');
      }
    );

    if (html) {
      string = `<span>${string}</span>`;
    }

    args = [string, ...rest];
  }

  return { html, args };
}

class Console extends Component {
  constructor(props) {
    super(props);

    window.resetConsoleState = () => {

    };

    this.state = {};
    // TODO: add hidden property
    this.state.lines = (props.commands || []).reduce((acc, curr) => {
      acc[getNext()] = curr;
      return acc;
    }, {});
    this.log = this.log.bind(this);
    this.clear = this.clear.bind(this);
    this.push = this.push.bind(this);
  }

  push(command) {
    const next = getNext();
    const newLine = {
      [next]: {
        ...command,
        hidden: false
      }
    };
    this.setState({ lines: Object.assign(this.state.lines, newLine) });
  }

  clear() {
    this.setState({ lines: {} });
  }

  error = (...rest) => {
    const { html, args } = interpolate(...rest);
    this.push({
      error: true,
      html,
      value: args,
      type: 'log',
    });
  };

  assert(test, ...rest) {
    // intentional loose assertion test - matches devtools
    if (!test) {
      let msg = rest.shift();
      if (msg === undefined) {
        msg = 'console.assert';
      }
      rest.unshift(new AssertError(msg));
      this.push({
        error: true,
        value: rest,
        type: 'log',
      });
    }
  }

  dir = (...rest) => {
    const { html, args } = interpolate(...rest);

    this.push({
      value: args,
      html,
      open: true,
      type: 'log',
    });
  };

  warn(...rest) {
    const { html, args } = interpolate(...rest);
    this.push({
      error: true,
      level: 'warn',
      html,
      value: args,
      type: 'log',
    });
  }

  debug = (...args) => this.log(...args);
  info = (...args) => this.log(...args);

  log(...rest) {
    const { html, args } = interpolate(...rest);

    this.push({
      value: args,
      html,
      type: 'log',
    });
  }

  vis(_plotId) {
    this.push({
      type: 'vis',
      value: { plotId: _plotId }
    });
  }

  html(_text) {
    this.push({
      type: 'html',
      value: { text: _text }
    });
  }

  canvas(_canvasId) {
    this.push({
      type: 'canvas',
      value: { canvasId: _canvasId }
    });
  }

  dnd() {
    this.push({
      type: 'dnd'
    });
  }

  _log(...rest) {
    window.console._log(rest);
  }

  showTensor(tensor, canvas) {
    const ctx = canvas.getContext('2d');
    const [height, width] = tensor.shape;
    canvas.width = width;
    canvas.height = height;
    const buffer = new Uint8ClampedArray(width * height * 4);
    const imageData = new ImageData(width, height);
    const data = tensor.dataSync();
    var cnt = 0;
    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            var pos = (y * width + x) * 4; // position in buffer based on x and y
            buffer[pos  ] = data[cnt]; // some R value [0, 255]
            buffer[pos + 1] = data[cnt + 1]; // some G value
            buffer[pos + 2] = data[cnt + 2]; // some B value
            buffer[pos + 3] = 255; // set alpha channel
            cnt += 3;
        }
    }
    imageData.data.set(buffer);
    ctx.putImageData(imageData, 0, 0);
  }

  _edit_(name) {
    Chrome.storage.local.get(['saved_scripts'], function(result) {
      if (result.saved_scripts[name]) {
        window.changeAppState({
          fname: name,
          code: result.saved_scripts[name],
          tabId: 1
        });
      } else {
        console.error('No such file');
      }
    });
  }

  _run_(name) {
    const _this = this;
    Chrome.storage.local.get(['saved_scripts'], function(result) {
      if (result.saved_scripts[name]) {
        try {
          window.eval(result.saved_scripts[name]);
        } catch (error) {
          const res = {};
          res.error = true;
          res.value = error;
          _this.push({
            name,
            type: 'response',
            ...res,
          });
        }
        // run(result.saved_scripts[name]);
      } else {
        console.error('No such file');
      }
    });
  }

  onHide(i) {
    return () => {
      let lines = {...this.state.lines};
      let lineToHide = {
        ...lines[i],
        hidden: true
      };
      lines[i] = lineToHide;
      this.setState({ lines: lines });
    }
  }

  render() {
    const commands = this.state.lines || {};
    const keys = Object.keys(commands).filter((_) => !commands[_].hidden);
    if (this.props.reverse) {
      keys.reverse();
    }

    // [Xiong] Bug TODO: why is the key order guaranteed?
    return (
      <div
        className="react-console-container"
        onClick={e => {
          e.stopPropagation(); // prevent the focus on the input element
        }}
      >
        <ReactCSSTransitionGroup
          transitionName="line-transition"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          { keys.map(_ =>
            <Line
              key={`line-${_}`}
              onHide={this.onHide(_)}
              {...commands[_]}
            />) }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default Console;
