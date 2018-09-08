import React, { Component } from 'react';
import DataFrame from 'dataframe-js';

export class ImagePanel extends Component {
  constructor(props) {
    super(props);

    // console.log(this.props);

    this.state = {
      imgCode: ''
    };
  }

  preventDefault = (e) => {
    e.preventDefault();
    // console._log('on drag over');
  }

  // dummy way using a canvas element
  _imgCode2tensor = (imgCode) => {
    let img = new Image();
    img.onload = () => {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      window.t = window.tf.tensor3d(new Float32Array(imgData.data), [img.naturalWidth, img.naturalHeight, 4]);
    };
    img.src = imgCode;
  }

  // convenient way using tensorflow - tf required
  imgCode2tensor = (imgCode) => {
    let img = new Image();
    img.onload = () => {
      img.width = 224;
      img.height = 224;
      window.t = window.tf.fromPixels(img).toFloat();
    };
    img.src = imgCode;
  }

  drop = (e) => {
    e.preventDefault();
    let dragType = e.dataTransfer.getData('dragType');
    console._log(dragType);
    switch(dragType) {
      case 'img':
        console._log('dropping img');
        let imgi = e.dataTransfer.getData('imgi');
        let imgCode = e.dataTransfer.getData('imgCode');
        this.setState({
          imgCode: imgCode
        });
        this.imgCode2tensor(imgCode);
        break;
      case 'table':
        console._log('dropping table');
        let _columns = JSON.parse(e.dataTransfer.getData('columns'));
        let data = {};
        let columns = [];
        _columns.forEach((c) => {
            data[c[0]] = c.slice(1);
            columns.push(c[0]);
        });
        window.df = new DataFrame(data, columns);
        break;
      case 'link':
        let href = e.dataTransfer.getData('href');
        let p;
        if (href.endsWith('.tsv')) {
          p = DataFrame.fromTSV(href).then(df => { window.df = df });

        } else if (href.endsWith('.csv')) {
          p = DataFrame.fromCSV(href).then(df => { window.df = df });
        }
        Promise.resolve(p);
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div
        id="drag-area"
        className={this.props.isDragStart ? "drag-slot-start" : "drag-slot-end"}
        onDragOver={this.preventDefault}
        onDrop={this.drop}
      >
        <img src={this.state.imgCode} />
      </div>
    )
  }
}

export default ImagePanel;