import React, { Component } from 'react';

export class PlotPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.plotIds.map((id) =>
        <Plot plotId={id} />
      )
    )
  }
}

export class Plot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="plot-slot">
        <div>
          <span>#plot-{this.props.plotId}</span>
        </div>
        <div id={"plot-" + this.props.plotId}>
          {/* <h3 className="plot-placeholder">{"#plot-" + this.props.plotId}</h3> */}
        </div>
      </div>
    )
  }
}

export class Canvas extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="canvas-slot">
        <div>
          <span>#canvas-{this.props.canvasId}</span>
        </div>
        <canvas id={"canvas-" + this.props.canvasId}></canvas>
      </div>
    )
  }
}

export default PlotPanel;