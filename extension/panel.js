$(document).ready(function() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/javascript");

    editor.commands.addCommand({
        name: 'save',
        bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
        exec: (_editor) => {
            // console.log($('#script-name').val());
            // console.log(_editor.getValue());
            let msg = {
                action: 'save-script',
                name: $('#script-name').val(),
                code: _editor.getValue()
            };
            chrome.runtime.sendMessage(msg, function(response) {
                console.log(response);
            });
        }
    });
});