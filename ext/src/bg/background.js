// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var myDifficulty = 50;
var difficulties = {}

function calculateHighlight(difficulties) {
  $.each(difficulties, function(word,wordDifficulty) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.insertCSS(tabs[0].id, {code: ".highlight{background-color:'yellow';}", runAt: "document_idle"}, function() {
        if (wordDifficulty > myDifficulty) {
          console.log(word,wordDifficulty);
          chrome.tabs.sendMessage(tabs[0].id, {addHighlight:word}, function(response) {});
        } else if (wordDifficulty < myDifficulty) { 
          chrome.tabs.sendMessage(tabs[0].id, {removeHighlight:word}, function(response) {});
        }
      });
    });
  });
}

//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.getDifficulties) {
      console.log(request.getDifficulties);
      getDifficulties(request.getDifficulties, function(res) {
        for (var attrname in res) { difficulties[attrname] = res[attrname]; }
        console.log(difficulties);
        calculateHighlight(difficulties);
      });
    } else if (request.newDifficulty) {
      calculateHighlight(request.newDifficulty,difficulties);
      myDifficulty = request.newDifficulty;
    } else if (request.init) {
      sendResponse();
	  }
  });

// TODO openPopup
