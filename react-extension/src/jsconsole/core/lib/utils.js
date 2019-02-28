import DataFrame from 'dataframe-js';

// let imgid = 0;
// const getNextImgid = () => imgid++;
window._img_ = [];

// requires tensorflow
export var loadImgTensor = function(srcUrl) {
    loadImg(srcUrl, () => {
        window._t_ = window.tf.fromPixels(window._img_).toFloat();
        // console.log('Image loaded as window.t');
    });
}

export var loadImg = function(srcUrl, imgOnload) {
    let img = new Image();
    window._img_.push(img);
    img.onload = () => {
        console.log(`Image loaded as <span class="sGreen">window._img_[${window._img_.length - 1}]<span>`);
        const imgWidth = img.width;
        const imgHeight = img.height;
        if (imgWidth > window.innerWidth) {
            img.width = window.innerWidth;
            img.height = imgHeight / (imgWidth / window.innerWidth);
        }
        if (imgOnload) {
            imgOnload();
        }
    };
    img.src = srcUrl;
}

export var loadVideo = function(srcUrl) {
    window._video_ = document.createElement('video');
    window._video_.onloadstart = () => {
        console.log('Video loaded as window._video_');
    };

    window._video_.oncanplay = () => {
        window._video_.width = window._video_.videoWidth;
        window._video_.height = window._video_.videoHeight;
    }

    window._video_.setAttribute('crossOrigin', 'anonymous');
    window._video_.setAttribute('src', srcUrl);
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