// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var myDifficulty = 50;
var difficulties = {}

function calculateHighlight(difficulties) {
  var res = {toAdd:[], toRemove:[]};
  $.each(difficulties, function(word,wordDifficulty) {
    if (wordDifficulty > myDifficulty) {
      console.log(word,wordDifficulty);
      res.toAdd.push(word);
    } else if (wordDifficulty < myDifficulty) { 
      res.toRemove.push(word);
    }
  });
  console.log(res);
  return res;
}

//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.getDifficulties) {
      console.log(request.getDifficulties);
      getDifficulties(request.getDifficulties, function(res) {
        for (var attrname in res) { difficulties[attrname] = res[attrname]; }
        console.log(difficulties);
        var res = calculateHighlight(difficulties);
        console.log(res, "mu");
        console.log(sendResponse);
        sendResponse(res);
      });
    } else if (request.newDifficulty) {
      calculateHighlight(request.newDifficulty,difficulties);
      myDifficulty = request.newDifficulty;
    } else if (request.init) {
      sendResponse();
	  }
    return true;
  });

// TODO openPopup
