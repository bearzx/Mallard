function addSelectionLayer() {
    let selection_layer_template = `<div id="fs-selection-layer"></div>`;
    _$_(selection_layer_template).css({
        'width': '200px',
        'height': '200px',
        'background-color': 'black',
        'opacity': '0.4',
        'border': '2px solid #f0f0f0',
        'position': 'absolute',
        'left': '0',
        'top': '0',
        'display': 'none',
        'pointer-events': 'none',
        'cursor': 'pointer'
    }).appendTo(_$_('body'));

    let selection_layer_control = `
        <div id="selection-layer-control-wrap" class="selection-layer-control">
            <button id="done-selection" class="btn btn-primary btn-sm selection-layer-control">Done Selection</button>
            <button id="cancel-selection" class="btn btn-secondary btn-sm selection-layer-control">Cancel</button>
        </div>
    `;

    _$_(selection_layer_control).css({
        'position': 'fixed',
        'width': '200px',
        'height': '50px',
        'right': '10px',
        'bottom': '10px',
        'display': 'none',
        'text-align': 'right'
    }).appendTo(_$_('body'));

    _$_('body *').hover(
        function(e) {
            if (window.fs_selector_active || window.crop_selector_active || window.embed_selector_active) {
                // console.log(e.target);
                if (!_$_(e.target).hasClass('selection-layer-control')) {
                    let pos = _$_(e.target).offset();
                    let bgc = e.altKey ? 'red' : 'black';
                    _$_('#fs-selection-layer').css({
                        'top': pos.top,
                        'left': pos.left,
                        'width': _$_(e.target).outerWidth(),
                        'height': _$_(e.target).outerHeight(),
                        'background-color': bgc
                    }).show();
                }
            }
        },
        function(e) {
            _$_('#fs-selection-layer').hide();
        }
    );

    _$_('#done-selection').click((e) => {
        console.log('done selection');
        console.log(window.crop_selected_elements);
        console.log(window.crop_excluded_elements);
        if (window.crop_selected_elements.length) {
            _$_(window.crop_selected_elements[0]).siblings().hide();
            _$_(window.crop_selected_elements[0]).parents().siblings().hide();
            _$_(window.crop_selected_elements[0]).parents().show();

            for (let i = 0; i < window.crop_selected_elements.length; i++) {
                _$_(window.crop_selected_elements[i]).css('border', window.css_preserving[window.crop_selected_elements[i]]);
                _$_(window.crop_selected_elements[i]).show();
            }
        }

        window.crop_excluded_elements.forEach(function(e) {
            console.log(e);
            _$_(_$_(e).get(0)).hide();
        });

        window.postMessage({ type: 'add-crop-page', elements: { selected: window.crop_selected_elements, excluded: window.crop_excluded_elements } }, '*');

        hide_selection_layer();
    });

    _$_('#cancel-selection').click((e) => {
        console.log('cancel selection');
        hide_selection_layer();
    });

    function hide_selection_layer() {
        window.crop_selector_active = !window.crop_selector_active;
        _$_('#selection-layer-control-wrap').hide();
    }

    _$_(document).on('click', function(e) {
        if (window.fs_selector_active) {
            window.fs_selected_element = e.target;
            console.log('fs element selected');
        } else if (window.crop_selector_active) {
            if (!_$_(e.target).hasClass('selection-layer-control')) {
                // console.log(e.target);
                toggleSelectionLayer();

                let htable = _$_(e.target).parsetable(true, true);
                let data = {};
                let columns = [];
                htable.forEach((c) => {
                    data[c[0]] = c.slice(1);
                    columns.push(c[0]);
                });
                window.df = new dfjs.DataFrame(data, columns);
            }
        } else if (window.embed_selector_active) {
            window.fs_selected_element = e.target;
            window.embed_selector_active = false;
            window.embed_selection_cb();
        }
    });
}

function addImgHandler() {
    let imgs = document.querySelectorAll('img');
    imgs.forEach((img, i) => {
        console.log(`adding drag handler to img ${i}`);
        img.draggable = true;
        // let imgSrc = img.getAttribute('src');
        // img.crossOrigin = "Anonymous";
        // img.src = imgSrc;
        img.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('dragType', 'img');
            event.dataTransfer.setData('imgi', i);
            event.dataTransfer.setData('imgCode', img2base64URL(img));
            window.postMessage({ type: 'img-drag-start' }, '*');
        });

        img.addEventListener('dragend', function(event) {
            console.log('drag end');
            window.postMessage({ type: 'img-drag-end' }, '*');
        });
    });
}

function addTableHandler() {
    let tables = document.querySelectorAll('table');
    tables.forEach((table, i) => {
        console.log(`adding drag handler to table ${i}`);
        table.draggable = true;
        table.addEventListener('dragstart', function(event) {
            let columns = _$_(event.target).parsetable(true, true);
            event.dataTransfer.setData('dragType', 'table');
            event.dataTransfer.setData('columns', JSON.stringify(columns));
        });
    });
}

function addLinkHandler() {
    let as = document.querySelectorAll('a');
    as.forEach((a, i) => {
        console.log(`adding drag handler to link ${i}`);
        a.addEventListener('dragstart', function(event) {
            let link = event.target.href;
            event.dataTransfer.setData('dragType', 'link');
            event.dataTransfer.setData('href', link);
        });
    });
}

function addDragHanlder() {
    // addImgHandler();
    // addTableHandler();
    // addLinkHandler();
}

function remoteRequire(url) {
    fetch(url).then((res) => {
        res.text().then((code) => {
            eval(code);
            console.log(`${url} loaded`);
        });
    });
}

function loadLib(name) {
    switch(name) {
        case 'dataframe.js':
            remoteRequire('http://www.bearzx.com/pgxz3/dataframe.js');
            break;
        default:
            break;
    }
}

function img2base64URL(img) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL();
}

function img2array(img) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return new Float32Array(imgData.data);
}

function toggleSelectionLayer() {
    window.crop_selector_active = !window.crop_selector_active;
}

function initDataDragger() {
    window.crop_selector_active = false;

    addDragHanlder();
    // addSelectionLayer();
}

function searchTable() {
    const tableTags = ['TD', 'TR', 'TH', 'TBODY', 'THEAD', 'TABLE'];
    if (tableTags.includes(window.clickedEl.tagName)) {
        let cur = window.clickedEl;
        while (cur.tagName != 'TABLE') {
            cur = cur.parentElement;
        }
        console.log('table detected');
        console.log(cur);
        let columns = _$_(cur).parsetable(true, true);
        console.log(columns);
        return columns;
    }
}

window.onload = function() {
    initDataDragger();

    document.addEventListener("mousedown", function(event) {
        //right click
        if(event.button == 2) {
            console.log(event.target);
            window.clickedEl = event.target;
        }
    }, true);
};