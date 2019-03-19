import React, { Component } from 'react';
import { Chrome } from './LibWrappers';

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

    window.startTracking = async () => {
      window.trackingTask = setInterval(window.track, 3000);
    };

    window.stopTracking = () => {
      clearInterval(window.trackingTask);
    };

    window.track = async () => {
      let video = document.querySelector('#video');
      let mask = document.querySelector('#video-mask');
      let fullFaceDescriptions = await window.faceapi.detectSingleFace(video);
      let direction;
      if (fullFaceDescriptions) {
        let faceBox = fullFaceDescriptions.box;
        let midx = faceBox._x + faceBox._width / 2;
        let midy = faceBox._y + faceBox._height / 2;
        if (1.0 * Math.abs(midx - video.width / 2) / video.width < 0.1) {
            // up or down
            if (midy > (video.height / 2)) {
                direction = 'down';
            } else {
                direction = 'up';
            }
        } else {
            // left or right
            if (midx > (video.width / 2)) {
                direction = 'left';
            } else {
                direction = 'right';
            }
        }

        Chrome.runtime.sendMessage({ action: 'direction', direction: direction });

        mask.getContext('2d').clearRect(0, 0, mask.width, mask.height);
        window.faceapi.drawDetection(mask, faceBox);
      }
    };
  }

  componentDidMount() {
    if (navigator.mediaDevices.getUserMedia) {
      let video = document.querySelector('#video');

      navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {

        video.srcObject = stream;
      })
      .catch(err => {
        console.log(err);
      });

      let mask = document.querySelector('#video-mask');
      mask.width = video.offsetWidth;
      mask.height = video.offsetHeight;
      mask.style.left = video.offsetLeft;
      mask.style.top = video.offsetTop;
      let context = mask.getContext('2d');
      context.translate(mask.width, 0);
      context.scale(-1, 1);

      this.loadFaceAPI();
    }
  }

  async loadFaceAPI() {
    const MODEL_URL = 'https://www.bearzx.com/pgxz3/weights/';
    await window.faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await window.faceapi.loadFaceLandmarkModel(MODEL_URL);
    await window.faceapi.loadFaceRecognitionModel(MODEL_URL);
  }

  render() {
    return (
      <div class="video-block">
        <canvas id="video-mask"></canvas>
        <video id="video" width="640" height="480" autoplay="true"></video>
        {/* <iframe src="https://www.bearzx.com/pgxz3/camera.html" width="640" height="480"></iframe> */}
      </div>
    )
  }
}

export default HTMLPanel;