console.log('yo from bg');

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    // console.log(msg);
    if (msg.action == 'save-script') {
        save_script(msg, sendResponse);
    } else if (msg.action == 'img-drag-start' || msg.action == 'img-drag-end') {
        window.devtoolPort.postMessage(msg);
    }

    return true;
});

function save_script(msg, sendResponse) {
    // console.log(`saving new script ${msg.name}`);
    // console.log(msg.code);
    chrome.storage.local.get(['saved_scripts'], (result) => {
        if ($.isEmptyObject(result)) {
            chrome.storage.local.set({ saved_scripts: { [msg.name]: msg.code } });
        } else {
            result.saved_scripts[msg.name] = msg.code;
            chrome.storage.local.set({ saved_scripts: result.saved_scripts }, () => {
                sendResponse(`${msg.name} saved`);
                chrome.storage.local.get(['saved_scripts'], (result) => {
                    console.log(result);
                });
            });
        }
    });
}

chrome.runtime.onConnect.addListener((port) => {
    if (port.name == 'devtool') {
        // port.postMessage({ msg: 'yo' });
        window.devtoolPort = port;
        port.onMessage.addListener((msg) => {
            console.log(msg);
        });
    }
});

function pingDevtool() {
    window.devtoolPort.postMessage({ msg: 'la' });
}

chrome.contextMenus.create({
    title: 'Inspect Data',
    contexts: ['selection', 'link', 'image'],
    onclick: inspectData
});

function inspectData(info) {
    console.log(info);

    if (info.mediaType) {
        console.log(`image url ${info.srcUrl}`);
        window.devtoolPort.postMessage({ action: 'inspect-img', imgSrc: info.srcUrl });
    } else if (info.linkUrl) {
        console.log(`link url ${info.linkUrl}`);
        if (info.linkUrl.endsWith('.tsv')) {
            window.devtoolPort.postMessage({ action: 'inspect-tsv', linkUrl: info.linkurl });
        } else if (info.linkUrl.endsWith('.csv')) {
            window.devtoolPort.postMessage({ action: 'inspect-csv', linkUrl: info.linkurl });
        }
    } else {
        window.devtoolPort.postMessage({ action: 'detect-table' });
    }
}