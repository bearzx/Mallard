function js_load(url, cb) {
    console.log(`loading ${url}`);
    var js = document.createElement('script');
    js.src = url;
    if (cb) {
        js.onload = cb;
    }
    (document.head || document.documentElement).appendChild(js);
}

window.addEventListener('message', function(e) {
    // console.log(e);
    if (e.data.type == 'img-drag-start') {
        chrome.runtime.sendMessage({ action: 'img-drag-start' }, () => {});
    } else if (e.data.type == 'img-drag-end') {
        chrome.runtime.sendMessage({ action: 'img-drag-end' }, () => {});
    } else if (e.data.type == 'direction') {
        console.log(e.data.direction);
    }
});

chrome.extension.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type == 'direction') {
        console.log(msg.direction);
    }
});

let tableparser_load = () => js_load('https://www.bearzx.com/pgxz3/jquery.tableparser.js');
let cl_load = () => js_load('https://www.bearzx.com/pgxz3/cl.js', tableparser_load);
js_load('https://www.bearzx.com/pgxz3/jquery-3.2.1-customized.js', cl_load);
