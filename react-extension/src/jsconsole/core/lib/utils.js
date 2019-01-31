import DataFrame from 'dataframe-js';

// requires tensorflow
export var loadImgTensor = function(imgSrc) {
    loadImg(imgSrc, () => {
        window.t = window.tf.fromPixels(window._img_).toFloat();
        // console.log('Image loaded as window.t');
    });
}

export var loadImg = function(imgSrc, imgOnload) {
    window._img_ = new Image();
    window._img_.onload = () => {
        console.log('Image loaded');
        imgOnload();
    };
    window._img_.src = imgSrc;
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