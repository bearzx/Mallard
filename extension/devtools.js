console.log('yo from devtools');

chrome.devtools.panels.create("My Panel",
    "MyPanelIcon.png",
    "panel.html",
    function(panel) {
      // code invoked on panel creation
      console.log('panel created');
    }
);