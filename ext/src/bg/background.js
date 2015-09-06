// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var myDifficulty = 40;
getDifficulty();
var cacheDifficulties = {}

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

function calculateHighlight(difficulties) {
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

function calculateHighlightUpdate(newDifficulty, difficulties) {
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
      var localDifficulties = {}
      $.each(request.getDifficulties, function(word, wordDifficulty) {
        if (cacheDifficulties[word])
           localDifficulties[word] = wordDifficulty;
      });
      getDifficulties(request.getDifficulties, function(res) {
        for (var attrname in res) { cacheDifficulties[attrname] = parseInt(res[attrname]); }
        for (var attrname in res) { localDifficulties[attrname] = parseInt(res[attrname]); }
        var toHighlight = calculateHighlight(localDifficulties);
        sendResponse(toHighlight);
      });
    } else if (request.newDifficulty) {
		var res = calculateHighlightUpdate(request.newDifficulty, localDifficulties);
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

// TODO
function updateKnowingness(info, tab) {
  return true;
};

// TODO
function clickDefinition(info, tab) {
  var sText = info.selectionText;
  var url = "http://elo-lasers.azurewebsites.net/get_definition?word=" + sText;
  window.open(url, '_blank');
}

// add right-click events
chrome.contextMenus.create({title: "I know or don't know this word uhhhhhhhhh", contexts:["selection"], onclick: updateKnowingness});
chrome.contextMenus.create({title: "Look up definition", contexts:["selection"], onclick: clickDefinition});

// TODO openPopup
