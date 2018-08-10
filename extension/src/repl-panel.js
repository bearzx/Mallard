import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';

class Example extends React.Component {
  onChange(i, value, tab, ev) {
    console.log(arguments);
  }

  onActive(tab) {
    console.log(arguments);
  }

  render() {
    return (
      <Tabs onChange={this.onChange} defaultSelectedIndex={1}>
        <Tab value="pane-1" label="Tab 1" onActive={this.onActive}>Pane-1</Tab>
        <Tab value="pane-2" label="Tab 2">Pane-2</Tab>
      </Tabs>
    );
  }
}

ReactDOM.render(<Example />, document.getElementById('wrap'));