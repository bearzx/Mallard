function show_code() {
    console.log('querying all saved scripts ...');
    chrome.storage.local.get(['saved_scripts'], function(result) {
        console.log(result.saved_scripts);
    });
}

function print_code(name) {
    chrome.storage.local.get(['saved_scripts'], function(result) {
        console.log(result.saved_scripts[name]);
    });
}

function edit_code(name) {
    chrome.storage.local.get(['saved_scripts'], function(result) {
        window.changeAppState({
            fname: name,
            code: result.saved_scripts[name]
        });
    });
}

function rename_code(old_name, new_name) {
    // todo
}

function rm_code(name) {
    chrome.storage.local.get(['saved_scripts'], function(result) {
        delete result.saved_scripts[name];
        chrome.storage.local.set({ saved_scripts: result.saved_scripts }, function() {

        });
    });
}

function eval_stored_code(name) {
    chrome.storage.local.get(['saved_scripts'], function(result) {
        // console.log(result.saved_scripts[name]);
        eval(result.saved_scripts[name]);
    });
}

function remote_require(url) {
    fetch(url).then((res) => {
        res.text().then((code) => {
            eval(code);
            console.log(`${url} loaded`);
        });
    });
}

function set_canvas(plot_id) {

}

function set_html(plot_id, html) {
    $(plot_id).html(html);
}

// visualization setups
window.containerLogs = {};
// end visualization setups

async function plotData(container, xs, ys) {
    const xvals = await xs.data();
    const yvals = await ys.data();

    const values = Array.from(yvals).map((y, i) => {
      return {'x': xvals[i], 'y': yvals[i]};
    });

    const spec = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
      'width': 300,
      'height': 300,
      'data': {'values': values},
      'mark': 'point',
      'encoding': {
        'x': {'field': 'x', 'type': 'quantitative'},
        'y': {'field': 'y', 'type': 'quantitative'}
      }
    };

    return vegaEmbed(container, spec, {actions: false});
}

function dfLinePlot(_df, xtitle, ytitle, xtype = 'quantitative') {
    let _values = [];
    _df.forEach(function (row) {
        _values.push({ 'x': parseInt(row[0]), 'y': parseInt(row[1]) });
    });

    return vglLinePlotTemplate(_values, xtitle, ytitle, xtype);
}

function logPlot(container, loss) {
    if (window.containerLogs[container]) {
        window.containerLogs[container].push({
            x: window.containerLogs[container].length,
            y: loss
        });
    } else {
        window.containerLogs[container] = [{
            x: 0,
            y: loss
        }];
    }

    vegaEmbed(container, vglLinePlotTemplateV3(window.containerLogs[container], 'iter', 'loss'));
}

function vgLayers(layers) {
    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
        "layer": layers,
        "width": 600,
        "height": 300,
        "mode": "vega-lite",
        actions: false
    };
}

function vglLinePlotLayer(_values, xtitle, ytitle, xtype = 'quantitative') {
    return {
        "data": {"values": _values},
        "mark": "line",
        "encoding": {
          "x": {
              "field": "x",
              "type": xtype,
              'title': xtitle
            },
          "y": {
              "field": "y",
              "type": "quantitative",
              'title': ytitle
            }
        }
    };
}

function vglScatterPlotLayer(_values, xtitle, ytitle, xtype = 'quantitative') {
    return {
        "data": {"values": _values},
        "mark": "point",
        "encoding": {
          "x": {
              "field": "x",
              "type": xtype,
              'title': xtitle
            },
          "y": {
              "field": "y",
              "type": "quantitative",
              'title': ytitle
            }
        }
    };
}

function vglLinePlotTemplateV3(_values, xtitle, ytitle, xtype = 'quantitative') {
    let spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
        "data": {"values": _values},
        "mark": "line",
        "encoding": {
          "x": {
              "field": "x",
              "type": xtype,
              'title': xtitle
            },
          "y": {
              "field": "y",
              "type": "quantitative",
              'title': ytitle
            }
        },
        "width": 600,
        "height": 300,
        "mode": "vega-lite",
        actions: false
    };

    return spec;
}

