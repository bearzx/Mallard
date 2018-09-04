import React, { Component } from 'react';
import DataFrame from 'dataframe-js';

export class ImagePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgCode: ''
    };
  }

  preventDefault = (e) => {
    e.preventDefault();
    // console._log('on drag over');
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
      <div id="drag-area" className="plot-slot" onDragOver={this.preventDefault} onDrop={this.drop}>
        <img src={this.state.imgCode} />
      </div>
    )
  }
}

export default ImagePanel;