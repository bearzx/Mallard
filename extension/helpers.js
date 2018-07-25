function show_code() {
    console.log('querying all saved scripts ...');
    chrome.storage.local.get(['saved_scripts'], function(result) {
        console.log(result.saved_scripts);
    });
}

function edit_code(name) {
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