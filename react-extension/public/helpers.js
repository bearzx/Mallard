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

function linePlotTemplate(_df, xtitle, ytitle, xtype = 'quantitative') {
    let _values = [];
    _df.forEach(function (row) {
        _values.push({ 'x': parseInt(row[0]), 'y': parseInt(row[1]) });
    });

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
    for (prediction of predictions) {
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