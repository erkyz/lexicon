var myDifficulty = 50;
var cacheDifficulties = {}; // cap?
var cacheSynonyms = {};

function calculateHighlight(difficulties) {
  var res = {toAdd:[], toRemove:[]};
  $.each(difficulties, function(word,wordDifficulty) {
    if (wordDifficulty > myDifficulty) {
      res.toAdd.push(word);
    } else if (wordDifficulty < myDifficulty) { 
      res.toRemove.push(word);
    }
  });
  return res;
}

//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.getDifficulties) {
      var localDifficulties = {};
      var localSynonyms = {};
      var difficultiesNeeded = [];
      var synonymsNeeded = [];
      $.each(request.getDifficulties, function(idx, word) {
        if (cacheDifficulties[word]) {
           localDifficulties[word] = cacheDifficulties[word];
        }
        else {
            difficultiesNeeded.push(word);
        }
      });
      
      getDifficulties(difficultiesNeeded, function(res) {
        
        for (var attrname in res) { 
            localDifficulties[attrname] = res[attrname];
            cacheDifficulties[attrname] = res[attrname]; 
        }
        var toHighlight = calculateHighlight(localDifficulties);
        
        $.each(toHighlight.toAdd, function(idx, word) {
            if (cacheSynonyms[word]) {
               localSynonyms[word] = cacheSynonyms[word];
            }
            else {
                synonymsNeeded.push(word);
            }
        });
        getSynonyms(synonymsNeeded, function(synonym_res) {
            for (var attrname in synonym_res) { 
                localSynonyms[attrname] = synonym_res[attrname]; 
                cacheSynonyms[attrname] = synonym_res[attrname];
            }
            sendResponse({"difficulties": toHighlight, "synonyms": synonym_res});
        });
      });
    } else if (request.newDifficulty) {
        chrome.runtime.sendMessage(calculateHighlight(request.newDifficulty));
        myDifficulty = request.newDifficulty;
    } else if (request.init) {
        sendResponse();
	  }
    return true;
  });

// TODO openPopup
