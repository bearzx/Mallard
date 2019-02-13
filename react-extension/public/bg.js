console.log('yo from bg');

// initializations
window.sharedVariables = {};
// end initializations

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    // console.log(msg);
    if (msg.action == 'save-script') {
        saveScript(msg, sendResponse);
    } else if (msg.action == 'img-drag-start' || msg.action == 'img-drag-end') {
        window.devtoolPort.postMessage(msg);
    } else if (msg.action == 'import-variable') {
        console.log(`importing ${msg.vname} from tab ${msg.tabId}`);
        // console.log(window[msg.vname]);
        sendResponse({
            vname: msg.vname,
            vvalue: window.sharedVariables[msg.tabId][msg.vname]
        });
    } else if (msg.action == 'export-variable') {
        console.log(`exporting ${msg.vname} from tab ${msg.tabId}:`);
        console.log(msg.vvalue);
        window.sharedVariables[msg.tabId][msg.vname] = msg.vvalue;
    } else if (msg.action == 'console-created') {
        console.log(`new console created: ${msg.tabId}`);
        window.sharedVariables[msg.tabId] = {};
    } else if (msg.action == 'console-closed') {
        console.log(`console closed ${msg.tabId}`);
    }

    return true;
});

function saveScript(msg, sendResponse) {
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
    contexts: ['selection', 'link', 'image', 'video'],
    onclick: inspectData
});

function inspectData(info) {
    console.log(info);

    if (info.mediaType) {
        // mediaType can only be image, video or audio
        console.log(`${info.mediaType} url ${info.srcUrl}`);
        window.devtoolPort.postMessage({ action: `inspect-${info.mediaType}`, srcUrl: info.srcUrl });
    } else if (info.linkUrl) {
        console.log(`link url ${info.linkUrl}`);
        if (info.linkUrl.endsWith('.tsv') || info.linkUrl.endsWith('.csv')) {
            window.devtoolPort.postMessage({ action: 'inspect-xsv', linkUrl: info.linkUrl });
        }
    } else {
        window.devtoolPort.postMessage({ action: 'detect-table' });
    }
}