function vglLinePlotTemplateV2(_values, xtitle, ytitle, xtype = 'quantitative') {
    let spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "data": { "values": _values },
        "mark": "line",
        "encoding": {
            "x": {
                "field": 'x',
                "type": xtype,
                "axis": {
                    'ticks': _values.length
                },
                "title": xtitle
            },
            "y": {
                "field": 'y',
                "type": "quantitative",
                "title": ytitle
            }
        },
        "width": 600,
        "height": 300,
        "mode": "vega-lite",
        actions: false
    };

    return spec;
}

function barPlotTemplate(_df, xtitle, ytitle, xtype = 'nominal', ytype = 'quantitative') {
    let _values = [];
    _df.forEach(function (row) {
        _values.push({ 'x': row[0], 'y': parseInt(row[1]) });
    });

    let spec = {
        "data": {
            "values": _values
        },
        "mark": "bar",
        "encoding": {
            "x": {
                "field": "x",
                "title": xtitle,
                "type": xtype
            },
            "y": {
                // "aggregate": "average",
                "field": "y",
                "title": ytitle,
                "type": ytype
            }
        },
        "width": 600,
        "height": 300,
        'mode': 'vega-lite',
        actions: false
    };

    return spec;
}

function visPrediction(container, predictions) {
    console._log(predictions);

    for (let prediction of predictions) {
        prediction.probability = prediction.probability * 100;
    }

    let spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
        "description": "bla",
        "data": {
            values: predictions
        },
        "mark": "bar",
        "encoding": {
            "y": {
                "field": "className",
                "type": "ordinal",
                "scale": {"rangeStep": 20},
                "axis": {"title": "Prediction"}
            },
            "x": {
            "field": "probability",
            "type": "quantitative",
            "axis": {"title": "Probability"}
            }
        },
        "config": {"axisY": {"minExtent": 30}},
        actions: false
    };

    vegaEmbed(_$(container), spec);
}

function modelLoaded() {
    console.log('model <span class="sGreen">loaded</span>');
}

function replaceBack(img, id) {
    let canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    let dataUrl = canvas.toDataURL();
    chrome.devtools.inspectedWindow.eval(`mReplaceImage("${dataUrl}", "${id}")`);
}

function putBack(visid, img) {
    let canvas = _$(`${visid} canvas`);
    let dataUrl = canvas.toDataURL();
    let width = canvas.width;
    let height = canvas.height;
    let relSrc = img.relSrc;
    chrome.devtools.inspectedWindow.eval(`mRenderImage("${dataUrl}", "${relSrc}", ${width}, ${height})`);
}

function df2HTML(df, className) {
    let headers = df.listColumns();
    let rows = df.toArray();
    let html = className ? `<table class="${className}">` : `<table>`;
    html += `<thead>`;
    for (header of headers) {
        html += `<td>${header}</td>`;
    }
    html += `</thead>`;

    for (row of rows) {
        html += `<tr>`;
        for (item of row) {
            html += `<td>${item}</td>`
        }
        html += `</tr>`;
    }
    html += `</table>`;
    return html;
}

function putBackTable(df, ePath) {
    let html = df2HTML(df);
    chrome.devtools.inspectedWindow.eval(`mRenderTable(\`${html}\`, \`${ePath}\`)`);
}

function canvasMask(img) {
    let ePath = `img[src="${img.relSrc}"]`;
    chrome.devtools.inspectedWindow.eval(`mAddCanvas(\`${ePath}\`)`);
}

function textSearch(tResults, pattern) {
    let div = document.createElement('div');
    div.innerHTML = tResults.html;
    let bbox = div.firstChild.title.split(';')[1].split(' ');
    let oWidth = parseInt(bbox[4]);
    let oHeight = parseInt(bbox[5]);
    let matched = tResults.words.filter(o => o.text == pattern);
    chrome.devtools.inspectedWindow.eval(`window.mCtx.beginPath()`);
    chrome.devtools.inspectedWindow.eval(`clearMCanvas()`);
    matched.forEach(o => {
        let m = o.bbox;
        // console.log(`drawBBox(${m.x0}, ${m.x1}, ${m.y0}, ${m.y1}, ${oWidth}, ${oHeight})`);
        chrome.devtools.inspectedWindow.eval(`drawBBox(${m.x0}, ${m.x1}, ${m.y0}, ${m.y1}, ${oWidth}, ${oHeight}, false)`);
    });
    chrome.devtools.inspectedWindow.eval(`window.mCtx.stroke()`);
}

