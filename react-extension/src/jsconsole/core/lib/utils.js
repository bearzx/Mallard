import DataFrame from 'dataframe-js';

// requires tensorflow
export var loadImg = function(imgSrc) {
    let img = new Image();
    img.onload = () => {
      window.t = window.tf.fromPixels(img).toFloat();
      console.log('Image loaded as window.t');
    };
    img.src = imgSrc;
}

export var loadXSV = function(link) {
    let p;
    if (link.endsWith('.tsv')) {
        p = DataFrame.fromTSV(link).then(df => { window.df = df });
    } else if (link.endsWith('.csv')) {
        p = DataFrame.fromCSV(link).then(df => { window.df = df });
    }
    Promise.resolve(p);
}

export var cols2DF = function(_columns) {
    let data = {};
    let columns = [];
    _columns.forEach((c) => {
        data[c[0]] = c.slice(1);
        columns.push(c[0]);
    });
    window.df = new DataFrame(data, columns);
}