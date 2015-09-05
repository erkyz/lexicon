// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var currentDifficulty = 50;
var difficulties = {}

function calculateToHighlight(newDifficulty,words) {
  if (newDifficulty > currentDifficulty) {
    $.each(difficulties, function(word,wordDifficulty) {
      if (wordDifficulty < newDifficulty && wordDifficulty > currentDifficulty)
      chrome.runtime.sendMessage({removeHighlight: word});
    });
  } else if (newDifficulty < currentDifficulty) {
      $.each(difficulties, function(word,difficulty) {
        if (wordDifficulty > newDifficulty && wordDifficulty < currentDifficulty)
        chrome.runtime.sendMessage({addHighlight: word});
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
        sendResponse(currentDifficulty, res);
      });

    } else if (request.newDifficulty) {

        currentDifficluty = request.newDifficulty;
    }
      chrome.runtime.sendMessage({
    } else if (request.init) {
      sendResponse();
	  }
  });

<style>
.highlight {
	background-color:"yellow";
}
</style>


// TODO openPopup
