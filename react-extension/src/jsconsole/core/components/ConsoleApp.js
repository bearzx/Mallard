import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Console from './Console';
import Input from '../containers/Input';

import run, { bindConsole, createContainer } from '../lib/run';
import internalCommands from '../lib/internal-commands';

import { Chrome } from '../../../LibWrappers';

import DataFrame from 'dataframe-js';

import { loadImg, loadImgTensor, loadXSV, cols2DF } from  '../lib/utils';

// this is lame, but it's a list of key.code that do stuff in the input that we _want_.
const doStuffKeys = /^(Digit|Key|Num|Period|Semi|Comma|Slash|IntlBackslash|Backspace|Delete|Enter)/;

class ConsoleApp extends Component {
  constructor(props) {
    super(props);

    // console.log(props);
    window.port = Chrome.runtime.connect({ name: 'devtool' });

    window.port.onMessage.addListener((msg) => {
      // console.log(msg);
      if (msg.action === 'img-drag-start') {
        this.props.dragStart();
      } else if (msg.action === 'img-drag-end') {
        this.props.dragEnd();
      } else if (msg.action === 'inspect-img') {
        loadImg(msg.imgSrc);
      } else if (msg.action === 'inspect-xsv') {
        console._log(msg.linkUrl);
        console.log(`${msg.linkUrl} loaded as window.df`);
        loadXSV(msg.linkUrl);
      } else if (msg.action === 'detect-table') {
        Chrome.devtools.inspectedWindow.eval(
          `searchTable()`,
          (_columns, isException) => {
            // console._log(result);
            cols2DF(_columns);
        });
      }
    });

    this.onRun = this.onRun.bind(this);
    this.triggerFocus = this.triggerFocus.bind(this);
  }

  async onRun(command) {
    const console = this.console;
    // window.console._log(console);

    if (command[0] !== ':') {
      console.push({
        type: 'command',
        command,
        value: command,
      });
      const res = await run(command);
      console.push({
        command,
        type: 'response',
        ...res,
      });
      return;
    }

    let [cmd, ...args] = command.slice(1).split(' ');

    if (/^\d+$/.test(cmd)) {
      args = [parseInt(cmd, 10)];
      cmd = 'history';
    }

    if (!internalCommands[cmd]) {
      console.push({
        command,
        error: true,
        value: new Error(`No such jsconsole command "${command}"`),
        type: 'response',
      });
      return;
    }

    let res = await internalCommands[cmd]({ args, console, app: this });

    if (typeof res === 'string') {
      res = { value: res };
    }

    if (res !== undefined) {
      console.push({
        command,
        type: 'log',
        ...res,
      });
    }

    return;
  }

  componentDidMount() {
    createContainer();
    bindConsole(this.console);
    const query = decodeURIComponent(window.location.search.substr(1));
    if (query) {
      this.onRun(query);
    }

    // else {
    //   this.onRun(':welcome');
    // }
  }

  triggerFocus(e) {
    if (e.target.nodeName === 'INPUT') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.code && !doStuffKeys.test(e.code)) return;

    // this.input.focus();
  }

  render() {
    const { commands = [], theme, layout } = this.props;

    const className = classnames(['ConsoleApp', `theme-${theme}`, layout]);

    return (
      <div
        tabIndex="-1"
        onKeyDown={this.triggerFocus}
        ref={e => (this.app = e)}
        className={className}
      >
        <Console
          ref={e => (this.console = e)}
          commands={commands}
          reverse={layout === 'top'}
        />
        <Input
          inputRef={e => (this.input = e)}
          onRun={this.onRun}
          autoFocus={window.top === window}
          onClear={() => {
            this.console.clear();
          }}
        />
      </div>
    );
  }
}

ConsoleApp.contextTypes = { store: PropTypes.object };

export default ConsoleApp;
