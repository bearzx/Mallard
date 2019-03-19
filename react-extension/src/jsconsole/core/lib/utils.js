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

export var loadImg = function(srcUrl, relSrc, imgOnload) {
    let img = new Image();
    img.relSrc = relSrc;
    window._img_.push(img);
    const imgid = window._img_.length - 1;
    img.onload = () => {
        console.log(`Image loaded as <span class="sGreen">window._img_[${imgid}]<span>`);
        const imgWidth = img.width;
        const imgHeight = img.height;
        if (imgWidth > window.innerWidth) {
            img.width = window.innerWidth;
            img.height = imgHeight / (imgWidth / window.innerWidth);
        }
        if (imgOnload) {
            imgOnload(imgid);
        }
    };
    img.src = srcUrl;
}

window.loadImg = loadImg;

window.addImageColumn = function(classifier, imageCol) {
    let oCol = imageCol.toDict();
    let label = Object.keys(oCol)[0];
    let htmls = oCol[label];
    for (let html of htmls) {
        let wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        let srcUrl = wrapper.firstChild.src.split('/').slice(3).join('/');
        // console.log(srcUrl);
        loadImg(window.hostUrlBase + '/' + srcUrl, (imgid) => {
            if (classifier) {
                classifier.addImage(window._img_[imgid], label);
            }
        });
    }
};

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
        p = DataFrame.fromTSV(link).then(df => { window._df_ = df });
    } else if (link.endsWith('.csv')) {
        p = DataFrame.fromCSV(link).then(df => { window._df_ = df });
    }
    Promise.resolve(p);
}

export var cols2DF = function(_columns, _ePath) {
    let data = {};
    let columns = [];
    _columns.forEach((c) => {
        // console._log(c);
        c = c.map(x => x.trim());
        data[c[0]] = c.slice(1)
        columns.push(c[0]);
    });
    window._df_ = new DataFrame(data, columns);
    window._df_.ePath = _ePath;
}