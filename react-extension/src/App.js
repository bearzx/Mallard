import React, { Component } from 'react';
import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
import Input from 'muicss/lib/react/input';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/chrome';
import './App.css';
import { Chrome } from './LibWrappers';
import ConsoleApp from './jsconsole/core/containers/ConsoleApp';
import DataFrame from 'dataframe-js';

class App extends Component {
  constructor(props) {
    super(props);

    window._$ = document.querySelector.bind(document);

    window.DataFrame = DataFrame;

    window.resetAppState = () => {
      // a function to test the forceUpdate behavior
      this.state = {};
      console.log(this.state);
      console.log(this);
      this.forceUpdate();
    }

    window.changeAppState = (o) => {
      this.setState(o);
    };

    window.printState = (o) => {
      console._log(this.state);
    };

    window.newPlot = () => {
      const n = this.state.plotIds.length;
      this.setState({
        tabId: 1,
        plotIds: this.state.plotIds.concat([n])
      });
    };

    window.rmPlot = (i) => {
      this.setState({
        plotIds: this.state.plotIds.filter((n) => n !== i)
      });
    };

    this.state = {
      fname: '',
      code: '',
      plotCount: 0,
      plotIds: [],
      tabId: 3
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleFnameChange = this.handleFnameChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
  }

  handleTabChange = (v) => {
    // console._log(v);
    this.setState({ tabId: v });
  };

  handleFnameChange = (e) => {
    // console._log(e.target.value);
    e.stopPropagation();
    this.setState({ fname: e.target.value });
  }

  handleCodeChange = (v) => {
    this.setState({ code: v });
  }

  onLoad = (_editor) => {
    // console.log('editor load');
  }

  saveCode = (_editor) => {
    let msg = {
      action: 'save-script',
      name: this.state.fname,
      code: _editor.getValue()
    };
    Chrome.runtime.sendMessage(msg, function(response) {
        console.log(response);
    });
  };

  render() {
    return (
      <Tabs onChange={this.handleTabChange} selectedIndex={this.state.tabId} justified={true}>
        <Tab value="editor" label="Editor">
          <Input
            value={this.state.fname}
            className="file-name"
            label="File name"
            floatingLabel={true}
            onChange={this.handleFnameChange}
          />
          <AceEditor
            mode="javascript"
            theme="chrome"
            name="editor"
            className="code-editor"
            value={this.state.code}
            editorProps={{ $blockScrolling: Infinity }}
            width="100%"
            height="100%"
            onLoad={this.onLoad}
            onChange={this.handleCodeChange}
            commands={[{
              name: 'save',
              bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
              exec: this.saveCode
            }]}
          />
        </Tab>
        <Tab value="console" label="Console" onActive={this.onActive}>
          <ConsoleApp />
        </Tab>
      </Tabs>
    );
  }
}

export default App;