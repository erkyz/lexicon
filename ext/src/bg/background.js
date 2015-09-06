var myDifficulty = 40;
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
            sendResponse({"difficulties": toHighlight, "synonyms": localSynonyms});
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

// TODO: change either word difficulty level or user's knowledge level to adjust
//   to feedback on false negatives or false positives
function updateKnowingness(info, tab) {
  return true;
};

// TODO: we want this to make a nice little tooltip popup. There doesn't seem to
//   be a nice way of doing this. The best way might just be to just overlay a
//   div using javascript.
function clickDefinition(info, tab) {
  var sText = info.selectionText;
  var url = "http://elo-lasers.azurewebsites.net/get_definition?word=" + sText;
  window.open(url, '_blank');
}

// add right-click events
chrome.contextMenus.create({title: "I know or don't know this word uhhhhhhhhh", contexts:["selection"], onclick: updateKnowingness});
chrome.contextMenus.create({title: "Look up definition", contexts:["selection"], onclick: clickDefinition});

// TODO openPopup
