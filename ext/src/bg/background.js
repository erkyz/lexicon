var myDifficulty = 50;
var cacheDifficulties = {} // cap?

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
      var localDifficulties = {}
      $.each(request.getDifficulties, function(word, wordDifficulty) {
        if (cacheDifficulties[word])
           localDifficulties[word] = wordDifficulty;
      });
      getDifficulties(request.getDifficulties, function(res) {
        for (var attrname in res) { cacheDifficulties[attrname] = res[attrname]; }
        for (var attrname in res) { localDifficulties[attrname] = res[attrname]; }
        var toHighlight = calculateHighlight(localDifficulties);
        sendResponse(toHighlight);
      });
    } else if (request.newDifficulty) {
        chrome.runtime.sendMessage(calculateHighlight(request.newDifficulty,difficulties));
        myDifficulty = request.newDifficulty;
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
