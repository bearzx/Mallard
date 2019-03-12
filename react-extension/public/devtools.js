console.log('yo from devtools');

function create_editor_panel() {
  chrome.devtools.panels.create("Editor",
      "MyPanelIcon.png", // todo change icon
      "editor-panel.html",
      function(panel) {
        // code invoked on panel creation
        console.log('editor panel created');
      }
  );
}

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

chrome.devtools.panels.create("Mallard >_",
    "MyPanelIcon.png", // todo change icon
    "index.html",
    function(panel) {
      // code invoked on panel creation
      console.log('repl panel created');

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let tab = tabs[0];
        chrome.runtime.sendMessage({
          action: 'console-created',
          tabId: tab.id
        });
      });

      panel.onSearch.addListener(function (action, queryString) {
        console.log(action);
        console.log(queryString);
      });

      panel.onShown.addListener(function (window) {
        console.log('panel shown');
      });

      panel.onHidden.addListener(function () {
        console.log('panel hidden');
      });
    }
);
