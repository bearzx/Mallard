import React, { Component } from 'react';
import LineNav from './LineNav';
import which from '../lib/which-type';
import { Plot, Canvas } from '../../../PlotPanel';
import ImagePanel from '../containers/ImagePanel';
import { HTMLPanel } from '../../../HTMLPanel';

class Line extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.filter !== nextState.filter) {
      return true;
    }

    if (this.props.hidden !== nextProps.hidden) {
      return true;
    }

    if (this.props.evalable !== nextProps.evalable) {
      return true;
    }

    if (this.props.value !== nextProps.value) {
      return true;
    }

    return false; // this prevents bananas amount of rendering
  }

  render() {
    const {
      type = 'response',
      value,
      command = null,
      error = false,
      open = false,
      html = false,
      hidden = false,
      evalable = false,
      onFocus = () => { },
      onHide = () => { },
      onReRun = () => { },
    } = this.props;

    // console._log(this.props);

    let line = null;

    const { filter } = this.state;

    if (type === 'vis') {
      line = (
        <Plot plotId={value.plotId} />
      );
    }

    if (type === 'canvas') {
      line = (
        <Canvas canvasId={value.canvasId} />
      );
    }

    if (type === 'dnd') {
      line = (
        <ImagePanel />
      );
    }

    if (type == 'html') {
      // console._log(value);
      line = (
        <HTMLPanel text={value.text} />
      );
    }

    if (type === 'command') {
      line = (
        <div className="prompt input">
          <LineNav value={value} evalable={evalable} onReRun={onReRun} onHide={onHide} />
          {value}
        </div>
      );
    }

    if (type === 'log' || type === 'response') {
      if (type === 'log' && Array.isArray(value) && value.length === 0) {
        return null;
      }

      // for LineNav I do a bit of a giggle so if it's a log, we copy the single
      // value, which is nicer for the user
      line = (
        <div className={ `prompt output ${type} ${error ? 'error' : ''} ${hidden ? 'hidden' : ''}` }>

          <LineNav
            onFilter={filter => {
              this.setState({ filter });
            }}
            onHide={onHide}
            value={
              type === 'log' && Array.isArray(value) && value.length === 1
                ? value[0]
                : value
            }
            command={command}
            evalable={evalable}
          />

          {(type === 'log' && Array.isArray(value) ? value : [value]).map(
            (value, i) => {
              const Type = which(value);
              return (
                <Type
                  filter={filter}
                  html={html}
                  value={value}
                  open={open}
                  allowOpen={true}
                  bare={type === 'log'}
                  key={`type-${i}`}
                  shallow={false} >
                  {value}
                </Type>
              );
            }
          )}
        </div>
      );
    }

    return (
      <div className="Line" onClick={onFocus}>
        {line}
      </div>
    );
  }
}

export default Line;
