import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { Tabs } from 'react-bootstrap';
// import { Tab } from 'react-bootstrap';
// import Paper from '@material-ui/core/Paper';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import AppBar from '@material-ui/core/AppBar';
// import Typography from '@material-ui/core/Typography';
// import { withStyles } from '@material-ui/core/styles';
import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
import Input from 'muicss/lib/react/input';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/chrome';
import './App.css';
import Chrome from './Chrome';

class PlotPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.plotIds.map((id) =>
        <div id={"plot-" + id} className="plot-slot">
          <h3 className="plot-placeholder">{"#plot-" + id}</h3>
        </div>
      )
    )
  }
}

class ImagePanel extends Component {
  preventDefault(event) {
    event.preventDefault();
    console.log('on drag over');
  }

  drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData('text');
    console.log(`on drop`);
    console.log(data);
  }

  render() {
    return (
      <div id="drag-area" className="plot-slot" onDragOver={this.preventDefault} onDrop={this.drop}></div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    window.changeAppState = (o) => {
      this.setState(o);
    };

    window.newPlot = () => {
      const n = this.state.plotIds.length;
      this.setState({
        tabId: 1,
        plotIds: this.state.plotIds.concat([n])
      });
    }

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
      tabId: 0
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
      <Tabs onChange={this.handleTabChange} defaultSelectedIndex={0} selectedIndex={this.state.tabId} justified={true}>
        <Tab value="editor" label="Editor" onActive={this.onActive}>
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
            height="500px"
            commands={[{
              name: 'save',
              bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
              exec: this.saveCode
            }]}
          />
        </Tab>
        <Tab value="plot" label="Plot">
            <PlotPanel plotIds={this.state.plotIds} />
        </Tab>
        <Tab value="image" label="Image">
            <ImagePanel />
        </Tab>
      </Tabs>
    );
  }
}

export default App;