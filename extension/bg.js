console.log('yo from bg');

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    // console.log(msg);
    if (msg.action == 'save-script') {
        save_script(msg);
    }
});

function save_script(msg) {
    // console.log(`saving new script ${msg.name}`);
    // console.log(msg.code);
    chrome.storage.sync.get(['saved_scripts'], function(result) {
        if ($.isEmptyObject(result)) {
            chrome.storage.sync.set({ saved_scripts: { [msg.name]: msg.code } });
        } else {
            result.saved_scripts[msg.name] = msg.code;
            chrome.storage.sync.set({ saved_scripts: result.saved_scripts }, function() {
                chrome.storage.sync.get(['saved_scripts'], function(result) {
                    console.log(result);
                });
            });
        }
    });
}

function show_code() {
    console.log('querying all saved scripts ...');
    chrome.storage.sync.get(['saved_scripts'], function(result) {
        console.log(result.saved_scripts);
    });
}

function rm_code(name) {
    chrome.storage.sync.get(['saved_scripts'], function(result) {
        delete result.saved_scripts[name];
        chrome.storage.sync.set({ saved_scripts: result.saved_scripts }, function() {

        });
    });
}