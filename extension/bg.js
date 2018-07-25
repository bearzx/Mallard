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
    chrome.storage.local.get(['saved_scripts'], function(result) {
        if ($.isEmptyObject(result)) {
            chrome.storage.local.set({ saved_scripts: { [msg.name]: msg.code } });
        } else {
            result.saved_scripts[msg.name] = msg.code;
            chrome.storage.local.set({ saved_scripts: result.saved_scripts }, function() {
                chrome.storage.local.get(['saved_scripts'], function(result) {
                    console.log(result);
                });
            });
        }
    });
}
