import React, { Component } from 'react';

export class HTMLPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div dangerouslySetInnerHTML={{__html: this.props.text}}></div>
    )
  }
}

export default HTMLPanel;