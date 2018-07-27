function show_code() {
    console.log('querying all saved scripts ...');
    chrome.storage.local.get(['saved_scripts'], function(result) {
        console.log(result.saved_scripts);
    });
}

function edit_code(name) {
    chrome.storage.local.get(['saved_scripts'], function(result) {
        $('#script-name').val(name);
        let editor = ace.edit('editor');
        editor.setValue(result.saved_scripts[name]);
        editor.clearSelection();
    });
}

function rename_code(old_name, new_name) {
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

function remote_require(url) {
    fetch(url).then((res) => {
        res.text().then((code) => {
            eval(code);
            console.log(`${url} loaded`);
        });
    });
}