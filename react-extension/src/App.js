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

    this.state = {
      plotIds: props.plotIds
    };
  }

  render() {
    return (
      this.state.plotIds.map((id) =>
        <div id={"plot-" + id} class="plot-slot">
          <h3 class="plot-placeholder">{"plots-" + id}</h3>
        </div>
      )
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    window.changeAppState = (o) => {
      this.setState(o);
    };

    this.state = {
      fname: '',
      plotCount: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    this.setState({ fname: event.target.value });
  };

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
      <Tabs onChange={this.onChange} defaultSelectedIndex={0} justified={true}>
        <Tab value="editor" label="Editor" onActive={this.onActive}>
          <Input
            value={this.state.fname}
            onChange={this.handleChange}
            className="file-name"
            label="File name"
            floatingLabel={true}
          />
          <AceEditor
            mode="javascript"
            theme="chrome"
            onChange={this.onChange}
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
            <PlotPanel plotIds={[1, 2, 3, 4, 5]} />
        </Tab>
      </Tabs>
    );
  }
}

export default App;