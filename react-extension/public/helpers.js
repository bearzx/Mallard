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

    vegaEmbed(container, spec);
}

function modelLoaded() {
    console.log('model <span class="sGreen">loaded</span>');
}

function putBack(canvas, img) {
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