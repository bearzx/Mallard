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
import PlotPanel from './PlotPanel';
import ImagePanel from './ImagePanel';
import DataFrame from 'dataframe-js';

class App extends Component {
  constructor(props) {
    super(props);

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
  }

  handleTabChange = (e) => {
    this.setState({ tabId: e });
  };

  handleFnameChange = (e) => {
    this.setState({ fname: e.target.value });
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
            value={this.state.code}
            name="editor"
            editorProps={{$blockScrolling: true}}
            width="100%"
            height="100%"
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