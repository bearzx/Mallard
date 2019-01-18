import React, { Component } from 'react';

// TODO import Autocomplete from './Autocomplete';
import keycodes from '../lib/keycodes';
import AceEditor from 'react-ace';

class Input extends Component {
  constructor(props) {
    super(props);

    // history is set in the componentDidMount
    this.state = {
      value: props.value || '',
      multiline: false,
      rows: 1,
      historyCursor: props.history.length,
    };
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.runCell = this.runCell.bind(this);
    this.upHistory = this.upHistory.bind(this);
  }

  onChange() {
    const { value } = this.input;
    const length = value.split('\n').length;
    this.setState({
      multiline: length > 1,
      rows: length < 20 ? length : 20,
      value,
    });
  }

  async onKeyPress(e) {
    const code = keycodes[e.keyCode];
    const { multiline } = this.state;
    const { history } = this.props;
    let { historyCursor } = this.state;

    // FIXME in multiline, cursor up when we're at the top
    // const cursor = getCursor(this.input);

    if (e.ctrlKey && code === 'l') {
      this.props.onClear();
      return;
    }

    if (!multiline) {
      if (code === 'up arrow') {
        historyCursor--;
        if (historyCursor < 0) {
          this.setState({ historyCursor: 0 });
          return;
        }
        this.setState({ historyCursor, value: history[historyCursor] });
        // this.onChange();
        e.preventDefault();
        return;
      }

      if (code === 'down arrow') {
        historyCursor++;
        if (historyCursor >= history.length) {
          this.setState({ historyCursor: history.length, value: '' });
          return;
        }
        this.setState({ historyCursor, value: history[historyCursor] });
        e.preventDefault();
        return;
      }
    }

    const command = this.input.value;

    if (code === 'enter') {
      if (e.shiftKey) {
        return;
      }

      if (!command) {
        e.preventDefault();
        return;
      }

      this.props.addHistory(command);
      this.setState({ historyCursor: history.length + 1, value: '' });
      e.preventDefault();
      await this.props.onRun(command);
      // Don't use `this.input.scrollIntoView();` as it messes with iframes
      window.scrollTo(0, document.body.scrollHeight);
      return;
    }
  }

  onAceLoad(_editor) {
    _editor.setHighlightActiveLine(false);
    _editor.renderer.setShowGutter(false);
    // _editor.setOptions('showPrintMargin', false);
    _editor.setShowPrintMargin(false);
    _editor.container.style.lineHeight = '20px';
    // _editor.renderer.updateFontSize();
  }

  async runCell(_editor) {
    const command = _editor.getValue();
    const { history } = this.props;
    // const command = this.input.value;
    if (!command) {
      // e.preventDefault();
      return;
    }

    this.props.addHistory(command);
    this.setState({ historyCursor: history.length + 1, value: '' });
    // e.preventDefault();
    await this.props.onRun(command);
    // Don't use `this.input.scrollIntoView();` as it messes with iframes
    window.scrollTo(0, document.body.scrollHeight);
    return;
  }

  upHistory(_editor) {
    const { history } = this.props;
    let { historyCursor } = this.state;
    historyCursor--;
    if (historyCursor < 0) {
      this.setState({ historyCursor: 0 });
      return;
    }
    this.setState({ historyCursor, value: history[historyCursor] });
    // this.onChange();
    // e.preventDefault();
    return;
  }

  render() {
    const { autoFocus } = this.props;
    return (
      <div className="Input">
        {/*<Autocomplete value={this.state.value} />*/}

        {/*
        <textarea
          className="cli"
          rows={this.state.rows}
          autoFocus={autoFocus}
          ref={e => {
            this.input = e;
            this.props.inputRef(e);
          }}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyPress}
        />
        */}

        <AceEditor
          mode="javascript"
          theme="clouds"
          name="editor"
          className="ace-cli"
          editorProps={{ $blockScrolling: Infinity }}
          width="100%"
          height="20px"
          value={this.state.value}
          commands={[
            { name: 'run',
              bindKey: { mac: 'Enter' },
              exec: this.runCell },
            { name: 'up',
              bindKey: 'Up',
              exec: this.upHistory}
          ]}
          onLoad={this.onAceLoad}
        />

      </div>
    );
  }
}

export default Input;
