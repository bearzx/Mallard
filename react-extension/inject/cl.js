function addDragHanlder() {
    let imgs = document.querySelectorAll('img');
    imgs.forEach((img, i) => {
        console.log(`adding drag handler to img ${i}`);
        img.draggable = true;
        img.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('dragType', 'img');
            event.dataTransfer.setData('imgi', i);
            event.dataTransfer.setData('imgCode', img2base64URL(img));
        });
    });

    let tables = document.querySelectorAll('table');
    tables.forEach((table, i) => {
        console.log(`adding drag handler to table ${i}`);
        table.draggable = true;
        table.addEventListener('dragstart', function(event) {
            let columns = $(event.target).parsetable(true, true);
            event.dataTransfer.setData('dragType', 'table');
            event.dataTransfer.setData('columns', JSON.stringify(columns));
        });
    });

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
            remoteRequire('https://www.bearzx.com/pgxz3/dataframe.js');
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
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return new Float32Array(imageData.data);
}

function addSelectionLayer() {
    let selection_layer_template = `<div id="fs-selection-layer"></div>`;
    $(selection_layer_template).css({
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
    }).appendTo($('body'));

    let selection_layer_control = `
        <div id="selection-layer-control-wrap" class="selection-layer-control">
            <button id="done-selection" class="btn btn-primary btn-sm selection-layer-control">Done Selection</button>
            <button id="cancel-selection" class="btn btn-secondary btn-sm selection-layer-control">Cancel</button>
        </div>
    `;

    $(selection_layer_control).css({
        'position': 'fixed',
        'width': '200px',
        'height': '50px',
        'right': '10px',
        'bottom': '10px',
        'display': 'none',
        'text-align': 'right'
    }).appendTo($('body'));

    $('body *').hover(
        function(e) {
            if (window.fs_selector_active || window.crop_selector_active || window.embed_selector_active) {
                // console.log(e.target);
                if (!$(e.target).hasClass('selection-layer-control')) {
                    let pos = $(e.target).offset();
                    let bgc = e.altKey ? 'red' : 'black';
                    $('#fs-selection-layer').css({
                        'top': pos.top,
                        'left': pos.left,
                        'width': $(e.target).outerWidth(),
                        'height': $(e.target).outerHeight(),
                        'background-color': bgc
                    }).show();
                }
            }
        },
        function(e) {
            $('#fs-selection-layer').hide();
        }
    );

    $('#done-selection').click((e) => {
        console.log('done selection');
        console.log(window.crop_selected_elements);
        console.log(window.crop_excluded_elements);
        if (window.crop_selected_elements.length) {
            $(window.crop_selected_elements[0]).siblings().hide();
            $(window.crop_selected_elements[0]).parents().siblings().hide();
            $(window.crop_selected_elements[0]).parents().show();

            for (let i = 0; i < window.crop_selected_elements.length; i++) {
                $(window.crop_selected_elements[i]).css('border', window.css_preserving[window.crop_selected_elements[i]]);
                $(window.crop_selected_elements[i]).show();
            }
        }

        window.crop_excluded_elements.forEach(function(e) {
            console.log(e);
            $($(e).get(0)).hide();
        });

        window.postMessage({ type: 'add-crop-page', elements: { selected: window.crop_selected_elements, excluded: window.crop_excluded_elements } }, '*');

        hide_selection_layer();
    });

    $('#cancel-selection').click((e) => {
        console.log('cancel selection');
        hide_selection_layer();
    });

    function hide_selection_layer() {
        window.crop_selector_active = !window.crop_selector_active;
        $('#selection-layer-control-wrap').hide();
    }

    $(document).on('click', function(e) {
        if (window.fs_selector_active) {
            window.fs_selected_element = e.target;
            console.log('fs element selected');
        } else if (window.crop_selector_active) {
            if (!$(e.target).hasClass('selection-layer-control')) {
                // console.log(e.target);
                toggleSelectionLayer();

                let htable = $(e.target).parsetable(true, true);
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

function toggleSelectionLayer() {
    window.crop_selector_active = !window.crop_selector_active;
}

window.onload = function() {
    window.crop_selector_active = false;

    addDragHanlder();
    addSelectionLayer();
};