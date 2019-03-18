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

export class WebcamPanel extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        let video = document.querySelector('#video');
        video.srcObject = stream;
      })
      .catch(err => {
        console.log(err);
      });
    } else {

    }

  }

  render() {
    return (
      <div>
        <video id="video" width="640" height="480" autoplay="true"></video>
      </div>
    )
  }
}

export default HTMLPanel;