function textSearchUI() {
    let html = `
        <input type="text" id="ocr-text" /><button id="ocr-search">search</button>
    `;
    console.html(html);
}

function setupTextSearchUI() {
    _$('#ocr-search').onclick = (e) => {
        textSearch(res, _$('#ocr-text').value)
    };
}

function faceSearchUI(recognitions, detections) {
    let html = `
        <select>
            <option value="thor">thor</option>
            <option value="ironman">ironman</option>
        </select>
        <button>search</button>
    `;
    console.html(html);
}

function faceSearch(detections, i) {
    let oWidth = _img_[0].width;
    let oHeight = _img_[0].height;
    let d = detections[i].detection._box;
    chrome.devtools.inspectedWindow.eval(`drawBBox(${d.x}, ${d.x + d.width}, ${d.y}, ${d.y + d.height}, ${oWidth}, ${oHeight}, false)`);
}

function styleTransferUI() {
    let html = `
        <input type="radio" name="transfer-style" value="scream" /> scream
        <input type="radio" name="transfer-style" value="rain_princess" /> rain princess
        <input type="radio" name="transfer-style" value="la_muse" /> la muse
        <button>Transfer</button>
    `;
    console.html(html);
}

function colorReview(review, score) {
    chrome.devtools.inspectedWindow.eval(`augmentReview(${review.i}, ${score})`);
}

function hideTweet(id) {
    // console.log(`hideTweet("#${id}")`);
    chrome.devtools.inspectedWindow.eval(`hideTweet("#${id}")`);
}

function showTweet(id) {
    // console.log(`hideTweet("#${id}")`);
    chrome.devtools.inspectedWindow.eval(`showTweet("#${id}")`);
}

function tweetFilterUI() {
    let html = `
        <input id="tweet-slider" type="range" min="0" max="100" value="50"/>
        <span id="tweet-slider-value"></span>
    `;
    console.html(html);
}

function setupTweetUI() {
    _$('#tweet-slider').onchange = () => {
        let valueView = _$('#tweet-slider-value');
        let barScore = parseFloat(_$('#tweet-slider').value) / 100;
        valueView.textContent = `Hide tweets below ${barScore}`;
        for (let i = 0; i < _tweets_.length; i++) {
            if (_tweets_[i].score < barScore) {
                hideTweet(_tweets_[i].id);
            } else {
                showTweet(_tweets_[i].id);
            }
        }
    };
}

