console.log('yo from devtools');

chrome.devtools.panels.create("Editor",
    "MyPanelIcon.png", // todo change icon
    "editor-panel.html",
    function(panel) {
      // code invoked on panel creation
      console.log('editor panel created');
    }
);

chrome.devtools.panels.create("Vis",
    "MyPanelIcon.png", // todo change icon
    "vis-panel.html",
    function(panel) {
      // code invoked on panel creation
      console.log('vis panel created');
    }
);