console.log('yo from devtools');

// function create_editor_panel() {
  chrome.devtools.panels.create("Editor",
      "MyPanelIcon.png", // todo change icon
      "editor-panel.html",
      function(panel) {
        // code invoked on panel creation
        console.log('editor panel created');
      }
  );
// }

function create_vis_panel() {
  chrome.devtools.panels.create("Vis",
    "MyPanelIcon.png", // todo change icon
    "vis-panel.html",
    function(panel) {
      // code invoked on panel creation
      console.log('vis panel created');
    }
  );
}

function create_repl_panel() {
  chrome.devtools.panels.create("REPL",
    "MyPanelIcon.png", // todo change icon
    "repl-panel.html",
    function(panel) {
      // code invoked on panel creation
      console.log('repl panel created');
    }
  );
}