async function confusionMatrix(container, data, opts) {
    const defaultOpts = {
        xLabel: null,
        yLabel: null,
        xType: 'nominal',
        yType: 'nominal',
        shadeDiagonal: true,
        fontSize: 12,
        showTextOverlay: true,
        height: 400,
    };

    const options = Object.assign({}, defaultOpts, opts);

    // Format data for vega spec; an array of objects, one for for each cell
    // in the matrix.
    const values = [];

    const inputArray = data.values;
    const tickLabels = data.tickLabels || [];
    const generateLabels = tickLabels.length === 0;

    let nonDiagonalIsAllZeroes = true;
    for (let i = 0; i < inputArray.length; i++) {
        const label = generateLabels ? `Class ${i}` : tickLabels[i];

        if (generateLabels) {
            tickLabels.push(label);
        }

        for (let j = 0; j < inputArray[i].length; j++) {
            const prediction = generateLabels ? `Class ${j}` : tickLabels[j];

            const count = inputArray[i][j];
            if (i === j && !options.shadeDiagonal) {
                values.push({
                    label,
                    prediction,
                    diagCount: count,
                    noFill: true,
                });
            } else {
                values.push({
                    label,
                    prediction,
                    count,
                });
                // When not shading the diagonal we want to check if there is a non
                // zero value. If all values are zero we will not color them as the
                // scale will be invalid.
                if (count !== 0) {
                    nonDiagonalIsAllZeroes = false;
                }
            }
        }
    }

    if (!options.shadeDiagonal && nonDiagonalIsAllZeroes) {
        // User has specified requested not to shade the diagonal but all the other
        // values are zero. We have two choices, don't shade the anything or only
        // shade the diagonal. We choose to shade the diagonal as that is likely
        // more helpful even if it is not what the user specified.
        for (const val of values) {
            if (val.noFill === true) {
                val.noFill = false;
                val.count = val.diagCount;
            }
        }
    }

    const embedOpts = {
        actions: false,
        mode: 'vega-lite',
        defaultStyle: false,
    };

    const spec = {
        'width': 600,
        'height': 600,
        'padding': 0,
        'autosize': {
            'type': 'fit',
            'contains': 'padding',
            'resize': true,
        },
        'config': {
            'axis': {
                'labelFontSize': options.fontSize,
                'titleFontSize': options.fontSize,
            },
            'text': { 'fontSize': options.fontSize },
            'legend': {
                'labelFontSize': options.fontSize,
                'titleFontSize': options.fontSize,
            }
        },
        'data': { 'values': values },
        'encoding': {
            'x': {
                'field': 'prediction',
                'type': 'ordinal',
                // Maintain sort order of the axis if labels is passed in
                'scale': { 'domain': tickLabels },
            },
            'y': {
                'field': 'label',
                'type': 'ordinal',
                // Maintain sort order of the axis if labels is passed in
                'scale': { 'domain': tickLabels },
            },
        },
        'layer': [
            {
                // The matrix
                'mark': {
                    'type': 'rect',
                },
                'encoding': {
                    'fill': {
                        'condition': {
                            'test': 'datum["noFill"] == true',
                            'value': 'white',
                        },
                        'field': 'count',
                        'type': 'quantitative',
                        'scale': { 'range': ['#f7fbff', '#4292c6'] },
                    },
                    'tooltip': {
                        'condition': {
                            'test': 'datum["noFill"] == true',
                            'field': 'diagCount',
                            'type': 'nominal',
                        },
                        'field': 'count',
                        'type': 'nominal',
                    }
                },

            },
        ]
    };

    if (options.showTextOverlay) {
        spec.layer.push({
            // The text labels
            'mark': { 'type': 'text', 'baseline': 'middle' },
            'encoding': {
                'text': {
                    'condition': {
                        'test': 'datum["noFill"] == true',
                        'field': 'diagCount',
                        'type': 'nominal',
                    },
                    'field': 'count',
                    'type': 'nominal',
                },
            }
        });
    }

    await vegaEmbed(container, spec, embedOpts);
    return Promise.resolve();
}

async function computeConfusionMatrix(labels, predictions, numClasses, weights) {
    const labelsInt = labels.cast('int32');
    const predictionsInt = predictions.cast('int32');

    if (numClasses == null) {
        numClasses =
            tf.tidy(() => {
                const max =
                    tf.maximum(labelsInt.max(), predictionsInt.max()).cast('int32');
                return max.dataSync()[0] + 1;
            });
    }

    let weightsPromise = Promise.resolve(null);
    if (weights != null) {
        weightsPromise = weights.data();
    }

    return Promise.all([labelsInt.data(), predictionsInt.data(), weightsPromise])
        .then(([labelsArray, predsArray, weightsArray]) => {
            const result = Array(numClasses).fill(0);
            // Initialize the matrix
            for (let i = 0; i < numClasses; i++) {
                result[i] = Array(numClasses).fill(0);
            }

            for (let i = 0; i < labelsArray.length; i++) {
                const label = labelsArray[i];
                const pred = predsArray[i];

                if (weightsArray != null) {
                    result[label][pred] += weightsArray[i];
                } else {
                    result[label][pred] += 1;
                }
            }

            return result;
        });
}
