// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var myDifficulty = 50;
getDifficulty();
var difficulties = {}

function getDifficulty() {
	chrome.storage.local.get("difficulty", function(items) {
		if (!chrome.runtime.error) {
			console.log(typeof items.difficulty);
			if (typeof parseInt(items.difficulty) !== "number") {
				console.log("retrieved weird difficulty");
			} else {

				console.log("retrieved difficulty of " + items.difficulty);
				myDifficulty = parseInt(items.difficulty);
			}
			sendDifficulty();
		} else {
			console.log("get difficulty error");
		}
	});
}

function sendDifficulty() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  		chrome.tabs.sendMessage(tabs[0].id, {newDifficulty:myDifficulty}, function(response) {
  });
	});
	storeDifficulty();
}

function storeDifficulty() {
	chrome.storage.local.set({"difficulty" : myDifficulty}, function() {
		if (chrome.runtime.error) {
			console.log("store difficulty error");
		} else {
			console.log("stored successful");
			console.log(myDifficulty);
		}
	});
}

function calculateHighlight() {
	console.log("my difficulty " + myDifficulty);
	var res = {toAdd:[], toRemove:[]};
	$.each(difficulties, function(word,wordDifficulty) {
		if (wordDifficulty > myDifficulty) {
			console.log("adding highlight");
			console.log(word);
			console.log("my difficulty : " + myDifficulty);
			console.log("word difficulty : " + wordDifficulty);
			console.log(typeof myDifficulty);
			console.log(typeof wordDifficulty);
			res.toAdd.push(word);
		} else if (wordDifficulty < myDifficulty) {
			res.toRemove.push(word);
		}
	});
	console.log(res);
	return res;
}

function calculateHighlightUpdate(newDifficulty) {
	var res = {toAdd:[], toRemove:[]};
	$.each(difficulties, function(word,wordDifficulty) {
		if (newDifficulty < myDifficulty) {
			if (wordDifficulty < myDifficulty && wordDifficulty > newDifficulty) {
				console.log("nuuhhh you got dumber " + word);
				res.toAdd.push(word);
			}
		} else {
			if (wordDifficulty > myDifficulty && wordDifficulty < newDifficulty) {
				console.log("old difficulty : " + myDifficulty);
				console.log("word difficulty : " + wordDifficulty);
				console.log("yayyy you got smarter " + word);
				res.toRemove.push(word);
			}
		}
	});
	return res;
}

function updateHighlights(highlights) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  		chrome.tabs.sendMessage(tabs[0].id, {wordHighlights:highlights}, function(response) {
  });
	});

}

//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.getDifficulties) {
      console.log(request.getDifficulties);
      getDifficulties(request.getDifficulties, function(res) {
        for (var attrname in res) { difficulties[attrname] = parseInt(res[attrname]); }
        console.log(difficulties);
        var res = calculateHighlight();
        console.log(res, "mu");
        console.log(sendResponse);
        sendResponse(res);
      });
    } else if (request.newDifficulty) {
      var res = calculateHighlightUpdate(request.newDifficulty);
      myDifficulty = request.newDifficulty;
	  storeDifficulty();
	  updateHighlights(res);
    } else if (request.getDifficulty) {
		sendResponse(myDifficulty);
	} else if (request.init) {
      sendResponse();
	  }
    return true;
  });

// TODO openPopup
