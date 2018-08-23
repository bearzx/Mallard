function js_load(url, cb) {
    console.log(`loading ${url}`);
    var js = document.createElement('script');
    js.src = url;
    if (cb) {
        js.onload = cb;
    }
    (document.head || document.documentElement).appendChild(js);
}

let tableparser_load = () => js_load('https://www.bearzx.com/pgxz3/jquery.tableparser.js');
let cl_load = () => js_load('https://www.bearzx.com/pgxz3/cl.js', tableparser_load);
js_load('https://www.bearzx.com/pgxz2/jquery-3.2.1.js', cl_load);
