function js_load(url, cb) {
    console.log(`loading ${url}`);
    var js = document.createElement('script');
    js.src = url;
    if (cb) {
        js.onload = cb;
    }
    (document.head || document.documentElement).appendChild(js);
}

js_load('https://www.bearzx.com/pgxz3/cl.js');